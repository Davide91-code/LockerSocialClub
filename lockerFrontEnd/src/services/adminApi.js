import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:8080/api/admin',
  timeout: 5000,
});

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
