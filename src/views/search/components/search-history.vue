<template>
  <div class="search-history">
    搜索历史
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"> </van-icon>
    </van-cell>
    <van-cell
      :title="item"
      :key="index"
      v-for="(item, index) in searchHistories"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-if="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {
    // 组件的引用
  },
  props: {
    // prop数据（受父组件数据影响）
    // 如果是普通数据（数字、字符串、布尔值） 绝对不能修改 即使改了也不会传导给父组件
    // 如果是引用类型数据（数组、对象） 可以修改
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false //控制删除显示状态
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
    // 方法 item就是点击的历史记录项(文本)
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
