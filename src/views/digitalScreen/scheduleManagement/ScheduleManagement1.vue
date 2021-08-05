<template>
  <div class="project_overview">
    <a-row class="project_top frame" :gutter="16">
      <!-- 边角 -->
      <span class="span_icon top_left_icon"></span>
      <span class="span_icon top_right_icon"></span>
      <span class="span_icon bottom_left_icon"></span>
      <span class="span_icon bottom_right_icon"></span>
      <div class="schedule_tittle">
        <a-button class="bigBtn">进度计划</a-button>
      </div>
      <vue-scroll :ops="ops" style="width:100%;height:484px">
      <div class="schedule_main">
        <div class="schedule_left">
          <a-table
            :expandIcon="expandIcon"
            :rowClassName="rowClassName"
            :columns="taskColumns"
            :data-source="taskData"
            :pagination="false"
            :expanded-row-keys.sync="expandedRowKeys"
            @expandedRowsChange="handleExpandedRowsChange"
            @expand="handleExpand"
            rowKey="id"
          />
        </div>
        <div class="schedule_right">
          <div v-for="(item, index) in displayableRows" :key="index" class="schedule_right_item">
            <div :id="item.id" style="width: 100%; height: 100%"></div>
          </div>
        </div>
      </div>
      </vue-scroll>
    </a-row>
    <a-row class="project_bottom" :gutter="16">
      <div class="lagTasK frame">
        <!-- 边角 -->
        <span class="span_icon top_left_icon"></span>
        <span class="span_icon top_right_icon"></span>
        <span class="span_icon bottom_left_icon"></span>
        <span class="span_icon bottom_right_icon"></span>
        <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
          滞后任务统计
        </p>
        <div style="display: flex; flex-direction: row">
          <div style="display: flex; flex-direction: column; justify-content: center; margin-left: 5%">
            <div
              style="
                width: 230px;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 0;
              "
              :style="'background: url(' + options.images.bkPng + ') bottom no-repeat'"
            >
              <span>总计划任务</span>
              <span style="letter-spacing: 5px">:</span>
              <span style="font-family: 'electronicFont'; font-size: 28px">{{ this.taskStatistic.total }}</span>
              <span>个</span>
            </div>
            <div
              style="
                width: 230px;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 0;
              "
              :style="'background: url(' + options.images.bkPng + ') bottom no-repeat'"
            >
              <span>正常进度任务</span>
              <span style="letter-spacing: 5px">:</span>
              <span style="font-family: 'electronicFont'; font-size: 28px; color: #407eea">{{
                this.taskStatistic.noLag
              }}</span>
              <span>个</span>
            </div>
            <div
              style="
                width: 230px;
                font-size: 15px;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 0;
              "
              :style="'background: url(' + options.images.bkPng + ') bottom no-repeat'"
            >
              <span style="">滞后任务</span>
              <span style="letter-spacing: 5px">:</span>
              <span style="font-family: 'electronicFont'; font-size: 28px; color: #f2534d">{{
                this.taskStatistic.lagging
              }}</span>
              <span>个</span>
            </div>
          </div>
          <div id="warehouse_top"></div>
        </div>
      </div>
      <div class="supervision frame">
        <!-- 边角 -->
        <span class="span_icon top_left_icon"></span>
        <span class="span_icon top_right_icon"></span>
        <span class="span_icon bottom_left_icon"></span>
        <span class="span_icon bottom_right_icon"></span>
        <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
          任务产值分析
        </p>
        <div class="line common_chart" ref="middleChart"></div>
        <div style="position: absolute; margin-top: -235px; left: 340px; color: #ffffff">筛选：</div>
        <a-range-picker
          style="margin-left: 380px; top: -240px"
          @change="onChange"
          @calendarChange="calendarChange"
          :ranges="ranges"
        />
      </div>
      <div class="record frame">
        <!-- 边角 -->
        <span class="span_icon top_left_icon"></span>
        <span class="span_icon top_right_icon"></span>
        <span class="span_icon bottom_left_icon"></span>
        <span class="span_icon bottom_right_icon"></span>
        <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
          施工日志
        </p>
        <vue-seamless-scroll v-if="listData.length > 0" :data="listData" class="warp" :class-option="classOption">
          <ul class="item">
            <li v-for="(item, index) in listData" :key="index">
              <span class="date" v-text="item.createTime"></span> <br />
              <span class="title" v-text="item.detail"></span>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </a-row>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress, poPersonCount } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import vueSeamlessScroll from 'vue-seamless-scroll'
import moment from 'moment'

import defaultEcharts from '@/views/digitalScreen/qualityAndSafety/js/echartsSecondaryEncapsulation'

