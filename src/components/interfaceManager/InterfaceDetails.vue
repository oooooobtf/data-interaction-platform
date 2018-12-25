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
      <div class="left-content fl">
        <!--接口详情-->
        <div class="details">
          <div>
            <p>{{allData.apiName}}</p>
            <div class="mark clearfix">
              <span>{{allData.apiType}}</span>
              <span>返回格式：{{allData.responseType}}</span>
            </div>
            <div class="com">
              <span>请求方式</span>
              <span>{{allData.requestype}}</span>
            </div>
            <div class="com">
              <span>接口地址</span>
              <span>{{allData.apiAccess}}</span>
            </div>
            <div class="com">
              <span>接口描述</span>
              <span>{{allData.details}}</span>
            </div>
            <div class="com">
              <span>请求示例</span>
              <span>{{allData.requestExample}}</span>
            </div>
          </div>
        </div> <!--接口详情  end-->

        <!--请求参数说明-->
        <div class="request-parameter block-area">
          <div>
            <p>请求参数说明</p>
            <div class="table-content">
              <!--固定的行-->
              <table class="fixation-table" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
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
                  <tr v-for="item in requestParameters">
                    <td class="name" style="width: 10%">{{item.name}}</td>
                    <td class="type" style="width: 10%"><span>{{getType(item.type)}}</span></td>
                    <td class="required" style="width: 10%">{{item.require ? '是' : '否'}}</td>
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
            <div id="operation">
              <span class="edit" v-if="false" v-show="isEdit" @click="editReturnParameter()">编辑</span>
              <span class="save" v-show="!isEdit" @click="saveReturnParameter()">保存</span>
              <span class="cancel" v-show="!isEdit">取消</span>
            </div>
            <div class="table-content">
              <!--固定的行-->
              <table class="fixation-table" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                <thead>
                <tr>
                  <th style="width: 15%">名称</th>
                  <!--<th style="width: 10%">类型</th>-->
                  <th style="width: 75%">说明</th>
                </tr>
                </thead>
              </table><!--固定的行  end -->
              <!--表格内容-->
              <div class="roll-table">
                <table cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
                  <thead>
                  <tr>
                    <th style="width: 15%">名称</th>
                    <!--<th style="width: 10%">类型</th>-->
                    <th style="width: 75%">说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in responseParameters">
                    <td class="name" style="width: 15%">{{item.name}}</td>
                    <!--<td class="type" style="width: 10%"><span>{{getType(item.type)}}</span></td>-->
                    <td class="explain handle-text" style="width: 75%">
                      <span v-show="isEdit">{{item.description}}</span>
                      <input v-show="!isEdit" type="text" v-model="item.description"/>
                    </td>
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
            <span>近{{timeFlag}}{{timeName}}为您提供<b>{{allData.totalCall}}</b>次服务</span>
            <ul class="fr">
              <li @click="cutTimeData(24,$event)" class="active">今日</li>
              <li @click="cutTimeData(7,$event)">7日</li>
              <li @click="cutTimeData(30,$event)">30日</li>
            </ul>

            <div id="statisticsMap"></div>
          </div>

        </div><!--服务统计  end-->

        <!--输入参数-->
        <div class="input-parameter block-area">
          <div>
            <!--输入参数-->
            <div :class="isShowCode?'json-show':'input-content'">
              <p>输入参数</p>
              <div class="table-content">
                <!--固定的行-->
                <table class="fixation-table" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
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
                    <tr v-for="item in requestParameters">
                      <td class="name" style="width: 20%" v-bind:data-key="item.name"
                          v-bind:data-require="item.require">
                        <input/>
                      </td>
                      <td class="type" style="width: 15%"><span>{{getType(item.type)}}</span></td>
                      <td class="required" style="width: 15%">{{item.require ? '是' : '否'}}</td>
                      <td class="explain handle-text" style="width: 60%">{{item.description}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>输入Token</p>
              <div class="submit-debug">
                <span><input v-model="token"/></span>
                <button @click="submitDebug()">提交调试</button>
              </div>
            </div><!--输入参数 end-->

            <!--json展示-->
            <div class="return-json" :class="isShowCode?'has-json':'no-json'">
              <i class="icon wb-close" @click="closeJsonShow()"></i>
              <p>JSON返回示例：</p>
              <pre id="returnJson">
                <code v-html="codeHtml">
                <!--<code id="codeJson">-->

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
            <a @click="goToSystemManage()">
              <i class="icon fa-code-fork"></i>
              <span>接口管理</span>
            </a>
          </li>
          <li>
            <i>/</i>
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
  import niceScroll from '../../js/jquery.nicescroll.min'
  import g from '../common.vue';
  import {Utils} from '../../js/utils'


  export default {
    components: {ElHeader},
    name: 'interfaceDetails',
    data() {
      return {
        statisticsMap: '',
        codeHtml: '',
        isShowCode: false,
        apiId: '',
        allData: {},
        timeFlag: "24",
        timeName: "小时",
        loading: true,
        chartLoading: true,
        token: '',
        requestParameters: [],//请求参数
        responseParameters: [],
        isEdit: true,
      }
    },
    methods: {
      submitDebug: function () {
        var self = this;
        /*提交测试*/
        this.isShowCode = true;
        debuggingInterface(self);
      },
      //回到  接口  系统详情
      goToSystemManage: function () {
        this.$router.push({path: "/menu/interfaceManager"})
      },
      //得到数据类型
      getType: function (type) {
        var arr = [];
        if (type != null) {
          arr = type.split('.');
          return arr[arr.length - 1];
        } else {
          return '';
        }

      },
      cutTimeData: function (flag, e) {
        let self = this;
        $(e.target).parent().find('li').removeClass('active');
        $(e.target).addClass('active');
        if (flag == 24) {
          self.timeName = "小时"
          self.timeFlag = flag
        } else {
          self.timeName = "日"
          self.timeFlag = flag;
        }

        getStatisticsDataByTime(self);

      },
      closeJsonShow() {
        this.isShowCode = false;
      },
      editReturnParameter: function () {
        //编辑返回参数
        this.isEdit = false;
      },
      saveReturnParameter: function () {
        this.isEdit = true;
      }
    },
    mounted() {
      var self = this;
      self.apiId = window.sessionStorage.getItem('DDMAPIID');
      self.statisticsMap = echarts.init(document.getElementById('statisticsMap'));
      window.onresize = function () {
        //重置容器高宽
        self.statisticsMap.resize();
      };
      getAllData(self, self.apiId);
      getStatisticsDataByTime(self)
    },

    updated() {
      $('code p').css('margin', '0');
      $('code>ul').css({'padding': '0'})
      $('code ul').css({
        'list-style': ' none',
        'padding-left': '20px'
      });
      $('code ul li').css({
        'padding-left': '4px'
      })
    }

  }

  /*
  * 获取所有的数据
  * */
  function getAllData(self, apiId) {
    $.ajax({
      url: g.url + '/interface/getInterfaceDetail?apiId=' + apiId,
      type: 'get',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.allData = result.data;
          self.requestParameters = result.data.requestParameters;
          self.responseParameters = result.data.responseParameters;
          handleStatisticsMapData(self, result.data.interfaceDateAndCountBOS);
          self.loading = false
          self.chartLoading = false;
        } else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function () {
            self.$router.push({path: "/"});
          }, 2000)
        }
      }
    })
  }


  /*
  * 调试接口
  * */
  function debuggingInterface(self) {
    var params = [];
    var keys = [];
    var values = [];
    $('.input-params tr').each(function (index) {
      keys.push($(this).find('td.name').attr('data-key'));
      values.push($(this).find('td.name input').val());
    })
    for (var i = 0; i < keys.length; i++) {
      params.push({
        'key': keys[i],
        'value': values[i]
      })
    }

    var data = {
      "id": self.apiId,
      "params": params,
      "requestType": self.allData.requestype,
      "token": self.token,
      "url": self.allData.apiAccess
    }
    $.ajax({
      url: g.url + '/interfaceCall/interfaceDebug',
      type: 'post',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      data: JSON.stringify(data),
      success: function (result) {
        if (typeof result === 'string') {
          result = $.parseJSON(result);
        }
        self.codeHtml = handleJsonData(result, self);
      }
    })
  }


  /*
  * 通过时间获取服务统计图的数据
  * */
  function getStatisticsDataByTime(self) {
    self.chartLoading = true;
    $.ajax({
      type: 'get',
      url: g.url + '/interfaceCall/interfaceService?apiId=' + self.apiId + '&time=' + self.timeFlag,
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          handleStatisticsMapData(self, result.data.interfaceCalls);
          self.allData.totalCall = result.data.total;
          self.chartLoading = false;
        } else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function () {
            self.$router.push({path: "/"});
          }, 2000)
        }
      },
      error: function () {

      }
    })
  }

  /*
  * 处理json数据
  * */
  function handleJsonData(data, self) {
    var html = '';
    if (!Utils.isEmptyObject(data)) {

      if (Utils.isArray(data)) {
        if (data.length > 0) {
          html += '<ul>';
          html += '<li>[</li>';
          for (var i = 0; i < data.length; ++i) {
            html += handleJsonData(data[i], self);
          }
          html += '<li>]</li>';
          html += '</ul>';
        } else {
          html += '<li>[]</li>';
        }
      } else if (typeof data === 'object') {
        var key_count = Object.keys(data).length;
        var json = data;
        if (key_count > 0) {
          html += '<ul>';
          html += '<li>{</li>';
          for (var key in json) {
            if (Utils.isArray(json[key])) {
              if (json[key].length > 0) {
                html += '<li>"' + key + '":</li>';
              } else {
                html += '<li>"' + key + '":[]</li>';
              }
              html += handleJsonData(json[key], self);
            } else if (typeof json[key] === 'object') {
              if (!Utils.isEmptyObject(json[key])) {
                html += '<li>"' + key + '":</li>';
              } else {
                html += '<li>"' + key + '":{}</li>';
              }
              html += handleJsonData(json[key], self);
            } else {
              html += '<li>"' + key + '":"' + json[key] + '"</li>';
            }
          }
          html += '<li>}</li>';
          html += '</ul>';

        } else {
          html += '<li>{}</li>';
        }
      } else {

      }
    } else {

    }

    return html;

  }


  /**
   * 检查arg是否有至少1个元素的数组，或者至少有1个键
   * @return boolean
   */
  function isCollapsable(arg) {
    return arg instanceof Object && Object.keys(arg).length > 0;
  }

  /*
  *
  * 处理服务统计图的数据
  * */
  function handleStatisticsMapData(self, data) {
    var mainData = data;
    var xData = [];
    var allValue = [];
    if (!Utils.isEmptyObject(mainData)) {
//      var len = mainData.length - 1;
//      for (var i = len; i >= 0; i--) {
//        xData.push(mainData[i].date);
//        allValue.push(mainData[i].count);
//      }
      for (var i = 0; i < mainData.length; i++) {
        xData.push(mainData[i].date);
        allValue.push(mainData[i].count);
      }

      for (var i = 0; i < mainData.length; i++) {
//        xData.push(mainData[i].date);
//        allValue.push(mainData[i].count);
      }
    }


    setStatisticsMap(xData, allValue, self);
  }

  /*
 * 服务统计图
 * */
  function setStatisticsMap(xData, allValue, self) {
    var option = {
      backgroundColor: 'white',
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      grid: {
        top: '10px',
        left: '10px',
        right: '30px',
        bottom: '20px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        fontSize: 10,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#cccccc',
          }
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#64696f',
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#3f494f'
          },
        },
        data: xData,
        axisLine: {onZero: false},
        boundaryGap: false, //两端空白
      },
      yAxis: {
        type: 'value',
        axisLine: {
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
          formatter: function (value) {
            return value;
          },
          textStyle: {
            color: '#3f494f'
          }

        },
        axisTick: {
          show: true
        },
        boundaryGap: [0, '20%'],
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
        itemStyle: {
          normal: {
            color: "#aed4c2",
            label: {show: true},
            position: 'top'
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
  section > div {
    width: 49.5%;
  }

  section .left-content > div,
  section .right-content > div {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    border: solid 1px #e7eaec;
    position: relative;
  }

  section .left-content > div > div,
  section .right-content > div > div {
    width: 95%;
    margin: 0 auto;
  }

  section .left-content > div.details {
    /*height: 269px;*/
    min-height: 269px;
    /*padding: 0 37px 0 27px;*/
  }

  .left-content > div.details p {
    font-size: 18px;
    color: #526069;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .left-content div.mark {
    margin-bottom: 20px;
  }

  .left-content div.mark > span {
    border-radius: 10px;
    font-size: 12px;
    color: #ffffff;
    padding: 3px 13px;
    display: inline-block;
    vertical-align: top;
  }

  .left-content div.mark > span:first-child {
    background-color: #277bd8;
  }

  .left-content div.mark > span:last-child {
    background-color: #54bd72;
    padding: 2px 13px;
  }

  .left-content > div.details div.com {
    clear: both;
    padding: 5px 0;
  }

  .left-content > div.details div.com span {
    font-size: 13px;
    display: inline-block;
    vertical-align: top;

  }

  .left-content > div.details div.com span:first-child {
    color: #76838f;
    margin-right: 10px;
  }

  .left-content > div.details div.com span:last-child {
    color: #3f494f;
    width: 90%;
  }

  /*请求参数说明*/

  .block-area > div p {
    font-size: 14px;
    color: #526069;
    font-weight: bold;
  }

  .left-content > div.request-parameter {
    height: 242px;
    margin: 13px 0;
  }

  .left-content table,
  .right-content table {
    width: 100%;
    text-align: left;
  }

  .left-content table tr,
  .right-content table tr {
    height: 38px;
  }

  .left-content table thead,
  .right-content table thead {
    font-size: 13px;
    color: #526069;
    font-weight: normal;
  }

  .left-content table thead tr th:first-child,
  .right-content table thead tr th:first-child {
    padding-left: 4px;
  }

  .left-content table thead th,
  .right-content table thead th {
    border-bottom: 1px solid #e4eaec;
    font-weight: normal;
  }

  .left-content table td,
  .right-content table td {
    font-size: 13px;
    color: #76838f;
  }

  .left-content table td.type span,
  .right-content table td.type span {
    color: #ffffff;
    display: inline-block;
    padding: 4px 5px;
    border-radius: 2px;
  }

  .left-content table tr:nth-child(even) td.type span,
  .right-content table tr:nth-child(even) td.type span {
    background-color: #f2a654;
  }

  .left-content table tr:nth-child(odd) td.type span,
  .right-content table tr:nth-child(odd) td.type span {
    background-color: #57c7d4;
  }

  /*返回参数说明*/
  .left-content .return-parameter {
    height: 242px;
  }

  .left-content .return-parameter input {
    width: 93%;
    background-color: #f1f4f5;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    outline: none;
    padding-left: 10px;
    height: 24px;
  }

  /*右边的内容*/

  /*服务统计*/
  .right-content .service-statistics {
    height: 269px;
  }

  .right-content .service-statistics span {
    font-size: 16px;
    line-height: 27px;
    display: inline-block;
    color: #526069;
    margin-top: 11px;
  }

  .right-content .service-statistics span b {
    font-size: 24px;
    color: #4e97d9;
    margin: 0 2px;
  }

  .right-content .service-statistics ul {
    list-style: none;
  }

  .right-content .service-statistics ul li {
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

  .right-content .service-statistics ul li.active {
    background-color: #62a8ea;
    color: #ffffff;
  }

  .right-content .service-statistics #statisticsMap {
    height: 187px;
    background-color: #f3f3f3;
    width: 100%;
    margin: 17px 0;
  }

  /*输入参数*/
  .right-content div.input-parameter {
    margin-top: 13px;
    height: 496px;
    position: relative;
  }

  .right-content div.input-parameter > div > div {
    display: inline-block;
    vertical-align: top;
  }

  .right-content div.input-parameter div.json-show {
    width: 60%;
    margin-right: 1%;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.input-content {
    width: 100%;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.no-json p {
    display: none;
  }

  .right-content div.input-parameter div.no-json i {
    opacity: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.has-json p {
    display: inline-block;
  }

  .right-content div.input-parameter div.has-json i {
    display: inline-block;
    opacity: 1;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.no-json {
    width: 0;
    height: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.has-json {
    width: 37%;
    height: 465px;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .right-content div.input-parameter div.return-json {
    position: absolute;
    top: 10px;
    right: 2%;
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

  .right-content div.input-parameter div.return-json i {
    font-size: 16px;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
  }

  .right-content div.input-parameter div.return-json > p {
    font-size: 13px;
    color: #526069;
    padding-left: 10px;

  }

  .right-content table input {
    width: 80%;
    height: 22px;
    background-color: #f1f4f5;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    outline: none;
    padding-left: 10px;
  }

  .right-content table tbody tr:last-child td {
    border-bottom: 1px solid #e4eaec;
  }

  .right-content div.submit-debug input {
    background-color: #f1f4f5;
    border-radius: 3px;
    border: solid 1px #e4eaec;
    outline: none;
    padding-left: 10px;
    height: 28px;
  }

  .right-content div.input-content div.submit-debug input {
    width: 40%;
  }

  .right-content div.json-show div.submit-debug input {
    width: 97%;
  }

  .right-content div.json-show div.submit-debug {
    text-align: right;
  }

  .right-content div.json-show div.submit-debug button {
    margin-top: 10px;
  }

  .right-content div.submit-debug button {
    width: 114px;
    height: 32px;
    background-color: #43c273;
    border-radius: 3px;
    color: #ffffff;
    border: none;
    font-size: 14px;
    cursor: pointer;
  }

  .table-content {
    position: relative;
  }

  .roll-table {
    height: 190px;
    overflow: auto;
  }

  .fixation-table {
    position: absolute;
    background-color: #fafafb;
  }

  pre {
    display: block;
    height: 387px;
    width: 90%;
    margin: 0 auto;
    padding: 0 0 10px 0;
    overflow: auto;
  }

  code p {
    margin: 0;
    padding: 0;
    color: #76838f;
  }

  code ul {
    list-style: none;
  }

  code ul li {
    padding-left: 10px;
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

  div.footer ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  div.footer ul li {
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
  }

  div.footer ul li a {
    color: #62a8ea;
    text-decoration: none;
  }

  div.footer ul li i {
    margin-right: 3px;
  }

  div.footer ul li:last-child i {
    display: inline-block;
    margin: 0 5px;
  }

  div.footer ul li:last-child {
    color: #76838f;
    cursor: default;
  }

  .right-content table input:focus {
    border-color: #409EFF;
  }

  .right-content div.submit-debug input:focus {
    border-color: #409EFF;
  }

  #operation {
    position: absolute;
    right: 28px;
    top: 10px;
  }

  #operation span {
    display: inline-block;
    width: 60px;
    height: 26px;
    text-align: center;
    border-radius: 3px;
    line-height: 26px;
    color: #ffffff;
    cursor: pointer;
  }

  #operation span.edit {
    background-color: #64abe9;
  }

  #operation span.save {
    background-color: #43c473;
  }

  #operation span.cancel {
    background-color: #e5e5e6;
    color: #b0b8be;
  }
</style>
<link rel="stylesheet" href="../../css/com.css">
