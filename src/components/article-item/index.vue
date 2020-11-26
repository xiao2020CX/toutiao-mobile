<template>
  <van-cell class="article-item">
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <div slot="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="img"></van-image>
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comn_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      fit="cover"
      slot="default"
      :src="article.cover.images[0]"
    ></van-image>
  </van-cell>

  <!-- title="单元格" value="内容" label="描述信息" -->
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  components: {
    // 组件的引用
  },
  data() {
    return {}
  },
  created() {
    // 实例被创建之后执行代码
  },
  computed: {
    // 计算属性
  },

  methods: {
    // 方法
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
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0; //上下30 左右不用设置
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
