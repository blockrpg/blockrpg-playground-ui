<!--局部样式-->
<style scoped>
.pocket {
  position: absolute;
  z-index: 100;
  bottom: 0px;
  left: 183px;
}
.pocket ul {
  list-style-type: none;
  margin: 0px;
  padding: 10px;
  display: flex;
}
.pocket ul > li {
  width: 38px;
  height: 38px;
  box-sizing: border-box;
  border: solid 2px #eee;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.3);
  margin-right: 1px;
  padding: 3px;
  cursor: pointer;
  transition: transform 0.2s;
}
.pocket ul > li:hover {
  transform: scale(1.1);
}
.pocket ul > li:last-of-type {
  margin-right: 0px;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div class="pocket">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pocket',
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
