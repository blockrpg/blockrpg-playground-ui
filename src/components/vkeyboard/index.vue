<!--局部样式-->
<style scoped>
.vkeyboard > div {
  display: flex;
  width: 300px;
}
.vkeyboard > .btn-wrap-mid {
  justify-content: center;
}
.vkeyboard > .btn-wrap-space {
  justify-content: space-between;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div class="vkeyboard">
    <div class="btn-wrap-mid">
      <el-button type="primary">上</el-button>
    </div>
    <div class="btn-wrap-space">
      <el-button type="primary">左</el-button>
      <el-button type="primary">右</el-button>
    </div>
    <div class="btn-wrap-mid">
      <el-button type="primary">下</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vkeyboard',
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
