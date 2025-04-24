import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { useUserStore } from '@/stores/user';

// 定义接口返回数据的通用结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 小程序端适配器（基于 uni.request）
const uniAdapter = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: (config.baseURL || '') + config.url!,
      method: config.method?.toUpperCase() as any,
      data: config.data,
      header: config.headers,
      timeout: config.timeout,
      success: (res) => {
        resolve({
          data: res.data,
          status: res.statusCode,
          headers: res.header,
          config,
          statusText: 'OK',
        } as AxiosResponse);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

const config: AxiosRequestConfig = {
  baseURL:
    process.env.NODE_ENV === 'development' && !process.env.VUE_APP_PLATFORM?.includes('mp-weixin')
      ? '/api' // H5 开发环境使用代理
      : 'http://localhost:3000', // 小程序或生产环境使用完整地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
};

class Request {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    // 动态选择适配器
    // #ifdef MP-WEIXIN
    config.adapter = uniAdapter; // 小程序端使用 uni.request 适配器
    // #endif
    // #ifdef H5
    // H5 端使用 Axios 默认适配器（xhr 或 fetch），无需显式设置
    // #endif

    this.instance = axios.create(config);

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 在这里可以添加 token 等
        const userStore = useUserStore();
        if (userStore.token) {
          config.headers!.Authorization = `Bearer ${userStore.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 对响应数据做统一处理
        if (response.data.code !== 200) {
          uni.showToast({
            title: response.data.message || 'Error',
            icon: 'none',
            duration: 2000,
          });
          return Promise.reject(new Error(response.data.message || 'Error'));
        }
        return response.data.data;
      },
      (error) => {
        // 对响应错误做统一处理
        let message = '';
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              message = '请求错误';
              break;
            case 401:
              message = '未授权，请登录';
              // 跳转登录页面
              uni.navigateTo({ url: '/pages/login/index' });
              break;
            case 403:
              message = '拒绝访问';
              break;
            case 404:
              message = `请求地址出错: ${error.response.config.url}`;
              break;
            case 500:
              message = '服务器内部错误';
              break;
            default:
              message = `连接错误 ${error.response.status}`;
          }
        } else {
          message = '连接到服务器失败';
        }

        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000,
        });

        return Promise.reject(error);
      }
    );
  }

  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  public get<T = any>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params });
  }

  public post<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.post(url, data);
  }

  public put<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.put(url, data);
  }

  public delete<T = any>(url: string, params?: any): Promise<T> {
    return this.instance.delete(url, { params });
  }
}

export default new Request(config);