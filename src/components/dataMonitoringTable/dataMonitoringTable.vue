<template>

  <el-container style="margin-left: 200px;background-color:#f1f4f5;display: block ">

    <div class="guding">
      <el-main style="background-color: #f1f4f5;min-height: calc(100vh - 60px);overflow: visible;">

        <el-row :gutter="20">
          <el-col :span="24" style="padding-right: 0;padding-left: 25px;padding-top: 60px;">
            <div class="panel" v-for="(a,index) in 8">
              <div class="panel-heading">
                <div class="panel-title">
                  <span class="system-title">Druid{{index}}</span>
                </div>
              </div>
              <div class="panel-body">
                 <div style="width: 500px;height: 200px;">
                   <img style="width: 100%;height: 150px" src="../../../src/assets/test.png">
                   <div class="token-manage" @click="showToken(item.id,$event)">
                    <span style="line-height: 26px">查看详情</span>
                   </div>
                 </div>
              </div>

            </div>
          </el-col>
        </el-row>
      </el-main>
    </div>

    <el-footer
      style="padding: 0;background-color: #ffffff;color: #76838f; font-size: 13px;line-height: 75px;height: 75px;padding: 0 20px;">
      <div class="footer-left" style="display: inline-block;">
        <i class="icon wb-stats-bars" style="margin-right: 3px;"></i> 数据库监控
      </div>

      <!--页码-->
      <div class="page fr">
        <div>共{{pages}}页，当前在第{{changeNumber(pageNum)}}页</div>
        <div id="paging"></div>
      </div>
    </el-footer>
  </el-container>

</template>

<script>
  import echarts from 'echarts';
  import axios from 'axios'
  import g from '../common.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  //  import { Validator } from 'vee-validate'
  var vm;
  var Flag;
  var stompClient = null;


  export default {
    components: {ElButton},
    name: 'systemManage',
    data() {
      return {
        loading: true,
        pageNum: 1,
        pageSize: 15,
        pages: 1,
        total: 1,
        items: [


        ],
      }
    },
    created() {
      vm = this;
      let self = this;
      $(document).on('click', function (e) {
        var className = $(e.target).attr('class');
        if (className !== 'bgicon') {
          self.dropdownShow = false;
        }
      })
//      self.sockConnect()

    },
    mounted() {
      let self = this;
      sessionStorage.removeItem('systemid')
      self.loadSystem()

    },
    update() {
      let self = this;
//      self.disConnect()

    },
    beforeDestroy () {
//      this.over() //组件摧毁时断开连接
    },
    methods: {
      //连接websocket
      sockConnect() {
        //心跳检测机制
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
            let self = this;
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
              self.loadSystem()
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
      // 断开连接
      disConnect(){
        if(stompClient != null) {
          stompClient.disconnect();
        }
      },
      // 跳转
      goLink: function (data, e) {
        const self = this;
        self.disConnect()
        self.$router.push({path: '/menu/sysInterface'});
        sessionStorage.setItem('systemid', data.id);
      },

      //初始化获取微服务
      loadSystem: function () {
        const self = this;
        axios({
          method: 'GET',
          url: g.url + '/system/getAllSystem?pageNum=' + self.pageNum + '&pageSize=' + self.pageSize,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'token': sessionStorage.getItem('token')
          }
        }).then(function (result) {

          if (result.data.msg == 200) {
            self.items = result.data.data.list

            self.$nextTick(function () {
              self.pages = result.data.data.pages
              //pages
              self.cutPage();
            })
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
          console.log("error")
        })

      },

      //分页
      cutPage: function () {
        const self = this;
        $("#paging").CreatePage({
          pageCount: self.pages,//总页数
          current: self.pageNum,//当前页码
          backFn: function (page) {
            self.pageNum = page;
            self.loadSystem();
            //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
          }
        });
      },

      // 改变页码
      changeNumber: function (value) {
        var newvalue = value;
        switch (value) {
          case 1:
            newvalue = "一";
            break;
          case 2:
            newvalue = "二";
            break;
          case 3:
            newvalue = "三";
            break;
          case 4:
            newvalue = "四";
            break;
          case 5:
            newvalue = "五";
            break;
          case 6:
            newvalue = "六";
            break;
          case 7:
            newvalue = "七";
            break;
          case 8:
            newvalue = "八";
            break;
          case 9:
            newvalue = "九";
            break;
          case 10:
            newvalue = "十";
            break;
        }
        if (value > 10) {
          return "十" + newvalue
        } else {
          return newvalue
        }

      },
    }
  }

  //import axios from 'axios';

</script>

<style scoped>
  .add-icon span {
    font-size: 15px;
    line-height: 20px;
    display: block;

  }

  .panel {
    width: 500px;
    height: 210px;
    background-color: #fafafb;
    border-radius: 10px;
    padding: 15px;
    margin-right: 19px;
    margin-bottom: 20px;
    position: relative;
    float: left;
    border: solid 1px #e7eaec;
  }

  .system-title {
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    line-height: 27px;
    color: #526069;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;

  }
  .chart-detail-grey span, .chart-detail span {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    color: #ffffff;
    padding: 1px 0 0 15px;
    display: block;
  }



  .token-manage i {
    padding: 2px 0 0 12px;
  }

  .footer-left {
    position: relative;
    display: inline-block;
    color: #76838f;
  }


  .toggle-menu li {
    padding-left: 10px;
  }

  .toggle-menu li:hover {
    background-color: #eeeeee;
    outline: 1px solid #409EFF;
  }

  .guding {
    overflow: auto;
    height: calc(100vh - 75px);
  }
  .token-manage {
    width: 115px;
    height: 26px;
    float: right;
    border-radius: 3px;
    border: solid 1px #76838f;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    color: #76838f;
    cursor: pointer;
    bottom: 10px;
    position: absolute;
    right: 14px;
    text-align: center;

  }

  .token-manage:hover {
    background-color: #76838f;
    color: #ffffff;
    transition: border .2s linear, color .2s linear, width .2s linear, background-color .2s linear;
  }

  .token-manage i {
    padding: 2px 0 0 12px;
  }
  </style>
