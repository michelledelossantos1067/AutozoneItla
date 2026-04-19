import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://taller-itla.ia3x.com/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use(
    async config => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (_) { }
        return config;
    },
    error => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

apiClient.interceptors.response.use(
    res => res,
    async error => {
        const orig = error.config;

        if (error.response?.status === 401 && !orig._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
                    .then(token => { orig.headers.Authorization = `Bearer ${token}`; return apiClient(orig); });
            }

            orig._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                const payload = data?.data ?? data ?? {};
                const newToken = payload?.token ?? payload?.accessToken;
                const newRefreshToken = payload?.refreshToken ?? payload?.refresh_token ?? payload?.refreshtoken ?? refreshToken;

                if (!newToken) {
                    throw new Error('Refresh response no incluyó token');
                }

                await SecureStore.setItemAsync('token', newToken);
                if (newRefreshToken) {
                    await SecureStore.setItemAsync('refreshToken', newRefreshToken);
                }

                processQueue(null, newToken);
                orig.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(orig);
            } catch (err) {
                processQueue(err, null);
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('refreshToken');
                await SecureStore.deleteItemAsync('usuario');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
