<template>
  <div class="project_overview">
    <div class="project_top">
      <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in deviceArr" :key="index" :class="selectedTab==index?'deviceOn':''" @click.native="selectDevice(index)">
            <div class="border">
              <div class="pressList">
                <div class="pressList_tittle">
                  <img src="../../../assets/digitalScreen-images/press.png" alt="" />
                  <span>{{item.deviceName}}</span>
                </div>
                <img :src="item.devicePic" alt="" class="big_press" />
                <div class="text">
                  <p>型号：{{item.model}}</p>
                  <p>厂商：{{item.manufacturer}}</p>
                  <p>最大试验力：{{item.remarks}}</p>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
    </div>
    <div class="project_count">
    <div class="project_count_main">
      <div class="count_left">
        <div class="count_left_list">
          <p class="head">{{selectedDeviceName}}试验</p>
          <div class="count">
            <p>
              累计试验 &nbsp;&nbsp; <span>{{testCount[0]}}</span><span>{{testCount[1]}}</span><span>{{testCount[2]}}</span><span>{{testCount[3]}}</span><span>{{testCount[4]}}</span
              ><span class="unit">次</span>
            </p>
            <p>
              累计试件 &nbsp;&nbsp; <span>{{testSum[0]}}</span><span>{{testSum[1]}}</span><span>{{testSum[2]}}</span><span>{{testSum[3]}}</span><span>{{testSum[4]}}</span
              ><span class="unit">块</span>
            </p>
          </div>
        </div>
        <div class="count_left_list">
          <p class="head">试验次数统计</p>
          <div id="pressEcharts1"></div>
        </div>
        <div class="count_left_list">
          <p class="head">试验类型占比</p>
          <div id="pressEcharts2"></div>
        </div>
        <div class="count_left_list">
          <p class="head">试验类型统计</p>
          <div id="pressEcharts3"></div>
        </div>
      </div>
      <div class="count_left">
        <div class="count_left_table">
          <p class="head">试验数据分析</p>
          <div class="content-table">
          <!-- <div class="content-table testroom1"> -->
            <a-table
              v-if="deviceCatagory==0"
              :columns="pressColumns"
              :data-source="pressData"
              :pagination="false"
              rowKey="id"
              :scroll="{y: 500 }"
            >
              <a slot="status" href="javascript:;">正常</a>
            </a-table>
          <!-- </div> -->
          <!-- <div class="content-table testroom2" > -->
            <a-table
              v-else-if="deviceCatagory==1"
              :columns="univerColumns"
              :data-source="univerData"
              :pagination="false"
              rowKey="id"
              :scroll="{ x: 900, y: 500 }"
            >
              <a slot="status" href="javascript:;">正常</a>
            </a-table>
          <!-- </div> -->
          </div>
          <!-- <table>
            <thead>
              <tr>
                <td>试件编号</td>
                <td>试件序号</td>
                <td>试件规格</td>
                <td>有效力值</td>
                <td>有效强度</td>
                <td>试验类型</td>
                <td>试验日期</td>
                <td>状态</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in testDataAnalysis" :key="index">
                <td>{{item.testNo}}</td>
                <td>第{{item.serialNum}}块</td>
                <td>{{item.specification}}</td>
                <td>{{item.yxlz}}</td>
                <td>{{item.yxqd}}</td>
                <td>{{item.testType}}</td>
                <td>{{item.dateTime}}</td>
                <td class="normal">正常</td>
              </tr>
            </tbody>
          </table> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress } from '@/api/manage'
