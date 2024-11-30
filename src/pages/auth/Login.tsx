import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { login } from '../../services/authApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import bannerLogin from '../../assets/banner-login.jpg';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const LoginPage = () => {
  const { isLoading } = useSelector((state: RootState) => state.loadingReducer);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const [sessionExp, setSessionExp] = useState(queryParams.get('expired') == null ? false : true);
  let toastId;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto flex w-3/4 max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="relative w-1/2 bg-gradient-to-br from-emerald-500 to-blue-950 p-8 text-white">
          <img
            src={bannerLogin}
            alt="Mô tả ảnh"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 p-8 bg-white shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Đăng nhập</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="text-sm text-gray-700">Hiển thị mật khẩu</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          {/* <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">hoặc</span>
          </div> */}
          {/* <button className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <GoogleIcon />
            <span className="ml-2">Tiếp tục với Google</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;