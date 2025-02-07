import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { useLocationSelector } from './useLocationSelector';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { updateCompany, getCompany } from '../../services/companyApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

interface CompanyInfo {
  companyName: string;
  address: string;
  city: number | null;
  district: number | null;
  scale: number | null;
  website?: string;
  logo?: File;
  logoUrl: string,
  bannerUrl?: string;
  banner?: File;
  description?: string;
}

const CompanyInfoForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState<CompanyInfo>({
    companyName: '',
    address: '',
    city: null,
    district: null,
    scale: null,
    website: '',
    logoUrl: '',
    bannerUrl: '',
    description: ''
  });

  const {
    city,
    district,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
    setCityFromId,
    setDistrictFromId
  } = useLocationSelector();

  const [selectedFile, setSelectedFile] = React.useState<string>('');
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const [selectedBannerFile, setSelectedBannerFile] = React.useState<string>('');
  const [previewBannerUrl, setPreviewBannerUrl] = React.useState<string>('');
  const [bannerFile, setBannerFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedBannerFile(file.name);
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setPreviewBannerUrl(url);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (previewBannerUrl) {
        URL.revokeObjectURL(previewBannerUrl);
      }
    };
  }, [previewUrl, previewBannerUrl]);


  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const action = await dispatch(getCompany());
        if (getCompany.fulfilled.match(action)) {
          const companyData = action.payload.response?.data;
          if (companyData) {
            setFormData({
              ...companyData
            });

            if (companyData.city) {
              dispatch(startLoading());
              await setCityFromId(companyData.city);
              if (companyData.district) {
                await setDistrictFromId(companyData.district, companyData.city);
              }
              dispatch(stopLoading());
            }

          }
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [dispatch]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append('companyName', formData.companyName);
    submitFormData.append('address', formData.address);

    if (formData.city !== null) {
      submitFormData.append('city', formData.city.toString()); // Convert number to string
    }

    if (formData.district !== null) {
      submitFormData.append('district', formData.district.toString()); // Convert number to string
    }

    if (formData.website) submitFormData.append('website', formData.website);
    if (formData.description) submitFormData.append('description', formData.description);
    if (logoFile) submitFormData.append('logo', logoFile);
    if (bannerFile) submitFormData.append('banner', bannerFile);
    if (formData.scale) submitFormData.append('scale', formData.scale.toString());

    dispatch(startLoading());
    const result = await dispatch(updateCompany(submitFormData));
    if (result?.payload?.response?.success === true) {
      toast.success('Cập nhật thông tin công ty thành công');
    } else {
      toast.error('Cập nhật thông tin công ty thất bại');
    }
    dispatch(stopLoading());
  };
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        Cập nhật thông tin công ty
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pasal"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="headquarters" className="block mb-1 font-medium">
              Trụ sở chính <span className="text-red-500">*</span>
            </label>
            <input
              id="headquarters"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Số 206 Bạch Mai, Hai Bà Trưng, Hà Nội"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationSelector
              label="Tỉnh / TP"
              placeholder="Chọn tỉnh thành"
              locations={cities}
              value={city?.name || ''}
              onChange={(selectedCity) => {
                handleSelectCity(selectedCity);
                setFormData(prev => ({
                  ...prev,
                  city: selectedCity?.id || null,
                  district: null
                }));
              }}
              onSearch={fetchCities}
              disabled={false}
            />

            <LocationSelector
              label="Quận / Huyện"
              placeholder="Chọn quận huyện"
              locations={districts}
              value={district?.name || ''}
              onChange={(selectedDistrict) => {
                handleSelectDistrict(selectedDistrict);
                setFormData(prev => ({
                  ...prev,
                  district: selectedDistrict?.id || null
                }));
              }}
              onSearch={(query) => fetchDistricts(query, city?.id || 0)}
              disabled={!city}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block mb-1 font-medium">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="companySize" className="block mb-1 font-medium">
                Quy mô công ty
              </label>
              <input
                id="scale"
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số lượng nhân viên"
                value={formData.scale || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  scale: e.target.value ? parseInt(e.target.value) : null
                })}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Logo</label>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Company logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  Chọn tệp
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {selectedFile || 'Không có tệp nào được chọn'}
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Banner</label>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
              <div className="w-96 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
              {previewBannerUrl ? (
                    <img
                      src={previewBannerUrl}
                      alt="Banner preview"
                      className="max-w-full max-h-full object-cover"
                    />
                  ) : formData.bannerUrl ? (
                    <img
                      src={formData.bannerUrl}
                      alt="Company banner"
                      className="max-w-full max-h-full object-cover"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="banner-upload"
                  onChange={handleBannerFileChange}
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  Chọn tệp
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {selectedBannerFile || 'Không có tệp nào được chọn'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Mô tả
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả về công ty của bạn..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoForm;