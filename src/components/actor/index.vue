<!--局部样式-->
<style scoped>
.actor {
  position: absolute;
  display: inline-block;
  width: 32px;
  height: 48px;
  z-index: 2;
}
.inner-warp {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.nickname {
  position: absolute;
  top: -15px;
  max-width: 64px;
  height: 17px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  padding: 0px 3px 0px 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.actor.nick-always .nickname {
  opacity: 1;
}
.actor:hover .nickname {
  opacity: 1;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div
    :class="{
      'actor': true,
      'nick-always': nicknameAlways,
    }"
    :style="autoStyle">
    <div class="inner-warp">
      <div
        v-if="nickname.trim()"
        class="nickname">
        {{nickname}}
      </div>
    </div>
  </div>
</template>

<script>
// 方向到精灵图映射（上下左右）
const DirMap = [3, 0, 1, 2];

export default {
  name: 'actor',
  props: {
    // 昵称
    nickname: {
      type: String,
      default: '',
    },
    // 是否总是显示昵称
    nicknameAlways: {
      type: Boolean,
      default: false,
    },
    // 图像素材Id
    imgid: {
      default: 0,
    },
    // 方向
    dir: {
      type: Number,
      default: 0,
    },
    // 姿态
    ges: {
      type: Number,
      default: 0,
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
    autoStyle() {
      const style = {};
      style['background'] = `
        url('/image/actor/${this.imgid}.png')
        no-repeat
        -${Math.floor((this.ges % 4)) * 32}px
        -${(DirMap[Math.floor(this.dir % 4)]) * 48}px
      `;
      return style;
    },
    // // 用于调试
    // autoStyle() {
    //   let style = {};
    //   style['background'] = `
    //     url('/image/actor/0.png')
    //     no-repeat
    //     -${Math.floor((0)) * 32}px
    //     -${Math.floor((0)) * 48}px
    //   `;
    //   return style;
    // },
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
  components: {},
};
</script>
