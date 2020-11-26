import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { CountDown} from 'vant';



// 加载vant核心组件库
import Vant from 'vant'

// 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置rem 基准值
import 'amfe-flexible'

// 加载 dayjs 初始化配置
import './utils/dayjs'
// import { from } from 'core-js/fn/array'


// 注册使用vant组件库
Vue.use(Vant)
// Vue.use(CountDown)
// Vue.use(Tabbar);
// Vue.use(TabbarItem);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
