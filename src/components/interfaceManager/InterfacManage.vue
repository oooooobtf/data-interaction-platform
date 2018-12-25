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
                <input placeholder="接口类型" v-model="typeText" contenteditable="false"
                       style="outline: none;cursor: default" readonly class="dropdown-toggle" data-toggle="dropdown"/>
                <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon fa-sort-down"></i></span>
                <ul class="no-header down-content dropdown-menu">
                  <li @click="getDataByType('')">全部</li>
                  <li v-for="item in allType" @click="getDataByType(item)">{{item}}</li>
                </ul>
              </div>
            </div>

            <!--新增接口-->
            <div class="add-interface" @click="showAddPort(1)">
              <i class="icon wb-plus"></i><span>新增接口</span>
            </div>

            <!--一键检测-->
            <div class="detection" @click="aKeyTest()">
              <img src="../../assets/detection-icon.svg"/>
              <span>一键检测</span>
            </div>
          </div>
        </div>
      </el-header>

      <div class="interface-table" v-loading="tableLoading"
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
            <th class="operation" style="width: 200px">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in tableData">
            <td class="interface-name">
              <i class="status "
                 :class="item.status=='NOT'?'forbidden':'start-using'">{{item.status == 'NOT' ? '禁用中' : '启用中'}}</i>
              <span>{{item.apiName}}</span>
            </td>
            <td class="interface-type"><span>{{item.type}}</span></td>
            <td class="interface-net"><span>{{item.apiAccess}}</span></td>
            <td class="interface-count"><span>{{item.callNum}}次</span></td>
            <td class="operation" style="width: 200px">
              <span @click="goToInterfaceDetails(item.apiId)">调试<i><img src="../../assets/debug-icon.svg"/></i></span>
              <span @click="showUsingAndForbiddenPop(item.id,item.status)"
                    :class="item.status=='NOT'?'forbidden':'start-using'">{{item.status == 'NOT' ? '禁用' : '启用'}}<i
                class="icon wb-minus-circle"></i></span>
              <span @click="showAddPort(2,item.apiId)" v-if="item.type==='CUSTOM'">编辑<i class="icon wb-edit"></i></span>
              <!--<span>查看详情<i class="icon wb-list"></i></span>-->
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
            <i class="icon fa-code-fork"></i>
            <!--<span>系统管理</span>-->
            <span>接口管理</span>
          </li>
          <li></li>
        </ul>
      </div>
      <!--页码-->
      <div class="page fr">
        <div>共{{totalPage}}页，当前在第{{currentPage}}页</div>
        <div id="paging"></div>
      </div>
    </div>

    <!--检测结果的弹窗-->
    <div class="pop-up-windows detection-pop" v-show="popUpWindows">
      <div class="lucency-pop" @click="closePopUpWindows()"></div>
      <div class="vertical-center window-content"
           v-loading="onceLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
        <div class="title clearfix">
          <span class="fl">检测结果</span>
          <span class="icon wb-close fr close-window" @click="closePopUpWindows()"></span>
        </div>
        <div class="result-status">
          <span class="icon wb-alert-circle"></span>
          <div>
            <p>本次检测结果:</p>
            <p>
              <span class="normal"> {{aKeyTestData.successTotal}}个接口正常</span>，<span
              class="abnormal">{{aKeyTestData.errorTotal}}个异常</span>。
            </p>
          </div>
        </div>
        <!--检测结果列表-->
        <div class="result-list">
          <!--正常-->
          <ul class="normal">
            <li v-for="item in  successInterfaces">
              <i class="icon wb-check-circle "></i>
              <span class="handle-text">{{item}}</span>
            </li>

          </ul>
          <!--异常-->
          <ul class="abnormal">
            <li v-for="item in errorInterfaces">
              <i class="icon wb-alert-circle"></i>
              <span class="handle-text">{{item}}</span>
            </li>

          </ul>
        </div>
        <button @click="closePopUpWindows()">确认</button>
      </div>
    </div><!--弹窗  end-->

    <!--新增接口的弹窗-->
    <div class="pop-up-windows add-port-pop" v-show="isShowAddInterface">
      <div class="lucency-pop" @click="closeAddPort()"></div>
      <div class="vertical-center window-content"
           v-loading="onceLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
        <div class="title clearfix">
          <span class="fl">{{title}}</span>
          <span class="icon wb-close fr close-window" @click="closeAddPort()"></span>
        </div>

        <div class="pop-panel">
          <div class="row-line">
            <div style="width: 100%">
              <p>数据源</p>
              <div class="select-down dropdown">
                <div>
                  <input placeholder="请选择数据源" v-model="form.source" contenteditable="false"
                         style="outline: none;cursor: default;" readonly class="dropdown-toggle"
                         data-toggle="dropdown"/>
                  <span class="dropdown-toggle" data-toggle="dropdown" style="position: absolute;right: 0;top: 0;"><i
                    class="icon fa-sort-down"></i></span>
                  <ul class="no-header down-content dropdown-menu">
                    <li v-for="(item,index) in dataSource" @click="selectMode(item,'source')">{{item.name}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row-line">
            <div style="width: 100%">
              <p>名称</p>
              <div><input type="text" v-model="form.interfaceName"/></div>
            </div>
          </div>

          <!--<div class="row-line">-->
          <!--<div style="width: 100%">-->
          <!--<p>类型</p>-->
          <!--<div class="select-down dropdown">-->
          <!--<div>-->
          <!--<input placeholder="请选择类型" v-model="form.typeText" contenteditable="false"-->
          <!--style="outline: none;cursor: default" readonly class="dropdown-toggle" data-toggle="dropdown"/>-->
          <!--<span class="dropdown-toggle" data-toggle="dropdown" style="position: absolute;right: 0;top: 0;"><i-->
          <!--class="icon fa-sort-down"></i></span>-->
          <!--<ul class="no-header down-content dropdown-menu">-->
          <!--<li v-for="(item,index) in allType" @click="selectMode(item,'type')">{{item}}</li>-->
          <!--</ul>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->

          <div class="row-line">
            <div style="width: 100%">
              <p>地址</p>
              <div>
                <input value="/api-consumer/get?name=" unselectable="on" readonly contenteditable="false"
                       style="width:30%"/>
                <input type="text" v-model="form.requestPath" style="width:65%"/>
              </div>
            </div>
          </div>

          <div class="row-line">
            <div style="width: 100%">
              <p>请求方式</p>
              <div class="select-down dropdown">
                <div>
                  <input placeholder="请求方式" v-model="form.requestWay" contenteditable="false"
                         style="outline: none;cursor: default;" readonly/>
                  <!--<input placeholder="请求方式" v-model="form.requestWay" contenteditable="false"-->
                  <!--style="outline: none;cursor: default;" readonly class="dropdown-toggle"-->
                  <!--data-toggle="dropdown"/>-->
                  <span style="position: absolute;right: 0;top: 0;"><i
                    class="icon fa-sort-down"></i></span>
                  <!--<span class="dropdown-toggle" data-toggle="dropdown" style="position: absolute;right: 0;top: 0;"><i-->
                  <!--class="icon fa-sort-down"></i></span>-->
                  <ul class="no-header down-content dropdown-menu">
                    <li v-for="(item,index) in requestType" @click="selectMode(item,'request')">{{item}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row-line">
            <div style="width: 100%;">
              <p>参数（选填项）</p>
              <div>
                <input v-model="form.params"></input>
              </div>
            </div>
          </div>
          <div class="row-line">
            <div style="width: 100%;">
              <p>接口代码</p>
              <div>
                <textarea v-model="form.codeDetail"></textarea>
              </div>
            </div>
          </div>

          <!--<div class="row-line">-->
          <!--<div style="width: 100%">-->
          <!--<p>参数</p>-->
          <!--<div class="all-param">-->
          <!--<table>-->
          <!--<thead>-->
          <!--<tr>-->
          <!--<th style="width: 10%">索引</th>-->
          <!--<th style="width: 15%;">参数名</th>-->
          <!--<th style="width: 40%; text-align: left">描述</th>-->
          <!--<th style="width: 15%;">类型</th>-->
          <!--<th style="width: 10%;">必要性</th>-->
          <!--<th style="width: 10%;">操作</th>-->
          <!--</tr>-->
          <!--</thead>-->
          <!--<tbody>-->
          <!--<tr v-for="(item,index) in allParameter">-->
          <!--<td style="width: 10%">{{index + 1 }}</td>-->
          <!--<td style="width: 15%">-->
          <!--<input v-model="item.name"/>-->
          <!--</td>-->
          <!--<td style="width: 40%; text-align: left">-->
          <!--<input v-model="item.describe"/>-->
          <!--</td>-->
          <!--<td style="width: 15%">-->
          <!--<input v-model="item.type"/>-->
          <!--</td>-->
          <!--<td style="width: 10%" class="necessity"><span @click="checkedNecessity(index)" :class="item.necessity?'active':''"><span></span></span></td>-->
          <!--<td style="width: 10%"><i @click="deleteParamter(index)" class="icon fa-trash-o" style="font-size: 18px;cursor: pointer"></i></td>-->
          <!--</tr>-->
          <!--<tr>-->
          <!--<td colspan="6" style="text-align: center;height: 34px;" @click="addParamter()">-->
          <!--<i class="icon wb-plus"></i>-->
          <!--<span>添加一条参数</span>-->
          <!--</td>-->
          <!--</tr>-->
          <!--</tbody>-->
          <!--</table>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->

          <div class="panel-operation">
            <span @click="postApi()">提交</span>
            <span @click="closeAddPort()">取消</span>
          </div>

        </div>
      </div>
    </div><!--新增接口的弹窗  end-->


    <!--禁用弹窗-->
    <div id="floor_" class="pop-up-windows" v-show="figureShow" @click="startUsingAndForbidden(0)"></div>
    <div id="deleted_" class="tishi-windows" v-show="figureShow">
      <div class="tishi-top" style="margin-top: 10px;">
        <i class="icon wb-bell" style="color:#f96868;font-size: 22px;"></i>
        <span>确定{{startUsingAndForbiddenText}}该接口？</span>
        <i class="icon wb-close"
           style="color:#f96868;position:relative;float: right;padding-right: 10px; cursor: pointer"
           @click="startUsingAndForbidden(0)"></i>
        <div class="tishi-bottom">
          <span class="delete-span font-14" @click="startUsingAndForbidden(1)">{{startUsingAndForbiddenText}}</span>
          <span class="cancel-span font-14" @click="startUsingAndForbidden(0)">取消</span>
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
  import g from '../common.vue';
  import {Utils} from "../../js/utils";

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
        title: '新增接口',
        popUpWindows: false,
        pageSize: 18,
        currentPage: 1,//当前页码
        totalPage: 1,//总页码
        allType: [],
        requestType: ['GET', 'POST'],
        dataSource: [],
        tableData: [],
        status: 200,
        tableLoading: true,
        type: '',
        typeText: '',
        form: {
          sourceId: '',
          source: '',
          id: '',
          interfaceName: '',
          typeText: '',
          requestPath: '',
          requestWay: '', //请求方式
          params: '',
          codeDetail: ''
        },
        errorInterfaces: [],//错误的接口
        successInterfaces: [],//正确的接口
        aKeyTestData: {},//一键检测的数据
        figureShow: false,
        interfaceId: '',
        interfaceStatus: '',
        startUsingAndForbiddenText: '启用',
        onceLoading: false,
        isShowAddInterface: false,
        allParameter: [
          {
            name: 'id',
            describe: '唯一的标识',
            type: 'Long',
            necessity: true
          }
        ]
      }

    },
    methods: {
      postApi: function () {
        let self = this;
        let reg = /\s/;

        if (self.form.source === '') {
          self.$message({
            message: '请选择数据源！',
            type: 'error'
          });
          return;
        }
        if (self.form.interfaceName === '') {
          self.$message({
            message: '名称不能为空！',
            type: 'error'
          });
          return;
        } else if (reg.test(self.form.interfaceName)) {
          self.$message({
            message: '名称存在特殊字符！',
            type: 'error'
          });
          return;
        }

        if (self.form.requestPath === '') {
          self.$message({
            message: '地址不能为空！',
            type: 'error'
          });
          return;
        } else if (reg.test(self.form.requestPath)) {
          self.$message({
            message: '地址存在特殊字符！',
            type: 'error'
          });
          return;
        }
        if (self.form.codeDetail === '') {
          self.$message({
            message: '接口代码不能为空！',
            type: 'error'
          });
          return;
        }

        let url;
        let type;
        if (self.title.indexOf('新增') >= 0) {
          url = '/api/add';
          type = 'POST'
        } else {
          url = '/api/update/' + self.form.id;
          type = 'PUT'
        }
        let data = {
          "access": '/api-consumer/get?name=' + self.form.requestPath,
          "dsId": self.form.sourceId,
          "dsIdentifier": self.form.source,
          "name": self.form.interfaceName,
          "requestformat": self.form.requestWay,
          "sqlInfo": self.form.codeDetail
        };
        $.ajax({
          url: g.url + url,
          type: type,
          data: JSON.stringify(data),
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
            xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              self.$message({
                message: '提交成功！',
                type: 'success'
              });
              self.isShowAddInterface = false;

              getAllListData(self.status, self.type, self);
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
                message: result.msg + '！',
                type: 'error'
              });
            }
          }
        })
      },
      selectStyle: function (e) {
        $(e.target).parent().addClass('select-blue')
      },
      selectMode: function (data, flag) {
        let self = this;
        if (flag === 'type') {
          self.form.typeText = data;
        } else if (flag === 'source') {
          self.form.source = data.name;
          self.form.sourceId = data.id;
        } else {
          self.form.requestWay = data;
        }
      },
      cutInterfaceStatus: function (indexFlag, status) {
        let self = this;
        self.status = status;
        getAllListData(self.status, self.type, self);
        $('ul.status-list').find('li').removeClass('active');
        $('ul.status-list').find('li:nth-child(' + indexFlag + ')').addClass('active');
      },
      goToInterfaceDetails: function (apiId) {
        window.sessionStorage.setItem('DDMAPIID', apiId);
        this.$router.push({path: "/menu/interfaceDetails"})
      },
      //通过类型得到数据
      getDataByType: function (type) {
        let self = this;
        self.type = type;
        if (!Utils.isEmptyObject(type)) {
          self.typeText = type;
        } else {
          self.typeText = '全部';
        }

        getAllListData(self.status, self.type, self);
      },
      /*一键检测*/
      aKeyTest: function () {
        let self = this;
        self.popUpWindows = true;
        var url;
        if (!Utils.isEmptyObject(self.type)) {
          url = '/interface/debugAll?interfaceType=' + self.type;
        } else {
          url = '/interface/debugAll';
        }
        self.onceLoading = true;
        $.ajax({
          url: g.url + url,
          type: 'get',
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
            xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              self.onceLoading = false
//              self.popUpWindows = true;
              self.errorInterfaces = result.data.errorInterfaces;
              self.successInterfaces = result.data.successInterfaces;
              self.aKeyTestData = result.data;
            }else if (result.status == 401) {
              self.$message({
                type: 'error',
                message: result.msg + '!'
              })
              setTimeout(function(){
                self.$router.push({path: "/"});
              },2000)
            }
          }
        })
      },
      /*
      * 显示启用和禁用的提示
      * */
      showUsingAndForbiddenPop: function (id, status) {
        let self = this;
        self.interfaceId = id;
        self.interfaceStatus = status;
        self.figureShow = true;
        if (status == 'NOT') {
          self.startUsingAndForbiddenText = '启用';
        } else {
          self.startUsingAndForbiddenText = '禁用';
        }
      },

      /*
       * 调用启用和禁用接口
       * */
      startUsingAndForbidden: function (flag) {
        let self = this;
        if (flag == 1) {
          startUsingAndForbiddenAjax(self)
        } else {
          self.figureShow = false;
        }

      },
      closePopUpWindows: function () {
        //关掉一键测试的弹窗
        this.popUpWindows = false;
      },
      closeAddPort: function () {
        this.isShowAddInterface = false;
      },
      showAddPort: function (flag, apiId) {
        let self = this;
        if (flag === 1) {
          self.title = '新增接口'
          self.form.interfaceName = '';
          self.form.typeText = '';
          self.form.requestPath = '';
          self.form.requestWay = 'GET';
          self.form.params = '';
          self.form.codeDetail = '';
          self.form.source = '';
        } else {
          self.title = '编辑接口'

          getDetailById(apiId, self)

        }
        getDataSource(self)
        this.isShowAddInterface = true;
      },
      checkedNecessity: function (index) {
        //是否是必填字段
        this.allParameter[index].necessity = !this.allParameter[index].necessity;
      },
      addParamter: function () {
        //添加一个参数
        var data = {
          name: '',
          describe: '',
          type: '',
          necessity: false
        };
        this.allParameter.push(data);
      },
      deleteParamter: function (index) {
        //删除一个参数
        this.allParameter.splice(index, 1);
      }
    }
    ,
    mounted() {
      let self = this;
      getAllType(self);
      getAllListData(self.status, self.type, self);
    }
  }


  /*
   * 启用和禁用接口
   * id：接口的id
   * status:接口当前的状态
   * self：vue对象
   * */
  function startUsingAndForbiddenAjax(self) {
    $.ajax({
      url: g.url + '/interface/updateStatus?id=' + self.interfaceId + '&status=' + self.interfaceStatus,
      type: 'post',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.figureShow = false;
          self.$message({
            message: self.startUsingAndForbiddenText + '成功！',
            type: 'success'
          });
          getAllListData(self.status, self.type, self);
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }
    })
  }

  function getDataSource(self) {
    $.ajax({
      url: g.url + '/dataSource/get?page=0&size=0&status=VALID',
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          let arr = []
          for (let i in result.data.list) {
            arr.push({
              id: result.data.list[i].id,
              name: result.data.list[i].identifier
            })
          }
          self.dataSource = arr;
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }
    })
  }


  /*获取所有的类型*/
  function getAllType(self) {
    $.ajax({
      url: g.url + '/interface/getAlltype',
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.allType = result.data;
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }
    })
  }


  /*
  * 获取所有的列表数据
  * status：状态
  * type：类型
  * */
  function getAllListData(status, type, self) {
    self.tableLoading = true;
    var url;
    if (!Utils.isEmptyObject(type)) {
      url = '/interface/getInterface?pageNum=' + self.currentPage + '&pageSize=' + self.pageSize + '&status=' + status + '&type=' + type;
    } else {
      url = '/interface/getInterface?pageNum=' + self.currentPage + '&pageSize=' + self.pageSize + '&status=' + status;
    }

    $.ajax({
      url: g.url + url,
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.tableData = result.data.list;
          self.currentPage = result.data.pageNum;
          self.totalPage = result.data.pages;
          self.tableLoading = false;
          cutPage(self.totalPage, self.currentPage, self);
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }
    })
  }

  //  获取接口详情
  function getDetailById(apiId, self) {
    $.ajax({
      url: g.url + '/api/get/' + apiId,
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.form.source = result.data.dsIdentifier;
          self.form.sourceId = result.data.dsId;
          self.form.interfaceName = result.data.name;
          let index = result.data.access.lastIndexOf("=")
          self.form.requestPath = result.data.access.substring(index + 1, result.data.access.length);
          self.form.requestWay = result.data.requestformat;
          self.form.codeDetail = result.data.sqlInfo;
          self.form.id = result.data.id;
          let arr = []
          for (let i in result.data.requestParameters) {
            arr.push(result.data.requestParameters[i].name)
          }
          self.form.params = arr.join(',')
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      }
    })
  }


  /*分页
  * pageCount:总页数
  * current：当前页码
  * */
  function cutPage(pageCount, current, self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        self.currentPage = page;
        getAllListData(self.status, self.type, self);
      }
    });
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
  }

  header div.status ul li.all {
    background-color: #46be8a;
  }

  header div.status ul li.forbidden > span:first-child {
    background-color: #c78641;
  }

  header div.status ul li.forbidden {
    background-color: #f2a654;
  }

  header div.status ul li.start-using > span:first-child {
    background-color: #44a0ab;
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

  div.condition-filtrate > div.select .detection,
  div.condition-filtrate > div.select .add-interface {
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

  div.condition-filtrate > div.select .add-interface i {
    margin-right: 2px;
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

  div.interface-table tbody > tr:last-child td {
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

  table.interface-list td.operation > span {
    display: inline-block;
    margin-right: 3%;
    cursor: pointer;
  }

  table.interface-list td.operation > span.forbidden {
    color: #76838f;
  }

  table.interface-list td.operation > span.start-using {
    color: #18d96e;
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

  table.interface-list td.operation span.forbidden i:before {
    color: #76838f;
  }

  table.interface-list td.operation span.start-using i:before {
    color: #18d96e;
  }

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

  div.pop-up-windows > div.lucency-pop {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 99;
  }

  div.detection-pop > div.window-content {
    height: 558px;
  }

  div.add-port-pop > div.window-content {
    min-height: 600px;
  }

  div.pop-up-windows > div.window-content {
    width: 665px;
    background-color: #ffffff;
    box-shadow: 0px 1px 11px 0px rgba(58, 58, 63, 0.23);
    border-radius: 5px;
    border: solid 1px #d6dde2;
    z-index: 100;
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

  div.pop-up-windows div.result-list > ul:first-child {
    margin-right: 2%;
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

  div.add-port-pop div.pop-panel {
    width: 92%;
    margin: 0 auto;
  }

  div.add-port-pop div.pop-panel div.row-line > div {
    display: inline-block;
    vertical-align: top;
    width: 48%;
  }

  div.add-port-pop div.pop-panel div.select-down > div {
    width: 100%;
    margin-left: 0;
  }

  div.add-port-pop div.pop-panel input {
    width: 98%;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    outline: none;
    padding-left: 10px;
  }

  div.add-port-pop div.pop-panel input:focus, div.add-port-pop div.pop-panel textarea:focus {
    border: 1px solid #62a8ea;
  }

  div.add-port-pop div.pop-panel textarea {
    font-size: 13px;
    padding-top: 5px;
    font-family: 微软雅黑;
  }

  div.add-port-pop div.pop-panel div.select-down > div input {
    width: 98%;
    border: none;
  }

  div.add-port-pop div.pop-panel div.select-down ul.down-content {
    width: 100%;
    left: 0;
  }

  div.add-port-pop div.pop-panel p {
    margin-bottom: 8px;
    color: #3f494f;
    font-size: 14px;
  }

  div.add-port-pop div.pop-panel textarea {
    height: 91px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    outline: none;
    padding-left: 10px;
    width: 98%;
    resize: none;
  }

  div.add-port-pop div.pop-panel table {
    width: 100%;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    font-size: 13px;
    text-align: left;
  }

  div.add-port-pop div.pop-panel div.all-param {
    height: 235px;
    overflow: auto;
  }

  div.add-port-pop div.pop-panel table thead tr {
    height: 31px;
    color: #526069;
    /*font-weight: normal;*/
  }

  div.add-port-pop div.pop-panel table thead tr th {
    font-weight: normal;
  }

  div.add-port-pop div.pop-panel table thead th,
  div.add-port-pop div.pop-panel table tbody td {
    padding-left: 6px;
  }

  div.add-port-pop div.pop-panel table tbody tr {
    height: 26px;
    color: #76838f;
  }

  div.add-port-pop div.pop-panel table tbody tr:last-child {
    font-size: 14px;
    color: #62a8ea;
  }

  div.add-port-pop div.pop-panel table tbody tr:last-child td {
    border-top: solid 1px #e4eaec;
    cursor: pointer;
  }

  div.add-port-pop div.pop-panel table td {
    padding: 3px 0;
    /*text-align: center;*/
  }

  div.add-port-pop div.pop-panel td.necessity span {
    display: inline-block;
  }

  div.add-port-pop div.pop-panel td.necessity > span {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: solid 1px #c6ced7;
    position: relative;
    cursor: pointer;
  }

  div.add-port-pop div.pop-panel td.necessity > span span {
    display: none;
  }

  div.add-port-pop div.pop-panel td.necessity > span.active span {
    width: 16px;
    height: 16px;
    background-color: #62a8ea;
    border-radius: 4px;
    position: absolute;
    top: 2px;
    left: 2px;
    display: inline-block;
  }

  div.add-port-pop div.pop-panel table input {
    width: 90%;
    height: 26px;
  }

  div.add-port-pop div.pop-panel div.panel-operation {
    text-align: right;
    padding: 20px 0;

  }

  div.add-port-pop div.pop-panel div.panel-operation span {
    display: inline-block;
    font-size: 14px;
    height: 29px;
    vertical-align: top;
    border-radius: 3px;
    line-height: 29px;
    text-align: center;
    cursor: pointer;
    margin-left: 10px;
  }

  div.add-port-pop div.pop-panel div.panel-operation > span:first-child {
    color: #ffffff;
    width: 105px;
    background-color: #43c273;
  }

  div.add-port-pop div.pop-panel div.panel-operation > span:last-child {
    width: 89px;
    background-color: #e4e4e4;

  }

  .select-blue {
    border: 1px solid #62a8ea;
  }

  .select-error {
    border: 1px solid #dd6161;
  }

</style>

<link rel="stylesheet" href="../../css/com.css">
