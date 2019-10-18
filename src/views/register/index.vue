<!--局部样式-->
<style scoped>
.view-register {
  padding: 50px;
}
.submit-warp {
  text-align: right;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <xpage class="view-register">
    <el-form
      ref="regForm"
      style="width: 400px"
      size="mini"
      label-position="left"
      label-width="80px"
      :model="regForm">
      <el-form-item
        label="玩家名称"
        prop="name"
        :rules="[
          { required: true, message: '玩家名称不能为空' },
        ]">
        <el-input
          placeholder="请输入玩家昵称，长度不超过20个字符"
          clearable
          v-model="regForm.name">
        </el-input>
      </el-form-item>
      <el-form-item
        label="登录密码"
        prop="password"
        :rules="[
          { required: true, message: '登录密码不能为空' },
        ]">
        <el-input
          placeholder="请输入玩家登录密码，8 ~ 16个字符以内"
          clearable
          type="password"
          autocomplete="new-password"
          v-model="regForm.password">
        </el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="rePassword"
        :rules="[
          { required: true, message: '请再次输入登录密码' },
        ]">
        <el-input
          placeholder="请再次输入玩家登录密码以确认"
          clearable
          type="password"
          autocomplete="new-password"
          v-model="regForm.rePassword">
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="submit-warp">
          <el-button
            type="primary"
            @click="handleRegClick">
            注册
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </xpage>
</template>

<script>
export default {
  name: 'view-register',
  props: {},
  data() {
    return {
      //#region 页面对象
      //#endregion
      //#region 页面内容绑定数据
      regForm: {
        name: '',
        password: '',
        rePassword: '',
      }
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
    handleRegClick() {
      this.$refs['regForm'].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
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
  components: {},
};
</script>
