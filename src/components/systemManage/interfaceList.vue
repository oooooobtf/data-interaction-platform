<!--接口列表-->
<template>
  <div>
    <section
      style=" margin-left: 200px; padding: 86px 20px 1px 20px;background-color: #f1f4f5">
      <el-header style="height: 116px;padding: 0">
        <div class="title">
          <span>筛选及功能项</span>
        </div>
        <div class="condition-filtrate">
          <!--状态-->
          <div class="status fl">
            <span class="fl">状态</span>
            <ul class="fl status-list">
              <li class="all active" @click="cutInterfaceStatus(1,200)">
                <span><img src="../../assets/deepgreen.png"/></span>
                <span>全部</span>
              </li>
              <li class="forbidden" @click="cutInterfaceStatus(2,0)">
                <span><img src="../../assets/weijiedan.png"/></span>
                <span>禁用中</span>
              </li>
              <li class="start-using" @click="cutInterfaceStatus(3,1)">
                <span><img src="../../assets/yijiedan.png"/></span>
                <span>启用中</span>
              </li>
            </ul>
          </div><!--状态  end-->

          <div class="fr select" style="margin-right: 30px">

            <!--接口类型-->
            <div class="select-down dropdown">
              <div>
                <input placeholder="接口类型" :model="interfaceType" :value="interfaceType" readonly="readonly"
                       contenteditable="false" class="dropdown-toggle" data-toggle="dropdown" style="cursor: default"/>
                <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon fa-sort-down"></i></span>
                <ul class="no-header down-content dropdown-menu">
                  <li @click="chooseType(null)">全部</li>
                  <li v-for="type in Type" @click="chooseType(type)">{{type}}</li>
                </ul>
              </div>
            </div>

            <!--一键检测-->
            <div class="detection" @click="allCheck">
              <img src="../../assets/detection-icon.svg"/>
              <span >一键检测</span>
            </div>
          </div>
        </div>
      </el-header>

      <div class="interface-table"  v-loading="tableLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
        <!--接口列表-->
        <table class="interface-list" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
            <th class="interface-name">接口名称</th>
            <th class="interface-type">接口类型</th>
            <th class="interface-net">接口地址</th>
            <th class="interface-count">调取次数</th>
            <th class="operation">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in items">
            <td class="interface-name">
              <i class="status forbidden" v-if="item.status=='NOT'">禁用中</i>
              <i class="status start-using" v-else>启用中</i>
              <span>{{item.apiName}}</span>
              <i class="status error" v-if="item.result==0">异常</i>
            </td>
            <td class="interface-type"><span>{{item.type}}</span></td>
            <td class="interface-net"><span>{{item.apiAccess}}</span></td>
            <td class="interface-count"><span>{{item.callNum}}次</span></td>
            <td class="operation">
              <span @click="goToInterfaceDetails(item)" style="color:#76838f">调试<i><img src="../../assets/debug-icon.svg"/></i></span>
              <span v-if="item.status=='VALID'" @click="disabledUse(item,0)" style="color:#76838f">禁用<i
                class="icon wb-minus-circle" ></i></span>
              <span v-else @click="disabledUse(item,1)" style="color: #18d96e" class="active">启用<i class="icon wb-minus-circle" ></i></span>

            </td>
          </tr>
          </tbody>

        </table>
      </div>
    </section>

    <!--底部-->
    <div class="footer" style=" margin-left: 200px;">
      <div class="fl">
        <ul>
          <li>
            <i class="icon wb-desktop" style="color: #62a9eb;"></i>
            <span style="color: #62a9eb;cursor:pointer;" @click="goSystem">系统管理</span><span style="margin-left: 10px;">/ </span><span
            style="margin-left: 10px;cursor: pointer">接口管理</span>
          </li>
          <li></li>
        </ul>
      </div>
      <!--页码-->
      <div class="page fr">
        <div>共{{Math.ceil(total/pageSize)}}页，当前在第{{pageNum}}页</div>
        <div id="paging"></div>
      </div>
    </div>

    <!--弹窗-->
    <div class="pop-up-windows" v-show="popUpWindows" @click="popUpWindows=false">
      <div class="vertical-center window-content"
           v-loading="onceLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
        <div class="title clearfix">
          <span class="fl">检测结果</span>
          <span class="icon wb-close fr close-window" @click="popUpWindows=false"></span>
        </div>

        <div class="result-status">
          <span class="icon wb-alert-circle"></span>
          <div>
            <p>本次检测结果:</p>
            <p>
              <span class="normal"> {{checkDetail.successTotal}}个接口正常</span>，<span class="abnormal">{{checkDetail.errorTotal}}个异常</span>。
            </p>
          </div>
        </div>

        <!--检测结果列表-->
        <div class="result-list">
          <!--正常-->
          <ul class="normal" v-if="checkDetail.successTotal!=0">
            <li v-for="item in  checkDetail.successInterfaces">
              <i class="icon wb-check-circle "></i>
              <span class="handle-text">{{item}}</span>
            </li>

          </ul>
          <!--异常-->
          <ul class="abnormal" v-if="checkDetail.errorTotal!=0">
            <li v-for="item in checkDetail.errorInterfaces">
              <i class="icon wb-alert-circle"></i>
              <span class="handle-text">{{item}}</span>
            </li>

          </ul>
        </div>

        <button @click="popUpWindows=false">确认</button>

      </div>
    </div><!--弹窗  end-->
    <!--禁用弹窗-->
    <div id="floor_" class="pop-up-windows" v-show="figureShow" @click="closeFigure(null,0)"></div>
    <div id="deleted_" class="tishi-windows" v-show="figureShow">
      <div class="tishi-top" style="margin-top: 10px;">
        <i class="icon wb-bell" style="color:#f96868;font-size: 22px;"></i>
        <span>确定{{alerttext}}该接口？</span>
        <i class="icon wb-close"
           style="color:#f96868;position:relative;float: right;padding-right: 10px; cursor: pointer"
           @click="closeFigure(null,0)"></i>
        <!--<img src="../../img/close_red.png"></div> -->
        <div class="tishi-bottom">
          <span class="delete-span font-14" @click="closeFigure(null,1)">{{alerttext}}</span>
          <span class="cancel-span font-14" @click="closeFigure(null,0)">取消</span>
        </div>
      </div>
    </div>
    <!--禁用end-->
  </div>


