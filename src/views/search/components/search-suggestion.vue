<template>
  <div class="search-suggestion">搜索建议
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="hightlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'

// 按需加载 只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
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
      suggestions: [],
      htmlStr: '' //联想建议数据列表
    }
  },
  computed: {
    // 计算属性
  },
  watch: {
    // 监测变化
    searchText: {
      // 当searchText 发生改变的时候就会调用 handler 函数   注意：函数名称是固定的
      //   handler(value) {
      //     // console.log(value)
      //     this.loadSearchSuggestions(value)
      //   },
      //   debounce 函数 参数1：一个函数；参数2：延迟事件，单位是毫秒 ；返回值：防抖之后的函数
      handler: debounce(function(value) {
        // console.log(value)
        this.loadSearchSuggestions(value)
      }, 500),
      immediate: true //该回调函数将会在侦听开始之后被立即调用
    }
  },
  created() {
    // 实例被创建之后执行代码
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    async loadSearchSuggestions(q) {
      try {
        // const { data } = await getSearchSuggestions(this.searchText)
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    hightlight(text) {
      const hightlightStr = `<span class="active">${this.searchText}</span>`
      //   正则表达式 //中间的内容都会当做匹配字符 来使用，而不是数据变量 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp（参数1：匹配面试字符串，参数2:匹配模式（要写道字符串中））
      const reg = new RegExp(this.searchText, 'gi')
      //   text.replace(/sadsd/gi, hightlightStr)
      return text.replace(reg, hightlightStr)
    }
  }
}
</script>
<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
