import axios from 'axios';
import config from '../config.js';


class AxiosService {
    constructor() {

        this.axiosInstance = axios.create({
            withCredentials: true
        });
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Добавляем интерсептор для запросов
        this.axiosInstance.interceptors.request.use(config => {
            const token = localStorage.getItem('tokenFBR');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            console.log("ВЫВОДИТСЯ НА СЛУЧАЙ ОШИБКИ 0");
            return config;
        }, error => {
            return Promise.reject(error);
        });

        // Интерсептор для ответов
        this.axiosInstance.interceptors.response.use(response => {
            // Если ответ успешный (код 200), просто пропускаем его
            return response;
        }, async error => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const response = await axios.get(`${config.apiUrl}/refresh`, { withCredentials: true });

                    const newToken = response.data.accessToken;
                    localStorage.setItem('tokenFBR', newToken);

                    // Обновляем токен в оригинальном запросе и повторяем его
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return this.axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Если запрос обновления токена также завершился ошибкой
                    console.error('Не удалось обновить токен:', refreshError);
                
                    document.querySelector('.fbr-login-modal').style.display = 'flex';
                    document.querySelector('.fbr-login-modal').style.setProperty('display', 'flex', 'important');

                    return Promise.reject(refreshError);
                }
            }

            if (error.response && error.response.status === 401) {

                document.querySelector('.fbr-login-modal').style.display = 'flex';
                document.querySelector('.fbr-login-modal').style.setProperty('display', 'flex', 'important');

            }
            console.log("ВЫВОДИТСЯ НА СЛУЧАЙ ОШИБКИ 2");
            return Promise.reject(error);
        });
    }

    getInstance() {
        return this.axiosInstance;
    }
}

// Создаем и экспортируем экземпляр AxiosService
const axiosService = new AxiosService();
export default axiosService.getInstance();
