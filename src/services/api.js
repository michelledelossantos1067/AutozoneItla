import axios from 'axios';

const api = axios.create({
  baseURL: 'https://taller-itla.ia3x.com/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor
api.interceptors.request.use(config => {
  const token = "TU_TOKEN_AQUI";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
