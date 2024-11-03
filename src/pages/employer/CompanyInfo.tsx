import React from 'react';
import { Image } from 'lucide-react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { useLocationSelector } from './useLocationSelector';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { updateCompany } from '../../services/companyApi';

interface CompanyInfo {
  companyName: string;
  address: string;
  city: number | null;
  district: number | null;
  companySize: string;
  website?: string;
  logo?: File;
  description?: string;
}

const CompanyInfoForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState<CompanyInfo>({
    companyName: '',
    address: '',
    city: null,
    district: null,
    companySize: '',
    website: '',
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
    fetchDistricts
  } = useLocationSelector();

  const [selectedFile, setSelectedFile] = React.useState<string>('');
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    if (formData.companySize) submitFormData.append('companySize', formData.companySize);

    const result = await dispatch(updateCompany(submitFormData));
    if (result?.payload?.response?.success === true) {
      toast.success('Cập nhật thông tin công ty thành công');
    } else {
      toast.error('Cập nhật thông tin công ty thất bại');
    }
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
              <select
                id="companySize"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              >
                <option value="">Chọn quy mô</option>
                <option value="1-10">1-10 nhân viên</option>
                <option value="11-50">11-50 nhân viên</option>
                <option value="51-200">51-200 nhân viên</option>
                <option value="201-500">201-500 nhân viên</option>
                <option value="501-1000">501-1000 nhân viên</option>
                <option value="1000+">1000+ nhân viên</option>
              </select>
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