import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { login } from '../../services/authApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { isLoading } = useSelector((state: RootState) => state.loadingReducer);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const [sessionExp, setSessionExp] = useState(queryParams.get('expired') == null ? false : true);
  let toastId;

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: ''
    };

    if (!username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(startLoading());
    const result = await dispatch(login({ username: username.trim(), password }))
    dispatch(stopLoading());
    if (result?.payload?.response?.success == true) {
      if (result?.payload?.response?.data.role == 'EMPLOYEE') {
        navigate('/find-jobs');
      } else if (result?.payload?.response?.data.role == 'EMPLOYER') {
        navigate('/employer');
      } else if (result?.payload?.response?.data.role == 'ADMIN') {
        navigate('/cms/account-management');
      }
    }
    else {
      toast.error('Đã có lỗi xảy ra.');
    }
  }

  useEffect(() => {
    if (sessionExp) {
      toastId = toast.info("Phiên đăng nhập hết hạn.", { autoClose: false })
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [sessionExp]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-400 p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào Mừng Trở Lại</h2>
          <p className="text-gray-500">Vui lòng đăng nhập vào tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="group relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors(prev => ({ ...prev, username: '' }));
              }}
              placeholder="Tên đăng nhập"
              className={`w-full pl-10 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm absolute top-full mt-1">{errors.username}</p>
            )}
          </div>

          <div className="group relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="Mật khẩu"
              className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'} mt-2`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm absolute top-full mt-1">{errors.password}</p>
            )}
          </div>


          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 rounded text-blue-500 focus:ring-blue-400"
              />
            </div>
            <a href="#" className="text-blue-500 hover:underline">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Chưa có tài khoản? {' '}
            <Link to="/login">
            <a className="text-blue-500 hover:underline">
              Đăng nhập ngay
            </a>
          </Link>
          </p>
        </div>
      </div>
    </div>
  );

};

export default LoginPage;