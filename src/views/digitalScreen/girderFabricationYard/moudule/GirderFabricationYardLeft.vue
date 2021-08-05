<template>
  <div class="frame left">
    <div class="angle top_left_angle"></div>
    <div class="angle top_right_angle"></div>
    <div class="angle bottom_left_angle"></div>
    <div class="angle bottom_right_angle"></div>
    <div>
      <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
        小箱梁
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
              <span style="margin-left: 10px">{{ item.name }}</span>
              <span style="float: right">{{ item.time }}</span>
            </div>
            <div style="overflow: hidden; margin-top: 10px">
              <div style="float: left">
                <p>桥孔编号：{{ item.number }}</p>
                <p>对应桥墩：{{ item.pier }}</p>
                <p>梁编号：{{ item.bridge }}</p>
                <p>中/边梁：{{ item.boundaryBeam }}</p>
              </div>
              <div class="right_title" style="float: right">
                <p>理论跨径(cm): {{ item.span }}</p>
                <p>标准梁长(cm): {{ item.beamLength }}</p>
                <p>预制梁长(cm): {{ item.predictLength }}</p>
                <p>砼方量（m³）：{{ item.concrete }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import images from '@/utils/Imgaes.js'
import defaultEcharts from '@/views/digitalScreen/girderFabricationYard/js/echartsSecondaryEncapsulation'
import eventVue from '../js/eventVue.js'

export default {
  name: 'GirderFabricationYardLeft',
  components: {},
  props: {
    tenementId: String,
  },
  data() {
    return {
      options: {
        images: images,
      },
      //接收参数
      charData: [],
      //渲染参数
      chartData: [
        // { value: 1048, name: '搜索引擎' },
        // { value: 735, name: '直接访问' },
        // { value: 580, name: '邮件营销' },
        // { value: 484, name: '联盟广告' },
        // { value: 300, name: '视频广告' },
      ],
      scheduleData: [],
    }
  },
  created() {
    this.getSmallBoxGirder()
    this.receiveParameter()
  },
  computed: {},
  watch: {
    charData(val) {
      for (let i = 0; i < val.length; i++) {
        let any = {}
        if (val[i].status != '待排产' && val[i].status != '完成出库') {
          any.value = val[i].total
          any.name = val[i].status
          this.chartData.push(any)
        }
      }
      this.getLeftChart(this.chartData)
    },
  },
  mounted() {},
  methods: {
    getLeftChart(data) {
      //初始化echarts盒子
      let myChart = this.$echarts.init(this.$refs.chart)
      // //添加数据
      let char = defaultEcharts.getLeftOption(data)
      myChart.setOption(char)
    },
    //获取小箱梁状态
    getSmallBoxGirder() {
      let that = this
      //请求参数
      let msg = {
        relTenantIds: this.tenementId,
        pageSize: 3,
      }
      getAction('/beamyard/structLedger/recentUpdates', msg).then((res) => {
        let data = res.result.records
        for (let i = 0; i < data.length; i++) {
          let any = {}
          any.state = data[i].structStatusSort_dictText
          any.name = data[i].bridgeName
          any.time = data[i].createTime
          any.number = data[i].bridgeHoleNumber
          any.pier = data[i].correspondingPierNumber
          any.bridge = data[i].beamNumber
          any.boundaryBeam = data[i].centerOrSideBeam
          any.span = data[i].theoreticalSpan
          any.beamLength = data[i].standardBeamLength
          any.predictLength = data[i].prefabricatedBeamLength
          any.concrete = data[i].concreteVolume
          that.scheduleData.push(any)
        }
      })
    },
    //接收参数
    receiveParameter() {
      eventVue.$on('middleData', (message) => {
        this.charData = message
      })
    },
  },
}
</script>
<style scoped>
.left {
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
  padding: 10px 30px 10px 20px;
  margin: 10px auto;
  border: 2px solid #1e385d;
  border-radius: 4px;
}
.particulars p {
  margin: 0;
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