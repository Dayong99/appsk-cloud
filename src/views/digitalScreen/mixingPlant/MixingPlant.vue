<template>
  <div class="project_overview">
    <!-- 顶部按钮 -->
    <div class="top_nav">
      <!-- 站点名称 -->
      <div class="public_select">
        <a-select
          v-model="selectedMixer"
          style="width: auto"
          :showArrow="false"
          dropdownClassName="dropdown-style"
          :dropdownMatchSelectWidth="false"
          :defaultActiveFirstOption="false"
          @select="onTaskSelect"
        >
          <a-select-option v-for="(item, index) in mixerBtn" :key="index" @click="switchMixer(item.stationId, index)">
            {{ item.txt }}
          </a-select-option>
        </a-select>
        <img src="../../../assets/digitalScreen-images/xl.png" class="mixerArrow" />
      </div>
      <!-- 任务名称 -->
      <div class="public_select">
        <a-select
          v-model="defaultTaskValue"
          style="width: auto"
          :showArrow="false"
          dropdownClassName="dropdown-style"
          :dropdownMatchSelectWidth="false"
          :defaultActiveFirstOption="false"
          @select="onTaskSelect"
        >
          <a-select-option v-for="(item, index) in taskTitleSource" :key="index">
            {{ item }}
          </a-select-option>
        </a-select>
        <img src="../../../assets/digitalScreen-images/xl.png" class="mixerArrow" />
      </div>
      <!-- 历史数据 -->
      <div class="seeHistory" type="primary" @click="showModal">
        <a-icon type="eye" theme="filled" />
        <span>查看历史数据</span>
      </div>
      <a-modal
        :visible="visible"
        :confirm-loading="confirmLoading"
        :footer="null"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <p>历史数据</p>
        <form action="">
          <div class="serch">
            <span>任务名称：</span>
            <input placeholder="请输入任务名" v-model="taksSearching" class="taksSearching" />
            <span>时间筛选：</span>
            <a-range-picker @change="onChange" @calendarChange="calendarChange" :ranges="ranges" />
            <a-button @click="clicInquire">查询</a-button>
            <input type="reset" name="button" id="button" value="重置" class="reset" @click="resetClick"/>
          </div>
          <table>
            <thead>
              <tr>
                <td>站点名称</td>
                <td>任务名称</td>
                <td>配比编号</td>
                <!-- <td>计划方数</td> -->
                <td>完成方数</td>
                <td>时间</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in taskListDataSourceAll" :key="index">
                <td>{{ item.stationId_dictText }}</td>
                <td>{{ item.taskName }}</td>
                <td>{{ item.recipeNo }}</td>
                <!-- <td>{{ item.planCount }}</td> -->
                <td>{{ item.quantity }}</td>
                <td>{{ item.deliveryDate }}</td>
              </tr>
            </tbody>
          </table>
          <a-pagination :defaultCurrent="defaultCurrent" :current="page"  :showQuickJumper="true" :total="total" @change="nextPage" class="down" />
        </form>
      </a-modal>
    </div>
    <!-- 中间盒子 -->
    <div class="center_count">
      <div class="jiaobiao"></div>
      <div class="count_left">
        <div class="message">
          <div class="tittle">
            <span>任务信息</span>
            <img src="../../../assets/digitalScreen-images/user.png" alt="" />
          </div>
          <table>
            <tr>
              <td>搅拌站名：</td>
              <td>{{ taskDataSource.stationId_dictText }}</td>
            </tr>
            <tr>
              <td>工程名称：</td>
              <td>{{ taskDataSource.projectName }}</td>
            </tr>
            <tr>
              <td>生产时间：</td>
              <td>{{ taskDataSource.createTime }}</td>
            </tr>
            <tr>
              <td>协作队伍：</td>
              <td>{{ taskDataSource.projectCmpy }}</td>
            </tr>
            <tr>
              <td>施工部位：</td>
              <td>{{ taskDataSource.projectPart }}</td>
            </tr>
            <tr>
              <td>送货地址：</td>
              <td>{{ taskDataSource.shipToAdd1 }}</td>
            </tr>
          </table>
        </div>
        <div class="message">
          <div class="tittle">
            <span>车辆信息</span>
            <img src="../../../assets/digitalScreen-images/car.png" alt="" />
          </div>
          <table>
            <tr>
              <td>车号：</td>
              <td>{{ billDataSource.truckId }}</td>
            </tr>
            <tr>
              <td>运距：</td>
              <td>{{ billDataSource.distance }}</td>
            </tr>
            <tr>
              <td>司机姓名：</td>
              <td>{{ billDataSource.reserve2 }}</td>
            </tr>
            <tr>
              <td>浇筑方式：</td>
              <td>{{ billDataSource.workMethod }}</td>
            </tr>
            <tr>
              <td>备注：</td>
              <td>{{ billDataSource.memo2 }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="count_center">
        <div class="tips1">
          <div class="left">
            <img src="../../../assets/digitalScreen-images/tips_left.png" alt="" />
          </div>
          <div class="right">
            <p>
              混合站混凝土搅拌楼 <br />
              2套120搅拌机、配套6个水泥罐
            </p>
          </div>
        </div>
        <div class="tips2">
          <div class="left">
            <img src="../../../assets/digitalScreen-images/tips_left.png" alt="" />
          </div>
          <div class="right">
            <p>搅拌站料仓 <br />设置6个料仓(均为15*35m)</p>
          </div>
        </div>
      </div>
      <div class="count_right">
        <div class="message">
          <div class="tittle">
            <span>产品信息</span>
            <img src="../../../assets/digitalScreen-images/product.png" alt="" />
          </div>
          <table>
            <tr>
              <td>水泥牌号：</td>
              <td>{{ billDataSource.cementName }}</td>
            </tr>
            <tr>
              <td>配比编号：</td>
              <td>{{ billDataSource.recipeNo }}</td>
            </tr>
            <tr>
              <td>坍塌度：</td>
              <td>{{ billDataSource.tld }}</td>
            </tr>
            <tr>
              <td>强度等级：</td>
              <td>{{ billDataSource.intensityLevel }}</td>
            </tr>
            <tr>
              <td>单车总盘数：</td>
              <td>{{ billDataSource.totalItemNo }}</td>
            </tr>
            <tr>
              <td>单车盘数：</td>
              <td>{{ billDataSource.itemNo }}</td>
            </tr>
            <tr>
              <td>累计方数：</td>
              <td>{{ billDataSource.endCount }}</td>
            </tr>
            <tr>
              <td>累计车数：</td>
              <td>{{ billDataSource.outCount }}</td>
            </tr>
          </table>
          <div class="number">
            <div class="left">
              <p class="num">{{ billDataSource.planCount }}</p>
              <p>计划方数</p>
              <img src="../../../assets/digitalScreen-images/footer.png" alt="" />
            </div>
            <div class="right">
              <p class="num">{{ billDataSource.quantity }}</p>
              <p>生产方数</p>
              <img src="../../../assets/digitalScreen-images/footer.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部图表 -->
    <div class="bottom_count">
      <div class="jiaobiao"></div>
      <div class="numbers">
        <p>当前出货单号</p>
        <div class="numbers_select">
          <a-select
            v-model="defaultBillValue"
            :showArrow="false"
            dropdownClassName="dropdown-style"
            :dropdownMatchSelectWidth="false"
            :defaultActiveFirstOption="false"
            @select="onBillSelect"
          >
            <a-select-option v-for="(item, index) in billTitleSource" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>
          <img src="../../../assets/digitalScreen-images/xl.png" class="mixerArrow" />
        </div>
      </div>
      <div id="bottomEcharts"></div>
    </div>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress } from '@/api/manage'
