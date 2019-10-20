<!--局部样式-->
<style scoped>
.npc {
  /* transition: transform 0.05s; */
}
</style>

<!--全局局部覆盖样式-->
<style></style>

<template>
  <actor
    class="npc"
    :nickname="nickname"
    :nicknameAlways="nicknameAlways"
    :imgid="imgid"
    :dir="innerValue.dir"
    :ges="innerValue.ges">
  </actor>
</template>

<script>
import actor from '@/components/actor';

export default {
  name: 'npc',
  props: {
    // npc昵称
    nickname: {
      type: String,
      default: '',
    },
    // 图像素材Id
    imgid: {
      type: Number,
      default: 0,
    },
    // 是否总是显示昵称
    nicknameAlways: {
      type: Boolean,
      default: false,
    },
    // npc状态，双向绑定
    value: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
          dir: 1,
          ges: 0,
        };
      },
    },
    // 状态改变合法性判断
    legal: {
      type: Function,
      default(val) {
        return true;
      },
    },
  },
  data() {
    return {
      //#region 页面对象
      //#endregion
      //#region 页面内容绑定数据
      innerValue: {},
      //#endregion
      //#region 页面样式绑定数据
      //#endregion
    };
  },
  watch: {
    value: {
      handler(nv) {
        this.innerValue = { ...nv };
      },
      immediate: true,
    },
  },
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
    // 触发反向绑定以及change事件
    handleEmit() {
      this.$emit('input', this.innerValue);
      this.$emit('change', this.innerValue);
    },
    //#endregion
    //#region 业务逻辑方法
    // 驱动NPC移动的方法
    Move(newDir) {
      // 如果移动方向和当前方向一致
      if (newDir === this.innerValue.dir) {
        const newValue = { ...this.innerValue };
        if (newDir === 0) {
          newValue.y -= 1;
          newValue.ges++;
        } else if (newDir === 1) {
          newValue.y += 1;
          newValue.ges++;
        } else if (newDir === 2) {
          newValue.x -= 1;
          newValue.ges++;
        } else if (newDir === 3) {
          newValue.x += 1;
          newValue.ges++;
        }
        this.innerValue.ges = newValue.ges;
        if (this.legal(newValue)) {
          this.$nextTick(() => {
            this.innerValue.x = newValue.x;
            this.innerValue.y = newValue.y;
            this.handleEmit();
          });
        } else {
          this.handleEmit();
        }
      } else {
        this.innerValue.dir = newDir;
        this.innerValue.ges = 0;
        this.handleEmit();
      }
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
  beforeDestroy() {},
  components: {
    actor,
  },
};
</script>
