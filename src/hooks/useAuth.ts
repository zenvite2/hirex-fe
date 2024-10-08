import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { setAuth } from '../redux/slice/authSlice';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      
      const { accessToken, refreshToken, userId, role } = response.data;
      dispatch(setAuth({ accessToken, refreshToken, userId, role }));

      navigate(role === 'user' ? '/find-jobs' : '/employer');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};