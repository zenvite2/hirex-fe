import axios, { AxiosInstance, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import authService from './authService';

declare module 'axios' {
    interface AxiosRequestConfig {
        includeToken?: boolean;
    }
}

interface ApiConfig extends InternalAxiosRequestConfig {
    includeToken?: boolean;
}

const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosWsIns: AxiosInstance = axios.create({
    baseURL: process.env.BASE_WS_URL || 'https://localhost:8888',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const addInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: ApiConfig) => {
            const headers = config.headers as AxiosRequestHeaders;

            if (config.includeToken) {
                const token = authService.getAccessToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                } else {
                    console.error('No token saved.');
                }
            }

            // Log request details
            let logMessage = '========REQUEST========\n';
            logMessage += `url: ${config.url}\n`;
            logMessage += `headers: ${JSON.stringify(config.headers, null, 2)}\n`;
            logMessage += `payload: ${config.data ? JSON.stringify(config.data, null, 2) : '{}'}\n`;

            console.log(logMessage);

            return config;
        },
        (error) => {
            console.error(`Request Error:\n    ${error}`);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            let logMessage = '=========RESPONSE========\n';
            logMessage += `statusCode: ${response.status}\n`;
            logMessage += `data: ${JSON.stringify(response.data, null, 2)}\n`;
            console.log(logMessage);
            return response;
        },
        (error) => {
            let logMessage = '==============RESPONSE ERROR===========:\n';
            if (error.response) {
                logMessage += `status code: ${error.response.status}\n`;
                logMessage += `data: ${JSON.stringify(error.response.data, null, 2)}\n`;
            } else {
                logMessage += `Error: ${error.message}\n`;
            }

            console.error(logMessage);
            return Promise.reject(error);
        }
    );
};

addInterceptors(axiosIns);
addInterceptors(axiosWsIns);

export default axiosIns;
export { axiosWsIns }; 
