<template>
  <div>
    <div class="frame quality_left">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
        隐患类型分析
      </div>
      <div class="pie common_chart_danger" ref="leftChart"></div>
    </div>
    <div class="frame quality_middle">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div
        class="frame_title"
        :style="'background: url(' + options.images.frameTitleLog + ') 15px bottom no-repeat'"
        style="width: 100%"
      >
        质量安全统计分析
      </div>
      <div class="line common_chart" ref="middleChart" style="width: 100%"></div>
    </div>
    <div class="frame quality_right">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
        质量问题分析
      </div>
      <div class="pie common_chart" ref="rightChart"></div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import images from '@/utils/Imgaes.js'
import defaultEcharts from '@/views/digitalScreen/qualityAndSafety/js/echartsSecondaryEncapsulation'

export default {
  name: 'QualityAndSafety',
  components: {},
  props: {
    tenementId: String,
  },
  data() {
    return {
      options: {
        images: images,
      },
      leftData: [],
      middleData: [
        {
          name: '质量',
          type: 'line',
          data: [],
        },
        {
          name: '安全',
          type: 'line',
          data: [],
        },
      ],
      middleTime: [],
      rightData: [],
    }
  },
  created() {
    this.getLeftChartData()
    this.getMiddleChartData()
    this.getRightChartData()
  },
  computed: {},
  watch: {
    leftData(val) {
      this.getLeftChart(val)
    },
    middleTime(val) {
      this.getMiddleChart(val)
    },
    rightData(val) {
      this.getRightChart(val)
    },
  },
  mounted() {

  },
  methods: {
    //隐患类型分析
    getLeftChart(val) {
      //初始化echarts盒子
      let myChart = this.$echarts.init(this.$refs.leftChart)
      // //添加数据
      let char = defaultEcharts.getLeftOption(val)
      myChart.setOption(char)
    },
    getLeftChartData() {
      getAction('/sys/qualitySafety/safeCountByType', {relTenantIds : this.tenementId}).then((res) => {
        let data = res.result
        for (let i = 0; i < data.length; i++) {
          let any = {}
          any.value = data[i].total
          any.name = data[i].text
          this.leftData.push(any)
        }
      })
    },
    //质量安全统计分析
    getMiddleChart(time) {
      let myChart = this.$echarts.init(this.$refs.middleChart)
      let char = defaultEcharts.getMiddleOption(this.middleData, time)
      myChart.setOption(char)
    },
    getMiddleChartData() {
      getAction('/sys/qualitySafety/qualitySafeCount', {relTenantIds : this.tenementId}).then((res) => {
        let data = res.result
        // console.log(data)
        let time = []
        for (let i = 0; i < data.length; i++) {
          this.middleData[0].data.push(data[i].qualityValue)
          this.middleData[1].data.push(data[i].safeValue)
          time.push(data[i].inspectTime)
          // this.middleTime.push(data[i].inspectTime)
        }
        this.middleTime = time;
      })
    },
    //质量问题分析
    getRightChart(val) {
      let myChart = this.$echarts.init(this.$refs.rightChart)
      let char = defaultEcharts.getRightOption(val)
      myChart.setOption(char)
    },
    getRightChartData() {
      getAction('/sys/qualitySafety/qualityCountByType', {relTenantIds : this.tenementId}).then((res) => {
        let data = res.result
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          let any = {}
          any.value = data[i].total
          any.name = data[i].text
          this.rightData.push(any)
        }
      })
    },
  },
}
</script>
<style scoped>
.frame {
  position: relative;
  height: 370px;
  margin-top: 10px;
  background-color: #061630;
  border: 1px solid #255a8b;
  opacity: 0.9;
  float: left;
}
.frame_title {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #efefef;
  opacity: 1;
  padding: 20px 30px 10px 30px;
}
.quality_left {
  width: 470px;
}
.common_chart {
  width: 400px;
  height: 300px;
  padding-top: 20px;
  padding-left: 20px;
}
.common_chart_danger {
  width: 450px;
  height: 280px;
  padding-top: 70px;
  padding-left: 20px;
}
.pie {
  margin: 12px 0 0 20px;
}
.line{
  padding-right:20px
}
.quality_middle {
  width: 880px;
  margin-left: 15px;
  margin-right: 15px;
  overflow: hidden;
}

.quality_right {
  width: 470px;
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