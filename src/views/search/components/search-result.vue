<template>
  <div class="search-result">
    搜索结果
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请稍后重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {
    // 组件的引用
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
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
    // 实例被创建之后执行代码
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    async onLoad() {
      try {
        //  1、请求获取数据
        const { data } = await getSearchResult({
          page: this.page, //页码
          per_page: this.perPage, //每页大小
          q: this.searchText // 查询关键字
        })
        // 制造一个随机数 错误 检测错误提示
        if (Math.random() > 0.5) {
          JSON.parse('hahaha')
        }
        // 2、将数据添加到数组列表区域
        const { results } = data.data
        this.list.push(...results)
        // 3、将本次加载中的loading 关闭
        this.loading = false
        // 4、判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则更新加载状态 finished 设置为结束
          this.finished = true
        }
        // console.log('onload', data)
      } catch (err) {
        this.error = true
        this.loading = false
        // this.$toast('数据获取失败，稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
