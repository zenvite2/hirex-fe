import React from 'react';
import { useRegistrationForm } from './useRegistrationForm';
import { FormInput } from '../../components/registration/FormInput';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { registerEmployer } from '../../services/authApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';

const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    formData,
    handleInputChange,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
  } = useRegistrationForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      gender: formData.gender,
      phone: formData.phone,
      company: formData.company,
      workLocation: formData.workLocation,
      district: formData.district
    };

    dispatch(startLoading());
    const result = await dispatch(registerEmployer(submissionData));
    dispatch(stopLoading());

    if (result?.payload?.response?.success == true) {
      toast.success('Đăng ký thành công');
    } else {
      toast.error(result?.payload?.response?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-xl m-auto bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput name="username" label="Username" value={formData.username} onChange={handleInputChange} />
          <FormInput name="email" label="Email đăng nhập" type="email" value={formData.email} onChange={handleInputChange} />
          <FormInput name="password" label="Mật khẩu" type="password" value={formData.password} onChange={handleInputChange} />
          <FormInput name="confirmPassword" label="Xác nhận mật khẩu" type="password" value={formData.confirmPassword} onChange={handleInputChange} />

          <h3 className="text-base font-medium text-gray-900">Thông tin nhà tuyển dụng</h3>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="fullName" label="Họ và tên" value={formData.fullName} onChange={handleInputChange} />
            <div>
              <label className="block text-xs font-medium text-gray-700">Giới tính *</label>
              <div className="mt-1 space-x-4">
                {['Nam', 'Nữ'].map((gender) => (
                  <label key={gender} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleInputChange}
                      className="form-radio text-green-600"
                    />
                    <span className="ml-2 text-sm">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <FormInput name="phone" label="Số điện thoại cá nhân" type="tel" value={formData.phone} onChange={handleInputChange} />
          <FormInput name="company" label="Công ty" value={formData.company} onChange={handleInputChange} />

          <div className="grid grid-cols-2 gap-3">
            <LocationSelector
              label="Địa điểm làm việc"
              placeholder="Chọn tỉnh/thành phố"
              locations={cities}
              value={cities.find(city => city.id === formData.workLocation)?.name || ''}
              onChange={handleSelectCity}
              onSearch={fetchCities}
            />

            <LocationSelector
              label="Quận/huyện"
              placeholder="Chọn quận/huyện"
              locations={districts}
              value={districts.find(district => district.id === formData.district)?.name || ''}
              onChange={handleSelectDistrict}
              onSearch={(name) => fetchDistricts(name, formData.workLocation)}
              disabled={!formData.workLocation}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;