<template>
  <div class="project_overview">
    <a-row :gutter="16" class="project_top">
      <!-- 设备告警次数统计 -->
      <a-col :span="6">
        <div class="frame jiaobiao_box">
          <div class="jiaobiao"></div>
          <div class="warn">
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              告警次数统计
            </p>
            <div class="warn_line">
              <div class="warn_list" @click="showModal">
                <p>12</p>
                <p class="tittle">超重告警</p>
                <img class="warn" src="../../../assets/digitalScreen-images/GantryCrane/weight-warn.png" alt="" />
                <img class="normal" src="../../../assets/digitalScreen-images/GantryCrane/weight-normal.png" alt="" />
              </div>
              <div class="warn_list" @click="showModal">
                <p>18</p>
                <p class="tittle">超速告警</p>
                <img class="warn" src="../../../assets/digitalScreen-images/GantryCrane/speed-warn.png" alt="" />
                <img class="normal" src="../../../assets/digitalScreen-images/GantryCrane/speed-normal.png" alt="" />
              </div>
            </div>
            <div class="warn_line">
              <div class="warn_list" @click="showModal">
                <p>10</p>
                <p class="tittle">HOME点告警</p>
                <img class="warn" src="../../../assets/digitalScreen-images/GantryCrane/home-warn.png" alt="" />
                <img class="normal" src="../../../assets/digitalScreen-images/GantryCrane/home-normal.png" alt="" />
              </div>
              <div class="warn_list" @click="showModal">
                <p>20</p>
                <p class="tittle">倾角告警</p>
                <img class="warn" src="../../../assets/digitalScreen-images/GantryCrane/angle-warn.png" alt="" />
                <img class="normal" src="../../../assets/digitalScreen-images/GantryCrane/angle-normal.png" alt="" />
              </div>
            </div>
            <a-modal v-model="visible" :footer="null" :centered="true" @ok="handleOk" dialogClass="warn_model">
              <p>设备告警记录</p>
              <form action="">
                <div class="serch">
                  <span>设备名称：</span>
                  <a-select default-value="全部" style="width: 120px" @change="handleChange">
                    <a-select-option value="1"> 12号龙门吊 </a-select-option>
                    <a-select-option value="2"> 20号龙门吊 </a-select-option>
                    <a-select-option value="3"> 15号龙门吊 </a-select-option>
                    <a-select-option value="4"> 14号龙门吊 </a-select-option>
                  </a-select>
                  <span class="name">告警类型：</span>
                  <a-select default-value="超速预警" style="width: 120px" @change="handleChange2">
                    <a-select-option value="cz"> 超重预警 </a-select-option>
                    <a-select-option value="cs"> 超速预警 </a-select-option>
                    <a-select-option value="home"> home点告警 </a-select-option>
                    <a-select-option value="qj"> 倾角告警 </a-select-option>
                  </a-select>
                  <span class="name">告警时间：</span>
                  <a-range-picker @change="onChange" />
                  <a-button>查询</a-button>
                  <input type="reset" name="button" id="button" value="重置" class="reset" />
                </div>
                <table>
                  <thead>
                    <tr>
                      <td>设备名称</td>
                      <td>设备编号</td>
                      <td>告警类型</td>
                      <td>告警时间</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                    <tr>
                      <td>12号龙门吊</td>
                      <td>AD235234623463465</td>
                      <td>超速预警</td>
                      <td>2020-09-23 19:15</td>
                    </tr>
                  </tbody>
                </table>
                <p class="page_message">当前显示第<span>1</span>到第<span>10</span>页内容，共<span>500</span>页</p>
                <a-pagination :default-current="6" :total="500" class="down" />
              </form>
            </a-modal>
          </div>
        </div>
      </a-col>
      <!-- 中间龙门吊图纸盒子 -->
      <a-col :span="12">
        <div class="frame jiaobiaoImg_box gantry_drawing" style="padding-top: 0">
          <div class="jiaobiaoImg"></div>
          <img class="drawing" src="../../../assets/digitalScreen-images/GantryCrane/drawing.png" alt="" />
          <!-- 龙门吊气泡 -->
          <div class="bubble" @click="bubbleShowModal">
            <span>5号龙门吊</span>
            <img src="../../../assets/digitalScreen-images/GantryCrane/gantry.png" alt="" />
          </div>
          <a-modal v-model="bubbleVisible" :footer="null" :centered="true" @ok="handleOk" dialogClass="bubble_model warn_model">
            <p>20号龙门吊</p>
            <div class="left">
              <img src="../../../assets/digitalScreen-images/GantryCrane/left_img.png" alt="" />
              <p>
                设备名称：20号龙门吊<br />
                设备编号：TR1236353<br />
                类型：双箱梁门式起重机<br />
                型号：MG225/32t-30m-18.5m <br />
                设备状态：<span>风速报警</span><br />
                司机姓名：张建峰<br />
                证书编号：AF53121212<br />
                开机时间：2020-11-1 12：11:02<br />
                关机时间：2020-11-1 18：11:02
              </p>
              <a-divider />
              <div class="list_box">
                <div class="list">未停放至home点</div>
                <div class="list">吊重</div>
                <div class="list">大车速度</div>
                <div class="list">小车速度</div>
                <div class="list">主钩1提升速度</div>
                <div class="list">主钩2提升速度</div>
                <div class="list list_warn">风速</div>
                <div class="list">副钩提升速度</div>
                <div class="list">倾角监测X</div>
                <div class="list">倾角监测Y</div>
              </div>
            </div>
            <div class="right">
              <div class="top">
                <div class="monitor">
                  <p class="tittle">实时监测数据 <span>数据更新时间：2021/7/20 19:09</span></p>
                  <div class="monitor_box">
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/dz.png" alt="" />
                      <p>吊重 <br /><span>20.3t</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/zg.png" alt="" />
                      <p>主钩1提升速度 <br /><span>60.5m/min</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/zg.png" alt="" />
                      <p>主钩2提升速度 <br /><span>60.5m/min</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/zg.png" alt="" />
                      <p>副钩提升速度 <br /><span>60.5m/min</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/wy.png" alt="" />
                      <p>大车位移 <br /><span>110.01m</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/sd.png" alt="" />
                      <p>大车速度 <br /><span>10m/s</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/wy.png" alt="" />
                      <p>小车位移 <br /><span>110.01m</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/sd.png" alt="" />
                      <p>小车速度 <br /><span>10m/s</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/fs.png" alt="" />
                      <p>风速 <br /><span>120.02m/mec</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/qj.png" alt="" />
                      <p>倾角监测X <br /><span>35°</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/qj.png" alt="" />
                      <p>倾角监测Y <br /><span>35°</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/wy.png" alt="" />
                      <p>home点位移 <br /><span>110.01m</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/gj.png" alt="" />
                      <p>告警次数 <br /><span>15次</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/sj.png" alt="" />
                      <p>开机时长 <br /><span>4.5h</span></p>
                    </div>
                    <div class="monitor_list">
                      <img src="../../../assets/digitalScreen-images/GantryCrane/gz2.png" alt="" />
                      <p>实际工作时长 <br /><span>4.5h</span></p>
                    </div>
                  </div>
                </div>
                <div class="video">
                  <p class="tittle">监控视频</p>
                  <img src="../../../assets/digitalScreen-images/GantryCrane/modal_video_img.png" alt="" />
                </div>
              </div>
              <div class="bottom">
                <form action="">
                  <p class="tittle">历史数据</p>
                  <span class="name">告警时间：</span>
                  <a-range-picker @change="onChange" />
                  <a-button>查询</a-button>
                  <input type="reset" name="button" id="button" value="重置" class="reset" />
                  <table>
                    <tr>
                      <td>检测时间</td>
                      <td>吊重</td>
                      <td>风速</td>
                      <td>主钩1提升速度</td>
                      <td>主钩2提升速度</td>
                      <td>副钩提升速度</td>
                      <td>大车位移</td>
                      <td>大车速度</td>
                      <td>小车位移</td>
                      <td>小车速度</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                    <tr>
                      <td>2020-4-7 16:57:27</td>
                      <td>2.5t</td>
                      <td>15.01/mec</td>
                      <td>90.8 m/min</td>
                      <td>100.9 m/min</td>
                      <td>100.9 m/min</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                      <td>110.1m</td>
                      <td>10 m/s</td>
                    </tr>
                  </table>
                  <p class="page_message">当前显示第<span>1</span>到第<span>10</span>页内容，共<span>500</span>页</p>
                  <a-pagination :default-current="6" :total="500" class="down" />
                </form>
              </div>
            </div>
          </a-modal>
        </div>
      </a-col>
      <!-- 在场设备统计盒子 -->
      <a-col :span="6">
        <div class="frame jiaobiao_box">
          <div class="jiaobiao"></div>
          <div class="head">
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              在场设备统计
            </p>
            <table>
              <tr>
                <td>
                  <p>设备名称</p>
                  <img src="../../../assets/digitalScreen-images/GantryCrane/head_icon.png" alt="" />
                </td>
                <td>
                  <p>设备类型</p>
                  <img src="../../../assets/digitalScreen-images/GantryCrane/head_icon.png" alt="" />
                </td>
                <td>
                  <p>厂家</p>
                  <img src="../../../assets/digitalScreen-images/GantryCrane/head_icon.png" alt="" />
                </td>
              </tr>
              <tr>
                <td>27号龙门吊</td>
                <td>双箱梁门式起重机</td>
                <td>安徽中治</td>
              </tr>
              <tr>
                <td>10号龙门吊</td>
                <td>双箱梁门式起重机</td>
                <td>安徽中治</td>
              </tr>
              <tr>
                <td>13号龙门吊</td>
                <td>双箱梁门式起重机</td>
                <td>安徽中治</td>
              </tr>
            </table>
            <p class="more" @click="showModal2">更多记录>></p>
            <a-modal v-model="visible2" :footer="null" :centered="true" @ok="handleOk" dialogClass="warn_model">
              <p>在场设备统计</p>
              <form action="">
                <div class="serch more_serch">
                  <span>设备名称：</span>
                  <a-select default-value="全部" style="width: 120px" @change="handleChange">
                    <a-select-option value="1"> 12号龙门吊 </a-select-option>
                    <a-select-option value="2"> 20号龙门吊 </a-select-option>
                    <a-select-option value="3"> 15号龙门吊 </a-select-option>
                    <a-select-option value="4"> 14号龙门吊 </a-select-option>
                  </a-select>
                  <span class="name">设备类型：</span>
                  <a-select default-value="超速预警" style="width: 120px" @change="handleChange2">
                    <a-select-option value="cz"> 双箱梁门式起重机 </a-select-option>
                    <a-select-option value="cs"> 电动单梁起重机 </a-select-option>
                  </a-select>
                  <span class="name">开机时间：</span>
                  <a-range-picker @change="onChange" />
                  <a-button>查询</a-button>
                  <input type="reset" name="button" id="button" value="重置" class="reset" />
                  <p class="export"><a-icon type="export" />导出</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <td>设备名称</td>
                      <td>设备类型</td>
                      <td>厂家</td>
                      <td>型号</td>
                      <td>开机时长</td>
                      <td>实际工作时长</td>
                      <td>启动次数</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>14号龙门吊</td>
                      <td>双箱梁门式起重机</td>
                      <td>安徽中治</td>
                      <td>MG225/32t-30m-18.5</td>
                      <td>2.5h</td>
                      <td>2.5h</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>14号龙门吊</td>
                      <td>双箱梁门式起重机</td>
                      <td>安徽中治</td>
                      <td>MG225/32t-30m-18.5</td>
                      <td>2.5h</td>
                      <td>2.5h</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>14号龙门吊</td>
                      <td>双箱梁门式起重机</td>
                      <td>安徽中治</td>
                      <td>MG225/32t-30m-18.5</td>
                      <td>2.5h</td>
                      <td>2.5h</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </table>
                <p class="page_message">当前显示第<span>1</span>到第<span>10</span>页内容，共<span>500</span>页</p>
                <a-pagination :default-current="6" :total="500" class="down" />
              </form>
            </a-modal>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16" class="project_bottom">
      <!-- 告警趋势分析图表 -->
      <a-col :span="6">
        <div class="frame jiaobiao_box analyse">
          <div class="jiaobiao"></div>
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            告警趋势分析
          </p>
          <div class="time_btn">
            <a-button>近12个月</a-button>
            <a-button>近6个月</a-button>
            <a-button>近1个月</a-button>
          </div>
          <div id="warn_echarts"></div>
        </div>
      </a-col>
      <!-- 工作时长统计图表 -->
      <a-col :span="18">
        <div class="frame jiaobiao_box duration">
          <div class="jiaobiao"></div>
          <p class="head_title" :style="'background: url(' + options.images.frameTitleLog + ') 10px bottom no-repeat'">
            工作时长统计
          </p>
          <ul>
            <li>
              <img src="../../../assets/digitalScreen-images/GantryCrane/sb.png" alt="" />
              <p><span>17</span><br />在线设备</p>
            </li>
            <li>
              <img src="../../../assets/digitalScreen-images/GantryCrane/bj.png" alt="" />
              <p><span>267</span><br />工作时长</p>
            </li>
            <li>
              <img src="../../../assets/digitalScreen-images/GantryCrane/gz.png" alt="" />
              <p><span>125</span><br />报警次数</p>
            </li>
          </ul>
          <div id="duration_echarts"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import images from '@/utils/Imgaes.js'
