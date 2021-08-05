<template>
  <div class="project_overview">
    <a-row class="project" :gutter="16">
      <div class="project_left">
        <!-- 人员统计 -->
        <div class="PersonnelStatistics frame">
          <!-- 边角 -->
          <div class="span_icon top_left_icon"></div>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            <a-button
              v-for="(item, index) of deviceBtn"
              :key="index"
              @click="switchdevice(item.id, index)"
              :class="selectedPress == index ? 'active' : ''"
              :disabled="selectedPress == index ? true : false"
              >{{ item.txt }}</a-button
            >
          </p>
          <div class="PersonnelStatistics_top">
            <div class="PersonnelQuantity">
              <p>
                <span>{{ PersonnelStatistics.scene }}</span> <br />
                在场总人数
              </p>
            </div>
            <div class="PersonnelQuantity">
              <p>
                <span>{{ PersonnelStatistics.project }}</span> <br />
                项目管理人员
              </p>
            </div>
            <div class="PersonnelQuantity">
              <p>
                <span>{{ PersonnelStatistics.work }}</span> <br />
                施工作业人员
              </p>
            </div>
          </div>
          <div class="PersonnelStatistics_bottom">
            <div class="PersonnelMessage">
              <img src="../../../assets/digitalScreen-images/zl.png" alt="" />
              <p>
                在册总人数 <br />
                <span>{{ PersonnelStatistics.registered }}</span>
              </p>
            </div>
            <div class="PersonnelMessage">
              <img src="../../../assets/digitalScreen-images/dk.png" alt="" />
              <p>
                今日打卡人数 <br />
                <span>{{ PersonnelStatistics.clock }}</span>
              </p>
            </div>
            <div class="PersonnelMessage">
              <img src="../../../assets/digitalScreen-images/cd.png" alt="" />
              <p>
                今日迟到人数 <br />
                <span>{{ PersonnelStatistics.beLate }}</span>
              </p>
            </div>
            <div class="PersonnelMessage">
              <img src="../../../assets/digitalScreen-images/zt.png" alt="" />
              <p>
                今日早退人数 <br />
                <span>{{ PersonnelStatistics.leaveEarly }}</span>
              </p>
            </div>
          </div>
          <div class="PersonnelStatistics_compile" type="primary" @click="showModal9">
            <img src="../../../assets/digitalScreen-images/compile.png" alt="" />
          </div>
          <a-modal v-model="visible9" :centered="true" :footer="null">
            <p>人员统计</p>
            <form method="Post" action="Post.aspx">
              <table>
                <tr>
                  <td class="left">在场总人数</td>
                  <td class="right"><input type="number" min="0" v-model="formList.scene" placeholder="请输入" /></td>
                </tr>
                <tr>
                  <td class="left">项目管理人员</td>
                  <td class="right"><input type="number" min="0" v-model="formList.project" placeholder="请输入" /></td>
                </tr>
                <tr>
                  <td class="left">施工作业人员</td>
                  <td class="right"><input type="number" min="0" v-model="formList.work" placeholder="请输入" /></td>
                </tr>
                <tr>
                  <td class="left">在册总人数</td>
                  <td class="right">
                    <input type="number" min="0" v-model="formList.registered" placeholder="请输入" />
                  </td>
                </tr>
                <tr>
                  <td class="left">今日打卡人数</td>
                  <td class="right"><input type="number" min="0" v-model="formList.clock" placeholder="请输入" /></td>
                </tr>
                <tr>
                  <td class="left">今日迟到人数</td>
                  <td class="right"><input type="number" min="0" v-model="formList.beLate" placeholder="请输入" /></td>
                </tr>
                <tr>
                  <td class="left">今日早退人数</td>
                  <td class="right">
                    <input type="number" min="0" v-model="formList.leaveEarly" placeholder="请输入" />
                  </td>
                </tr>
              </table>
              <a-button @click="SubmitForm" type="submit" class="ok">确认</a-button>
              <a-button type="submit" class="onOk" @click="handleCancel">取消</a-button>
            </form>
          </a-modal>
        </div>
        <!-- 班组统计 -->
        <div class="TeamStatistics frame">
          <!-- 边角 -->
          <div class="span_icon top_left_icon"></div>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            班组统计
          </p>
          <div id="TeamStatisticsEcharts"></div>
        </div>
      </div>
      <div class="project_center">
        <!-- 今日劳动力 -->
        <div class="videoBox frame">
          <h4>今日劳动力</h4>
          <div class="videoBox_top">
            <div class="videoBox_list">
              <p class="tittle">今日现场峰值</p>
              <p>
                &nbsp;&nbsp;<span><animate-number from="0" to="349" duration="3000"></animate-number></span
                >&nbsp;&nbsp;人
              </p>
            </div>
            <div class="videoBox_list">
              <p class="tittle">今日出勤率</p>
              <p>
                &nbsp;&nbsp;<span><animate-number from="0" to="94.6" duration="3000"></animate-number></span
                >&nbsp;&nbsp;%
              </p>
            </div>
            <div class="videoBox_list">
              <p class="tittle">出勤班组</p>
              <p>
                &nbsp;&nbsp;<span><animate-number from="0" to="12" duration="3000"></animate-number></span
                >&nbsp;&nbsp;组
              </p>
            </div>
          </div>
          <div id="videoBoxEcharts"></div>
        </div>
        <!-- 工地出勤 -->
        <div class="materialsDynamic frame">
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitleLog + ') 10px bottom no-repeat'">
            工地出勤
          </p>
          <div id="materialsDynamicEcharts"></div>
        </div>
      </div>
      <div class="project_right">
        <!-- 证书统计 -->
        <div class="certificate frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            证件到期预警
          </p>
          <div class="certificate_hd_box">
            <div class="certificate_box">
              <div class="certificate_list" v-for="(item, index) of certificateList" :key="index">
                <div class="certificate_img" type="primary" @click="showModal0(index)">
                  <div class="img_box">
                    <!-- <img :src="item.photo" alt="" class="photo"> -->
                    <img :src="item.photo ? item.photo : ''" alt :onerror="defaultImg" class="photo" />
                    <div class="hover_bg"></div>
                    <img src="../../../assets/digitalScreen-images/amplification.png" alt="" class="hoverimg" />
                    <div class="certificate_name">{{ item.number }}</div>
                  </div>
                </div>
                <p class="name">姓名：{{ item.name }}</p>
                <p class="dq_time dq" v-if="item.expired == 1" style="color: #f2534d">到期时间 ：{{ item.time }}</p>
                <p class="dq_time dq" v-else-if="item.expired == 0">到期时间 ：{{ item.time }}</p>
              </div>
              <a-modal v-model="visible0" :footer="null" :centered="true">
                <p>{{ certificateData.name }}证书</p>
                <!-- <img :src="certificateData.photo" alt=""> -->
                <img :src="certificateData.photo ? certificateData.photo : ''" alt :onerror="defaultImg" />
              </a-modal>
            </div>
          </div>
        </div>
        <!-- 人员动态 -->
        <div class="personnelDynamic frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            <a-button
              v-for="(item, index) of deviceBtn"
              :key="index"
              @click="switchdevice2(item.id, index)"
              :class="selectedPress2 == index ? 'active' : ''"
              :disabled="selectedPress2 == index ? true : false"
              >{{ item.txt }}</a-button
            >
          </p>
          <table>
            <tr v-for="(item, index) in personnelDynamicList" :key="index">
              <td class="dian"><span></span></td>
              <td class="group">{{ item.name }}</td>
              <td>总人数：{{ item.count }}人</td>
              <td>在场：{{ item.online }}人</td>
            </tr>
            <!-- <tr>
                <td class="dian"><span></span></td>
                <td class="group">钢筋班组</td>
                <td>总人数：56人</td>
                <td>在场：30人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">泥工班组</td>
                <td>总人数：28人</td>
                <td>在场：22人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">铝膜安装工班组</td>
                <td>总人数：17人</td>
                <td>在场：16人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">木工班组</td>
                <td>总人数：26人</td>
                <td>在场：22人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">架子工班组</td>
                <td>总人数：28人</td>
                <td>在场：24人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">电工班组</td>
                <td>总人数：136人</td>
                <td>在场：13人</td>
            </tr>
            <tr>
                <td class="dian"><span></span></td>
                <td class="group">其他班组</td>
                <td>总人数：24人</td>
                <td>在场：22人</td>
            </tr> -->
          </table>
          <div class="PersonnelStatistics_compile" type="primary" @click="showModal10">
            <img src="../../../assets/digitalScreen-images/compile.png" alt="" />
          </div>
          <a-modal v-model="visible10" :centered="true" :footer="null">
            <p>人员统计</p>
            <form method="Post" action="Post.aspx">
              <table>
                <tr v-for="(item, index) in personnelDynamicListCopy" :key="index">
                  <td class="left">{{ item.name }}</td>
                  <td class="right"><input type="number" min="0" v-model="item.online" placeholder="请输入" /></td>
                </tr>
                <!-- <tr>
                    <td class="left">钢筋班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">泥工班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">铝膜安装工班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">木工班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">架子工班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">电工班组</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr>
                <tr>
                    <td class="left">其他</td>
                    <td class="right"><input type="number" placeholder="请输入"> </td>
                </tr> -->
              </table>
              <a-button @click="SubmitForm2" type="submit" class="ok">确认</a-button>
              <a-button type="submit" class="onOk" @click="handleCancel2">取消</a-button>
            </form>
          </a-modal>
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress, poPersonCount } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import vueSeamLess from 'vue-seamless-scroll'
import moment from 'moment'
import Qs from 'qs'

