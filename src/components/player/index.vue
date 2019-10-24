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
// 支持WSAD键
// 支持键盘方向键
// 支持虚拟键盘
const KeyDirMap = {
  ArrowUp: 0,
  KeyW: 0,
  Up: 0,
  ArrowDown: 1,
  KeyS: 1,
  Down: 1,
  ArrowLeft: 2,
  KeyA: 2,
  Left: 2,
  ArrowRight: 3,
  KeyD: 3,
  Right: 3,
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
    // 真实键事件
    handleKeyDown(e) {
      this.moveByCode(e.code);
    },
    // 虚拟键事件
    handleVKeyDown(code) {
      this.moveByCode(code);
    },
    //#endregion
    //#region 业务逻辑方法
    // 根据Code驱动玩家移动
    moveByCode(code) {
      const newDir = KeyDirMap[code];
      if (isFinite(newDir)) {
        this.Move(newDir);
      }
    },
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
    this.$root.$on('vkeydown', this.handleVKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.$root.$off('vkeydown', this.handleVKeyDown);
  },
  components: {},
};
</script>
