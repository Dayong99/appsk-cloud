<template>
  <div class="project_overview">
    <a-row class="project_top" :gutter="16">
      <a-col :span="5">
        <div class="top_info_intro">
          <div class="press frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
             <!-- 头部 -->
             <!-- <p class="head_title_big" >
              <a-button v-for="(item,index) in mixerBtn" :key="index" @click="switchMixer(item.deviceCode,index)" :class="selectedMixer==index?'active':''">{{item.txt}}</a-button>
              
              <span></span>
            </p > -->
            <p class="head_title">
              <a-button v-for="(item,index) of pressBtn" :key="index" @click="switchPress(item.deviceCode,item.deviceCatagory,index)" :class="selectedPress==index?'active':''" :disabled="selectedPress==index?true:false"><p>{{item.txt}}</p></a-button>
            </p>
            <table v-show="deviceCatagory==0">
                <tr v-for="(item,index) in pressList" :key="index" @click="handlePressData(item.id,index)">
                  <td>{{item.deivceCode_dictText}}</td>
                  <td>试件编号：{{item.wbbh}}</td>
                </tr>
            </table>
            <table v-show="deviceCatagory==1">
                <tr v-for="(item,index) in universalList" :key="index" @click="handleUniversalData(item.id,index)">
                  <td>{{item.deviceNumber_dictText}}</td>
                  <td>组编号：{{item.testNo}}</td>
                </tr>
            </table>
          </div>
          <div class="message frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
            <table class="top" v-show="deviceCatagory==0">
              <tr>
                <td>试件块数</td>
                <td>{{pressData.testCount}}</td>
              </tr>
              <tr>
                <td>强度等级</td>
              <td>{{pressData.strengthGrade}}</td>
              </tr>
              <tr>
                <td>试件龄期（天）</td>
                <td>{{pressData.lq}}</td>
              </tr>
              <tr>
                <td>修正系数</td>
                <td>{{pressData.xs}}</td>
              </tr>
              <tr>
                <td>试件规格（mm）</td>
                <td>{{pressData.specification}}</td>
              </tr>
            </table>
            <table class="top" v-show="deviceCatagory==1">
              <tr>
                <td>设备编号</td>
                <td>{{universalData.deviceNumber}}</td>
              </tr>
              <tr>
                <td>试验类型</td>
              <td>{{universalData.testTypeCode_dictText}}</td>
              </tr>
              <tr>
                <td>组编号</td>
                <td>{{universalData.testNo}}</td>
              </tr>
              <tr>
                <td>试件数量</td>
                <td>{{universalData.sampleCode}}</td>
              </tr>
              <tr>
                <td>操作人员</td>
                <td>{{universalData.operator}}</td>
              </tr>
            </table>
            <div class="bottom-table" v-show="deviceCatagory==0">
            <table class="bottom">
              <tr style="background:none">
                <th>试件</th>
                <th>有效力值</th>
                <th>有效强度</th>
              </tr>
              <tr v-for="(item,index) in testList" :key="index">
                <td>第{{item.serialNum}}块</td>
                <td>{{item.testLoad}}</td>
                <td>{{item.stress}}</td>
              </tr>
              <!-- <tr>
                <td>第一块</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>第二块</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>第三块</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>第四块</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>第五块</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr> -->
            </table>
            </div>
            <!-- <table class="bottom" v-show="deviceCatagory==1">
              <tr style="background:none">
                <th>参数名称</th>
                <th>第1块</th>
                <th>第2块</th>
                <th>第3块</th>
              </tr>
              <tr v-for="(item,index) in testListUn" :key="index">
                <td>{{item.name}}</td>
                <td>{{item.serialNum}}</td>
                <td>{{item.testLoad}}</td>
                <td>{{item.stress}}</td>
              </tr>
            </table> -->
            <div class="bottom-table" v-show="deviceCatagory==1">
            <div class="bottom">
              <div class="table-head clearfix">
                <div class="tw1">试件</div>
                <div class="tw2">抗拉强度(MPa)</div>
                <div class="tw3">下屈服力(kN)</div>
                <div class="tw4">下屈服强度(MPa)</div>
                <div class="tw5">最大力(kN)</div>
                <div class="tw6">最大总延伸率(%)</div>
              </div>
              <div class="table-body">
                <div class="table-row clearfix" v-for="(item,index) in unTableData" :key="index">
                  <div class="tw1">第{{item.curOrder}}块</div>
                  <div class="tw2">{{item.kyqd}}</div>
                  <div class="tw3">{{item.feL}}</div>
                  <div class="tw4">{{item.peL}}</div>
                  <div class="tw5">{{item.maxLoad}}</div>
                  <div class="tw6">{{item.agt}}</div>
                </div>
              </div>
            </div>
            </div>
            <!-- <a-table class="bottom" :columns="columns" :data-source="unTableData" v-show="deviceCatagory==1" :scroll="{ x: 730 }">
            </a-table> -->
          </div>

        </div>
      </a-col>

      <a-col :span="19">
        <div class="top_weather_team">
          <div class="weather frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>
             <!-- 头部 -->
            <p class="head_title_big" >
              <a-button v-for="(item,index) in mixerBtn" :key="index" @click="switchMixer(item.stationId,index)" :class="selectedMixer==index?'active':''" :disabled="selectedMixer==index?true:false"><p>{{item.txt}}</p></a-button>
              <!-- <a-button><p>1#搅拌站</p></a-button>
              <a-button><p>2#搅拌站</p></a-button> -->
              <span></span>
            </p>
            <div class="publicTitleBox clearfix">
              <p class="public_title">任务名称：</p>
              <div class="public_select">
                <a-select
                   v-model="defaultTaskValue" 
                   style="width:auto" 
                   :showArrow="false" 
                   dropdownClassName="dropdown-style" 
                   :dropdownMatchSelectWidth="false"
                   :defaultActiveFirstOption="false"
                   @select="onTaskSelect"
                >
                  <a-select-option v-for="(item,index) in taskTitleSource" :key="index">
                      {{item}}
                  </a-select-option>
                </a-select>
                <img src="../../../assets/digitalScreen-images/arrow-down.png" class="mixerArrow">
              </div>
            </div>
            <div class="mixing_plant">
              <div class="left">
                <p class="tittle">任务信息</p>
                <table>
                  <tr>
                    <th>搅拌站名：</th>
                    <td>{{taskDataSource.stationId_dictText}}</td>
                  </tr>
                  <tr>
                    <th>工程名称：</th>
                    <td>{{taskDataSource.projectName}}</td>
                  </tr>
                  <tr>
                    <th>用户名称：</th>
                    <td>{{taskDataSource.customerName}}</td>
                  </tr>
                  <tr>
                    <th>施工单位：</th>
                    <td>{{taskDataSource.projectCmpy}}</td>
                  </tr>
                  <tr>
                    <th>施工部位：</th>
                    <td>{{taskDataSource.projectPart}}</td>
                  </tr>
                  <tr>
                    <th>送货地址：</th>
                    <td>{{taskDataSource.shipToAdd1}}</td>
                  </tr>
                </table>
              </div>
              <div class="center">
                <p class="tittle">产品信息</p>
                <table>
                  <tr>
                    <th>水泥牌号：</th>
                    <td>{{billDataSource.cementName}}</td>
                    <th>配比编号：</th>
                    <td>{{billDataSource.recipeNo}}</td>
                  </tr>
                  <tr>
                    <th>计划方数：</th>
                    <td>{{billDataSource.planCount}}</td>
                    <th>塌落度：</th>
                    <td>{{billDataSource.tld}}</td>
                  </tr>
                  <tr>
                    <th>生产方数：</th>
                    <td>{{billDataSource.quantity}}</td>
                    <th>强度等级：</th>
                    <td>{{billDataSource.intensityLevel}}</td>
                  </tr>
                  <tr>
                    <th>单车总盘数：</th>
                    <td>{{billDataSource.totalItemNo}}</td>
                    <th>累计方数：</th>
                    <td>{{billDataSource.endCount}}</td>
                  </tr>
                  <tr>
                    <th>单车盘数：</th>
                    <td>{{billDataSource.itemNo}}</td>
                    <th>累计车数：</th>
                    <td>{{billDataSource.outCount}}</td>
                  </tr>
                  <tr>
                    <th>调度员：</th>
                    <td>{{billDataSource.dname}}</td>
                  </tr>
                  
                </table>
              </div>
              <div class="right">
                <p class="tittle">车辆信息</p>
                <table>
                  <tr>
                    <th>车号：</th>
                    <td>{{billDataSource.truckId}}</td>
                  </tr>
                  <tr>
                    <th>运距：</th>
                    <td>{{billDataSource.distance}}</td>
                  </tr>
                  <tr>
                    <th>司机名称：</th>
                    <td>{{billDataSource.reserve2}}</td>
                  </tr>
                  <tr>
                    <th>浇筑方式：</th>
                    <td>{{billDataSource.workMethod}}</td>
                  </tr>
                  <tr>
                    <th>备注：</th>
                    <td>{{billDataSource.memo2}}</td>
                  </tr>
                  
                </table>
              </div>
            </div>
            <div class="publicTitleBox clearfix spec">
              <p class="public_title">当前出货单号：</p>
              <div class="public_select">
                <a-select
                   v-model="defaultBillValue" 
                   style="width:auto" 
                   :showArrow="false" 
                   dropdownClassName="dropdown-style" 
                   :dropdownMatchSelectWidth="false"
                   :defaultActiveFirstOption="false"
                   @select="onBillSelect"
                >
                  <a-select-option v-for="(item,index) in billTitleSource" :key="index">
                      {{item}}
                  </a-select-option>
                </a-select>
                <img src="../../../assets/digitalScreen-images/arrow-down.png" class="mixerArrow">
              </div>
            </div>
            <table class="bill_of_sales_list">
              <tr>
                <th>名称</th>
                <th>小石料(S2)</th>
                <th>中石料(G2)</th>
                <th>大石料(G1)</th>
                <th>沙子1</th>
                <th>沙子(S1)</th>
                <th>水泥1</th>
                <th>水泥2</th>
                <th>水泥3</th>
                <th>水泥4</th>
                <th>粉煤灰</th>
                <th>矿粉</th>
                <th>水</th>
                <th>污水</th>
                <th>添加剂1</th>
                <th>添加剂2</th>
                <th>M17</th>
                <th>M18</th>
                <th>M19</th>
                <th>M20</th>
                <th>搅拌时间</th>
              </tr>
              <tr>
                <td>配方值</td>
                <td>{{productDataSource.recipeXsl}}</td>
                <td>{{productDataSource.recipeZsl}}</td>
                <td>{{productDataSource.recipeDsl}}</td>
                <td>{{productDataSource.recipeSz1}}</td>
                <td>{{productDataSource.recipeSz}}</td>
                <td>{{productDataSource.recipeSn1}}</td>
                <td>{{productDataSource.recipeSn2}}</td>
                <td>{{productDataSource.recipeSn3}}</td>
                <td>{{productDataSource.recipeSn4}}</td>
                <td>{{productDataSource.recipeFmh}}</td>
                <td>{{productDataSource.recipeKf}}</td>
                <td>{{productDataSource.recipeShui}}</td>
                <td>{{productDataSource.recipeSz2}}</td>
                <td>{{productDataSource.recipeWjj1}}</td>
                <td>{{productDataSource.recipeWjj2}}</td>
                <td>{{productDataSource.recipeM17}}</td>
                <td>{{productDataSource.recipeM18}}</td>
                <td>{{productDataSource.recipeM19}}</td>
                <td>{{productDataSource.recipeM20}}</td>
                <td>{{productDataSource.recipeOth1}}</td>
              </tr>
              <tr>
                <td>实际值</td>
                <td>{{productDataSource.actualXsl}}</td>
                <td>{{productDataSource.actualZsl}}</td>
                <td>{{productDataSource.actualDsl}}</td>
                <td>{{productDataSource.actualSz1}}</td>
                <td>{{productDataSource.actualSz}}</td>
                <td>{{productDataSource.actualSn1}}</td>
                <td>{{productDataSource.actualSn2}}</td>
                <td>{{productDataSource.actualSn3}}</td>
                <td>{{productDataSource.actualSn4}}</td>
                <td>{{productDataSource.actualFmh}}</td>
                <td>{{productDataSource.actualKf}}</td>
                <td>{{productDataSource.actualShui}}</td>
                <td>{{productDataSource.actualSz2}}</td>
                <td>{{productDataSource.actualWjj1}}</td>
                <td>{{productDataSource.actualWjj2}}</td>
                <td>{{productDataSource.actualM17}}</td>
                <td>{{productDataSource.actualM18}}</td>
                <td>{{productDataSource.actualM19}}</td>
                <td>{{productDataSource.actualM20}}</td>
                <td>{{productDataSource.actualOth1}}</td>
              </tr>
              <tr>
                <td>误差率</td>
                <td>{{productErrorRate.rateXsl}}</td>
                <td>{{productErrorRate.rateZsl}}</td>
                <td>{{productErrorRate.rateDsl}}</td>
                <td>{{productErrorRate.rateSz1}}</td>
                <td>{{productErrorRate.rateSz}}</td>
                <td>{{productErrorRate.rateSn1}}</td>
                <td>{{productErrorRate.rateSn2}}</td>
                <td>{{productErrorRate.rateSn3}}</td>
                <td>{{productErrorRate.rateSn4}}</td>
                <td>{{productErrorRate.rateFmh}}</td>
                <td>{{productErrorRate.rateKf}}</td>
                <td>{{productErrorRate.rateShui}}</td>
                <td>{{productErrorRate.rateSz2}}</td>
                <td>{{productErrorRate.rateWjj1}}</td>
                <td>{{productErrorRate.rateWjj2}}</td>
                <td>{{productErrorRate.rateM17}}</td>
                <td>{{productErrorRate.rateM18}}</td>
                <td>{{productErrorRate.rateM19}}</td>
                <td>{{productErrorRate.rateM20}}</td>
                <td>{{productErrorRate.rateOth1}}</td>
              </tr>
            </table>
          </div>
          
        </div>
      </a-col>
    </a-row>
    



  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction, getPress} from '@/api/manage'
