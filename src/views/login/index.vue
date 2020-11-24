<template>
  <div class="login-coontainer">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <!-- $router.back()返回之前的页面 从哪里来的 就回到哪里 -->
      <van-icon slot="left" name="cross" @click="$router.back()"></van-icon>
    </van-nav-bar>
    <!-- 登录表单 -->
    <!-- 表单验证 -->
    <!-- 1、给 van-field 组件配置 rules 验证规则 -->
    <!-- 2、当表单提交的时候自动触发表单验证 如果验证通过，会触发 submit事件  -->

    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        clearable
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time倒计时时间 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            size="small"
            round
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111', //手机号
        code: '246810' //验证码
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号码不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码格式错误' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false //展示倒计时
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1、获取表单数据
      const user = this.user
      // 2、表单登录

      // 在组件中必须通过 this.$toast  来调用Toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //表示禁用背景点击
        duration: 0 // 持续时间，默认是2000， 如果是0，则持续展示
      })
      // 3、提交表单请求登录
      try {
        const { data } = await login(user)
        // console.log('登录成功', res)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // console.log(this.$store)
        // 登录成功之后 跳转回原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log('登录失败 请稍后重试', err)
          this.$toast.fail('登录失败 请稍后重试')
        }
      }
      // 4、根据请求响应结果处理后续
    },
    async onSendSms() {
      console.log('onSendSms')
      // 1、校验手机号码
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('手机号码验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2、验证通过，显示倒计时
      this.isCountDownShow = true
      // 3、请求发送验证码
      try {
        await sendSms(this.user.mobile)
        // console.log('发送成功', res)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
        // console.log('发送失败', err)
        // if()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-coontainer {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    background-color: #ededed;
    color: #666;
  }
  .van-button--small {
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px, 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
