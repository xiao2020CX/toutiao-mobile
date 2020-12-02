<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情  使用article.title 或者其他的article.xxx来判定架子啊是否完成-->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 模板中的$event 是事件参数 
          当传递给子组件的数据既要使用还要修改 
          传递 props
             :is-followed="article.is_followed"
          修改：自定义事件
            @update-is_followed="article.is_followed = $event"
            简写方式：在组建上使用 v-model相当于以下两句代码的简写
            value="article.is_followed"
            @input="article.is_followed=$event"
            如果需要修改 v-model 的规则名称，可以通过子组件的 model
            一个足尖上只能使用一次
            如果有多个数据需要实现类似于 v-model 的效果 方法？ 可以使用属性 .sync 修饰符
           -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          ></follow-user>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            :loading="followLoading"
            icon="plus"
            @click="onFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        ></comment-list>
        <!--/文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCommentCount" />
          <collect-article
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>
          <!-- <van-button  icon="star-o"></van-button> -->
          <!-- <van-icon color="#777" name="good-job-o" /> -->

          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论的弹出层 -->
        <van-popup v-model="isPostShow" position="bottom"
          ><comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post
        ></van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:100%;"
      ><comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      ></comment-reply
    ></van-popup>
  </div>
</template>

<script>
// ①将请求方法加载进来
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
// import { addFollow, deleteFollow } from '@/api/user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
// 这个是当前目录下用的是点. @是相对路径下
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

// ImagePreview({
//   images: [
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   //   起始位置 从0开始
//   startPosition: 1,
//   onClose() {
//     console.log('onClose')
//   }
// })
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // vue中的依赖注入 用来给所有的组件提供数据
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, //控制发布评论的显示状态
      commentList: [], //评论列表
      isReplyShow: false,
      currentComment: {} //当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created() {
    //   ②初始调用
    this.loadArticle()
  },
  mounted() {},
  methods: {
    //   ③写出方法
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // 模拟失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('hahahahhah')
        // }
        // 数据驱动视图不是立即的
        this.article = data.data
        // 初始化图片点击预览
        // console.log(this.$refs['article-content'])
        setTimeout(() => {
          //   console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
        //请求成功 关闭loading
        // this.loading = false
        // console.log(data)
      } catch (err) {
        // this.loading = false
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('请求失败，稍后重新试')
      }
      //   无论成功还是失败，都需要关闭loading
      this.loading = false
    },
    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      //   console.log(imgs)
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            //   预览的图片地址数组
            images,
            //   起始位置 从0开始
            startPosition: index
          })
        }
      })
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
    // async onFollow() {
    //   this.followLoading = true // 展示关注按钮的 loading 状态
    //   try {
    //     if (this.article.is_followed) {
    //       //已关注，取消关注
    //       await deleteFollow(this.article.aut_id)
    //       //   console.log(data)
    //       //   this.article.is_followed = false
    //     } else {
    //       // 没有关注，添加关注
    //       await addFollow(this.article.aut_id)
    //       //   console.log(data)
    //       //   this.article.is_followed = true
    //     }
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败，请重试'
    //     if (err.response && err.response.status === 400) {
    //       message = '你不能关注自己啦'
    //     }
    //     this.$toast('关注用户操作失败，请重试')
    //   }
    //   this.followLoading = false // 关闭关注按钮的 loading 状态
    // }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
