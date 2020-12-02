<template>
  <div id="channel-edit" class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- 之前是在 van-grid-item里面通过属性配置标题 现在使用span 的自定义插槽来配置channel.name-->
        <!-- v-bind:class 语法 一个对象，对象中的key 表示要作用的css类名，对象中的value要计算出布尔值 结果是true的话则作用该类名，false，就不作用该类名 active就是 css class类名  activeIndex就是父组件传过来的props数据-->
        <span
          class="text"
          :class="{ active: index === activeIndex }"
          slot="text"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {
    // 组件的引用
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态
      fiexdChannels: [0] //固定频道，不允许被删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性
    // 计算属性会观测内部依赖数据的变化 如果依赖的数据发生变化，则计算属性会重新执行 解释onAddChannel 方法
    // 思路：所有频道-我的频道=推荐频道
    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把符合条件的安苏存储到新数组(会自动创建一个新的数组来进行存储数据)
      return this.allChannels.filter(channel => {
        // const channels = []
        // 数组的find 方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find(mychannel => mychannel.id === channel.id)
      })
    }
    // recommendChannels() {
    //   // 首先定义一个空的新数组 用来存储推荐频道的列表数据
    //   const channels = []
    //   // 遍历 allChannels所有频道的列表
    //   this.allChannels.forEach(channel => {
    //     // 使用数组的find方法 用来找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       // 如果返回的是true 说明这个频道是在我的频道里面的 false则相反
    //       return myChannel.id === channel.id
    //     })
    //     // 如果的我的频道中不包括该频道项（channel），则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 将计算机结果返回
    //   return channels
    // }
  },
  watch: {
    // 监测变化
  },
  created() {
    // 实例被创建之后执行代码
    this.loadAllChannels()
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        // console.log(err);
        this.$toast('获取所有频道数据失败')
      }
    },
    async onAddChannel(channel) {
      // console.log(channel)
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, //频道id
            seq: this.myChannels.length //序号
          })
        } catch (err) {
          this.$toast('保存失败,请稍后重试')
        }
      } else {
        // 未登录 将数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        //1、 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2、编辑状态，执行被删除频道
        // splice(要删除的元素的开始索引【包括】，删除的个数，如果不指定，则从参数1开始一直删除到最后)
        this.myChannels.splice(index, 1)
        // 3、如果删除的激活频道事前的频道，则更新激活的频道项
        if (index <= this.activeIndex) {
          // 让激活频道的索引 -1
          this.$emit('update-active', this.activeIndex - 1, true)
        }
        // 4、处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    /deep/ .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
        .van-grid-item__text {
          margin-top: 0;
          font-size: 15px;
        }
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        span .text {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
