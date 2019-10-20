import {http} from '@/utils/http';

// 地图块矩形查找
export const queryRect = (params: any) => {
  return http.post(`map/block/queryrect`, params);
};