export default {
  name: 'ProjectOverview',
  components: {
    vueSeamlessScroll,
  },
  data() {
    return {
      options: {
        images: images,
      },
      currentIndex: '',
      planBtn: [{ txt: '总进度计划' }, { txt: '日计划' }],
      selectedPlan: 0,
      lagTaskListFis: {},
      //滞后任务统计
      taskStatistics: [],
      taskStatistic: {},
      ProceedRecord: [
        {
          detail: '', //任务详情
          operators_dictText: '', //操作人
          createTime: '', //创建日期
          id: '',
        },
      ],
      visible: false,
      lagTaskShowVisible: false,
      visible2: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 0 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 0 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 1 },
        },
      },
      dynamicValidateForm_ry: {
        domains: [],
      },
      dynamicValidateForm_jx: {
        domains: [],
      },
      dynamicValidateForm_hc: {
        domains: [],
      },
      constructionList_ry: [
        {
          type: '',
          value: '',
        },
      ],
      constructionList_jx: [
        {
          type: '',
          value: '',
        },
      ],
      constructionList_hc: [
        {
          type: '',
          value: '',
        },
      ],
      domain: [
        {
          type: '',
          value: '',
        },
      ],
      // 施工记录滚动
      listData: [],

      classOption: {
        step: 0.5,
        openWatch: true,
        // limitMoveNum: this.listData.length, // 开始无缝滚动的数据量 this.dataList.length
      },
      taskColumns: [
        // {title:'序号',dataIndex:'id',key:'id'},
        { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
        { title: '计划开始时间', dataIndex: 'planStartTime', key: 'planStartTime' },
        { title: '计划结束时间', dataIndex: 'planCompletionTime', key: 'planCompletionTime' },
        { title: '计划产值', dataIndex: 'plannedProductionValue', key: 'plannedProductionValue' },
        { title: '实际产值', dataIndex: 'actualProductionValue', key: 'actualProductionValue' },
        { title: '进度状态', dataIndex: 'laggingSituation', key: 'laggingSituation' },
      ],
      taskData: [
        {
          key: 1,
          id: 1,
          taskName: '施工准备',
          planStartTime: '2019-4-13',
          planCompletionTime: '2019-4-13',
          plannedProductionValue: 56,
          actualProductionValue: 57,
          laggingSituation: '未滞后',
          children: [
            {
              key: 11,
              id: 11,
              taskName: '施工准备',
              planStartTime: '2019-5-13',
              planCompletionTime: '2019-5-13',
              plannedProductionValue: 51,
              actualProductionValue: 51,
              laggingSituation: '未滞后',
            },
            {
              key: 12,
              id: 12,
              taskName: '施工准备',
              planStartTime: '2019-5-14',
              planCompletionTime: '2019-5-14',
              plannedProductionValue: 41,
              actualProductionValue: 42,
              laggingSituation: '未滞后',
              children: [
                {
                  key: 121,
                  id: 121,
                  taskName: '桩基工程',
                  planStartTime: '2019-5-15',
                  planCompletionTime: '2019-5-15',
                  plannedProductionValue: 11,
                  actualProductionValue: 12,
                  laggingSituation: '未滞后',
                },
                {
                  key: 122,
                  id: 122,
                  taskName: '桩基工程A',
                  planStartTime: '2019-5-15',
                  planCompletionTime: '2019-5-15',
                  plannedProductionValue: 10,
                  actualProductionValue: 5,
                  laggingSituation: '滞后',
                },
                {
                  key: 123,
                  id: 123,
                  taskName: '桩基工程B',
                  planStartTime: '2019-5-15',
                  planCompletionTime: '2019-5-15',
                  plannedProductionValue: 10,
                  actualProductionValue: 9,
                  laggingSituation: '未滞后',
                  children: [
                    {
                      key: 1231,
                      id: 1231,
                      taskName: '土方开挖',
                      planStartTime: '2020-7-15',
                      planCompletionTime: '2020-7-15',
                      plannedProductionValue: 13,
                      actualProductionValue: 15,
                      laggingSituation: '未滞后',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: 2,
          id: 2,
          taskName: '桩基工程',
          planStartTime: '2019-4-17',
          planCompletionTime: '2019-4-17',
          plannedProductionValue: 12,
          actualProductionValue: 11,
          laggingSituation: '未滞后',
          children: [
            {
              key: 21,
              id: 21,
              taskName: '桩基工程2',
              planStartTime: '2019-6-15',
              planCompletionTime: '2019-6-15',
              plannedProductionValue: 11,
              actualProductionValue: 12,
              laggingSituation: '未滞后',
            },
          ],
        },
        {
          key: 3,
          id: 3,
          taskName: '桩基工程3',
          planStartTime: '2019-4-17',
          planCompletionTime: '2019-4-17',
          plannedProductionValue: 12,
          actualProductionValue: 11,
          laggingSituation: '未滞后',
          children: [
            {
              key: 31,
              id: 31,
              taskName: '桩基工程31',
              planStartTime: '2019-6-15',
              planCompletionTime: '2019-6-15',
              plannedProductionValue: 11,
              actualProductionValue: 12,
              laggingSituation: '未滞后',
            },
            {
              key: 32,
              id: 32,
              taskName: '桩基工程32',
              planStartTime: '2019-6-15',
              planCompletionTime: '2019-6-15',
              plannedProductionValue: 11,
              actualProductionValue: 1,
              laggingSituation: '滞后',
            },
            {
              key: 33,
              id: 33,
              taskName: '桩基工程33',
              planStartTime: '2019-6-15',
              planCompletionTime: '2019-6-15',
              plannedProductionValue: 11,
              actualProductionValue: 13,
              laggingSituation: '未滞后',
              children: [
                {
                  key: 331,
                  id: 331,
                  taskName: '桩基工程331',
                  planStartTime: '2019-8-15',
                  planCompletionTime: '2019-8-15',
                  plannedProductionValue: 11,
                  actualProductionValue: 11,
                  laggingSituation: '未滞后',
                },
              ],
            },
          ],
        },
        {
          key: 4,
          id: 4,
          taskName: '一层结平',
          planStartTime: '2019-4-17',
          planCompletionTime: '2019-4-17',
          plannedProductionValue: 12,
          actualProductionValue: 11,
          laggingSituation: '未滞后',
          children: [
            {
              key: 41,
              id: 41,
              taskName: '一层结平1',
              planStartTime: '2019-6-15',
              planCompletionTime: '2019-6-15',
              plannedProductionValue: 11,
              actualProductionValue: 12,
              laggingSituation: '未滞后',
            },
          ],
        },
      ],
      expandedRowKeys: [],
      displayableRows: [],
      middleTime: [], // 任务产值分析日期
      middleData: [
        {
          name: '计划产值',
          type: 'line',
          data: [],
        },
        {
          name: '实际产值',
          type: 'line',
          data: [],
        },
      ],
      deliveryDate_begin: '',
      deliveryDate_end: '',
      //预设常用日期范围快捷方式
      ranges: {
        // 一月内: () => [moment('2021-06-10', 'YYYY:MM:DD'), moment('2021-07-10', 'YYYY:MM:DD')],
        一月内: () => [moment().startOf('day').subtract(1, 'month'), moment()],
        昨天: () => [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
        最近一周: () => [moment().startOf('day').subtract(1, 'weeks'), moment()],

    },
    ops: {
      vuescroll: {},
      scrollPanel: {},
      rail: {
        keepShow: true
      },
      bar: {
        hoverStyle: true,
        onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
        background: "#F5F5F5",//滚动条颜色
        opacity: 0.5,//滚动条透明度
        "overflow-x": "hidden"
      }
    },

    }
  },
  created() {
    this.getMiddleChartData()
  },
  mounted() {
    this.checkMenu()
    this.getlagTask()
    this.getProceedRecord()
    this.getScheduleList()
    this.personnelStatistics()
  },
  watch: {
    leftData(val) {
      this.getLeftChart(val)
    },
    middleTime(val) {
      // this.getMiddleChart(val)
    },
    rightData(val) {
      this.getRightChart(val)
    },
  },
  methods: {
    moment,
    // 日期变化事件
    onChange(date, dateString) {
      this.deliveryDate_begin = ''
      this.deliveryDate_end = ''
      this.deliveryDate_begin = dateString[0]
      this.deliveryDate_end = dateString[1]
      this.middleTime = []
      this.middleData[0].data = []
      this.middleData[1].data = []
      this.getMiddleChartData()
    },

    //选中日期事件
    calendarChange(date, dateString) {
      // if (date.length <= 1) {
      //   //选中开始日期事件，设置结束日期必须大于5天
      //   this.selectDate = date[0].add(5, 'days')
      // } else {
      //   this.selectDate = null
      // }
    },
    // 任务产值分析
    getMiddleChart(time) {
      // let myChart = this.$echarts.init(this.$refs.middleChart)
      // let char = defaultEcharts.getMiddleOption(this.middleData, time)
      // myChart.setOption(char)
    },

    // 任务产值分析数据请求
    getMiddleChartData() {
      getAction('/sys/scheduleProductionValue/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        column: 'data',
        date_begin: this.deliveryDate_begin,
        date_end: this.deliveryDate_end,
      }).then((res) => {
        let data = res.result.records
        console.log('任务产值分析数据请求', data)
        for (let i = 0; i < data.length; i++) {
          this.middleData[0].data.push(data[i].plannedProductionValue)
          this.middleData[1].data.push(data[i].actualProductionValue)
          this.middleTime.push(data[i].date)
          // this.middleTime.push(data[i].inspectTime)
        }
        let myChart = this.$echarts.init(this.$refs.middleChart)
        myChart.setOption({
          grid: {
            right: '1%',
            top: '80',
            left: '1%',
            bottom: '0px',
            containLabel: true,
          },
          title: {
            subtextStyle: {
              //副标题文本样式
              color: '#666668',
            },
            subtext: '(万)',
            top: '35',
          },
          legend: {
            top: '30',
            left: '8%',
            textStyle: {
              //设置图例文字的样式
              color: '#fff',
              fontSize: 12,
            },
          },
          color: [
            'rgba(255, 63, 63, 1)',
            'rgba(50, 197, 78, 1)',
            'rgba(242, 199, 97, 1)',
            'rgba(242, 153, 97, 1)',
            'rgba(0, 204, 205, 1)',
          ],
          xAxis: {
            // category: 'category',
            // boundaryGap: false,
            data: this.middleTime,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#666668',
              },
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#666668',
              },
            },
          },
          series: [
            {
              name: '计划产值',
              type: 'line',
              data: this.middleData[0].data,
              itemStyle: { normal: { label: { show: true } } },
            },
            {
              name: '实际产值',
              type: 'line',
              data: this.middleData[1].data,
              itemStyle: { normal: { label: { show: true } } },
            },
          ],
        })
      })
    },

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
    switchPlan(index) {
      this.selectedPlan = index
    },
    rowClassName(record, index) {
      // console.log(record);
      if (record.laggingSituation != '未滞后') {
        return 'lagging'
      }
    },
    expandIcon(props) {
      // console.log(props)
      if (props.record.children) {
        if (!props.expanded) {
          //有数据-展开时候图标
          return (
            <a
              style="color: 'black';margin-right:5px"
              onClick={(e) => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type="plus-square" />
            </a>
          )
        } else {
          //有数据-未展开时候图标
          return (
            <a
              style="color: 'black';margin-right:5px"
              onClick={(e) => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type="minus-square" />
            </a>
          )
        }
      } else {
        //无数据-图标
        return <span style="margin-right:0px"></span>
      }
    },
    getScheduleList() {
      getAction('/sys/scheduleManagePlan/treeList', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        // console.log(res)
        let { code, result } = res
        if (code == 200) {
          this.taskData.splice(0, this.taskData.length)
          this.taskData = result
        }
        this.handleDisplayableRows(this.taskData)
      })
    },
    handleDisplayableRows(data) {
      console.log(data)
      for (let i in data) {
        this.displayableRows.push({
          text: data[i].taskName,
          id: 'charts_' + data[i].id,
          plan: data[i].plannedProductionValue,
          real: data[i].actualProductionValue,
          status: data[i].laggingSituation,
        })

        for (var j in data[i].children) {
          for (var k in this.expandedRowKeys) {
            if (data[i].id == this.expandedRowKeys[k]) {
              this.displayableRows.push({
                text: data[i].children[j].taskName,
                id: 'charts_' + data[i].children[j].id,
                plan: data[i].children[j].plannedProductionValue,
                real: data[i].children[j].actualProductionValue,
                status: data[i].children[j].laggingSituation,
              })
            }
            if (data[i].children[j].id == this.expandedRowKeys[k]) {
              this.handleDisplayableRows(data[i].children[j].children)
            }
          }
        }
      }
      this.$nextTick(() => {
        this.drawLine2()
      })

      console.log(this.displayableRows)
    },
    handleExpandedRowsChange(expandedRowKeys) {
      this.expandedRowKeys = expandedRowKeys
      console.log(this.expandedRowKeys)
    },
    handleExpand(expanded, record) {
      // console.log(this.expandedRowKeys)
      // console.log(expanded,record)
      if (expanded == false) {
        // console.log('haha')
        for (var a in record.children) {
          for (var i in this.expandedRowKeys) {
            if (record.children[a].id == this.expandedRowKeys[i]) {
              this.expandedRowKeys.splice(i, 1)
            }
          }
        }
      }
      if (this.displayableRows.length > 0) {
        this.displayableRows.splice(0, this.displayableRows.length)
      }
      this.handleDisplayableRows(this.taskData)
      // console.log(this.displayableRows)
    },
    showModal() {
      this.visible = true
    },
    lagTaskShowModal(item) {
      console.log(item)
      this.lagTaskListFis = item
      this.lagTaskShowVisible = true
    },
    showModal2() {
      this.visible2 = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain_ry(item) {
      let index = this.dynamicValidateForm_ry.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm_ry.domains.splice(index, 1)
      }
    },
    removeDomain_jx(item) {
      let index = this.dynamicValidateForm_jx.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm_jx.domains.splice(index, 1)
      }
    },
    removeDomain_hc(item) {
      let index = this.dynamicValidateForm_hc.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm_hc.domains.splice(index, 1)
      }
    },
    addDomain_ry() {
      this.dynamicValidateForm_ry.domains.push({
        value: '',
        key: Date.now(),
      })
    },
    addDomain_jx() {
      this.dynamicValidateForm_jx.domains.push({
        value: '',
        key: Date.now(),
      })
    },
    addDomain_hc() {
      this.dynamicValidateForm_hc.domains.push({
        value: '',
        key: Date.now(),
      })
    },

    // 施工管理
    personnelStatistics() {
      getAction('/sys/scheduleConstruction/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        column: 'createTime',
        order: 'desc',
      }).then((res) => {
        // console.log(res);
        let { code, result } = res
        if (code == 200) {
          let data = result.records
          // console.log(data)
          // console.log(this.dynamicValidateForm_ry.domains)
          if (this.constructionList_ry.length > 0) {
            this.constructionList_ry.splice(0, this.constructionList_ry.length)
          }
          if (this.constructionList_jx.length > 0) {
            this.constructionList_jx.splice(0, this.constructionList_ry.length)
          }
          if (this.constructionList_hc.length > 0) {
            this.constructionList_hc.splice(0, this.constructionList_ry.length)
          }
          if (data.length > 0) {
            this.constructionList_ry = JSON.parse(data[0].info)[0]
            this.constructionList_jx = JSON.parse(data[0].info)[1]
            this.constructionList_hc = JSON.parse(data[0].info)[2]
            this.dynamicValidateForm_ry.domains = JSON.parse(data[0].info)[0]
            this.dynamicValidateForm_jx.domains = JSON.parse(data[0].info)[1]
            this.dynamicValidateForm_hc.domains = JSON.parse(data[0].info)[2]
            this.statisId = data[0].id
          }
        }
      })
    },

    //提交表单
    SubmitForm() {
      let bigArr = [
        this.dynamicValidateForm_ry.domains,
        this.dynamicValidateForm_jx.domains,
        this.dynamicValidateForm_hc.domains,
      ]
      // console.log(this.dynamicValidateForm_ry.domains)
      var params = {
        info: JSON.stringify(bigArr),
        // info: JSON.stringify(this.dynamicValidateForm_ry.domains),
        relTenantIds: this.$store.state.user.info.relTenantIds,
        id: this.statisId,
      }
      httpAction('/sys/scheduleConstruction/add', params, 'post').then((res) => {
        console.log(res)
        let { code, result } = res
        if (code == 200) {
          this.constructionList_ry = this.dynamicValidateForm_ry.domains
          this.constructionList_hc = this.dynamicValidateForm_hc.domains
          this.constructionList_jx = this.dynamicValidateForm_jx.domains
          this.visible2 = false
        }
      })
    },
    //点击取消
    handleCancel() {
      this.visible2 = false
    },
    //滞后任务统计
    getlagTask() {
      getAction('/sys/scheduleManagePlan/laggingCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        // laggingSituation: 1
      }).then((res) => {
        if (res.code == 200) {
          this.taskStatistic = res.result
          console.log('滞后任务统计', this.taskStatistic)
          this.taskStatistics.push(
            { value: this.taskStatistic.noLag, name: '正常进度任务' },
            { value: this.taskStatistic.lagging, name: '滞后任务' }
          )
          // if (this.lagTaskList.length > 0) {
          //   this.lagTaskList.splice(0, this.lagTaskList.length)
          // }
          // data.forEach((value, index) => {
          //   this.lagTaskList.push({
          //     taskName: value.taskName,  //任务名称
          //     createBy: value.createBy,  //创建人
          //     laggingReasons: value.laggingReasons, //滞后原因
          //     solution: value.solution, //解决措施
          //     planCompletionTime: value.planCompletionTime,  //计划完成时间
          //     actualCompletionTime: value.actualCompletionTime,  //实际完成时间
          //     id: value.id,
          //   });
          // });
          this.warehouse_top = this.$echarts.init(document.getElementById('warehouse_top'))
          let option1 = {
            tooltip: {
              trigger: 'item',
            },
            color: [
              'rgba(64, 127, 255, 1)',
              'rgba(242, 83, 77, 1)',
              'rgba(242, 199, 97, 1)',
              'rgba(242, 153, 97, 1)',
              'rgba(0, 204, 205, 1)',
            ],
            grid: {
              left: '-100',
              top: '30',
              bottom: '10',
              containLabel: true,
            },
            legend: {
              top: 'bottom',
              textStyle: {
                color: '#fff',
                fontSize: '14',
              },
            },
            series: [
              {
                name: '统计',
                type: 'pie',
                radius: ['45%', '68%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '17',
                    fontWeight: 'bold',
                    formatter: '{d}%\n{b}',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: this.taskStatistics,
              },
            ],
          }
          this.warehouse_top.setOption(option1)
        } else {
          this.$message.error('滞后任务统计数据请求失败！')
        }
      })
    },

    //施工记录
    getProceedRecord() {
      getAction('/sys/scheduleManageLogs/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.result.records
          if (this.listData.length > 0) {
            this.listData.splice(0, this.listData.length)
          }
          data.forEach((value, index) => {
            this.listData.push({
              detail: value.detail, //任务详情
              operators_dictText: value.operators_dictText, //操作人
              createTime: value.createTime, //创建日期
              id: value.id,
            })
          })
        }
      })
    },
    drawLine2() {
      console.log(this.displayableRows)
      this.displayableRows.forEach((item, index) => {
        if (item.real > item.plan) {
          item.real = item.plan
        }
        let rate = (item.real / item.plan) * 100
        let chartsColor = ''
        if (item.status == '未滞后') {
          //代表未滞后
          chartsColor = new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {
              offset: 0,
              color: 'rgba(9, 174, 219, 1)',
            },
            {
              offset: 1,
              color: 'rgba(5, 195, 184, 1)',
            },
          ])
        } else if (item.status == '滞后') {
          chartsColor = 'rgba(242,83,77,1)'
        }
        let schedule_right = this.$echarts.init(document.getElementById(item.id))
        schedule_right.setOption({
          grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none',
            },
            formatter: function (params) {
              return params[0].seriesName + '：' + params[0].value.toFixed(1) + '%'
            },
          },
          // 不显示x轴的相关信息
          xAxis: {
            show: false,
          },
          yAxis: [
            {
              type: 'category',
              inverse: true,
              data: [''],
              // 不显示y轴的线
              axisLine: {
                show: false,
              },
              // 不显示刻度
              axisTick: {
                show: false,
              },
              // 把刻度标签里面的文字颜色设置为白色
              axisLabel: {
                color: '#fff',
              },
            },
            {
              data: [''],
              inverse: true,
              // 不显示y轴的线
              axisLine: {
                show: false,
              },
              // 不显示刻度
              axisTick: {
                show: false,
              },
              // 把刻度标签里面的文字颜色设置为白色
              axisLabel: {
                color: '#fff',
              },
            },
          ],
          series: [
            {
              name: item.text,
              type: 'bar',
              data: [rate],
              yAxisIndex: 0,
              // 修改第一组柱子的圆角
              itemStyle: {
                // 此时的color 可以修改柱子的颜色
                normal: {
                  color: chartsColor,
                  barBorderRadius: 0,
                },
              },
              // 柱子之间的距离
              barCategoryGap: 50,
              //柱子的宽度
              barWidth: 16,
              // 显示柱子内的文字
              label: {
                show: false,
                position: 'inside',
                // {c} 会自动的解析为 数据  data里面的数据
                formatter: '{c}%',
              },
              // tooltip:{
              //   formatter:function(params){
              //     alert(params)
              //   }
              // }
            },
            {
              name: '',
              type: 'bar',
              barCategoryGap: 50,
              barWidth: 16,
              yAxisIndex: 1,
              data: [100],
              itemStyle: {
                color: 'rgba(31, 172, 58, .1)',
              },
            },
          ],
        })
      })
    },
    drawLine1() {
      console.log(this.displayableRows)
      let schedule_right = this.$echarts.init(document.getElementById('schedule_right'))
      schedule_right.setOption({
        grid: {
          top: '10%',
          left: '1%',
          right: '0%',
          bottom: '0%',
          // containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            console.log(params)
          },
        },
        // 不显示x轴的相关信息
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            // 不显示y轴的线
            axisLine: {
              show: false,
            },
            // 不显示刻度
            axisTick: {
              show: false,
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: '#fff',
            },
          },
          {
            data: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false,
            },
            // 不显示刻度
            axisTick: {
              show: false,
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: '#fff',
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: [54, 11, 16, 45, 12, 17, 12, 82, 41, 22, 30, 74, 16],
            yAxisIndex: 0,
            // 修改第一组柱子的圆角
            itemStyle: {
              // 此时的color 可以修改柱子的颜色
              normal: {
                color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    offset: 0,
                    color: 'rgba(9, 174, 219, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(5, 195, 184, 1)',
                  },
                ]),
                barBorderRadius: 0,
              },
            },
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 16,
            // 显示柱子内的文字
            label: {
              show: false,
              position: 'inside',
              // {c} 会自动的解析为 数据  data里面的数据
              formatter: '{c}%',
            },
          },
          {
            name: '',
            type: 'bar',
            barCategoryGap: 50,
            barWidth: 15,
            yAxisIndex: 1,
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            itemStyle: {
              color: 'rgba(31, 172, 58, .1)',
            },
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

/* 声明数字字体样式 */
@font-face {
  font-family: 'electronicFont';
  src: url(../../font/DS-DIGIT.TTF);
}

.project_overview {
  width: 100%;
  height: auto;

  .project_top {
    padding: 0 20px;
    width: 1865px;
    height: 534px;
    justify-content: space-between;
    color: #fff;
    font-family: 'Microsoft YaHei';
    font-weight: 400;

    .schedule_tittle {
      width: 100%;
      height: 34px;
      background-size: 100% 33px;
      border-bottom: 1px solid #04a3f7;

      .ant-btn {
        position: relative;
        bottom: -1px;
        width: 120px;
        border: none;
        border-radius: 0;
        background: url(../../../assets/digitalScreen-images/frameTitleOff.png) no-repeat;
        background-size: 100% 100%;
        color: #fff;
        transition: all 0.6s;
      }

      .bigBtn {
        background: url(../../../assets/digitalScreen-images/bigBtn_bg.png) no-repeat;
      }

      .ant-btn.active {
        background: url(../../../assets/digitalScreen-images/frameTitleOn.png) no-repeat;
        background-size: 100% 100%;
      }

      .ant-btn:active {
        background: url(../../../assets/digitalScreen-images/frameTitleOn.png) no-repeat;
        background-size: 100% 100%;
      }

      // .ant-btn:hover {
      //   background: url(../../../assets/digitalScreen-images/frameTitleOn.png) no-repeat;
      //   background-size: 100% 100%;
      // }
    }

    // .schedule_main {
    //   height: 484px;
    //   overflow: hidden;
    // }

    // .schedule_main:hover {
    //   overflow: auto;
    //   overflow-x: hidden;
    // }

    // .schedule_main::-webkit-scrollbar {
    //   width: 2px;
    // }

    // .schedule_main::-webkit-scrollbar-thumb {
    //   border-radius: 5px;
    //   /* background: rgb(31, 143, 255, .5); */
    //   background: rgb(255, 255, 255, .8);
    // }

    // .schedule_main::-webkit-scrollbar-track {
    //   border-radius: 5px;
    //   background: rgba(24, 127, 255, .2);
    // }

    .schedule_left {
      float: left;
      margin-top: 15px;
      width: 973px;
      height: 469px;

      /deep/ table {
        width: 100%;
        font-size: 14px;
        font-family: 'Microsoft YaHei';
        font-weight: 400;
        color: #dedede;
        text-align: center;

        tr {
          height: 30px;
          line-height: 30px;

          .long {
            width: 222px;
            text-align: left;
          }

          .icon {
            width: 50px;

            .anticon {
              margin: 0 3px;
              color: rgba(5, 135, 207, 1);
            }
          }
        }

        tr.lagging {
          color: #f2534d;
        }

        .abnormal {
          color: rgba(242, 83, 77, 1);
        }

        .ant-table-thead > tr > th {
          height: 35px;
          line-height: 35px;
          padding: 0;
          background: rgba(4, 163, 247, 0.8);
          border-bottom: none;
          color: #efefef;
          text-align: center;
        }

        .ant-table-tbody > tr > td {
          padding: 0;
          border-bottom: none;
        }

        .ant-table-tbody > tr:nth-child(2n) {
          background: rgba(13, 35, 70, 0.8);
        }

        .ant-table-tbody > tr:hover > td {
          background: none;
        }
      }

      /deep/ .ant-table-placeholder {
        display: none;
      }
    }

    #schedule_right {
      float: right;
      width: 839px;
      height: 470px;
    }

    .schedule_right {
      float: right;
      width: 839px;
      height: 469px;
      margin-top: 15px;
      padding-top: 42px;
      box-sizing: border-box;
    }

    .schedule_right_item {
      width: 100%;
      height: 16px;
      margin-bottom: 14px;
    }
  }

  .project_bottom {
    display: flex;
    margin-top: 16px;
    height: 325px;

    .lagTasK {
      position: relative;
      margin-right: 14px;
      width: 537px;
      height: 100%;

      .lagTasKTable {
        height: 205px;
        overflow-x: hidden;
      }

      .lagTasKTable::-webkit-scrollbar {
        width: 2px;
      }

      .lagTasKTable::-webkit-scrollbar-thumb {
        border-radius: 5px;
        /* background: rgb(31, 143, 255, .5); */
        background: #0a2b60;
      }

      .lagTasKTable::-webkit-scrollbar-track {
        border-radius: 5px;
        background: none;
      }

      table {
        width: 497px;
        margin: 0 auto;

        tr {
          height: 30px;
          color: #fff;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;

          td:first-child {
            width: 60%;
            text-align: left;
            text-indent: 2em;
          }

          td:nth-child(2) {
            width: 40%;
          }
        }

        tr:nth-child(2n) {
          background: rgba(13, 35, 70, 0.8);
          height: 35px;
          line-height: 35px;
        }

        tr:hover {
          transform: scale(1.05);
        }
      }

      .tittleTable {
        tr:hover {
          transform: scale(1);
        }
      }
    }

    .supervision {
      position: relative;
      margin-right: 14px;
      width: 776px;
      height: 100%;

      .supervision_list {
        float: left;
        position: relative;
        width: 33.33%;
        margin-top: 30px;
        font-family: 'Microsoft YaHei';
        text-align: center;

        img {
          transition: all 0.6s;
        }

        p {
          margin: 5px 0 25px 0;
          font-size: 16px;
          font-weight: bold;
          color: #0587cf;
        }

        .supervision_box {
          height: 75px;
          overflow-x: hidden;

          span {
            display: block;
            font-size: 14px;
            font-weight: 400;
            color: #efefef;
            line-height: 25px;
          }
        }

        .supervision_box::-webkit-scrollbar {
          width: 2px;
        }

        .supervision_box::-webkit-scrollbar-thumb {
          border-radius: 5px;
          /* background: rgb(31, 143, 255, .5); */
          background: rgb(255, 255, 255, 0.8);
        }

        .supervision_box::-webkit-scrollbar-track {
          border-radius: 5px;
          background: rgba(24, 127, 255, 0.2);
        }
      }

      .supervision_list::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 1px;
        height: 194px;
        background: #1f314e;
      }

      .supervision_list:hover {
        img {
          transform: scale(1.1);
        }
      }

      .compile {
        position: absolute;
        right: 10px;
        bottom: 10px;
        cursor: pointer;
      }
    }

    .record {
      position: relative;
      width: 534px;
      height: 100%;

      .warp {
        height: 250px;
        width: 481px;
        margin: 15px auto;
        overflow: hidden;

        ul {
          list-style: none;
          padding: 0;
          margin: 0 auto;

          li {
            position: relative;
            display: block;
            width: 477px;
            height: 85px;
            margin-top: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #fff;
            font-family: 'Microsoft YaHei';
            border-bottom: 1px solid rgba(31, 49, 78, 1);

            .date {
              font-size: 14px;
              font-weight: bold;
              color: #04a3f7;
            }
          }
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
    height: 46px;
    width: 192px;
  }

  .line_bg_topLeft {
    top: -8px;
    left: 0px;
    background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat 0 0;
  }

  .line_bg_topRight {
    top: -8px;
    right: 0px;
    background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat -842px 0;
  }

  .line_bg_bottomLeft {
    bottom: -8px;
    left: 0px;
    background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat 0 -550px;
  }

  .line_bg_bottomRigth {
    bottom: -8px;
    right: 0px;
    background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat -842px -550px;
  }

  .head_title {
    line-height: 40px;
    padding-left: 25px;
    font-size: 16px;
    color: white;
    background-size: 96% 100% !important;
  }

  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    padding-top: 10px;
    opacity: 0.9;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }
}

li {
  list-style: none;
}

/deep/ .ant-modal {
  width: 650px !important;
  height: 700px !important;
}

/deep/ .ant-modal-content {
  padding: 0 47px 0 13px;
  width: 650px;
  height: 700px;
  color: #fff;
  background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;
  background-size: 100% 100% !important;

  p {
    font-size: 14px;
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    color: #ffffff;
    text-align: left;
  }

  .tc_tittle {
    width: 580px;
    text-align: center;
    border-bottom: 1px solid rgba(31, 49, 78, 1);
    margin-bottom: 20px;

    h4 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    span {
      color: #9aa5c1;
      line-height: 40px;
    }
  }

  .count {
    h4 {
      margin-top: 30px;
      color: #fff;
      line-height: 30px;
    }

    p {
      line-height: 30px;
      color: #acb5ca;
    }
  }

  .ant-modal-body {
    padding: 20px 0 20px 20px;
    overflow: hidden;

    form.dynamicsggl {
      height: 560px;
      overflow-x: hidden;
    }

    form.dynamicsggl::-webkit-scrollbar {
      width: 2px;
    }

    form.dynamicsggl::-webkit-scrollbar-thumb {
      border-radius: 5px;
      /* background: rgb(31, 143, 255, .5); */
      background: rgb(255, 255, 255, 0.8);
    }

    form.dynamicsggl::-webkit-scrollbar-track {
      border-radius: 5px;
      background: rgba(24, 127, 255, 0.2);
    }
  }
}

/deep/ .ant-modal-close {
  margin-top: 38px;
  margin-right: 2px;
  color: transparent;
  background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;

  i {
    display: none;
  }
}

/deep/ .ant-form {
  margin-top: 20px;
  position: relative;

  .ant-row {
    width: 580px;

    .ant-col {
      .ant-form-item-children {
        .ant-btn {
          background: none;
          border: none;
          color: #04a3f7;

          img {
            width: 17px;
            height: 17px;
            margin-right: 5px;
          }
        }
      }

      .ant-form-item-control {
        width: 570px;

        .ant-form-item-children {
          .ant-input {
            background: #3a5473;
            border: none;
            border-radius: 5px;
            padding-left: 15px;
            color: #fff;
          }

          .anticon {
            color: #04a3f7;
          }
        }
      }
    }
  }
}

/deep/ .head {
  margin-bottom: 10px;
  border-bottom: 1px solid #064474 !important;
}

/deep/ .submit {
  width: 220px;
  position: absolute;
  bottom: 60px;
  right: 40px;

  .ant-btn {
    margin-left: 10px;
    width: 80px;
    height: 34px;
    background: transparent;
    border: 1px solid #04a3f7;
    color: #04a3f7;
  }
}

#warehouse_top {
  width: 248px;
  height: 290px;
  bottom: 30px;
}

.vjs-control {
  background-color: #00db00;
  width: 20px;
  height: 20px;
}

//任务产值分析样式
.line {
  padding-right: 10px;
}
.common_chart {
  height: 260px;
  padding-left: 10px;
}
/deep/.ant-input {
  background-color: #0e2240 !important;
  border: 1px solid #274368 !important;
}

/deep/ .ant-calendar-range-picker-input {
  color: #ffffff;
}
/deep/ .ant-calendar-range-picker-separator {
  color: #ffffff;
}
</style>