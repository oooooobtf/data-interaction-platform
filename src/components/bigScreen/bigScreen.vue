<template>
  <div class="big-container">
    <div class="main-container">
      <div class="header">
        <div class="header-bg">
          <div class="header-title">
          </div>
        </div>
        <div class="header-time">
          <span>{{time}}</span>
        </div>
        <div class="header-number">
          <!--<div class="number-block">-->
            <!--<span class="number">8</span>-->
            <!--<span class="number">8</span>-->
            <!--<span class="number">5</span>-->
          <!--</div>-->
          <!--<span class="number-dou">,</span>-->
          <!--<div class="number-block">-->
            <!--<span class="number">4</span>-->
            <!--<span class="number">1</span>-->
            <!--<span class="number">5</span>-->
          <!--</div>-->
          <div class="number-block" >
          <span :class="count==','?'number-dou':'number'" v-for="count in countArray">{{count}}</span>
          </div>
          <!--<div class="number-block" v-for="(array,index) in countArray" :id="'block'+index" :value="array">-->
          <!--<span class="number" v-for="(arr,index) in array.toString().length">{{array.toString().substring(arr,index)}}</span>-->
          <!--</div>-->
        </div>
        <div class="header-number-text">
          <span class="text-gray">接口调用总量（次）</span>
        </div>
      </div>
      <div class="container">
        <div class="container-left">
          <div class="interface-trend">
            <div class="interface-trend-title">
              <span class="title-line"></span>
              <span class="text-gray title-22 vertical-middle">接口调用趋势</span>
            </div>
            <div class="interface-trend-msg">
              <div class="trend-number">
                <!--<span class="interface-trend-count text-white"></span>-->
              </div>
              <div style="position: absolute;right: 35px;top: 16px;">
                <span class="text-gray">同比</span>
                <span class="text-red">+</span>
                <span class="text-red percent animateNum" data-animatetype="num"  style="margin-left: -3px;" :data-animatetarget=percent>{{percent}}</span>
                <span class="text-red">%</span>
              </div>
            </div>
            <div id="interfaceTrend"></div>
          </div>
          <div class="interface-slow">
            <div class="interface-slow-title">
              <span class="title-line"></span>
              <span class="text-gray title-22 vertical-middle">当前较慢接口TOP10</span>
            </div>
            <div id="interfaceSlow"></div>
          </div>
        </div>
        <div class="container-main">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <!--<div class="swiper-slide" v-for="(a,slideIndex) in Math.ceil(items.length/4)">-->
              <!--<div class="system" v-for="(item,index) in items.slice((slideIndex+1)*4-4,(slideIndex+1)*4)">-->
              <div class="swiper-slide" v-for="(a,slideIndex) in itemsArray.length">
                <div class="system" v-for="(item,index) in itemsArray[slideIndex]">
                  <div class="system-title">
                    <span class="system-title-text text-white">{{item.name}}</span>
                    <div class="system-status" v-if="item.status=='VAILD'">
                      <span class="status-icon"></span>
                      <span class="status text-white ">启用中</span>
                    </div>
                    <div class="system-status" v-else>
                      <span class="status-icon-not"></span>
                      <span class="status text-white ">已禁用</span>
                    </div>
                    <span class="text-error" v-if="item.count>0">当前有{{item.count}}个接口异常</span>
                    <span class="text-normal" v-else>当前无接口异常</span>
                  </div>
                  <div class="system-msg">
                    <div class="system-msg-left">
                      <div class="msg-count">
                  <span class="msg-number"
                        v-for="(a,index) in item.totalInterfaceNum.toString().length">{{item.totalInterfaceNum.toString().substring(a, index)}}</span>
                      </div>
                      <span style="padding-left: 14px;">接口总计（个）</span><br>
                      <span class="use-interface">在用接口：<span class="use-interface-number">{{item.usingInterfaceNum}}</span></span>
                    </div>
                    <div class="system-msg-right" :id="index">
                      <div class="system-msg-box">
                        <div :class="index%2==0?'system-msg-interface':'system-msg-interface even-bg'"
                             v-for="(interfaces,index) in item.interfaceNames">
                          <span class="interface-icon"></span>
                          <span class="text-gray">{{interfaces}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>
        <div class="container-right">
          <div class="interface-percent">
            <div class="interface-percent-title">
              <span class="title-line"></span>
              <span class="text-gray title-22 vertical-middle">系统调用接口次数占比</span>
            </div>
            <div id="interfacePercent"></div>
            <div class="echart-icon"></div>
            <div class="echart-legend">
              <div class="legend-box">
                <div class="legend" v-for="iten in percentItems">
                  <span class="legend-icon"></span>
                  <span class="legend-text text-gray">{{iten.name}}</span>
                  <span class="legend-number animateNum" data-animatetype="num" :data-animatetarget=iten.value>{{iten.value}}</span>
                  <span style="color: #fff;font-size: 22px;font-family: HighlandGothicFLF">%</span>
                </div>
              </div>
            </div>

          </div>
          <div class="interface-more">
            <div class="interface-more-title">
              <span class="title-line"></span>
              <span class="text-gray title-22 vertical-middle">当前调用最多接口TOP10</span>
            </div>
            <div id="interfaceMore"></div>


          </div>

        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
  import echarts from 'echarts';
  import swiper from 'swiper'

  var mySwiper;
  var activeIndex = 0;
  var el;
  export default {
    components: {
      ElMain,
      ElHeader,
      ElContainer
    },
    data() {
      return {
//        animate: false,
        interfaceTrend: "",
        interfaceSlow: "",
        interfacePercent: "",
        interfaceMore: "",
        allCount: 1824200,
        percent: 14.5,
        trendCount: 322424,
        countArray: [],
        trendCountArry: [],
        time: "",
        hslArray: [],
        percentItems: [
          {name: "航线", value: 22.45}, {name: "航线2", value: 30.1}, {name: "航线3", value: 17.58}, {name: "航线4", value: 52.41}
//          {name: "航线5", value: 44.69}, {name: "航线6", value: 10.1}, {name: "航线7", value: 10}, {name: "航线8", value:10.8},
//          {name: "航线9", value:8.25}, {name: "航线10", value:9}, {name: "航线11", value:99.9}, {name: "航线12", value:4.29}
        ],
        items: [{
          name: "贵宾系统",
          status: "VAILD",
          count: 5,
          totalInterfaceNum: 85,
          usingInterfaceNum: 55,
          interfaceNames: ["贵宾信息状况1", "贵宾信息状况2", "贵宾信息状况3", "贵宾信息状况4", "贵宾信息状况5", "贵宾信息状况6", "贵宾信息状况7", "贵宾信息状况8", "贵宾信息状况9", "贵宾信息状况10", "贵宾信息状况11"]
        }, {
          name: "航班系统",
          status: "NOT",
          count: 7,
          totalInterfaceNum: 109,
          usingInterfaceNum: 98,
          interfaceNames: ["航班信息状况1", "航班信息状况2", "航班信息状况3", "航班信息状况4", "航班信息状况5", "航班信息状况6", "航班信息状况7", "航班信息状况8"]
        }, {
          name: "三观系统",
          status: "VAILD",
          count: 12,
          totalInterfaceNum: 66,
          usingInterfaceNum: 31,
          interfaceNames: ["三观信息状况1", "三观信息状况2", "三观信息状况3", "三观信息状况4", "三观班息状况5", "三观信息状况6", "三观信息状况7"]
        }, {
          name: "数据系统",
          status: "VAILD",
          count: 0,
          totalInterfaceNum: 45,
          usingInterfaceNum: 29,
          interfaceNames: ["数据信息状况1", "数据信息状况2", "数据信息状况3", "数据信息状况4", "数据信息状况5", "数据信息状况6", "数据信息状况7"]
        },
          {
            name: "酒吧系统",
            status: "VAILD",
            count: 15,
            totalInterfaceNum: 74,
            usingInterfaceNum: 42,
            interfaceNames: ["酒吧信息状况1", "酒吧信息状况2", "酒吧信息状况3", "酒吧信息状况4", "酒吧信息状况5", "酒吧信息状况6", "酒吧信息状况7", "酒吧信息状况8", "酒吧信息状况9"]
          },
          {
            name: "机场系统",
            status: "VAILD",
            count: 0,
            totalInterfaceNum: 20,
            usingInterfaceNum: 14,
            interfaceNames: ["机场信息状况1", "机场信息状况2", "机场信息状况3", "机场信息状况4", "机场信息状况5", "机场信息状况6", "机场信息状况7"]
          },
        ],
        itemsArray: [],
        slowInterface: [
          "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口", "最慢接口"
        ],
        quickInterface: [
          "最快接口", "最快接口", "最快接口", "最快接口", "最快接口", "最快接口", "最快接口", "最快接口", "最快接口", "最快接口"
        ]

      }
    },
    created() {
      el = this;
      let self = this;
      setInterval(function () {self.getTime()}, 1000);
      self.hslArray = getHslArray()

    },
    update() {

    },
    mounted() {
      let self = this;
      getAllData(self)

    },
    computed: {
//      创建随机颜色
      rgbArray: function () {
        var self = this;
        if (!self.hslArray.length) return [];

        var rgbArray = self.hslArray.map(function (item) {
          return hslToRgb.apply(this, item);
        });

        return rgbArray.map(function (item) {
          return 'rgb(' + item.toString() + ')'
        });
      }

    },
    watch: {},
    methods: {

//      处理数据为4个一组
      arrayFour: function (array, size) {
        var result = [];
        for (var x = 0; x < Math.ceil(array.length / size); x++) {
          var start = x * size;
          var end = start + size;
          result.push(array.slice(start, end));
        }
        return result;

      },

//      图例轮播
      legendScroll: function () {
        this.animate = true
        setTimeout(() => {
          this.percentItems.push(this.percentItems[0]);
          this.percentItems.shift();
          this.animate = false;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        }, 1500)

      },

      compareStr: function (data) {
        if (data == ",") {
          return "number-dou"
        } else {
          return "number"
        }
      },

//      取三位
      toGetThree: function () {
        let self = this;
        self.countArray = parseInt(self.allCount).toLocaleString().split("")
        self.trendCountArry = parseInt(self.trendCount).toLocaleString().split(",")
        self.trendCountHtml()
      },

//      接口调用趋势内容生成
      trendCountHtml: function () {
        var html = [];
        let self = this;
        for (var i = 0; i < self.trendCountArry.length; i++) {
          html.push('<span class="interface-trend-count" style="font-size: 32px;color: #fff;font-family: HighlandGothicFLF">' + self.trendCountArry[i] + '</span>')
          if (i + 1 !== self.trendCountArry.length) {
            html.push('<span  style="font-size: 32px;color: #fff;font-family: HighlandGothicFLF">,</span>')
          }
        }
        $('.trend-number').html(html.join(""))
        self.trendCountUp()
      },

//      接口调用趋势数值增长
      trendCountUp: function () {
        var counter = $('.trend-number')
        var counterArr = counter.find('span.interface-trend-count')
        for (var i = 0; i < counterArr.length; i++) {
          countUp(counterArr[i].innerText, counterArr[i])
        }
      },

//      接口总计
      systemCountUp:function(){
        var counter = $('.msg-count')
        var counterArr = counter.find('span.msg-number')
        for (var i = 0; i < counterArr.length; i++) {
          countUp(counterArr[i].innerText, counterArr[i])
        }

      },

//      在用接口
      useCountUp:function(){
        var counter = $('.use-interface')
        var counterArr = counter.find('span.use-interface-number')
        for (var i = 0; i < counterArr.length; i++) {
          countUp(counterArr[i].innerText, counterArr[i])
        }
      },

//      趋势
      percentUp:function(){
        let self=this;
        if(self.percent.toString().indexOf(".")>0){
          $('.percent').running();
        }else{
          countUp(self.percent, $('.percent'))
        }
      },

//      接口占用
      tookPercentUp:function(){
        for(var i=0;i<$('.legend-number').length;i++){
         if($('.legend-number')[i].innerText.indexOf(".")>0){
           $($('.legend-number')[i]).running();
         }else{
           countUp(parseInt($('.legend-number')[i].innerText), $('.legend-number')[i])
         }
        }
      },

//      接口调用总量
      countUp: function () {
        var counter = $('.header-number')
        var counterArr = counter.find('.number-block>.number')
        var num = "";
        for (var j = 0; j < counterArr.length; j++) {
          countUp(counterArr[j].innerText, counterArr[j])
        }
      },

//      获得当前时间
      getTime: function () {
        let self = this;
        var tt = new Date();
        var fullYear = tt.getFullYear();
        var month = compareTime(tt.getMonth() + 1);
        var day = compareTime(tt.getDay());
        var date = compareTime(tt.getDate());
        var hours = compareTime(tt.getHours());
        var minutes = compareTime(tt.getMinutes());
        var seconds = compareTime(tt.getSeconds());
        self.time = fullYear + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
      },

//      图例背景颜色
      getColorArray: function () {
        let self = this;
        $('.legend-icon').each(function (i) {
          $(this).css('background-color', self.rgbArray[i])
        })
      }
    }
  }

  function getAllData(self){
//    创建图形
    self.interfaceTrend = echarts.init(document.getElementById('interfaceTrend'));
    self.interfaceSlow = echarts.init(document.getElementById('interfaceSlow'));
    self.interfacePercent = echarts.init(document.getElementById('interfacePercent'),'macarons');
    self.interfaceMore = echarts.init(document.getElementById('interfaceMore'));

    setInterfaceTrend(self)
    setInterfaceSlow(self, self.slowInterface)
    setInterfacePercent(self,self.percentItems)
    setInterfaceMore(self, self.quickInterface)

    self.itemsArray = self.arrayFour(self.items, 4);
    self.toGetThree()

    self.$nextTick(function () {

//      数字Up&&初始化滚动
      self.countUp()
      self.useCountUp();
      self.systemCountUp()
      self.percentUp()
      self.tookPercentUp()
      createLegendMarquee()

//      初始化swiper
      mySwiper = new swiper('.swiper-container', {
        loop: false,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        on: {
          slideChangeTransitionEnd: function () {
            destroyMarquee()
            activeIndex = this.activeIndex
            createSystemMarquee()
          },
        }
      })
      createSystemMarquee()
      self.getColorArray()

    })
  }

  /**
   * HSL颜色值转换为RGB
   * H，S，L 设定在 [0, 1] 之间
   * R，G，B 返回在 [0, 255] 之间
   *
   * @param H 色相
   * @param S 饱和度
   * @param L 亮度
   * @returns Array RGB色值
   */

  function hslToRgb(H, S, L) {
    var R, G, B;
    if (+S === 0) {
      R = G = B = L; // 饱和度为0 为灰色
    } else {
      var hue2Rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
      var P = 2 * L - Q;
      R = hue2Rgb(P, Q, H + 1 / 3);
      G = hue2Rgb(P, Q, H);
      B = hue2Rgb(P, Q, H - 1 / 3);
    }
    return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
  }

  //  获得随机HSL
  function randomHsl() {
    var H = Math.random();
    var S = Math.random();
    var L = Math.random();
    return [H, S, L];
  }

  //  获得随机HSL数组
  function getHslArray() {
    var HSL = [];
    var hslLength = el.percentItems.length; // 获取数量
    for (var i = 0; i < hslLength; i++) {
      var ret = randomHsl();
      // 颜色相邻颜色差异须大于 0.25
      if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.3) {
        i--;
        continue; // 重新获取随机色
      }
      ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
      ret[2] = 0.4 + (ret[2] * 0.6); // [0.4 - 0.8] 排除过亮过暗色

      // 数据转化到小数点后两位
      ret = ret.map(function (item) {
        return parseFloat(item.toFixed(2));
      });

      HSL.push(ret);
    }
    return HSL;

  }

  //  取0处理
  function compareTime(val) {
    if (val < 10) {
      return "0" + val;

    } else {
      return val;
    }
  }

  //  接口调用趋势
  function setInterfaceTrend(self) {
    var option = {
      title: {
        show: false
      },
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
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
        data: ['0', '2', '4', '6', '8', '10', '12'],
        axisLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      }],
      yAxis: [{
        type: 'value',
        name: '次数',
        axisLabel: {
          formatter: '{value}次',
          color: '#000',
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },

        splitLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },
      }],
      series: [{
        name: '次数',
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#06687a' // 0% 处的颜色
            }, {
              offset: 1, color: '#091730' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }
        },
        data: ['50', '90', '150', '160', '200', '248', '245'],
        itemStyle: {
          color: '#00c0ff'
        }
      }]
    };
    self.interfaceTrend.setOption(option, true);
  }

  //  较慢接口TOP10
  function setInterfaceSlow(self, data) {
    var option = {
      title: {
        show: false
      },
      legend: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: "1%",
        containLabel: true,

      },
      axisTick: {
        show: false
      },
      xAxis: {
        show: false,
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },

      },
      yAxis: {
        type: 'category',
        data: data,
        axisTick: {
          show: false
        },
        axisLabel: {

          textStyle: {
            color: "rgb(255,255,255,0.8)",
            fontSize: 14
          }
        },

        axisLine: {
          show: false,
          lineStyle: {}
        }

      },
      series: [
        {
          name: '数据',
          type: 'bar',
          barWidth: 15,
          data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              r: 0.5,
              colorStops: [{
                offset: 0, color: '#07384e' // 0% 处的颜色
              }, {
                offset: 1, color: '#00c0dd' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        }
      ]
    }
    self.interfaceSlow.setOption(option, true);

  }

  //  系统调用次数占比
  function setInterfacePercent(self, data) {
    var option = {
      backgroundColor: 'transparent',
      tooltip: {
        show:true,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        show: false,
      },
      grid: {
        left: "20px",
        top: "20px"
      },
      color: el.rgbArray,
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['65%', '80%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            borderWidth: 5, //设置border的宽度有多大
            borderColor: '#0a162c',
          },
          data: data
        }
      ]
    };
