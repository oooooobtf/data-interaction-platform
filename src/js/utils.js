import {DateUtils} from "./DateUtils";

var Utils = (function () {
  return{
    /*
     * 是否为空
     * 返回值：布尔值
     * false：表示不为空
     * true：表示为空
     */
    isEmptyObject: function(obj) {
      for(var name in obj) {
        return false;
      }
      return true;
    },
    //只能输入中文，英文，以及数字
    verifyCnEnNum:function (e) {
      $(e).val($(e).val().replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ""));
    },

    //只能输入中文，英文
    verifyCnEn:function(e) {
      $(e).val($(e).val().replace(/[^\a-\z\A-\Z\u4E00-\u9FA5]/g, ""));
    },
    //只能输入英文，以及数字
   verifyEnNum:function(e) {
     $(e).val($(e).val().replace(/[^\a-\z\A-\Z0-9]/g, ""));
    },
    //只能输入数字
   verifyNum:function(e) {
      $(e).val($(e).val().replace(/[^0-9]/g, ""));
   },
    //只能百分比
   verifyNumP:function(e) {
      if(Number($(e).val()) > 100) {
        alert("当前百分比不能大于100%");
        $(e).val("");
      }
      $(e).val($(e).val().replace(/[^0-9.]/g, ""));
   },

    /*
    * 判断是否为数组
    * o:传入的值
    * 返回值:Boolean
    * */
    isArray:function (o) {
      return Object.prototype.toString.call(o)=='[object Array]';
    },
    /*
     * 根据参数名截取Url中的参数值
     * para：键；浏览器上的键值对
     * 使用方法：如：http://localhost:8080/BTVhtml/page/home/index.html?param=12
     * Comm.getParaVal('param');//获取地址上的param的值
     */
    getParaVal: function(para) {
      var regStr = "(^|&|&amp;)" + para + "=" + "([^&]*)(&|$)";
      var reg = new RegExp(regStr);
      var pval = window.location.search.substr(1).match(reg);
      if(pval == null)
        return null
      else
        return decodeURI(pval[2]);
    },
    /*设置滚动条 */
    setScroll:function(str){
      $("#" + str).niceScroll({
        //0f89fd
        /*autohidemode  隐藏滚动条的方式
               * 可用的值:
               *  true | // 无滚动时隐藏
               * "cursor" | // 隐藏
               * false | // 不隐藏,
               * "leave" | // 仅在指针离开内容时隐藏
               * "hidden" | // 一直隐藏
               * "scroll", // 仅在滚动时显示
               */
        autohidemode:"cursor",// // 隐藏滚动条的方式,
        cursorcolor: "#dbe2e4", // 改变滚动条颜色，使用16进制颜色值
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: .5, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: "5px", // 滚动条的宽度，单位：便素
        cursorborder: "0", // CSS方式定义滚动条边框
        cursorborderradius: "5px", // 滚动条圆角（像素）
        zindex: 999, // 改变滚动条的DIV的z-index值
        scrollspeed: 60, // 滚动速度
        mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素)
        touchbehavior: false, // 激活拖拽滚动
        hwacceleration: true, // 激活硬件加速
        boxzoom: false, // 激活放大box的内容
        dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
        gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
        grabcursorenabled: true // (仅当 touchbehavior=true) 显示“抓住”图标display "grab" icon
      });
      $("#"+str).getNiceScroll().show(); //显示弹窗
      $("#"+str).getNiceScroll().resize(); //检测滚动条是否重置大小（当窗口改变大小时）
    },
    /*得到时间格式
		 *	用法：
		 *	value：传入的时间。格式如下
		 *	2017-10-10 T 05:11:13.3214  2015-08-12 13:00:00  2015/08/12 13:00:00  1507583473000
		 *  format：想要转换成的时间格式
		 * 	yyyy-MM-dd HH:mm:ss   yyyy年MM月dd日  	yyyy/MM/dd HH:mm:ss  yyyy/MM/dd  yyyy-MM-dd  HH:mm:ss
		 * 	列如：
		 *  Comm.getDateFormat('1507583473000','HH:mm:ss')
		 * 	返回值：是个对象
		 * 	{
		 * 		timestamp：时间戳
		 * 		dateFormat：想要的时间格式
		 * }
		 * */
    getDateFormat:function (value, format) {
      if(!Utils.isEmptyObject(value) && value != "null"){
        if(value.length <= 0) {
          return;
        }
        //字符串中包含T的时间
        if(value.indexOf('T') >= 0) {
          value = value.replace(/\/ /g, "");
          value = value.replace("T", " ");
          if(value.indexOf(".") >= 0) {
            value = value.substring(0, value.indexOf("."));
          }
        } else if(value.indexOf('/') < 0 && value.indexOf('-') < 0 && value.indexOf(':') < 0) {
          value = Comm.getTimeByTimestamp(value);
        }

        return {
          timestamp: new Date(value).getTime(),
          dateFormat: DateUtils.format(new Date(value), format)
        }
      }else {
        return {
          timestamp: '',
          dateFormat: ''
        }
      }
    },
    /*
    * echart高亮
    * option：echarts的option对象
    * echart：echarts对象
    * dataIndex：需要高亮的下标
    * */
    echartHeightLight:function (option,echart,dataIndex) {
      //高亮的点
      var currentIndex = option.series[0].data.length;
      // 取消之前高亮的图形
      echart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
      });
      // 高亮当前图形
      echart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: dataIndex
      });
      // 显示 tooltip
      echart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      });
    },
  }
})();
export {Utils}