export default {
  name: 'ProjectOverview',
  components: {
    vueSeamLess,
  },
  data() {
    return {
      formList: {
        //   var infoJson = {

        //   },
        scene: '', //在场总人数
        project: '', //项目管理人员
        work: '', //施工作业人员
        registered: '', //在册总人数
        clock: '', //今日打卡人数
        beLate: '', //今日迟到人数
        leaveEarly: '', //今日早退人数
      },
      PersonnelStatistics: {
        scene: '',
        project: '',
        work: '',
        registered: '',
        clock: '',
        beLate: '',
        leaveEarly: '',
      },
      statisId: '',
      selectedPress: 0,
      selectedPress2: 0,
      options: {
        images: images,
      },
      visible: false,
      visible0: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false,
      visible7: false,
      visible8: false,
      visible9: false,
      visible10: false,
      ageGroup: ['18~29岁：', '30~39岁：', '40~49岁：', '50~54岁：', '55岁以上：'],
      peoplePresent: [],
      ageRateTotal: [100, 100, 100, 100, 100],
      ageRate: [],
      // personnel:[{
      //     value:''
      // }],
      // personnel2:[{
      //     value:''
      // }],
      certificateList: [
        {
          name: '',
          photo: '',
          number: '',
          time: '',
          expired: '',
        },
      ],
      certificateData: {
        name: '',
        photo: '',
        number: '',
        time: '',
      },
      personnelDynamicList: [
        {
          name: '',
          count: '',
          online: '',
        },
      ],
      personnelDynamicEcharts: [
        {
          value: '',
          name: '',
        },
      ],
      personnelDynamicListCopy: [
        {
          name: '',
          count: '',
          online: '',
        },
      ],
      xName: [],
      yCount: [],
      yOnline: [],
      deviceBtn: [{ id: '', txt: '' }],
      contractorId: '',
      bodyCountName: [],
      bodyCount: [],
    }
  },
  mounted() {
    this.checkMenu()
    this.getdeviceBtn()
    this.getpersonnelDynamic()
    this.teamStatistics()
    this.personnelDynamicAndTeam(this.deviceBtn[0].id)
    this.getcertificate()
    this.getBodyCount()
  },
  computed: {
    defaultImg() {
      return 'this.src="' + require('@/assets/digitalScreen-images/certificate.png') + '"'
    },
  },
  methods: {
    formatter: function (num) {
      return num.toFixed(2)
    },

    startAnimate: function () {
      this.$refs.myNum.start()
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
    // 分包单位信息
    getdeviceBtn() {
      getAction('/contractor/contractor/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          this.deviceBtn.splice(0, this.deviceBtn.length)
          let data = res.result.records
          data.forEach((value, index) => {
            this.deviceBtn.push({ id: value.id, txt: value.contractorName })
          })
          // console.log(this.deviceBtn[0])
          this.personnelStatistics(this.deviceBtn[0].id)
          this.personnelDynamicAndTeam(this.deviceBtn[0].id)
          this.contractorId = this.deviceBtn[0].id
        }
      })
    },
    switchdevice(id, index) {
      this.selectedPress = index
      this.personnelStatistics(id)
      this.contractorId = id
    },
    switchdevice2(id, index) {
      this.selectedPress2 = index
      this.personnelDynamicAndTeam(id)
      this.contractorId = id
    },
    // 人员统计
    personnelStatistics(id) {
      getAction('/person/personCount/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        contractorId: id,
      }).then((res) => {
        // console.log(res)
        let { code, result } = res
        if (code == 200) {
          let data = result.records
          for (let key in this.PersonnelStatistics) {
            this.PersonnelStatistics[key] = ''
          }
          if (data.length > 0) {
            this.PersonnelStatistics = JSON.parse(data[data.length - 1].info)
            this.statisId = data[data.length - 1].id
          }
        }
      })
    },
    //提交表单
    SubmitForm() {
      // console.log(this.selectedPress)
      // console.log(this.formList)
      var params = {
        info: JSON.stringify(this.formList),
        relTenantIds: this.$store.state.user.info.relTenantIds,
        id: this.statisId,
        contractorId: this.contractorId,
      }
      httpAction('/person/personCount/add', params, 'post').then((res) => {
        // console.log(res)
        let { code, result } = res
        if (code == 200) {
          this.PersonnelStatistics.scene = this.formList.scene
          this.PersonnelStatistics.project = this.formList.project
          this.PersonnelStatistics.work = this.formList.work
          this.PersonnelStatistics.registered = this.formList.registered
          this.PersonnelStatistics.clock = this.formList.clock
          this.PersonnelStatistics.beLate = this.formList.beLate
          this.PersonnelStatistics.leaveEarly = this.formList.leaveEarly
          this.visible9 = false
        }
      })
    },
    //工地出勤
    getpersonnelDynamic() {
      getAction('/teamTree/teamTree/teamCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.result
          // console.log('工地出勤', data)
          data.forEach((item, index) => {
            this.xName.push(item.name)
            this.yCount.push(item.count)
            this.yOnline.push(item.online)
            let materialsDynamicEcharts = this.$echarts.init(document.getElementById('materialsDynamicEcharts'))
            materialsDynamicEcharts.setOption({
              grid: {
                top: '10%',
                left: '7%',
                right: '6%',
                bottom: '10%',
                // containLabel: true
              },
              title: {
                top: '-10px',
                left: '17px',
                subtext: '',
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
              },
              legend: {
                data: ['总人数', '实际出勤人数'],
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
                  formatter: function (value, index) {
                    let arr = value.split('')
                    arr.splice(4, 0, ' ')
                    let str = arr.join('')
                    let newStr = str.replaceAll(' ', '\n')
                    return newStr
                  },
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    type: 'dashed',
                    color: '#fff',
                  },
                },
                data: this.xName,
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
                  name: '总人数',
                  type: 'bar',
                  barWidth: '20%', //柱图宽度
                  barGap: '0.3' /*多个并排柱子设置柱子之间的间距*/,
                  barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
                  data: this.yCount,
                  itemStyle: {
                    normal: {
                      color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.1, color: '#e7c664' }, //柱图渐变色
                        { offset: 1, color: '#ff3c39' }, //柱图渐变色
                      ]),
                    },
                  },
                },
                {
                  name: '实际出勤人数',
                  type: 'bar',
                  barWidth: '20%', //柱图宽度
                  data: this.yOnline,
                  itemStyle: {
                    normal: {
                      color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.1, color: '#02b1da' }, //柱图渐变色
                        { offset: 1, color: '#ff3c39' }, //柱图渐变色
                      ]),
                    },
                  },
                },
              ],
            })
          })
          // if(this.personnel.length>0){
          //     this.personnel.splice(0,this.personnel.length)
          // }
          // data.forEach((value, index) => {
          //   switch (value.nld) {
          //     case '18':
          //       this.peoplePresent[0] = '在场' + value.online + '人';
          //       this.peoplePresent[1] = '在场' + 0 + '人';
          //       this.peoplePresent[2] = '在场' + 0 + '人';
          //       this.peoplePresent[3] = '在场' + 0 + '人';
          //       this.peoplePresent[4] = '在场' + 0 + '人';
          //       this.ageRate[0] = value.online / value.total * 100;
          //       this.ageRate[1] = 0;
          //       this.ageRate[2] = 0;
          //       this.ageRate[3] = 0;
          //       this.ageRate[4] = 0;
          //       break;
          //     case '30':
          //       this.peoplePresent[1] = '在场' + value.online + '人';
          //       this.peoplePresent[2] = '在场' + 0 + '人';
          //       this.peoplePresent[3] = '在场' + 0 + '人';
          //       this.peoplePresent[4] = '在场' + 0 + '人';
          //       this.ageRate[1] = value.online / value.total * 100;
          //       this.ageRate[2] = 0;
          //       this.ageRate[3] = 0;
          //       this.ageRate[4] = 0;
          //       break;
          //     case '40':
          //       this.peoplePresent[2] = '在场' + value.online + '人';
          //       this.peoplePresent[3] = '在场' + 0 + '人';
          //       this.peoplePresent[4] = '在场' + 0 + '人';
          //       this.ageRate[2] = value.online / value.total * 100;
          //       this.ageRate[3] = 0;
          //       this.ageRate[4] = 0;
          //       break;
          //     case '50':
          //       this.peoplePresent[3] = '在场' + value.online + '人';
          //       this.peoplePresent[4] = '在场' + 0 + '人';
          //       this.ageRate[3] = value.online / value.total * 100;
          //       this.ageRate[4] = 0;
          //       break;
          //     case '55':
          //       this.peoplePresent[4] = '在场' + value.online + '人';
          //       this.ageRate[4] = value.online / value.total * 100;
          //       break;
          //   }
          //   // this.personnel.push({value:value.online});
          //   // this.personnel2.push({value:value.total});
          // });
          // console.log(this.peoplePresent)
          // console.log(this.ageRate)
        }
      })
    },
    //证书统计
    getcertificate() {
      getAction('/deviceMaintain/deviceSpecialists/countCertificates', {
        relTenantIds: 5,
      }).then((res) => {
        if (res.code == 200) {
          // console.log(res);
          let data = res.result
          // console.log('证件', data)
          if (this.certificateList.length > 0) {
            this.certificateList.splice(0, this.certificateList.length)
          }
          data.forEach((value, index) => {
            this.certificateList.push({
              name: value.person_name,
              photo: value.photo,
              number: value.certificate_number,
              time: value.certificate_validity,
              expired: value.expired,
            })
          })
        }
      })
    },
    //班组统计
    teamStatistics(){
      getAction('/teamTree/teamTree/teamCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds
      }).then((res) => {
        let { code, result } = res
        if (code == 200) {
          if (this.personnelDynamicEcharts.length > 0) {
            this.personnelDynamicEcharts.splice(0, this.personnelDynamicEcharts.length)
          }
          result.forEach((value, index) => {
            if (value.count == null) {
              value.count = 0
            }
            this.personnelDynamicEcharts.push({
              value: value.count,
              name: value.name,
            })
          })
          this.drawLine()
        }
      })
    },
    // 人员动态
    personnelDynamicAndTeam(id) {
      getAction('/teamTree/teamTree/teamCount', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        contractorId: id,
      }).then((res) => {
        // console.log('班组统计', res)
        let { code, result } = res
        if (code == 200) {
          if (result!=null) {
            if (this.personnelDynamicList.length > 0) {
              this.personnelDynamicList.splice(0, this.personnelDynamicList.length)
            }
            if (this.personnelDynamicListCopy.length > 0) {
              this.personnelDynamicListCopy.splice(0, this.personnelDynamicListCopy.length)
            }
            result.forEach((value, index) => {
              if (value.count == null) {
                value.count = 0
              }
              if (value.online == null) {
                value.online = 0
              }
              this.personnelDynamicList.push({
                name: value.name,
                count: value.count,
                online: value.online,
              })
              this.personnelDynamicListCopy.push({
                name: value.name,
                count: value.count,
                online: value.online,
                id: value.id,
              })
            })
          }
        }
      })
    },
    SubmitForm2() {
      let params = []
      this.personnelDynamicListCopy.forEach((value, index) => {
        params.push({
          id: value.id,
          onlinePeople: value.online,
        })
      })
      httpAction('/teamTree/teamTree/modifyOnlinePeople', params, 'put').then((res) => {
        // console.log(res)
        let { code, result } = res
        if (code == 200) {
          this.personnelDynamicListCopy.forEach((value, index) => {
            this.personnelDynamicList[index].name = value.name
            this.personnelDynamicList[index].online = value.online
          })
          this.visible10 = false
        }
      })
    },
    getBodyCount() {
      getAction('/person/person/countByContractor', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        //         console.log(res)
        let { code, result } = res
        if (code == 200) {
          result.forEach((item, index) => {
            this.bodyCountName.push(item.name)
            this.bodyCount.push(item.total)
          })
        }
        this.drawLine2()
      })
    },
    showModal() {
      this.visible = true
    },
    showModal0(index) {
      this.visible0 = true
      this.certificateData = this.certificateList[index]
    },
    showModal1() {
      this.visible1 = true
    },
    showModal2() {
      this.visible2 = true
    },
    showModal3() {
      this.visible3 = true
    },
    showModal4() {
      this.visible4 = true
    },
    showModal5() {
      this.visible5 = true
    },
    showModal6() {
      this.visible6 = true
    },
    showModal7() {
      this.visible7 = true
    },
    showModal8() {
      this.visible8 = true
    },
    showModal9() {
      this.visible9 = true
      // console.log(this.PersonnelStatistics.clock)
      this.formList.scene = this.PersonnelStatistics.scene
      this.formList.project = this.PersonnelStatistics.project
      this.formList.work = this.PersonnelStatistics.work
      this.formList.registered = this.PersonnelStatistics.registered
      this.formList.clock = this.PersonnelStatistics.clock
      this.formList.beLate = this.PersonnelStatistics.beLate
      this.formList.leaveEarly = this.PersonnelStatistics.leaveEarly
      // console.log(this.formList.work)
    },
    handleCancel() {
      this.visible9 = false
    },
    showModal10() {
      this.visible10 = true
      // console.log(this.personnelDynamicList)
      this.personnelDynamicList.forEach((value, index) => {
        this.personnelDynamicListCopy[index].name = value.name
        this.personnelDynamicListCopy[index].online = value.online
      })
    },
    handleCancel2() {
      this.visible10 = false
    },
    drawLine1() {},
    drawLine2() {
      let videoBoxEcharts = this.$echarts.init(document.getElementById('videoBoxEcharts'))
      videoBoxEcharts.setOption({
        grid: {
          top: '20%',
          left: '50px',
          right: '50px',
          bottom: '15%',
        },
        title: {
          top: '0px',
          left: '20px',
          text: '现场人数变化统计',
          // subtext: '(人)',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
            color: '#04A3F7',
            fontSize: 16,
          },
          subtextStyle: {
            fontFamily: 'Microsoft YaHei',
            color: '#4B7186',
            fontSize: 9,
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
          data: ['今日现场'],
          top: '2%',
          right: '5%',
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
              color: 'rgba(75, 113, 134, 1)',
            },
          },
          data: this.bodyCountName,
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false },
          axisLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(75, 113, 134, 1)',
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
            name: '今日现场',
            type: 'bar',
            barWidth: 20, //柱图宽度
            barGap: '0.1' /*多个并排柱子设置柱子之间的间距*/,
            barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
            data: this.bodyCount,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.1, color: '#05C3B8' }, //柱图渐变色
                  { offset: 1, color: '#09AEDB' }, //柱图渐变色
                ]),
              },
            },
          },
        ],
      })
    },
    drawLine() {
      let TeamStatisticsEcharts = this.$echarts.init(document.getElementById('TeamStatisticsEcharts'))
      TeamStatisticsEcharts.setOption({
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
          bottom: '10',
          containLabel: true,
        },
        // legend: {
        //     orient: 'vertical',
        //     align:'left',
        //     itemWidth:20,
        top: '30',
        //     itemHight:10,
        //     top: 'middle',
        //     left:'68%',
        //     itemGap:25,
        //     textStyle: {
        //       color: "#fff",
        //       fontSize: "14"
        //     },
        //   formatter: (name) => {
        //       return name;
        //     },
        // },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['50%', '53%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center',
              normal: {
                formatter: '{b}:{c}',
                show: true,
                position: 'left',
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                formatter: '{d}%\n{b}',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.personnelDynamicEcharts,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b}',
                },
                shadowBlur: 3,
                shadowOffsetX: 0,
                labelLine: {
                  show: true,
                  length: 10,
                },
              },
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

  .project {
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-family: 'Microsoft YaHei';
    font-weight: 400;

    .project_left {
      width: 523px;

      .PersonnelStatistics {
        position: relative;
        height: 490px;

        .PersonnelStatistics_top {
          width: 410px;
          height: 140px;
          margin: 0 auto;
          border-bottom: 1px solid rgba(30, 56, 93, 1);
          margin-bottom: 8px;

          .PersonnelQuantity {
            float: left;
            margin-top: 40px;
            width: 33.33%;
            height: auto;

            p {
              font-size: 14px;
              font-family: 'Microsoft YaHei';
              font-weight: 400;
              color: #04a3f7;
              text-align: center;

              span {
                font-family: 'electronicFont';
                color: #ffffff;
                font-size: 40px;
                letter-spacing: 2px;
                margin-bottom: 20px;
              }
            }
          }
        }

        .PersonnelStatistics_bottom {
          width: 410px;
          height: auto;
          margin: 0 auto;

          .PersonnelMessage {
            position: relative;
            float: left;
            width: 190px;
            height: 90px;
            margin-top: 30px;
            background: rgba(0, 186, 255, 0.1);
            border-radius: 10px;
            transition: all 0.6s;

            img {
              position: absolute;
              top: 29px;
              left: 34px;
            }

            p {
              position: absolute;
              top: 24px;
              left: 86px;
              font-size: 14px;
              font-family: 'Microsoft YaHei';
              font-weight: 400;
              color: #04a3f7;
              line-height: 22px;

              span {
                font-size: 20px;
                color: #fff;
              }
            }
          }

          .PersonnelMessage:hover {
            transform: scale(1.1);
          }

          .PersonnelMessage:nth-child(2n) {
            margin-left: 30px;
          }
        }

        .PersonnelStatistics_compile {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 16px;
          height: 19px;
          cursor: pointer;
        }
      }

      .TeamStatistics {
        position: relative;
        margin-top: 15px;
        height: 370px;

        #TeamStatisticsEcharts {
          width: 100%;
          height: 297px;
        }
      }
    }

    .project_center {
      margin-left: 15px;
      width: 802px;

      .videoBox {
        position: relative;
        padding: 9px;
        height: 490px;
        background: url(../../../assets/digitalScreen-images/videoboxbg2.png);
        background-size: 100% 100%;
        border: none;

        h4 {
          font-size: 16px;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: #efefef;
          text-align: center;
        }

        .videoBox_top {
          width: 712px;
          height: 105px;
          margin: 30px auto 0;

          .videoBox_list {
            float: left;
            width: 183px;
            height: 104px;
            margin: 0 27px;
            background: url(../../../assets/digitalScreen-images/videoBox_list_bg.png);
            text-align: center;
            font-family: 'Microsoft YaHei';
            font-weight: 400;

            p {
              font-size: 16px;
              color: #ffffff;

              span {
                font-family: 'electronicFont';
                font-size: 40px;
                font-style: italic;
                font-weight: 900;
                letter-spacing: 2px;
              }
            }

            .tittle {
              margin-top: 15px;
              font-size: 18px;
              color: #14a5ef;
              line-height: 18px;
            }
          }
        }

        #videoBoxEcharts {
          margin-top: 20px;
          width: 100%;
          height: 293px;
        }
      }

      .materialsDynamic {
        margin-top: 15px;
        position: relative;
        height: 370px;

        #materialsDynamicEcharts {
          width: 100%;
          height: 313px;
        }
      }
    }

    .project_right {
      margin-left: 15px;
      width: 522px;

      .certificate {
        position: relative;
        color: white;
        height: 490px;

        .certificate_box {
          width: 500px;
          height: 430px;
          margin: 0 auto;
          overflow-x: hidden;

          .certificate_list {
            float: left;
            width: 150px;
            margin: 20px 8px 0;

            .certificate_img {
              position: relative;
              width: 149px;
              height: 103px;
              background: url(../../../assets/digitalScreen-images/certificate_bg.png);
              cursor: pointer;

              .img_box {
                width: 136px;
                height: 87px;
                position: absolute;
                top: 50%;
                left: 50%;
                // transform:translate(-50%, -50%);
                margin-left: -68px;
                margin-top: -43px;
                overflow: hidden;

                .photo {
                  position: absolute;
                  width: 136px;
                  height: 87px;
                  transition: all 0.6s;
                }

                .hover_bg {
                  position: absolute;
                  width: 136px;
                  height: 87px;
                  background: rgba(11, 24, 49, 0.6);
                  opacity: 0;
                  transition: all 0.6s;
                }

                .hoverimg {
                  width: 31px;
                  height: 31px;
                  margin: 28px 0 0 53px;
                  transform: translateY(-60px);
                  transition: all 0.4s;
                }

                .certificate_name {
                  position: absolute;
                  left: 8px;
                  bottom: 3px;
                  padding: 1px 10px;
                  border-radius: 20px;
                  background: rgba(7, 19, 45, 0.7);
                  transition: all 0.4s;
                  font-size: 12px;
                }
              }
            }

            .certificate_img:hover {
              img {
                transform: scale(1.2);
              }

              .hoverimg {
                transform: translateY(0px);
              }

              .hover_bg {
                opacity: 1;
              }

              .certificate_name {
                transform: translateY(50px);
              }
            }

            p {
              font-size: 12px;
              font-family: 'Microsoft YaHei';
              font-weight: 400;
              color: #efefef;
              line-height: 21px;
            }
          }
        }

        .certificate_box::-webkit-scrollbar {
          width: 2px;
        }

        .certificate_box::-webkit-scrollbar-thumb {
          border-radius: 5px;
          /* background: rgb(31, 143, 255, .5); */
          background: rgb(255, 255, 255, 0.8);
        }

        .certificate_box::-webkit-scrollbar-track {
          border-radius: 5px;
          background: rgba(24, 127, 255, 0.2);
        }
      }

      .personnelDynamic {
        position: relative;
        margin-top: 15px;
        color: white;
        height: 370px;

        table {
          width: 485px;
          margin: 13px auto 0;
          text-align: center;
          line-height: 40px;
          max-height: 300px;
          overflow: scroll;
          tr {
            height: 40px;

            td {
              width: 15%;
              color: #3aecf2;
              font-size: 12px;
              font-family: 'Microsoft YaHei';
              font-weight: 400;
            }

            .dian {
              width: 10%;

              span {
                display: inline-block;
                width: 7px;
                height: 7px;
                border-radius: 5px;
              }
            }

            .group {
              width: 40%;
              text-align: left;
              color: #fff;
            }
          }

          tr:nth-child(2n + 1) {
            background: rgba(13, 35, 70, 0.8);
          }

          tr:nth-child(7n + 1) {
            span {
              background: #407fff;
            }
          }

          tr:nth-child(7n + 2) {
            span {
              background: #00cccd;
            }
          }

          tr:nth-child(7n + 3) {
            span {
              background: #f29961;
            }
          }

          tr:nth-child(7n + 4) {
            span {
              background: #f2534d;
            }
          }

          tr:nth-child(7n + 5) {
            span {
              background: #b30d68;
            }
          }

          tr:nth-child(7n + 6) {
            span {
              background: #06f391;
            }
          }

          tr:nth-child(7n + 7) {
            span {
              background: #a901f7;
            }
          }
        }

        .PersonnelStatistics_compile {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 16px;
          height: 19px;
          cursor: pointer;
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
    height: 50px;
    font-size: 16px;
    color: white;
    background-size: 94% 86% !important;
    padding: 20px 30px 10px 30px;
    .ant-btn {
      width: 100px;
      height: 30px;
      border: none;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: url(../../../assets/digitalScreen-images/frameTitleOff.png) no-repeat bottom;
      background-size: 100% 100%;
      border-radius: 0;
      transition: all 0.3s; //设置动画执行的时间为0.3s
    }
    .ant-btn:hover {
      transform: scale(1.1); /* 放大1.1倍 */
    }
    .ant-btn.active {
      background: url(../../../assets/digitalScreen-images/frameTitleOn.png) no-repeat bottom;
      background-size: 100% 100%;
    }
  }

  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    opacity: 0.9;
    padding-top: 5px;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }
}

