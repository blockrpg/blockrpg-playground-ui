<!--局部样式-->
<style scoped>
.view-register {

}
.reg-form {
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
    class="view-register"
    name="注册玩家">
    <template v-slot:right>
      <el-button
        @click="handleToLoginClick"
        type="text">
        登录
      </el-button>
    </template>
    <el-form
      class="reg-form"
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
          {
            required: true,
            validator: validateName,
            trigger: 'blur',
          },
        ]">
        <el-input
          placeholder="请输入玩家昵称，长度不超过20个字符"
          clearable
          autocomplete="new-password"
          v-model="regForm.name">
        </el-input>
      </el-form-item>
      <el-form-item
        label="登录密码"
        prop="password"
        :rules="[
          {
            required: true,
            validator: validatePassword,
            trigger: 'blur',
          },
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
          {
            required: true,
            validator: validateRePassword,
            trigger: 'blur',
          },
        ]">
        <el-input
          ref="rePasswordInput"
          placeholder="请再次输入玩家登录密码以确认"
          clearable
          type="password"
          autocomplete="new-password"
          v-model="regForm.rePassword"
          @keydown.native.enter="handleRegClick">
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
            @click="handleRegClick">
            注册
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </xpage>
</template>

<script>
import * as api from '@/api/player';
import { Password } from 'blockrpg-core/built/Password';

export default {
  name: 'view-register',
  props: {},
  data() {
    return {
      //#region 页面对象
      // 玩家昵称校验规则
      validateName: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入玩家昵称'));
          return;
        }
        if (value.length > 20) {
          callback(new Error('玩家昵称必须在20个字符以内'));
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
        if (value.length < 8 || value.length > 16) {
          callback(new Error('玩家登录密码必须在8 ~ 16个字符以内'));
          return;
        }
        if (this.regForm.rePassword) {
          this.$refs['regForm'].validateField('rePassword');
        }
        callback();
      },
      // 确认密码校验规则
      validateRePassword: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入玩家登录密码'));
          return;
        }
        if (value !== this.regForm.password) {
          callback(new Error('两次输入的密码不一致'));
          return;
        }
        callback();
      },
      //#endregion
      //#region 页面内容绑定数据
      // 表单绑定数据
      regForm: {
        name: '',
        password: '',
        rePassword: '',
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
    // 注册点击事件
    handleRegClick() {
      this.$refs['regForm'].validate((valid) => {
        if (valid) {
          this.registerPlayer(this.regForm.name, this.regForm.password);
        } else {
          return false;
        }
      });
    },
    // 重置表单点击事件
    handleResetClick() {
      this.$refs['regForm'].resetFields();
    },
    // 注册玩家按钮点击
    handleToLoginClick() {
      this.$router.push({
        name: 'view-login',
      });
    },
    //#endregion
    //#region 业务逻辑方法
    async registerPlayer(name, password) {
      const inputDOM = this.$refs['rePasswordInput'].$el.querySelector('input');
      inputDOM.blur();
      this.$nextTick(async () => {
        const params = {
          name,
          password: Password.Hash(password),
        };
        const result = await api.register(params);
        if (result.success) {
          this.$msgbox({
            title: '注册成功',
            type: 'success',
            message: `您的账号为：${result.object.account}，可使用账号或昵称登录`,
            callback: () => {
              this.$router.push({
                name: 'view-login',
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
