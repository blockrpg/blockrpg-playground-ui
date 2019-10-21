<!--局部样式-->
<style scoped>
.smart-map {
  position: absolute;
}
.smart-map .map-grid {
  position: absolute;
  width: 32px;
  height: 32px;
  z-index: 1;
  border: solid 1px rgba(0, 0, 0, 0.2);
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div
    class="smart-map"
    :style="autoStyle">
    <div
      v-for="grid in grids"
      :key="grid.id"
      class="map-grid"
      :style="GetStyle(grid)">
    </div>
  </div>
</template>

<script>
import * as api from '@/api/mapBlock';
import { Password } from 'blockrpg-core/built/Password';
import { Point } from 'blockrpg-core/built/Point';
import { Space } from 'blockrpg-core/built/Space';
import { Rect } from 'blockrpg-core/built/Rect';

export default {
  name: 'smart-map',
  props: {
    // 传入的玩家位置
    playerPos: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
        };
      },
    },
  },
  data() {
    return {
      //#region 页面对象
      // 块缓存
      blockBuffer: {},
      //#endregion
      //#region 页面内容绑定数据
      grids: [],
      //#endregion
      //#region 页面样式绑定数据
      //#endregion
    };
  },
  watch: {
    // 监听玩家当前所处区块变化
    autoPlayerBlockPoint: {
      handler(nv, ov) {
        if (!ov || nv.Id !== ov.Id) {
          this.handleCurBlockChange(nv, !ov);
        }
      },
      immediate: true,
    },
    // 监听显示区域变化以更新具体的显示网格数据
    autoRenderRect: {
      handler(nv, ov) {
        // Top Push
        if (nv.Y1 < ov.Y1) {
          this.grids.push(
            ...this.readGridsFromBufferRect(Rect.FromTwoPoints(
              new Point(nv.X1, nv.Y1),
              new Point(ov.X2, ov.Y1 - 1),
            )),
          );
        }
        // Top Pop
        if (nv.Y1 > ov.Y1) {
          this.grids = this.grids.filter((grid) => grid.y >= nv.Y1);
        }
        // Bottom Pop
        if (nv.Y2 < ov.Y2) {
          this.grids = this.grids.filter((grid) => grid.y <= nv.Y2);
        }
        // Bottom Push
        if (nv.Y2 > ov.Y2) {
          this.grids.push(
            ...this.readGridsFromBufferRect(Rect.FromTwoPoints(
              new Point(ov.X1, ov.Y2 + 1),
              new Point(nv.X2, nv.Y2),
            )),
          );
        }
        // Left Push
        if (nv.X1 < ov.X1) {
          this.grids.push(
            ...this.readGridsFromBufferRect(Rect.FromTwoPoints(
              new Point(nv.X1, nv.Y1),
              new Point(ov.X1 - 1, ov.Y2),
            )),
          );
        }
        // Left Pop
        if (nv.X1 > ov.X1) {
          this.grids = this.grids.filter((grid) => grid.x >= nv.X1);
        }
        // Right Pop
        if (nv.X2 < ov.X2) {
          this.grids = this.grids.filter((grid) => grid.x <= nv.X2);
        }
        // Right Push
        if (nv.X2 > ov.X2) {
          this.grids.push(
            ...this.readGridsFromBufferRect(Rect.FromTwoPoints(
              new Point(ov.X2 + 1, ov.Y1),
              new Point(nv.X2, nv.Y2),
            )),
          );
        }
      },
    },
  },
  computed: {
    //#region 常量计算属性
    //#endregion
    //#region 数据转换计算属性
    //#endregion
    //#region 样式计算属性
    // 自动计算地图样式
    // 驱动地图整体平移
    autoStyle() {
      const style = {};
      let top = -8;
      let left = -8;
      top -= (this.playerPos.y - 3) * (32 / 5);
      left -= this.playerPos.x * (32 / 5);
      style['transform'] = `translate(${left}px, ${top}px)`;
      return style;
    },
    // 当前玩家所在的空间坐标点
    autoPlayerSpacePoint() {
      return new Point(this.playerPos.x, this.playerPos.y);
    },
    // 当前玩家所在的地图块的坐标点
    autoPlayerBlockPoint() {
      return Space.ToBlock(this.autoPlayerSpacePoint);
    },
    // 当前需要渲染的网格矩形范围
    autoRenderRect() {
      // 获取渲染空间范围
      const top = this.playerPos.y - 34;
      const bottom = this.playerPos.y + 28;
      const left = this.playerPos.x - 51;
      const right = this.playerPos.x + 51;
      // 转换为两个网格点
      const pt1 = Space.ToGrid(new Point(left, top));
      const pt2 = Space.ToGrid(new Point(right, bottom));
      // 构建范围矩形
      return Rect.FromTwoPoints(pt1, pt2);
    },
    //#endregion
  },
  methods: {
    //#region 页面事件方法
    // 玩家当前所处区块变化事件
    async handleCurBlockChange(nv, init = false) {
      // 生成附近区块九宫格
      const grids = nv.Nine;
      // 已经缓存的block的id
      const existingBlockIds = Object.keys(this.blockBuffer);
      // 需要从后端获取的block
      const newBlocks = grids.filter((grid) => existingBlockIds.every((eid) => eid !== grid.Id));
      // 如果有需要从后端更新的block
      if (newBlocks.length > 0) {
        const rect = Rect.FromPoints(newBlocks);
        // 从后端更新block
        await this.fetchBlocks(rect);
        // 如果是第一次更新缓存，则需要初始化地图界面
        if (init) {
          this.initMap();
        }
      }
    },
    //#endregion
    //#region 业务逻辑方法
    // 从后端获取block
    async fetchBlocks(rect) {
      const params = {
        x: rect.X,
        y: rect.Y,
        w: rect.Width,
        h: rect.Height,
        mapId: 'test',
      };
      const result = await api.queryRect(params);
      if (result.success) {
        const list = result.object || [];
        // 把获取的block写入缓存
        list.forEach((item) => {
          const key = `${item.x}~${item.y}`;
          this.blockBuffer[key] = item;
        });
      }
    },
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    //#endregion
    //#region 自动样式方法
    // 计算每一个网格的样式
    // 以0~0网格为基准，0~0网格的坐标为（320, 192）
    // 即10 * 32和6 * 32
    GetStyle(grid) {
      const style = {};
      const cx = 320;
      const cy = 192;
      style['transform'] = `translate(${cx + grid.x * 32}px, ${cy + grid.y * 32}px)`;
      // 获取地图资源的Id
      const resId = grid.resId;
      // 获取使用到的切图在地图之中的序号
      let resNum = grid.resNum || 0;
      // 还存在一种情况为空地图，所以序号计数从1开始
      if (resNum > 0) {
        resNum--;
        const mapY = Math.floor(resNum / 8);
        const mapX = Math.floor(resNum % 8);
        style['background'] = `
          url('/image/map/${resId}.png')
          no-repeat
          -${mapX * 32}px
          -${mapY * 32}px
        `;
      }
      return style;
    },
    //#endregion
    //#region 其他方法
    // 初始化地图
    initMap() {
      this.grids = this.readGridsFromBufferRect(this.autoRenderRect);
    },
    // 获取网格所属的Block坐标点和Block内偏移信息
    // 传入网格坐标点，返回Block点，Block内Point点，Block内偏移地址Offset
    getBlockCoordinate(gridPt) {
      const blockPt = Space.GridToBlock(gridPt);
      const fx = gridPt.X + 10;
      const fy = gridPt.Y + 6;
      let px = 0;
      if (fx >= 0) {
        px = fx % 21;
      } else {
        const afx = Math.abs(fx) - 1;
        px = 20 - (afx % 21);
      }
      let py = 0;
      if (fy >= 0) {
        py = fy % 13;
      } else {
        const afy = Math.abs(fy) - 1;
        py = 12 - (afy % 13);
      }
      const point = new Point(px, py);
      const offset = py * 21 + px;
      return {
        Block: blockPt,
        Point: point,
        Offset: offset,
      };
    },
    // 从缓存的区块中读取网格，这里传入的是网格坐标
    readGridFromBuffer(gridPt) {
      // 定义空白网格
      const BlankGrid = {
        pass: false,
        resId: 0,
        resNum: 0,
      };
      const info = this.getBlockCoordinate(gridPt);
      const result = ((this.blockBuffer[info.Block.Id] || {}).grids || [])[info.Offset] || BlankGrid;
      return result;
    },
    // 从缓存的区块中读取网格，这里传入的是空间坐标
    readGridFromBufferSpace(spacePt) {
      return this.readGridFromBuffer(Space.ToGrid(spacePt));
    },
    // 传入矩形对象，从缓存中读取多个网格（会添加坐标）
    readGridsFromBufferRect(rect) {
      const result = rect.Points.map((point) => {
        return {
          id: point.Id,
          x: point.X,
          y: point.Y,
          ...this.readGridFromBuffer(point),
        };
      });
      return result;
    },
    //#endregion
  },
  created() {},
  mounted() {},
  components: {},
};
</script>