export default {
  data() {
    return {
      options: {
        images: images,
      },
      visible: false,
      visible2: false,
      bubbleVisible: false,
    }
  },
  created() {},
  mounted() {
    this.drawLine1()
    this.drawLine2()
  },
  computed: {},
  methods: {
    //   弹窗
    handleOk(e) {
      console.log(e)
      this.visible = false
      this.visible2 = false
      this.bubbleVisible = false
    },
    showModal() {
      this.visible = true
    },
    showModal2() {
      this.visible2 = true
    },
    bubbleShowModal() {
      this.bubbleVisible = true
    },
    // 下拉列表
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleChange2(value) {
      console.log(`selected ${value}`)
    },
    // 日期选择器
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    // 告警趋势分析图表
    drawLine1() {
      let warn_echarts = this.$echarts.init(document.getElementById('warn_echarts'))
      warn_echarts.setOption({
        grid: {
          top: '30px',
          left: '50px',
          right: '50px',
          bottom: '30px',
        },
        title: {
          top: '-10px',
          left: '7px',
          subtext: '单位/次',
          subtextStyle: {
            fontSize: 12,
            color: '#4B7186',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          // 不显示刻度
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: 'false',
            color: 'rgba(75, 113, 134, 1)',
          },
          type: 'category',
          boundaryGap: false,
          data: ['2020/10', '2020/12', '2021/2', '2021/4', '2021/6', '2021/8'],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          // 不显示刻度
          axisTick: {
            show: false,
          },
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'solid', //设置网格线类型 dotted：虚线   solid:实线
              width: 1,
              color: 'rgba(73, 217, 254, 1)',
              opacity: '0.05',
            },
            show: true,
          },
          axisLabel: {
            show: 'false',
            color: 'rgba(75, 113, 134, 1)',
          },
        },
        series: [
          {
            data: [0, 300, 500, 460, 390, 540, 320],
            type: 'line',
            symbol: 'none',
            areaStyle: {},
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 3, //设置线条粗细
                  color: '#FF3F3F', //改变折线颜色
                },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: 'rgba(255, 63, 63, 0.58)' }, //柱图渐变色
                  { offset: 1, color: 'rgba(255, 63, 63, 0)' }, //柱图渐变色
                ]),
              },
            },
          },
        ],
      })
    },
    // 工作时长统计图表
    drawLine2() {
      let duration_echarts = this.$echarts.init(document.getElementById('duration_echarts'))
      duration_echarts.setOption({
        grid: {
          top: '15%',
          left: '7%',
          right: '6%',
          bottom: '13%',
          // containLabel: true
        },
        title: {
          top: '-10px',
          left: '7px',
          subtext: '单位：小时',
          subtextStyle: {
            fontSize: 12,
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ['实际工作时长', '开机时长'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
          right: '6%',
        },
        calculable: true,
        // 不显示x轴的相关信息
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            interval: 0, //强制显示文字
            color: 'rgba(255, 255, 255, 1) ',
            fontSize: '12',
          },
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#fff',
            },
          },
          data: ['1号机', '2号机', '3号机', '4号机', '5号机', '6号机', '7号机', '8号机', '9号机', '10号机'],
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false },
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#fff',
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: 'solid', //设置网格线类型 dotted：虚线   solid:实线
              width: 1,
              color: '#187FFF',
              opacity: '0.2',
            },
            show: true, //隐藏或显示
          },
        },
        series: [
          {
            name: '实际工作时长',
            type: 'bar',
            barWidth: '20%', //柱图宽度
            barGap: '0.3' /*多个并排柱子设置柱子之间的间距*/,
            barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
            data: [0, 300, 500, 460, 390, 540, 320],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: 'rgba(61, 252, 205, .3)' }, //柱图渐变色
                  { offset: 1, color: 'rgba(55, 214, 175, .3)' }, //柱图渐变色
                ]),
              },
            },
          },
          {
            name: '开机时长',
            type: 'bar',
            barWidth: '20%', //柱图宽度
            data: [0, 300, 500, 460, 390, 540, 320],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: 'rgba(35, 185, 255, .3)' }, //柱图渐变色
                  { offset: 1, color: 'rgba(35, 185, 255, .3)' }, //柱图渐变色
                ]),
              },
            },
          },
        ],
      })
    },
  },
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.frame {
  height: 100%;
  padding-top: 10px;
  border: 1px solid #04a3f7;
  box-sizing: border-box;
  box-shadow: 0 0 15px rgba(18, 97, 147, 0.5) inset;
}
// 小角标
.jiaobiao_box {
  &::before {
    position: absolute;
    left: 7px;
    top: -1px;
    width: 20px;
    height: 20px;
    border-top: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
    content: '';
  }
  &::after {
    position: absolute;
    right: 7px;
    top: -1px;
    width: 20px;
    height: 20px;
    border-top: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
    content: '';
  }
  .jiaobiao {
    width: 100%;
    &::before {
      position: absolute;
      left: 7px;
      bottom: -1px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-left: 3px solid #04a3f7;
      content: '';
    }
    &::after {
      position: absolute;
      right: 7px;
      bottom: -1px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-right: 3px solid #04a3f7;
      content: '';
    }
  }
}
// 大角标图片
.jiaobiaoImg_box {
  position: relative;
  &::before {
    position: absolute;
    left: -5px;
    top: -8px;
    width: 192px;
    height: 45px;
    background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
    background-size: 100% 100%;
    content: '';
    z-index: 2;
  }
  &::after {
    position: absolute;
    right: -81px;
    top: 69px;
    width: 192px;
    height: 45px;
    background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
    background-size: 100% 100%;
    transform: rotate(90deg);
    content: '';
    z-index: 2;
  }
  .jiaobiaoImg {
    width: 100%;
    &::before {
      position: absolute;
      left: -81px;
      bottom: 70px;
      width: 192px;
      height: 45px;
      background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
      background-size: 100% 100%;
      transform: rotate(270deg);
      content: '';
      z-index: 2;
    }
    &::after {
      position: absolute;
      right: -5px;
      bottom: -7px;
      width: 192px;
      height: 45px;
      background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
      background-size: 100% 100%;
      transform: rotate(180deg);
      content: '';
      z-index: 2;
    }
  }
}
.head_title {
  line-height: 40px;
  padding-left: 25px;
  font-size: 16px;
  color: white;
  background-size: 96% 100% !important;
}
.project_overview {
  width: 100%;
  height: auto;
  margin-top: 10px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  font-weight: 400;
  color: #ffffff;
  .project_top {
    height: 542px;
    display: flex;
    justify-content: flex-start;
    // 告警次数统计
    .warn {
      height: 100%;
      .warn_line {
        display: flex;
        justify-content: space-around;
        margin: 10px auto;
        width: 396px;
        height: 187px;
        background: url(../../../assets/digitalScreen-images/GantryCrane/warn_list_bg.png) no-repeat center bottom;
        .warn_list {
          position: relative;
          width: 124px;
          height: 149px;
          background: url(../../../assets/digitalScreen-images/GantryCrane/icon-normal.png) no-repeat;
          background-size: 100% 100%;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          p {
            margin: 7px 0;
            font-size: 28px;
            font-family: 'DS-Digital';
            color: #23fffc;
            line-height: 18px;
            letter-spacing: 2px;
          }
          .tittle {
            font-size: 16px;
            color: #fff;
            font-family: 'Microsoft YaHei';
          }
          .warn,
          .normal {
            width: 48px;
            height: 44px;
            position: absolute;
            top: 71px;
            left: 38px;
          }
          .warn {
            display: none;
          }
          &:hover {
            transform: scale(1.03);
            background: url(../../../assets/digitalScreen-images/GantryCrane/icon-warn.png) no-repeat;
            .normal {
              display: none;
            }
            .warn {
              display: block;
            }
            p {
              color: rgba(255, 218, 48, 1);
            }
            .tittle {
              color: #fff;
            }
          }
        }
      }
    }
    // 龙门吊图纸盒子
    .gantry_drawing {
      position: relative;
      width: 100%;
      height: 100%;
      //   background: rgba(255, 255, 255, 0.5);
      .drawing {
        width: 100%;
        height: 100%;
      }
      .bubble {
        position: absolute;
        top: 182px;
        left: 569px;
        width: 100px;
        height: auto;
        text-align: center;
        cursor: pointer;
        span {
          display: block;
          width: 100px;
          height: 37px;
          //   background: rgba(1, 23, 22, 0.7);
          background: rgba(1, 23, 22, 0.7);
          border-radius: 4px;
          line-height: 37px;
        }
        img {
          margin-top: 5px;
          width: 34px;
          height: 34px;
        }
      }
    }
    // 在场设备统计
    .head {
      position: relative;
      width: 100%;
      height: 100%;
      table {
        margin: 0 auto;
        border-collapse: separate;
        border-spacing: 0 5px;
        width: 92%;
        text-align: center;
        tr {
          height: 40px;
          background: rgba(48, 184, 255, 0.2);
          td {
            &:first-child {
              border-left: 4px solid rgba(48, 184, 255, 0.4);
            }
          }
          &:nth-child(2n) {
            background: rgba(48, 184, 255, 0.05);
          }
          &:nth-child(1) {
            background: rgba(48, 184, 255, 0);
            border: none;
            p {
              margin: 0;
              font-size: 14px;
              line-height: 14px;
            }
            td {
              &:first-child {
                border: none;
              }
            }
          }
        }
      }
      .more {
        position: absolute;
        right: 20px;
        bottom: 0;
        color: #30b8ff;
        cursor: pointer;
      }
    }
  }
  .project_bottom {
    margin-top: 20px;
    height: 300px;
    display: flex;
    justify-content: flex-start;
    // 告警趋势分析图表
    .analyse {
      width: 100%;
      height: 100%;
      .time_btn {
        width: 312px;
        margin: 0 auto;
        .ant-btn {
          width: 100px;
          height: 34px;
          background: rgba(48, 184, 255, 0.03);
          border: 1px solid rgba(48, 184, 255, 0.1);
          box-sizing: border-box;
          margin-left: 6px;
          color: rgba(255, 255, 255, 0.3);
          border-radius: 0;
          transition: all 0.5s ease-in-out;
          &:first-child {
            margin-left: 0;
          }
          &:hover {
            background: rgba(48, 184, 255, 0.1);
            border: 1px solid #30b8ff;
            color: #30b8ff;
            transform: scale(1.03);
          }
        }
      }
      #warn_echarts {
        margin-top: 10px;
        width: 100%;
        height: 188px;
      }
    }
    // 工作时长统计图表
    .duration {
      width: 100%;
      height: 100%;
      ul {
        float: left;
        margin-left: 40px;
        padding: 0;
        width: 150px;
        li {
          margin-top: 20px;
          width: 100%;
          height: 33.33%;
          img {
            float: left;
            margin: 8px 20px 0 0;
            width: 50px;
            height: 48px;
            transition: all 0.6s ease;
          }
          p {
            span {
              font-size: 24px;
              font-family: 'DS-Digital';
              color: #30fdff;
            }
          }
          &:first-child {
            margin-top: 0;
          }
          &:hover {
            img {
              transform: rotate(30deg);
            }
          }
        }
      }
      #duration_echarts {
        float: left;
        width: 1150px;
        height: 230px;
      }
    }
  }
}