li {
  list-style: none;
}

// /deep/.ant-modal-wrap {
//     background: rgba(13, 35, 70, .6);
// }
/deep/ .ant-modal-mask {
  z-index: 999;
  background: rgba(4, 12, 25, 0.6);
}

/deep/ .ant-modal {
  width: 800px !important;
}

/deep/ .ant-modal-content {
  padding: 0 10px;
  width: 800px;
  height: 500px;
  color: #fff;
  background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;

  p {
    font-size: 14px;
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    color: #ffffff;
    text-align: left;
  }

  img {
    margin-top: 15px;
    width: 700px;
    height: 400px;
  }

  form {
    table {
      margin: 20px 0 0 50px;
      width: 650px;

      tr {
        width: 650px;
        height: 40px;
        display: block;
        margin-top: 10px;

        .left {
          width: 300px;
          background: rgba(6, 68, 116, 1);
          text-align: center;
          line-height: 40px;
          border-radius: 5px 0 0 5px;
        }

        .right {
          width: 350px;
          height: 40px;
          background: rgba(58, 84, 115, 1);
          border-radius: 0 5px 5px 0;

          input {
            width: 90%;
            height: 100%;
            padding-left: 20px;
            border: none;
            outline: none;
            background: none;
          }

          input::-webkit-input-placeholder {
            color: rgba(115, 139, 169, 1);
          }

          input::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            color: rgba(115, 139, 169, 1);
          }

          input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            color: rgba(115, 139, 169, 1);
          }

          input:-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: rgba(115, 139, 169, 1);
          }
        }
      }
    }

    .ok,
    .onOk {
      margin: 20px 40px 0 0;
      float: right;
      width: 80px;
      height: 34px;
      background: none;
      border-radius: 5px;
      border: 1px solid #04a3f7;
      color: #04a3f7;
    }

    .ok {
      background: #04a3f7;
      color: #fff;
    }

    .onOk {
      margin-right: 10px;
    }
  }

  .ant-modal-body {
    padding: 20px;
  }
}

/deep/ .ant-modal-close-x {
  margin-top: 28px;
  margin-right: 23px;
  color: transparent;
  background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
}
</style>