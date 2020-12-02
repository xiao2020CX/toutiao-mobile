<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    @load="onLoad"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    // 组件的引用
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  computed: {
    // 计算属性
  },
  watch: {
    // 监测变化
  },
  created() {
    // 在手动出事 onload 不会自动开启loading 需要自己手动开启初始
    this.loading = true
    // 实例被创建之后执行代码
    this.onLoad()
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    async onLoad() {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        // type  a 文章的评论 c 评论的回复
        // source 文章的评论，则传递文章的id  评论的回复，则传递评论的id
        // 1、请求获取数据
        const { data } = await getComments({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit //获取的评论数据个数
        })
        // console.log(data)
        // 2、将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 把文章评论的总数量传递到外部 这样就不需要解构了
        this.$emit('onload-success', data.data)

        // 3、将 loading 设置为false
        this.loading = false
        // 4、判断是否还有数据
        if (results.length) {
          //  有就更新获取下一页数据页码
          this.offset = data.data.last_id
        } else {
          //  没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        // console.log('err', 12121212)
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
