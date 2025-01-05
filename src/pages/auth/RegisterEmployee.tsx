import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useAppDispatch from '../../hooks/useAppDispatch';
import { registerEmployee, validateRegister } from '../../services/authApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import axiosIns from '../../services/axiosIns';
import { set } from 'react-hook-form';

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retryPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetryPassword, setShowRetryPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const generateOTP = async (email) => {
    try {
      await axiosIns.post('/otp/generate', { email });
      console.log('OTP generated successfully');
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra password match
    if (formData.password !== formData.retryPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const result = await validateRegister(formData.username, formData.email);
    if (result.status === 400) {
      toast.error(result.data)
      return;
    }

    generateOTP(formData.email)

    // Chuyển tới trang OTP với formData và registrationType
    navigate('/otp', {
      state: {
        registrationType: 'employee', // hoặc có thể nhận từ props nếu form này được tái sử dụng
        formData: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          retryPassword: formData.retryPassword
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Đăng ký Người tìm việc
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="username"
              required
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-2">{usernameError}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Nhập email"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Nhập mật khẩu"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="retryPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showRetryPassword ? "text" : "password"}
                id="retryPassword"
                name="retryPassword"
                value={formData.retryPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Nhập lại mật khẩu"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowRetryPassword(!showRetryPassword)}
              >
                <FontAwesomeIcon
                  icon={showRetryPassword ? faEye : faEyeSlash}
                  className="text-gray-600"
                />
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Đăng ký
          </button>
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