//    自动高亮

//    var index = 0; //播放所在下标
//    var mTime = setInterval(function() {
//      self.interfacePercent.dispatchAction({
//        type: 'highlight',
//        seriesIndex: 0,
//        dataIndex: index
//      });
//        index++;
//      if(index > data.length) {
//        index = 0;
//      }
//    }, 1000);

    self.interfacePercent.setOption(option, true);

  }

  //  较快接口TOP10
  function setInterfaceMore(self, data) {
    var option = {
      title: {
        show: false
      },
      legend: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: "1%",
        containLabel: true,

      },
      axisTick: {
        show: false
      },
      xAxis: {
        show: false,
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#efefef',
          }
        },

      },
      yAxis: {
        type: 'category',
        data: data,
        axisTick: {
          show: false
        },
        axisLabel: {

          textStyle: {
            color: "rgb(255,255,255,0.8)",
            fontSize: 14
          }
        },

        axisLine: {
          show: false,
          lineStyle: {}
        }

      },
      series: [
        {
          name: '数据',
          type: 'bar',
          barWidth: 15,
          data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              r: 0.5,
              colorStops: [{
                offset: 0, color: '#07384e' // 0% 处的颜色
              }, {
                offset: 1, color: '#00c0dd' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        }
      ]
    }
    self.interfaceMore.setOption(option, true);

  }

  //  数字增长
  function countUp(count, object) {
    var div_by = 10,
      speed = Math.round(count / div_by),
      $display = $(object),
      run_count = 1,
      int_speed = 20;

    var int = setInterval(function () {
      if (run_count < div_by) {
        $display.text(speed * run_count);
        run_count++;
      } else if (parseInt($display.text()) < count) {
        var curr_count = parseInt($display.text()) + 1;
        $display.text(curr_count);
      } else {
        clearInterval(int);
      }
    }, int_speed);
  }

  //  //  数字增长
  //  function countUp(count, object) {
  //    var div_by = 20,
  //      speed = Math.round(count / div_by),
  //      $display = $(object),
  //      run_count = 1,
  //      int_speed = 50;
  //
  //    var int = setInterval(function () {
  //      if (run_count < div_by) {
  //        $display.text(speed * run_count);
  //        run_count++;
  //      } else if (parseInt($display.text()) < count) {
  //        var curr_count = parseInt($display.text()) + 1;
  //        $display.text(curr_count);
  //      } else {
  //        clearInterval(int);
  //      }
  //    }, int_speed);
  //  }
  //  创建系统接口滚动
  function createSystemMarquee() {
    var flag = 0;
//    var $systeam = $('.system-msg-right');
    var $systeam = $('.swiper-slide');
//    console.log($($systeam[0]).find('.system-msg-right').eq(0))
    for (var i = 0; i < $($systeam[activeIndex]).find('.system-msg-right').length; i++) {
      $($systeam[activeIndex]).find('.system-msg-right').eq(i).liMarquee({
        direction: 'up',
        loop: '1',
        scrollamount: 40,
        circular: false,
        scrolldelay: 500,
        hoverstop: false,
        rollEndBack: function (callback) {
          if (callback) {
            flag += 1
            if (flag == $($systeam[activeIndex]).find('.system-msg-right').length) {
              if (activeIndex == $($systeam[activeIndex]).find('.system-msg-right').length - 1) {
                mySwiper.slideTo(0, 1000, {})
              } else {
                mySwiper.slideTo(activeIndex + 1, 1000, {})
              }
            }
          }
        }
      })
    }
  }

  //  图例无缝滚动
  function createLegendMarquee() {
    var $legend = $('.echart-legend');
    $legend.liMarquee({
      direction: 'up',
      loop: '-1',
      scrollamount: 40,
      circular: false,
      hoverstop: false,
    })
  }

  //  销毁滚动
  function destroyMarquee() {
    console.log('ddddd')
    console.log(activeIndex)
    var $systeam = $('.swiper-slide');
//    console.log($($systeam[0]).find('.system-msg-right').eq(0))
    if(activeIndex==0){
      for (var i = 0; i < $($systeam[activeIndex + 1]).find('.system-msg-right').length; i++) {
          $($systeam[$systeam.length - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        if (activeIndex == 0) {
//          $($systeam[$systeam.length - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        } else {
//          $($systeam[activeIndex - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        }
      }
    }else{
      for (var i = 0; i < $($systeam[activeIndex - 1]).find('.system-msg-right').length; i++) {
        $($systeam[activeIndex - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        if (activeIndex == 0) {
//          $($systeam[$systeam.length - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        } else {
//          $($systeam[activeIndex - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//        }
      }
    }
//    for (var i = 0; i < $($systeam[activeIndex - 1]).find('.system-msg-right').length; i++) {
//      if (activeIndex == 0) {
//        $($systeam[$systeam.length - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//      } else {
//        $($systeam[activeIndex - 1]).find('.system-msg-right').eq(i).liMarquee('destroy')
//      }
//
//
//    }

  }


</script>
<style scoped>
  .vertical-middle {
    vertical-align: super;
  }

  .text-error {
    color: #ff7e00;
    font-size: 16px;
    display: block;
    clear: both;
  }

  .text-normal {
    color: #8cff00;
    font-size: 16px;
    display: block;
    clear: both;
  }

  .text-white {
    color: #fff;
  }

  .text-red {
    color: #e20000;
  }

  .text-gray {
    color: rgba(255, 255, 255, 0.5);
  }

  .title-22 {
    font-size: 22px;
    line-height: 22px;

  }

  /*标题*/
  .big-container {
    /*transform: scale(1, 0.512963);*/
    /*transform-origin: left top 0px;*/
    width: 100%;
    height: 1080px;
  }

  .main-container {

    background: url("../../assets/bigScreen/bg.jpg") 50% no-repeat;
    background-size: 100% 100%;
    image-rendering: -webkit-optimize-contrast;
    width: 100%;
    height: 1080px;
  }
  .header{
    position: relative;
  }
  .header-bg {
    background: url("../../assets/bigScreen/title-bg.png") 50% no-repeat;
    background-size: 100%;
    image-rendering: -webkit-optimize-contrast;
    width: 1920px;
    height: 170px;
  }

  .header-title {
    background: url("../../assets/bigScreen/title.png") 10% no-repeat;
    background-size: 100%;
    /*image-rendering: -webkit-optimize-contrast;*/
    width: 666px;
    height: 64px;
    margin: 0 auto;
    padding-top: 22px;
  }

  .header-time {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
    font-family: "Microsoft Yahei";
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 45%;
    top: 46%;
  }

  .header-number {
    display: flex;
    align-items: baseline;
    color: rgb(255, 255, 255);
    text-align: center;
    white-space: nowrap;
    justify-content: center;
    font-family: 'HighlandGothicFLF';
    line-height: 138.32px;
    width: 920px;
    height: 90px;
    background-color: rgba(0, 0, 0, 0);
    margin: 0 auto;
    margin-top: 22px;
    vertical-align: middle;
  }

  .header-number > .number-block > .number {
    background-color: rgba(67, 165, 255, 0.1);
    display: inline-block;
    letter-spacing: 0.02em;
    text-indent: 0.02em;
    height: auto;
    line-height: normal;
    font-size: 52px;
    font-weight: normal;
    letter-spacing: 0.02em;
    margin-right:10px;
    border-radius: 0px;
    width: 70px;
  }

  .number-block {
    display: inherit;
  }

  .number-dou {
    display: inline-block;
    letter-spacing: 0.02em;
    text-indent: 0.02em;
    height: auto;
    line-height: normal;
    font-size: 52px;
    font-weight: normal;
    letter-spacing: 0.02em;
    margin-right: 0.1em;
    border-radius: 0px;

  }

  .header-number-text {
    text-align: center;
  }

  /*接口调用趋势*/
  .title-line {
    background-color: #e20000;
    width: 6px;
    height: 30px
  }

  .container-left {
    width: 22%;
    float: left;
  }

  .interface-trend-title > span, .interface-slow-title > span, .interface-percent-title > span, .interface-more-title > span {
    display: inline-block;
  }

  .interface-trend-title, .interface-slow-title {
    margin-left: 52px;
  }

  #interfaceTrend {
    height: 131px;
    margin-left: 52px;
    margin-top: 45px;
  }

  .interface-trend-msg {
    margin-left: 63px;
    margin-top: 20px;
    position: relative;
  }

  .trend-number {
    display: inline-block;
  }

  .interface-trend-count {
    font-family: HighlandGothicFLF;
    font-size: 32px;
    /*padding-right: 70px;*/
  }

  /*接口最慢*/
  .interface-slow {
    margin-top: 50px;
  }

  #interfaceSlow {
    height: 400px;
    margin-left: 52px;
    margin-top: 18px;
  }

  /*系统*/
  .container-main {
    width: 52%;
    margin: 0 37px;
    float: left;
    overflow: hidden;
  }

  .system {
    position: relative;
    margin-right: 20px;
    width: 472px;
    height: 314px;
    background: url("../../assets/bigScreen/system-bg.png") 50% no-repeat;
    background-size: 100%;
    display: inline-block;
    /*width: 472px;*/
    /*height: 314px;*/
    /*border-style: solid;*/
    /*border-width: 200px 27px 127px 354px;*/
    /*border-image-source: url(https://img.alicdn.com/tfs/TB16jdqQXXXXXcVaXXXXXXXXXXX-731-407.png);*/
    /*border-image-slice: 152 27 127 354 fill;*/
    /*border-image-width: initial;*/
    /*border-image-outset: initial;*/
    /*border-image-repeat: repeat;*/
    /*background: none;*/

  }

  .system-title {
    padding: 50px 0 0px 26px;
  }

  .system-title-text {
    font-size: 22px;
    float: left;
  }

  .status-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
    background-color: #00ff91;
    vertical-align: middle;
  }

  .status-icon-not {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
    background-color: #ff3424;
    vertical-align: middle;
  }

  .system-status {
    float: right;
    padding-top: 5px;
    vertical-align: middle;
  }

  .status {
    vertical-align: middle;
  }

  .system-msg-left {
    text-align: center;
    color: #fff;
    width: 200px;
    float: left;
  }

  .use-interface {
    color: #00e7ff;
    display: block;
    margin-top: 5px;
  }

  .msg-number {
    background-color: rgba(77, 122, 169, 0.5);
    display: inline-block;
    letter-spacing: 0.02em;
    text-indent: 0.02em;
    height: auto;
    line-height: normal;
    font-size: 52px;
    font-weight: normal;
    letter-spacing: 0.02em;
    margin-right: 0.1em;
    border-radius: 0px;
    width: 55px;
    font-family: HighlandGothicFLF;
    color: #fff;
    text-align: center;
  }

  .msg-count {
    padding-bottom: 20px;
    padding-top: 24px;
  }

  .system-msg {
    width: 490px;
  }

  .system-msg-right {
    /*width: 283px;*/
    width: 53%;
    float: left;
    margin-left: 10px;
    height: 178px;
    overflow: hidden;
    position: absolute;
    top: 27%;
    left: 45%;

  }

  .system-msg-box {
    /*height: 178px;*/
  }

  .interface-icon {
    background-color: #ff0000;
    font-weight: normal;
    width: 5px;
    height: 3px;
    line-height: 5px;
    vertical-align: middle;
    margin: auto;
    border-radius: 2px;
    text-align: center;
    display: inline-block;
  }

  .system-msg-interface {
    line-height: 36px;
    font-size: 14px;
    height: 36px;
    padding-left: 10px;
    position: relative;
  }

  .system-msg-interface:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .container-right {
    float: left;
    width: 22%;
    position: relative;
  }

  #interfacePercent {
    height: 230px;
    width: 320px;
  }

  .interface-percent {
    margin-bottom: 60px;
  }

  #interfaceMore {
    height: 400px;
    margin-top: 18px;
  }

  .echart-icon {
    background: url("../../assets/bigScreen/echart-icon.png") 50% no-repeat;
    background-size: 100%;
    height: 55px;
    width: 55px;
    position: absolute;
    top: 16%;
    left: 20%;

  }

  .echart-legend {
    position: absolute;
    left: 55%;
    top: 7%;
    white-space: nowrap;
    width: 170px;
    height: 194px;
    overflow: hidden;
    padding-left: 1%;
  }

  .legend-box {
    /*height: 194px;*/
  }

  .legend-icon {
    width: 12px;
    height: 12px;
    border: none;
    border-radius: 200px;
    background: rgb(0, 193, 222);
    filter: blur(2px);
    display: inline-block;
    margin-right: 4%;
  }

  .legend-text {
    font-size: 20px;
    margin-right: 4%;
  }

  .legend {
    padding-left: 5px;
    padding-bottom: 10px;
    white-space: nowrap;
    /*margin-bottom: 5%;*/
  }

  .legend-number {
    font-family: HighlandGothicFLF;
    font-size: 20px;
    color: #fff;
  }

  .anim {
    transition: all 1s;
    margin-top: -38px;
  }

</style>
