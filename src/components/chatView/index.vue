<!--局部样式-->
<style scoped>
.chat-view {
  position: absolute;
  top: 0px;
  left: 0px;
  box-sizing: border-box;
  width: 194px;
  height: 100px;
  font-size: 12px;
  color: #f1f1f1;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0px 0px 2px 0px;
  padding-top: 1px;
  overflow: auto;
  opacity: 0.2;
  transition: opacity 0.2s;
}
.chat-view:hover {
  opacity: 1;
}
.chat-view.chat-view-hover {
  opacity: 1;
}
.chat-view::-webkit-scrollbar {
  display: none;
}
.chat-view .chat-warp {
  line-height: 14px;
  transition: background-color 0.05s;
}
.chat-view .chat-warp:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.chat-view .chat-warp .msg-name,.msg-colon {
  font-weight: bold;
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <div
    class="chat-view"
    :class="{'chat-view-hover': value}"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="chat-warp">
      <span class="msg-name" :style="hashColor(item.name)">{{item.name}}</span>
      <span class="msg-colon" :style="hashColor(item.name)">：</span>
      <span>{{item.message}}</span>
    </div>
  </div>
</template>

<script>
// import chatRoomClient from '@/skioClient/chatRoomClient';
// 背景颜色列表
const colors = ['#99CCFF', '#FF5555', '#FF99CC', '#FFFF99', '#CCCCFF', '#CCCCCC', '#FFCC99', '#CCFF66', '#CCFFFF', '#FF33CC'];
// 字符串Hash方法
function hash(str) {
  let hash = 5381, i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

export default {
  name: 'chatView',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //#region 页面对象
      timer: -1,
      //#endregion
      //#region 页面内容绑定数据
      list: [],
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
    // 鼠标进入区域
    handleMouseEnter() {
      this.$emit('input', true);
    },
    // 鼠标离开区域
    handleMouseLeave() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('input', false);
      }, 8000);
    },
    //#endregion
    //#region 业务逻辑方法
    // Push聊天消息
    pushChat(chat) {
      this.list.push(chat);
      this.$nextTick(() => {
        const dom = this.$el;
        dom.scrollTop = dom.scrollHeight;
        this.$emit('input', true);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$emit('input', false);
        }, 8000);
      });
    },
    //#endregion
    //#region 接口访问方法
    //#endregion
    //#region 数据转换方法
    //#endregion
    //#region 自动样式方法
    // 计算hash颜色
    hashColor(str) {
      const index = hash(str) % colors.length;
      return {
        color: colors[index],
      };
    },
    //#endregion
    //#region 其他方法
    //#endregion
  },
  created() {},
  mounted() {
    chatRoomClient.Socket.on('message', (data) => {
      this.pushChat({
        name: data.name,
        message: data.message,
      });
    });
  },
  beforeDestroy() {

  },
  components: {},
};
</script>