</template>

<script>

  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
  import ElFooter from "../../../node_modules/element-ui/packages/footer/src/main.vue";
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import axios from 'axios'
  import g from '../common.vue'

  let vm;
  let id;
  let status = "200"
  var stompClient = null;
  export default {
    components: {
      ElContainer,
      ElFooter,
      ElMain,
      ElHeader
    },
    name: 'interfaceList',
    data() {
      return {
        popUpWindows: false,
        items: [],
        pageSize: 15,
        pageNum: 1,
        total: 1,
        figureShow: false,
        id: "",
        alerttext: "禁用",
        checkDetail: [],
        status: "",
        interfaceType: "",
        type:"",
        Type: [],
        onceLoading:true,
        tableLoading:true,
      }

    },
    methods: {
//      断开连接
      disConnect(){
        if(stompClient != null) {
          stompClient.disconnect();
        }
      },
//      建立连接
      sockConnect() {
        var heartCheck = {
          timeout: 60000,//60ms
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function(){
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            this.start();
          },
          start: function(){
            var self = this;
            this.timeoutObj = setTimeout(function(){
              stompClient.send("HeartBeat");
              self.serverTimeoutObj = setTimeout(function(){
                socket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              }, self.timeout)
            }, this.timeout)

          }
        }
        let self=this;
        var socket = new SockJS(g.url + '/endpointWisely'); //1连接SockJS的endpoint是“endpointWisely”，与后台代码中注册的endpoint要一样。
        stompClient = Stomp.over(socket); //2创建STOMP协议的webSocket客户端。
        stompClient.connect({

        }, function(frame) { //3连接webSocket的服务端。
          console.log(frame)
          heartCheck.start();
          stompClient.subscribe('/topic/apiCheck', function(respnose) {
            if(JSON.parse(respnose.body)!==null || JSON.parse(respnose.body)!==undefined ){
              self.getinterfaceList()
              heartCheck.reset();
            }

          });

        });
        stompClient.heartbeat.outgoing = 20000;  // client will send heartbeats every 20000ms
        stompClient.heartbeat.incoming = 0;      // client does not want to receive heartbeats from the server
// The heart-beating is using window.setInterval() to regularly send heart-beats and/or check server heart-beats
        this.over = () => {
          self.disConnect()
        }
      },

//      下方导航跳转
      goSystem:function(){
        this.$router.push({path: "/menu"})
      },

      // 获取接口类型选项
      getinterfaceType: function () {
        const self = this;
        axios({
          method: 'GET',
          url: g.url + '/system/getSystemApiType?systemId=' + id,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'token': sessionStorage.getItem('token')
          }
        }).then(function (result) {
          if (result.status == 200) {
            self.Type = result.data.data;
          }else if (result.status == 401) {
            self.$message({
              type: 'error',
              message: result.msg + '!'
            })
            setTimeout(function(){
              self.$router.push({path: "/"});
            },2000)
          }
        }).catch(function (error) {
        })
      },

      // 获取接口列表，筛选
      getinterfaceList: function (flag) {

        const self = this;
        self.tableLoading=true;
        var URL;
        if (sessionStorage.getItem('systemid')) {
          id = sessionStorage.getItem('systemid')
          if(self.interfaceType==""){
            URL='/system/systemInterfaceManage?systemId=' + id + '&pageSize=' + self.pageSize + '&pageNum=' + self.pageNum +  '&status=' + status
          }else{
            URL='/system/systemInterfaceManage?systemId=' + id + '&pageSize=' + self.pageSize + '&pageNum=' + self.pageNum +  '&status=' + status +'&interfaceType=' + self.type
          }
          axios({
            method: 'GET',
            url: g.url + URL,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {

            if (result.status == 200) {
              self.items = result.data.data.list
              self.tableLoading=false;

              self.pageNum = result.data.data.pageNum;
              self.total = result.data.data.pages;
              cutPage(self.total,self.pageNum,self);

            }else if (result.status == 401) {
              self.$message({
                type: 'error',
                message: result.msg + '!'
              })
              setTimeout(function(){
                self.$router.push({path: "/"});
              },2000)
            }
          }).catch(function (error) {

          })

        } else {

        }
      },

      // 一键检测
      allCheck: function () {
        const self = this;
        self.popUpWindows = true;
        axios({
          method: 'GET',
          url: g.url + '/interface/debugAll?systemId=' + id,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'token': sessionStorage.getItem('token')
          }
        }).then(function (result) {

          if (result.status == 200) {
            self.checkDetail = result.data.data
            self.onceLoading=false
          }else if (result.status == 401) {
            self.$message({
              type: 'error',
              message: result.msg + '!'
            })
            setTimeout(function(){
              self.$router.push({path: "/"});
            },2000)
          }
        }).catch(function (error) {

        })

      },

      // 选择接口类型
      chooseType: function (data) {

        const self = this;
        if (data !== null) {

          self.interfaceType = data;
          self.type=self.interfaceType;
        } else {
          self.interfaceType = '全部';
          self.type="";
        }
        self.getinterfaceList();
        self.listLoading=true
      },

      // 禁用弹框
      disabledUse: function (data, flag) {
        const self = this;
        self.id = data.id;
        self.status = data.status;
        self.figureShow = true;
        if (flag == 0) {
          self.alerttext = "禁用"
        } else {
          self.alerttext = "启用"
        }
      },

      // 禁用启用操作
      closeFigure: function (data, flag) {
        const self = this;
        if (flag == 0) {
          self.figureShow = false;
        } else {
          axios({
            method: 'POST',
            url: g.url + '/interface/updateSystemInterfaceStatus?id=' + self.id + '&status=' + self.status,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {
            if (result.status == 200) {
              self.figureShow = false;
              self.$message({
                message: self.alerttext+'成功！',
                type: 'success'
              });
              self.getinterfaceList();
            }else if (result.status == 401) {
              self.$message({
                type: 'error',
                message: result.msg + '!'
              })
              setTimeout(function(){
                self.$router.push({path: "/"});
              },2000)
            }
          }).catch(function (error) {

          })
        }
      },

      // 启用禁用筛选
      cutInterfaceStatus: function (indexFlag, flag) {
        status = flag;
        $('ul.status-list').find('li').removeClass('active');
        $('ul.status-list').find('li:nth-child(' + indexFlag + ')').addClass('active');
        const self = this;
        self.getinterfaceList();
      },

      // 跳转详情
      goToInterfaceDetails: function (data) {
        this.$router.push({path: "/menu/sysInterfaceDetails"})
        sessionStorage.setItem('apiId', data.apiId);
      }
    },
    created() {
      vm = this;
//      vm.sockConnect()
    },
    mounted() {
      cutPage();
      this.getinterfaceList();
      this.getinterfaceType()

    },
    beforeDestroy () {
//      this.over()
    },
  }

  /*分页*/
