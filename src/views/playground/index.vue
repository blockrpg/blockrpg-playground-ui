<!--局部样式-->
<style scoped>
.playground-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <xpage
    class="view-playground"
    name="游乐场">
    <template
      v-slot:right>
      <el-button
        @click="handleExitClick"
        type="text">
        退出游戏
      </el-button>
    </template>
    <div class="playground-warp">
      <playground />
      <vkeyboard style="margin-top: 20px" />
    </div>
  </xpage>
</template>

<script>
import playground from '@/components/playground';
import vkeyboard from '@/components/vkeyboard';

export default {
  name: 'view-playground',
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
    // 退出游戏事件
    handleExitClick() {
      this.$router.push({
        name: 'view-login',
      });
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
  mounted() {},
  components: {
    playground,
    vkeyboard,
  },
};
</script>
