// import { from } from 'core-js/fn/array'
import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //一个对象，存储当前 用户的登录状态信息
    // user: JSON.parse(window.localStorage.getItem('TOKEN_KEY'))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      // 为防止刷新丢失，将数据备份到本地存储中
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
