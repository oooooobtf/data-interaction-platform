import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Menu from '../components/Menu_.vue'
/*系统管理*/
import sysInterface from '../components/systemManage/interfaceList.vue'
import sysInterfaceDetails from '../components/systemManage/interfaceDetail.vue'
import systemManage from '../components/systemManage/systemManage.vue'
/*接口管理*/
import InterfaceManager from '../components/interfaceManager/InterfacManage.vue'
import InterfaceDetails from '../components/interfaceManager/InterfaceDetails.vue'
/*监控统计*/
import DataMonitoring from '../components/dataMonitoring/dataMonitoringHome.vue'
// 数据解析
import DataMonitoringTable from '../components/dataMonitoringTable/dataMonitoringTable.vue'
//数据库监控
import DataParser from '../components/dataParser/dataParser.vue'
/*用户设置*/
import UserSetting from  '../components/user/UserSetting.vue'
/*数据源管理*/
import DataOriginManagement from  '../components/dataOriginManagement/dataOriginManagement.vue'
// 大屏数据
import BigScreen from '../components/bigScreen/bigScreen.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'登录',
      component:Login
    },
    {
      path:'/BigScreen',
      name:'大屏数据',
      component:BigScreen
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      children:[
        {
          path:'interfaceManager',
          name:'接口管理',
          component:InterfaceManager
        },
        {
          path:'interfaceDetails',
          name:'接口详情',
          component:InterfaceDetails
        },
        {
          path:'dataMonitoring',
          name:'监控统计',
          component:DataMonitoring

        },
        {
          path:'DataMonitoringTable',
          name:'数据库监控',
          component:DataMonitoringTable

        },

        {
          path:'sysInterface',
          name:'系统接口',
          component:sysInterface
        },
        {
          path:'sysInterfaceDetails',
          name:'系统接口详情',
          component:sysInterfaceDetails
        },
        {
          // path:'systemManage',
          path:'',
          name:'系统管理',
          component:systemManage
        },
        {

          path:'dataParser',
          name:'数据解析',
          component:DataParser
        },
        {

          path:'userSetting',
          name:'用户设置',
          component:UserSetting
        },
        {
          path:'dataOriginManagement',
          name:'数据源管理',
          component:DataOriginManagement
        }
      ]
    }
  ]
})
