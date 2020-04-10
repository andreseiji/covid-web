import axios from 'axios';
import { getToken, logout } from 'services/auth';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333'
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response && err.response.status === 401) {
      logout();
      Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default api;
