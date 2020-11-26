<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  props: {
    // 父辈向子辈传参
    channel: {
      type: Object,
      required: true
    }
  },
  name: 'ArticleList',
  components: {
    // 组件的引用
    ArticleItem
  },
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, //请求获取下一页数据的时间戳
      error: false, // 列表数据加载失败的提示状态
      isreFreshLoading: false, //控制下拉刷新的loading状态
      refreshSuccessText: ''
    }
  },
  created() {
    // 实例被创建之后执行代码
  },
  computed: {
    // 计算属性
  },

  methods: {
    // 方法
    // 初始化或滚动到底部的时候会触发调用 onload
    async onLoad() {
      try {
        // 异步更新数据 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道id
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 制造一个随机数 错误 检测错误提示
        // if (Math.random() > 0.5) {
        //   JSON.parse('hahaha')
        // }
        // console.log(data)
        // 2、把请求结果数据放到 list 数组中
        const { results } = data.data
        this.list.push(...results)
        // 3、本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4、判断数据是否全部加载完成
        if (results.length) {
          //更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished 设置为true，不再加载更多
          this.finished = true
        }
      } catch (err) {
        console.log('请求失败', err)
        // 展示错误提示状态
        this.loading = false //关闭loading
        this.error = true
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh() {
      try {
        // 异步更新数据 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道id
          timestamp: Date.now(), //下拉刷新，每次请求获取最新数据
          with_top: 1
        })
        // 检测刷新失败功能
        //  if (Math.random() > 0.5) {
        //   JSON.parse('hahaha')
        // }
        //2、 将数据追加到列表的顶部
        // console.log(data)
        const { results } = data.data
        this.list.unshift(...results)
        //3、 关闭下拉刷新的loading状态
        this.isreFreshLoading = false
        // 刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        this.isreFreshLoading = false
        this.refreshSuccessText = `刷新失败`
      }
      // 请求数据
      // 将数据追加到列表的顶部
    }
    // onLoad() {
    //   console.log('onload')
    //   // 异步更新数据 1、请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     //   2、把请求结果数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 加载状态结束
    //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    // }
  },
  mounted() {
    // 页面进入时加载内容
  },
  watch: {
    // 监测变化
  }
}
</script>
<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
