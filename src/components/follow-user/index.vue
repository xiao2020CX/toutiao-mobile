<template>
  <van-button
    v-if="isFollwed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    :loading="loading"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {
    // 组件的引用
  },
  //   自定义 v-model 的数据名称
  model: {
    prop: 'isFollwed', // 默认是value
    event: 'update-is_followed' //默认是input
  },
  props: {
    isFollwed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Boolean, Object],
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
    async onFollow() {
      this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollwed) {
          //已关注，取消关注
          await deleteFollow(this.userId)
          //   console.log(data)
          //   this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
          //   console.log(data)
          //   this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update-is_followed', !this.value)
        this.$emit('update-is_followed', !this.isFollwed)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注自己啦'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>
<style scoped lang="less"></style>
