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
              <li class="all active" @click="cutInterfaceStatus(1,'')">
                <span><img src="../../assets/deepgreen.png"/></span>
                <span>全部</span>
              </li>
              <li class="forbidden" @click="cutInterfaceStatus(2,'NOT')">
                <span><img src="../../assets/weijiedan.png"/></span>
                <span>禁用中</span>
              </li>
              <li class="start-using" @click="cutInterfaceStatus(3,'VALID')">
                <span><img src="../../assets/yijiedan.png"/></span>
                <span>启用中</span>
              </li>
            </ul>
          </div><!--状态  end-->

          <div class="fr select" style="margin-right: 30px">


            <!--新增接口-->
            <div class="add-interface" @click="showAddDataOrigin(1)">
              <i class="icon wb-plus"></i><span>新增数据源</span>
            </div>

            <!--一键检测-->
            <div class="detection" @click="aKeyTest()">
              <img src="../../assets/detection-icon.svg"/>
              <span>一键检测</span>
            </div>
          </div>
        </div>
      </el-header>

      <div class="interface-table">
        <!--接口列表-->
        <table class="interface-list" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
            <th class="interface-name">库名称</th>
            <th class="interface-type">驱动类型</th>
            <th class="interface-net">地址</th>
            <th class="operation" style="width: 300px">操作</th>
          </tr>
          </thead>
          <tbody>
          <!--:class="index==2?'abnormal-tr':''"-->
          <tr v-for="(item,index) in list">
            <td class="interface-name">
              <i class="status "
                 :class="item.status==='NOT'?'forbidden':'start-using'">{{item.status === 'NOT' ? '禁用中' : '启用中'}}</i>
              <span>{{item.identifier}}
                <!--<span v-if="item.status=='NOT'" style="color: #f84116;">(异常)</span>-->
              </span>
            </td>
            <td class="interface-type"><span>{{item.classname}}</span></td>
            <td class="interface-net"><span>{{item.url}}</span></td>
            <td class="operation" style="width: 300px">
              <span @click="oneTest(item.identifier)">检测<i><img src="../../assets/detection-icon-gray.svg"/></i></span>
              <span @click="showUsingAndForbiddenPop(item.id,item.status)"
                    :class="item.status==='NOT'?'forbidden':'start-using'">{{item.status == 'NOT' ? '禁用' : '启用'}}<i
                class="icon wb-minus-circle"></i></span>
              <span @click="showAddDataOrigin(2,item)">编辑<i class="icon wb-edit"></i></span>
              <span @click="showUsingAndForbiddenPop(item.id,'delete')">删除<i class="icon fa-trash-o"
                                                                             style="font-size: 14px;"></i></span>
            </td>
          </tr>
          <!---->
          <!--<tr v-for="item in tableData">-->
          <!--<td class="interface-name">-->
          <!--<i class="status " :class="item.status=='NOT'?'forbidden':'start-using'">{{item.status=='NOT'?'禁用中':'启用中'}}</i>-->
          <!--<span>{{item.apiName}}</span>-->
          <!--</td>-->
          <!--<td class="interface-type"><span>{{item.type}}</span></td>-->
          <!--<td class="interface-net"><span>{{item.apiAccess}}</span></td>-->
          <!--<td class="operation" style="width: 200px">-->
          <!--<span>调试<i><img src="../../assets/debug-icon.svg"/></i></span>-->
          <!--<span :class="item.status=='NOT'?'forbidden':'start-using'">{{item.status=='NOT'?'禁用':'启用'}}<i class="icon wb-minus-circle"></i></span>-->
          <!--&lt;!&ndash;<span>查看详情<i class="icon wb-list"></i></span>&ndash;&gt;-->
          <!--</td>-->
          <!--</tr>-->
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
              <span class="normal"> {{successNum}}个接口正常</span>，<span class="abnormal">{{errorNum}}个异常</span>。
            </p>
          </div>
        </div>

        <!--检测结果列表-->
        <div class="result-list">
          <!--正常-->
          <ul class="normal">
            <li v-for="item in successList">
              <i class="icon wb-check-circle "></i>
              <span class="handle-text">{{item.identifier}}</span>
            </li>

          </ul>
          <!--异常-->
          <ul class="abnormal">
            <li v-for="item in errorList">
              <i class="icon wb-alert-circle"></i>
              <span class="handle-text">{{item.identifier}}</span>
            </li>

          </ul>
        </div>

        <button @click="closePopUpWindows()">确认</button>

      </div>
    </div><!--弹窗  end-->

    <!--新增数据源的弹窗-->
    <div class="pop-up-windows add-dataorigin-pop" v-show="isShowAddDataOrigin">
      <div class="lucency-pop" @click="closeAddDataOrigin()"></div>
      <div class="vertical-center window-content"
           v-loading="editLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
        <div class="title clearfix">
          <span class="fl">{{title}}</span>
          <span class="icon wb-close fr close-window" @click="closeAddDataOrigin()"></span>
        </div>

        <div class="pop-panel">
          <div class="row-line">
            <p>名称</p>
            <div>
              <input type="text" v-model="form.identifier"/>
            </div>
          </div>
          <div class="row-line">
            <div style="width: 100%">
              <p>驱动类</p>
              <div class="select-down dropdown">
                <div style="width: 100%;margin-left: 0;">
                  <input placeholder="请选择驱动类" v-model="form.classname" contenteditable="false"
                         style="outline: none;cursor: default;" readonly class="dropdown-toggle"
                         data-toggle="dropdown"/>
                  <span class="dropdown-toggle" data-toggle="dropdown" style="position: absolute;right: 0;top: 0;"><i
                    class="icon fa-sort-down"></i></span>
                  <ul class="no-header down-content dropdown-menu" style="width: 100%;left: 0;">
                    <li v-for="(item,index) in classname" @click="selectMode(item,'source')">{{item}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row-line">
            <p>库地址</p>
            <div>
              <input type="text" v-model="form.url"/>
            </div>
          </div>
          <div class="row-line">
            <p>用户名</p>
            <div>
              <input type="text" v-model="form.username"/>
            </div>
          </div>

          <div class="row-line">
            <p>密码</p>
            <div>
              <input type="text" v-model="form.password"/>
            </div>
          </div>
          <div class="panel-operation">
            <span @click="postAjax()">提交</span>
            <span @click="closeAddDataOrigin()">取消</span>
          </div>
        </div>

      </div>
    </div><!--新增接口的弹窗  end-->


    <!--禁用弹窗-->
    <div id="floor_" class="pop-up-windows" v-show="figureShow" @click="startUsingAndForbidden(0)"></div>
    <div id="deleted_" class="tishi-windows" v-show="figureShow">
      <div class="tishi-top" style="margin-top: 10px;">
        <i class="icon wb-bell" style="color:#f96868;font-size: 22px;"></i>
        <span>确定{{alertText}}该接口？</span>
        <i class="icon wb-close"
           style="color:#f96868;position:relative;float: right;padding-right: 10px; cursor: pointer"
           @click="startUsingAndForbidden(0)"></i>
        <div class="tishi-bottom">
          <span class="delete-span font-14" @click="startUsingAndForbidden(1,alertText)">{{alertText}}</span>
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
    name: 'dataOriginManager',
    data() {
      return {
        title: '新增数据源',
        popUpWindows: false,
        list: [],
        pageSize: 15,
        currentPage: 1,//当前页码
        totalPage: 1,//总页码
        allType: [],
        tableData: [],
        successList: [],
        successNum: '',
        errorNum: '',
        errorList: [],
        status: '',
        errorInterfaces: [],//错误的接口
        successInterfaces: [],//正确的接口
        aKeyTestData: {},//一键检测的数据
        figureShow: false,
        interfaceId: '',
        interfaceStatus: '',
        alertText: '启用',
        onceLoading: true,
        editLoading: false,
        isShowAddDataOrigin: false,
        classname: ['com.mysql.jdbc.Driver', 'oracle.jdbc.OracleDriver', 'com.microsoft.sqlserver.jdbc.SQLServerDriver\n'],
        form: {
          id: '',
          identifier: '',
          url: '',
          classname: '',
          username: '',
          password: ''
        }
      }

    },
    methods: {
      selectMode: function (data) {
        let self = this;
        self.form.classname = data;
      },
//      新增
      postAjax: function () {
        let self = this;
        let url;
        let type;

        let reg = /\s/;

        if (self.form.identifier === '') {
          self.$message({
            message: '名称不能为空！',
            type: 'error'
          });
          return;
        } else if (reg.test(self.form.identifier)) {
          self.$message({
            message: '名称存在特殊字符！',
            type: 'error'
          });
          return;
        }

        if (self.form.classname === '') {
          self.$message({
            message: '请选择驱动类！',
            type: 'error'
          });
          return;
        }

        if (self.form.url === '') {
          self.$message({
            message: '库地址不能为空！',
            type: 'error'
          });
          return;
        } else if (reg.test(self.form.url)) {
          self.$message({
            message: '库地址存在特殊字符！',
            type: 'error'
          });
          return;
        }

        if (self.form.username === '') {
          self.$message({
            message: '用户名不能为空！',
            type: 'error'
          });
          return;
        }

        if (self.form.password === '') {
          self.$message({
            message: '密码不能为空！',
            type: 'error'
          });
          return;
        }

        if (self.title.indexOf('新增') >= 0) {
          url = '/dataSource/add';
          type = 'POST'
        } else {
          url = '/dataSource/update/' + self.form.id
          type = 'PUT'
        }
        let data = {
          "classname": self.form.classname,
          "identifier": self.form.identifier,
          "password": self.form.password,
          "url": self.form.url,
          "username": self.form.username
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
              self.isShowAddDataOrigin = false;

              getDate(self)
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

      cutInterfaceStatus: function (indexFlag, status) {
        let self = this;
        self.status = status;
        $('ul.status-list').find('li').removeClass('active');
        $('ul.status-list').find('li:nth-child(' + indexFlag + ')').addClass('active');
        getDate(self)
      },
      goToInterfaceDetails: function (apiId) {
        window.sessionStorage.setItem('DDMAPIID', apiId);
        this.$router.push({path: "/menu/interfaceDetails"})
      },

//      检测
      oneTest: function (data) {
        let self = this;
        checkOne(self, data)
      },


      /*一键检测*/
      aKeyTest: function () {
        let self = this;
        self.popUpWindows = true;
        self.onceLoading = true;
        checkAll(self)
      },
      /*
      * 显示启用和禁用删除的提示
      * */
      showUsingAndForbiddenPop: function (id, status) {
        let self = this;
        self.interfaceId = id;
        self.interfaceStatus = status;
        self.figureShow = true;
        if (status == 'NOT') {
          self.alertText = '启用';
        } else if (status == 'VALID') {
          self.alertText = '禁用';
        } else {
          self.alertText = '删除';
        }
      },

      /*
       * 调用启用和禁用接口
       * */
      startUsingAndForbidden: function (flag, type) {
        let self = this;
        let str;
        console.log(type)
        if (flag == 1) {
          if (type == '启用') {
            str = 'VALID'
            startUsingAndForbiddenAjax(self, str)
          } else if (type == '禁用') {
            str = 'NOT'
            startUsingAndForbiddenAjax(self, str)
          } else if (type == '删除') {
            deleteAjax(self)
          }
        } else {
          self.figureShow = false;
        }


      },
      closePopUpWindows: function () {
        //关掉一键测试的弹窗
        this.popUpWindows = false;
      },

      showAddDataOrigin: function (flag, data) {
        let self = this;
        if (flag === 1) {
          this.title = '新增数据源'
          this.form.identifier = '';
          this.form.url = '';
          this.form.classname = '';
          this.form.username = '';
          this.form.password = '';
        } else {
          this.title = '编辑数据源';
          self.editLoading = true;
          getDetailById(data.id, self)
//          this.form.id = data.id;
//          this.form.identifier = data.identifier;
//          this.form.url = data.url;
//          this.form.classname = data.classname;
//          this.form.username = data.username;
//          this.form.password = data.password;


        }
        this.isShowAddDataOrigin = true;
      },
      closeAddDataOrigin: function () {
        this.isShowAddDataOrigin = false;
      }

    },
    mounted() {
      let self = this;
      getDate(self)
    },
    created() {
      let self = this;
      self.$nextTick(function () {
        cutPage(2, 1, self);
      })

    }
  }

  function getDate(self) {
    $.ajax({
      url: g.url + '/dataSource/get?page=' + self.currentPage + '&size=' + self.pageSize + '&status=' + self.status,
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.list = result.data.list;
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

  function checkOne(self, data) {
    $.ajax({
      url: g.url + '/dataSource/check?dataSource=' + data,
      type: 'POST',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.$message({
            message: '数据源正常！',
            type: 'success'
          });

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
      },
      error: function (result) {
        console.log(result)
        self.$message({
          message: '服务器出错！',
          type: 'error'
        });
      }
    })
  }

  function checkAll(self) {
    $.ajax({
      url: g.url + '/dataSource/checkAll',
      type: 'POST',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.successList = result.data.success;
          self.errorList = result.data.failure;
          self.successNum = result.data.successTotal;
          self.errorNum = result.data.failureTotal;
          self.onceLoading = false;
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
  function getDetailById(id, self) {
    $.ajax({
      url: g.url + '/dataSource/get/' + id,
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {

        if (Number(result.status) == 200) {
          self.form.id = result.data.id;
          self.form.identifier = result.data.identifier;
          self.form.url = result.data.url;
          self.form.classname = result.data.classname;
          self.form.username = result.data.username;
          self.form.password = result.data.password;
          self.editLoading = false;

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

  function startUsingAndForbiddenAjax(self, status) {
    $.ajax({
      url: g.url + '/dataSource/onoff/' + self.interfaceId + '?status=' + status,
      type: 'PUT',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.$message({
            message: self.alertText + '成功！',
            type: 'success'
          });
          self.figureShow = false;
          getDate(self)
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

  function deleteAjax(self) {
    $.ajax({
      url: g.url + '/dataSource/' + self.interfaceId,
      type: 'DELETE',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.$message({
            message: self.alertText + '成功！',
            type: 'success'
          });
          self.figureShow = false;
          getDate(self)
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

  div.detection-pop div.pop-panel div.select-down > div {
    width: 100%;
    margin-left: 0;
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

  div.interface-table tr.abnormal-tr {
    background-color: #ffe0e0;
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
    margin: 0 3%;
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
    height: 13px;
    width: 13px;
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

  div.add-dataorigin-pop > div.window-content {
    height: 545px;
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

  div.add-dataorigin-pop div.pop-panel {
    width: 92%;
    margin: 0 auto;
  }

  div.add-dataorigin-pop div.pop-panel p {
    margin-bottom: 8px;
    color: #3f494f;
    font-size: 14px;
  }

  div.add-dataorigin-pop div.pop-panel div.row-line > div {
    display: inline-block;
    vertical-align: top;
    width: 100%;
  }

  div.add-dataorigin-pop div.pop-panel input {
    width: 98%;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    outline: none;
    padding-left: 10px;
  }

  div.add-dataorigin-pop div.pop-panel input:focus {
    border: 1px solid #62a8ea;
  }

  div.add-dataorigin-pop div.pop-panel div.panel-operation {
    text-align: right;
    margin-top: 40px;
  }

  div.add-dataorigin-pop div.pop-panel div.panel-operation span {
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

  div.add-dataorigin-pop div.pop-panel div.panel-operation > span:first-child {
    color: #ffffff;
    width: 105px;
    background-color: #43c273;
  }

  div.add-dataorigin-pop div.pop-panel div.panel-operation > span:last-child {
    width: 89px;
    background-color: #e4e4e4;

  }

</style>

<link rel="stylesheet" href="../../css/com.css">
