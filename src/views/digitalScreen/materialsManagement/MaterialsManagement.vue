<template>
  <div class="project_overview">
    <a-row class="project" :gutter="16">
      <div class="project_left">
        <div class="warehouse frame">
          <!-- 边角 -->
          <div class="span_icon top_left_icon"></div>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            仓库概况
          </p>
          <div id="warehouse_top"></div>
          <div class="warehouse_bottom">
            <div class="warehouseMessage">
              <img src="../../../assets/digitalScreen-images/ic.png" alt="" />
              <p>本月入库／次</p>
              <span>{{ generalData.inTotal }}</span>
            </div>
            <div class="warehouseMessage">
              <img src="../../../assets/digitalScreen-images/ic(1).png" alt="" />
              <p>本月出库／次</p>
              <span>{{ generalData.outTotal }}</span>
            </div>
            <div class="warehouseMessage">
              <img src="../../../assets/digitalScreen-images/ic(2).png" alt="" />
              <p>所有材料类型／种</p>
              <span>{{ generalData.inTotal }}</span>
            </div>
            <div class="warehouseMessage">
              <img src="../../../assets/digitalScreen-images/ic(3).png" alt="" />
              <p>本月直进直出／次</p>
              <span>{{ generalData.inoutTotal }}</span>
            </div>
          </div>
        </div>
        <div class="materialType frame">
          <!-- 边角 -->
          <div class="span_icon top_left_icon"></div>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            库存统计
          </p>
          <vue-scroll :ops="ops" style="width: 400px; height: 250px">
            <div :style="{ height: ehartsHeight }" id="materialTypeEcharts"></div>
            <div class="materialsDynamicList">
              <p
                class="statisticsP"
                :style="{ height: statisticsHeight }"
                v-for="(item, index) in statisticalData"
                :key="index"
              >
                <span class="left">本月剩余：{{ item.surplusTotal }}千克</span>
                <span class="right">本月收料：{{ item.incomeTotal }}千克</span>
              </p>
            </div>
          </vue-scroll>
        </div>
      </div>

      <!-- 大图-->
      <div class="project_center">
        <div class="videoBox frame">
          <!-- 边角 -->
          <span class="big_span_icon line_bg_topLeft" style="z-index: 999"></span>
          <span class="big_span_icon line_bg_topRight" style="z-index: 999"></span>
          <span class="big_span_icon line_bg_bottomLeft" style="z-index: 999"></span>
          <span class="big_span_icon line_bg_bottomRigth" style="z-index: 999"></span>
          <a-carousel autoplay style="width: 1002px; padding: 3px 8px; z-index: 998">
            <div
              v-for="(img, index) in bannerImgs"
              :key="index"
              :style="`background: url('${bannerImgs}') 100%/100% no-repeat`"
            >
              <img :src="img ? img : ''" class="materialImages" />
            </div>
          </a-carousel>
          <!--          <img src="../../../assets/digitalScreen-images/videoBoxbg.png" alt="">-->
        </div>

        <!-- 主要材料动态 -->
        <div class="materialsDynamic frame">
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.big_Title_bg + ') 10px bottom no-repeat'">
            主要材料动态
          </p>
          <div id="materialsDynamicEcharts"></div>
        </div>
      </div>
      <div class="project_right">
        <!-- 实时动态 -->
        <div class="dynamic frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            实时动态
          </p>
          <div class="dynamicBtn">
            <a-button style="border-radius: 15px 0 0 15px" :class="{ actualTre: actualTrends }" @click="inputMal">
              收料
            </a-button>
            <a-button style="border-radius: 0 15px 15px 0" :class="{ actualTre: actualTrends2 }" @click="outputMal"
              >发料
            </a-button>
          </div>
          <div class="dynamicTree" v-show="this.inputStatus">
            <a-timeline>
              <a-timeline-item v-for="(item, index) in malData" :key="index">
                <img style="width: 130px; height: 73px" :src="item.inUpPic" alt="" @click="showModal0(item.inUpPic)" />
                <p class="time">{{ item.createTime }}</p>
                <p>
                  车牌号：<span>{{ item.plateNo }}</span> <br />
                  材料：<span>{{ item.materialsSpare }}</span> <br />
                  净重：<span>{{ item.suttleWeight }}</span
                  >&nbsp;吨 <br />
                </p>
              </a-timeline-item>
            </a-timeline>
          </div>
          <!--        弹窗  //-->
          <a-modal v-model="visible0" :footer="null" :centered="true">
            <p>车牌号照片</p>
            <img :src="certificateData" alt="" class="certificateData-img" />
          </a-modal>
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress, malDatas } from '@/api/manage'
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
      visible0: false, //隐藏弹窗
      certificateData: '', //弹窗图片
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true,
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
          background: '#F5F5F5', //滚动条颜色
          opacity: 0.5, //滚动条透明度
          'overflow-x': 'hidden',
        },
      },
      options: {
        images: images,
      },
      currentIndex: '',
      actualTrends: true, //收料按钮被点击时加背影、文字
      actualTrends2: false, //发料按钮被点击时加背影、文字
      inputStatus: true,
      malNum: 2,
      outputStatus: false,

      malData: '', //收发料数据

      generalData: '', //概况数据
      generalMalData: '', //概况材料数据
      warehouse_top: '', //仓库概况环形图
      option1data: [], //仓库概况环形图data数据

      bannerImg: [], //banner大图
      bannerImgs: [], //将所有banner大图放进一个数组展示

      statisticalData: '', //库存统计数据
      classifyTypeName: [], //库存统计y轴
      surplusTotalLength: [], //库存统计每个x轴长度
      surplusTotal: [], //库存统计每种材料占x轴长度百分比
      classifyTypeNames: [], //材料名称
      xLength: [], //横条长度
      xPercentage: [], //横条百分比
      ehartsHeight: '', //echarts高度
      statisticsHeight: '', //库存统计文字高度
      statisticsP: '',

      getDynamics: '', //材料动态数据
      materialsName: [], //材料动态数据中的所有材料的名称
      inTotal: [], //材料动态数据中的所有材料的累计已进场
      outTotal: [], //材料动态数据中的所有材料的累计已使用
    }
  },
  created() {},
  mounted() {
    this.checkMenu()
    this.generalDatas()
    this.getMalDatas()
    this.getStatistical()
    this.getDynamic()
    this.getBannerImg()
  },
  methods: {
    showModal0(item) {
      this.visible0 = true

      this.certificateData = item
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
    // 获取仓库概况数据并用echarts展示
    generalDatas() {
      getAction('/materials/warehouse/warehouseSurvey', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (res.code == 200) {
          this.generalData = res.result
          this.generalMalData = this.generalData.pieGraphList
          // console.log('仓库概况数据this.generalMalData', this.generalMalData)
          this.generalMalData.forEach((item, index) => {
            this.option1data.push({
              value: item.total,
              name: item.name,
            })
          })
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
              orient: 'vertical',
              align: 'left',
              top: 'middle',
              left: '65%',
              itemGap: 20,
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
                    fontWeight: 'bold',
                    formatter: '{d}%\n{b}',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: this.option1data,
              },
            ],
          }
          this.warehouse_top.setOption(option1)
        } else {
          this.$message.error('仓库概况数据请求失败！')
        }
      })
    },

    // 获取banner大图并轮播展示
    getBannerImg() {
      getAction('/sys/banner/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        useType: 4,
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (res.code == 200) {
          this.bannerImg = res.result.records
          console.log('this.bannerImg', this.bannerImg)
          this.bannerImg.forEach((item, index) => {
            //先将字符串通过split(",")分割成数组，再将数组通过concat拼接，并用一个空数组接收
            this.bannerImgs = this.bannerImgs.concat(item.imagePath.split(','))
          })
          console.log('this.bannerImgs', this.bannerImgs)
        } else {
          this.$message.error('banner图请求失败！')
        }
      })
    },

    // 获取实时动态数据
    getMalDatas() {
      getAction('/materials/weighbridgeBill/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        inOutType: this.malNum,
        column: 'createTime',
        order: 'desc',
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (res.code == 200) {
          this.malData = res.result.records
        } else {
          this.$message.error('实时动态数据请求失败！')
        }
      })
    },
    // 点击【收料】按钮时
    inputMal() {
      this.actualTrends = true
      this.actualTrends2 = false
      this.inputStatus = true
      this.outputStatus = false
      this.malNum = 2
      console.log('this.inputStatus', this.inputStatus)
      this.getMalDatas()
    },
    // 点击【发料】按钮时
    outputMal() {
      this.actualTrends2 = true
      this.actualTrends = false
      this.outputStatus = true
      this.inputStatus = false
      this.malNum = 3
      console.log('this.outputStatus', this.outputStatus)
      this.getMalDatas()
    },

    // 获取库存统计数据并用echarts展示
    getStatistical() {
      getAction('/materials/classify/queryTypeTotal', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (res.code == 200) {
          this.statisticalData = res.result
          // 预处理echarts中的数据
          this.statisticalData.forEach((item, index) => {
            this.ehartsHeight = this.statisticalData.length * 42 + 'px'
            this.statisticsHeight = (this.statisticalData.length * 42 - 42) / this.statisticalData.length + 'px'
            this.classifyTypeNames.push(item.classifyTypeName)
            this.xLength.push(1)
            this.xPercentage.push(item.surplusTotal / item.incomeTotal ? item.surplusTotal / item.incomeTotal : 0)
            setTimeout(() => {
              let scheduleEcharts_footer = this.$echarts.init(document.getElementById('materialTypeEcharts'))
              scheduleEcharts_footer.setOption({
                grid: {
                  top: '21px',
                  right: '5%',
                  left: '1%',
                  bottom: '0px',
                  containLabel: true,
                },
                // 不显示x轴的相关信息
                xAxis: {
                  show: false,
                },
                yAxis: [
                  {
                    type: 'category',
                    inverse: true,
                    data: this.classifyTypeNames,
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
                      margin: 20,
                      textStyle: {
                        align: 'center',
                      },
                    },
                  },
                  {
                    data: [],
                    inverse: false,
                    // 不显示y轴的线
                    axisLine: {
                      show: false,
                    },
                    splitLine: {
                      show: false,
                    },
                    // 不显示刻度
                    axisTick: {
                      show: false,
                    },
                    // 把刻度标签里面的文字颜色设置为白色
                    axisLabel: {
                      show: 'false',
                      color: '#fff',
                    },
                  },
                ],
                series: [
                  {
                    name: '框',
                    type: 'bar',
                    barCategoryGap: 2,
                    barWidth: 10,
                    yAxisIndex: 1,
                    data: this.xLength,
                    itemStyle: {
                      color: 'rgba(153, 153, 153, .2)',
                      borderColor: 'none',
                      barBorderRadius: 15,
                    },
                  },
                  {
                    name: '条',
                    type: 'bar',
                    data: this.xPercentage,
                    yAxisIndex: 0,
                    // 修改第一组柱子的圆角
                    itemStyle: {
                      // 此时的color 可以修改柱子的颜色
                      normal: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: 'rgba(9, 174, 219, 1)',
                          },
                          {
                            offset: 1,
                            color: 'rgba(5, 195, 184, 1)',
                          },
                        ]),
                        barBorderRadius: 15,
                      },
                    },
                    //柱子的宽度
                    barWidth: 10,
                    // 显示柱子内的文字
                    // label: {
                    //   show: true,
                    //   position: "top",

                    //   formatter: "{c}%",
                    //   textStyle: {
                    //     color: "#fff",
                    //     fontSize: "12"
                    //   },
                    // }
                  },
                ],
              })
            })
          })
          // document.getElementById('materialTypeEcharts').style.height = 42 + 'px'
          // sideBarChart.resize();//直接加这句即可
          // sideBarChart.setOption(sideBarOption, true);
          // this.$nextTick(() => {
          //   this.ehartsHeight = this.statisticalData.length * 42 + 'px'
          // })
        } else {
          this.$message.error('库存统计数据请求失败！')
        }
      })
    },

    // 获取主要材料动态数据并用echarts展示
    getDynamic() {
      getAction('/materials/classify/queryClassifyTotal', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (res.code == 200) {
          this.getDynamics = res.result
          console.log('材料动态数据getDynamics', this.getDynamics)
          // 预处理echarts中的数据
          this.getDynamics.forEach((item, index) => {
            this.materialsName.push(item.materialsName)
          })
          this.getDynamics.forEach((item, index) => {
            this.inTotal.push(item.inTotal)
          })
          this.getDynamics.forEach((item, index) => {
            this.outTotal.push(item.outTotal)
          })
          this.getDynamics.forEach((item, index) => {
            let materialsDynamicEcharts = this.$echarts.init(document.getElementById('materialsDynamicEcharts'))
            materialsDynamicEcharts.setOption({
              grid: {
                top: '15%',
                left: '50px',
                right: '50px',
                bottom: '50px',
              },
              title: {
                top: '-10px',
                left: '17px',
                subtext: '(kg)',
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
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
                  name: '累计已进场',
                  type: 'bar',
                  barWidth: '20%', //柱图宽度
                  barGap: '0.3' /*多个并排柱子设置柱子之间的间距*/,
                  barCategoryGap: 45 /*多个并排柱子设置柱子之间的间距*/,
                  data: this.inTotal,
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
                  name: '累计已使用',
                  type: 'bar',
                  barWidth: '20%', //柱图宽度
                  data: this.outTotal,
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
        } else {
          this.$message.error('主要材料动态数据请求失败！')
        }
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

.actualTre {
  color: #ffffff !important;
  background-color: #0c8fcf !important;
}

.certificateData-img {
  width: 100%;
}

// 滚动条位置
/deep/ .__bar-is-vertical {
  right: -1px !important;
}

// 隐藏横向滚动条
/deep/ .__bar-is-horizontal {
  display: none !important;
}

.project_overview {
  width: 100%;
  height: auto;
  //background: #f1f1f1;
  .project {
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-family: 'Microsoft YaHei';
    font-weight: 400;

    .project_left {
      width: 418px;

      .warehouse {
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 545px;

        #warehouse_top {
          width: 398px;
          height: 263px;
          border-bottom: 1px solid #1e385d;
        }

        .warehouse_bottom {
          margin-top: 10px;
          width: 100%;

          .warehouseMessage {
            width: 170px;
            float: left;
            margin-top: 40px;
            margin-left: 20px;
            transition: all 0.6s;

            img {
              float: left;
              margin-right: 13px;
            }

            p {
              font-weight: 14;
              color: #efefef;
            }

            span {
              font-weight: 18;
              color: #35d9e0;
              font-weight: 700;
            }
          }

          .warehouseMessage:hover {
            transform: scale(1.1);
          }
        }
      }

      .materialType {
        position: relative;
        margin-top: 15px;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 305px;

        #materialTypeEcharts {
          width: 380px;
          z-index: 1;
        }

        .materialsDynamicList {
          position: absolute;
          padding: 21px 0;
          top: -10px;
          left: 60px;
          font-family: 'Microsoft YaHei';
          color: #efefef;
          z-index: 2;

          .statisticsP {
            font-size: 10px;
            position: relative;
            width: 323px;

            .left {
              position: absolute;
              left: 0;
              margin-left: 0px;
            }

            .right {
              position: absolute;
              right: 0;
              margin-right: 20px;
            }
          }
        }
      }
    }

    .project_center {
      margin-left: 15px;
      width: 1011px;

      .videoBox {
        position: relative;
        color: white;
        height: 545px;

        .materialImages {
          height: 545px;
          width: 1002px;
        }
      }

      .materialsDynamic {
        margin-top: 15px;
        position: relative;
        color: white;
        height: 305px;

        #materialsDynamicEcharts {
          margin-top: 10px;
          width: 100%;
          height: 254px;
        }
      }
    }

    .project_right {
      margin-left: 15px;
      width: 418px;

      .dynamic {
        position: relative;
        color: white;
        height: 864px;

        .dynamicBtn {
          width: 160px;
          height: 25px;
          margin: 30px auto 0;

          .ant-btn {
            width: 80px;
            height: 25px;
            border: 1px solid rgba(4, 163, 247, 1);
            background: none;
            font-size: 14px;
            font-family: 'Microsoft YaHei';
            font-weight: 400;
            color: #03beff;
            transition: all 0.6s;
          }

          .ant-btn:active {
            background: rgba(4, 163, 247, 1);
            color: #fff;
          }
        }

        .dynamicTree {
          margin-top: 20px;
          width: 100%;
          height: 735px;
          overflow-x: hidden;
          position: relative;

          .ant-timeline {
            position: absolute;
            top: 34px;
            left: (50%-1px);
            color: #fff;

            .ant-timeline-item {
              /deep/ .ant-timeline-item-tail {
                border-left: 2px solid rgba(4, 163, 247, 1);
              }

              /deep/ .ant-timeline-item-head-blue {
                background: rgba(4, 163, 247, 1);
                border-color: rgba(4, 163, 247, 1);
              }

              img {
                float: left;
                margin-left: -160px;
              }

              p {
                // margin-bottom: 10px;
                font-size: 14px;
                font-family: 'Microsoft YaHei';
                font-weight: 400;
                color: #efefef;
                line-height: 25px;
                text-align: left;

                span {
                  color: rgba(53, 217, 224, 1);
                }
              }

              .time {
                display: inline-block;
                padding-left: 5px;
                margin-bottom: 10px;
                width: 166px;
                height: 26px;
                background: url(../../../assets/digitalScreen-images/popupBackground.png) no-repeat;
                background-size: 100% 100%;
                color: #9adcff;
                text-align: center;
                line-height: 26px;
              }
            }
          }

          .ant-timeline-item:nth-child(2n) {
            /deep/ .ant-timeline-item-head-blue {
              background: none;
              border-color: rgba(4, 163, 247, 1);
            }
          }
        }

        .dynamicTree::-webkit-scrollbar {
          width: 2px;
        }

        .dynamicTree::-webkit-scrollbar-thumb {
          border-radius: 5px;
          /* background: rgb(31, 143, 255, .5); */
          background: rgb(255, 255, 255, 0.8);
        }

        .dynamicTree::-webkit-scrollbar-track {
          border-radius: 5px;
          background: rgba(24, 127, 255, 0.2);
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
    opacity: 0.9;
    padding-top: 5px;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }
}

li {
  list-style: none;
}

.ant-carousel /deep/ .slick-slide {
  text-align: center;
  height: 537px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel ::v-deep .slick-slide h3 {
  color: #fff;
}
/deep/.ant-modal-mask {
  z-index: 999;
  background: rgba(4, 12, 25, 0.6);
}
/deep/.ant-modal {
  width: 800px !important;
}
/deep/.ant-modal-content {
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

/deep/.ant-modal-close-x {
  margin-top: 28px;
  margin-right: 23px;
  color: transparent;
  background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
}
</style>