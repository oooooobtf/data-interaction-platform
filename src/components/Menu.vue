<template>
  <div class="menu">
      <header>
          <img src="../assets/text-log.png" class="text-logo"/>
          <div class="fr user-name">
            <i class="icon wb-user"></i>
            <span>{{username}}</span>
            <i class="icon fa-sign-out" @click="exitLogin()"></i>
          </div>
      </header>
      <!--菜单-->
      <div class="menu-div">
        <ul class="menu-ul">
          <!--<li v-for="item in menuData" @click="collapseMenu(item,$event)" :id="item.id">-->
          <li v-for="item in menuData" @click="collapseMenu(item,$event)" :id="item.id">
            <router-link :to="item.router" :class="item.className">
              <i :class="item.icon"></i>
              <span class="yfsl-menu-title">{{item.name}}</span>
              <span class="yfsl-menu-arrow ion-ios-arrow-right"></span>
            </router-link>

            <ul v-if="item.children" style="margin: 0px;"   @click="activeUl($event)">
              <li v-for="children in item.children" :id="children.id" class="hide" >
                <router-link :to="children.router" :class="children.className">
                  <i :class="children.icon"></i>
                  <span class="yfsl-menu-title">{{children.name}}</span>
                  <span class="yfsl-menu-arrow ion-ios-arrow-right"></span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    <router-view/>

  </div>

</template>

<script>

  import {Utils} from '../js/utils'

  export  default {
    name:'Menu',
    data(){
      return{
        showli:false,
        menuData:[
          {
            name:'系统管理',
//            router:'/menu/systemManage',
            router:'/menu',
            icon:'icon wb-desktop',
            className:'system-manager aa',
            id:'systemManager'
          },
          {
            name:'接口管理',
            router:'/menu/interfaceManager',
            icon:'icon fa-code-fork',
            className:'interface-manager aa',
            id:'interfaceManager'
          },
          {
            name:'数据源管理',
            router:'/menu/dataOriginManagement',
            icon:'icon oi-database',
            className:'data-origin-management'
          },
          {
            name:'数据解析',
            router:'/menu/DataParser',
            icon:'icon fa-code',
            className:'data-parser aa',
            id:'dataParser'
          },
          {
            name:'监控统计',
            router:'/menu/dataMonitoring',
            icon:'icon wb-stats-bars',
            className:'data-monitoring aa',
            id:'dataMonitoring',
            children:[
              {
              name:'数据库监控',
              router:'/menu/DataMonitoringTable',
              icon:'',
              className:'data-monitoring-table aa',
              id:'dataMonitoringTable',
            }
            ]
          },
          {
            name:'用户设置',
            router:'/menu/userSetting',
            icon:'icon fa-cog',
            className:'user-setting aa',
            id:'userSetting'
          }
        ],
        username:''
      }

    },
    updated(){
      var url = this.$route.path.split('/');
      var routerNam;
      if(!Utils.isEmptyObject(url)){
        if(url.length>0){
          routerNam =  url[url.length - 1];
        }else{
          routerNam =  url[0];
        }
        $('ul.menu-ul a').removeClass('active');
        if(routerNam == 'interfaceManager' || routerNam == 'interfaceDetails'){
          $('ul.menu-ul a.interface-manager').addClass('active');
        }else if(routerNam == 'menu' || routerNam == 'sysInterface' || routerNam=='sysInterfaceDetails'){
          $('ul.menu-ul a.system-manager').addClass('active');
        }else if(routerNam == 'dataMonitoring'){
          $('ul.menu-ul a.dataMonitoring').addClass('active');
        }
      }

    },
    mounted(){
      let self = this;
//      console.log(sessionStorage.getItem('username'))
//      sessionStorage.getItem('systemid')
        self.username = sessionStorage.getItem('username');
        if(self.username==undefined){
          self.$router.push({path: "/"});
        }


//      console.log(userName);
    },
    methods:{
      exitLogin:function () {
        let self=this
        self.$router.push({path: "/"});
        console.log("退出登陆")
      },
      isOpen:function(data){
        if(data.children){
          return 'open'
        }
      },
      collapseMenu:function(data,e){
        if(data.children){
//          this.showli=!this.showli
//          $('#dataMonitoringTable').parent('ul').slideToggle()
//          if( $('#dataMonitoringTable').parent('ul').hasClass('hide')){
//            $('#dataMonitoringTable').parent('ul').removeClass('hide')
//            $('#dataMonitoringTable').slideDown('45px')
//          }else{
//            $('#dataMonitoringTable').parent('ul').addClass('hide')
//
//            $('#dataMonitoringTable').slideUp('45px')
//          }

        $('#dataMonitoringTable').toggleClass('hide')
        $('#dataMonitoringTable').toggleClass('show')




//          $(e).addClass('open')
        }
      },
//      collapseMenu:function(data,e){
//        if(data.children){
//
//          console.log($(e.target))
//          if($('#dataMonitoring').hasClass('open')==true){
//            $('#dataMonitoringTable').parent('ul').removeClass('show')
//            $('#dataMonitoring').removeClass('open')
//            $('#dataMonitoring').addClass('close')
//            $('#dataMonitoringTable').parent('ul').addClass('hide')
//          }else{
//            $('#dataMonitoringTable').parent('ul').removeClass('hide')
//            $('#dataMonitoring').removeClass('close')
//            $('#dataMonitoring').addClass('open')
//            $('#dataMonitoringTable').parent('ul').addClass('show')
//          }
//
////          $(e).addClass('open')
//        }
//      },
      activeUl:function(e){
       e.stopPropagation()
      }

    }
  }

