<!--接口详情-->
<template>
  <div>
    <section class="clearfix" style=" margin-left: 200px; background-color: #fafafb;
    padding: 22px 20px 20px;
    top: 60px;
    position: relative;" v-loading="loading "
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
      <!--左边的内容-->
      <div class="left-content fl"
      >
        <!--接口详情-->
        <div class="details">
          <div>
            <p>{{items.apiName}}</p>
            <div class="mark clearfix">
              <span>{{items.apiType}}</span>
              <span>返回格式：{{items.responseType}}</span>
            </div>
            <div class="com">
              <span>请求方式</span>
              <span>{{items.requestype}}</span>
            </div>
            <div class="com">
              <span>接口地址</span>
              <span>{{items.apiAccess}}</span>
            </div>
            <div class="com">
              <span>接口描述</span>
              <span>{{items.details}}</span>
            </div>
            <div class="com">
              <span>请求示例</span>
              <span>{{items.requestExample}}</span>
            </div>
          </div>
        </div> <!--接口详情  end-->

        <!--请求参数说明-->
        <div class="request-parameter block-area">
          <div>
            <p>请求参数说明</p>
            <div class="table-content">
              <!--固定的行-->
              <table class="fixation-table"  cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                <thead>
                <tr>
                  <th style="width: 10%">名称</th>
                  <th style="width: 10%">类型</th>
                  <th style="width: 10%">必填</th>
                  <th style="width: 80%">说明</th>
                </tr>
                </thead>
              </table><!--固定的行  end -->
              <div class="roll-table">
                <!--表格的内容-->
                <table cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                  <thead>
                  <tr>
                    <th style="width: 10%">名称</th>
                    <th style="width: 10%">类型</th>
                    <th style="width: 10%">必填</th>
                    <th style="width: 80%">说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in items.requestParameters">
                    <td class="name" style="width: 10%">{{item.name}}</td>
                    <td class="type" style="width: 10%"><span>{{getType(item.type)}}</span></td>
                    <td class="required" style="width: 10%">{{item.require?"是":"否"}}</td>
                    <td class="explain handle-text" style="width: 80%">{{item.description}}</td>
                  </tr>
                  </tbody>
                </table><!--表格的内容-->
              </div>
            </div>
          </div>

        </div><!--请求参数说明 end-->

        <!--返回参数说明-->
        <div class="return-parameter block-area">
          <div>
            <p>返回参数说明</p>
            <div class="table-content">
              <!--固定的行-->
              <table class="fixation-table"  cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                <thead>
                <tr>
                  <th style="width: 15%">名称</th>
                  <th style="width: 10%">类型</th>
                  <th style="width: 65%">说明</th>
                </tr>
                </thead>
              </table><!--固定的行  end -->
              <!--表格内容-->
              <div class="roll-table">
                <table cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                  <thead>
                  <tr>
                    <th style="width: 15%">名称</th>
                    <th style="width: 10%">类型</th>
                    <th style="width: 65%">说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in items.responseParameters">
                    <td class="name" style="width: 15%">{{item.name}}</td>
                    <td class="type" style="width: 10%"><span>{{getType(item.type)}}</span></td>
                    <td class="explain handle-text" style="width: 65%">{{item.description}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div><!--返回参数说明  end-->

      </div>
      <!--右边的内容-->
      <div class="right-content fr">
        <!--服务统计-->
        <div class="service-statistics" v-loading="chartLoading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
          <div>
            <span>近{{echartday}}为您提供<b>{{items.totalCall}}</b>次服务</span>
            <ul class="fr">
              <li class="active" @click="changeDate($event,24)">今日</li>
              <li  @click="changeDate($event,7)">7日</li>
              <li @click="changeDate($event,30)">30日</li>
            </ul>

            <div id="statisticsMap" ></div>
          </div>

        </div><!--服务统计  end-->

        <!--输入参数-->
        <div class="input-parameter block-area">
          <div>
            <!--输入参数-->
            <div  :class="isShowCode?'json-show':'input-content'">
              <p>输入参数</p>
              <div class="table-content">
                <!--固定的行-->
                <table class="fixation-table"  cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                  <thead>
                  <tr>
                    <th style="width: 20%">名称</th>
                    <th style="width: 15%">类型</th>
                    <th style="width: 15%">必填</th>
                    <th style="width: 60%">说明</th>
                  </tr>
                  </thead>
                </table><!--固定的行  end -->
                <!--表格内容-->
                <div class="roll-table">
                  <table cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                    <thead>
                    <tr>
                      <th style="width: 20%">名称</th>
                      <th style="width: 15%">类型</th>
                      <th style="width: 15%">必填</th>
                      <th style="width: 60%">说明</th>
                    </tr>
                    </thead>
                    <tbody class="input-params">
                    <tr v-for="item in items.requestParameters">
                      <td class="name" style="width: 20%" v-bind:data-key="item.name" v-bind:data-require="item.require">
                        <input/>
                      </td>
                      <td class="type" style="width: 15%"><span>{{getType(item.type)}}</span></td>
                      <td class="required" style="width: 15%">{{item.require?"是":"否"}}</td>
                      <td class="explain handle-text" style="width: 60%">{{item.description}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>输入Token</p>
              <div class="submit-debug">
                <span><input v-model="form.token"/></span>
                <button @click="submitDebug()">提交调试</button>
              </div>
            </div><!--输入参数 end-->

            <!--json展示-->
            <div class="return-json" :class="isShowCode?'has-json':'no-json'">
              <i class="icon wb-close" @click="closeJsonShow()" v-show="isShowCode" ></i>
              <p>JSON返回示例：</p>
              <pre id="returnJson">
                <code v-html="codeHtml">

                </code>
              </pre>
            </div><!--json展示-->

          </div>

        </div> <!--输入参数  end-->

      </div>

    </section>
    <!--底部-->
    <div class="footer" style=" margin-left: 200px;">
      <div class="fl">
        <ul>
          <li>
            <a @click="goToBack(1)">
              <i class="icon wb-desktop"></i>
              <span>系统管理</span>
            </a>
          </li>
          <li >
            &nbsp;<i>/</i>
            <a @click="goToBack(2)">
            <span >&nbsp;接口列表</span>
            </a>
          </li>
          <li>
            &nbsp;<i>/</i>
            <span>接口详情</span>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script>
  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import echarts from 'echarts';
  //  import niceScroll from 'nicescroll'
  import niceScroll from '../../js/jquery.nicescroll.min'
  import axios from 'axios'
  import g from '../common.vue'
  import {Utils} from '../../js/utils'
  let vm;
  export  default {
    components: {ElHeader},
    name:'interfaceDetails',
    data(){
      return{
        statisticsMap:'',
        codeHtml:'',
        isShowCode:false,
        items:[],
        time:24,
        loading:true,
        chartLoading:true,
        echartMsg:[],
        totalCall:"",
        echartday:"24小时",

        form:{
          id:"",
          requestType:"",
          token:"",
          url:""

        }
      }
    },

    methods:{
      getinterfaceList:function(){
        const self = this;
          axios({
            method: 'GET',
            url: g.url + '/interface/getInterfaceDetail?apiId='+sessionStorage.getItem('apiId'),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'token': sessionStorage.getItem('token')
            }
          }).then(function (result) {

            if (result.status == 200) {
              self.items = result.data.data;
              self.loading=false;
              self.form.id=result.data.data.apiId
              self.form.url=result.data.data.apiAccess
              self.form.requestType=result.data.data.requestype
              self.loading=false;
              self.chartLoading=false;
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
      getType:function (type) {
        var arr = [];
        if(type != null){
          arr = type.split('.');
          return arr[arr.length -1];
        }else{
          return '';
        }

      },
      closeJsonShow(){
        this.isShowCode = false;

      },
      goToBack:function(flag){
        if(flag==1){
          this.$router.push({path: "/menu"})
        }else{
          this.$router.push({path: "/menu/sysInterface"})
        }
      },
      // 切换图表天数
      changeDate:function(e,date){
        if($(e.target).hasClass('active')){
          $(e.target).removeClass('active')
        }else {
          $(e.target).siblings().removeClass('active')
          $(e.target).addClass('active')
        }
        const self=this;
        self.time=date;
        switch(date){
          case 7:self.echartday="7日";break;
          case 24:self.echartday="24小时";break;
          case 30:self.echartday="30日";break;
        }
        handleStatisticsMapData(self);

      },
      // 调试
      submitDebug:function () {
        var self = this;
        /*提交测试*/
        this.isShowCode = true;
        debuggingInterface(self);

      },
    },
    mounted(){
      var self = this;
      self.getinterfaceList()
      self.statisticsMap = echarts.init(document.getElementById('statisticsMap'));
      handleStatisticsMapData(self);
      window.onresize = function() {
        //重置容器高宽
        self.statisticsMap.resize();

      };
    },
    updated(){
        $('code p').css('margin','0');
        $('code>ul').css({ 'padding':'0'})
        $('code ul').css({
          'list-style':' none',
          'padding-left':'20px'
        });
        $('code ul li').css({
          'padding-left':'4px'
        })
    },
    created(){
       vm=this;
    }
  }
//  调试接口
  function debuggingInterface(self) {
    var params = [];
    var keys = [];
    var values = [];
    $('.input-params tr').each(function (index) {
      keys.push($(this).find('td.name').attr('data-key'));
      values.push($(this).find('td.name input').val());
    })
    for(var i = 0;i<keys.length;i++){
      params.push({
        'key':keys[i],
        'value':values[i]
      })
    }
    axios({
      method: 'post',
      url: g.url + '/interfaceCall/interfaceDebug',
      data:{
        "id":self.form.id,
        "params":params,
        "requestType":  self.form.requestType,
        "token": self.form.token,
        "url": self.form.url
      },
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'token': sessionStorage.getItem('token')
      }
    }).then(function (result) {
      if(result.status==200){
        console.log( result);
        self.codeHtml=handleJsonData(result.data,self)

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
  /*
  * 处理json数据
  * */
//  function  handleJsonData(data,self) {
//    var valueName = [];
//    var keyName = [];
//    var html = [];
//    if(!Utils.isEmptyObject(data)){
//      html.push('<p>{</p>');
//      for(var index in data){
//        valueName.push(data[index]);
//        keyName.push(index);
//      }
//      for(var i = 0;i<valueName.length;i++){
//        if(Utils.isArray(valueName[i])){
//          html.push('<p>&nbsp;"'+keyName[i]+'":[</p>');
//          for(var j = 0;j<valueName[i].length;j++){
//            html.push('<p>&nbsp;&nbsp;{</p>');
//            var temValue = [];
//            var temKey = [];
//            var tempData = valueName[i][j];
//            for(var temI in tempData){
//              temValue.push(tempData[temI]);
//              temKey.push(temI);
//            }
//            for(var k = 0;k<temValue.length;k++){
//              html.push('<p>&nbsp;&nbsp;&nbsp;"'+temKey[k]+'":"'+temValue[k]+'"</p>');
//            }
//            html.push('<p>&nbsp;&nbsp;},</p>');
//          }
//          html.push('<p>]</p>');
//        }else{
//          html.push('<p>&nbsp;"'+keyName[i]+'":"'+valueName[i]+'"</p>')
//        }
//      }
//      html.push('<p>}</p>');
//    }
//    self.codeHtml = html.join('');
//  }
  function  handleJsonData(data,self) {
    var html = '';
    if(!Utils.isEmptyObject(data)){
      if(Utils.isArray(data)){
        if(data.length>0){
          html +='<ul>';
          html +='<li>[</li>';
          for (var i = 0; i < data.length; ++i){
            html += handleJsonData(data[i],self);
          }
          html +='<li>]</li>';
          html +='</ul>';
        }else{
          html +='<li>[]</li>';
        }
      }else if(typeof data === 'object'){
        var key_count = Object.keys(data).length;
        var json = data;
        if(key_count>0){
          html +='<ul>';
          html +='<li>{</li>';
          for (var key in json){
            if(Utils.isArray(json[key]) ){
              if(json[key].length>0){
                html +='<li>"'+key+'":</li>';
              }else{
                html +='<li>"'+key+'":[]</li>';
              }
              html +=handleJsonData(json[key],self);
            }else if( typeof json[key] === 'object'){
              if(!Utils.isEmptyObject(json[key])){
                html +='<li>"'+key+'":</li>';
              }else{
                html +='<li>"'+key+'":{}</li>';
              }
              html +=handleJsonData(json[key],self);
            } else{
              html +='<li>"'+key+'":"'+json[key]+'"</li>';
            }
          }
          html +='<li>}</li>';
          html +='</ul>';

        }else{
          html +='<li>{}</li>';
        }
      }else{ }
    }

    return html;

  }

  function handleStatisticsMapData(self) {
    self.chartLoading=true;
    var xData = [];
    var allValue = [];
    axios({
      method: 'GET',
      url: g.url + '/interfaceCall/interfaceService?apiId='+sessionStorage.getItem('apiId')+'&time='+self.time,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'token': sessionStorage.getItem('token')
      }
    }).then(function (result) {

      if (result.status == 200) {
          vm.echartMsg= result.data.data.interfaceCalls
         self.items.totalCall=result.data.data.total;
         self.chartLoading=false;
//          vm.totalCall=result.data.data.total;
//          console.log(result.data.data.total);
        for (let i = 0; i < vm.echartMsg.length; i++) {
          xData.push(vm.echartMsg[i].date);
          allValue.push(vm.echartMsg[i].count);
        }
//        for(let i=0;i<vm.echartMsg.length;i++){
//          xData.push(vm.echartMsg[i].date);
//          allValue.push(vm.echartMsg[i].count);
//        }
        setStatisticsMap(xData, allValue,self);

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

  /*
 * 服务统计图
 * */
  function setStatisticsMap(xData, allValue,self) {
    var option = {
      backgroundColor:'white',
      tooltip: {
        show: false,
      },
      grid: {
        top: '10px',
        left: '10px',
        right: '35px',
        bottom: '20px',
        containLabel: true
      },
      xAxis: {
        type: 'category',

        axisLine: {
          show: true,
          lineStyle: {
            color: '#cccccc',
          }
        },
        splitLine:{
          show: false,
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#64696f',
          }
        },
        axisLabel: {
          show:true,
          textStyle: {
            color: '#3f494f'
          }
        },
        data: xData,
        axisLine: {onZero: false},
        boundaryGap: false, //两端空白
      },
      yAxis: {
        type: 'value',
        "axisLine": {
          lineStyle: {
            color: '#64696f',
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ccc',
          }
        },
        axisLabel: {
          show: true,
          formatter: function(value) {
            return value;
          },
          textStyle: {
            color: '#3f494f'
          }

        },
        axisTick: {
          show: true
        },
        boundaryGap: [0,'20%'],
        axisLine: {onZero: false},
      },
      series: [{
        type: 'line',
        symbolSize: 8,
        lineStyle: {
          normal: {
            color: '#aed4c2',
            width: 2,
          },
        },
        label:{
          show:true
        },
        itemStyle: {
          normal: {
            color: "#aed4c2"
          },

        },
        areaStyle: {
          normal: {
            color: '#aed4c2'
          }
        },
        data: allValue
      }]
    };
    self.statisticsMap.setOption(option, true);

  }

</script>

<style scoped>


  section>div{
    width: 49.5%;
  }

  section .left-content>div,
  section .right-content>div{
    width: 100%;
    background-color: white;
    border-radius: 10px;
    border: solid 1px #e7eaec;
  }

  section .left-content>div>div,
  section .right-content>div>div{
    width: 95%;
    margin: 0 auto;
  }

  section .left-content>div.details{
    /*height: 269px;*/
    min-height: 269px;
    /*padding: 0 37px 0 27px;*/
  }
  .left-content>div.details p{
    font-size: 18px;
    color: #526069;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .left-content div.mark{
    margin-bottom: 20px;
  }

  .left-content div.mark>span{
    border-radius: 10px;
    font-size: 12px;
    color: #ffffff;
    padding: 3px 13px;
    display: inline-block;
    vertical-align: top;
  }

  .left-content div.mark>span:first-child{
    background-color: #277bd8;
  }

  .left-content div.mark>span:last-child{
    background-color: #54bd72;
    padding: 2px 13px;
  }

  .left-content>div.details div.com{
    clear: both;
    padding: 5px 0;
  }

  .left-content>div.details div.com span{
    font-size: 13px;
    display: inline-block;
    vertical-align: top;

  }

  .left-content>div.details div.com span:first-child{
    color: #76838f;
    margin-right: 10px;
  }

  .left-content>div.details div.com span:last-child{
    color: #3f494f;
    width: 90%;
  }

  /*请求参数说明*/

  .block-area>div p{
    font-size: 14px;
    color: #526069;
    font-weight: bold;
  }

  .left-content>div.request-parameter{
    height: 242px;
    margin: 13px 0;
  }

  .left-content table,
  .right-content table{
    width: 100%;
    text-align: left;
  }
  .left-content table tr,
  .right-content table tr{
    height: 38px;
  }

  .left-content table thead,
  .right-content table thead{
    font-size: 13px;
    color: #526069;
    font-weight: normal;
  }

  .left-content table thead tr th:first-child,
  .right-content table thead tr th:first-child{
    padding-left: 4px;
  }

  .left-content table thead th,
  .right-content table thead th{
    border-bottom: 1px solid #e4eaec;
    font-weight: normal;
  }
  .left-content  table td,
  .right-content table td{
    font-size: 13px;
    color: #76838f;
  }

  .left-content table td.type span,
  .right-content table td.type span{
    color: #ffffff;
    display: inline-block;
    padding: 4px 5px;
    border-radius: 2px;
  }

  .left-content table tr:nth-child(even) td.type span,
  .right-content table tr:nth-child(even) td.type span{
    background-color: #f2a654;
  }
  .left-content table tr:nth-child(odd) td.type span,
  .right-content table tr:nth-child(odd) td.type span{
    background-color: #57c7d4;
  }

  /*返回参数说明*/
  .left-content .return-parameter{
    height: 242px;
  }

  /*右边的内容*/

  /*服务统计*/
  .right-content .service-statistics{
    height: 269px;
  }

  .right-content .service-statistics span{
    font-size: 16px;
    line-height: 27px;
    display: inline-block;
    color: #526069;
    margin-top: 11px;
  }

  .right-content .service-statistics span b{
    font-size: 24px;
    color: #4e97d9;
    margin: 0 2px;
  }

  .right-content .service-statistics ul{
    list-style: none;
  }

  .right-content .service-statistics ul li{
    display: inline-block;
    vertical-align: top;
    width: 52px;
    height: 23px;
    border-radius: 13px;
    border: solid 1px #62a8ea;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
    color: #62a8ea;
    cursor: pointer;
  }

  .right-content .service-statistics ul li.active{
    background-color: #62a8ea;
    color: #ffffff;
  }


  .right-content .service-statistics #statisticsMap{
    height: 187px;
    background-color: #f3f3f3;
    width: 100%;
    margin: 17px 0;
  }

  /*输入参数*/
  .right-content div.input-parameter{
    margin-top: 13px;
    height: 496px;
    position: relative;
  }

  .right-content div.input-parameter>div>div{
    display: inline-block;
    vertical-align: top;
  }

  .right-content div.input-parameter div.json-show{
    width: 60%;
    margin-right: 1%;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.input-content{
    width: 100%;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.no-json p{
    display: none;
  }

  .right-content div.input-parameter div.has-json p{
    display:inline-block;
  }

  .right-content div.input-parameter div.no-json{
    width: 0;
    height: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.has-json{
    width: 37%;
    height: 465px;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }


  .right-content div.input-parameter div.return-json{
    position: absolute;
    top:10px;
    right:2%;
    background-color: #f1f4f5;
    border-radius: 3px;
    color: #76838f;
    margin: 14px 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .right-content div.input-parameter div.return-json>p{
    font-size: 13px;
    color: #526069;
    padding-left: 10px;

  }

  .right-content table input{
    width: 80%;
    height: 22px;
    background-color: #f1f4f5;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    outline: none;
    padding-left: 10px;
  }

  .right-content table tbody tr:last-child td{
    border-bottom: 1px solid #e4eaec;
  }

  .right-content  div.submit-debug input{
    background-color: #f1f4f5;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    outline: none;
    padding-left: 10px;
    height: 28px;
  }


  .right-content div.input-content div.submit-debug input{
    width: 40%;
  }

  .right-content div.json-show div.submit-debug input{
    width: 97%;
  }

  .right-content div.json-show div.submit-debug{
    text-align: right;
  }

  .right-content div.json-show div.submit-debug button{
    margin-top: 10px;
  }

  .right-content div.submit-debug button{
    width: 114px;
    height: 32px;
    background-color: #43c273;
    border-radius: 3px;
    color: #ffffff;
    border: none;
    font-size: 14px;
    cursor: pointer;
  }
  .right-content div.input-parameter div.return-json i{
    font-size: 16px;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
  .table-content{
    position: relative;
  }

  .roll-table{
    height: 190px;
    overflow: auto;
  }

  .fixation-table{
    position: absolute;
    background-color: #fafafb;
  }
  pre{
    display: block;
    height: 387px;
    width: 90%;
    margin: 0 auto;
    padding: 0 0 10px 0;
    overflow: auto;
  }
  code p{
    margin: 0;
    padding: 0;
    color: #76838f;
  }

  /*底部*/
  div.footer {
    margin-top: 62px;
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
    cursor: pointer;
  }

  div.footer ul li a{
    color: #62a8ea;
    text-decoration: none;
  }


  div.footer ul li i{
    margin-right: 3px;
  }
  div.footer ul li:last-child i{
    display: inline-block;
    margin: 0 5px;
  }

  div.footer ul li:last-child{
    color: #76838f;
    cursor: default;
  }
  .right-content table input:focus{
    border-color: #409EFF;
  }
  .right-content  div.submit-debug input:focus{
    border-color: #409EFF;
  }

</style>
<link rel="stylesheet" href="../../css/com.css">