import images from '@/utils/Imgaes.js'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'

export default {
  name: 'TestRoom',
  components: {},
  data() {
    return {
      deliveryDate_beginL: '', //开始时间
      deliveryDate_end: '', // 结束时间
      taksSearching: '',
      selectDate: null,
      //中文本地化
      locale: zhCN,
      defaultCurrent:1,
      //预设常用日期范围快捷方式
      ranges: {
        // 一月内: () => [moment('2021-06-10', 'YYYY:MM:DD'), moment('2021-07-10', 'YYYY:MM:DD')],
        一月内: () => [moment().startOf('day').subtract(1, 'month'), moment()],
        昨天: () => [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
        最近一周: () => [moment().startOf('day').subtract(1, 'weeks'), moment()],
      },
      total: '',
      options: {
        images: images,
      },
      visible: false,
      confirmLoading: false,
      mixerBtn: [
        {
          stationId: '',
          txt: '',
        },
      ],
      selectedMixer: 0,
      defaultTaskValue: '',
      defaultTaskValueAll: '',
      taskTitleSource: [],
      taskTitleSourceAll: [],
      taskListDataSource: [
        {
          stationId_dictText: '',
          projectName: '',
          customerName: '',
          projectCmpy: '',
          projectPart: '',
          shipAdd: '',
          taskId: '',
          recipeNo: '',
          planCount: '',
          quantity: '',
          createTime: '',
          shipToAdd1:'',
        },
      ],
      taskListDataSourceAll: [
        {
          stationId_dictText: '',
          projectName: '',
          customerName: '',
          projectCmpy: '',
          projectPart: '',
          shipAdd: '',
          taskId: '',
          recipeNo: '',
          planCount: '',
          quantity: '',
          deliveryDate: '',
        },
      ],
      taskDataSource: {
        stationId_dictText: '',
        projectName: '',
        customerName: '',
        projectCmpy: '',
        projectPart: '',
        shipAdd: '',
        taskId: '',
      },
      billListDataSource: [
        {
          planCount: '',
          quantity: '',
          totalItemNo: '',
          itemNo: '',
          dname: '',
          recipeNo: '',
          tld: '',
          intensityLevel: '',
          endCount: '',
          outCount: '',
          truckId: '',
          distance: '',
          reserve2: '',
          workMethod: '',
          memo2: '',
        },
      ],
      billDataSource: {
        cementName: '',
        planCount: '',
        quantity: '',
        totalItemNo: '',
        itemNo: '',
        dname: '',
        recipeNo: '',
        tld: '',
        intensityLevel: '',
        endCount: '',
        outCount: '',
        truckId: '',
        distance: '',
        reserve2: '',
        workMethod: '',
        memo2: '',
      },
      defaultBillValue: '',
      billTitleSource: [],

      universalList: [
        {
          testNo: '',
          deviceNumber_dictText: '',
          deviceNumber: '',
          testTypeCode_dictText: '',
          sampleCode: '',
          operator: '',
        },
      ],
      universalData: {
        testNo: '',
        deviceNumber_dictText: '',
        deviceNumber: '',
        testTypeCode_dictText: '',
        sampleCode: '',
        operator: '',
      },
      testList: [
        {
          serialNum: '',
          testLoad: '',
          stress: '',
        },
      ],
      selectedPress: 0,
      currentIndex: '',
      deviceCatagory: 0,
      // columns:[
      //   {title:'试件',key:'1',dataIndex:'curOrder',width:90},
      //   {title:'抗拉强度(MPa)',key:'2',dataIndex:'kyqd',width:130},
      //   {title:'下屈服力(kN)',key:'3',dataIndex:'feL',width:120},
      //   {title:'下屈服强度(MPa)',key:'4',dataIndex:'peL',width:150},
      //   {title:'最大力(kN)',key:'5',dataIndex:'maxLoad',width:90},
      //   {title:'最大总延伸率(%)',key:'6',dataIndex:'agt',width:150}
      // ],
      unTableData: [{ curOrder: '', kyqd: '', feL: '', peL: '', maxLoad: '', agt: '' }],
      getDynamics: '', //材料动态数据
      materialsName: [], //材料动态数据中的所有材料的名称
      inTotal: [], //材料动态数据中的所有材料的累计已进场
      outTotal: [], //材料动态数据中的所有材料的累计已使用
      page:1
    }
  },
  mounted() {
    this.checkMenu();
    this.drawLine()
    this.getDevice()
  },
  methods: {
    moment,
    checkMenu() {
      console.log('this.$route', this.$route)
      let arr = this.$store.state.enhance.menuList;
      let path = this.$route.path // /videoManagement/VideoManage
      arr.forEach((value, index) => {
        if (value.url == path) {
          this.currentIndex = value.index;
        }
      })
      this.$store.commit('dsHeadIndex', this.currentIndex)
    },
    // //选择后的事件
    onChange(date, dateString) {
      this.deliveryDate_begin = dateString[0]
      this.deliveryDate_end = dateString[1]
      // console.log(date, dateString)
    },
    // 点击重置
    resetClick(){
      this.taksSearching = ''
       this.deliveryDate_begin = ''
       this.deliveryDate_end = ''
       let arr = {
        pageNo: 1,
        pageSize: 10,
       }
       this.taskListDataSourceAll = []
      this.taskTitleSourceAll = []
      // this.defaultCurrent = 1,
      this.page = 1,
        this.fenGetActionG(arr)
    },
    clicInquire() {
      this.taskListDataSourceAll = []
      this.taskTitleSourceAll = []
      //  console.log(this.taksSearching)
      let arr = {
        pageNo:1,
        pageSize: 10,
      }
      this.page = 1;
      // console.log(this.taksSearching)
      // console.log(this.deliveryDate_begin)
      if (this.taksSearching && this.deliveryDate_begin) {
        arr.taskName = this.taksSearching
        arr.deliveryDate_begin = this.deliveryDate_begin
        arr.deliveryDate_end = this.deliveryDate_end
        this.fenGetActionG(arr)
      } else {
        if (this.taksSearching) {
          arr.taskName = this.taksSearching
          this.fenGetActionG(arr)
        } else {
          arr.deliveryDate_begin = this.deliveryDate_begin
          arr.deliveryDate_end = this.deliveryDate_end
          this.fenGetActionG(arr)
        }
      }
    },
    fenGetActionG(arr) {
      getAction('/ms/outMaster/historyData', arr).then((res) => {
        if (res.code == 200) {
          // console.log(res)
          this.total = res.result.total
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((value, index) => {
              this.taskTitleSourceAll.push(value.taskName)
              this.taskListDataSourceAll.push({
                stationId_dictText: value.stationId_dictText,
                taskName: value.taskName,
                recipeNo: value.recipeNo,
                planCount: value.planCount,
                quantity: value.quantity,
                deliveryDate: value.deliveryDate,
              })
            })
          }
        }
      })
    },
    //选中日期事件
    calendarChange(date, dateString) {
      if (date.length <= 1) {
        //选中开始日期事件，设置结束日期必须大于5天
        this.selectDate = date[0].add(5, 'days')
      } else {
        this.selectDate = null
      }
    },

    showModal() {
      this.visible = true
    },
    nextPage(page) {
      this.page = page;
      getAction('/ms/outMaster/historyData', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        pageNo: this.page,
        pageSize: 10,
        deliveryDate_begin : this.deliveryDate_begin,
        deliveryDate_end : this.deliveryDate_end,
        taskName: this.taksSearching
      }).then((res) => {
        if (res.code == 200) {
          // console.log(res)
          if (this.taskTitleSourceAll.length > 0) {
            this.taskTitleSourceAll.splice(0, this.taskTitleSourceAll.length)
          }
          if (this.taskListDataSourceAll.length > 0) {
            this.taskListDataSourceAll.splice(0, this.taskListDataSourceAll.length)
          }
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((value, index) => {
              this.taskTitleSourceAll.push(value.taskName)
              this.taskListDataSourceAll.push({
                stationId_dictText: value.stationId_dictText,
                taskName: value.taskName,
                recipeNo: value.recipeNo,
                planCount: value.planCount,
                quantity: value.quantity,
                deliveryDate: value.deliveryDate,
              })
            })
          }
        }
      })
    },
    handleOk(e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel(e) {
      this.visible = false
    },
    taksSear() {
      // cons
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
    getDevice() {
      getAction('/deviceManage/device/list', {
        deviceCatagory: 'mixer',
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          this.mixerBtn.splice(0, this.mixerBtn.length)
          let data = res.result.records
          data.forEach((value, index) => {
            this.mixerBtn.push({ stationId: value.deviceNumber, txt: value.deviceName })
          })
          this.getMixerTaskList(this.mixerBtn[0].stationId)
          this.getMixerTaskListAll(this.mixerBtn[0].stationId)
        }
      })
    },
    getMixerTaskList(id) {
      getAction('/ms/task/list', {
        stationId: id,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        column: 'planDate',
        order: 'desc',
      }).then((res) => {
        if (res.code == 200) {
          //   console.log(res);
          if (this.taskTitleSource.length > 0) {
            this.taskTitleSource.splice(0, this.taskTitleSource.length)
          }
          if (this.taskListDataSource.length > 0) {
            this.taskListDataSource.splice(0, this.taskListDataSource.length)
          }
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((value, index) => {
              this.taskTitleSource.push(value.taskName)
              this.taskListDataSource.push({
                stationId_dictText: value.stationId_dictText,
                projectName: value.projectName,
                customerName: value.customerName,
                projectCmpy: value.projectCmpy,
                projectPart: value.projectPart,
                shipAdd: value.shipAdd,
                taskId: value.taskId,
                recipeNo: value.recipeNo,
                planCount: value.planCount,
                quantity: value.quantity,
                createTime: value.createTime,
                shipToAdd1:value.shipToAdd1
              })
            })
            this.defaultTaskValue = this.taskTitleSource[0]
            this.taskDataSource = this.taskListDataSource[0]
            this.getMixerBillList(id, this.taskDataSource.taskId)
          }
        }
      })
    },
    //   查看历史弹窗/调取所有任务
    getMixerTaskListAll() {
      let _that = this
      getAction('/ms/outMaster/historyData', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        column: 'deliveryDate',
        order: 'desc'
      }).then((res) => {
        if (res.code == 200) {
          // console.log(res)
          _that.total = res.result.total
          if (this.taskTitleSourceAll.length > 0) {
            this.taskTitleSourceAll.splice(0, this.taskTitleSourceAll.length)
          }
          if (this.taskListDataSourceAll.length > 0) {
            this.taskListDataSourceAll.splice(0, this.taskListDataSourceAll.length)
          }
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((value, index) => {
              this.taskTitleSourceAll.push(value.taskName)
              this.taskListDataSourceAll.push({
                stationId_dictText: value.stationId_dictText,
                taskName: value.taskName,
                recipeNo: value.recipeNo,
                planCount: value.planCount,
                quantity: value.quantity,
                deliveryDate: value.deliveryDate,
              })
            })
            this.defaultTaskValueAll = this.taskTitleSourceAll[0]
          }
        }
      })
    },
    getMixerBillList(stationId, taskId) {
      getAction('/ms/outMaster/list', {
        stationId: stationId,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        taskId: taskId,
        column: 'deliveryDate',
        order: 'desc'
      }).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          if (this.billListDataSource.length > 0) {
            this.billListDataSource.splice(0, this.billListDataSource.length)
          }
          if (this.billTitleSource.length > 0) {
            this.billTitleSource.splice(0, this.billTitleSource.length)
          }
          let data = res.result.records
          if (data.length != 0) {
            data.forEach((value, index) => {
              for (let k in value) {
                value[k] = value[k] === null || value[k] === undefined || value[k] === '' ? '--' : value[k]
              }
              this.billListDataSource.push({
                cementName: value.cementName,
                planCount: value.planCount,
                quantity: value.quantity,
                totalItemNo: value.totalItemNo,
                itemNo: value.itemNo,
                dname: value.dname,
                recipeNo: value.recipeNo,
                tld: value.tld,
                intensityLevel: value.intensityLevel,
                endCount: value.endCount,
                outCount: value.outCount,
                truckId: value.truckId,
                distance: value.distance,
                reserve2: value.reserve2,
                workMethod: value.workMethod,
                memo2: value.memo2,
              })
              this.billTitleSource.push(value.deliveryId)
            })
            this.billDataSource = this.billListDataSource[0]
            this.defaultBillValue = this.billTitleSource[0]
            this.getMixerProductList(stationId, this.defaultBillValue)
          }
        }
      })
    },

    getMixerProductList(stationId, deliveryId) {
      getAction('/ms/manufacture/queryBsManufacture', {
        stationId: stationId,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        deliveryId: deliveryId,
      }).then((res) => {
        if (res.code == 200) {
          // console.log(res)
          if (this.materialsName.length > 0) {
            this.materialsName.splice(0, this.materialsName.length)
          }
          if (this.inTotal.length > 0) {
            this.inTotal.splice(0, this.inTotal.length)
          }
          if (this.outTotal.length > 0) {
            this.outTotal.splice(0, this.outTotal.length)
          }
          this.getDynamics = res.result
          this.getDynamics.forEach((item, index) => {
            if (item.actual != 0) {
              this.materialsName.push(item.name)
            }
          })
          this.getDynamics.forEach((item, index) => {
            if (item.actual != 0) {
              this.inTotal.push(item.actual)
            }
          })
          this.getDynamics.forEach((item, index) => {
            if (item.actual != 0) {
              this.outTotal.push(item.recipe)
            }
          })
          this.getDynamics.forEach((item, index) => {
            let bottomEcharts = this.$echarts.init(document.getElementById('bottomEcharts'))
            bottomEcharts.setOption({
              grid: {
                top: '15%',
                left: '50px',
                right: '50px',
                bottom: '50px',
              },
              tooltip: {
                trigger: 'axis',
              },
              legend: {
                data: ['实际值', '配方值'],
                x: '40%',
                y: '1%',
                textStyle: {
                  //图例文字的样式
                  color: '#fff',
                  fontSize: 12,
                },
              },
              calculable: true,
              xAxis: {
                type: 'category',
                axisTick: { show: false },
                axisLine: {
                  show: false,
                  lineStyle: {
                    type: 'dashed',
                    color: '#fff',
                  },
                },
                data: this.materialsName,
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
                  name: '实际值',
                  type: 'bar',
                  barWidth: 10, //柱图宽度
                  barGap: '0.1' /*多个并排柱子设置柱子之间的间距*/,
                  barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
                  data: this.inTotal,
                  itemStyle: {
                    normal: {
                      color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.1, color: '#05C3B8' }, //柱图渐变色
                        { offset: 1, color: '#09AEDB' }, //柱图渐变色
                      ]),
                    },
                  },
                },
                {
                  name: '配方值',
                  type: 'bar',
                  barWidth: 10, //柱图宽度
                  data: this.outTotal,
                  itemStyle: {
                    normal: {
                      color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.1, color: '#2DCC92' }, //柱图渐变色
                        { offset: 1, color: '#66D95A' }, //柱图渐变色
                      ]),
                    },
                  },
                },
              ],
            })
          })
        }
      })
    },
    drawLine() {
      let bottomEcharts = this.$echarts.init(document.getElementById('bottomEcharts'))
      bottomEcharts.setOption({
        grid: {
          top: '15%',
          left: '50px',
          right: '50px',
          bottom: '50px',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['累计已进场', '累计已使用'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
        },
        calculable: true,
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#fff',
            },
          },
          data: [
            '小石料(S2)',
            '中石料(G2)',
            '大石料(G1)',
            '沙子1',
            '沙子(S1)',
            '水泥1',
            '水泥2',
            '水泥3',
            '水泥4',
            '粉煤灰',
            '矿粉',
            '水',
            '污水',
            '添加剂1',
            '添加剂2',
          ],
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
            name: '累计已进场',
            type: 'bar',
            barWidth: 10, //柱图宽度
            barGap: '0.1' /*多个并排柱子设置柱子之间的间距*/,
            barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
            data: [1, 3, 4, 2, 3, 2, 4],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: '#05C3B8' }, //柱图渐变色
                  { offset: 1, color: '#09AEDB' }, //柱图渐变色
                ]),
              },
            },
          },
          {
            name: '累计已使用',
            type: 'bar',
            barWidth: 10, //柱图宽度
            data: [1, 3, 4, 2, 3, 2, 4],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: '#2DCC92' }, //柱图渐变色
                  { offset: 1, color: '#66D95A' }, //柱图渐变色
                ]),
              },
            },
          },
        ],
      })
    },
    switchMixer(id, index) {
      this.selectedMixer = index
      // console.log(id);
      this.getMixerTaskList(id)
    },
    onTaskSelect(value) {
      this.taskDataSource = this.taskListDataSource[value]
      this.getMixerBillList(this.mixerBtn[this.selectedMixer].stationId, this.taskDataSource.taskId)
    },
    onTaskSelect1(value) {
      this.taskDataSourceAll = this.taskListDataSourceAll[value]
    },
    onBillSelect(value) {
      this.getMixerProductList(this.mixerBtn[this.selectedMixer].stationId, value)
    },
    countErrorRate(num1, num2) {
      let val = this.Subtr(num2, num1)
      let result = parseFloat(this.accDiv(val, num1))
      result = (result * 100).toFixed(2)
      if (result == 'NaN') {
        result = '0'
      }
      return result + '%'
    },

    handleUniversalData(id, index) {
      getAction('/universal/universalRecord/queryUniversalRecordSubByMainId', {
        id: id,
      }).then((res) => {
        if (res.code == 200) {
          if (this.unTableData.length > 0) {
            this.unTableData.splice(0, this.unTableData.length)
          }
          let data = res.result
          data.forEach((value, index) => {
            this.unTableData.push({
              curOrder: value.curOrder,
              kyqd: value.kyqd,
              feL: value.feL,
              peL: value.peL,
              maxLoad: value.maxLoad,
              agt: value.agt,
            })
          })
        }
      })
      this.universalData = this.universalList[index]
    },
    Subtr(arg1, arg2) {
      //减法
      var r1, r2, m, n
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      n = r1 >= r2 ? r1 : r2
      return ((arg1 * m - arg2 * m) / m).toFixed(n)
    },
    accMul(arg1, arg2) {
      //乘法
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
    },
    accDiv(arg1, arg2) {
      //除法
      var t1 = 0,
        t2 = 0,
        r1,
        r2
      try {
        t1 = arg1.toString().split('.')[1].length
      } catch (e) {}
      try {
        t2 = arg2.toString().split('.')[1].length
      } catch (e) {}
      r1 = Number(arg1.toString().replace('.', ''))
      r2 = Number(arg2.toString().replace('.', ''))
      return this.accMul(r1 / r2, Math.pow(10, t2 - t1))
    },
  },
}
</script>

