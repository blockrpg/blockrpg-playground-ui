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
        :nicknameAlways="true"
        :imgid="playerImage"
        v-model="player"
        :legal="moveLegal"
        :style="{
          'z-index': this.autoZIndexMap[playerAccount] || 1000
        }"
      />
      <roamers
        :player="player"
        :list="roamersList"
        :zindexMap="autoZIndexMap"
      />
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
// playground的尺寸是在 21 * 13 的原型上 -16px
// 所得出 656px 400px
// block为 21 * 13 在playground内四边多余大约为 8px
// 一次性渲染的GrdDOM数量也是 21 * 13
import SocketIOClient from 'socket.io-client';
import actor from '@/components/actor';
import player from '@/components/player';
import pocket from '@/components/pocket';
import roamers from '@/components/roamers';
import smartMap from '@/components/smartMap';
import { Point } from 'blockrpg-core/built/Point';
import { Rect } from 'blockrpg-core/built/Rect';
import * as APIPlayer from '@/api/player';

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
      playerAccount: '',
      playerName: '',
      playerImage: 0,
      player: {},
      // 缓存其他的漫步者信息
      roamers: {},
      roamersList: [],
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
      },
    },
  },
  computed: {
    //#region 常量计算属性
    //#endregion
    //#region 数据转换计算属性
    // 自动根据坐标y计算zindex样式
    // 得出一个Map对象Key是Account
    autoZIndexMap() {
      const list = this.roamersList.map((item) => ({ account: item.account, y: item.y }));
      list.push({
        account: this.playerAccount,
        y: this.player.y,
      });
      list.sort((a, b) => (a.y - b.y));
      const result = {};
      list.forEach((item, index) => {
        result[item.account] = 1000 + index;
      });
      return result;
    },
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
        this.playerAccount = info.account;
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
    // 更新游戏中的Roamers
    updateRoamers() {
      this.roamersList = Object.values(this.roamers);
    },
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    //#endregion
    //#region 自动样式方法
    //#endregion
    //#region 其他方法
    // 判断移动是否合法
    moveLegal(pos) {
      // 计算地图冲突
      const grid = this.$refs.smtMap.readGridFromBufferSpace(new Point(pos.x, pos.y));
      const mapClash = !grid.pass;
      // 计算玩家冲突
      const rect = new Rect(pos.x - 2, pos.y, 5, 1);
      const roamers = Object.values(this.roamers);
      const roamerClash = roamers.some((roamer) => rect.Exist(new Point(roamer.x, roamer.y)));
      return !(mapClash || roamerClash);
    },
    //#endregion
  },
  created() {},
  mounted() {
    this.getPlayerInfo();
    // if (this.ready) {
    this.socket = SocketIOClient('http://192.168.50.217:4001/roam');
    this.socket.on('connect', () => {
      console.log('已经连接到服务');
    });

    this.socket.on('otherEnter', (roamer) => {
      this.roamers[roamer.account] = roamer;
      this.updateRoamers();
      console.log('其他玩家登录', roamer.account);
    });
    this.socket.on('otherRoam', (roamer) => {
      this.roamers[roamer.account] = roamer;
      console.log('其他玩家漫游', roamer.account, roamer.x, roamer.y);
      this.updateRoamers();
    });
    this.socket.on('otherLeave', (account) => {
      console.log('其他玩家离开', account);
      delete this.roamers[account];
      this.updateRoamers();
    });
    this.socket.on('intoView', (roamers) => {
      roamers.forEach((roamer) => {
        this.roamers[roamer.account] = roamer;
      });
      this.updateRoamers();
      console.log('进入视野', roamers.map((roamer) => roamer.name));
    });

    this.socket.on('disconnect', () => {
      console.log('从服务断开连接');
    });
    // }
  },
  beforeDestroy() {
    // 离开页面关闭Socket连接
    this.socket.disconnect();
  },
  components: {
    player,
    actor,
    pocket,
    smartMap,
    roamers,
  },
};
</script>