import images from '@/utils/Imgaes.js'
import vueSeamLess from 'vue-seamless-scroll'
import moment from 'moment'
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: 'TestRoom',
  components: {
    vueSeamLess,
    swiper,
    swiperSlide
  },
  data() {
    return {
      options: {
        images: images,
      },
      swiperOption: {
        loop: false,
        // loopedSlides:4,
        // loopAdditionalSlides:2,
        slidesPerView:4,
        autoplay: false
      },
      deviceArr:[{
        deviceName:'电脑全自动恒应力压力试验机器',
        devicePic:require('../../../assets/digitalScreen-images/big_press.png'),
        manufacturer:'无锡华锡建材试验仪器有限公司',
        model:'DYE-300S',
        remarks:'1000KN'
      }],
      deviceCatagory:0,
      testNumberTime:['2021/3', '2021/4', '2021/5', '2021/6', '2021/7', '2021/8', '2021/9'],
      testNumberTotal:[1, 3, 4, 2, 3, 2, 4],
      testCount:[1,6,3,0,0],
      testSum:[5,4,2,0,1],
      testTypeTitle:['钢筋原材初检', '混凝土路边砖抗折', '金属拉伸试验', '金属焊接试验', '其他'],
      testTypeCount:[1, 3, 2, 1, 4],
      testTypeData:[
        { value: 3, name: '混凝土路边砖抗折'},
        { value: 2, name: '金属拉伸试验'},
        { value: 1, name: '金属焊接试验'},
        { value: 1, name: '钢筋原材初检'},
        { value: 4, name: '其他'}
      ],
      testDataAnalysis:[
        {testNo:'YL2020071301',serialNum:1,specification:'50*150*600',yxlz:'47.82',yxqd:'29.9',testType:'水泥胶砂抗折',dateTime:'2020-07-12',status:'正常'}
      ],
      selectedTab:0,
      selectedDeviceName:'2#压力机',
      pressColumns:[
        {title:'试件编号',width:230,dataIndex:'testNo',key:'testNo'},
        {title:'试件序号',width:82,dataIndex:'serialNum',key:'1'},
        {title:'试件规格(mm)',width:112,dataIndex:'specification',key:'2'},
        {title:'有效力值',width:82,dataIndex:'yxlz',key:'3'},
        {title:'有效强度',width:82,dataIndex:'yxqd',key:'4'},
        {title:'试验类型',width:123,dataIndex:'testType',key:'5'},
        {title:'试验日期',width:120,dataIndex:'dateTime',key:'6'},
        {title:'状态',width:60,key:'status',scopedSlots: { customRender: 'status' }}
      ],
      pressData:[
        {id:1,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:2,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:3,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:4,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:5,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:6,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:7,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'},
        {id:8,testNo:'2021060700001',serialNum:1,specification:'40*40',yxlz:'65.45',yxqd:'40.9',testType:'水泥胶砂抗压',dateTime:'2021-06-22'}
      ],
      univerColumns:[
        {title:'组编号',width:269,dataIndex:'testNo',key:'testNo',fixed:'left'},
        {title:'试件序号',width:82,dataIndex:'serialNum',key:'1'},
        {title:'抗拉强度(MPa)',width:132,dataIndex:'kyqd',key:'2'},
        {title:'上屈服力(kN)',width:123,dataIndex:'feH',key:'3'},
        {title:'下屈服力(kN)',width:123,dataIndex:'feL',key:'4'},
        {title:'上屈服强度(MPa)',width:152,dataIndex:'peH',key:'5'},
        {title:'下屈服强度(MPa)',width:152,dataIndex:'peL',key:'6'},
        {title:'原始标距(mm)',width:123,dataIndex:'guage',key:'7'},
        {title:'最大力(N)',width:82,dataIndex:'maxLoad',key:'8'},
        {title:'最大位移(mm)',width:123,dataIndex:'maxPosi',key:'9'},
        {title:'弹性模量(MPa)',width:132,dataIndex:'elasticty',key:'10'},
        {title:'最大力总延伸率',width:140,dataIndex:'agt',key:'11'},
        {title:'最大力塑性延伸率',width:150,dataIndex:'ag',key:'12'},
        {title:'试验持续时间(s)',width:140,dataIndex:'duration',key:'13'},
        {title:'本组实验数量',width:123,dataIndex:'testCount',key:'14'},
        {title:'试验类型',width:123,dataIndex:'testType',key:'15'},
        {title:'试验日期',width:123,dataIndex:'dateTime',key:'16'},
        {title:'状态',width:60,key:'status',scopedSlots: { customRender: 'status' },fixed:'right'}
      ],
      univerData:[
        {id:1,testNo:'YP-2021(TJ2)-GJJ-0002',serialNum:1,kyqd:'654',feH:0,feL:52.52,peH:'0.00',peL:'464',guage:'100.00',maxLoad:73940,maxPosi:54.29,elasticty:24352,agt:'21.5',ag:'0',duration:236,testCount:'2',testType:'金属拉伸试验',dateTime:'2021-06-22'},
      ]
    }
  },
  mounted() {
    this.checkMenu();
    this.getPress(this.selectedTab);
    console.log(this.deviceCatagory)
  },
  methods: {
    checkMenu(){
      let arr = this.$store.state.enhance.menuList;
      let path = this.$route.path
      arr.forEach((value,index)=>{
        if(value.url == path){
          this.currentIndex = value.index;
        }
      })
      this.$store.commit('dsHeadIndex',this.currentIndex)
    },
    getPress(tabindex){
      getAction('/deviceManage/device/list',{
        deviceCatagory:'universal,puress',
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        if(res.code == 200){
          this.deviceArr.splice(0,this.deviceArr.length);
          let data = res.result.records;
          data.forEach((value,index)=>{
            this.deviceArr.push({
              deviceName:value.deviceName,
              devicePic:value.devicePic,
              manufacturer:value.manufacturer,
              model:value.model,
              remarks:value.remarks,
              deviceNumber:value.deviceNumber,
              deviceCatagory:value.deviceCatagory
            });
          })
          switch(this.deviceArr[tabindex].deviceCatagory){
            case 'puress':
              this.deviceCatagory = 0;
              break;
            case 'universal':
              this.deviceCatagory = 1;
              break;
          }
          console.log(this.deviceCatagory)
          this.getTestsNumber(this.deviceArr[tabindex].deviceNumber,this.deviceArr[tabindex].deviceCatagory)
          this.getTestsNumberSum(this.deviceArr[tabindex].deviceNumber,this.deviceArr[tabindex].deviceCatagory)
          this.getTestType(this.deviceArr[tabindex].deviceNumber,this.deviceArr[tabindex].deviceCatagory)
          this.getTestDataAnalysis(this.deviceArr[tabindex].deviceNumber,this.deviceArr[tabindex].deviceCatagory)
          this.selectedDeviceName = this.deviceArr[tabindex].deviceName
        }
      })
    },
    getTestsNumber(code,cate){
      getAction('/mixingStation/pressureRecord/testCountByTime',{
        deviceCatagory:cate,
        deviceNumber:code,
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        console.log(res)
        let {code,result} = res;
        if(code==200){
          this.testNumberTime.splice(0,this.testNumberTime.length)
          this.testNumberTotal.splice(0,this.testNumberTotal.length)
          result.forEach((item,index)=>{
            item.testTime = item.testTime.replaceAll("-","/");
            this.testNumberTime.push(item.testTime);
            this.testNumberTotal.push(item.total);
          })
          this.drawLine1()
        }
      })
    },
    getTestsNumberSum(code,cate){
      getAction('/mixingStation/pressureRecord/testCountSum',{
        deviceCatagory:cate,
        deviceNumber:code,
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        let {code,result} = res;
        if(code==200){
          if(result.testCount>99999){
            result.testCount = 99999
          }
          if(result.testSum>99999){
            resutl.testSum = 99999
          }
          let countArr = [];
          let sumArr = [];
          switch(result.testCount.toString().length){
            case 1:
              countArr = result.testCount.toString().split("");
              this.testCount = ["0","0","0","0"].concat(countArr);
              break;
            case 2:
              countArr = result.testCount.toString().split("");
              this.testCount = ["0","0","0"].concat(countArr);
              break;
            case 3:
              countArr = result.testCount.toString().split("");
              this.testCount = ["0","0"].concat(countArr);
              break;
            case 4:
              countArr = result.testCount.toString().split("");
              this.testCount = ["0"].concat(countArr);
              break;
            case 5:
              countArr = result.testCount.toString().split("");
              this.testCount = countArr;
              break;
          }
          switch(result.testSum.toString().length){
            case 1:
              sumArr = result.testSum.toString().split("");
              this.testSum = ["0","0","0","0"].concat(sumArr);
              break;
            case 2:
              sumArr = result.testSum.toString().split("");
              this.testSum = ["0","0","0"].concat(sumArr);
              break;
            case 3:
              sumArr = result.testSum.toString().split("");
              this.testSum = ["0","0"].concat(sumArr);
              break;
            case 4:
              sumArr = result.testSum.toString().split("");
              this.testSum = ["0"].concat(sumArr);
              break;
            case 5:
              sumArr = result.testSum.toString().split("");
              this.testSum = sumArr;
              break;
          }
          // console.log(typeof(result.testCount))
        }
      })
    },
    getTestType(code,cate){
      getAction('/mixingStation/pressureRecord/testTypeCount',{
        deviceCatagory:cate,
        deviceNumber:code,
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        let {code,result} = res;
        if(code==200){
          this.testTypeTitle.splice(0,this.testTypeTitle.length)
          this.testTypeCount.splice(0,this.testTypeCount.length)
          this.testTypeData.splice(0,this.testTypeData.length)
          result.forEach((item,index)=>{
            this.testTypeTitle.push(item.testType)
            this.testTypeCount.push(item.testCount)
            this.testTypeData.push({
              value: item.testCount, 
              name: item.testType
            })
          })
          this.drawLine2()
          this.drawLine3()
        }
      })
    },
    getTestDataAnalysis(code,cate){
      getAction('/mixingStation/pressureRecord/testDataAnalysis',{
        deviceCatagory:cate,
        deviceNumber:code,
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        console.log(res);
        let {code,result} = res;
        let data = result.records;
        if(code==200){
          if(this.deviceCatagory==0){
            this.pressData.splice(0,this.pressData.length);
            data.forEach((item,index)=>{
              this.pressData.push({
                id:index,
                testNo:item.testNo,
                serialNum:item.serialNum,
                specification:item.specification,
                yxlz:item.testLoad,
                yxqd:item.stress,
                testType:item.testType,
                dateTime:item.dateTime
              })
            })
          }else if(this.deviceCatagory==1){
            this.univerData.splice(0,this.univerData.length);
            data.forEach((item,index)=>{
              this.univerData.push({
                id:index,
                testNo:item.testNo,
                serialNum:item.serialNum,
                kyqd:item.kyqd,
                feH:item.feH,
                feL:item.feL,
                peH:item.peH,
                peL:item.peL,
                guage:item.guage,
                maxLoad:item.maxLoad,
                maxPosi:item.maxPosi,
                elasticty:item.elasticty,
                agt:item.agt,
                ag:item.ag,
                duration:item.duration,
                testCount:item.testCount,
                testType:item.testType_dictText,
                dateTime:item.dateTime
              })
            })
          }
        }
      })
    },
    selectDevice(idx){
      this.selectedTab = idx;
      this.getPress(this.selectedTab);
    },
    drawLine1() {
      let pressEcharts1 = this.$echarts.init(document.getElementById('pressEcharts1'))
      pressEcharts1.setOption({
        title: {
          subtext: '(次)',
          x: '18',
          y: '0',
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
        xAxis: {
          type: 'category',
          data: this.testNumberTime,
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
        yAxis: {
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
        series: [
          {
            data: this.testNumberTotal,
            type: 'bar',
            showBackground: false,
            barWidth: 20, //柱图宽度
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(45, 204, 146, 1)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(102, 217, 90, 1)', // 100% 处的颜色
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
    drawLine2() {
      let pressEcharts2 = this.$echarts.init(document.getElementById('pressEcharts2'))
      pressEcharts2.setOption({
        color: [
          'rgba(64, 127, 255, 1)',
          'rgba(242, 83, 77, 1)',
          'rgba(242, 199, 97, 1)',
          'rgba(242, 153, 97, 1)',
          'rgba(0, 204, 205, 1)',
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['40%', '50%'],
            data: this.testTypeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })
    },
    drawLine3() {
      let pressEcharts3 = this.$echarts.init(document.getElementById('pressEcharts3'))
      pressEcharts3.setOption({
        title: {
          subtext: '(次)',
          x: '18',
          y: '0',
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
        xAxis: {
          type: 'category',
          data: this.testTypeTitle,
          axisLabel: {
            interval: 0, //强制显示文字
            color: 'rgba(75, 113, 134, 1) ',
            fontSize: '12',
            formatter:function(value,index){
              let arr = value.split("")
              arr.splice(4,0," ");
              let str = arr.join("");
              let newStr = str.replaceAll(' ', '\n')
              return newStr;
            }
          },
          // 不显示x坐标轴的样式
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
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
        series: [
          {
            data: this.testTypeCount,
            type: 'bar',
            showBackground: false,
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
.project_overview {
  width: 100%;
  height: auto;
  .project_top {
    display: flex;
    justify-content: flex-start;
    .border {
      width: 428px;
      border: 1px solid transparent;
      position: relative;
      .pressList {
        margin: 20px 30px;
        width: 368px;
        height: 170px;
        background: #0c2041;
        border-radius: 5px;
        overflow: hidden;
        .pressList_tittle {
          width: 100%;
          height: 41px;
          background: #152d54;
          img {
            margin: 0 9px 0 20px;
          }
          span {
            color: #3aecf2;
            line-height: 41px;
          }
        }
        .big_press {
          float: left;
          margin: 21px 19px 0 28px;
          width: 63px;
          height: 82px;
        }
        .text {
          margin-top: 28px;
          p {
            line-height: 25px;
          }
        }
      }
      .border-outer{
        position: absolute;
        width: 100%;
        height: 4px;
        background: transparent;
        bottom: -3px;
        display: none;
      }
    }
    .deviceOn .border{
      border: 1px solid #126193;
      border-bottom-color: transparent;
      box-shadow: 0px 0px 15px rgba(18, 97, 147, 0.8) inset;
    }
    // .border:hover {
    //   border: 1px solid #126193;
    //   border-bottom-color: transparent;
    //   box-shadow: 0px 0px 15px rgba(18, 97, 147, 0.8) inset;
    // }
    .swiper-container{
      position: relative;
      width: 100%;
      height: 100%;
    }  
    .swiper-container .swiper-slide{
      width: 428px;
    }
  }
  .project_count {
    border: 1px solid #126193;
    box-shadow: 0px 0px 15px rgba(18, 97, 147, 0.8) inset;
    .project_count_main{
      padding: 0 30px;
      display: flex;
      justify-content: flex-start;
      margin-top: -1px;
      position: relative;
      overflow: hidden;
    }
    .count_left {
      flex: 1;
      margin-top: 30px;
      width: 50%;
      height: 630px;
      .count_left_list {
        float: left;
        width: 50%;
        height: 50%;
        .head {
          font-size: 18px;
          font-weight: 700;
          height: 30px;
          line-height: 30px;
        }
        .count {
          margin-top: 50px;
          p {
            position: relative;
            font-size: 18px;
            margin: 20px 0 0 30px;
            span {
              display: inline-block;
              margin-right: 10px;
              width: 44px;
              height: 70px;
              background: url(../../../assets/digitalScreen-images/shape.png);
              text-align: center;
              line-height: 70px;
              font-size: 60px;
              font-family: 'electronicFont';
            }
            .unit {
              position: absolute;
              bottom: 0;
              width: 18px;
              height: 18px;
              font-size: 18px;
              font-family: 'Microsoft YaHei';
              font-weight: 400;
              line-height: 18px;
              color: #00b7e9;
              background: none;
            }
          }
        }
        #pressEcharts1,
        #pressEcharts2,
        #pressEcharts3 {
          width: 100%;
          height: 285px;
        }
      }
      .count_left_table {
        .head {
          font-size: 18px;
          font-weight: 700;
          height: 30px;
          line-height: 30px;
        }
        table {
          width: 100%;
          text-align: center;
          thead {
            tr {
              height: 30px;
              background: rgba(4, 163, 247, .8);
            }
          }
          tbody {
            tr {
              height: 40px;
              .normal {
                color:rgba(50, 197, 78, 1);
              }
            }
            tr:nth-child(2n+2) {
              background: rgba(13, 35, 70, .8);
            }
          }
        }
        .content-table{
          // overflow: hidden;
          height: 540px;
          margin-top: 40px;
          margin-bottom: 20px;
          /deep/table {
            width: 100%;
            font-size: 14px;
            font-family: "Microsoft YaHei";
            font-weight: 400;
            color: #DEDEDE;
            text-align: center;
            background: transparent;
            tr {
              height: 40px;
              line-height: 40px;
            }
            .ant-table-thead > tr > th{
              height: 35px;
              line-height: 35px;
              padding: 0;
              background: rgba(4, 163, 247, .8);
              border-bottom: none;
              color: #EFEFEF;
              text-align: center;
            }
            .ant-table-thead > tr:first-child > th:last-child{
              border-top-right-radius:0px;
            }
            .ant-table-thead > tr:first-child > th:first-child{
              border-top-left-radius:0px;
            }
            .ant-table-tbody > tr > td{
              padding: 0;
              border-bottom: none;
            }
            .ant-table-tbody > tr > td > a{
              color: #32C54E;
              cursor: initial;
            }
            .ant-table-tbody > tr:nth-child(2n+1){
              background: rgba(6, 14, 41, 1);
            }
            .ant-table-tbody > tr:nth-child(2n){
              // background: rgba(13, 35, 70, .8);
              background: rgba(11, 31, 64, 1);
            }
            .ant-table-tbody > tr:hover > td{
              background: none !important;
            }
            .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
              background: none !important;
            }
          }
          /deep/.ant-table-placeholder{
            display: none;
          }
          /deep/.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-header{
            overflow: hidden !important;
            margin-bottom: 0 !important;
          }
          /deep/.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body{
            background:transparent;
          }
          /deep/.ant-table-fixed-left .ant-table-header{
            background: rgba(4, 163, 247, .8);
          }
          /deep/.ant-table-fixed-right .ant-table-header{
            width: 68px !important;
            background: rgba(4, 163, 247, .8);
          }
          /deep/.ant-table-fixed-right .ant-table-body-inner{
            overflow-y:hidden !important;
          }
          /deep/.ant-table-fixed-right .ant-table-fixed{
            border-radius: 0;
            width: 68px !important;
          }
          /deep/.ant-table-fixed-header .ant-table-scroll .ant-table-header{
            opacity: 1;
            background: rgba(4, 163, 247, .8);
          }
        }
        /deep/.ant-table-scroll .ant-table-body::-webkit-scrollbar{
          width: 2px;
        }
        /deep/.ant-table-scroll .ant-table-body::-webkit-scrollbar-thumb{
          border-radius: 5px;
          /* background: rgb(31, 143, 255, .5); */
          background: #0A2B60;
        }
        /deep/.ant-table-scroll .ant-table-body::-webkit-scrollbar-track{
          border-radius: 5px;
          background: none;
        }
        .content-table:hover{
          overflow: auto;
        }
        .content-table::-webkit-scrollbar {
            width: 2px;
        }
        .content-table::-webkit-scrollbar-thumb {
            border-radius: 5px;
            /* background: rgb(31, 143, 255, .5); */
            background: #0A2B60;
        }
        .content-table::-webkit-scrollbar-track {
            border-radius: 5px;
            background: none;
        }
      }
    }
    .count_left:first-child {
      margin-right: 30px;
    }
  }
}
</style>