<!--局部样式-->
<style scoped>
.smart-map {

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
// import SocketIO from 'socket.io-client';
// const WSIO = SocketIO('http://localhost:3000');

// console.log(1);
// WSIO.emit('event', '服务端你好啊1');

// WSIO.on('connect', () => {
//   console.log('连接到服务器');
//   setInterval(() => {
//     console.log(2);
//     WSIO.emit('event', '服务端你好啊2');
//   }, 2000);
// });
// WSIO.on('event', (data) => {
//   console.log('接收到服务端消息', data);
// });
// WSIO.on('disconnect', () => {
//   console.log('断开连接');
// });

const BlankGrid = {
  pass: false,
  resId: 1,
  resNum: 0,
};

export default {
  name: 'smartMap',
  props: {
    // 玩家位置
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
    autoCurBlockXy: {
      handler(nv, ov) {
        if (!ov || nv.id !== ov.id) {
          this.handleCurBlockChange(nv, !ov);
        }
      },
      immediate: true,
    },
    autoRenderSize: {
      handler(nv, ov) {
        if (nv.top < ov.top) {
          this.grids.push(...this.readGridFromBufferSize(
            nv.left,
            nv.top,
            nv.right,
            ov.top - 1,
          ));
          // console.log('top push');
        }
        if (nv.top > ov.top) {
          this.grids = this.grids.filter(grid => grid.y >= nv.top);
          // console.log('top pop');
        }
        if (nv.bottom < ov.bottom) {
          this.grids = this.grids.filter(grid => grid.y <= nv.bottom);
          // console.log('bottom pop');
        }
        if (nv.bottom > ov.bottom) {
          this.grids.push(...this.readGridFromBufferSize(
            nv.left,
            ov.bottom + 1,
            nv.right,
            nv.bottom,
          ));
          // console.log('bottom push');
        }
        if (nv.left < ov.left) {
          this.grids.push(...this.readGridFromBufferSize(
            nv.left,
            nv.top,
            ov.left - 1,
            nv.bottom,
          ));
          // console.log('left push');
        }
        if (nv.left > ov.left) {
          this.grids = this.grids.filter(grid => grid.x >= nv.left);
          // console.log('left pop');
        }
        if (nv.right < ov.right) {
          this.grids = this.grids.filter(grid => grid.x <= nv.right);
          // console.log('right pop');
        }
        if (nv.right > ov.right) {
          this.grids.push(...this.readGridFromBufferSize(
            ov.right + 1,
            nv.top,
            nv.right,
            nv.bottom,
          ));
          // console.log('right push');
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
    // 自动计算地图样式，驱动地图卷轴式平移
    autoStyle() {
      let style = {};
      let top = -8;
      let left = -8;
      top -= (this.playerPos.y - 3) * (32 / 5);
      left -= this.playerPos.x * (32 / 5);
      style['margin-top'] = `${top}px`;
      style['margin-left'] = `${left}px`;
      return style;
    },
    // 自动计算当前玩家所在的区块坐标
    autoCurBlockXy() {
      return this.getBlockSpace(this.playerPos.x, this.playerPos.y);
    },
    // 自动计算渲染网格范围
    autoRenderSize() {
      let result = {};
      // 获取渲染空间范围
      const top = this.playerPos.y - 34;
      const bottom = this.playerPos.y + 28;
      const left = this.playerPos.x - 51;
      const right = this.playerPos.x + 51;
      result.top = Math.floor((top + 2) / 5);
      result.bottom = Math.floor((bottom + 2) / 5);
      result.left = Math.floor((left + 2) / 5);
      result.right = Math.floor((right + 2) / 5);
      return result;
    },
    // 显示的地图网格
    autoGrids() {
      const opx = this.autoRenderSize.left;
      const opy = this.autoRenderSize.top;
      const width = this.autoRenderSize.right - this.autoRenderSize.left + 1;
      const height = this.autoRenderSize.bottom - this.autoRenderSize.top + 1;
      const grids = [];
      for (let i = 0; i < height; ++i) {
        const y = opy + i;
        for (let j = 0; j < width; ++j) {
          const x = opx + j;
          grids.push({
            x: x,
            y: y,
            ...this.readGridFromBuffer(x, y),
          });
        }
      }
      return grids;
    },
    //#endregion
  },
  methods: {
    //#region 页面事件方法
    // 玩家当前所处区块变化事件
    async handleCurBlockChange(nv, init = false) {
      // 生成附近区块九宫格
      const grids = this.nineGrids(nv.x, nv.y);
      // 已经缓存的block的id
      const existingBlockIds = Object.keys(this.blockBuffer);
      // 需要从后端获取的block
      const newBlocks = grids.filter(grid => existingBlockIds.every(eid => eid !== grid.id));
      // 如果有需要从后端更新的block
      if (newBlocks.length > 0) {
        // 智能生成更新矩形
        const rect = this.catchRect(newBlocks);
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
    // 初始化地图
    initMap() {
      const size = this.autoRenderSize;
      this.grids = this.readGridFromBufferSize(
        size.left,
        size.top,
        size.right,
        size.bottom,
      );
    },
    // 传入xy获取周围的九宫格块坐标
    nineGrids(x, y) {
      const px = x - 1;
      const py = y - 1;
      let grids = [];
      for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
          grids.push({
            id: `${px + j}~${py + i}`,
            x: px + j,
            y: py + i,
          });
        }
      }
      return grids;
    },
    // 矩形捕捉器
    catchRect(blocks) {
      const minX = Math.min(...blocks.map(item => item.x));
      const maxX = Math.max(...blocks.map(item => item.x));
      const minY = Math.min(...blocks.map(item => item.y));
      const maxY = Math.max(...blocks.map(item => item.y));
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      return {
        x: minX,
        y: minY,
        w: width,
        h: height,
      };
    },
    // 传入网格坐标获取网格所属的block信息
    getBlock(x, y) {
      const bx = Math.floor((x + 10) / 21);
      const by = Math.floor((y + 6) / 13);
      return {
        id: `${bx}~${by}`,
        x: bx,
        y: by,
      };
    },
    // 传入空间坐标获取所属的block信息
    getBlockSpace(x, y) {
      const coordinate = this.getGridCoordinate(x, y);
      return this.getBlock(coordinate.x, coordinate.y);
    },
    // 传入网格坐标获取该网格对应的block信息以及其内坐标，偏移
    getBlockCoordinate(x, y) {
      const fx = x + 10;
      const fy = y + 6;
      const bx = Math.floor(fx / 21);
      const by = Math.floor(fy / 13);
      const blockId = `${bx}~${by}`;
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
      const offset = py * 21 + px;
      return {
        id: blockId,
        x: bx,
        y: by,
        px: px,
        py: py,
        offset: offset,
      };
    },
    // 传入空间坐标获取对应的block信息以及其内坐标，偏移
    getBlockCoordinateSpace(x, y) {
      const coordinate = this.getGridCoordinate(x, y);
      return this.getBlockCoordinate(coordinate.x, coordinate.y);
    },
    // 从缓存的区块中读取网格，这里传入的是网格坐标
    readGridFromBuffer(x, y) {
      const info = this.getBlockCoordinate(x, y);
      const result = ((this.blockBuffer[info.id] || {}).grids || [])[info.offset] || BlankGrid;
      return result;
    },
    // 从缓存的区块中读取网格，这里传入的是空间坐标
    readGridFromBufferSpace(x, y) {
      const coordinate = this.getGridCoordinate(x, y);
      return this.readGridFromBuffer(coordinate.x, coordinate.y);
    },
    // 传入网格坐标矩形范围，从区块缓存中读取多个网格（会添加坐标）
    readGridFromBufferRect(x, y, w, h) {
      const result = [];
      for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
          const px = x + j;
          const py = y + i;
          result.push({
            id: `${px}~${py}`,
            x: px,
            y: py,
            ...this.readGridFromBuffer(px, py)
          });
        }
      }
      return result;
    },
    // 传入网格坐标范围，从区块缓存中读取多个网格（会添加坐标）
    readGridFromBufferSize(x1, y1, x2, y2) {
      const width = x2 - x1 + 1;
      const height = y2 - y1 + 1;
      if (width > 0 && height > 0) {
        return this.readGridFromBufferRect(x1, y1, width, height);
      } else {
        return [];
      }
    },
    //#endregion
    //#region 接口访问方法
    // 从后端获取block
    async fetchBlocks(rect) {
      let params = {
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        mapId: '1',
      };
      let result = await api.queryRect(params);
      if (result.success) {
        const list = result.object || [];
        // 把获取的block写入缓存
        list.forEach(item => {
          const key = `${item.x}~${item.y}`;
          this.blockBuffer[key] = item;
        });
      }
    },
    //#endregion
    //#region 数据转换方法
    // 空间坐标变换为网格坐标
    getGridCoordinate(x, y) {
      return {
        x: Math.floor((x + 2) / 5),
        y: Math.floor((y + 2) / 5),
      };
    },
    //#endregion
    //#region 自动样式方法
    // 计算地图网格样式
    GetStyle(grid) {
      let style = {};
      const cx = 320;
      const cy = 192;
      style['transform'] = `translate(${cx + grid.x * 32}px, ${cy + grid.y * 32}px)`;
      let mapId = grid.resNum || 0;
      if (mapId > 0) {
        mapId--;
        const mapY = Math.floor(mapId / 8);
        const mapX = Math.floor(mapId % 8);
        style['background'] = `
          url('/image/map/0.png')
          no-repeat
          -${mapX * 32}px
          -${mapY * 32}px
        `;
      }
      return style;
    }
    //#endregion
    //#region 其他方法
    //#endregion
  },
  created() {},
  mounted() {},
  components: {},
};
</script>
