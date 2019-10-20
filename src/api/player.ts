import {http} from '@/utils/http';

// 玩家注册
export const register = (params: any) => {
  return http.post(`login/player/register`, params);
};

// 玩家登录
export const login = (params: any) => {
  return http.post(`login/player/login`, params);
};
