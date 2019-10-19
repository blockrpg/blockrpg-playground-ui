<!--局部样式-->
<style scoped>
.xpage {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}
.page-header {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  background-color: #555;
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 22px;
  padding: 0px 20px 0px 20px;
  line-height: 50px;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div class="xpage">
    <div class="page-header">{{name}}</div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'xpage',
  props: {
    name: {
      type: String,
      default: '',
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
    //#endregion
    //#region 其他方法
    //#endregion
  },
  created() {},
  mounted() {},
  components: {},
};
</script>
