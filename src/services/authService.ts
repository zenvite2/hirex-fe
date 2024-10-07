// src/services/authService.ts
import axiosClient from '../api/axiosClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginCredentials) => {
    // Call the login API, assuming it only needs email and password
    const response = await axiosClient.post('/auth/access', credentials);
    // Return response data (modify this if there's more in the response)
    return response.data; // Expecting just a success or status message here
  },

  // Đăng ký
  register: async (userData: any) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    await axiosClient.post('/auth/logout');
    localStorage.removeItem('token');  // Remove the token (if still applicable)
  },
};

export default authService;
