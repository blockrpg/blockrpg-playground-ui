<!--局部样式-->
<style scoped></style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div>
    <actor
      v-for="roamer in list"
      :key="roamer.account"
      :nickname="roamer.name"
      :nicknameAlways="true"
      :imgid="roamer.image"
      :dir="roamer.dir"
      :ges="roamer.ges"
      :style="roamerStyle(roamer)">
    </actor>
  </div>
</template>

<script>
import actor from '@/components/actor';

export default {
  name: 'roamers',
  props: {
    player: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
        };
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    zindexMap: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      //#region 页面对象
      //#endregion
      //#region 页面内容绑定数据
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
    // 计算Roamer的位置信息
    roamerStyle(roamer) {
      const baseTop = 176;
      const baseLeft = 312;
      const style = {};
      style.transform = `translate(
        ${baseLeft + (roamer.x - this.player.x) * (32.0 / 5)}px,
        ${baseTop + (roamer.y - this.player.y) * (32.0 / 5)}px
      )`;
      style['z-index'] = this.zindexMap[roamer.account] || 1000;
      return style;
    },
    //#endregion
    //#region 其他方法
    //#endregion
  },
  created() {},
  mounted() {},
  components: {
    actor,
  },
};
</script>