// 左右两侧盒子弹窗
/deep/.warn_model {
  width: 1100px !important;
  height: 700px !important;

  .ant-modal-content {
    position: relative;
    padding: 0 47px 0 23px;
    width: 1100px;
    height: 700px;
    color: #fff;
    background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;
    background-size: 100% 100% !important;
    form {
      width: 1010px;
      height: 600px;
      position: relative;
      .serch {
        width: 1100px;
        margin: 30px 0 0 0;
        .name {
          margin-left: 60px;
        }
        // 下拉列表
        .ant-select-selection {
          width: 142px;
          background: #0c2041;
          border: 1px solid #1a3767;
          border-radius: 3px;
          color: #fff;
          .ant-select-arrow {
            color: #fff;
          }
        }
        // 日期选择框
        .ant-input {
          width: 250px;
          background: #0c2041;
          border: 1px solid #1a3767;
          border-radius: 3px;
          margin-right: 40px;
          color: #fff;
        }
        // 查询、重置按钮
        .ant-btn,
        .reset {
          width: 70px;
          height: 30px;
          margin-right: 10px;
          border: 1px solid #0587cf;
          border-radius: 3px;
          color: #0587cf;
          background: none;
          cursor: pointer;
        }
        .ant-btn:hover,
        .reset:hover {
          background: rgba(4, 163, 247, 1);
          color: #fff;
        }
      }
      // 在场设备统计弹窗距离调整
      .more_serch {
        .name {
          margin-left: 30px;
        }
        .export {
          display: inline-block;
          color: #0587cf;
          cursor: pointer;
        }
      }
      table {
        margin: 30px 0 0 15px;
        width: 983px;
        text-align: center;

        thead {
          width: 100%;
          height: 30px;
          background: rgba(4, 163, 247, 0.8);
        }
        tbody {
          width: 100%;
          overflow: hidden;
          tr {
            width: 100%;
            height: 38px;
            line-height: 30px;
          }
          tr:nth-child(2n + 2) {
            height: 42px;
            background: rgba(13, 35, 70, 0.8);
          }
        }
      }
      // 分页左文字
      .page_message {
        position: absolute;
        left: 18px;
        bottom: 24px;
        font-size: 14px;
        line-height: 40px;
        letter-spacing: 2px;
      }
      // 分页
      .down {
        text-align: right;
        position: absolute;
        right: 10px;
        bottom: 43px;
        .ant-pagination-item-ellipsis {
          color: #fff;
        }
        .ant-pagination-item,
        .ant-pagination-item-link {
          width: 40px;
          margin: 0;
          background: none;
          border: 1px solid #0486d0;
          border-radius: 0;
          color: rgba(4, 163, 247, 1) !important;
          transition: all 0.2s ease-in-out;
          &:hover {
            border: 1px solid #fff;
            box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
          }
        }
        .ant-pagination-item a {
          color: rgba(4, 163, 247, 1);
        }
        .ant-pagination-options-quick-jumper input {
          background: none;
          border: 1px solid #0486d0;
          border-radius: 0;
          color: rgba(4, 163, 247, 1);
        }
        .ant-pagination-jump-prev-custom-icon,
        .ant-pagination-jump-next-custom-icon {
          .ant-pagination-item-link {
            border: none;
            color: rgba(4, 163, 247, 1);
          }
        }
        .ant-pagination-prev,
        .ant-pagination-next {
          margin: 0;
        }
        .ant-pagination-item-active {
          background: #0486d0;
          border: 1px solid #0486d0;
          a {
            color: #fff;
          }
        }
      }
    }
  }
  // 关闭按钮
  .ant-modal-close {
    margin-top: 38px;
    margin-right: 2px;
    color: transparent;
    background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
    i {
      display: none;
    }
  }
}
// 中间龙门吊模型弹窗
/deep/.bubble_model {
  width: 1761px !important;
  height: 967px !important;
  .ant-modal-content {
    position: relative;
    padding: 0 47px 0 23px;
    width: 1761px;
    height: 967px;
    color: #fff;
    background: url(../../../assets/digitalScreen-images/GantryCrane/bubble_model_bg.png) no-repeat !important;
    background-size: 100% 100% !important;
    .left {
      position: absolute;
      left: 40px;
      width: 354px;
      height: 860px;
      border-right: 1px solid rgba(13, 35, 70, 1);
      img {
        width: 326px;
        height: 196px;
      }
      p {
        margin-top: 30px;
        line-height: 29px;
        span {
          color: rgba(230, 43, 43, 1);
          font-weight: 700;
        }
      }
      .ant-divider {
        min-width: 300px;
        margin: 30px auto 30px;
        background: rgba(13, 35, 70, 1);
      }
      .list_box {
        width: 330px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .list {
          margin-bottom: 10px;
          text-align: center;
          line-height: 42px;
          width: 160px;
          height: 42px;
          background: url(../../../assets/digitalScreen-images/GantryCrane/list_img1.png);
        }
        .list_warn {
          background: url(../../../assets/digitalScreen-images/GantryCrane/list_img2.png);
        }
      }
    }
    .right {
      position: absolute;
      right: 0;
      width: 1330px;
      height: 100%;
      .tittle {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 30px;
        margin-right: 30px;
        span {
          font-size: 12px;
          font-weight: 400;
          color: #04a3f7;
        }
      }
      .top {
        width: 100%;
        display: flex;
        .monitor {
          width: 700px;
          .monitor_box {
            width: 670px;
            display: flex;
            flex-flow: wrap;
            .monitor_list {
              position: relative;
              margin-bottom: 10px;
              width: 24%;
              height: 76px;
              background: rgba(0, 186, 255, 0.1);
              border-radius: 10px;
              transition: all 0.5s ease;
              img {
                position: absolute;
                top: 50%;
                left: 15px;
                transform: translateY(-50%);
              }
              P {
                margin: 9px 0 0 58px;
                display: inline-block;
                width: 102px;
                font-size: 12px;
                color: rgba(4, 163, 247, 1);
                text-align: center;
                line-height: 29px;
                span {
                  font-size: 14px;
                  font-weight: 700;
                  color: #efefef;
                }
              }
              &::before {
                content: '';
                width: 1px;
                height: 36px;
                background: #12355d;
                position: absolute;
                left: 57px;
                top: 21px;
              }
              &:not(:nth-child(4n)) {
                margin-right: calc(4% / 3);
              }
              &:hover {
                transform: scale(1.03);
                background: rgba(0, 186, 255, 0.2);
              }
            }
          }
        }
      }
      .bottom {
        margin-top: 20px;
        form {
            width: 98%;
            height: 460px;
        
        // 日期选择框
        .ant-input {
          width: 250px;
          background: #0c2041;
          border: 1px solid #1a3767;
          border-radius: 3px;
          margin-right: 40px;
          color: #fff;
        }
        // 查询、重置按钮
        .ant-btn,
        .reset {
          width: 70px;
          height: 30px;
          margin-right: 10px;
          border: 1px solid #0587cf;
          border-radius: 3px;
          color: #0587cf;
          background: none;
          cursor: pointer;
        }
        .ant-btn:hover,
        .reset:hover {
          background: rgba(4, 163, 247, 1);
          color: #fff;
        }
        table {
            padding: 0;
            margin: 0;
          width: 1291px;
          text-align: center;
          tr {
            height: 44px;
            line-height: 44px;
            &:nth-child(2n + 1) {
              height: 40px;
              line-height: 40px;
              background: rgba(13, 35, 70, 0.8);
            }
            &:first-child {
              height: 30px;
              line-height: 30px;
              background: rgba(4, 163, 247, 0.8);
            }
          }
        }
      }
      }
    }
  }
 
}
</style>