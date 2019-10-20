<!--局部样式-->
<style scoped>
.login-form {
  margin-top: 30px;
  margin-left: 20px;
}
.submit-warp {
  text-align: right;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <xpage
    name="游戏登录"
    class="view-login">
    <template v-slot:right>
      <el-button
        @click="handleToRegClick"
        type="text">
        注册玩家
      </el-button>
    </template>
    <el-form
      class="login-form"
      ref="loginForm"
      style="width: 300px"
      size="mini"
      label-position="left"
      label-width="80px"
      :model="loginForm">
      <el-form-item
        label="登录信息"
        prop="input"
        :rules="[
          {
            validator: validateInput,
            trigger: 'blur',
          },
        ]">
        <el-input
          placeholder="请输入玩家昵称/账号"
          clearable
          v-model="loginForm.input">
        </el-input>
      </el-form-item>
      <el-form-item
        label="登录密码"
        prop="password"
        :rules="[
          {
            validator: validatePassword,
            trigger: 'blur',
          },
        ]">
        <el-input
          ref="focusInput"
          placeholder="请输入玩家登录密码"
          clearable
          type="password"
          v-model="loginForm.password"
          @keydown.native.enter="handleLoginClick">
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="submit-warp">
          <el-button
            @click="handleResetClick">
            重置
          </el-button>
          <el-button
            type="primary"
            @click="handleLoginClick">
            登录
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </xpage>
</template>

<script>
import jsSHA from 'jssha';
import * as api from '@/api/player';

export default {
  name: 'view-login',
  props: {},
  data() {
    return {
      //#region 页面对象
      // 玩家昵称校验规则
      validateInput: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入玩家昵称'));
          return;
        }
        callback();
      },
      // 登录密码校验规则
      validatePassword: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入玩家登录密码'));
          return;
        }
        callback();
      },
      //#endregion
      //#region 页面内容绑定数据
      // 登录信息绑定表单
      loginForm: {
        input: '',
        password: '',
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
    // 登录按钮点击事件
    handleLoginClick() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.playerLogin(this.loginForm.input, this.loginForm.password);
        } else {
          return false;
        }
      });
    },
    // 重置表单点击事件
    handleResetClick() {
      this.$refs['loginForm'].resetFields();
    },
    // 注册玩家按钮点击
    handleToRegClick() {
      this.$router.push({
        name: 'view-register',
      });
    },
    //#endregion
    //#region 业务逻辑方法
    // 玩家登录逻辑
    playerLogin(input, password) {
      const inputDOM = this.$refs['focusInput'].$el.querySelector('input');
      inputDOM.blur();
      this.$nextTick(async () => {
        const params = {
          input,
          password: this.hashPassword(password),
        };
        const result = await api.login(params);
        if (result.success) {
          this.$msgbox({
            title: '登录成功',
            type: 'success',
            message: `点击确定进入游戏`,
            callback: () => {
              this.$router.push({
                name: 'view-playground',
              });
            },
          });
        }
      });
    },
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    // 对用户输入密码进行hash加密
    hashPassword(password) {
      const shaObj = new jsSHA("SHA-256", "TEXT");
      shaObj.setHMACKey("jimao", "TEXT");
      shaObj.update(password);
      const hash = shaObj.getHMAC("HEX");
      return hash;
    }
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
