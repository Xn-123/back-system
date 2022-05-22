import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import enlocale from 'element-ui/lib/locale/lang/en'
import zhlocale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { zhlocale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 引入API
import API from '@/api'

// 引入categorySelect
import CategorySelect from '@/components/CategorySelect'
// 创建全局组件
Vue.component(CategorySelect.name,CategorySelect)
import HintButton from '@/components/HintButton';
Vue.component(HintButton.name,HintButton);

Vue.config.productionTip = false
Vue.prototype.$API=API

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
