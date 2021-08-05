<template>
  <div class="frame middle">
    <div class="angle top_left_angle"></div>
    <div class="angle top_right_angle"></div>
    <div class="angle bottom_left_angle"></div>
    <div class="angle bottom_right_angle"></div>
    <div
      class="frame_title"
      :style="'background: url(' + options.images.frameTitleLog + ') 15px bottom no-repeat'"
      style="width: 100%"
    >
      进度管理
    </div>
    <div class="schedule">
      <div class="schedule_num" v-for="(item, index) in dataStatistics" :key="index">
        <div class="bridge_icon" :style="'background: url(' + item.img + ') no-repeat'"></div>
        <p class="schedule_num_title">
          <countTo :startVal="startVal" :endVal="item.num" :duration="6000"></countTo>
          榀
        </p>
        <p class="schedule_num_message">
          {{ item.title }}
        </p>
      </div>
      <div class="long_string"></div>
      <div style="float: left">
        <div class="schedule_num_right" v-for="(item, index) in dataStatisticsRight" :key="index">
          <p class="schedule_num_title">
            <countTo :startVal="startVal" :endVal="item.num" :duration="8000"></countTo>
            榀
          </p>
          <p class="schedule_num_message">
            {{ item.title }}
          </p>
        </div>
      </div>
    </div>
    <div class="progress_message">
      <div class="progress_subject" v-for="(item, index) in dataSourceAchieve" :key="index">
        <a-progress
          class="progress_strip"
          :percent="item.proportion"
          :showInfo="false"
          status="active"
          :strokeColor="progressColor"
        />
        <p style="float: right; color: #ffffff; margin: 0; padding-top: 2px">{{ item.title }}</p>
        <p class="progress_num">{{ item.num }}榀</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import defaultEcharts from '@/views/digitalScreen/girderFabricationYard/js/echartsSecondaryEncapsulation'
import countTo from 'vue-count-to'
import eventVue from '../js/eventVue.js'

export default {
  name: 'GirderFabricationYardMiddle',
  components: {
    countTo,
  },
  props: {
    tenementId: String,
  },
  data() {
    return {
      options: {
        images: images,
      },
      //施工总数
      constructionNum: null,
      //待排产
      productionSchedulingNum: null,
      //已完成
      completedNum: null,
      //总计划
      masterPlanNum: null,
      //进度条开始数量
      startVal: 0,
      dataStatistics: [
        {
          title: '总计划',
          num: 124,
          img: require('@/assets/digitalScreen-images/bridgeIcon1.png'),
        },
        {
          title: '待排产',
          num: 124,
          img: require('@/assets/digitalScreen-images/bridgeIcon2.png'),
        },
        {
          title: '施工中',
          num: 124,
          img: require('@/assets/digitalScreen-images/bridgeIcon3.png'),
        },
        {
          title: '已完成',
          num: 124,
          img: require('@/assets/digitalScreen-images/bridgeIcon4.png'),
        },
      ],
      //接收参数
      iconData:[],
      //渲染
      dataStatisticsRight: [
        {
          title: '空闲台座',
          num: 12,
        },
        {
          title: '使用中台座',
          num: null,
        },
      ],
      //接收数据参数
      dataSource: [],
      //渲染数据参数
      dataSourceAchieve: [],
      //
      progressColor: {
        '0%': '#09AEDB',
        '50%': '#05C3B8',
      },
    }
  },
  created() {
    this.getSmallBoxGirder()
    this.receiveParameter()
  },
  computed: {},
  watch: {
    dataSource(val) {
      //先获取数据
      for (let i = 0; i < val.length; i++) {
        if (val[i].status === '待排产') {
          this.productionSchedulingNum = val[i].total
        }
        if (val[i].status === '完成出库') {
          this.completedNum = val[i].total
        }
      }
      //获得总数
      this.masterPlanNum = this.productionSchedulingNum + this.completedNum + this.constructionNum
      //添加图标下各数据
      for (let y = 0; y < this.dataStatistics.length; y++) {
        this.dataStatistics[0].num = this.masterPlanNum
        this.dataStatistics[1].num = this.productionSchedulingNum
        this.dataStatistics[2].num = this.constructionNum
        this.dataStatistics[3].num = this.completedNum
      }

      this.applyColoursDrawing(val)

      this.transmitParameter(val)
    },
    iconData(val){
        for (let i = 0; i < val.length; i++) {
            if(val[i].name === '空闲'){
                this.dataStatisticsRight[i].num = val[i].value
            } else if(val[i].name === '使用中'){
                this.dataStatisticsRight[i].num = val[i].value
            }
            
        }
    },
  },
  methods: {
    //获得施工参数
    getSmallBoxGirder() {
      let that = this
      let data = {
        relTenantIds: this.tenementId,
      }
      getAction('beamyard/structLedger/progressView', data).then((res) => {
        this.dataSource = res.result.list
        this.constructionNum = res.result.constructionCount
      })
    },
    //求百分比
    getPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0
    },
    //施工总数获得百分比渲染进度条
    applyColoursDrawing(val) {
      for (let x = 0; x < val.length; x++) {
        let any = {}
        let per = null;
        let total = this.masterPlanNum
        if(val[x].status != "待排产" && val[x].status != "完成出库"){
            per = this.getPercent(val[x].total, this.constructionNum)
        } else {
            per = this.getPercent(val[x].total, total)
        }
        any.title = val[x].status
        any.num = val[x].total
        any.proportion = per
        this.dataSourceAchieve.push(any)
      }
    },
    //接收参数
    receiveParameter() {
      eventVue.$on('rightData', (message) => {
        this.iconData = message;
      })
    },
    //传递参数
    transmitParameter(val){
        eventVue.$emit("middleData",val)
    }
  },
}
</script>
<style lang="less" scoped>
.middle {
  width: 880px;
  height: 880px;
  margin: 0 15px 0;
}
.frame_title {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #efefef;
  opacity: 1;
  padding: 20px 30px 10px 30px;
}
.schedule {
  overflow: hidden;
  margin: 37px 45px 40px 45px;
}
.schedule_num {
  float: left;
  margin-right: 48px;
  text-align: center;
}
.schedule_num_title {
  margin: 15px 0 0 0;
  font-size: 25px;
  color: #3aecf2;
}
.schedule_num_message {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #ffffff;
}
.bridge_icon {
  width: 82px;
  height: 77px;
}
.long_string {
  float: left;
  height: 100px;
  width: 1px;
  background-color: #04a3f7;
  margin: 26px 0 0 0;
  /* border: 1px solid #04A3F7; */
}
.schedule_num_right {
  float: left;
  text-align: center;
  margin-left: 60px;
  margin-top: 20px;
}
.progress_message {
  width: 788px;
  margin: auto;
}
.progress_subject {
  overflow: hidden;
  margin-top: 10px;
}
.progress_num {
  color: #ffffff;
  font-size: 16px;
  float: right;
  width: 50px;
  margin: 2px 640px 0 0;
}
.progress_strip {
  float: right;
  width: 88%;
  margin-left: 20px;
}
.progress_strip {
  & /deep/ .ant-progress-inner {
    height: 10px;
    background-color: #013854;
  }
}
.progress_strip {
  & /deep/ .ant-progress-inner .ant-progress-bg {
    height: 10px !important;
  }
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