<template>
  <div>
    <section
      style=" margin-left: 200px; padding: 86px 20px 1px 20px;background-color: #f1f4f5">
      <el-header style="height: 116px;padding: 0">
        <el-header style="height: 116px;padding: 0;position: relative;">
          <div class="title">
            <span>筛选及功能项</span>
          </div>
          <div class="condition-filtrate">
            <div class="fr select" style="margin-right: 30px">
              <!--一键检测-->
              <div class="detection" @click="insertUser()">
                <!--<img src="../../assets/detection-icon.svg"/>-->
                <i class="icon wb-plus"></i>
                <span>新增用户</span>
              </div>
            </div>
          </div>
        </el-header>
      </el-header>

      <div class="interface-table">
        <!--接口列表-->
        <table class="interface-list" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
          <th class="interface-name" style="width: 50%">姓名</th>
          <th class="interface-type" style="width: 40%">用户名</th>
          <th class="operation" style="width: 200px">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in tableData">
            <td class="interface-type" ><span>{{item.realName}}</span></td>
            <td class="interface-net" ><span>{{item.userName}}</span></td>
            <td class="operation" style="width: 200px">
              <span @click="showUsingAndForbiddenPop(item.id,item.status)" :class="item.status=='0'?'forbidden':'start-using'">
                {{item.status=='0'?'禁用':'启用'}}
                <i class="icon wb-minus-circle"></i>
              </span>
              <span @click="updataUser(item.realName,item.userName,item.password,item.id)">
                修改
                <i class="icon wb-list"></i>
              </span>
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
            <i class="icon fa-cog"></i>
            <span>用户设置</span>
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

    <!--弹窗 修改-->
    <div class="pop-up-windows" v-show="popUpWindows" >
      <div class="lucency-pop" @click="closePopUpWindows()"></div>
      <div class="vertical-center window-content">
        <div class="title clearfix">
          <span class="fl">修改用户</span>
          <span class="icon wb-close fr close-window" @click="closePopUpWindows()"></span>
        </div>
        <div class="result-list">
          <div>
            <span class="realName">姓名</span>
            <input autocomplete="off" readonly v-model="realName" @keyup="setNameErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="Nameverify">{{NameErrorHint}}</span>
          </div>
          <div>
            <span  class="userName">用户名</span>
            <input autocomplete="off" readonly v-model="userName"  @keyup="setuserNameErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="userNameverify">{{userNameErrorHint}}</span>
          </div>
          <div>
            <span class="userPaw">密码</span>
            <input autocomplete="off" v-model="password" @keyup="setpasswordErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="passwordverify">{{passwordErrorHint}}</span>
         </div>
        </div>
        <button @click="updataGou()">确认</button>

      </div>
    </div><!--弹窗  end-->

    <!--弹窗  新增-->
    <div class="pop-up-windows" v-show="popUpWindows1" >
      <div class="lucency-pop" @click="closePopUpWindows1()"></div>
      <div class="vertical-center window-content">
        <div class="title clearfix">
          <span class="fl">新增用户</span>
          <span class="icon wb-close fr close-window" @click="closePopUpWindows1()"></span>
        </div>
        <div class="result-list">
          <div>
            <span class="realName">姓名</span>
            <input autocomplete="off" v-model="realName1" @keyup="setNameErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="Nameverify">{{NameErrorHint}}</span>
          </div>
          <div>
            <span  class="userName">用户名</span>
            <input autocomplete="off" v-model="userName1" @keyup="setuserNameErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="userNameverify">{{userNameErrorHint}}</span>
          </div>
          <div>
            <span class="userPaw">密码</span>
            <input autocomplete="off" v-model="password1" @keyup="setpasswordErrorHint()" type="text" rows="2" validateevent="true" class="el-input__inner">
            <span class="error-hint" v-show="passwordverify">{{passwordErrorHint}}</span>
          </div>
        </div>
        <button @click="insertGou()">确认</button>

      </div>
    </div><!--弹窗  end-->

    <!--禁用弹窗-->
    <div id="floor_" class="pop-up-windows" v-show="figureShow"  @click="startUsingAndForbidden(0)"></div>
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

  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
  import g from '../common.vue';

  export  default {
    components: {
      ElMain,
      ElHeader,
      ElContainer},
    name:'userSetting',
    data(){
      return{
        pageSize:15,
        currentPage:1,//当前页码
        totalPage:1,//总页码
        tableData:[],
        startUsingAndForbiddenText:'启用',
        figureShow:false,
        userId:'',
        userStatus:'',
        popUpWindows:false,
        popUpWindows1:false,
        password:'',
        userName:'',
        realName:'',
        updataId:'',
        password1:'',
        userName1:'',
        realName1:'',
        Nameverify:false,
        NameErrorHint:'姓名不能为空',
        userNameverify:false,
        userNameErrorHint:'用户名不能为空',
        passwordverify:false,
        passwordErrorHint:'密码不能为空',

      }
    },
    methods:{
      getAllListData(){
        let self=this;
        var url;
        url='/user/getUsers?pageNum='+self.currentPage+'&pageSize='+self.pageSize
        $.ajax({
          url:g.url+ url,
          type:'get',
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
            xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
          },
          success:function (result) {
            if(Number(result.status) == 200){
              self.tableData=result.data.list;
              self.currentPage = result.data.pageNum;
              self.totalPage = result.data.pages;
              cutPage(self.totalPage,self.currentPage,self);
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
      showUsingAndForbiddenPop:function (id,status) {
        let self = this;
        self.userId =  id;
        self.userStatus = status;
        self.figureShow = true;
        if(status == '0'){
          self.startUsingAndForbiddenText = '启用';
        }else{
          self.startUsingAndForbiddenText = '禁用';
        }
      },
      startUsingAndForbidden:function (flag) {
        let self = this;
        if(flag == 1){
          $.ajax({
            url:g.url+'/user/updateUserStatus?id='+self.userId +'&status='+self.userStatus,
            type:'post',
            beforeSend: function (xmlhttprequest) {
              xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
              xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
            },
            success:function (result) {
              if(Number(result.status) == 200){
                self.figureShow = false;
                self.$message({
                  message: self.startUsingAndForbiddenText+'成功！',
                  type: 'success'
                });
                self.getAllListData();
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
        }else{
          self.figureShow = false;
        }
      },
      insertUser:function () {
        let self=this;
        self.popUpWindows1=true;
        self.realName1='';
        self.userName1='';
        self.password1='';
      },

      updataUser:function (realName,userName,password,id) {
        let self=this;
        self.popUpWindows=true;
        self.realName=realName;
        self.userName=userName;
        self.password=password;
        self.updataId=id;
      },
      closePopUpWindows:function () {
        //关掉修改用户的弹窗
        this.popUpWindows = false;
      },
      closePopUpWindows1:function () {
        //关掉新增用户的弹窗
        this.popUpWindows1 = false;
      },
      /*
      * 修改用户
      * */
      updataGou:function () {
        let self=this;
        if(self.realName == ''){
          self.Nameverify = true;
          return;
        }
        if(self.userName == ''){
          self.userNameverify = true;
          return;
        }
        if(self.password == ''){
          self.passwordverify = true;
          return;
        }

        var data={
          "id":self.updataId,
          "password":self.password,
          "realName":self.realName,
          "userName":self.userName,
        }
        $.ajax({
          url:g.url+'/user/updateUser',
          data:JSON.stringify(data),
          type:'post',
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
            xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
          },
          success:function (result) {
            if(Number(result.status) == 200){
              self.popUpWindows=false;
              self.getAllListData()
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
      * 新增加用户
      * */
      insertGou:function () {
        let self=this;
        if(self.realName1 == ''){
          self.Nameverify = true;
          return;
        }
        if(self.userName1 == ''){
          self.userNameverify = true;
          return;
        }
        if(self.password1 == ''){
          self.passwordverify = true;
          return;
        }

        var data={
          "password":self.password1,
          "realName":self.realName1,
          "userName":self.userName1,
        }

        if(self.realName1 != ''&&self.userName1 != ''&&self.password1 != ''){
          $.ajax({
            url:g.url+'/user/addUser',
            data:JSON.stringify(data),
            type:'post',
            beforeSend: function (xmlhttprequest) {
              xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
              xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
            },
            success:function (result) {
              if(Number(result.status) == 200){
                self.popUpWindows1=false;
                self.getAllListData()
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
      },
      setNameErrorHint:function () {
        this.Nameverify = false;
      },
      setuserNameErrorHint:function () {
        this.userNameverify = false;
      },
      setpasswordErrorHint:function () {
        this.passwordverify = false;
      },
    },
    mounted(){
      this.getAllListData()
    }
  }

  function cutPage(pageCount,current,self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        self.currentPage = page;
        getAllListData(self);
      }
    });
  }

  function getAllListData(self) {
    var url;
    url='/user/getUsers?pageNum='+self.currentPage+'&pageSize='+self.pageSize
    $.ajax({
      url:g.url+ url,
      type:'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success:function (result) {
        if(Number(result.status) == 200){
          self.tableData =result.data.list;
          self.currentPage = result.data.pageNum;
          self.totalPage = result.data.pages;
          cutPage(self.totalPage,self.currentPage,self);
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


  div.condition-filtrate > div.status > span {
    margin-left: 20px;
    margin-right: 10px;
  }

  div.condition-filtrate > div.status {
    margin-top: 27px;
  }


  div.condition-filtrate>div.select{
    margin-top: 20px;
  }

  div.condition-filtrate>div.select>div{
    display: inline-block;
    vertical-align: top;
  }

  div.condition-filtrate>div.select .detection{
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
  div.condition-filtrate>div.select .detection img{
    width: 12px;
    height: 14px;
    margin-right: 2px;
  }

  div.condition-filtrate>div.select .detection img,
  div.condition-filtrate>div.select .detection span{
    display: inline-block;;
    vertical-align: middle;
  }


  /*接口列表*/

  div.interface-table {
    background-color: #ffffff;
    margin: 18px 0 22px 0;
    border-radius: 3px;
    /*height:592px;*/
    overflow: auto;
    height: calc(100vh - 303px);
  }

  /*div.interface-table div.table-content{*/
    /*overflow: auto;*/
    /*height:555px;*/
  /*}*/

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

  div.interface-table tbody>tr:last-child td{
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

  table.interface-list td.operation > span.forbidden{
    color: #76838f;
  }

  table.interface-list td.operation > span.start-using{
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

  div.footer ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }

  div.footer ul li{
    display: inline-block;
    vertical-align: top;
  }

  div.footer ul li i{
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

  div.pop-up-windows >div.lucency-pop{
    position: fixed;
    width: 100%;
    height:100%;
    background-color: transparent;
    z-index: 99;
  }


  div.pop-up-windows > div.window-content {
    width: 665px;
    height: 410px;
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

  div.pop-up-windows div.result-list {
    margin-left: 53px;
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
  .realName,.userName,.userPaw{
    display: inline-block;
    width: 15%;
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .el-input__inner{
    width: 75%;
  }
  div.result-list > div{
    margin-top: 60px;
    margin-bottom: -20px;
  }
  span.error-hint{
    color: #ff4f59;
    display: block;
    height: 11px;
    font-size: 12px;
    /* margin-top: 10px; */
  }
</style>
<link rel="stylesheet" href="../../css/com.css">
