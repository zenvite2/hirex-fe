import axios, { AxiosInstance, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import authService from './authService';
import { toast } from 'react-toastify';

declare module 'axios' {
    interface AxiosRequestConfig {
        includeToken?: boolean;
    }
}

interface ApiConfig extends InternalAxiosRequestConfig {
    includeToken?: boolean;
}

const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosWsIns: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_WS_URL || 'https://localhost:8888',
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
                    return Promise.reject(new Error('No token saved. Cannot make API request.'));
                }
            }

            let logMessage = '========REQUEST========\n';
            logMessage += `baseUrl: ${config.baseURL}\n`;
            logMessage += `url: ${config.url}\n`;
            logMessage += `headers: ${JSON.stringify(config.headers, null, 2)}\n`;
            logMessage += `payload: ${config.data ? JSON.stringify(config.data, null, 2) : '{}'}\n`;
            // console.log(logMessage);
            return config;
        },
        (error) => {
            console.error(`Request Error:\n    ${error}`);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            let logMessage = '==============RESPONSE==============\n';
            logMessage += `statusCode: ${response.status}\n`;
            logMessage += `data: ${JSON.stringify(response.data, null, 2)}\n`;
            // console.log(logMessage);
            return response;
        },
        (error) => {
            let logMessage = '==============RESPONSE ERROR==============:\n';
            if (error.response) {
                logMessage += `status_code: ${error.response.status}\n`;
                logMessage += `message: ${JSON.stringify(error.response, null, 2)}\n`
                if (error.response.status === 401) {
                    authService.clearCredential();
                    window.location.href = '/login?expired=true';
                }
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
