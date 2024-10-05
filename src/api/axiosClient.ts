// src/api/axiosClient.ts

import axios from 'axios';

const BASE_URL = 'https://localhost:8080'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Có thể thêm interceptor cho response nếu cần
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi global ở đây (ví dụ: refresh token, logout khi token hết hạn)
    return Promise.reject(error);
  }
);

export default axiosClient;