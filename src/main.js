// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'


/*
* 字体
* */
import './fonts/7-stroke/7-stroke.css'
import './fonts/font-awesome/font-awesome.css'
import './fonts/glyphicons/glyphicons.css'
import './fonts/ionicons/ionicons.css'
import './fonts/material-design/material-design.css'
import './fonts/octicons/octicons.css'
import './fonts/themify/themify.css'
import './fonts/weather-icons/weather-icons.css'
import './fonts/web-icons/web-icons.css'
import './fonts/HighlandGothicFLF-Bold.ttf'
import './../src/css/liMarquee.css'
import 'swiper/dist/css/swiper.css'
import '../src/css/jquery.running.css'

/*js*/
import $ from 'jquery'
import niceScroll from 'nicescroll'
import  '../static/yfslPageControl'
import '../static/jquery.liMarquee'
import '../static/macarons'
import '../static/jquery.running.min'
import '../static/bootstrap'
import VueClipboard from 'vue-clipboard2'
// 验证
import VeeValidate from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import {Validator} from 'vee-validate'
Validator.localize('zh_CN', zh_CN)
const config={
  fieldsBagName:'vee-fields',//默认为 fields
  dictionary: {
    zh_CN
  }
};
// 自定义提示
const dictionary = {
  zh_CN: {
    messages: {
      required: function( field ){
       return  "请输入" + field
      }
    },
    attributes:{
      list:'接口列表',
      name: '系统名称',
      time: '失效时间',
      count:'次数',
      password:'密码',
      userName:'用户名'
    }
  }
};
Validator.updateDictionary(dictionary);
Vue.use(VeeValidate, config);

Vue.use(VueClipboard)


/*css*/
import './css/com.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.prototype.clipboard = clipboard;
// Vue.use(clipboard)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
