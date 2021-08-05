<template>
  <div class="project_overview">
    <a-row class="project_top" :gutter="16">
      <a-col :span="5">
        <div class="top_info_intro">
          <div class="press frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              在场设备
            </p>
            <div class="equipmentList">
              <div class="equipment" v-for="(item, index) in deviceMaintainList" :key="index">
                <!-- <img :src="item.icon" alt=""> -->
                <img :src="item.icon ? item.icon : ''" alt :onerror="defaultImg" />
                <!-- <img src="../../../assets/digitalScreen-images/sjj.png" alt=""> -->
                <p>
                  {{ item.typeName }} <span>{{ item.count }}</span> 个
                </p>
              </div>
            </div>
            <div id="onlineUnit"></div>
          </div>
          <div class="message frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              设备维保次数
            </p>
            <div id="deviceStatistics"></div>
          </div>
        </div>
      </a-col>

      <a-col :span="19">
        <div class="top_weather_team">
          <div class="weather frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
            <div class="equipmentUpkeep_top">
              <div class="equipmentUpkeep">
                <div id="equipmentUpkeep1"></div>
                <div class="equipmentUpkeep_message">
                  <p>
                    已保养&nbsp;<span>{{ maintainCount }}</span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未保养&nbsp;<span>{{ noMaintainCount }}</span>
                  </p>
                </div>
              </div>
              <div class="equipmentUpkeep">
                <div id="equipmentUpkeep2"></div>
                <div class="equipmentUpkeep_message">
                  <p>
                    已检查&nbsp;<span>{{ checkCount }}</span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未检查&nbsp;<span>{{ noCheckCount }}</span>
                  </p>
                </div>
              </div>
              <div class="equipmentUpkeep">
                <div id="equipmentUpkeep3"></div>
                <div class="equipmentUpkeep_message">
                  <p>
                    正常&nbsp;<span>{{ normalCount }}</span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;停用&nbsp;<span>{{ disableCount }}</span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;待维修&nbsp;<span>{{ repairCount }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="equipmentUpkeep_bottom">
              <div class="equipmentUpkeep_btn">
                <a-button
                  v-for="(item, index) of deviceBtn"
                  :key="index"
                  @click="switchdevice(item.id, index)"
                  :class="selectedPress == index ? 'active' : ''"
                  :disabled="selectedPress == index ? true : false"
                  >{{ item.txt }}</a-button
                >
              </div>
              <table>
                <tr>
                  <th>设备名称</th>
                  <th>设备编号</th>
                  <th>设备位置</th>
                  <th>指定操作人</th>
                  <th>设备运行状态</th>
                  <th>维保记录</th>
                </tr>
                <tr v-for="(item, index) in deviceList" :key="index">
                  <td>{{ item.deviceName }}</td>
                  <td>{{ item.deviceNumber }}</td>
                  <td>{{ item.deviceLocation }}</td>
                  <td>{{ item.operator_dictText }}</td>
                  <td>{{ item.deviceRunStatus_dictText }}</td>
                  <td>查看</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress } from '@/api/manage'
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
      selectedPress: 0,
      deviceList: '',
      deviceMaintainList: [
        {
          typeName: '压力机',
          count: 12,
          icon: '',
        },
      ],
      deviceChartList: [
        {
          value: '',
          name: '',
        },
      ],
      deviceMaintainEcharts: [
        {
          value: '',
        },
      ],
      deviceMaintainEcharts2: [],
      deviceList: [
        {
          deviceTypeId_dictText: '',
          operator_dictText: '',
          deviceName: '',
          deviceNumber: '',
          operator: '',
          deviceRunStatus_dictText: '',
          remarks: '',
          deviceLocation: '',
          id: '',
        },
      ],
      deviceBtn: [{ id: '', txt: '' }],
      deviceMaintain: [
        {
          value: '',
          name: '',
        },
      ],
      noMaintainCount: '',
      maintainCount: '',
      deviceInspection: [
        {
          value: '',
          name: '',
        },
      ],
      checkCount: '',
      noCheckCount: '',
      deviceDetails: [
        {
          value: '',
          name: '',
        },
      ],
      repairCount: '',
      disableCount: '',
      normalCount: '',
    }
  },
  mounted() {
    this.checkMenu()
    this.drawLine()
    this.deviceStatistics()
    this.getdeviceMaintain()
    this.getdeviceList()
    this.getdeviceBtn()
    this.getdeviceMaintainRight()
  },
  computed: {
    defaultImg() {
      return 'this.src="' + require('@/assets/digitalScreen-images/mr.png') + '"'
    },
  },
  methods: {
    checkMenu() {
      let arr = this.$store.state.enhance.menuList
      let path = this.$route.path
      arr.forEach((value, index) => {
        if (value.url == path) {
          this.currentIndex = value.index
        }
      })
      this.$store.commit('dsHeadIndex', this.currentIndex)
    },
    //   在场设备统计
    deviceStatistics() {
      getAction('/deviceManage/device/countType', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.result
          if (this.deviceMaintainList.length > 0) {
            this.deviceMaintainList.splice(0, this.deviceMaintainList.length)
          }
          if (this.deviceChartList.length > 0) {
            this.deviceChartList.splice(0, this.deviceChartList.length)
          }
          data.forEach((value, index) => {
            this.deviceMaintainList.push({
              typeName: value.typeName,
              count: value.count,
              icon: value.icon,
            })

            this.deviceChartList.push({
              value: value.count,
              name: value.typeName,
            })
          })
          this.drawLine1()
        }
      })
    },
    //   设备维保次数统计
    getdeviceMaintain() {
      getAction('/deviceMaintain/maintainRecord/numberCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.result
          if (this.deviceMaintainEcharts.length > 0) {
            this.deviceMaintainEcharts.splice(0, this.deviceMaintainEcharts.length)
          }
          if (this.deviceMaintainEcharts2.length > 0) {
            this.deviceMaintainEcharts2.splice(0, this.deviceMaintainEcharts2.length)
          }
          data.forEach((value, index) => {
            this.deviceMaintainEcharts.push({ value: value.count })
            this.deviceMaintainEcharts2.push(value.device_name)
          })
          this.drawLine2()
        }
      })
    },
    //  设备状态统计
    getdeviceMaintainRight() {
      getAction('/deviceMaintain/maintainDevice/statusCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.result
          if (this.deviceMaintain.length > 0) {
            this.deviceMaintain.splice(0, this.deviceMaintain.length)
          }
          let maintain = data.maintain
          this.deviceMaintain = [
            { value: maintain.maintain, name: '已保养' },
            { value: maintain.noMaintain, name: '未保养' },
          ]
          this.maintainCount = maintain.maintain
          this.noMaintainCount = maintain.noMaintain
          if (this.deviceInspection.length > 0) {
            this.deviceInspection.splice(0, this.deviceInspection.length)
          }
          let inspection = data.inspection
          this.deviceInspection = [
            { value: inspection.check, name: '已检查' },
            { value: inspection.noCheck, name: '未检查' },
          ]
          this.checkCount = inspection.check
          this.noCheckCount = inspection.noCheck
          if (this.deviceDetails.length > 0) {
            this.deviceDetails.splice(0, this.deviceDetails.length)
          }
          let device = data.device
          this.deviceDetails = [
            { value: device.awaitingRepair, name: '待维修' },
            { value: device.disable, name: '停用' },
            { value: device.normal, name: '正常' },
          ]
          this.repairCount = device.awaitingRepair
          this.disableCount = device.disable
          this.normalCount = device.normal
          this.drawLine()
        }
      })
    },
    //   设备维保列表信息
    getdeviceBtn() {
      getAction('/deviceMaintain/maintainDevice/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          this.deviceBtn.splice(0, this.deviceBtn.length)
          let data = res.result.records
          data.forEach((value, index) => {
            this.deviceBtn.push({ id: value.id, txt: value.deviceName })
          })
          this.getdeviceList(this.deviceBtn[0].id)
        }
      })
    },
    switchdevice(id, index) {
      this.selectedPress = index
      this.getdeviceList(id)
    },
    getdeviceList(id) {
      getAction('/deviceMaintain/maintainDevice/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        id: id,
      }).then((res) => {
        if (res.code == 200) {
          if (this.deviceList.length > 0) {
            this.deviceList.splice(0, this.deviceList.length)
          }
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((item, idnex) => {
              this.deviceList.push({
                deviceTypeId_dictText: item.deviceTypeId_dictText,
                operator_dictText: item.operator_dictText,
                deviceName: item.deviceName,
                deviceNumber: item.deviceNumber,
                operator: item.operator,
                deviceRunStatus_dictText: item.deviceRunStatus_dictText,
                remarks: item.remarks,
                deviceLocation: item.deviceLocation,
                id: item.id,
              })
            })
            this.pressData = this.deviceList[0]
            this.deviceList.splice(5)
          }
        }
      })
    },
    drawLine1() {
      let onlineUnit = this.$echarts.init(document.getElementById('onlineUnit'))
      onlineUnit.setOption({
        color: [
          'rgba(64, 127, 255, 1)',
          'rgba(242, 83, 77, 1)',
          'rgba(242, 199, 97, 1)',
          'rgba(242, 153, 97, 1)',
          'rgba(0, 204, 205, 1)',
        ],
        tooltip: {
          trigger: 'item',
        },
        grid: {
          left: '-100',
          top: '30',
          bottom: '10',
          containLabel: true,
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          top: 'middle',
          left: '65%',
          itemGap: 10,
          textStyle: {
            color: '#fff',
            fontSize: '14',
          },
          formatter: (name) => {
            return name
          },
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: ['45%', '68%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: '400',
                formatter: '{b}\n{d}%',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.deviceChartList,
          },
        ],
      })
    },
    drawLine2() {
      let deviceStatistics = this.$echarts.init(document.getElementById('deviceStatistics'))

      deviceStatistics.setOption({
        // color: ["#2f89cf"],
        title: {
          subtext: '(次)',
          x: '0',
          y: '-5',
          subtextStyle: {
            //副标题文本样式{"color": "#aaa"}
            fontFamily: 'Arial, Verdana, sans...',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        // 修改图表的大小
        grid: {
          left: '3%',
          top: '15%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.deviceMaintainEcharts2,
            // 修改刻度标签 相关样式
            axisLabel: {
              interval: 0, //强制显示文字
              color: 'rgba(75, 113, 134, 1) ',
              fontSize: '12',
            },
            // 不显示x坐标轴的样式
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            // 修改刻度标签 相关样式
            axisLabel: {
              color: 'rgba(75, 113, 134, 1) ',
              fontSize: 12,
            },
            // y轴的线条改为了 2像素
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            // y轴分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(73, 217, 254, 0.05)',
              },
            },
          },
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '35%',
            data: this.deviceMaintainEcharts,
            barWidth: 20, //柱图宽度
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: 'rgba(9, 174, 219, 1)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(5, 195, 184, 1)', // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
          },
        ],
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例

      let equipmentUpkeep1 = this.$echarts.init(document.getElementById('equipmentUpkeep1'))
      equipmentUpkeep1.setOption({
        color: ['#32C54E', '#F29961'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '设备保养',
            type: 'pie',
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            // roseType: "radius",
            // 图形的文字标签
            label: {
              fontSize: 14,
            },
            // 链接图形和文字的线条
            labelLine: {
              // length 链接图形的线条
              length: 20,
              // length2 链接文字的线条
              length2: 20,
            },
            data: this.deviceMaintain,
          },
        ],
      })
      let equipmentUpkeep2 = this.$echarts.init(document.getElementById('equipmentUpkeep2'))
      equipmentUpkeep2.setOption({
        color: ['#407FFF', '#00CCCD'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '设备检查',
            type: 'pie',
            center: ['50%', '50%'],
            // roseType: "radius",
            // 图形的文字标签
            label: {
              fontSize: 14,
            },
            // 链接图形和文字的线条
            labelLine: {
              // length 链接图形的线条
              length: 20,
              // length2 链接文字的线条
              length2: 20,
            },
            data: this.deviceInspection,
          },
        ],
      })
      let equipmentUpkeep3 = this.$echarts.init(document.getElementById('equipmentUpkeep3'))
      equipmentUpkeep3.setOption({
        color: ['#F2534D', '#999999', '#666'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '设备统计',
            type: 'pie',
            center: ['50%', '50%'],
            // roseType: "radius",
            // 图形的文字标签
            label: {
              fontSize: 14,
            },
            // 链接图形和文字的线条
            labelLine: {
              // length 链接图形的线条
              length: 20,
              // length2 链接文字的线条
              length2: 20,
            },
            data: this.deviceDetails,
          },
        ],
      })
    },
  },
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
.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
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
      .press {
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 545px;
        .equipmentList {
          padding-top: 30px;
          width: 100%;
          height: 260px;
          border-bottom: 1px solid rgba(30, 56, 93, 1);
          overflow-x: hidden;
          .equipment {
            float: left;
            width: 33%;
            height: 120px;
            text-align: center;
            color: #fff;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            transition: all 0.3s; //设置动画执行的时间为0.3s
            p {
              // margin-top: 10px;
              span {
                font-size: 21px;
                color: rgba(0, 204, 205, 1);
                font-weight: 400;
              }
            }
          }
          .equipment:hover {
            transform: scale(1.1); /* 放大1.2倍 */
          }
        }
        #onlineUnit {
          margin-top: 10px;
          width: 100%;
          height: 220px;
        }
      }
      .equipmentList::-webkit-scrollbar {
        width: 2px;
      }
      .equipmentList::-webkit-scrollbar-thumb {
        border-radius: 5px;
        /* background: rgb(31, 143, 255, .5); */
        background: #0a2b60;
      }
      .equipmentList::-webkit-scrollbar-track {
        border-radius: 5px;
        background: none;
      }
      .message {
        margin-top: 15px;
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 305px;
        #deviceStatistics {
          margin-top: 10px;
          width: 100%;
          height: 230px;
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
    top: -2px;
    left: -2px;
    border-top: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
  }
  .top_right_icon {
    top: -2px;
    right: -2px;
    border-top: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
  }
  .bottom_left_icon {
    bottom: -2px;
    left: -2px;
    border-bottom: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
  }
  .bottom_right_icon {
    bottom: -2px;
    right: -2px;
    border-bottom: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
  }

  .head_title {
    line-height: 40px;
    padding-left: 20px;
    padding-top: 5px;
    font-size: 16px;
    color: white;
    background-size: 96% !important;
  }

  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    padding-top: 0px;
    opacity: 0.9;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }
}
.top_weather_team {
  width: 100%;
  .weather {
    position: relative;
    color: white;
    height: 864px;
    .equipmentUpkeep_top {
      width: 100%;
      height: 380px;
      .equipmentUpkeep {
        float: left;
        width: 33.33%;
        height: 377px;
        #equipmentUpkeep1 {
          width: 100%;
          height: 306px;
        }
        #equipmentUpkeep2 {
          width: 100%;
          height: 306px;
        }
        #equipmentUpkeep3 {
          width: 100%;
          height: 306px;
        }
        .equipmentUpkeep_message {
          width: 267px;
          height: 50px;
          margin: 0 auto;
          background: url(../../../assets/digitalScreen-images/equipmentUpkeep_message_bg.png);
          p {
            text-align: center;
            line-height: 50px;
            color: #fff;
            font-size: 16px;
            span {
              font-size: 21px;
              color: rgba(0, 204, 205, 1);
            }
          }
        }
      }
    }
    .equipmentUpkeep_bottom {
      margin-left: 2%;
      width: 96%;
      .equipmentUpkeep_btn {
        width: 100%;
        height: 31px;
        border-bottom: 1px solid #224d99;
        .ant-btn {
          width: 100px;
          height: 30px;
          margin-right: 10px;
          border: none;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: url(../../../assets/digitalScreen-images/topbtn2.png) no-repeat bottom;
          border-radius: 0;
          transition: all 0.3s; //设置动画执行的时间为0.3s
        }
        .ant-btn:hover {
          transform: scale(1.1); /* 放大1.1倍 */
        }
        .ant-btn.active {
          background: url(../../../assets/digitalScreen-images/topbtn1.png) no-repeat bottom;
        }
      }
      table {
        margin-top: 20px;
        width: 100%;
        font-size: 14px;
        font-family: 'Microsoft YaHei';
        font-weight: 400;
        color: #dedede;
        text-align: center;
        line-height: 35px;
        tr {
          th {
            height: 35px;
            width: 16.66%;
          }
          td {
            height: 43px;
            width: 16.66%;
          }
        }
        tr:nth-child(2n + 1) {
          background: rgba(13, 35, 70, 0.8);
        }
        tr:first-child {
          background: rgba(4, 163, 247, 0.8);
        }
      }
    }
  }
}
li {
  list-style: none;
}
</style>