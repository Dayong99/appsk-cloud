<template>
  <div class="project_overview">
    <div class="topbtn">
      <a-button v-for="(item,index) in monitorBtn" :key="index" @click="switchMonitor(item.id,index)" :class="selectedMonitor==index?'active':''" :disabled="selectedMonitor==index?true:false">{{item.name}}</a-button>
    </div>
    <a-row class="project_top" :gutter="16">
      <a-col :span="6">
        <div class="top_info_intro">
          <div class="info frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              AQI
            </p>

            <!-- 内容 -->
            <div class="content">
              <!-- <div class="AQI_title">
                <span class="left">近一个月AQI统计分析</span>
                <span class="red">75%</span>
                <span class="right">优良率：</span>
              </div> -->
              <div id="AQI_echarts"></div>
            </div>
          </div>
          <div class="intro frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              空气湿度
            </p>

            <!-- 内容 -->
            <div class="content">
              <div id="airHumidity_echarts"></div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="project_video frame">
          <span class="project_video_left_top"><img src="../../../assets/digitalScreen-images/middleBg2.png" alt=""></span>
          <span class="project_video_right_top"><img src="../../../assets/digitalScreen-images/middleBg2.png" alt=""></span>
          <span class="project_video_right_bottom"><img src="../../../assets/digitalScreen-images/middleBg2.png" alt=""></span>
          <span class="project_video_left_bottom"><img src="../../../assets/digitalScreen-images/middleBg2.png" alt=""></span>
          <h1>实时环境监测</h1>
          <div id="dial_plate"></div>
          <div class="message pm25">
            <div class="text_left">
              <p>PM2.5(mg/m3)</p>
              <h1>{{realPM25}}</h1>
            </div>
          </div>
          <div class="message pm10">
            <div class="text_left">
              <p>PM10(mg/m )</p>
              <h1>{{realPM10}}</h1>
            </div>
          </div>
          <div class="message noise">
            <div class="text_left">
              <p>噪音(dB)</p>
              <h1>{{realNoise}}</h1>
            </div>
          </div>
          <div class="message wendu">
            <div class="text_right">
              <p>温度(℃)</p>
              <h1>{{realTemperature}}</h1>
            </div>
          </div>
          <div class="message shidu">
            <div class="text_right">
              <p>湿度(%)</p>
              <h1>{{realHumidity}}</h1>
            </div>
          </div>
          <div class="message wind">
            <div class="text_right">
              <p>风速(m/s)</p>
              <h1>{{realWindspeed}}</h1>
            </div>
          </div>
          <p class="keli">污染颗粒</p>
          <div class="monitor">
            设备监测中
          </div>
          <p class="time"></p>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="top_weather_team">
          <div class="weather frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              风速
            </p>

            <!-- 内容 -->
            <div class="content">
              <div id="weather_echarts"></div>
            </div>
          </div>
          <div class="team frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              温度
            </p>

            <!-- 内容 -->
            <div class="content">
              <div id="team_echarts"></div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="project_bottom" :gutter="16">
      <a-col :span="6">
        <div class="bottom_map frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              噪音统计
          </p>
          <div class="content content-table">
            <table>
              <thead>
                <tr>
                  <td>监测时间</td>
                  <td>噪音（dB）</td>
                  <td>等级</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in noiseData" :key="index">
                  <td>{{item.time}}:00</td>
                  <td>{{item.val}}</td>
                  <td v-if="item.val>=60">嘈杂</td>
                  <td v-else-if="item.val<60&&item.val>=50">较安静</td>
                  <td v-else>安静</td>
                </tr>
                <!-- <tr>
                  <td>4/25 08:00</td>
                  <td>32</td>
                  <td>较安静</td>
                </tr>
                <tr>
                  <td>4/25 07:00</td>
                  <td>30</td>
                  <td>较安静</td>
                </tr>
                <tr>
                  <td>4/25 06:00</td>
                  <td>18</td>
                  <td>安静</td>
                </tr>
                <tr>
                  <td>4/25 05:00</td>
                  <td>14</td>
                  <td>安静</td>
                </tr>
                <tr>
                  <td>4/25 04:00</td>
                  <td>13</td>
                  <td>安静</td>
                </tr>
                <tr>
                  <td>4/25 03:00</td>
                  <td>13</td>
                  <td>安静</td>
                </tr>   -->
              </tbody>
            </table>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="bottom_mileage frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>

          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitleLog + ') 10px bottom no-repeat'">
            PM2.5
          </p>
          <!-- 内容 -->
          <div class="content">
            <div id="bottom_mileage_echarts"></div>
          </div>
        </div>
      </a-col>

      <a-col :span="6">
        <div class="bottom_state frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>

          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            PM10
          </p>

          <!-- 内容 -->
          <div class="content">
            <div id="bottom_state_echarts"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import vueSeamLess from 'vue-seamless-scroll'