</script>

<style scoped>

  header{
    height: 60px;
    background: url(../assets/header_bg.png) no-repeat #4e97d9;
    background-size: cover;
    width: 100%;
    z-index: 9;
    line-height: 60px;
    position: fixed;
  }

  header img.text-logo{
    margin-left: 100px;
  }

  header div.user-name{
    color: #fff;
    font-size: 16px;
    margin-right: 61px;
  }

  div.menu-div{
    padding-top: 60px;
    width: 200px;
    background: url(../assets/nav_bg.png) no-repeat 0 100% #263638;
    background-size: contain;
    min-height:calc(100vh - 60px) ;
    position: fixed;
  }


  div.menu-div ul{
    padding: 0;
    margin: 86px 0 0 0;
    list-style: none;
    color: #97a3aa;
  }

  div.menu-div ul i.icon{
    margin-right: 8px;
    display: inline-block;
    width: 1em;
    text-align: center;
  }

  div.menu-div ul li a{
    color: #97a3aa;
    padding-left: 31px;
    text-decoration: none;
    display: block;
  }
  div.menu-div ul li ul li a{
    color: #97a3aa;
    padding-left: 60px;
    text-decoration: none;
    display: block;
  }

  div.menu-div ul li .aa:hover{
    color: #fff;
    background-color: #242f35;
  }
  div.menu-div ul li ul li .aa:hover{
    color: #fff;
    background-color: #242f35;
  }

  div.menu-div ul li{
    /*height: 44px;*/
    line-height: 44px;
    cursor: pointer;
    position: relative;
  }


  div.menu-div ul a.router-link-exact-active,
  div.menu-div ul a.interface-manager.active,
  div.menu-div ul a.data-parser.active,
  div.menu-div ul a.data-monitoring.active,
  div.menu-div ul a.user-setting.active,
  div.menu-div ul a.system-manager.active{
    color: #ffffff;
    background-color: #242f35;
  }



  div.menu-div ul a.router-link-exact-active span.yfsl-menu-arrow{
    display: inline-block;
  }

  /*div.menu-div ul li:hover a{*/
    /*color: #fff;*/
  /*}*/

  div.menu-div ul li span.yfsl-menu-arrow{
    display: none;
  }



  div.menu-div ul li.active span.yfsl-menu-arrow,
  div.menu-div ul li .aa:hover span.yfsl-menu-arrow{
    display: inline-block;
  }

  div.menu-div ul li span.yfsl-menu-arrow{
    position: absolute;
    right: 20px;
  }

  .open{
    max-height:60px;
    /*margin-bottom:45px;*/
    -webkit-transition: max-height .5s;
    -moz-transition: max-height .5s;
    -ms-transition: max-height .5s;
    -o-transition: max-height .5s;
    transition: max-height .5s;
  }
  .close{
    margin-bottom:0px;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -ms-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
  }
  .show{
    /*display: block ;*/
    visibility: visible;
    opacity:1 ;
    -webkit-transition:all 0.5s linear;
    -moz-transition:all 0.5s linear;
    -ms-transition:all 0.5s linear;
    -o-transition:all 0.5s linear;
    transition:all 0.5s linear;
  }
  .hide{
    display: none;
    visibility: hidden;
    /*line-height: 0;*/
    opacity: 0;
    -webkit-transition:all 0.5s linear;
    -moz-transition:all 0.5s linear;
    -ms-transition:all 0.5s linear;
    -o-transition:all 0.5s linear;
    transition:all 0.5s linear;
  }



</style>
