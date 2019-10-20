<!--局部样式-->
<style scoped>
.player {
  transform: translate(312px, 176px);
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <actor
    class="player"
    :nickname="nickname"
    :nicknameAlways="nicknameAlways"
    :imgid="imgid"
    :dir="innerValue.dir"
    :ges="innerValue.ges">
  </actor>
</template>

<script>
import npc from '@/components/npc';

// 按键方向映射
const KeyDirMap = {
  ArrowUp: 0,
  ArrowDown: 1,
  ArrowLeft: 2,
  ArrowRight: 3,
};

export default {
  name: 'player',
  mixins: [npc],
  props: {},
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
    // 方向键事件
    handleKeyDown(e) {
      const newDir = KeyDirMap[e.code];
      if (isFinite(newDir)) {
        this.Move(newDir);
      }
    },
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
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  components: {},
};
</script>
