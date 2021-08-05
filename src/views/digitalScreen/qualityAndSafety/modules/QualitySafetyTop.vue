<template>
  <div>
    <div class="frame quality_left">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
        安全整改动态
      </div>
      <div>
        <div v-for="(item, index) in safetyData" :key="index" class="frame_bulletinboard">
          <div class="img_bd">
            <img :src="item.img" class="bulletinboard_img" />
          </div>

          <div class="bulletinboard_text">
            <p style="-webkit-box-orient: vertical">{{ item.content }}</p>
            <span>{{ item.time }}</span>
            <div
              class="bulletinboard_button"
              :class="item.state === '已验收' ? 'status_on' : 'status_off'"
              @click="popupAccording(index, item.orderType)"
            >
              {{ item.state }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="frame quality_middle">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div
        class="quality_middle_title frame_title"
        :style="'background: url(' + options.images.frameTitleStrip + ') right 32px no-repeat'"
        style="border-bottom: 1px solid #255a8b; padding-left: 0"
      >
        <p
          class="frame_title_plan"
          v-for="(item, index) in planText"
          :key="index"
          @click="getPlanStatus(index)"
          :class="planStatus === index ? 'plan_on' : 'plan_off'"
        >
          {{ item }}
        </p>
      </div>
      <div class="plan_table">
        <div v-for="(item,index) in planTopList" :key="index">
          <a-table
            class="plan_table_info"
            :title="tbleTopTime"
            :columns="columns"
            :dataSource="item.planTopData"
            :pagination="false"
            :scroll="{ scrollToFirstRowOnChange: true }"
          >
          </a-table>
        </div>
        <!-- <div>
          <a-table
            class="plan_table_info"
            :title="tbleBottomTime"
            :columns="columns"
            :dataSource="planBottomData"
            :pagination="false"
            :scroll="{ scrollToFirstRowOnChange: true }"
          >
          </a-table>
        </div> -->
      </div>
    </div>
    <div class="frame quality_right">
      <div class="angle top_left_angle"></div>
      <div class="angle top_right_angle"></div>
      <div class="angle bottom_left_angle"></div>
      <div class="angle bottom_right_angle"></div>
      <div class="frame_title" :style="'background: url(' + options.images.frameTitle + ') 15px bottom no-repeat'">
        质量整改动态
      </div>
      <div>
        <div>
          <div v-for="(item, index) in qualityData" :key="index" class="frame_bulletinboard">
            <div class="img_bd">
              <img :src="item.img" class="bulletinboard_img" />
            </div>

            <div class="bulletinboard_text">
              <p style="-webkit-box-orient: vertical">{{ item.content }}</p>
              <span>{{ item.time }}</span>
              <div
                class="bulletinboard_button"
                :class="item.state === '已验收' ? 'status_on' : 'status_off'"
                @click="popupAccording(index, item.orderType)"
              >
                {{ item.state }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="popup" class="popup" :style="'background: url(' + options.images.qualityPopup + ') no-repeat'">
      <div class="popup_title">
        <p>{{popupTitle}}</p>
        <div
          class="popup_close"
          :style="'background: url(' + options.images.closeWindow + ') no-repeat'"
          @click="popupClose"
        ></div>
      </div>
      <div class="abarbeitung">
        <a-timeline class="time_line">
          <a-timeline-item class="line" v-for="(item, index) in dataPopup" :key="index">
            <p
              style="color: rgba(7, 149, 222, 1); margin: 5px 0; padding: 1px 10px 0px 25px"
              :style="'background: url(' + options.images.popupBackground + ') left no-repeat'"
            >
              {{ item.time }}
            </p>
            <p style="color: rgba(7, 149, 222, 1); font-size: 16px">{{ item.type }}</p>
            <p v-for="(res, idx) in item.data" :key="idx">{{ res }}</p>
            <img v-if="item.img" :src="item.img" alt="" class="line_img" />
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import images from '@/utils/Imgaes.js'
import moment from 'moment'

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
      popup: false,
      popupTitle:'',
      planText: ['安全巡检计划', '质量巡检计划'],
      //计划状态
      planStatus: 0,
      //表头
      columns: [
        {
          title: '巡检人',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '巡检地点',
          align: 'center',

          dataIndex: 'place',
        },
        {
          title: '巡检内容',
          align: 'center',

          dataIndex: 'content',
        },
      ],
      //表数据
      planTopList: [],
      // planTopData: [],
      planBottomData: [],
      tableTopTime: null,
      tableBottomTime: null,
      //存储安全质量数据
      gainSafetyData: [],
      gainQualityData: [],
      //安全动态数据
      safetyData: [],
      //质量动态数据
      qualityData: [],
      //弹窗详情
      dataPopup: [
        // {
        //   type: '发现安全问题',
        //   time: '2020-08-21',
        //   data: [
        //     '问题部位：外墙安全网',
        //     '问题分类：高空坠落',
        //     '问题描述：外墙安全网破损',
        //     '检查人：张海虹',
        //     '责任人：张伟明',
        //     '整改期限：2020-09-02',
        //     '整改状态：已验收',
        //     '附件：',
        //   ],
        //   img: require('@/assets/digitalScreen-images/cs-title.jpg'),
        // },
        // {
        //   type: '整改回复',
        //   time: '2020-09-02',
        //   data: ['整改人：李文', '整改时间：', '是否超时：是', '整改描述：外墙安全网已经修复', '附件：'],
        //   img: require('@/assets/digitalScreen-images/cs-title.jpg'),
        // },
        // {
        //   type: '验收回复',
        //   time: '2020-09-03',
        //   data: ['验收人：任志军', '验收时间：2020-09-03', '审核状态：合格', '审核描述：验收合格'],
        // },
      ],
    }
  },
  created() {
    this.getPlanStatus(0), this.getDynamicData()
  },
  computed: {},

  methods: {
    //获取状态渲染表单数据
    getPlanStatus(num) {
      //头部状态
      this.planStatus = num
      //定义请求参数
      let planType = null
      if (this.planStatus === 0) {
        planType = 1
      } else if (this.planStatus === 1) {
        planType = 0
      }
      let data = {
        orderType: planType,
        relTenantIds: this.tenementId,
      }
      if(this.planTopList.length>0){
        this.planTopList.splice(0,this.planTopList.length)
      }
      getAction('/sys/planMain/queryPlanSubListApp', data).then((res) => {
        let data = res.result.records
        // console.log(data)
        //inspectionAddr巡检地点 inspectionContent巡检内容
        for (let i = 0; i < data.length; i++) {
          let message = []
          for (let y = 0; y < data[i].planSubList.length; y++) {
            let subtabulation = {}
            subtabulation.name = data[i].planSubList[y].inspector_dictText
            subtabulation.place = data[i].planSubList[y].inspectionAddr
            subtabulation.content = data[i].planSubList[y].inspectionContent
            subtabulation.time = data[i].planStartTime
            message.push(subtabulation)
          }
          this.planTopList.push({
            time:data[i].planStartTime,
            planTopData:message
          })
        }
        // console.log(this.planTopList);
        // this.tableTopTime = tableTime.time
        // this.tableBottomTime = message[1].time
        // this.planTopData = message
        // this.planBottomData = message[1].data
      })
    },
    //表格头部返回时间
    tbleTopTime(currentPageData) {
      // console.log(currentPageData)
      return '计划巡检时间：' + currentPageData[0].time
    },
    tbleBottomTime() {
      return '计划巡检时间：' + this.tableBottomTime
    },
    //动态数据
    getDynamicData() {
      //安全动态
      let tpyeSafety = {
        relTenantIds: this.tenementId,
        orderType: 1,
        pageSize: 4,
      }
      getAction('/sys/qualitySafety/list', tpyeSafety).then((res) => {
        this.gainSafetyData = res.result.records
        let msgSafety = this.gainSafetyData
        console.log(this.gainSafetyData)
        for (let i = 0; i < msgSafety.length; i++) {
          let safetyAny = {}
          safetyAny.orderType = msgSafety[i].orderType
          safetyAny.orderStatus = msgSafety[i].orderStatus
          if (msgSafety[i].inspectPath) {
            safetyAny.img = msgSafety[i].inspectPath.split(',')[0]
          } else {
            safetyAny.img = ''
          }
          if (msgSafety[i].orderStatus === 0) {
            // safetyAny.img = msgSafety[i].inspectPath
            safetyAny.content = msgSafety[i].inspectContent
            safetyAny.time = '整改期限：' + msgSafety[i].inspectValidityTime
            safetyAny.state = '待整改'
          }
          if (msgSafety[i].orderStatus === 1) {
            // safetyAny.img = msgSafety[i].inspectPath
            safetyAny.content = msgSafety[i].repairDescribe
            safetyAny.time = '整改时间：' + msgSafety[i].repairTime
            safetyAny.state = '待验收'
          }
          if (msgSafety[i].orderStatus === 2) {
            if (msgSafety[i].checkStatus === 0) {
              // safetyAny.img = msgSafety[i].inspectPath
              safetyAny.content = msgSafety[i].checkDescribe
              safetyAny.time = '验收时间：' + msgSafety[i].checkTime
              safetyAny.state = '已验收'
            } else if (msgSafety[i].checkStatus === 1) {
              // safetyAny.img = msgSafety[i].inspectPath
              safetyAny.content = msgSafety[i].checkDescribe
              safetyAny.time = '验收时间：' + msgSafety[i].checkTime
              safetyAny.state = '不合格'
            }
          }
          this.safetyData.push(safetyAny)
        }
      })
      //质量动态
      let tpyeQuality = {
        relTenantIds: this.tenementId,
        orderType: 0,
        pageSize: 4,
      }
      getAction('/sys/qualitySafety/list', tpyeQuality).then((res) => {
        this.gainQualityData = res.result.records
        let msgQuality = this.gainQualityData
        console.log(this.gainQualityData)
        for (let i = 0; i < msgQuality.length; i++) {
          let qualityAny = {}
          qualityAny.orderType = msgQuality[i].orderType
          qualityAny.orderStatus = msgQuality[i].orderStatus
          if (msgQuality[i].inspectPath) {
            qualityAny.img = msgQuality[i].inspectPath.split(',')[0]
          } else {
            qualityAny.img = ''
          }
          if (msgQuality[i].orderStatus === 0) {
            qualityAny.content = msgQuality[i].inspectContent
            qualityAny.time = '整改期限：' + msgQuality[i].inspectValidityTime
            qualityAny.state = '待整改'
          }
          if (msgQuality[i].orderStatus === 1) {
            qualityAny.content = msgQuality[i].repairDescribe
            qualityAny.time = '整改时间：' + msgQuality[i].repairTime
            qualityAny.state = '待验收'
          }
          if (msgQuality[i].orderStatus === 2) {
            if (msgQuality[i].checkStatus === 0) {
              qualityAny.content = msgQuality[i].checkDescribe
              qualityAny.time = '验收时间：' + msgQuality[i].checkTime
              qualityAny.state = '已验收'
            } else if (msgQuality[i].checkStatus === 1) {
              qualityAny.content = msgQuality[i].checkDescribe
              qualityAny.time = '验收时间：' + msgQuality[i].checkTime
              qualityAny.state = '不合格'
            }
          }
          this.qualityData.push(qualityAny)
        }
      })
    },
    //弹窗
    popupAccording(idx, type) {
      let that = this
      this.popup = true
      that.dataPopup = []
      let dynamicState = null
      let popupMessage = []
      switch (type) {
        case 1:
          dynamicState = this.gainSafetyData
          this.popupTitle = '安全整改详情'
          break
        case 0:
          dynamicState = this.gainQualityData
          this.popupTitle = '质量整改详情'
          break
      }
      let abarbeitungTyple = ''
      switch (dynamicState[idx].orderStatus) {
        case 0:
          abarbeitungTyple = '待整改'
          break
        case 1:
          abarbeitungTyple = '待验收'
          break
        case 2:
          abarbeitungTyple = '已验收'
          break
      }
      let timeOut = ''
      switch (dynamicState[idx].repairIsOutTime) {
        case 0:
          timeOut = '否'
          break
        case 1:
          timeOut = '是'
          break
      }
      let audit = ''
      switch (dynamicState[idx].checkStatus) {
        case 0:
          audit = '合格'
          break
        case 1:
          audit = '不合格'
          break
      }

      if(type==0){
        popupMessage = [
          {
            type: '发现安全问题',
            time: moment(dynamicState[idx].createTime).format("MM-DD-YYYY"),
            data: [
              '问题部位：' + dynamicState[idx].inspectProblemArea,
              '问题分类：' + dynamicState[idx].inspectProblemClassify_dictText,
              '问题描述：' + dynamicState[idx].inspectContent,
              '检查人：' + dynamicState[idx].inspector_dictText,
              '责任人：' + dynamicState[idx].inspectDutyPerson_dictText,
              '整改期限：' + dynamicState[idx].inspectValidityTime,
              '整改状态：' + abarbeitungTyple,
              '附件：',
            ],
            img: dynamicState[idx].inspectPath,
          },
          {
            type: '整改回复',
            time: moment(dynamicState[idx].repairTime).format("MM-DD-YYYY"),
            data: [
              '整改人：' + dynamicState[idx].repairer_dictText,
              '整改时间：' + dynamicState[idx].repairTime,
              '是否超时：' + timeOut,
              '整改描述：' + dynamicState[idx].repairDescribe,
              '附件：',
            ],
            img: dynamicState[idx].repairPath,
          },
          {
            type: '验收回复',
            time: moment(dynamicState[idx].checkTime).format("MM-DD-YYYY"),
            data: [
              '验收人：' + dynamicState[idx].checkPerson_dictText,
              '验收时间：' + dynamicState[idx].checkTime,
              '审核状态：' + audit,
              '审核描述：' + dynamicState[idx].checkDescribe,
            ],
          },
        ]
      }else if(type==1){
        popupMessage = [
          {
            type: '发现安全问题',
            time: moment(dynamicState[idx].createTime).format("MM-DD-YYYY"),
            data: [
              '问题部位：' + dynamicState[idx].inspectProblemArea,
              '隐患事件：' + dynamicState[idx].hazardContentId_dictText,
              '问题描述：' + dynamicState[idx].inspectContent,
              '检查人：' + dynamicState[idx].inspector_dictText,
              '责任人：' + dynamicState[idx].inspectDutyPerson_dictText,
              '整改期限：' + dynamicState[idx].inspectValidityTime,
              '整改状态：' + abarbeitungTyple,
              '附件：',
            ],
            img: dynamicState[idx].inspectPath,
          },
          {
            type: '整改回复',
            time: moment(dynamicState[idx].repairTime).format("MM-DD-YYYY"),
            data: [
              '整改人：' + dynamicState[idx].repairer_dictText,
              '整改时间：' + dynamicState[idx].repairTime,
              '是否超时：' + timeOut,
              '整改描述：' + dynamicState[idx].repairDescribe,
              '附件：',
            ],
            img: dynamicState[idx].repairPath,
          },
          {
            type: '验收回复',
            time: moment(dynamicState[idx].checkTime).format("MM-DD-YYYY"),
            data: [
              '验收人：' + dynamicState[idx].checkPerson_dictText,
              '验收时间：' + dynamicState[idx].checkTime,
              '审核状态：' + audit,
              '审核描述：' + dynamicState[idx].checkDescribe,
            ],
          },
        ]
      }
      
       switch (dynamicState[idx].orderStatus) {
        case 0:
          that.dataPopup.push(popupMessage[0])
          break
        case 1:
          that.dataPopup.push(popupMessage[0])
          that.dataPopup.push(popupMessage[1])
          break
        case 2:
          that.dataPopup = popupMessage
          break
      }
    },
    popupClose() {
      this.popup = false
    },
  },
}
</script>
<style lang="less" scoped>
.frame {
  position: relative;
  height: 500px;
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
.frame_bulletinboard {
  width: 418px;
  padding: 8px 0 8px 0;
  margin: 0 26px 0 26px;
  border-bottom: 1px solid #255a8b;
  float: left;
}
.img_bd {
  float: left;
  width: 130px;
  height: 90px;
}
.bulletinboard_img {
  width: 100%;
  height: 100%;
}
.bulletinboard_text {
  margin-left: 16px;
  width: 268px;
  float: left;
}
.bulletinboard_text p {
  width: 268px;
  height: 62px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #efefef;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
}
.bulletinboard_text span {
  font-size: 14px;
  color: rgb(4, 163, 247);
}
.bulletinboard_button {
  position: relative;
  bottom: 4px;
  width: 50px;
  border-radius: 2px;
  float: right;
  text-align: center;
  cursor: pointer;
}
.status_on {
  border: 1px solid rgb(50, 197, 78);
  background-color: rgba(50, 197, 78, 0.3);
  color: #efefef;
}
.status_off {
  border: 1px solid rgb(242, 83, 77);
  background-color: rgba(242, 83, 77, 0.3);
  color: #efefef;
}
.quality_middle {
  width: 880px;
  margin-left: 15px;
  margin-right: 15px;
  overflow: hidden;
}
.quality_middle_title {
  width: 95%;
  margin: auto;
}
.frame_title_plan {
  float: left;
  cursor: pointer;
  font-size: 14px;
  width: 120px;
  text-align: center;
}
.plan_table {
  height: 420px;
  width: 95%;
  margin: 10px auto 0;
  overflow: hidden;
}
.plan_table:hover{
  overflow: auto;
}
.plan_table::-webkit-scrollbar {
  width: 2px;
}
.plan_table::-webkit-scrollbar-thumb {
  border-radius: 5px;
  /* background: rgb(31, 143, 255, .5); */
  background: rgb(255, 255, 255, .8);
}
.plan_table::-webkit-scrollbar-track {
  border-radius: 5px;
  background: rgba(24, 127, 255, .2);
}
/* 修改表头文字、背景颜色   */
.plan_table_info {
  & /deep/.ant-table-thead > tr > th {
    color: white;
    background-color: #04a3f7 !important;
    border: 0px;
    padding: 8px 0 !important;
  }
}
.plan_table_info {
  /* 修改列表文字、背景颜色   */
  & /deep/ .ant-table-title {
    color: rgb(53, 217, 224);
  }
}

.plan_table_info {
  /* 修改列表文字、背景颜色   */
  & /deep/ .ant-table-tbody > tr > td {
    color: white;
    background: #0d2346 !important;
    border-bottom: 1px solid #255a8b !important;
    padding: 8px 0 !important;
  }
}

.plan_table_info {
  color: #ffffff !important;
}

.quality_right {
  width: 470px;
}
.plan_on {
  background: url('~@/assets/digitalScreen-images/frameTitleOn.png');
}
.plan_off {
  background: url('~@/assets/digitalScreen-images/frameTitleOff.png');
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
  height: 636px;
  overflow-y: auto;
}
.time_line {
  padding-left: 20px;
}
.time_line p {
  font-size: 16px;
  color: #efefef;
  margin: 0;
}
.line {
}
.line_img {
  width: 80%;
  height: 325px;
}
</style>