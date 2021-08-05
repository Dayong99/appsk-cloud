<template>
  <div class="frame right">
    <div class="angle top_left_angle"></div>
    <div class="angle top_right_angle"></div>
    <div class="angle bottom_left_angle"></div>
    <div class="angle bottom_right_angle"></div>
    <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
      台座
    </div>
    <div class="chart" ref="chart"></div>
    <div>
      <div style="color: #35d9e0; margin: 10px 0 0 20px">进度状况</div>
      <div>
        <div class="particulars" v-for="(item, index) in scheduleData" :key="index">
          <div style="border-bottom: 1px solid #1e385d; padding-bottom: 10px">
            <span style="background-color: rgb(25, 158, 216); border-radius: 2px; padding: 0 4px">{{
              item.state
            }}</span>
            <span style="margin-left: 10px">{{ item.name }}预制场{{ item.serialNumber }}预制台座</span>
          </div>
          <div style="overflow: hidden; margin-top: 10px">
            <div style="float: left">
              <p>桥孔编号：{{ item.number }}</p>
              <p>对应桥墩：{{ item.pier }}</p>
            </div>
            <div class="right_title" style="float: right">
              <p>理论跨径(cm): {{ item.span }}</p>
              <p>标准梁长(cm): {{ item.beamLength }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import defaultEcharts from '@/views/digitalScreen/girderFabricationYard/js/echartsSecondaryEncapsulation'
import eventVue from '../js/eventVue.js'

export default {
  name: 'GirderFabricationYardRight',
  components: {},
  props:{
      tenementId:String,
  },
  data() {
    return {
      options: {
        images: images,
      },
      chartData: [],
      scheduleData: [],
    }
  },
  created() {
    this.getProgressPlan()
    this.getChartData()
  },
  computed: {},
  mounted() {
    
  },
  watch: {
    chartData(val) {
      this.getLeftChart(val)
      this.transmitParameter(val)
    },
  },
  methods: {
    getChartData() {
      // 获取参数
      let that = this
      //1空闲 2使用中
      getAction('/beamyard/pedestalLedger/statusStatistics', this.tenementId).then((res) => {
        let data = res.result
        for (let i = 0; i < data.length; i++) {
          let any = {}
          if (data[i].status === '1') {
            any.value = data[i].total
            any.name = '空闲'
            that.chartData.push(any)
          } else {
            any.value = data[i].total
            any.name = '使用中'
            that.chartData.push(any)
          }
        }
      })
    },
    getLeftChart(val) {
      // 初始化echarts盒子
      let myChart = this.$echarts.init(this.$refs.chart)

      // 添加数据
      let char = defaultEcharts.getRightOption(val)
      myChart.setOption(char)
    },
    //进度状况
    getProgressPlan() {
      let that = this
      //请求参数
      let msg = {
        relTenantIds: this.tenementId,
        pageSize: 3,
        status: 1,
      }
      getAction('/beamyard/pedestalLedger/list', msg).then((res) => {
        let data = res.result.records
        for (let i = 0; i < data.length; i++) {
          let any = {}
          any.state = data[i].status_dictText
          any.name = data[i].prefabricatedSiteNumber
          any.serialNumber = data[i].prefabricatedPedestalNumber
          any.number = data[i].prefabricatedPedestalLength
          any.pier = data[i].prefabricatedPedestalWidth
          any.span = data[i].prefabricatedPedestalHeight
          any.beamLength = data[i].prefabricatedBeamType

          that.scheduleData.push(any)
        }
      })
    },
    //传递参数
    transmitParameter(val){
        eventVue.$emit("rightData",val)
    }
  },
}
</script>
<style scoped>
.right {
  width: 470px;
  height: 880px;
}
.frame_title {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #efefef;
  opacity: 1;
  padding: 20px 30px 10px 30px;
}
.chart {
  width: 420px;
  height: 300px;
  padding-top: 20px;
  margin-left: 20px;
  border-bottom: 1px solid #1e385d;
}
.particulars {
  width: 95%;
  color: #efefef;
  overflow: hidden;
  padding: 23px 30px 23px 20px;
  margin: 10px auto;
  border: 2px solid #1e385d;
  border-radius: 4px;
}
.particulars p {
  margin: 5.3px 0;
}
.right_title p {
  text-align: right;
}
.angle {
  position: absolute;
  width: 20px;
  height: 20px;
}
.top_left_angle {
  border-left: 3px solid #04a3f7;
  border-top: 3px solid #04a3f7;
  left: 0;
  top: 0;
}
.top_right_angle {
  border-right: 3px solid #04a3f7;
  border-top: 3px solid #04a3f7;
  right: 0;
  top: 0;
}
.bottom_left_angle {
  border-left: 3px solid #04a3f7;
  border-bottom: 3px solid #04a3f7;
  left: 0;
  bottom: 0;
}
.bottom_right_angle {
  border-right: 3px solid #04a3f7;
  border-bottom: 3px solid #04a3f7;
  right: 0;
  bottom: 0;
}
</style>