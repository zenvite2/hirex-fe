import React, { useEffect, useState } from 'react';
import { useRegistrationForm } from './useRegistrationForm';
import { FormInput } from '../../components/registration/FormInput';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { registerEmployer } from '../../services/authApi';
import { getListCompany } from '../../services/companyApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import axiosIns from '../../services/axiosIns';

interface Company {
  id: number;
  name: string;
}

const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();

  const generateOTP = async (email) => {
    try {
      await axiosIns.post('/otp/generate', { email });
      console.log('OTP generated successfully');
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };
  

  const {
    formData,
    setFormData,
    handleInputChange,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
  } = useRegistrationForm();

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Update filtered companies when search term changes
  useEffect(() => {
    const filtered = companies
      .filter(company =>
        company &&
        company.name &&
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('company-dropdown');
      const input = document.getElementById('company-input');
      if (dropdown && input &&
        !dropdown.contains(event.target as Node) &&
        !input.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCompanies = async () => {
    try {
      const result = await dispatch(getListCompany());
      if (result?.payload?.response?.data) {
        const validCompanies = result.payload.response.data.map((company: any) => ({
          id: company.id,
          name: company.companyName
        }));
        setCompanies(validCompanies);
        setFilteredCompanies(validCompanies.slice(0, 5)); // Show first 5 companies initially
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
      setFilteredCompanies([]);
    }
  };

  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCompanyId(null);
    setFormData(prev => ({
      ...prev,
      company: value
    }));
    setShowCompanyDropdown(true);
  };

  const handleCompanySelect = (company: Company) => {
    if (company && company.name) {
      setFormData(prev => ({
        ...prev,
        company: company.name
      }));
      setSelectedCompanyId(company.id);
      setSearchTerm(company.name);
      setShowCompanyDropdown(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const submissionData = {
  //     username: formData.username,
  //     email: formData.email,
  //     password: formData.password,
  //     retryPassword: formData.confirmPassword,
  //     fullName: formData.fullName,
  //     gender: formData.gender,
  //     phoneNumber: formData.phone,
  //     nameCompany: formData.company,
  //     companyId: selectedCompanyId, // Include company ID if selected
  //     city: formData.workLocation,
  //     district: formData.district
  //   };

  //   // Remove companyId if it's null (when company wasn't selected from dropdown)
  //   if (submissionData.companyId === null) {
  //     delete submissionData.companyId;
  //   }

  //   dispatch(startLoading());
  //   try {
  //     const result = await dispatch(registerEmployer(submissionData));
  //     if (result?.payload?.response?.success === true) {
  //       toast.success('Đăng ký thành công');
  //     } else {
  //       toast.error('Đăng ký thất bại');
  //     }
  //   } catch (error) {
  //     toast.error('Có lỗi xảy ra khi đăng ký');
  //   } finally {
  //     dispatch(stopLoading());
  //   }
  // };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      companyId: selectedCompanyId,
    };
    if (!selectedCompanyId) delete submissionData.companyId;

    generateOTP(submissionData.email)

    // Navigate to OTP page with state
    navigate('/otp', { state: { registrationType: 'employer', formData: submissionData } });
  };

  const toggleDropdown = () => {
    setShowCompanyDropdown(!showCompanyDropdown);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-xl m-auto bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Information Section */}
          <div className="space-y-4">
            <FormInput
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <FormInput
              name="email"
              label="Email đăng nhập"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormInput
              name="password"
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FormInput
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Employer Information Section */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">Thông tin nhà tuyển dụng</h3>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
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
                        className="form-radio text-blue-600"
                        required
                      />
                      <span className="ml-2 text-sm">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <FormInput
              name="phone"
              label="Số điện thoại cá nhân"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            {/* Company Selection */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700">
                Công ty * {selectedCompanyId && <span className="text-green-600 text-xs">(Đã chọn từ danh sách)</span>}
              </label>
              <div className="mt-1 relative">
                <input
                  id="company-input"
                  type="text"
                  value={searchTerm}
                  onChange={handleCompanySearch}
                  onFocus={() => setShowCompanyDropdown(true)}
                  onClick={() => setShowCompanyDropdown(true)}
                  className={`w-full rounded-md border ${selectedCompanyId ? 'border-green-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Nhập hoặc chọn tên công ty"
                  required
                />

                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {showCompanyDropdown && filteredCompanies.length > 0 && (
                <div
                  id="company-dropdown"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredCompanies.map((company, index) => (
                    <div
                      key={company.id || index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleCompanySelect(company)}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Selection */}
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
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Bạn đã có tài khoản?{' '}
          <Link to="/login">
            <a className="text-blue-500 hover:text-blue-600">
              Đăng nhập ngay
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;