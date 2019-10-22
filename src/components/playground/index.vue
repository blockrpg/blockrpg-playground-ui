<!--局部样式-->
<style scoped>
.playground {
  box-sizing: content-box;
  position: relative;
  width: 656px;
  height: 400px;
  border: solid 1px #333;
  border-radius: 1px;
  background-color: #eee;
  overflow: hidden;
}
.pos-span {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  border: solid 1px #333;
  padding: 0px 4px 0px 4px;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div class="playground">
    <template v-if="ready">
      <smartMap
        ref="smtMap"
        :playerPos="{
          x: player.x,
          y: player.y,
        }"
      />
      <player
        :nickname="playerName"
        :imgid="playerImage"
        v-model="player"
        :legal="moveLegal"
      />
      <actor
        v-for="actor in autoActors"
        :key="actor.account"
        :name="actor.name"
        :imgid="actor.image"
        :dir="actor.dir"
        :ges="actor.ges"
        :style="actorStyle(actor)">
      </actor>
      <span
        class="pos-span">
        {{`x:${player.x} y:${player.y}`}}
      </span>
      <pocket
      />
    </template>
  </div>
</template>

<script>
// viewport是在20 11的原型上+16px
// 所得出 656 368
// block 为 41 31 四边多余大约10，奇数中心
// 一次性生成的dom也是41 31
// 20 * 32 + 16 = 656
// 11 * 32 + 16 = 368
import actor from '@/components/actor';
import player from '@/components/player';
import pocket from '@/components/pocket';
import smartMap from '@/components/smartMap';
import { Point } from 'blockrpg-core/built/Point';
import * as APIPlayer from '@/api/player';

import SocketIOClient from 'socket.io-client';

export default {
  name: 'viewport',
  props: {},
  data() {
    return {
      //#region 页面对象
      ready: false,
      // SocketIO客户端
      socket: null,
      //#endregion
      //#region 页面内容绑定数据
      playerName: '',
      playerImage: 0,
      player: {},
      // 保存其他玩家集合
      actors: {},
      //#endregion
      //#region 页面样式绑定数据
      //#endregion
    };
  },
  watch: {
    player: {
      handler(nv, ov) {
        this.socket.emit('roam', {
          x: nv.x,
          y: nv.y,
          dir: nv.dir,
          ges: nv.ges,
        });
        console.log(nv);
      },
    },
    autoActors: {
      handler(nv) {
        console.log(nv);
      }
    },
  },
  computed: {
    //#region 常量计算属性
    //#endregion
    //#region 数据转换计算属性
    autoActors() {
      return Object.values(this.actors).filter(actor => actor.name !== this.playerName);
    }
    //#endregion
    //#region 样式计算属性
    //#endregion
  },
  methods: {
    //#region 页面事件方法
    //#endregion
    //#region 业务逻辑方法
    // 获取玩家的信息
    async getPlayerInfo() {
      const result = await APIPlayer.curInfo();
      if (result.success) {
        const info = result.object;
        this.playerName = info.name;
        this.playerImage = Number(info.image);
        this.player = {
          x: info.x,
          y: info.y,
          dir: info.dir,
          ges: info.ges,
        };
        this.ready = true;
      }
    },
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    //#endregion
    //#region 自动样式方法
    actorStyle(other) {
      const baseTop = 176;
      const baseLeft = 312;
      const style = {};
      style.transform = `translate(
        ${baseLeft + (other.x - this.player.x) * (32.0 / 5)}px,
        ${baseTop + (other.y - this.player.y) * (32.0 / 5)}px
      )`;
      return style;
    },
    //#endregion
    //#region 其他方法
    moveLegal(pos) {
      const grid = this.$refs.smtMap.readGridFromBufferSpace(new Point(pos.x, pos.y));
      return grid.pass;
    },
    //#endregion
  },
  created() {},
  mounted() {
    this.getPlayerInfo();
    this.socket = SocketIOClient('http://localhost:4001/roam');
    this.socket.on('connect', () => {
      console.log('已经连接到服务');
    });
    this.socket.on('otherEnter', (data) => {
      this.actors[data.account] = data;
      this.actors = { ...this.actors };
    });
    this.socket.on('otherRoam', (data) => {
      this.actors[data.account] = data;
      this.actors = { ...this.actors };
    });
    this.socket.on('otherLeave', (data) => {
      delete this.actors[data];
      this.actors = { ...this.actors };
    });
    this.socket.on('intoView', (data) => {
      data.forEach((actor) => {
        this.actors[actor.account] = actor;
      });
      this.actors = { ...this.actors };
    });
    this.socket.on('disconnect', () => {
      console.log('从服务断开连接');
    });
  },
  components: {
    player,
    actor,
    pocket,
    smartMap,
  },
};
</script>
