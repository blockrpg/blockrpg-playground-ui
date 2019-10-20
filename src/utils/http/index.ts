import axios, {AxiosResponse, AxiosError} from 'axios';
import { MessageBox } from 'element-ui';

const onResponse = <T = any> (rsp: AxiosResponse): Promise<AxiosResponse<T>> => {
  if (rsp.status === 200) {
    const result = rsp.data;
    if (result &&
        !result.success &&
        result.message) {
      MessageBox({
        type: 'error',
        message: result.message,
      });
    }
    return Promise.resolve(result);
  } else {
    console.error('网络请求错误');
  }
  return Promise.reject(rsp);
};

const onResponseError = (err: AxiosError) => {
  if ((err.response as any).status === 401) {
    window.location.href = '/login';
  }
  return Promise.reject(err);
};

export const createAxios = () => {
  const config = {
    baseURL: '/api',
    withCredentials: true,
  };
  const http = axios.create(config);
  http.interceptors.response.use(onResponse, onResponseError);
  return http;
};

export const http = createAxios();
