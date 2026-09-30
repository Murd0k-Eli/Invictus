import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';


// Tell Axios to look for Django's default cookie and header names
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true, // Required for cookies/session tracking across different ports
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            `${apiUrl}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          const newAccessToken = response.data.access;
          localStorage.setItem(ACCESS_TOKEN, newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // No refresh token, try to exchange session for tokens
          try {
            const exchangeResponse = await api.get('/api/token/exchange/');
            const { access, refresh } = exchangeResponse.data;
            localStorage.setItem(ACCESS_TOKEN, access);
            localStorage.setItem(REFRESH_TOKEN, refresh);
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            return api(originalRequest);
          } catch (exchangeError) {
            console.error('Session exchange failed:', exchangeError);
            throw exchangeError;
          }
        }
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        // Handle refresh token failure (e.g., redirect to login)
      }
    }
    return Promise.reject(error);
  }
);

export default api;