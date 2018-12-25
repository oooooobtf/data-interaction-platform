<!--数据监控-->
<template>
  <div>
    <section class="clearfix aaa" style=" margin-left: 200px;
    padding: 22px 20px 1px;
    top: 60px;
    position: relative;background-color: #f1f4f5;" v-loading="loading "
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">

      <!--第一行-->
      <div>
        <!--业务系统概况-->
        <div class="sys-general block-area">
          <div>
            <div class="title">
              <span>业务系统概况</span>
            </div>
            <ul>
              <li>
                <p>{{allData.all}}<sup>个</sup></p>
                <p>总计</p>
              </li>
              <li style="color: #62a8ea;">
                <p>{{allData.valid}}<sup>个</sup></p>
                <p>已启用</p>
              </li>
              <li style="color: #f96868;">
                <p>{{allData.not}}<sup>个</sup></p>
                <p>已禁用</p>
              </li>
            </ul>
          </div>
        </div><!--业务系统概况  end-->

        <!--接口调用情况-->
        <div class="interface-situation block-area">
          <div>
            <ul>
              <li>
                <p>Hisi-Comb接口调用总量：</p>
                <p>{{separationThrees(allData.total ? allData.total : '0')}}<span>次</span></p>
              </li>
            </ul>
          </div>
        </div> <!--接口调用情况 end -->
      </div>

      <!--第二行-->
      <div class="two-row">
        <!--系统调用接口次数占比-->
        <div class="block-area sys-interface-count">
          <div>
            <div class="title">
              <span>系统调用接口次数占比</span>
            </div>

            <div id="sysInterfaceCount"></div>
          </div>
        </div> <!--系统调用接口次数占比  end-->

        <!--24小时接口响应时间-->
        <div class="response-time block-area" style="position: relative;">
          <div>
            <div class="title">
              <span>24小时接口响应时间</span>
              <!--图列-->
              <ul class="legend-ul fr" style="display: none">
                <li><i style="background-color: #c23531"></i><span>航班</span></li>
                <li><i style="background-color: #384b5a"></i><span>乘客</span></li>
                <li><i style="background-color: #61a0a8"></i><span>行李</span></li>
              </ul>
            </div>

            <div id="bigResponseTime" v-loading="loading24"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">

              <div id="responseTimeMap"></div>
            </div>
          </div>
        </div><!--24小时接口响应时间  end-->

        <!--失败接口-->
        <!--<div class="defeated-interface block-area">-->
        <!--<div>-->
        <!--<div class="title">-->
        <!--<span>失败接口</span>-->
        <!--</div>-->
        <!--<table style="table-layout: fixed" cellspacing="0" cellpadding="0" border="0">-->
        <!--<thead>-->
        <!--<tr>-->
        <!--<th style="width: 25%">时间</th>-->
        <!--<th style="width: 50%">接口名称</th>-->
        <!--<th style="width: 25%">耗时</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--</table>-->
        <!--<div class="main-table">-->
        <!--<table style="table-layout: fixed" cellspacing="0" cellpadding="0" border="0">-->
        <!--<tbody>-->
        <!--<tr v-for="item in failInterfaceInfo">-->
        <!--<td style="width: 25%"><span>{{handleTime(item.requestTime)}}</span></td>-->
        <!--<td style="width: 50%" class="handle-text">{{item.apiName}}</td>-->
        <!--<td style="width: 25%">{{item.responseTime}}ms</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--</table>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--失败接口  end-->

      </div>

      <!--第三行-->
      <div class="three-row">
        <!--业务系统调取次数-->
        <div class="block-area business-sys-count">
          <div>
            <div class="title">
              <span>业务系统调取次数</span>
              <!--图列-->
              <ul class="legend-ul fr">
                <li><i style="background-color: #7dd3ae"></i><span>昨天</span></li>
                <li><i style="background-color: #62a8ea"></i><span>今天</span></li>
              </ul>
            </div>
            <div id="businessSysMap" v-loading="businessLoading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"></div>
          </div>
        </div><!--业务系统调取次数  end-->

        <!--当前较慢接口TOP5-->
        <div class="slow-interface block-area" v-loading="slowLoading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
          <div>
            <div class="title">
              <span>当前较慢接口TOP5</span>
            </div>
            <!--<div id="slowInterfaceMap"></div>-->
            <table style="table-layout: fixed" cellspacing="0" cellpadding="0" border="0">
              <thead>
              <tr>
                <th style="width: 25%">排序</th>
                <th style="width: 50%">接口名称</th>
                <th style="width: 25%">耗时</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in slowInterfaceData">
                <td><span>{{index + 1}}</span></td>
                <td class="handle-text">{{item.name}}</td>
                <td>{{item.value}}ms</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div> <!--当前较慢接口TOP5  end-->

        <!--当前调用最多接口TOP5-->
        <div class="block-area current-at-most-interface" v-loading="moreLoading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
          <div>
            <div class="title">
              <span>当前调用最多接口TOP5</span>
            </div>
            <table style="table-layout: fixed" cellspacing="0" cellpadding="0" border="0">
              <thead>
              <tr>
                <th style="width: 25%">排序</th>
                <th style="width: 50%">接口名称</th>
                <th style="width: 25%">次数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in interfaceCallMost5s">
                <td><span>{{index + 1}}</span></td>
                <td class="handle-text">{{item.name}}</td>
                <td>{{item.value}}次</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div><!--当前调用最多接口TOP5  end-->

      </div>


    </section>
  </div>
