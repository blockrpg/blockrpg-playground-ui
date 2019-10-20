import axios, {AxiosResponse} from 'axios';
import { MessageBox } from 'element-ui';

const onResponse = <T = any> (rsp: AxiosResponse): Promise<AxiosResponse<T>> => {
  if (rsp.data && rsp.data.code === 200) {
    if (rsp.data.message) {
      const message = rsp.data.message;
      if (!rsp.data.success && message) {
        MessageBox({
          type: 'error',
          message,
        });
      }
    }
    return Promise.resolve(rsp.data);
  } else {
    console.error('网络请求错误');
  }
  return Promise.reject(rsp);
};

export const createAxios = () => {
  const config = {
    baseURL: '/api',
    withCredentials: true,
  };
  const http = axios.create(config);
  http.interceptors.response.use(onResponse);
  return http;
};

export const http = createAxios();
