import axios from 'axios';

const apiHost = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const baseURL = apiHost ? `${apiHost}/api` : '/api';
const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
