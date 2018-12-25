<template>
  <div>
    <section style=" margin-left: 200px; padding: 86px 20px 1px 20px;background-color: #f1f4f5">
      <!--<el-header style="height: 116px;padding: 0">-->
        <!--&lt;!&ndash;<div class="header_top">数据解析</div>&ndash;&gt;-->
        <!--<div class="title">-->
          <!--<span>数据解析</span>-->
        <!--</div>-->
        <!--<div class="condition-filtrate">-->
        <!--</div>-->
      <!--</el-header>-->
      <div class="interface-table">
        <!--接口列表-->
        <table class="interface-list" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
            <th class="interface-name">时间</th>
            <th class="interface-type">解析事件</th>
            <th class="interface-net">响应时间</th>
            <th class="interface-count">报文id</th>
            <!--<th class="operation" style="width: 200px">操作</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in tableData">
            <td class="interface-name"><span>{{item.time}}</span></td>
            <td class="interface-type"><span>{{item.name}}</span></td>
            <td class="interface-net"><span>{{item.responseTime}}ms</span></td>
            <td class="interface-count"><span>{{item.cminmsgsId}}</span></td>
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
            <i class="icon fa-code"></i>
            <span>数据解析</span>
            <!--<span>接口管理</span>-->
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
    name:'dataParser',
    data(){
      return{
        pageSize:15,
        currentPage:1,//当前页码
        totalPage:1,//总页码
        tableData:[],
      }
    },
    methods:{
      getAllListData(){
        let self=this;
        var url;
        url='/analysisLog/getAnalysisLog?pageNum='+self.currentPage+'&pageSize='+self.pageSize
        $.ajax({
          url:g.url+ url,
          type:'get',
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
            xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
          },
          success:function (result) {
            if(Number(result.status) == 200){
//              console.log(result)
              self.tableData=result.data.list;
              self.currentPage = result.data.pageNum;
              self.totalPage = result.data.pages;
//              cutPage(self.totalPage,self.currentPage,self)
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
    },
    mounted(){
      this.getAllListData()
    }

  }


  /*分页
 * pageCount:总页数
 * current：当前页码
 * */
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
    url='/analysisLog/getAnalysisLog?pageNum='+self.currentPage+'&pageSize='+self.pageSize
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

  /*接口列表*/

  div.interface-table {
    /*height: 703px;*/
    background-color: #ffffff;
    margin: 18px 0 22px 0;
    border-radius: 3px;
    overflow: auto;
    /*height: 745px;*/
    height: calc(100vh - 190px);
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


</style>
<link rel="stylesheet" href="../../css/com.css">
