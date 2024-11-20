import { useState, useCallback, useRef, useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { cityList, districtList } from '../../services/autofillApi';

interface Location {
  id: number;
  name: string;
}

export const useLocationSelector = () => {
  const [city, setCity] = useState<Location | null>(null);
  const [district, setDistrict] = useState<Location | null>(null);
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const dispatch = useAppDispatch();
  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  const fetchLocations = useCallback(async (
    name: string, 
    setter: React.Dispatch<React.SetStateAction<Location[]>>, 
    apiCall: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    cityId?: number
  ) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const payload = cityId !== undefined ? { name, cityIds: cityId } : { name };
        const result = await dispatch(apiCall(payload));
        const locationData = result?.payload?.response?.data || [];
        setter(locationData.map((location: { id: number, name: string }) => ({
          id: location.id,
          name: location.name
        })));
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [dispatch]);

  const fetchCities = useCallback((name: string) => 
    fetchLocations(name, setCities, cityList, setIsLoadingCities), [fetchLocations]);

  const fetchDistricts = useCallback((name: string, cityId: number) => 
    fetchLocations(name, setDistricts, districtList, setIsLoadingDistricts, cityId), [fetchLocations]);

  const handleSelectCity = useCallback((selectedCity: Location | null) => {
    setCity(selectedCity);
    setDistrict(null);
    setDistricts([]);
    if (selectedCity) {
      fetchDistricts('', selectedCity.id);
    }
  }, [fetchDistricts]);

  const handleSelectDistrict = useCallback((selectedDistrict: Location | null) => {
    setDistrict(selectedDistrict);
  }, []);

  const resetLocations = useCallback(() => {
    setCity(null);
    setDistrict(null);
    setDistricts([]);
    fetchCities('');
  }, [fetchCities]);

  // Di chuyển setCityFromId và setDistrictFromId xuống sau khi đã khai báo fetchDistricts
  const setCityFromId = useCallback(async (cityId: number) => {
    try {
      const result = await dispatch(cityList({ name: '' }));
      const cityData = result?.payload?.response?.data?.find((city: any) => city.id === cityId);
      if (cityData) {
        const cityLocation: Location = {
          id: cityData.id,
          name: cityData.name
        };
        setCity(cityLocation);
        await fetchDistricts('', cityId);
      }
    } catch (error) {
      console.error('Error fetching city by id:', error);
    }
  }, [dispatch, fetchDistricts]);

  const setDistrictFromId = useCallback(async (districtId: number, cityId: number) => {
    try {
      const result = await dispatch(districtList({ 
        name: '',
        cityIds: cityId 
      }));
      const districtData = result?.payload?.response?.data?.find((district: any) => district.id === districtId);
      if (districtData) {
        const districtLocation: Location = {
          id: districtData.id,
          name: districtData.name
        };
        setDistrict(districtLocation);
      }
    } catch (error) {
      console.error('Error fetching district by id:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCities('');
  }, [fetchCities]);

  return {
    city,
    district,
    cities,
    districts,
    isLoadingCities,
    isLoadingDistricts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
    resetLocations,
    setCityFromId,
    setDistrictFromId
  };
};