//  function cutPage() {
//    $("#paging").CreatePage({
//      pageCount: Math.ceil(vm.total / vm.pageSize),//总页数
//      current: vm.pageNum,//当前页码
//      backFn: function (page) {
//        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
//      }
//    });
//  }

  function cutPage(pageCount,current,self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        self.pageNum = page;
        getAllListData(self);
      }
    });
  }

  function getAllListData(self) {
    var URL;
    if (sessionStorage.getItem('systemid')) {
      id = sessionStorage.getItem('systemid')
      if(self.interfaceType==""){
        URL='/system/systemInterfaceManage?systemId=' + id + '&pageSize=' + self.pageSize + '&pageNum=' + self.pageNum +  '&status=' + status
      }else{
        URL='/system/systemInterfaceManage?systemId=' + id + '&pageSize=' + self.pageSize + '&pageNum=' + self.pageNum +  '&status=' + status +'&interfaceType=' + self.type
      }
      axios({
        method: 'GET',
        url: g.url + URL,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'token': sessionStorage.getItem('token')
        }
      }).then(function (result) {

        if (result.status == 200) {
          self.items = result.data.data.list
          self.listLoading=false;

          self.pageNum = result.data.data.pageNum;
          self.total = result.data.data.pages;
          cutPage(self.total,self.pageNum,self);

        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }).catch(function (error) {

      })

    } else {

    }
  }

