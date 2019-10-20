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
    <smartMap
      ref="smtMap"
      :playerPos="{ x: player.x, y: player.y }"
    />
    <player
      nickname="鸡毛巾"
      :imgid="3"
      v-model="player"
    />
    <span class="pos-span">{{`x:${player.x} y:${player.y}`}}</span>
    <pocket />
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

export default {
  name: 'viewport',
  props: {},
  data() {
    return {
      //#region 页面对象
      //#endregion
      //#region 页面内容绑定数据
      player: {
        x: 0,
        y: 0,
        dir: 1,
        ges: 0,
      },
      //#endregion
      //#region 页面样式绑定数据
      //#endregion
    };
  },
  watch: {},
  computed: {
    //#region 常量计算属性
    //#endregion
    //#region 数据转换计算属性
    //#endregion
    //#region 样式计算属性
    //#endregion
  },
  methods: {
    //#region 页面事件方法
    //#endregion
    //#region 业务逻辑方法
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    //#endregion
    //#region 自动样式方法
    //#endregion
    //#region 其他方法
    //#endregion
  },
  created() {},
  mounted() {},
  components: {
    player,
    pocket,
    smartMap,
  },
};
</script>
