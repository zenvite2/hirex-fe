import { useState, useCallback, useRef, useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { cityList, districtList } from '../../services/autofillApi';
import { FormData, Location } from '../../components/registration/types';

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    gender: 'Nam',
    phone: '',
    company: '',
    workLocation: 0,
    district: 0
  });
  const dispatch = useAppDispatch();
 
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  }, [formData]);

  const handleSelectCity = useCallback((city: Location) => {
    setFormData((prevData) => ({ ...prevData, workLocation: city.id, district: 0 }));
    fetchDistricts('', city.id);
  }, []);

  const handleSelectDistrict = useCallback((district: Location) => {
    setFormData((prevData) => ({ ...prevData, district: district.id }));
  }, []);

  const fetchLocations = useCallback(async (
    name: string, 
    setter: React.Dispatch<React.SetStateAction<Location[]>>, 
    apiCall: any,
    cityId?: number
  ) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(async () => {
      try {
        const payload = cityId ? { name, cityIds: cityId } : { name };
        const result = await dispatch(apiCall(payload));
        const locationData = result?.payload?.response?.data || [];
        setter(locationData.map((location: { id: number, name: string }) => ({
          id: location.id,
          name: location.name
        })));
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }, 300);
  }, [dispatch]);

  const fetchCities = useCallback((name: string) => fetchLocations(name, setCities, cityList), [fetchLocations]);
  const fetchDistricts = useCallback((name: string, cityId: number) => 
    fetchLocations(name, setDistricts, districtList, cityId), [fetchLocations]);

  useEffect(() => {
    fetchCities('');
  }, [fetchCities]);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
  };
};