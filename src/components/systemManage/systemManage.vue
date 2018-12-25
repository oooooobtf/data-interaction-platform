<template>

  <el-container style="margin-left: 200px;background-color:#f1f4f5;display: block ">

    <div class="guding">
      <el-main style="background-color: #f1f4f5;min-height: calc(100vh - 60px);overflow: visible;">

        <el-row :gutter="20">
          <el-col :span="24" style="padding-right: 0;padding-left: 25px;padding-top: 60px;">
            <div class="panel" style="background-color: #dee4e6;height: 208px;border: dashed 1px #9ca7ab">
              <div class="panel-body">
                <div class="add-icon" @click="addSystem(null,1,$event)">
                  <i class="icon wb-plus"></i>
                  <span>新增系统</span>
                </div>

              </div>
            </div>
            <div class="panel" v-for="(item,index) in items">
              <div class="panel-heading">
                <div class="panel-title">
                  <span class="system-title">{{item.name}}</span>
                  <span class="system-used" v-if="item.status=='VALID'" @click="deleteSystem(item,2,$event)">
                      启用中
                    <span class="system-used-icon">
                      <i class="icon wb-minus-circle"></i>
                    </span>
                  </span>
                  <span class="system-unused" v-else @click="deleteSystem(item,0,$event)">已禁用
                      <span class="system-unused-icon">
                        <i class="icon wb-check-circle"></i>
                      </span>
                  </span>
                  <span class="system-error" v-if="item.count>0">当前有{{item.count}}个接口异常</span>
                  <span class="system-delete-icon" @click="deleteSystem(item,1,$event)" v-if="item.status=='NOT'">
                      <i class="icon wb-trash" style="margin-left: 10px;"></i>
                  </span>
                  <span class="system-edit-icon">
                     <i class="icon wb-pencil" @click="addSystem(item,2,$event)"></i>
                  </span>

                </div>
              </div>
              <div class="panel-body">
                <template v-if="item.totalInterfaceNum!==0">
                  <div class="chart-left">
                    <div class="gauge" :id="gernerateId(index)" @click="goLink(item,$event)"></div>
                    <div class="chart-detail" v-if="item.status=='VALID'">
                      <span>在用接口：{{item.usingInterfaceNum}}</span>
                    </div>
                    <div class="chart-detail-grey" v-else>
                      <span>在用接口：{{item.usingInterfaceNum}}</span>
                    </div>
                  </div>
                  <div class="chartName-right">
                    <!--右侧结构-->
                    <div class="interface-list">
                      <div v-for="(interfaceName,index) in item.interfaceNames">
                        <div class="circle-blue" v-if="item.status=='VALID'">
                          <div class="circle"></div>
                        </div>
                        <div class="circle-grey" v-else>
                          <div class="circle-grey-ball"></div>
                        </div>
                        <div :class="index==item.interfaceNames.length-1?'circle-line-last':'circle-line'"
                             v-if="item.status=='VALID'">
                          <div class="circle-text">
                            {{interfaceName}}
                          </div>
                        </div>
                        <div :class="index==item.interfaceNames.length-1?'circle-gline-last':'circle-gline'" v-else>
                          <div class="circle-text">
                            {{interfaceName}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="color: #bababa;font-size: 14px;margin-left: 22px;bottom: 40px;position: absolute;"
                         v-if="item.moreInterface!==null">
                      更多{{item.moreInterface}}条...
                    </div>
                    <div class="token-manage" @click="showToken(item.id,$event)">
                      <i class="icon wb-wrench"> token管理</i>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="chart-left">
                    <div class="gauge" :id="gernerateId(index)"></div>
                  </div>
                  <div class="interlistbg">
                  </div>
                  <span class="interlist-text">暂无可用接口</span>
                </template>
              </div>

            </div>
          </el-col>
        </el-row>

        <div id="floor" class="pop-up-windows" v-show="figureShow" @click="closeFigure(null,0)"></div>
        <transition name="fade">
          <div id="deleted" class="tishi-windows" v-show="figureShow">
            <div class="tishi-top" style="margin-top: 10px;">
              <i class="icon wb-bell" style="color:#f96868;font-size: 22px;"></i>
              <span>确定删除该{{systemName}}系统？</span>
              <i class="icon wb-close"
                 style="color:#f96868;position:relative;float: right;padding-right: 10px; cursor: pointer"
                 @click="closeFigure(null,0)"></i>
              <!--<img src="../../img/close_red.png"></div> -->
              <div class="tishi-bottom">
                <span class="delete-span font-14" @click="closeFigure(null,1)">删除</span>
                <span class="cancel-span font-14" @click="closeFigure(null,0)">取消</span>
              </div>
            </div>
          </div>
        </transition>

        <div id="floor_" class="pop-up-windows" v-show="figureShow_j" @click="closeFigure_j(null,0)"></div>
        <div id="deleted_" class="tishi-windows" v-show="figureShow_j">
          <div class="tishi-top" style="margin-top: 10px;">
            <i class="icon wb-bell" style="color:#f96868;font-size: 22px;"></i>
            <span>确定{{alerttext}}该{{systemName}}系统？</span>
            <i class="icon wb-close"
               style="color:#f96868;position:relative;float: right;padding-right: 10px; cursor: pointer"
               @click="closeFigure_j(null,0)"></i>
            <!--<img src="../../img/close_red.png"></div> -->
            <div class="tishi-bottom">
              <span class="delete-span font-14" @click="closeFigure_j(alerttext,1)">{{alerttext}}</span>
              <span class="cancel-span font-14" @click="closeFigure_j(null,0)">取消</span>
            </div>
          </div>
        </div>

      </el-main>
    </div>

    <!--<el-dialog :title=title  :before-close="emptyArray" :visible.sync="dialogFormVisible" width="40%" label-width="50px" >-->
    <el-dialog :title=title :before-close="emptyArray" :visible.sync="dialogFormVisible" width="762px"
               label-width="50px">
      <el-form :model="form" :inline="true" style="height: 500px;margin-left: 39px;">
        <el-form-item label="系统名称" class="el-col-20">
          <el-input v-model="form.systemName" auto-complete="off" style="width: 500px;" @blur="valiForm(1)"></el-input>
          <span class="alert-vali" v-show="alertName">{{alertVali}}</span>
          <!--<span v-show="errors.has('name')">{{ errors.first('name')}}</span>-->
        </el-form-item>
        <el-form-item label="分配接口">
          <el-transfer
            filterable
            :titles="['所有接口', '目标接口']"
            :filter-method="filterMethod"
            filter-placeholder="请输入"
            v-model="form.interfaceList"
            :data="data2"
            style="margin-top: 10px;"
          >
            <span v-show="errors.has('list')">{{ errors.first('list')}}</span>
          </el-transfer>
        </el-form-item>
        <el-form-item label="失效方式" class="el-col-20">
          <span style="margin-right: 20px;">使用时长</span>
          <label for="time1">
            <input type="radio" name="time" id="time1" @click="chooseTime">永久有效
          </label>
          <label for="timelist">
            <input type="radio" name="time" id="timelist" :value="getnowtime()">自定义
            <!--<input type="radio" name="time" id="timelist"  lay-key="7">自定义-->
          </label>
          <div class="time-list">
            <span class="time-icon">
              <i class="iconmar icon wb-calendar"></i>
            </span>
            <!--<input  type="text" id="timelist1"  placeholder="请选择时间" v-model="form.selecttime"  class="notice-time color-content font-14" lay-key="1" >-->
            <input type="text" id="timelist1" placeholder="请选择时间" v-model="form.selecttime"
                   class="notice-time color-content font-14">
            <span class="overtime-icon" @click="emptyData(null,1)">
              <i class="iconmar icon wb-close"></i>
            </span>
          </div>

          <br>
          <span>使用次数</span>
          <label for="count" style="margin-left: 20px;">
            <input type="radio" name="count" id="count" @click="choosecount">不限次
          </label>
          <label for="count1" style="margin-left: 14px;">
            <input type="radio" name="count" id="count1" @click="inputfocus">自定义
          </label>
          <el-input size="small" class="time-input" v-model="form.count" id="time-input" style="display: inline-block;"
                    @focus="radiofocus"></el-input>
          <span style="right: -160px;
    display: inline-block;
    position: absolute;">次</span>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="margin-right: 15px;">
        <el-button type="primary" size="medium" style="margin-bottom: 20px;" @click="postSystem()">提交
        </el-button>
        <el-button size="medium" class="btnclose" @click="cancelAddSys()">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog :title=title1 :visible.sync="Tokendialog" width="40%" label-width="50px" :before-close="emptyToken">
      <el-form :model="Tokenform" style="height: 300px;margin-left: 50px;">
        <el-form-item label="您的token值如下：" class="el-col-15">
          <el-input v-model="Tokenform.token" auto-complete="off" readonly></el-input>
          <span class="alert-vali" v-show="alertToken">{{alertVali}}</span>
        </el-form-item>
        <el-form-item class="el-col-7" style="margin-top: 40px;margin-left: 40px;">
          <el-button v-clipboard:copy="Tokenform.token" v-clipboard:success="onCopy" class="copybtn" size="small">复制
          </el-button>
          <el-button size="small" @click="changetoken()" class="changebtn">更换</el-button>
        </el-form-item>
        <el-form-item label="失效时间：" class="el-col-20">
          <div class="time-list" style="position: absolute;left: 0;margin-top: 50px;">
                  <span class="time-icon" style="top: 1px;">
                    <i class="iconmar icon wb-calendar"></i>
                  </span>
            <!--<input  type="text" id="timelist2"  placeholder="请选择时间" v-model="form.tokenselecttime"  class="notice-time color-content font-14" lay-key="5" >-->
            <input type="text" id="timelist2" placeholder="请选择时间" v-model="form.tokenselecttime"
                   class="notice-time color-content font-14">
            <span class="overtime-icon" @click="emptyData(null,2)" style="top: 1px;">
                    <i class="iconmar icon wb-close"></i>
                  </span>
          </div>
        </el-form-item>
        <el-form-item label="剩余次数：" class="el-col-9" style="margin-top: 50px;position: relative">
          <div style="position: absolute;width: 100%;height: 32px;box-sizing: border-box;padding-left: 12px;top: 45px;"
               v-if="Tokenform.count === -100">无限次
          </div>
          <input type="text" :style="Tokenform.count===-100?'color:rgba(0,0,0,0)':''" class="bgicon"
                 style="margin-top: 50px;left: 0;margin-left: 0;" v-model="Tokenform.count" contenteditable="false"
                 readonly="readonly" @click="togglelist($event)">
          <ul class="toggle-menu" style="margin-top: 81px;margin-left: 0;" v-show="dropdownShow">
            <li @click="selectcount(-100,1)">无限次</li>
            <li v-for="countt in Formcount" @click="selectcount(countt,1)">{{countt}}</li>
          </ul>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer " style="margin-right: 15px;">
        <el-button type="primary" size="medium" style="margin-bottom: 20px;" @click="postToken()">提交
        </el-button>
        <el-button size="medium" class="btnclose" @click="Tokendialog = false">取消</el-button>
      </div>
    </el-dialog>


    <el-footer
      style="padding: 0;background-color: #ffffff;color: #76838f; font-size: 13px;line-height: 75px;height: 75px;padding: 0 20px;">
      <div class="footer-left">
        <i class="icon wb-desktop" style="margin-right: 3px;"></i> 系统管理
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
        alertName: false,
        alertToken: false,
        alertVali: "",
        pageNum: 1,
        pageSize: 15,
        pages: 1,
        total: 1,
        data2: [],
        Formcount: [500, 1000, 1500, 2000],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        errorNum: 0,
        rules: [],
        items: [],
        interFaces: [],
        newinterface: [],
        timelabel: "自定义",
        title: "新建系统",
        alerttext: "启用",
        title1: "Token管理",
        figureShow: false,
        figureShow_j: false,
        dropdownShow: false,
        systemName: "",
        dialogFormVisible: false,
        Tokendialog: false,
        time: "永久有效",
        count: "-100",
        valitime: "",
        valicount: "",
        form: {
          systemName: "",
          interfaceList: [],
          time: "",
          usertime: "",
          count: "",
          id: "",
          valid: "",
          selecttime: "",
          tokenselecttime: ""
        },
        Tokenform: {
          token: ""
        }
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
      this.getnowtime();
      let self = this;
      sessionStorage.removeItem('systemid')
      self.loadSystem()

    },
    update() {
      let self = this;
//      self.disConnect()

    },
    beforeDestroy() {
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
          reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            this.start();
          },
          start: function () {
            let self = this;
            this.timeoutObj = setTimeout(function () {
              stompClient.send("HeartBeat");
              self.serverTimeoutObj = setTimeout(function () {
                socket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              }, self.timeout)
            }, this.timeout)

          }
        }
        let self = this;
        var socket = new SockJS(g.url + '/endpointWisely'); //1连接SockJS的endpoint是“endpointWisely”，与后台代码中注册的endpoint要一样。
        stompClient = Stomp.over(socket); //2创建STOMP协议的webSocket客户端。
        stompClient.connect({}, function (frame) { //3连接webSocket的服务端。
          console.log(frame)
          heartCheck.start();
          stompClient.subscribe('/topic/apiCheck', function (respnose) {
            if (JSON.parse(respnose.body) !== null || JSON.parse(respnose.body) !== undefined) {
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
      disConnect() {
        if (stompClient != null) {
          stompClient.disconnect();
        }
      },
      // 复制
      onCopy() {
        this.$message({
          message: '复制成功！',
          type: 'success'
        });
      },

      //选择单选自动聚焦输入框
      inputfocus: function () {
        $('#time-input').focus();
      },

      radiofocus: function () {
        $("input[name='count']").prop("checked", true);
      },
//      更换token
      changetoken: function () {
        const self = this;
        axios({
          method: 'GET',
          url: g.url + '/system/getToken',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
        }).then(function (result) {

          if (result.data.msg == 200) {
            self.Tokenform.token = result.data.data
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

//      关闭弹窗清空数据
      emptyToken: function () {
        const self = this;
        self.Tokenform.token = "";
        self.form.tokenselecttime = "";
        self.Tokenform.count = "";
        self.Tokendialog = false;
        self.dropdownShow = false;
      },

//      选择永久
      chooseTime: function () {
        this.form.time = "";
        this.valitime = this.time;
        this.form.selecttime = "";
      },
      choosecount: function () {
        this.form.count = "";
        this.valicount = this.count;
      },

      // 获取时间格式
      getnowtime: function () {
        var data = new Date;
        var year = data.getFullYear();
        var mon = data.getMonth() + 1;
        var day = data.getDate();
        if (mon < 10) {
          mon = "0" + mon;
        }
        if (day < 10) {
          day = "0" + day;
        }

        return year + "-" + mon + "-" + day;

      },

      // 跳转
      goLink: function (data, e) {
        const self = this;
        self.disConnect()
        self.$router.push({path: '/menu/sysInterface'});
        sessionStorage.setItem('systemid', data.id);

      },

      //初始化系统
      loadSystem: function () {
        const self = this;
        axios({
          method: 'GET',
          url: g.url + '/system/getAllSystem?pageNum=' + self.pageNum + '&pageSize=' + self.pageSize,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'token': sessionStorage.getItem('token')
          },
        }).then(function (result) {

          if (result.status == 200) {
            self.items = result.data.data.list

            self.$nextTick(function () {
              self.pages = result.data.data.pages
              //pages
              self.cutPage();
              var gauges = $('.gauge');
              for (var i = 0; i < gauges.length; i++) {
                var id = $(gauges[i]).attr('id');
                if (self.items[i].totalInterfaceNum == 0) {
                } else {
                  createPie(id, self.items[i].totalInterfaceNum, self.items[i].status);
                }
              }
              $('canvas').mouseover(function () {
                $(this).css('cursor', 'pointer')
              })
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

      // 生成圆环id
      gernerateId: function (index) {
        return "gauge" + index
      },

      // 添加系统
      addSystem: function (data, flag, e) {
//        1：新建  2：编辑
        const self = this;
        self.dialogFormVisible = true;


        self.$nextTick(function () {
          $("#time1").click();
          $("#count").click();
          laydate.render({
            elem: '#timelist',
            theme: "#62a8ea",
            done: function (value, date, endDate) {
              self.$nextTick(function () {
                self.form.selecttime = value;
                self.form.time = self.form.selecttime
                self.valitime = self.form.time
              })
            }
          });
          laydate.render({
            elem: '#timelist1',
            theme: "#62a8ea",
            done: function (value, date, endDate) {
              self.$nextTick(function () {
                self.form.selecttime = value;
                self.form.time = self.form.selecttime
                self.valitime = self.form.time
              })
            }
          });
        })
        e.stopPropagation()
        if (flag == 1) {
          Flag = 1
          self.form.systemName = "";
          self.form.selecttime = "";
          self.form.count = ""
          $("input[name='time']").prop("checked", false);
          $("input[name='count']").prop("checked", false);
          axios({
            method: 'get',
            url: g.url + '/system/newSystem',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {
            if (result.status == 200) {
              for (var i = 0; i < result.data.data.length; i++) {
                self.data2.push({
                  label: result.data.data[i].name,
                  key: result.data.data[i].id
                })
              }
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
        else {
          self.title = "编辑系统"
          self.form.id = data.id;
          Flag = 2;
          axios({
            method: 'get',
            url: g.url + '/system/info?id=' + data.id,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }

          }).then(function (result) {
            if (result.status == 200) {
              if (result.data.data.notChoose !== null) {
                for (let i = 0; i < result.data.data.notChoose.length; i++) {
                  self.data2.push({
                    label: result.data.data.notChoose[i].name,
                    key: result.data.data.notChoose[i].id
                  })
                }
              }
              if (result.data.data.selected !== null) {
                for (let i = 0; i < result.data.data.selected.length; i++) {
                  self.form.interfaceList.push(
                    result.data.data.selected[i].id
                  )
                }
              }
              self.form.systemName = result.data.data.name;
              self.form.selecttime = result.data.data.failTime;
              self.form.count = result.data.data.remainingTimes;
              if (self.form.selecttime == null) {
                $("input[name='time']:eq(0)").prop("checked", true);
                self.form.selecttime = "";
              } else {
                self.form.selecttime = (result.data.data.failTime).substring(0, 19);
                $("input[name='time']:eq(1)").prop("checked", true);
              }
              if (self.form.count == null) {
                $("input[name='count']:eq(0)").prop("checked", true);
                self.form.count = "";
              } else {
                self.form.count = result.data.data.remainingTimes;
                $("input[name='count']:eq(1)").prop("checked", true);
              }
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

//      提交数据
      postSystem: function () {
        const self = this;
        var url;
        if (self.form.count !== "") {
          self.valicount = self.form.count
        }
        self.dialogFormVisible = true;
        var data;
        var msg;
        if (Flag == 1) {
          url = "/system/saveNewSystem";
          msg = "提交成功！";
          if (self.form.time == "") {
            data = {
              "interfaces": self.form.interfaceList,
              "remainingTimes": self.valicount,
              "systemName": self.form.systemName
            }
          } else {
            data = {
              "failTime": self.form.time + " 00:00:00",
              "interfaces": self.form.interfaceList,
              "remainingTimes": self.valicount,
              "systemName": self.form.systemName
            }
          }
        } else {
          url = "/system/update";
          msg = "编辑成功！"
          if (self.form.time == "") {
            self.valitime = "-999"
            data = {
              "id": self.form.id,
              "interfaces": self.form.interfaceList,
              "remainingTimes": self.valicount,
              "systemName": self.form.systemName
            }
          } else {
            data = {
              "failTime": self.form.time + " 00:00:00",
              "interfaces": self.form.interfaceList,
              "remainingTimes": self.valicount,
              "systemName": self.form.systemName,
              "id": self.form.id,
            }
          }
        }
        let reg =/[^\a-\z\A-\Z\u4E00-\u9FA5]/g;
        if (self.form.systemName !== "") {
          if (reg.test(self.form.systemName) == true) {
            self.$message({
              type: "error",
              message: "系统名称只能输入中文和英文字符！"
            })
            return;
          }
        } else {
          self.$message({
            type: "error",
            message: "系统名称不能为空！"
          })
          return;
        }
        if (document.getElementById('count').checked) {

        } else {
          if (self.valicount !== "") {
            var regNumber = /^[0-9]+$/;
            if (!regNumber.test(self.valicount)) {
              self.$message({
                type: "error",
                message: "使用次数只能输入数字！"
              })
              return;
            }
          }
        }

        //form.systemName
        if (self.form.systemName !== "" && self.form.interfaceList.length !== 0 && self.valitime !== "" && self.valicount !== "") {
          axios({
            method: 'post',
            url: g.url + url,
            data: data,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {
            if (result.status == 200) {
              self.$message({
                type: "success",
                message: msg
              })
              self.dialogFormVisible = false;
              self.emptyArray();
              self.loadSystem();
            } else if (result.status == 401) {
              self.$message({
                type: 'error',
                message: result.msg + '!'
              })
              setTimeout(function(){
                self.$router.push({path: "/"});
              },2000)
            }else {
              self.$message({
                type: "error",
                message: result.data.msg
              })
            }
          }).catch(function (error) {

          })
        } else {

          self.$message({
            type: "error",
            message: "请完善系统信息！"
          })
        }
      },

//      token提交
      postToken: function () {
        const self = this;
        var data = {
          "id": self.form.id,
          "token": self.Tokenform.token,
          "failTime": self.form.tokenselecttime + " 00:00:00",
          "remainingTimes": self.Tokenform.count
        }
        if (self.Tokenform.token !== "" && self.form.tokenselecttime !== "" && self.Tokenform.count !== "") {
          axios({
            method: 'post',
            url: g.url + '/system/updateToken',
            data: data,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {
            if (result.status == 200) {
              self.$message({
                type: "success",
                message: "token更新成功！"
              })
              self.Tokendialog = false;
              self.loadSystem();

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
          self.$message({
            type: "error",
            message: "请完善你的token管理信息！"
          })
        }

      },

      // 清除穿梭框数据
      emptyArray: function () {
        this.data2 = [];
        this.form.interfaceList = []
        this.dialogFormVisible = false;
      },
      //dialogFormVisible = false
      cancelAddSys: function () {
        var self = this;
        self.emptyArray();
        self.dialogFormVisible = false
      },
      // 删除系统
//    弹框  1删除  0启用  2:禁用
      deleteSystem: function (data, flag, e) {
        if (flag == 1) {
          this.figureShow = true;

        } else if (flag == 0) {
          this.alerttext = "启用";
          this.figureShow_j = true;

        } else {
          this.alerttext = "禁用";
          this.figureShow_j = true;

        }
        this.form.id = data.id
        this.form.valid = data.status;
        this.systemName = data.name;
        e.stopPropagation();
      },

//    show Token弹框
      showToken: function (id, e) {
        const self = this;
        self.form.id = id;
        axios({
          method: 'get',
          url: g.url + '/system/tokenManage?systemId=' + id,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'token': sessionStorage.getItem('token')
          }
        }).then(function (result) {
          if (result.status == 200) {
            self.Tokenform.token = result.data.data.token;
            self.form.tokenselecttime = (result.data.data.failTime).substring(0, 11)
            self.Tokenform.count = result.data.data.remainingTimes
            laydate.render({
              elem: '#timelist2',
              theme: "#62a8ea",
              done: function (value, date, endDate) {
                self.$nextTick(function () {
                  self.form.tokenselecttime = value;
                })
              },
            });
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
        self.Tokendialog = true;
        e.stopPropagation();
      },

//      删除系统
      closeFigure: function (data, flag) {
        const self = this;
        if (flag == 0) {
          self.figureShow = false;
        } else {
          // console.log("删除")
          axios({
            method: 'post',
            url: g.url + '/system/deleteSystem?systemId=' + self.form.id,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {

            if (result.status == 200) {
              self.figureShow = false;
              self.$message({
                type: 'success',
                message: '删除成功!'
              });
              self.loadSystem()
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

      closeFigure_j: function (data, flag) {
        const self = this;
        if (flag == 0) {
          self.figureShow_j = false;
        } else {
          axios({
            method: 'post',
            url: g.url + '/system/updateStatus?id=' + self.form.id + '&status=' + self.form.valid,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {

            if (result.status == 200) {
              self.figureShow_j = false;
              self.$message({
                type: 'success',
                message: data + '成功！'
              });
              self.loadSystem()
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
        }
      },

//      下拉
      togglelist: function (e) {
        //console.log($(e.target).siblings().find("ul"))
        this.dropdownShow = !this.dropdownShow;
        $(e.target).siblings().find("ul").css({
          "-webkit-transition": "all .3s",
          "transition": "all .3s",
          "border-color": " #409EFF"
        })

      },

//      选择次数
      selectcount: function (data, flag) {
        if (flag == 0) {
          this.form.count = data;
        } else {
          this.Tokenform.count = data;
        }
        this.dropdownShow = false;
      },

//      清空日期
      emptyData(value, flag) {
        if (flag == 1) {
          if ($('#timelist1').val().trim().length > 0) {
            $('#timelist1').val('');
            this.form.selecttime = "";
          }
        } else {
          if ($('#timelist2').val().trim().length > 0) {
            $('#timelist2').val('');
            this.form.tokenselecttime = "";
          }
        }

      },


//      验证
      valiForm: function (flag) {
        const self = this;
        let reg = /^[u4e00-u9fa5·0-9A-z]+$/
        if (flag == 1) {
//          if(self.form.systemName!==""){
//            if(reg.test(self.form.systemName)==true){
//              self.alertVali="只能输入中文和英文字符"
//              self.alertName=true;
//            }else{
//              self.alertName=false;
//            }
//          }else{
//            self.alertVali="系统名称不能为空"
//            self.alertName=true;
//          }
        } else {
          if (self.Tokenform.token == "") {
            self.alertVali = "token不能为空,请更换token！"
            self.alertName = true;
          }
        }

      },

    }
  }

  //创建圆环
  function createPie(id, per, status) {
    var el = echarts.init(document.getElementById(id));
    var bgColor;
    switch (status) {
      case "VALID":
        bgColor = "#a58add";
        break;
      case "NOT":
        bgColor = "#cccccc";
        break;
    }

    var option = {
      title: {
        text: per,
        x: 'center',
        y: '20%',
        textStyle: {
          fontSize: 30,
          color: "#526069",
          fontWeight: 'bold',
        },
        subtext: "接口总计",
        subtextStyle: {
          color: '#526069',
          fontSize: 14,
          fontFamily: "Microsoft Yahei"
        },
      },
      series: [
        {
          name: id,
          type: 'pie',
          radius: ['75%', '90%'],
          center: ['50%', '45%'],
          hoverAnimation: false,
          startAngle: 235,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: per * 273.6 / 360,
//            value: 10,
//            name: per ,
              roseType: 'radius',
              label: {normal: {position: 'center', fontSize: 28, color: '#37474f', fontWeight: 'bold',}},
              itemStyle: {normal: {color: bgColor}, emphasis: {color: bgColor}}
            },
            {
              // value: (per * (55 / 360)),
              value: 76 - per * 273.6 / 360,
              itemStyle: {normal: {color: '#e4eaec'}, emphasis: {color: "#e4eaec"}}
            },
            {
              // value: (per * (70 / 360)),
              value: 18,
              itemStyle: {normal: {color: '#fafafb'}, emphasis: {color: "#fafafb"}}
            }
          ]
        }
      ]
    }
    el.setOption(option);
    window.addEventListener("resize", function () {
      el.resize();
    });
  }
  //import axios from 'axios';

</script>

<style scoped>
  .add-icon {
    color: #526069;
    margin: 0 auto;
    width: 100px;
    text-align: center;
    padding: 70px 0;
    font-size: 50px;
    cursor: pointer;
  }

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

  .panel-title {

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

  .system-used {
    border-radius: 3px;
    width: 67px;
    height: 17px;
    padding: 2px 0px 2px 8px;
    color: #ffffff;
    display: inline-block;
    background-color: #62a8ea;
    font-size: 12px;
    /*top: 18px;*/
    /*position: absolute;*/
    cursor: pointer;
  }

  .system-unused {
    border-radius: 3px;
    width: 67px;
    height: 17px;
    padding: 2px 0px 2px 8px;
    color: #ffffff;
    display: inline-block;
    background-color: #b1b9bc;
    /*background-color: #99a0a3;*/
    font-size: 12px;
    /*top: 18px;*/
    /*position: absolute;*/
    cursor: pointer;
  }

  .system-unused-icon {
    background-color: #99a0a3;
    padding: 4px 5px 2px 5px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    margin-left: 5px;
  }

  .system-used-icon {
    background-color: #5793cb;
    padding: 4px 5px 2px 5px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    margin-left: 5px;
  }

  .system-delete-icon {
    /*display: inline-block;*/
    /*position: absolute;*/
    /*right: 20px;*/
    float: right;
    color: #526069;
    padding: 2px 15px 0 0;
    font-size: 14px;
    cursor: pointer;
  }

  .system-error {
    display: inline-block;
    vertical-align: middle;
    font-size: 15px;
    color: #ff4a4a;
    margin-left: 5px;
  }

  .system-edit-icon {
    /*display: inline-block;*/
    /*position: absolute;*/
    /*right: 50px;*/
    float: right;
    color: #526069;
    padding: 2px 15px 0 0;
    font-size: 14px;
    cursor: pointer;
  }

  .chart-left {

    height: 130px;
    float: left;
    padding: 15px;
    position: relative;
  }

  .chartName-right {
    padding: 15px;
    float: right;
    width: 285px;
  }

  .circle-blue {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #bedefc;
    position: relative;
  }

  .circle-grey {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #e4eaec;
    position: relative;
  }

  .circle-grey-ball {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #b1b9bc;
    position: absolute;
    top: 3px;
    left: 3px;
  }

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #62a8ea;
    position: absolute;
    top: 3px;
    left: 3px;
  }

  .circle-line {
    border-left: 1px solid #bedefc;
    width: 280px;
    height: 17px;
    position: relative;
    margin-left: 8px;
  }

  .circle-line-last {
    width: 280px;
    height: 10px;
    position: relative;
    margin-left: 8px;
  }

  .circle-gline {
    border-left: 1px solid #e4eaec;
    width: 280px;
    height: 17px;
    position: relative;
    margin-left: 8px;
  }

  .circle-gline-last {
    width: 280px;
    height: 10px;
    position: relative;
    margin-left: 8px;
  }

  .circle-text {
    position: absolute;
    top: -16px;
    left: 15px;
    font-size: 14px;
    line-height: 18px;
  }

  .gauge {
    width: 145px;
    height: 145px;
    cursor: pointer !important;
  }

  .chart-detail {
    width: 106px;
    height: 20px;
    background-color: #54bd72;
    border-radius: 10px;
    margin: 0 auto;
  }

  .chart-detail-grey {
    width: 106px;
    height: 20px;
    background-color: #b1b9bc;
    border-radius: 10px;
    margin: 0 auto;
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

  .interface-list {

    position: absolute;
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
    bottom: 15px;
    position: absolute;
    right: 20px;

  }

  .token-manage:hover {
    background-color: #76838f;
    color: #ffffff;
    transition: border .2s linear, color .2s linear, width .2s linear, background-color .2s linear;
  }

  .token-manage i {
    padding: 2px 0 0 12px;
  }

  .footer-left {
    position: relative;
    display: inline-block;
    color: #76838f;
  }

  .toggle-menu {
    position: absolute;
    border: 1px solid #dcdfe6;
    width: 54%;
    border-radius: 4px;
    list-style: none;
    background-color: white;
    margin: 0;
    padding: 0;
    margin-left: 75px;
  }

  .toggle-menu li {
    padding-left: 10px;
  }

  .toggle-menu li:hover {
    background-color: #eeeeee;
    outline: 1px solid #409EFF;
  }

  /*验证*/
  .alert-vali {
    color: #ff4f59;
    display: block;
    height: 11px;
  }

  .copybtn, :link {
    color: #76838f;
    border-color: #76838f
  }

  .changebtn, :link {
    color: #f2a654;
    border-color: #f2a654
  }

  .changebtn:focus {
    color: #f2a654;
    border-color: #f2a654;
    background-color: #ffffff;
  }

  .copybtn:visited {
    color: #76838f;
    border-color: #76838f;
    background-color: #ffffff;
  }

  .copybtn:hover {
    background-color: #76838f;
    color: #ffffff;
  }

  .changebtn:hover {
    background-color: #f2a654;
    color: #ffffff;
  }

  .changebtn:visited {
    background-color: #ffffff;
    color: #f2a654;
    border-color: #f2a654
  }

  .interlistbg {
    background: url("../../assets/API.png");
    background-size: 100%;
    width: 81px;
    height: 81px;
    margin: 0 auto;
    margin-top: 40px;
    margin-bottom: 5px;

  }

  .interlist-text {
    margin-top: 10px;
    display: block;
    margin: 0 auto;
    width: 100px;
    color: #d5e2fc;
  }

  .guding {
    overflow: auto;
    height: calc(100vh - 75px);
  }


</style>
<link rel="stylesheet" href="../../css/com.css">
