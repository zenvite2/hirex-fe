// src/services/authService.ts

import axiosClient from '../api/axiosClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  role: 'employee' | 'employer';
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'employer';
}

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginCredentials) => {
    const response = await axiosClient.post<{ token: string; user: UserProfile }>('/auth/access', credentials);
    return response.data;
  },

  // Đăng ký
  register: async (userData: RegisterData) => {
    const response = await axiosClient.post<{ token: string; user: UserProfile }>('/auth/register', userData);
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    // Gọi API để invalidate token nếu cần
    await axiosClient.post('/auth/logout');
    // Xóa token khỏi local storage
    localStorage.removeItem('token');
  },

};

export default authService;