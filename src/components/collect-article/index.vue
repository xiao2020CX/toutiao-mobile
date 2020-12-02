<template>
  <van-icon
    :name="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
    :loading="loading"
    @click="onCollect"
  >
  </van-icon>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {
    // 组件的引用
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    // 计算属性
  },
  watch: {
    // 监测变化
  },
  created() {
    // 实例被创建之后执行代码
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏，添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请尝试')
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less">
.collected {
  color: #ffa500;
}
</style>