<style  scoped lang="less">
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

div {
  box-sizing: border-box;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  font-weight: 400;
  color: #fff;
}
li {
  list-style: none;
}
.public_select {
  margin-right: 10px;
  padding-right: 20px;
  display: inline-block;
  background: linear-gradient(0deg, #194594, #0370c4);
}
// 下拉列表
/deep/.ant-select-selection {
  position: relative;
  padding: 0 10px;
  margin-right: 10px;
  background: none;
  border: none;
  border-radius: 0;
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -50px;
    bottom: -20px;
    left: 10px;
  }
}

// 分页
/deep/.ant-pagination {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  .ant-pagination-item-ellipsis {
    color: #fff;
  }
}
/deep/.ant-pagination {
    color:#fff;
  .ant-pagination-item, .ant-pagination-item-link {
    width: 40px;
    background: rgba(4, 163, 247, .5);
    border: none;
    color:#fff !important;
    transition: all 0.2s ease-in-out;
    &:hover {
      border: 1px solid #fff;
      box-shadow: 0px 0px 10px rgba(255, 255, 255, .5);
      transform: scale(1.1);
    }
  }
  .ant-pagination-item a {
    color:#fff !important;

  }
  .ant-pagination-options-quick-jumper input {
    background: rgba(12, 32, 65, 1);
    border: 1px solid rgba(26, 55, 103, 1);
    color:#fff;
  }
}
.project_overview {
  width: 100%;
  height: auto;
  //顶部按钮
  .top_nav {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid rgba(1, 87, 174, 0.5);
    .mixing_serch,
    .task_serch {
      display: inline-block;
      width: 193px;
      height: 35px;
      padding: 0 10px;
      background: linear-gradient(0deg, #194594, #0370c4);
      color: #fff;
      line-height: 35px;
      img {
        float: right;
        margin-top: 14px;
      }
    }
    .task_serch {
      width: 278px;
      margin-left: 10px;
    }
    .seeHistory {
      float: right;
      color: rgba(65, 237, 241, 1);
      cursor: pointer;
      span {
        margin-left: 5px;
      }
    }
  }
  .center_count,
  .bottom_count {
    display: flex;
    position: relative;
    width: 100%;
    height: 596px;
    border: 1px solid rgba(1, 87, 174, 0.5);
    margin-top: 20px;
    box-shadow: 0px 0px 20px rgba(18, 97, 147, 0.5) inset;
    .count_left,
    .count_right {
      width: 494px;
      height: 100%;
      float: left;
      .message {
        width: 100%;
        height: 48%;
        .tittle {
          margin-top: 20px;
          position: relative;
          width: 457px;
          height: 60px;
          span {
            position: absolute;
            right: 76px;
            font-size: 18px;
            line-height: 60px;
          }
          img {
            position: absolute;
            top: 16px;
            right: 26px;
          }
          &::before {
            position: absolute;
            left: 0;
            width: 457px;
            height: 60px;
            content: '';
            background: url(../../../assets/digitalScreen-images/tittle_bg.png) no-repeat;
            transform: rotate(180deg);
          }
        }
        table {
          float: right;
          margin: 20px 40px 0 0;
          width: 346px;
          tr {
            height: 35px;
            td {
              width: 30%;
              text-align: right;
              line-height: 30px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            td:nth-child(2) {
              width: 70%;
              text-align: left;
              text-indent: 2em;
            }
          }
          tr:nth-child(2n + 1) {
            height: 30px;
            background: rgba(65, 160, 235, 0.15);
          }
        }
      }
    }
    .count_center {
      position: relative;
      float: left;
      margin-top: 15px;
      width: 860px;
      height: 560px;
      background: url(../../../assets/digitalScreen-images/111.png) no-repeat center;
      background-size: auto 100%;
      .tips1 {
        position: absolute;
        left: 453px;
        top: 218px;
        position: relative;
        width: 300px;
        height: 150px;
        .left {
          position: absolute;
          top: 37px;
          left: 0;
          width: 54px;
          height: 54px;
        }
        .right {
          position: absolute;
          top: 0;
          left: 36px;
          width: 250px;
          height: 72px;
          background: url(../../../assets/digitalScreen-images/tips_right.png);
          p {
            margin: 12px 0 0 36px;
          }
        }
      }
      .tips2 {
        position: absolute;
        left: 52px;
        top: 149px;
        position: relative;
        width: 300px;
        height: 150px;
        .left {
          position: absolute;
          top: 37px;
          right: 0;
          width: 54px;
          height: 54px;
        }
        .right {
          position: absolute;
          top: 0;
          right: 36px;
          width: 250px;
          height: 72px;
          background: url(../../../assets/digitalScreen-images/tips_right.png);
          transform: scaleX(-1);
          p {
            text-align: right;
            margin: 12px 0 0 36px;
            transform: rotateY(180deg);
          }
        }
      }
    }
    .count_right {
      position: relative;
      .message {
        height: 100%;
        .tittle {
          span {
            position: absolute;
            left: 73px;
          }
          img {
            position: absolute;
            top: 14px;
            left: 29px;
          }
          &::before {
            transform: rotate(0deg);
          }
        }
        table {
          float: left;
        }
      }
      .number {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 355px;
        height: 200px;
        .left,
        .right {
          flex: 1;
          width: 149px;
          height: 79px;
          background: url(../../../assets/digitalScreen-images/jhfs.png) no-repeat center;
          text-align: center;
          .num {
            font-size: 28px;
            margin: 45px 0 20px;
          }
        }
        .right {
          background: url(../../../assets/digitalScreen-images/scfs.png) no-repeat center;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 20px;
      height: 20px;
      border-top: 2px solid rgba(4, 163, 247, 1);
      border-left: 2px solid rgba(4, 163, 247, 1);
    }
    &::after {
      content: '';
      position: absolute;
      top: -1px;
      right: -1px;
      width: 20px;
      height: 20px;
      border-top: 2px solid rgba(4, 163, 247, 1);
      border-right: 2px solid rgba(4, 163, 247, 1);
    }
    .jiaobiao {
      position: absolute;
      bottom: 0;
      width: 100%;
      &::before {
        content: '';
        position: absolute;
        bottom: -1px;
        left: -1px;
        width: 20px;
        height: 20px;
        border-bottom: 2px solid rgba(4, 163, 247, 1);
        border-left: 2px solid rgba(4, 163, 247, 1);
      }
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        right: -1px;
        width: 20px;
        height: 20px;
        border-bottom: 2px solid rgba(4, 163, 247, 1);
        border-right: 2px solid rgba(4, 163, 247, 1);
      }
    }
  }
  .bottom_count {
    display: flex;
    width: 100%;
    height: 205px;
    border: 1px solid #126193;
    .numbers {
      width: 200px;
      p {
        margin-top: 60px;
        font-size: 20px;
        color: #41edf1;
        text-align: center;
      }
      .numbers_select {
        background: rgba(65, 160, 235, 0.2);
        border: 1px solid #00a0e9;
        border-radius: 18px;
        margin: 20px 40px 0 40px;
      }
    }
    #bottomEcharts {
      width: 100%;
      height: 100%;
    }
  }
}
/deep/.ant-modal {
  width: 1100px !important;
  height: 700px !important;
}
/deep/.ant-modal-content {
  position: relative;
  padding: 0 47px 0 23px;
  width: 1100px;
  height: 700px;
  color: #fff;
  background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;
  background-size: 100% 100% !important;
  .serch {
    margin: 25px 0 0 50px;
    .taksSearching {
      display: inline-block;
      width: 232px;
      height: 30px;
      background: #0c2041;
      border: 1px solid #1a3767;
      border-radius: 3px;
      padding: 0 10px;
      margin-right: 28px;
      line-height: 28px;
      color: #efefef;
      font-size: 12px;
      outline: none;
      img {
        float: right;
        margin-top: 10px;
      }
    }
    .ant-input {
      width: 250px;
      background: #0c2041;
      border: 1px solid #1a3767;
      border-radius: 3px;
      margin-right: 90px;
      color: #fff;
    }

    .ant-btn,
    .reset {
      width: 70px;
      height: 30px;
      margin-right: 10px;
      border: 1px solid #0587cf;
      border-radius: 3px;
      color: #0587cf;
      background: none;
    }
    .ant-btn:hover,
    .reset:hover {
      background: rgba(4, 163, 247, 1);
      color: #fff;
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
      height: 400px;
      overflow: hidden;
      tr {
        height: 30px;
      }
      tr:nth-child(2n + 2) {
        height: 32px;
        background: rgba(13, 35, 70, 0.8);
      }
    }
  }
  .down {
    position: absolute;
    left: 50%;
    bottom: 60px;
  }
}
/deep/.ant-modal-close {
  margin-top: 38px;
  margin-right: 2px;
  color: transparent;
  background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
  i {
    display: none;
  }
}
</style>