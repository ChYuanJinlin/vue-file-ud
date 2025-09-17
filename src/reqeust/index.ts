import axios from 'axios';
import type { AxiosResponse,AxiosInstance } from 'axios';

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com', // 设置请求的基础URL
  timeout: 5000, // 设置请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: import('axios').InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如添加认证令牌
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      // 如果返回状态码为401，可能是未授权，可以在这里处理跳转到登录页面等逻辑
      console.error('Unauthorized access. Redirecting to login...');
      // window.location.href = '/login'; // 示例：跳转到登录页面
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;