</template>

<script>
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
  import echarts from 'echarts';
  import g from '../common.vue'
  import {DateUtils} from '../../js/DateUtils'
  import {Utils} from "../../js/utils";


  export default {
    components: {
      ElMain,
      ElHeader,
      ElContainer
    },
    name: 'dataMonitoring',
    data() {
      return {
        businessSysMap: '',
//        slowInterfaceMap: '',
        responseTimeMap: '',
        sysInterfaceCount: '',
        allData: {},
        legend: ['航班', '乘客', '行李'],
        failInterfaceInfo: [],
        loading: false,
        loading24: false,
        businessLoading: false,
        slowLoading: false,
        moreLoading: false,
        slowInterfaceData: [],
        interfaceCallMost5s: [],
        time: 30
      }
    },
    created() {
    },
    mounted() {
      let self = this;
      self.businessSysMap = echarts.init(document.getElementById('businessSysMap'));
      self.responseTimeMap = echarts.init(document.getElementById('responseTimeMap'));
//      self.responseTimeMap = echarts.init(document.getElementById('responseTimeMap'));
//      self.businessSysMap = echarts.init(document.getElementById('businessSysMap'));

//      self.slowInterfaceMap = echarts.init(document.getElementById('slowInterfaceMap'));
//      self.sysInterfaceCount = echarts.init(document.getElementById('sysInterfaceCount'));
//      getAllDAta(self);
      getDataCount(self)
      getData24Hour(self)
      getDataCountSystem(self)
      getDataSpeedTop5(self)


//      var getData = setInterval(function () {
//        if(self.responseTimeMap  && !self.responseTimeMap.isDisposed()){
//          self.responseTimeMap.clear();           //释放图形资源
//          self.responseTimeMap.dispose();
//        }
//        if(self.businessSysMap  && !self.businessSysMap.isDisposed()){
//          self.businessSysMap.clear();           //释放图形资源
//          self.businessSysMap.dispose();
//        }
//        getAllDAta(self);
//      },self.time * 1000);
      self.separationThrees(18458745)
//        console.log(self.separationThrees(18458745))
    },

    updated() {
      let self = this;
      window.onresize = function () {
        //重置容器高宽
        self.businessSysMap.resize();
//        self.slowInterfaceMap.resize();
        self.responseTimeMap.resize();
      };


    },
    methods: {
      /* 处理时间 */
      handleTime(time) {
        return Utils.getDateFormat(time, 'HH:mm:ss').dateFormat;
      },
      separationThrees(num) {
        var wantNum = '';
        if (num != '') {
          wantNum = parseInt(num).toLocaleString();
        }
        return wantNum;
      },
    }

  };


  //定时得到数据
  function getIntervalData(time) {
    var getData = setInterval(function () {
      getAllDAta(self);
    }, time * 1000);
  }

  //  接口调用次数
  function getDataCount(self) {
    $.ajax({
      type: 'get',
      url: g.url + '/interfaceCall/base',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.allData = result.data.state;
          self.allData['total'] = result.data.total;
          handleSysInterfaceCountMapData(result.data.detail, self);
        } else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      },
      error: function (e) {
      }
    })
  }

  //  24小时接口响应时间
  function getData24Hour(self) {
    self.loading24 = true;
    $.ajax({
      type: 'get',
      url: g.url + '/interfaceCall/api/response',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.loading24 = false;
          handleResponseTimeMapData(self, result.data);
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      },
      error: function (e) {
      }
    })
  }

  //  业务系统调取次数
  function getDataCountSystem(self) {
    self.businessLoading = true;
    $.ajax({
      type: 'get',
      url: g.url + '/interfaceCall/system/call',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.businessLoading = false;
          handleBusinessSysMapData(result.data, self);
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      },
      error: function (e) {
      }
    })
  }

  //  TOP5接口
  function getDataSpeedTop5(self) {
    self.slowLoading = true;
    self.moreLoading = true;
    $.ajax({
      type: 'get',
      url: g.url + '/interfaceCall/top5',
      beforeSend: function (xmlhttprequest) {
        xmlhttprequest.setRequestHeader('token', sessionStorage.getItem('token'))
        xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
      },
      success: function (result) {
        if (Number(result.status) == 200) {
          self.slowLoading = false;
          self.moreLoading = false;
          self.slowInterfaceData = result.data.slowest;
          self.interfaceCallMost5s = result.data.most;
        }else if (result.status == 401) {
          self.$message({
            type: 'error',
            message: result.msg + '!'
          })
          setTimeout(function(){
            self.$router.push({path: "/"});
          },2000)
        }
      },
      error: function (e) {
      }
    })
  }

  /*
  * 处理系统调用接口次数占比的数据
  * */
  function handleSysInterfaceCountMapData(data, self) {
    var systemRequest = data;
    var data = [];
    if (!Utils.isEmptyObject(systemRequest)) {
      for (var i = 0; i < systemRequest.length; i++) {
//        data.push({
//          value: systemRequest[i].count,
//          name: systemRequest[i].name
//        })

        data.push({
          value: systemRequest[i].count,
          label: systemRequest[i].name
        })
      }
    }
    var map;

    self.$nextTick(function () {
//      console.log($('#sysInterfaceCount').find('svg'))
      var len = $('#sysInterfaceCount').find('svg').length;
      if (len > 0) {
        $('#sysInterfaceCount').find('svg').remove();
      }

      map = Morris.Donut({
        resize: true,
        element: 'sysInterfaceCount',
        data: data,
        colors: ['#f96868', '#62a9eb', '#f3a754'],
        formatter: function (x) {
          return x + "次"
        }
      });

      window.morris = [];
      window.morris.push(map);

    })

//    setSysInterfaceCountMap(self, data);
//    setSysInterfaceCountMap1(self, data);

  }

  /*系统调用接口次数占比*/
  function setSysInterfaceCountMap(self, data) {
    var option = {
      backgroundColor: '#fff',
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: ['#62a9eb', '#f3a754', '#f96868'],
      series: [
        {
          name: '接口次数占比',
          type: 'pie',
          hoverAnimation: false, //设置饼图默认的展开样式
          center: ['50%', '50%'], //饼图的中心（圆心）坐标
          radius: [66, 96], //饼图的半径
          avoidLabelOverlap: false,
          minAngle: 20, //最小的扇区角度（0 ~ 360）
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
//              formatter:'{b} \n{d}次',
              formatter: '{d}',
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
                color: '#000',
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 3,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          data: data
        }
      ]
    };
    self.sysInterfaceCount.setOption(option, true);
    Utils.echartHeightLight(option, self.sysInterfaceCount, 1)
  }


  /*系统调用接口次数占比*/
  function setSysInterfaceCountMap1(self, data) {
    var option = {
      backgroundColor: '#fff',
      tooltip: {
        show: false,
        trigger: 'item',
      },
      color: ['#62a9eb', '#f3a754', '#f96868'],
      legend: {show: false},
      series: [{
        name: '接口次数占比',
        type: 'pie',
        hoverAnimation: false, //设置饼图默认的展开样式
//        clockwise: false, //饼图的扇区是否是顺时针排布
        minAngle: 20, //最小的扇区角度（0 ~ 360）
        center: ['50%', '50%'], //饼图的中心（圆心）坐标
        radius: [66, 96], //饼图的半径
        avoidLabelOverlap: true, ////是否启用防止标签重叠
        itemStyle: { //图形样式
          normal: {
            borderWidth: 3,
            borderColor: '#ffffff',
          },
          emphasis: {
            borderWidth: 0,
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        label: { //标签的位置
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            formatter: '{b} \n{d}次',
            textStyle: {
              fontSize: '20',
              color: '#000',
            }
          }
        },
        data: data
      }]
    };
    self.sysInterfaceCount.setOption(option, true);
  }


  /*
  * 处理24小时接口响应时间的数据
  * */
  function disposeTime(arr, list) {
    let array = [];
    for (let item of list) {
      let flag = 0;
      for (let i of arr) {
        if (i.time === item) {
          flag = 1;
          array.push(i.avgTime);
          continue
        }
      }
      if (flag === 0) {
        array.push(0);
      }

    }

    return array;
  }

  function handleResponseTimeMapData(self, data) {
    var sysData = data;
    var legend = [];
    var XData = [];
    var totalDate = [];
    var flightData = [];
    var passengerData = [];
    var luggageData = [];
    var seriesData = [];
    let newArry = JSON.parse(JSON.stringify(data))


    for (let k in data[0].info) {
      for (let j in data[0].info[k]) {
        totalDate.push(j)
      }
    }
    let dataArry = []
    for (let i in data) {
      dataArry = []
      for (let m in data[i].info) {
        for (let n in data[i].info[m]) {
          dataArry.push(data[i].info[m][n])
        }

      }
      newArry[i].info = dataArry
//      break;
    }
    ;

    if (!Utils.isEmptyObject(newArry)) {
      for (let item of newArry) {
        luggageData.push(item.name)
        seriesData.push({
          name: item.name,
          type: 'line',
          smooth: true,
          stack: item.name + '平均时间',
          areaStyle: {normal: {}},
          data: item.info
        })
      }
    }
//         for(var i = 0;i<sysData.length;i++){
//           XData.push(sysData[i].time);
//           var info = sysData[i].info;
// //          console.log("XData"+XData)
//           for(var j = 0;j<info.length;j++){
//             if(i == 0){
// //              console.log("进入i==0")
//               legend.push(info[j].systemName);
// //              console.log("legend==="+legend)
//             }
//             if(j == 0){
// //              console.log("进入j==0")
//               flightData.push(info[j].avgTime?info[j].avgTime:0);
// //              console.log("flightData==="+flightData)
//             }
//             if(j == 1){
//               passengerData.push(info[j].avgTime?info[j].avgTime:0);
//             }
//             if(j == 2){
//               luggageData.push(info[j].avgTime?info[j].avgTime:0);
//             }
//           }
//         }
//       }
//       self.legend =legend;
// //     setResponseTimeMap(self, flightData, passengerData, luggageData,XData);
//
//       /*   活的数据的处理   */
//       var legendData = [];
//       var seriesData = [];
//       var liveXData = [];
//       var len = 0;
//       if(!Utils.isEmptyObject(sysData)){
//           if(sysData.length>0){
//             len = sysData[0].info.length;
//           }
//           for(var k = 0;k<len;k++){
//             seriesData.push({
//               name:'',
//               type:'line',
//               stack: '总量',
//               areaStyle: {normal: {}},
//               data:[]
//             })
//           }
//
//           var len = sysData.length - 1;
// //          for(var i= 0;i<sysData.length;i++){
//           for(var i= len;i>=0;i--){
//             var info = sysData[i].info;
//             liveXData.push(sysData[i].time);
//             for(var j = 0;j<info.length;j++){
//               if(i == 0){
//                 legendData.push({
//                   name:info[j].systemName,
//                   icon:'rect'
//                 });
//               }
//               seriesData[j].name = info[j].systemName;
//               seriesData[j].data.push(info[j].avgTime?info[j].avgTime:0);
//             }
//           }
//       }
    let newArr = [];
    for (let item of totalDate) {
      newArr.push(item.substring(item.indexOf(' ') + 1));
    }
    liveSetResponseTimeMap(self, luggageData, seriesData, newArr)

  }


  /*
  *
  * 24小时接口响应时间(活的)
  * legendData：图例
  * seriesData：series里面的数据（数组对象）
  * XData：X轴的值
  * */
  function liveSetResponseTimeMap(self, legendData, seriesData, XData) {
    var option = {
      title: {show: false},
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: true,
        data: legendData,
        right: '4%',
        top: '0'
      },
      grid: {
        left: '0',
        right: '10px',
        bottom: '0',
//        top: '10px',
        top: '15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: XData,
          name: ''
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}ms',
            color: '#000',
          },
        }
      ],
      series: seriesData
    };
    self.responseTimeMap.setOption(option, true);
  }


  /*
  * 24小时接口响应时间(死的，只能有三个)
  * self：vue对象
  * flightData:航班数据（数组）
  * passengerData：乘客数据（数组）
  * luggageData：行李数据（数组）
  * XData:X轴的时间
  * */
  function setResponseTimeMap(self, flightData, passengerData, luggageData, XData) {
    var option = {
      title: {show: false},
      tooltip: {
        trigger: 'axis'
      },
      legend: {show: false},
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '10px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: XData
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '航班',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: flightData,
          areaStyle: {
            color: '#c23531'
          }
        },
        {
          name: '乘客',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: passengerData,
          areaStyle: {
            color: '#384b5a'
          }
        },
        {
          name: '行李',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: luggageData,
          areaStyle: {
            color: '#61a0a8'
          }
        }

      ]
    };
    self.responseTimeMap.setOption(option, true);

  }


  /*
  *处理当前较慢接口TOP5的数据
  * */
  function handleLowInterfaceMapData(data, self) {
    var data = data.interfaceCallSlowTop5;
    var yData = [];
    var interfaceData = [];
    if (!Utils.isEmptyObject(data)) {
      var len = data.length - 1;
      for (var i = len; i >= 0; i--) {
        yData.push(data[i].name);
        interfaceData.push(data[i].time);
      }
    }
    setSlowInterfaceMap(self, yData, interfaceData);
  }


  /*
  *当前较慢接口TOP5
  * self：vue对象
  * yData：Y轴的值（对应接口的名字）
  * interfaceData：接口数据（对应接口的值）
  */
  function setSlowInterfaceMap(self, yData, interfaceData) {
    var option = {
      title: {
        show: false
      },
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '1%',
        right: '10px',
        bottom: '1%',
        top: '10px',
        containLabel: true
      },
      xAxis: [{
        type: 'value',
        name: '次数',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisLabel: {
          color: '#000',
        }
      }],
      yAxis: [{
        type: 'category',
        data: yData,
        axisLabel: {
          color: '#000',
          formatter: function (value, index) {
            if (value.length > 5) {
              return value.substring(0, 5) + '...';
            } else {
              return value;
            }
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
      }],
      series: [{
        name: '接口次数',
        type: 'bar',
        data: interfaceData,
        itemStyle: {
          color: '#f68440'
        }
      }]
    };
    self.slowInterfaceMap.setOption(option, true);
  }


  /*
  * 处理业务系统调取次数的数据
  * */
  function handleBusinessSysMapData(data, self) {
    var yesterdaySystemCall = data.yesterday;
    var todaySystemCall = data.today;
    var xData = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    var afterData = [];
    var dayData = [];

    const forFunction = (x, data, ss) => {
      for (let i of x) {
        let flag = 0;
        for (let j of data) {
          if (i === j.date) {
            flag = 1;
            if (ss === 0) {
              afterData.push(j.count)
            } else {
              dayData.push(j.count)
            }
            continue;
          }
        }
        if (flag === 0) {
          if (ss === 0) {
            afterData.push(0)
          } else {
            dayData.push(0)
          }
        }
      }
    };
    forFunction(xData, yesterdaySystemCall, 0);
    forFunction(xData, todaySystemCall, 1);
//    if (!Utils.isEmptyObject(yesterdaySystemCall)) {
//      for (var i = 0; i < yesterdaySystemCall.length; i++) {
//        xData.push(yesterdaySystemCall[i].date);
//        afterData.push(yesterdaySystemCall[i].count);
//      }
//    }
//    if (!Utils.isEmptyObject(todaySystemCall)) {
//      for (var i = 0; i < todaySystemCall.length; i++) {
//        if (xData.length <= 0) {
//          xData.push(todaySystemCall[i].date);
//        }
//        dayData.push(todaySystemCall[i].count);
//      }
//    }

    setBusinessSysMap(self, xData, afterData, dayData);

  }


  /*
  * 业务系统调取次数
  * self：vue对象
  * xData：X轴的值
  * afterData：昨天的值
  * dayData：今天的值
  * */
  function setBusinessSysMap(self, xData, afterData, dayData) {
    var option = {
      title: {
        show: false
      },
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '1%',
        right: '10px',
        bottom: '1%',
        top: '10px',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisLabel: {
          color: '#000',
        }
      }],
      yAxis: [{
        type: 'value',
        name: '次数',
        axisLabel: {
          formatter: '{value}次',
          color: '#000',
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          }
        },
      }],
      series: [{
        name: '昨天',
        type: 'bar',
        data: afterData,
        itemStyle: {
          color: '#7dd3ae'
        }
      }, {
        name: '今天',
        type: 'bar',
        data: dayData,
        itemStyle: {
          color: '#62a8ea'
        }
      }]
    };
    self.businessSysMap.setOption(option, true);
  }