</script>
<style scoped>
  header {
    width: 100%;
    background-color: #ffffff;
    border-radius: 3px;
  }

  header div.title {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #e7eaec;
    font-size: 14px;
    color: #666666;
    font-weight: bold;
  }

  header div.title span {
    padding-left: 14px;
  }

  /*条件筛选*/

  header div.status > span {
    font-size: 14px;
    color: #76838f;
  }

  header div.status ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  header div.status ul li {
    display: inline-block;
    vertical-align: top;
    margin-right: 5px;
    border-radius: 2px;
    font-size: 13px;
    color: #fff;
    line-height: 22px;
    cursor: pointer;
  }

  header div.status ul li > span {
    display: inline-block;
    vertical-align: top;
    text-align: center;
  }

  header div.status ul li > span:last-child {
    width: 64px;
    height: 22px;
  }

  header div.status ul li.active > span:first-child {
    width: 25px;
    opacity: 1;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  header div.status ul li > span:first-child img {
    margin-top: 6px;
  }

  header div.status ul li > span:first-child {
    width: 0;
    height: 22px;
    opacity: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  header div.status ul li.all > span:first-child {
    background-color: #33ad78;
    border-radius: 3px;
  }

  header div.status ul li.all {
    background-color: #46be8a;
  }

  header div.status ul li.forbidden > span:first-child {
    background-color: #c78641;
    border-radius: 3px;
  }

  header div.status ul li.forbidden {
    background-color: #f2a654;
  }

  header div.status ul li.start-using > span:first-child {
    background-color: #44a0ab;
    border-radius: 3px;
  }

  header div.status ul li.start-using {
    background-color: #57c7d4;
  }

  div.condition-filtrate > div.status > span {
    margin-left: 20px;
    margin-right: 10px;
  }

  div.condition-filtrate > div.status {
    margin-top: 27px;
  }

  div.condition-filtrate > div.select {
    margin-top: 20px;
  }

  div.condition-filtrate > div.select > div {
    display: inline-block;
    vertical-align: top;
  }

  div.condition-filtrate > div.select .detection {
    width: 101px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #ffffff;
    background-color: #62a8ea;
    text-align: center;
    border-radius: 3px;
    margin-left: 17px;
    cursor: pointer;
  }

  div.condition-filtrate > div.select .detection img {
    width: 12px;
    height: 14px;
    margin-right: 2px;
  }

  div.condition-filtrate > div.select .detection img,
  div.condition-filtrate > div.select .detection span {
    display: inline-block;;
    vertical-align: middle;
  }

  /*接口列表*/

  div.interface-table {
    /*height: 703px;*/
    background-color: #ffffff;
    margin: 18px 0 22px 0;
    border-radius: 3px;
    overflow: auto;
    height: calc(100vh - 303px);
    /*height: 630px;*/
  }

  table.interface-list tbody tr:nth-child(even) {
    background-color: #f2fbff;
  }

  table.interface-list {
    width: 100%;
  }

  table.interface-list tr {
    height: 37px;
    line-height: 36px;
  }

  table.interface-list th {

    border-bottom: 1px solid #e7eaec;
  }

  table.interface-list th,
  table.interface-list td {
    padding-left: 16px;
    text-align: left;
    border-right: 1px solid #e7eaec;
    font-size: 12px;
  }

  table.interface-list tr > th:last-child,
  table.interface-list tr > td:last-child {
    border-right: none;
  }

  table.interface-list th {
    color: #3f494f;
    font-weight: normal;
  }

  table.interface-list td {
    color: #76838f;
  }
.interface-status{
    margin-left:5px;
  }

  table.interface-list td.operation > span {
    display: inline-block;
    margin-right: 3%;
    cursor: pointer;
  }

  table.interface-list td.operation img {
    vertical-align: middle;
    height: 12px;
    width: 12px;
  }

  table.interface-list td.operation img,
  table.interface-list td.operation i {
    font-size: 12px;
    display: inline-block;
  }

  table.interface-list td.operation i {
    margin-left: 5px;
  }
  /*table.interface-list td.operation i:before {*/
    /*color: #76838f;*/
  /*}*/
  /*table.interface-list td.operation.active i:before {*/
    /*color: #18d96e;*/
  /*}*/

  table.interface-list td i.status {
    font-weight: normal;
    font-style: normal;
    font-size: 10px;
    color: #fff;
    width: 39px;
    height: 18px;
    line-height: 18px;
    display: inline-block;
    border-radius: 2px;
    vertical-align: middle;
    text-align: center;
    margin-right: 11px;
  }

  table.interface-list td i.status.forbidden {
    background-color: #f2a654;
  }

  table.interface-list td i.status.start-using {
    background-color: #57c7d4;
  }
  table.interface-list td i.status.error {
    background-color: #ff4f59;
    margin-left:10px;
  }
  .no{
    display: none!important;
  }

  /*底部*/
  div.footer {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    color: #76838f;
    font-size: 13px;
    background-color: #ffffff;
  }

  div.footer ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  div.footer ul li {
    display: inline-block;
    vertical-align: top;
  }

  div.footer ul li i {
    margin-right: 3px;
  }

  /*弹窗*/
  div.pop-up-windows {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: transparent;
    top: 0;
  }

  div.pop-up-windows > div {
    width: 665px;
    height: 558px;
    background-color: #ffffff;
    box-shadow: 0px 1px 11px 0px rgba(58, 58, 63, 0.23);
    border-radius: 5px;
    border: solid 1px #d6dde2;
  }

  div.pop-up-windows div.window-content > div.title {
    height: 52px;
    line-height: 52px;
    padding: 0 19px 0 23px;
    border-bottom: 1px solid #e4eaec;
    font-size: 14px;
    color: #3f494f;
  }

  div.pop-up-windows div.title span.close-window {
    cursor: pointer;
  }

  div.pop-up-windows div.result-status > span,
  div.pop-up-windows div.result-status > div {
    display: inline-block;
    vertical-align: middle;
  }

  div.pop-up-windows div.result-status {
    margin: 47px 0 36px 39px;
  }

  div.pop-up-windows div.result-status > span {
    color: #f79c1b;
    font-size: 46px;
    margin-right: 19px;
  }

  div.pop-up-windows div.result-status > div > p {
    margin: 0;
    padding: 0;
  }

  div.pop-up-windows div.result-status > div > p:first-child {
    color: #3f494f;
    font-size: 14px;
  }

  div.pop-up-windows div.result-status > div > p:last-child {
    font-size: 20px;
    font-weight: bold;
  }

  div.pop-up-windows div.result-status > div > p:last-child span.normal {
    color: #33aa62;
  }

  div.pop-up-windows div.result-status > div > p:last-child span.abnormal {
    color: #ed5d2b;
  }

  div.pop-up-windows div.result-list {
    margin-left: 53px;
  }

  div.pop-up-windows div.result-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 46%;
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    height: 321px;
    overflow: auto;
  }

  div.pop-up-windows div.result-list ul span {
    display: inline-block;
    width: 80%;
    vertical-align: middle;
  }

  div.pop-up-windows div.result-list ul i {
    display: inline-block;
    vertical-align: middle;
    margin-top: 3px;
  }

  div.pop-up-windows div.result-list ul li {
    margin: 15px 0;
  }

  div.pop-up-windows div.result-list ul.normal i {
    color: #33aa62;
  }

  div.pop-up-windows div.result-list ul.abnormal i {
    color: #ed5d2b;
  }

  div.pop-up-windows button {
    width: 89px;
    height: 29px;
    background-color: #43c273;
    border-radius: 3px;
    border: none;
    color: #ffffff;
    font-size: 14px;
    position: absolute;
    bottom: 23px;
    right: 24px;
    cursor: pointer;
  }
</style>
<link rel="stylesheet" href="../../css/com.css">
