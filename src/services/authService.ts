import axiosClient from '../api/axiosClient';


export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/access', credentials);
    return response.data; 
  },
};

export default authService;