</script>

<style scoped>

  section > div > div {
    display: inline-block;
    vertical-align: top;
  }

  section > div > div > div {
    width: 95%;
    margin: 0 auto;
  }

  .block-area {
    background-color: #fafafb;
    border-radius: 10px;
    border: solid 1px #e7eaec;
  }

  .block-area div.title {
    margin-top: 17px;
  }

  .block-area div.title span {
    font-size: 14px;
    color: #526069;
    font-weight: bold;
  }

  /*业务系统概况*/
  .sys-general {
    width: 30%;
    height: 204px;
  }

  .sys-general ul {
    padding: 0;
    margin: 28px 0;
  }

  .sys-general ul li {
    display: inline-block;
    vertical-align: top;
    width: 32%;
    text-align: center;;

  }

  .sys-general ul li > p {
    margin: 0;
    padding: 0;
    position: relative;
  }

  .sys-general ul li > p:first-child {
    font-size: 73px;
    display: inline-block;
  }

  .sys-general ul li > p:first-child sup {
    font-size: 14px;
    position: absolute;
    right: -11px;
    top: 11px;
  }

  .sys-general ul li > p:last-child {
    margin-top: -12px;
  }

  /*接口调用情况*/
  .interface-situation {
    width: 68.4%;
    height: 204px;
    margin-left: 0.8%;
    background-image: url("../../assets/ddm-bg.png");
  }

  .interface-situation ul {
    list-style: none;
    float: right;
  }

  .interface-situation ul p {
    display: inline-block;
  }

  .interface-situation ul li p:first-child {
    font-size: 16px;
    color: #526069;
  }

  .interface-situation ul li p:last-child {
    font-size: 55px;
    letter-spacing: 2px;
    color: #62a8ea;
  }

  .interface-situation ul li p:last-child span {
    font-size: 14px;
    letter-spacing: 0px;
    color: #3f494f;
  }

  /*第二行*/
  .two-row {
    margin: 20px 0;
  }

  .two-row > div {
    height: 318px;
  }

  /*系统调用接口次数占比*/
  .sys-interface-count {
    width: 30%;
  }

  .sys-interface-count #sysInterfaceCount {
    /*width: 273px;*/
    height: 257px;
    width: 50%;
    margin: 10px auto;
  }

  /*24小时接口响应时间*/
  .response-time {
    width: 68.4%;
    margin: 0 0 0 0.8%;
  }

  .response-time #responseTimeMap {
    width: 95%;
    /*height: 235px;*/
    height: 280px;
    margin: 0 auto;
  }

  .response-time #bigResponseTime {
    height: 290px;
    width: 100%;
    position: absolute;
    /*background-color: violet;*/
    /*opacity:0.2;*/
    top: 16px;
    left: 0;
  }

  /*失败接口*/
  /*.defeated-interface {*/
  /*width: 20%;*/
  /*}*/

  /*.defeated-interface table {*/
  /*width: 100%;*/
  /*font-size: 13px;*/
  /*}*/

  /*.defeated-interface table th {*/
  /*font-weight: normal;*/
  /*color: #526069;*/
  /*}*/

  /*.defeated-interface table td {*/
  /*color: #76838f;*/
  /*padding: 0 5px;*/
  /*}*/

  /*.defeated-interface table td span {*/
  /*display: inline-block;*/
  /*background-color: #f2a654;*/
  /*border-radius: 3px;*/
  /*color: #ffffff;*/
  /*padding: 3px 5px;*/
  /*}*/

  /*.defeated-interface table th,*/
  /*.defeated-interface table td {*/
  /*height: 37px;*/
  /*border-bottom: 1px solid #e4eaec;*/
  /*text-align: center;*/
  /*}*/

  /*.defeated-interface div.main-table {*/
  /*height: 228px;*/
  /*}*/

  /*第三行*/
  .three-row > div {
    height: 323px;
  }

  /*业务系统调取次数*/
  .business-sys-count {
    width: 60%;
  }

  .business-sys-count #businessSysMap {
    width: 100%;
    height: 230px;
    margin: 30px 0;
  }

  .slow-interface {
    /*width: 38.3%;*/
    margin: 0 0.8%;
  }

  .slow-interface,
  .current-at-most-interface {
    width: 18.6%;
  }

  .slow-interface #slowInterfaceMap {
    width: 100%;
    height: 230px;
    margin: 30px 0;
  }

  table {
    width: 100%;
    font-size: 13px;
    margin: 23px 0;
  }

  table th {
    font-weight: normal;
    color: #526069;
    font-size: 13px;
  }

  table td {
    color: #76838f;
    padding: 0 5px;
  }

  table td span {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #f2a654;
    border-radius: 9px;
    color: #ffffff;
    line-height: 19px;
    font-size: 12px;
  }

  table th,
  table td {
    height: 37px;
    border-bottom: 1px solid #e4eaec;
    text-align: center;

  }

  /*图列*/
  ul.legend-ul {
    margin-top: 0;
    list-style: none;
  }

  ul.legend-ul li {
    display: inline-block;
    vertical-align: top;
    margin: 0 5px;
  }

  ul.legend-ul li > i,
  ul.legend-ul li > span {
    display: inline-block;
    vertical-align: middle;
  }

  ul.legend-ul li > i {
    width: 10px;
    height: 10px;
    margin-right: 2px;
  }

  ul.legend-ul li > span {
    color: #526069;
    font-size: 12px;
  }

</style>
<link rel="stylesheet" href="../../css/com.css">