import moment from 'moment'
export default {
  name: 'ProjectOverview',
  components: {
    vueSeamLess,
  },
  data() {
    return {
      options: {
        images: images,
      },
      deviceIds:[],
      dateTimeArr:["06/18 09", "06/17 21", "06/17 20", "06/17 19", "06/17 18"],
      AQIData:[0, 0, 0, 0, 0],
      humidityData:[0, 0, 0, 0, 0],
      PM25Data:[0, 0, 0, 0, 0],
      PM10Data:[0, 0, 0, 0, 0],
      temperatureData:[0, 0, 0, 0, 0],
      windspeedData:[0, 0, 0, 0, 0],
      noiseData:[{time:'01/01 01',val:0}],
      realTsp:75,
      realHumidity:94,
      realPM25:206.4,
      realPM10:282.3,
      realTemperature:7,
      realWindspeed:3.4,
      realNoise:52.9,
      currentIndex:'',
      selectedMonitor:0,
      monitorBtn:[]
    }
  },

  created() {

  },
  mounted() {
    this.checkMenu();
    this.getEnvironmentIds();
  },
  computed: {

  },
  methods: {
    checkMenu(){
      let arr = this.$store.state.enhance.menuList;
      let path = this.$route.path
      arr.forEach((value,index)=>{
        if(value.url == path){
          this.currentIndex = value.index;
        }
      })
      this.$store.commit('dsHeadIndex',this.currentIndex)
    },
    drawLine1(){
      // 绘制环境监测图表
      let dial_plate = this.$echarts.init(document.getElementById('dial_plate'))
      dial_plate.setOption({
        
             angleAxis: {
                show: false,
                max: 100 * 360 / 270, //-45度到225度，二者偏移值是270度除360度
                type: 'value',
                startAngle: 225, //极坐标初始角度
                splitLine: {
                    show: false
                }
            },
            barMaxWidth: 20, //圆环宽度
            radiusAxis: {
                show: false,
                type: 'category',
            },
            //圆环位置和大小
            polar: {
                center: ['50%', '58%'],
                radius: '250'
            },
            series: [{
                type: 'bar',
                data: [{ //上层圆环，显示数据
                    value: this.realTsp,
                    itemStyle: {
                        color: { //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1, //从左到右 0-1
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(50, 197, 78, 1)'
                            }, {
                                offset: 1,
                                color: 'rgba(5, 193, 187, 1)'
                            }],
                        },
                    },
                }],
                barGap: '-100%', //柱间距离,上下两层圆环重合
                coordinateSystem: 'polar', 
                roundCap: true, //顶端圆角
                z: 2 //圆环层级，同zindex
            },
            { //下层圆环，显示最大值
                type: 'bar',
                data: [{
                    value: 100,
                    itemStyle: {
                        color: 'rgba(15, 29, 58, 1)'
                    }
                }],
                barGap: '-100%',
                coordinateSystem: 'polar',
                roundCap: true,
                z: 1
            },
            //仪表盘
            {
                name: 'AQI',
                type: 'gauge',
                startAngle: 225, //起始角度，同极坐标
                endAngle: -45, //终止角度，同极坐标
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                title: {
                    offsetCenter: [0, 25],
                    color: '#FFFFFF',
                    fontSize: 60,
                    fontWeight: 500,
                    rich: {
                        a: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#FFF',
                            padding: [0, 0, 10, 40]
                        }
                    }
                },
                detail: {
                    formatter: function (e) {
                        return ' ';
                    },
                    
                },
                data: [{
                    value: this.realTsp,
                    name: this.realTsp
                }]
            }
            ]
      })
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let AQI_echarts = this.$echarts.init(document.getElementById('AQI_echarts'))
      let airHumidity_echarts = this.$echarts.init(document.getElementById('airHumidity_echarts'))
      let weather_echarts = this.$echarts.init(document.getElementById('weather_echarts'))
      let team_echarts = this.$echarts.init(document.getElementById('team_echarts'))
      let bottom_mileage_echarts = this.$echarts.init(document.getElementById('bottom_mileage_echarts'))
      let bottom_state_echarts = this.$echarts.init(document.getElementById('bottom_state_echarts'))
      // 绘制AQI图表
      AQI_echarts.setOption({
        title: {
        subtext: '(%Rh)',
        x: '15' ,
        y: '-5',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        formatter: "{b}点: {c}(%Rh)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'15%',
        right:'5%',
        bottom:'20%',
        left:'10%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.AQIData,
        type: 'line',
        smooth:true,
        itemStyle: {
              normal: {
                color: "#EFA216",//折线点的颜色
                lineStyle: {        // 系列级个性化折线样式
                  width: 3,
                  type: 'solid',
                  color: "#EFA216"
                }
              },
        },
        areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(239, 162, 22, 1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(239, 162, 22, 0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
        }
    }]
      }),
      // 绘制空气湿度图表
      airHumidity_echarts.setOption({
        title: {
        subtext: '(%Rh)',
        x: '15' ,
        y: '-5',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        trigger: 'axis',
        formatter: "{b}点: {c}(%Rh)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'15%',
        right:'5%',
        bottom:'20%',
        left:'10%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.humidityData,
        type: 'line',
        smooth:true,
        itemStyle: {
              normal: {
                color: "#EFA216",//折线点的颜色
                lineStyle: {        // 系列级个性化折线样式
                  width: 3,
                  type: 'solid',
                  color: "#EFA216"
                }
              },
        },
        areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(239, 162, 22, 1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(239, 162, 22, 0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
        }
    }]
      }),
            // 绘制风速图表
      weather_echarts.setOption({
        title: {
        subtext: '(m/s)',
        x: '15' ,
        y: '-5',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        trigger: 'axis',
        formatter: "{b}点: {c}(m/s)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'15%',
        right:'5%',
        bottom:'20%',
        left:'10%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.windspeedData,
        type: 'line',
        smooth:true,
      symbolSize: 4,   //折线点的大小
      itemStyle: {
         normal: {
          color: "#0EC6CB",//折线点的颜色
          lineStyle: {
          width: 2,
          type: 'solid',
          color: "#0EC6CB",
          }
        }
        },
        areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(14, 198, 203, 0.9)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(14, 198, 203, .1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
        }
    }]
      }),
      // 绘制温度图表
      team_echarts.setOption({
        title: {
        subtext: '(℃)',
        x: '15' ,
        y: '-5',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        trigger: 'axis',
        formatter: "{b}点: {c}(℃)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'15%',
        right:'5%',
        bottom:'20%',
        left:'10%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.temperatureData,
        type: 'line',
        smooth:true,
        itemStyle: {
              normal: {
                color: "#FF3F3F",//折线点的颜色
                lineStyle: {        // 系列级个性化折线样式
                  width: 3,
                  type: 'solid',
                  color: "#FF3F3F"
                }
              },
        },
        areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(255, 63, 63, 0.9)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(255, 63, 63, 0.1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
        }
    }]
      }),
      // 绘制PM2.5图表
      bottom_mileage_echarts.setOption({
        title: {
        subtext: '(mg/m3)',
        x: '15' ,
        y: '-15',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        trigger: 'axis',
        formatter: "{b}点: {c}(mg/m3)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'10%',
        right:'0%',
        bottom:'20%',
        left:'5%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.PM25Data,
        type: 'line',
        smooth:true,
        itemStyle: {
              normal: {
                color: "#32C54E",//折线点的颜色
                lineStyle: {        // 系列级个性化折线样式
                  width: 3,
                  type: 'solid',
                  color: "#32C54E"
                }
              },
        },
        areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(40, 155, 73, 1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(40, 155, 73, .1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
        }
    }]
      }),
      // 绘制PM10图表
      bottom_state_echarts.setOption({
        title: {
        subtext: '(mg/m3)',
        x: '0' ,
        y: '-10',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },

    },
        tooltip: {
        trigger: 'axis',
        formatter: "{b}点: {c}(mg/m3)",
        backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色(此时为默认色)
        borderRadius: 8,//边框圆角
        padding: 10, // [5, 10, 15, 20] 内边距
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
        grid:{
        top:'15%',
        right:'0%',
        bottom:'15%',
        left:'10%'
        },
    xAxis: {
        type: 'category',
        data: this.dateTimeArr,
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                }
    },
    yAxis: {
        type: 'value',
        axisTick:{ show:false },
        axisLine: {
              show: false,
          },
        axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#4B7186',
                    fontSize:'9'
                    }
                },
        splitLine: {
                //网格线
                lineStyle: {
                  type: "solid", //设置网格线类型 dotted：虚线   solid:实线
                  width: 1,
                  color:'rgba(73, 217, 254, .05)',
                },
                show: true, //隐藏或显示
              },
    },
    series: [{
        data: this.PM10Data,
        type: 'bar',
        barWidth : 20,//柱图宽度
        itemStyle: {
						normal: {
							color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
								offset: 0,
								color: "rgba(9, 174, 219, 1)" // 0% 处的颜色
							}, {
								offset: 1,
								color: "rgba(5, 195, 184, 1)" // 100% 处的颜色
							}], false)
						}
          }
        }]
      })
    },
    getEnvironmentIds(){
      let relid = this.$store.state.user.info.relTenantIds;
      getAction('/deviceManage/device/list',{relTenantIds:relid,deviceCatagory:'environment'}).then((res)=>{
        if(res.code == 200){
          let data = res.result.records;
          data.forEach((value,index)=>{
            this.deviceIds.push(value.id);
            this.monitorBtn.push({
              id:value.id,
              name:value.deviceName
            })
          })
          this.getEnvironmentData(this.deviceIds[0])
        }
      })
    },
    getEnvironmentData(id){
        getAction('/environment/environmentRecord/findRealTimeEnvironment',{deviceId:id}).then((res)=>{
          console.log(res)
          if(res.code == 200){
            let data = res.result;
            this.realHumidity = parseFloat(data.humidity)
            this.realNoise = parseFloat(data.noise)
            this.realPM10 = parseFloat(data.pm10)
            this.realPM25 = parseFloat(data.pm25)
            this.realTemperature = parseFloat(data.temperature)
            this.realTsp = parseFloat(data.tsp)
            if(!data.windspeed){
              this.realWindspeed = '--'
            }else{
              this.realWindspeed = parseFloat(data.windspeed)
            }
            this.drawLine1();
          }
        })
        getAction('/environment/environmentRecord/selectEnvironmentData',{deviceId:id}).then((res)=>{
          // console.log(res)
          if(res.code==200){
            if(res.result.length!=0){
              this.dateTimeArr.splice(0,this.dateTimeArr.length);
              this.AQIData.splice(0,this.AQIData.length);
              this.humidityData.splice(0,this.humidityData.length);
              this.PM25Data.splice(0,this.PM25Data.length);
              this.PM10Data.splice(0,this.PM10Data.length);
              this.temperatureData.splice(0,this.temperatureData.length);
              this.windspeedData.splice(0,this.windspeedData.length);
              this.noiseData.splice(0,this.noiseData.length);
            }
            let data = res.result;
            data.forEach((value,index)=>{
              for(let k in value){
                value[k] = (value[k]===null||value[k]===undefined)?0:value[k]
              }
              this.dateTimeArr.push(this.switchTimeToDate(value.reportTime))
              this.AQIData.push(value.tsp)
              this.humidityData.push(value.humidity)
              this.PM25Data.push(value.pm25)
              this.PM10Data.push(value.pm10)
              this.temperatureData.push(value.temperature)
              this.windspeedData.push(value.windspeed)
              this.noiseData.push({
                time:this.switchTimeToDate(value.reportTime),
                val:value.noise
              })
            })
            this.drawLine();
            // console.log(this.noiseData);
          }
        })
    },
    switchTimeToDate(time){
      let timeStr = time;
      let time1 = timeStr.split(' ');
      let time2 = time1[0].split('-');
      // console.log(time2);
      return time2[1]+'/'+time2[2]+' '+time1[1]
    },
    switchMonitor(id,index){
      this.selectedMonitor= index;
      // this.getPressList(code,cate)
      this.getEnvironmentData(id)
    },
  }
}
</script>
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
body {
  line-height: 0;
}
.topbtn {
  margin-bottom: 20px;
  width: 100%;
  height: 31px;
  border-bottom: 1px solid rgba(34, 77, 153, 1);
  .ant-btn {
    width: 100px;
    height: 30px;
    margin-right: 10px;
    background: url(../../../assets/digitalScreen-images/topbtn2.png);
    border: none;
    border-radius: 0;
    color: #fff;
    font-size: 14px;
    padding:0 10px;
  }
  /deep/.ant-btn>span{
      width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 30px;
      line-height: 30px;
  }
  .ant-btn.active{
    background: url(../../../assets/digitalScreen-images/topbtn1.png);
    }
}
.project_overview {
  width: 100%;
  height: auto;
  //background: #f1f1f1;
  .project_top,
  .project_bottom {
    display: flex;
    justify-content: space-between;
    .top_info_intro {
      width: 100%;
      .info {
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 258px;
        .content {
          .AQI_title {
            margin: 13px auto 0;
            width: 395px;
            height: 30px;
            background: rgba(29, 44, 77, .8);
            font-family: "Microsoft YaHei";
            font-weight: 400;
            color: #EFEFEF;
            line-height: 30px;
            .left {
              float: left;
              margin-left: 10px;
            }
            .right ,.red {
              float: right;
            }
            .red {
              margin-right: 10px;
              font-weight: bold;
              color: #F2534D;
              font-size: 24px;
            }
          }
          #AQI_echarts {
            // margin-top: 30px;
            width: 100%;
            height: 208px;
          }
        }
      }
      .intro {
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        height: 258px;
        .content {
          display: flex;
          justify-content: space-between;
          height: 74%;
          overflow: hidden;
          #airHumidity_echarts {
            width: 100%;
            height: 208px;
          }
        }
      }
    }
    .project_video {
      position: relative;
      margin: 10px 0 0 10px;
      width: 897px;
      height: 505px;
      background: url(../../../assets/digitalScreen-images/center-bg.png) no-repeat;
      background-size: 100%,100%;
      border: none;
      .project_video_left_top {
        position: absolute;
        left: -10px;
        top: -10px;
        width: 80px;
        height: 80px;
      }
      .project_video_right_top {
        position: absolute;
        right: -10px;
        top: -10px;
        width: 80px;
        height: 80px;
        transform: rotate(90deg);
      }
      .project_video_right_bottom {
        position: absolute;
        right: -10px;
        bottom: -10px;
        width: 80px;
        height: 80px;
        transform: rotate(180deg);
      }
      .project_video_left_bottom {
        position: absolute;
        left: -10px;
        bottom: -10px;
        width: 80px;
        height: 80px;
        transform: rotate(270deg);
      }
      img {
        width: 100%;
        height: 100%;
      }
      h1 {
        font-size: 18px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        line-height: 34px;
      }
      #dial_plate {
        position: absolute;
        top: 79px;
        left: 50%;
        transform: translateX(-50%);
        width: 387px;
        height: 339px;
        background: url(../../../assets/digitalScreen-images/dial_plate.png) no-repeat;
        background-size: 100% , 100%;
      }
      .message {
        position: absolute;
        width: 208px;
        height: 80px;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-weight: 400;
        color: #35D9E0;
      }
      .text_left , .text_right{
        padding-top: 14px;
        margin-left: 77px;
        width: 130px;
        height: 80px;
        text-align: center;
        h1 {
          font-size: 28px;
          font-weight: bold;
        }
      }
      .pm25 {
        left: 17px;
        top: 88px;
        background: url(../../../assets/digitalScreen-images/env-pm25.png);
        h1 {
          color: #F2534D;
        }
      }
      .pm10 {
        left: 17px;
        top: 236px;
        background: url(../../../assets/digitalScreen-images/env-pm10.png);
        h1 {
          color: #EFA216;
        }
      }
      .noise {
        left: 17px;
        top: 384px;
        background: url(../../../assets/digitalScreen-images/env-noise.png);
        h1 {
          color: #32C54E;
        }
      }
      .text_right {
        margin-right: 0;
      }
      .wendu {
        right: 16px;
        top: 88px;
        background: url(../../../assets/digitalScreen-images/env-wendu.png) no-repeat;
        h1 {
          color: #F2534D;
        }
      }
      .shidu {
        right: 16px;
        top: 236px;
        background: url(../../../assets/digitalScreen-images/env-shidu.png) no-repeat;
        h1 {
          color: #EFA216;
        }
      }
      .wind {
        right: 16px;
        top: 384px;
        background: url(../../../assets/digitalScreen-images/env-wind.png) no-repeat;
        h1 {
          color: #32C54E;
        }
      }
      .keli {
        position: absolute;
        top: 320px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color:  rgb(58,236,242) ;
      }
      .monitor {
        position: absolute;
        top: 424px;
        left: 50%;
        transform: translateX(-50%);
        width: 110px;
        height: 28px;
        background: linear-gradient(270deg, #05C1BB, #32C54E);
        border-radius: 14px;
        font-size: 16px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        color: #FFFFFF;
        text-align: center;
        line-height: 28px;
      }
      .time {
        position: absolute;
        top: 465px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color: #EFEFEF;
      }
    }
    .top_weather_team {
      width: 100%;
      .weather {
        position: relative;
        color: white;
        height: 258px;

        .content {
          padding: 0 20px;
          #weather_echarts {
            width: 100%;
            height: 208px;
          }
        }
      }
      .team {
        position: relative;
        margin-top: 10px;
        height: 258px;
        .content {
          padding-left: 20px;
          #team_echarts {
            width: 100%;
            height: 208px;
          }
        }
      }
    }

    .bottom_mileage,
    .bottom_state,
    .bottom_map {
      position: relative;
      margin-top: 10px;
      height: 285px;
      .content {
        margin: 14px auto 0;
        width: 395px;
        height: 220px;
        overflow: hidden;
        table {
          width: 100%;
          tr {
            width: 395px;
            height: 30px;
            td {
              width: 30%;
              text-align: center;
              color:#fff;
              line-height: 30px;
            }
          }
          tbody tr:nth-child(2n+1) {
            background:rgba(13, 35, 70, .8);
          }
          thead tr {
            background: rgba(4, 163, 247, .8);
          }
        }
      }
      .content.content-table{
        overflow: hidden;
      }
      .content.content-table:hover{
        overflow: auto;
      }
      .content.content-table::-webkit-scrollbar {
          width: 2px;
      }
      .content.content-table::-webkit-scrollbar-thumb {
          border-radius: 5px;
          /* background: rgb(31, 143, 255, .5); */
          background: rgb(255, 255, 255, .8);
      }
      .content.content-table::-webkit-scrollbar-track {
          border-radius: 5px;
          background: none;
      }
    }
    .bottom_mileage {
      .content {
        width: 917px;
        height: 220px;
        #bottom_mileage_echarts {
          margin: 0 auto;
          width: 917px;
          height: 220px;
        }
      }
    }
    .bottom_state {
      .content {
        width: 395px;
        height: 220px;
        #bottom_state_echarts {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .span_icon {
    position: absolute;
    width: 20px;
    height: 20px;
  }
  .top_left_icon {
    top: 0;
    left: 0;
    border-top: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
  }
  .top_right_icon {
    top: 0;
    right: 0;
    border-top: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
  }
  .bottom_left_icon {
    bottom: 0;
    left: 0;
    border-bottom: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
  }
  .bottom_right_icon {
    bottom: 0;
    right: 0;
    border-bottom: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
  }

  .big_span_icon {
    position: absolute;
    height: 80px;
    width: 80px;
  }
  .head_title {
    line-height: 50px;
    padding-left: 30px;
    font-size: 16px;
    color: white;
  }

  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    opacity: 0.9;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }
  .popup {
    position: absolute;
    width: 642px;
    height: 708px;
    background-color: black;
    z-index: 999;
    top: 50px;
    left: 33%;
    padding: 15px 20px 0 30px;
  }
  .popup_title {
    overflow: hidden;
  }
  .popup_title p {
    float: left;
    font-size: 16px;
    color: #efefef;
  }
  .popup_close {
    cursor: pointer;
    width: 18px;
    height: 18px;
    float: right;
    margin-right: 15px;
    margin-top: 20px;
  }
  .abarbeitung {
    position: relative;
    height: 636px;
    overflow-y: auto;
    .addTime {
      color: rgba(4, 163, 247, 1);
      width: 93%;
      margin: 0 auto;
      margin-top: 3%;
      padding-bottom: 1.5%;
      border-bottom: 1px solid rgba(6, 68, 116, 1);
      cursor: pointer;
    }
    .cont {
      width: 93%;
      margin: 0 auto;
    }
  }
  .form_con {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
  }
  .check_time {
    width: 210px;
  }
  .input_cont {
    width: 280px;
    text-indent: 12px;
  }
  .delete_it {
    color: white;
    line-height: 32px;
    cursor: pointer;
  }
  .popup_footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
    div {
      border: 1px solid rgba(4, 163, 247, 1);
      border-radius: 5px;
      margin: 2.5% auto;
      font-size: 14px;
      text-align: center;
      color: rgba(4, 163, 247, 1);
      float: right;
      width: 15%;
      line-height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    .sure {
      background: rgba(4, 163, 247, 1);
      color: white;
    } 
  }
}
li {
  list-style: none;
}
</style>