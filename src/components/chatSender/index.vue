<!--局部样式-->
<style scoped>
.chat-sender {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 20px;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0.2;
  transition: opacity 0.2s;
  padding-top: 3px;
}
.chat-sender:hover {
  opacity: 1;
}
.chat-sender.chat-sender-hover {
  opacity: 1;
}
.chat-sender input {
  box-sizing: border-box;
  width: 100%;
  height: 18px;
  color: white;
  font-size: 12px;
  padding: 0px 4px 0px 4px;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
}
.chat-sender input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div
    class="chat-sender"
    :class="{'chat-sender-hover': value}"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <input
      type="text"
      v-model="inputMsg"
      placeholder="请输入消息后回车"
      @keydown.enter="handleSend"
    />
  </div>
</template>

<script>
// import chatRoomClient from '@/skioClient/chatRoomClient';

export default {
  name: 'chatSender',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //#region 页面对象
      //#endregion
      //#region 页面内容绑定数据
      inputMsg: '',
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
    // 发送消息事件
    handleSend() {
      // 如果输入字符串为空字符串，则不触发任何操作
      if (!this.inputMsg.trim()) {
        return;
      }
      if (this.inputMsg.trim().length > 100) {
        this.$message({
          type: 'warning',
          message: '消息长度不可超过100个字符',
        });
        return;
      }
      this.sendMessage();
    },
    // 鼠标进入区域
    handleMouseEnter() {
      this.$emit('input', true);
    },
    // 鼠标离开区域
    handleMouseLeave() {
      setTimeout(() => {
        this.$emit('input', false);
      }, 8000);
    },
    //#endregion
    //#region 业务逻辑方法
    sendMessage() {
      // 触发isay事件直接插入会话
      this.$emit('isay', this.inputMsg);
      // 触发Socket的消息事件
      chatRoomClient.Socket.emit('message', this.inputMsg);
      this.inputMsg = '';
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