import images from '@/utils/Imgaes.js'
import vueSeamLess from 'vue-seamless-scroll'
import moment from 'moment'

export default {
  name: 'TestRoom',
  components: {
    vueSeamLess,
  },
  data() {
    return {
      options: {
        images: images,
      },
      mixerBtn:[{
        stationId:'',
        txt:''
      }],
      selectedMixer:0,
      defaultTaskValue:'',
      taskTitleSource:[],
      taskListDataSource:[{
        stationId_dictText:'',
        projectName:'',
        customerName:'',
        projectCmpy:'',
        projectPart:'',
        shipToAdd1:'',
        taskId:''
      }],
      taskDataSource:{
        stationId_dictText:'',
        projectName:'',
        customerName:'',
        projectCmpy:'',
        projectPart:'',
        shipToAdd1:'',
        taskId:''
      },
      billListDataSource:[{
        cementName:'',
        planCount:'',
        quantity:'',
        totalItemNo:'',
        itemNo:'',
        dname:'',
        recipeNo:'',
        tld:'',
        intensityLevel:'',
        endCount:'',
        outCount:'',
        truckId:'',
        distance:'',
        reserve2:'',
        workMethod:'',
        memo2:''
      }],
      billDataSource:{
        cementName:'',
        planCount:'',
        quantity:'',
        totalItemNo:'',
        itemNo:'',
        dname:'',
        recipeNo:'',
        tld:'',
        intensityLevel:'',
        endCount:'',
        outCount:'',
        truckId:'',
        distance:'',
        reserve2:'',
        workMethod:'',
        memo2:''
      },
      defaultBillValue:'',
      billTitleSource:[],
      productListDataSource:[{
        recipeXsl:'',
        actualXsl:'',
        recipeZsl:'',
        actualZsl:'',
        recipeDsl:'',
        actualDsl:'',
        recipeSz1:'',
        actualSz1:'',
        recipeSz:'',
        actualSz:'',
        recipeSn1:'',
        recipeSn2:'',
        recipeSn3:'',
        recipeSn4:'',
        actualSn1:'',
        actualSn2:'',
        actualSn3:'',
        actualSn4:'',
        recipeFmh:'',
        actualFmh:'',
        recipeKf:'',
        actualKf:'',
        recipeShui:'',
        actualShui:'',
        recipeSz2:'',
        actualSz2:'',
        recipeWjj1:'',
        recipeWjj2:'',
        actualWjj1:'',
        actualWjj2:'',
        recipeM17:'',
        recipeM18:'',
        recipeM19:'',
        recipeM20:'',
        actualM17:'',
        actualM18:'',
        actualM19:'',
        actualM20:'',
        recipeOth1:'',
        actualOth1:''
      }],
      productDataSource:{
        recipeXsl:'',
        actualXsl:'',
        recipeZsl:'',
        actualZsl:'',
        recipeDsl:'',
        actualDsl:'',
        recipeSz1:'',
        actualSz1:'',
        recipeSz:'',
        actualSz:'',
        recipeSn1:'',
        recipeSn2:'',
        recipeSn3:'',
        recipeSn4:'',
        actualSn1:'',
        actualSn2:'',
        actualSn3:'',
        actualSn4:'',
        recipeFmh:'',
        actualFmh:'',
        recipeKf:'',
        actualKf:'',
        recipeShui:'',
        actualShui:'',
        recipeSz2:'',
        actualSz2:'',
        recipeWjj1:'',
        recipeWjj2:'',
        actualWjj1:'',
        actualWjj2:'',
        recipeM17:'',
        recipeM18:'',
        recipeM19:'',
        recipeM20:'',
        actualM17:'',
        actualM18:'',
        actualM19:'',
        actualM20:'',
        recipeOth1:'',
        actualOth1:''
      },
      productErrorRate:{
        rateXsl: '',
        rateZsl: '',
        rateDsl: '',
        rateSz1: '',
        rateSz: '',
        rateSn1: '',
        rateSn2: '',
        rateSn3: '',
        rateSn4: '',
        rateFmh: '',
        rateKf: '',
        rateShui: '',
        rateSz2: '',
        rateWjj1: '',
        rateWjj2: '',
        rateM17: '',
        rateM18: '',
        rateM19: '',
        rateM20: '',
        rateOth1: ''
      },
      pressBtn:[{deviceCode:'',txt:'',deviceCatagory:''}],
      pressList:[{
        wbbh:'',
        deivceCode_dictText:'',
        testCount:'',
        strengthGrade:'',
        lq:'',
        xs:'',
        specification:'',
        id:''
      }],
      pressData:{
        wbbh:'',
        deivceCode_dictText:'',
        testCount:'',
        strengthGrade:'',
        lq:'',
        xs:'',
        specification:'',
        id:''
      },
      universalList:[{
        testNo:'',
        deviceNumber_dictText:'',
        deviceNumber:'',
        testTypeCode_dictText:'',
        sampleCode:'',
        operator:''
      }],
      universalData:{
        testNo:'',
        deviceNumber_dictText:'',
        deviceNumber:'',
        testTypeCode_dictText:'',
        sampleCode:'',
        operator:''
      },
      testList:[{
        serialNum:'',
        testLoad:'',
        stress:''
      }],
      selectedPress:0,
      currentIndex:'',
      deviceCatagory:0,
      // columns:[
      //   {title:'试件',key:'1',dataIndex:'curOrder',width:90},
      //   {title:'抗拉强度(MPa)',key:'2',dataIndex:'kyqd',width:130},
      //   {title:'下屈服力(kN)',key:'3',dataIndex:'feL',width:120},
      //   {title:'下屈服强度(MPa)',key:'4',dataIndex:'peL',width:150},
      //   {title:'最大力(kN)',key:'5',dataIndex:'maxLoad',width:90},
      //   {title:'最大总延伸率(%)',key:'6',dataIndex:'agt',width:150}
      // ],
      unTableData:[
        {curOrder:'',kyqd:'',feL:'',peL:'',maxLoad:'',agt:''}
      ]
    }
  },
  mounted(){
    this.checkMenu()
    this.getDevice()
    this.getPress();
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
      
      // try{
      //   let arr = this.$store.state.enhance.menuList;
      //   console.log(arr);
      //   console.log(this.$route.path)
      //   let path = this.$route.path
      //   arr.forEach((value,index)=>{
      //     console.log(value)
      //     if(value.url == path){
      //       this.currentIndex = value.index;
      //       console.log(this.currentIndex);
      //       throw new Error("ending")
      //     }else{
      //       console.log(value)
      //     }
      //   })
      // }catch(e){
      //   if(e.message == "ending"){
      //     console.log("结束了")
      //   }else{
      //     console.log(e.message)
      //   }
      // }
      
    },
    getDevice(){
      getAction('/deviceManage/device/list',{
        deviceCatagory:'mixer',
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
          if(res.code==200){
            this.mixerBtn.splice(0,this.mixerBtn.length);
            let data = res.result.records;
            data.forEach((value,index)=>{
              this.mixerBtn.push({stationId:value.deviceNumber,txt:value.deviceName});
            })
            this.getMixerTaskList(this.mixerBtn[0].stationId);
          }
      })
    },
    getMixerTaskList(id){
      getAction('/ms/task/list',{
        stationId:id,
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        if(res.code==200){
          // console.log(res);
          if(this.taskTitleSource.length>0){
            this.taskTitleSource.splice(0,this.taskTitleSource.length);
          }
          if(this.taskListDataSource.length>0){
            this.taskListDataSource.splice(0,this.taskListDataSource.length);
          }
          let data = res.result.records;
          if(data.length!=0){
          data.forEach((value,index)=>{
            this.taskTitleSource.push(value.taskName);
            this.taskListDataSource.push({
              stationId_dictText:value.stationId_dictText,
              projectName:value.projectName,
              customerName:value.customerName,
              projectCmpy:value.projectCmpy,
              projectPart:value.projectPart,
              shipToAdd1:value.shipToAdd1,
              taskId:value.taskId
            })
          })
          this.defaultTaskValue = this.taskTitleSource[0];
          this.taskDataSource = this.taskListDataSource[0];
          this.getMixerBillList(id,this.taskDataSource.taskId);
          }
        }
      })
    },
    getMixerBillList(stationId,taskId){
      getAction('/ms/outMaster/list',{
        stationId:stationId,
        relTenantIds:this.$store.state.user.info.relTenantIds,
        taskId:taskId
      }).then((res)=>{
        // console.log(res);
        if(res.code==200){
          if(this.billListDataSource.length>0){
            this.billListDataSource.splice(0,this.billListDataSource.length)
          }
          if(this.billTitleSource.length>0){
            this.billTitleSource.splice(0,this.billTitleSource.length)
          }
          let data = res.result.records;
          if(data.length!=0){
          data.forEach((value,index)=>{
            for(let k in value){
              value[k] = (value[k]===null||value[k]===undefined||value[k]==="")?'--':value[k]
            }
            this.billListDataSource.push({
              cementName:value.cementName,
              planCount:value.planCount,
              quantity:value.quantity,
              totalItemNo:value.totalItemNo,
              itemNo:value.itemNo,
              dname:value.dname,
              recipeNo:value.recipeNo,
              tld:value.tld,
              intensityLevel:value.intensityLevel,
              endCount:value.endCount,
              outCount:value.outCount,
              truckId:value.truckId,
              distance:value.distance,
              reserve2:value.reserve2,
              workMethod:value.workMethod,
              memo2:value.memo2
            })
            this.billTitleSource.push(value.deliveryId);
          })
          this.billDataSource = this.billListDataSource[0]
          this.defaultBillValue = this.billTitleSource[0];
          this.getMixerProductList(stationId,this.defaultBillValue)
          }
        }
      })
    },
    getMixerProductList(stationId,deliveryId){
      getAction('/ms/manufacture/list',{
        stationId:stationId,
        relTenantIds:this.$store.state.user.info.relTenantIds,
        deliveryId:deliveryId
      }).then((res)=>{
        // console.log(res)
        if(res.code==200){
          if(this.productListDataSource.length>0){
            this.productListDataSource.splice(0,this.productListDataSource.length)
          }
          let data = res.result.records;
          if(data.length!=0){
          data.forEach((value,index)=>{
            this.productListDataSource.push({
              recipeXsl:value.recipeXsl,
              actualXsl:value.actualXsl,
              recipeZsl:value.recipeZsl,
              actualZsl:value.actualZsl,
              recipeDsl:value.recipeDsl,
              actualDsl:value.actualDsl,
              recipeSz1:value.recipeSz1,
              actualSz1:value.actualSz1,
              recipeSz:value.recipeSz,
              actualSz:value.actualSz,
              recipeSn1:value.recipeSn1,
              recipeSn2:value.recipeSn2,
              recipeSn3:value.recipeSn3,
              recipeSn4:value.recipeSn4,
              actualSn1:value.actualSn1,
              actualSn2:value.actualSn2,
              actualSn3:value.actualSn3,
              actualSn4:value.actualSn4,
              recipeFmh:value.recipeFmh,
              actualFmh:value.actualFmh,
              recipeKf:value.recipeKf,
              actualKf:value.actualKf,
              recipeShui:value.recipeShui,
              actualShui:value.actualShui,
              recipeSz2:value.recipeSz2,
              actualSz2:value.actualSz2,
              recipeWjj1:value.recipeWjj1,
              recipeWjj2:value.recipeWjj2,
              actualWjj1:value.actualWjj1,
              actualWjj2:value.actualWjj2,
              recipeM17:value.recipeM17,
              recipeM18:value.recipeM18,
              recipeM19:value.recipeM19,
              recipeM20:value.recipeM20,
              actualM17:value.actualM17,
              actualM18:value.actualM18,
              actualM19:value.actualM19,
              actualM20:value.actualM20,
              recipeOth1:value.recipeOth1,
              actualOth1:value.actualOth1
            })
          })
          // console.log(this.productListDataSource.length)
          this.productDataSource = this.productListDataSource[0]
          this.productErrorRate = {
            rateXsl: this.countErrorRate(this.productDataSource.recipeXsl,this.productDataSource.actualXsl),
            rateZsl: this.countErrorRate(this.productDataSource.recipeZsl,this.productDataSource.actualZsl),
            rateDsl: this.countErrorRate(this.productDataSource.recipeDsl,this.productDataSource.actualDsl),
            rateSz1: this.countErrorRate(this.productDataSource.recipeSz1,this.productDataSource.actualSz1),
            rateSz: this.countErrorRate(this.productDataSource.recipeSz,this.productDataSource.actualSz),
            rateSn1: this.countErrorRate(this.productDataSource.recipeSn1,this.productDataSource.actualSn1),
            rateSn2: this.countErrorRate(this.productDataSource.recipeSn2,this.productDataSource.actualSn2),
            rateSn3: this.countErrorRate(this.productDataSource.recipeSn3,this.productDataSource.actualSn3),
            rateSn4: this.countErrorRate(this.productDataSource.recipeSn4,this.productDataSource.actualSn4),
            rateFmh: this.countErrorRate(this.productDataSource.recipeFmh,this.productDataSource.actualFmh),
            rateKf: this.countErrorRate(this.productDataSource.recipeKf,this.productDataSource.actualKf),
            rateShui: this.countErrorRate(this.productDataSource.recipeShui,this.productDataSource.actualShui),
            rateSz2: this.countErrorRate(this.productDataSource.recipeSz2,this.productDataSource.actualSz2),
            rateWjj1: this.countErrorRate(this.productDataSource.recipeWjj1,this.productDataSource.actualWjj1),
            rateWjj2: this.countErrorRate(this.productDataSource.recipeWjj2,this.productDataSource.actualWjj2),
            rateM17: this.countErrorRate(this.productDataSource.recipeM17,this.productDataSource.actualM17),
            rateM18: this.countErrorRate(this.productDataSource.recipeM18,this.productDataSource.actualM18),
            rateM19: this.countErrorRate(this.productDataSource.recipeM19,this.productDataSource.actualM19),
            rateM20: this.countErrorRate(this.productDataSource.recipeM20,this.productDataSource.actualM20),
            rateOth1: this.countErrorRate(this.productDataSource.recipeOth1,this.productDataSource.actualOth1)
          }
          // this.countErrorRate(868,891);
          }
        }
      })
    },
    switchMixer(id,index){
      this.selectedMixer = index;
      // console.log(id);
      this.getMixerTaskList(id);
    },
    onTaskSelect(value){
      this.taskDataSource = this.taskListDataSource[value]
      this.getMixerBillList(this.mixerBtn[this.selectedMixer].stationId,this.taskDataSource.taskId);
    },
    onBillSelect(value){
      this.getMixerProductList(this.mixerBtn[this.selectedMixer].stationId,value)
    },
    countErrorRate(num1,num2){
      let val = this.Subtr(num2,num1);
      let result = parseFloat(this.accDiv(val,num1));
      result = (result*100).toFixed(2)
      if(result == 'NaN'){
        result = '0';
      }
      return result+'%';
    },
    getPress(){
      getAction('/deviceManage/device/list',{
        deviceCatagory:'universal,puress',
        relTenantIds:this.$store.state.user.info.relTenantIds
      }).then((res)=>{
        if(res.code == 200){
          this.pressBtn.splice(0,this.pressBtn.length);
          let data = res.result.records;
          data.forEach((value,index)=>{
            this.pressBtn.push({deviceCode:value.deviceNumber,txt:value.deviceName,deviceCatagory:value.deviceCatagory});
          })
          switch(this.pressBtn[0].deviceCatagory){
            case 'puress':
              this.deviceCatagory = 0;
              break;
            case 'universal':
              this.deviceCatagory = 1;
              break;
          }
          this.getPressList(this.pressBtn[0].deviceCode,this.pressBtn[0].deviceCatagory)
        }
      })

    },
    getPressList(code,cate){
      if(cate == 'puress'){
        getAction('/mixingStation/pressureRecord/list',{
          deivceCode:code
        }).then((res)=>{
          if(res.code == 200){
            if(this.pressList.length>0){
              this.pressList.splice(0,this.pressList.length)
            }
            let data = res.result.records;
            if(data.length!=0){
              data.forEach((item, idnex)=> {
                this.pressList.push({
                  wbbh:item.wbbh,
                  deivceCode_dictText:item.deivceCode_dictText,
                  testCount:item.testCount,
                  strengthGrade:item.strengthGrade,
                  lq:item.lq,
                  xs:item.xs,
                  specification:item.specification,
                  id:item.id
                })
              })
              this.pressData = this.pressList[0]
              this.pressList.splice(5);
              this.handlePressData(this.pressData.id,0)
            }
          }
        })
      }else if(cate == 'universal'){
        getAction('/universal/universalRecord/list',{
          deviceNumber:code
        }).then((res)=>{
          if(res.code == 200){
            if(this.universalList.length>0){
              this.universalList.splice(0,this.universalList.length)
            }
            let data = res.result.records;
            if(data.length!=0){
              data.forEach((item, idnex)=> {
                this.universalList.push({
                  testNo:item.testNo,
                  deviceNumber_dictText:item.deviceNumber_dictText,
                  deviceNumber:item.deviceNumber,
                  testTypeCode_dictText:item.testTypeCode_dictText,
                  sampleCode:item.sampleCode,
                  operator:item.operator,
                  id:item.id
                })
              })
              this.universalData = this.universalList[0];
              this.universalList.splice(5);
              this.handleUniversalData(this.universalData.id,0)
            }
          }
        })
      }
      
    },
    switchPress(code,cate,index){
      if(cate == 'puress'){
        this.deviceCatagory = 0;
      }else if(cate == 'universal'){
        this.deviceCatagory = 1;
      }
      this.selectedPress = index;
//       console.log(code);
      this.getPressList(code,cate)
    },
    handlePressData(id,index){
      getAction('/mixingStation/pressureRecord/queryPressureSubRecordByMainId',{
        id:id
      }).then((res)=>{
        // console.log(res)
        if(res.code == 200){
          if(this.testList.length>0){
            this.testList.splice(0,this.testList.length)
          }
          let data = res.result;
          data.forEach((value,index)=>{
            this.testList.push({
              serialNum:value.serialNum,
              testLoad:value.testLoad,
              stress:value.stress
            })
          })
        }
      })
      this.pressData = this.pressList[index]
    },
    handleUniversalData(id,index){
      getAction('/universal/universalRecord/queryUniversalRecordSubByMainId',{
        id:id
      }).then((res)=>{
        if(res.code == 200){
          if(this.unTableData.length>0){
            this.unTableData.splice(0,this.unTableData.length)
          }
          let data = res.result;
          data.forEach((value,index)=>{
            this.unTableData.push({
              curOrder:value.curOrder,
              kyqd:value.kyqd,
              feL:value.feL,
              peL:value.peL,
              maxLoad:value.maxLoad,
              agt:value.agt
            })
          })
        }
      })
      this.universalData = this.universalList[index]
    },
    Subtr(arg1, arg2) {   //减法
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    accMul(arg1, arg2) {    //乘法
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    accDiv(arg1, arg2) {    //除法
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return this.accMul((r1 / r2), Math.pow(10, t2 - t1));
    }
  }
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
.clearfix:after{
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix{
    zoom: 1;
}
.project_overview {
  width: 100%;
  height: auto;
  //background: #f1f1f1;
  .project_top,
  .project_bottom {
    display: flex;
    justify-content: space-between;
    .top_info_intro {
      width: 100%;
      .press {
        position: relative;
        padding: 0 10px;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 300px;
        table {
          width: 100%;
          height: 240px;
          text-align: center;
          font-size: 14px;
          font-family: "Microsoft YaHei";
          color: #73CFFF;
          tr {
            width: 100%;
            height: 20%;
            td{
              text-align: left;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            td:nth-child(2){
              padding-left: 10px;
            }
          }
          tr:hover {
            background: rgba(35, 63, 115, 0.8);
          }
        }
      }
      .message {
        margin-top: 15px;
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 549px;
        .top {
          width: 84%;
          margin: 20px auto 0;
          color:#fff;
          font-family: "Microsoft YaHei";
          tr {
            height: 39px;
            border-bottom: 1px solid rgba(26, 176, 231, .3);
            td:nth-child(2){
              text-align: right;
              color:rgba(58, 236, 242, 1);
            }
          }
        }
        .bottom-table{
          width: 100%;
          height: 310px;
          margin-top: 20px;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .bottom-table::-webkit-scrollbar {
            width: 2px;
        }
        .bottom-table::-webkit-scrollbar-thumb {
            border-radius: 5px;
            //  background: rgb(31, 143, 255, .5);
            background: rgb(255, 255, 255, .5);
        }
        .bottom-table::-webkit-scrollbar-track {
            border-radius: 5px;
            background: rgba(24, 127, 255, .2);
        }
        .bottom {
          width: 84%;
          margin: 0 auto;
          color:#fff;
          font-family: "Microsoft YaHei";
          text-align: center;
          overflow: hidden;
          tr {
            display:inline-block;
            margin-bottom: 12px;
            width: 309px;
            height: 32px;
            background: url(../../../assets/digitalScreen-images/bottom_tr_bg.png) no-repeat bottom;
            td ,th {
              width: 103px;
              text-align: center;
              line-height: 32px;
              font-size: 14px;
            }
            th {
              font-size: 16px;
            }
          }
          .table-head{
            font-size: 16px;
            font-weight: bold;
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin-bottom: 12px;
            width: 730px;
            div{
              float: left;
            }
          }
          .table-row{
            font-size: 14px;
            width: 730px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin-bottom: 12px;
            background: url(../../../assets/digitalScreen-images/bottom_tr_super_bg.png) no-repeat;
            background-size: 100% 100%;
            div{
              float: left;
            }
          }
          .tw1{
            width: 90px;
          }
          .tw2{
            width: 130px;
          }
          .tw3{
            width: 120px;
          }
          .tw4{
            width: 150px;
          }
          .tw5{
            width: 90px;
          }
          .tw6{
            width: 150px;
          }
          /deep/.ant-table-thead tr th{
            background:none;
            border:none;
            line-height: 32px;
            padding: 0;
            font-size: 16px;
            font-weight: bold;
            color:#fff;
            font-family: "Microsoft YaHei";
            text-align: center;
          }
          /deep/.ant-table-tbody tr{
            margin-bottom: 12px !important;
            height: 32px;
            background: url(../../../assets/digitalScreen-images/bottom_tr_super_bg.png) no-repeat;
            background-size: 100% 100%;
          }
          /deep/.ant-table-tbody tr td{
            padding: 0;
            font-size: 14px;
            color: #fff;
            border:none;
            font-family: "Microsoft YaHei";
            text-align: center;
            line-height: 32px;
          }
          /deep/.ant-table-pagination{
            display: none;
          }
        }
        .bottom::-webkit-scrollbar {
            width: 2px;
        }
        .bottom::-webkit-scrollbar-thumb {
            border-radius: 5px;
            //  background: rgb(31, 143, 255, .5);
            background: rgb(255, 255, 255, .5);
        }
        .bottom::-webkit-scrollbar-track {
            border-radius: 5px;
            background: rgba(24, 127, 255, .2);
        }
        .bottom:hover{
          overflow-x: scroll;
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

  .head_title, .head_title_big {
    width: 90%;
    height: 35px;
    margin: 20px auto 0;
    line-height: 20px;
    font-size: 16px;
    color: white;
    background: url(../../../assets/digitalScreen-images/head_title_bg.png) no-repeat bottom;
    .ant-btn {
      width: 90px;
      height: 34px;
      margin-left: 6px;
      border:none;
      color:#fff;
      background: url(../../../assets/digitalScreen-images/frameTitleOff.png) no-repeat bottom;
      text-align: center;
      border-radius: 0;
      transform: skewX(-20deg);
      p {
      transform: skewX(20deg);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      }
    } 
    .ant-btn.active{
      background: url(../../../assets/digitalScreen-images/frameTitleOn.png) no-repeat bottom;
    }
  }
  .head_title_big {
    width: 96%;
    background: url(../../../assets/digitalScreen-images/head_title_bg2.png) no-repeat bottom;
  }
  
  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    opacity: 0.9;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
  }

  
}
// 搅拌站
    .top_weather_team {
      width: 100%;
      .weather {
        position: relative;
        color: white;
        height: 864px;
        .publicTitleBox{
          padding:27px 0 15px 21px;
          .public_title {
            float: left;
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-family: "Microsoft YaHei";
            font-weight: bold;
            color: #FFFFFF;
          }
          .public_select{
            float: left;
            position: relative;
            /deep/.ant-select .ant-select-selection--single{
              height: 30px;
              line-height: 30px;
              background: transparent;
              border: none;
              font-size: 16px;
              font-family: "Microsoft YaHei";
              font-weight: bold;
              color: #FFFFFF;
              .ant-select-selection__rendered{
                margin-left: 5px;
                margin-right: 15px;
              }
            }
            /deep/.ant-select-focused .ant-select-selection{
              box-shadow: none;
            }
            .mixerArrow{
              position: absolute;
              width: 8px;
              height: 5px;
              top: 12px;
              right: 0px;
            }
          }
        }
        .publicTitleBox.spec{
          position: absolute;
          top: 526px;
          left: 0;
          width: 100%;
        }
        .mixing_plant {
          position: absolute;
          top: 126px;
          left: 2%;
          width: 96%;
          height: 400px;
          border-bottom: 1px solid rgba(73, 217, 254, .1);
          table {
              margin-left: 42px;
              tr {
                display: inline-block;
                margin-bottom: 10px;
                height: 30px;
                th {
                  width: 84px;
                  text-align: right;
                  font-weight: 400;
                }
                td{
                  padding-left: 21px;
                  width: 235px;
                  height: 100%;
                  background: rgba(7, 15, 42, .8);
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          .left, .right {
            float: left;
            width: 399px;
            height: 369px;
            background: url(../../../assets/digitalScreen-images/mixing_plant1.png);
            
          }
          .center {
            margin: 0 29px 0;
            float: left;
            width: 543px;
            height: 369px;
            background: url(../../../assets/digitalScreen-images/mixing_plant2.png);
            table {
              td {
                width: 135px;
              }
            }
          }
          .tittle {
            margin: 43px 0 21px 42px;
            font-size: 16px;
            font-family: "Microsoft YaHei";
            font-weight: 400;
            color: #35D9E0;
          }
          
        }
        .bill_of_sales {
          position: absolute;
          left: 20px;
          top: 576px;
        }
        .bill_of_sales_list {
          position: absolute;
          top: 600px;
          width: 1421px;
          margin-left: 20px;
          color:#fff;
          text-align: center;
          tr {
            height: 40px;
            th {
              background: rgba(4, 163, 247, .8);
              height: 30px;
            }
          }
          tr:first-child{
            height: 30px;
          }
        }
      }
    }
li {
  list-style: none;
}
</style>