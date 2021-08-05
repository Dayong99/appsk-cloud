<template>
  <div class="project_overview">
    <a-row class="project_top" :gutter="16">
      <a-col :span="6">
        <div class="top_info_intro">
          <div class="info frame">
            <!-- 边角 -->
            <div class="span_icon top_left_icon"></div>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              项目信息
            </p>

            <!-- 内容 -->
            <div class="content">
              <ul>
                <li>
                  <div class="content_bg">
                    <img src="../../../assets/digitalScreen-images/investmentBg.png" alt="" />
                  </div>
                  <div>
                    <p class="title">投资规模</p>
                    <p class="data color_yellow">
                      {{ InfoObj.investmentScale }} <span>{{ InfoObj.investmentScaleUnit_dictText }}</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div class="content_bg">
                    <img src="../../../assets/digitalScreen-images/projectStatusBg.png" alt="" />
                  </div>
                  <div>
                    <p class="title">工程状态</p>
                    <p class="data color_red">{{ InfoObj.projectStatus }}</p>
                  </div>
                </li>
                <li>
                  <div class="content_bg">
                    <img src="../../../assets/digitalScreen-images/projectStatusBg.png" alt="" />
                  </div>
                  <div>
                    <p class="title">合同工期</p>
                    <p class="data color_blue">{{ projectPro }} 天</p>
                  </div>
                </li>
                <li>
                  <div class="content_bg">
                    <img src="../../../assets/digitalScreen-images/dent.png" alt="" />
                  </div>
                  <div>
                    <p class="title">安全生产</p>
                    <p class="data color_green">{{ workSafety }} 天</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="intro frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              项目简介
            </p>

            <!-- 内容 -->
            <div class="content">
              <p class="intro_info">
                <span ref="intro_info">
                  {{ carousel }}
                </span>
              </p>
              <img :src="projectImageUrl" alt="" />
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="project_video frame">
          <span class="big_span_icon line_bg_topLeft"></span>
          <span class="big_span_icon line_bg_topRight"></span>
          <span class="big_span_icon line_bg_bottomLeft"></span>
          <span class="big_span_icon line_bg_bottomRigth"></span>
          <div class="tabList">
            <Select defaultValue="videoList[0].fileName" style="background-color: #06152f;color: #34d0da;border-radius: 4px" bordered  @change="findItemNameBYClass">
              <Option v-for="(item,index) in videoList" :value="index" :key="index" >{{item.fileName}}</Option>
            </Select>
<!--              <li  :key="index" :class="selectTabIndex==index?'on':''" @click="switchTab(index)">{{item.fileName}}</li>-->
<!--              <li class="on">宣传片</li>-->
<!--              <li>效果图</li>-->
<!--            </ul>-->
          </div>
          <video v-for="(item,index) in videoList" :key="index" controls muted autoplay class="video-js vjs-default-skin" style="width: 100%; height: 100%"
            :src="item.filePath"
            v-show="selectTabIndex==index"
          ></video>
          <!-- <video
            controls
            muted
            autoplay
            class="video-js vjs-default-skin"
            style="width: 100%; height: 100%"
            :src="video"
            v-show="selectTabIndex==0"
          ></video>
          <video
            controls
            muted
            autoplay
            class="video-js vjs-default-skin"
            style="width: 100%; height: 100%"
            :src="video2"
            v-show="selectTabIndex==1"
          ></video> -->
        </div>
      </a-col>
      <a-col :span="6">
        <div class="top_weather_team">
          <div class="weather frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              {{ weatherInfo.city }}天气
            </p>

            <!-- 内容 -->
            <div class="content">
              <div class="time_con">
                <img :src="weatherInfo.tempImg" alt="" />
                <div class="timeinfo">
                  <p class="time_now">
                    {{ nowTime }}
                  </p>
                  <p class="celsius">
                    <span style="color: #3aecf2">{{ weatherInfo.temperature }}℃</span>
                    <span style="color: #3aecf2; font-size: 20px">{{ weatherInfo.weather }}</span>
                  </p>
                </div>
              </div>
              <div class="exponent frame">
                <dl>
                  <dt>风力(等级)</dt>
                  <dd>{{ weatherInfo.windpower }}</dd>
                </dl>
                <dl>
                  <dt>风向</dt>
                  <dd>{{ weatherInfo.winddirection }}</dd>
                </dl>
                <dl>
                  <dt>湿度(%)</dt>
                  <dd>{{ weatherInfo.humidity }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="team frame">
            <!-- 边角 -->
            <span class="span_icon top_left_icon"></span>
            <span class="span_icon top_right_icon"></span>
            <span class="span_icon bottom_left_icon"></span>
            <span class="span_icon bottom_right_icon"></span>

            <!-- 头部 -->
            <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
              管理团队
            </p>

            <!-- 内容 -->
            <div class="content">
              <ul>
                <li v-for="(item, index) in teamList" :key="index">
                  <p class="title" style="color: #7ca6ed" v-if="item.personType == 1">{{ item.jobTitle_dictText }}</p>
                  <p class="title" style="color: #7ca6ed" v-else>{{ item.jobTitle }}</p>
                  <p class="name">{{ item.name }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="project_bottom" :gutter="16">
      <a-col :span="6">
        <div class="bottom_map frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>
          <div id="baiduMapMini" style="width: 450px; height: 295px"></div>
          <div class="maptype-card2">
            <div v-for="(item,index) in maptypecards2" :key="index" style="float:left;" :class="[isSelectedIndex2==index?'active':'',item.class]" @click="switchMiniMapType(index)">
                <div class="card-btn">{{item.name}}</div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="bottom_mileage frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon+"></span>
          <span class="span_icon bottom_right_icon"></span>

          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitleLog + ') 10px bottom no-repeat'">
            晴雨表
          </p>

          <!-- 内容 -->
          <div class="content">


            <!-- 晴雨表 -->
            <div class="weatherData">
              <div class="data_con" v-for="(item, index) in weatherRecently" :key="index">
                <dl>
                  <dt class="temp_date">{{item.date.substring(5, 12)}}</dt>
                  <dd>
                    <img :src="item.tempImg" alt="">
                    <p class="temp_temp">{{item.dayweather}}</p>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="line common_chart" id="main" ref="weatherRecently"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="bottom_state frame">
          <!-- 边角 -->
          <span class="span_icon top_left_icon"></span>
          <span class="span_icon top_right_icon"></span>
          <span class="span_icon bottom_left_icon"></span>
          <span class="span_icon bottom_right_icon"></span>

          <!-- 头部 -->
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            最新动态
          </p>

          <!-- 内容 -->
          <div class="content">
            <vue-seam-less :data="stateList" :class-option="scrollOption" class="seamless">
              <div class="stateSroll" ref="stateScroll">
                <div class="state" v-for="(item, index) in stateList" :key="index">
                  <img :src="item.imgPath.toString().split(',')[0]" alt="" />
                  <div>
                    <p class="info">
                      {{ item.newsContent }}
                    </p>
                    <p class="updataTime">
                      提交时间: <span> {{ item.publishDate }} </span>
                    </p>
                  </div>
                </div>
              </div>
            </vue-seam-less>
          </div>
        </div>
      </a-col>
    </a-row>

    <div v-if="popup" class="popup" :style="'background: url(' + options.images.qualityPopup + ') no-repeat'">
      <div class="popup_title">
        <p>项目里程碑</p>
        <div
          class="popup_close"
          :style="'background: url(' + options.images.closeWindow + ') no-repeat'"
          @click="popupClose"
        ></div>
      </div>
      <div class="abarbeitung">
        <p class="addTime">
          <img src="" alt="" />
          <span @click="editMilestone">新建</span>
        </p>

        <div class="cont">
          <a-form :form="form" slot="detail">
            <div class="form_con" v-for="(item, index) in modelAss" :key="index">
              <a-form-item>
                <a-date-picker
                  @change="onChange"
                  class="check_time"
                  format="YYYY-MM-DD"
                  v-model="item.milestoneDate"
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择时间"
                />
              </a-form-item>
              <a-form-item>
                <a-input placeholder="请输入内容" class="input_cont" v-model="item.milestoneContent" />
              </a-form-item>
              <span :span="2" class="delete_it" @click="deleteMilestone(index)">删除</span>
            </div>
          </a-form>
        </div>

        <div class="popup_footer">
          <div class="sure" @click="contentChange">确定</div>
          <div @click="popupClose">取消</div>
        </div>
      </div>
    </div>
    <a-modal v-model="visible0" :footer="null">
        <p>项目位置</p>
        <div class="maptype-card">
          <div v-for="(item,index) in maptypecards" :key="index" style="float:left;" :class="[isSelectedIndex==index?'active':'',item.class]" @click="switchMapType(index)">
              <div class="card-btn">{{item.name}}</div>
          </div>
        </div>
        <div><div id="baiduMap" style="width: 700px; height: 600px; margin-top:15px;"></div></div>
    </a-modal>
  </div>
</template>

<script>
import { getAction, postAction, putAction, httpAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import coordinate from '../../../assets/digitalScreen-images/coordinate.png'
import dot from '../../../assets/digitalScreen-images/dot.png'
import vueSeamLess from 'vue-seamless-scroll'
import moment from 'moment'
import echarts from 'echarts'

export default {
  name: 'ProjectOverview',
  components: {
    vueSeamLess,
  },
  data() {
    return {
      options: {
        images: images,
      },
      form: this.$form.createForm(this),
      model: [],
      modelAss: [],
      carousel: ``,
      teamList: [],
      introScroll: '',
      timer: null,
      stateList: [],
      videoList: [],
      nowTime: '',
      popup: false,
      url: {
        projectInfo: '/sys/project/list',
        weatherInfo: '/sys/project/weatherInfo',
        manageTeam: '/sys/teamManage/list',
        recentNews: '/sys/recentNews/list',
        milestone: '/sys/milestone/list',
        editMilestone: '/sys/milestone/modify',
        projectVideo: '/sys/archives/list',
      },
      relTenantId: '',
      projectImageUrl: '',
      column:'',
      order:'',
      InfoObj: {},
      longitude: '',
      latitude: '',
      projectPro: '',
      workSafety: '',
      newsList: [],
      milestoneList: [],
      weatherInfo: {},
      weatherRecently: [],
      // video:
      //   'https://aozoss.oss-cn-hangzhou.aliyuncs.com/cloud/20200519/%E6%96%BD%E5%B7%A5%E5%8A%A8%E7%94%BB20201230.mp4',
      // video2:
      //   'http://aozoss.oss-cn-hangzhou.aliyuncs.com/cloud/%E6%88%90%E4%B9%90TJ2%E6%A0%872%23%E4%B8%B4%E5%BB%BA%E5%9C%BA%E7%AB%99%E6%BC%AB%E6%B8%B8%E5%8A%A8%E7%94%BB%EF%BC%88%E5%88%9D%E7%A8%BF%EF%BC%89.mp4',
      xAxisList: [],
      daytempList: [],
      nighttempList: [],
      tempList: [],
      // tablist:['宣传片一','宣传片二'],
      selectTabIndex:0,
      currentIndex:0,
      visible0:false,
      isSelectedIndex:1,
      isSelectedIndex2:1,
      maptypecards:[
          {class:'normal',name:'地图'},
          {class:'earth',name:'混合'}
      ],
      maptypecards2:[
          {class:'normal',name:'地图'},
          {class:'earth',name:'混合'}
      ],
      map:'',
      map2:'',
      points:[
        // { x: 103.834039, y: 30.389009, name:'第二块' },
        // { x: 103.836039, y: 30.383026, name:'第三块' }
      ],
      path_points:[
        // { x: 103.840039, y: 30.395526},
        // { x: 103.843039, y: 30.379526}
      ],
      cp_points:[
        // { x: 103.847039, y: 30.389009},
        // { x: 103.846039, y: 30.383026},
      ],
      big_points_path:[],
      big_points_cp:[]
    }
  },
  watch: {
    longitude(val) {
      // this.baiduMapGLMini(val)
      // this.baiduMapGL(val)
    }
  },
  created() {
    this.relTenantId = this.$store.state.user.info.relTenantIds
    this.getProjectInfo()
    this.getManageTeam()
    this.recentNews()
    this.getMilestone()
    this.getWeather()
    this.getProjectVideo()
  },
  mounted() {
    this.checkMenu();
    // console.log(this.$store.state.enhance.selectOn)
    setInterval(this.getNow, 1000)
    this.introductionTab()
    this.newsTab()
    this.$nextTick(()=>{
      this.getMapInfo()
    })
    this.$nextTick(()=>{
      // this.baiduMapGL()
      // this.baiduMapGLMini()
    })


  },
  computed: {
    scrollOption() {
      return {
        singleHeight: 0,
        step: 0.2,
        hoverStop: true,
      }
    },
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
    //项目简介滚动
    introductionTab() {
      const speed = 200
      let scrollBox = this.$refs['intro_info']
      setInterval(() => {
        if (Math.abs(scrollBox.offsetTop) >= scrollBox.offsetHeight) {
          scrollBox.style = 'top:10px'
        } else {
          let top = scrollBox.offsetTop - 1 + 'px'
          scrollBox.style = `top: ${top}`
        }
      }, 200)
    },
    //最新动态滚动
    newsTab(){
      const speed = 200
      let scrollBox2 = this.$refs['stateScroll']
      let outer = document.getElementsByClassName('bottom_state')[0].getElementsByClassName('content')[0];
      setInterval(() => {
        if (Math.abs(scrollBox2.offsetTop) >= (scrollBox2.offsetHeight - outer.offsetHeight + 10)) {
          scrollBox2.style = 'top:10px'
        } else {
          let top = scrollBox2.offsetTop - 1 + 'px'
          scrollBox2.style = `top: ${top}`
        }
      }, 200)
    },
    //百度地图GL
    baiduMapGL(){
      var map = new BMapGL.Map("baiduMap"); //创建地图实例
      this.map = map;
      map.setMapType(BMAP_EARTH_MAP);
      let point = new BMapGL.Point(
        103.73204,29.858068
        // this.InfoObj.longitude ? this.InfoObj.longitude : 120.182461,
        // this.InfoObj.latitude ? this.InfoObj.latitude : 30.279673
      ) //创建点坐标
      map.centerAndZoom(point,15); //初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      let maptype;
      /**
       *  添加地图控件
       **/
      function addMapControls() {

        //添加地图导航控件
        map.addControl(new BMapGL.NavigationControl3D());

        //添加地图比例尺控件
        /**
         * 比例尺工具与版本标识工具所用同一个class，anchorBL, 所以，当采用CSS方式 display:none 去掉左下角
         * 的百度标识和版权标识时，缩放比例工具也会被隐藏。
         **/
        map.addControl(new BMapGL.ScaleControl());

        map.addControl(new BMapGL.ZoomControl());

      }
      addMapControls();
      function drawPointAndLine(points,big_points_path,big_points_cp){
        //画点
        let data = points
        if(points.length>0){
          data.forEach((e, i) => {
            // 创建point, 将x,y值传入
            let pointNumber = new BMapGL.Point(e.x, e.y)
            // 将data中的name加入地图中
            var label = new BMapGL.Label(e.name, {
              position: pointNumber,
              offset: new BMapGL.Size(-75, -50)
            });
            let name = e.name;
            var myIcon = new BMapGL.Icon(coordinate,new BMapGL.Size(30,41));
            markerFun(pointNumber,myIcon,name,label)
          })
        }
        function markerFun(points, myicon, name,label) {
          let markers = new BMapGL.Marker(points,{
            icon:myicon,
            title:name
          });
          map.addOverlay(markers); // 将标注添加到地图中
          label.setStyle({
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold',
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            width: '150px',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'center',
            fontFamily: '微软雅黑'
          });

          map.addEventListener('maptypechange',()=>{
            maptype = map.getMapType();
            if(maptype == 'B_NORMAL_MAP'){
              label.setStyle({
                color: '#333',
                fontSize: '14px',
                fontWeight: 'bold',
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                width: '150px',
                height: '30px',
                lineHeight: '30px',
                textAlign: 'center',
                fontFamily: '微软雅黑'
              });
            }else if(maptype == 'B_EARTH_MAP'){
                label.setStyle({
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                  width: '150px',
                  height: '30px',
                  lineHeight: '30px',
                  textAlign: 'center',
                  fontFamily: '微软雅黑'
                });
            }
            map.addOverlay(label);
          })
          map.addOverlay(label); // 将data中的name添加到地图中
        }
        //画线
        // console.log(big_points_path);
        big_points_path.forEach((value,index)=>{
          let data_path = value
          let data_cp = big_points_cp[index]
          let path = []
          let cp = []
          if(data_path.length>0){
            // var myIcon2 = new BMapGL.Icon(dot,new BMapGL.Size(25,25));
            data_path.forEach((e,i)=>{
              let pointNumber2 = new BMapGL.Point(e.x, e.y)
              path.push(pointNumber2)
              let markers = new BMapGL.Marker(pointNumber2,{
                icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
              });
              map.addOverlay(markers);
            })
            data_cp.forEach((e,i)=>{
              let cpointNumber2 = new BMapGL.Point(e.x, e.y)
              cp.push(cpointNumber2)
            })
            makerLine(path,cp,'');
          }
        })

        // if(big_points_path.length>0){
        //   let point_start = new BMapGL.Point(103.737036,29.874055)
        //   let markers_start = new BMapGL.Marker(point_start,{
        //     icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
        //   });
        //   map.addOverlay(markers_start);

        //   let point_end = new BMapGL.Point(103.857903,30.214493)
        //   let markers_end = new BMapGL.Marker(point_end,{
        //     icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
        //   });
        //   map.addOverlay(markers_end);
        // }
        
        function makerLine(paths,cpoints,myicon){
          let bc = new BMapGL.BezierCurve(paths, [cpoints])
          bc.setStrokeStyle('solid')
          bc.setStrokeColor('#FF0000')
          bc.setStrokeWeight(3)
          map.addOverlay(bc)
        }
      }
      drawPointAndLine(this.points,this.big_points_path,this.big_points_cp)

      // console.log(points);

      // var marker = new BMapGL.Marker(point); //普通点标记
      // map.addOverlay(marker);
    },
    //获取地图数据
    getMapInfo(){
      getAction('/sys/gis/list',{ relTenantIds: this.relTenantId }).then((res) => {
        console.log(res)
        let {code,result} = res;
        let data = result.records;
        if(code==200){
          if(data.length>0){
            data.forEach((item,index)=>{
              if(item.gisType == "POINT"){
                // this.points.splice(0,this.points.length)
                let arr = item.gis.split("|");
                for(var i=0;i<arr.length;i++){
                  let point = arr[i].split(',');
                  this.points.push({
                    x: point[0],
                    y: point[1],
                    name: item.gisName
                  })
                  // console.log(this.points)
                }
              }else if(item.gisType == "LINESTRING"){
                this.cp_points.splice(0,this.cp_points.length)
                let arr2 = item.gis.split(";");
                let points_path = arr2[0].split("|");
                // console.log(points_path)
                let points_cp = arr2[1].split("|");
                // console.log(points_cp)
                let arr_path = []
                for(var i=0;i<points_path.length;i++){
                  let point2 = points_path[i].split(',');
                  arr_path.push({
                    x: point2[0],
                    y: point2[1]
                  })
                }
                this.big_points_path.push(arr_path);
                // console.log(this.big_points_path)
                let arr_cp = []
                for(var j=0;j<points_cp.length;j++){
                  let point3 = points_cp[j].split(',');
                  arr_cp.push({
                    x: point3[0],
                    y: point3[1]
                  })
                }
                this.big_points_cp.push(arr_cp)
                // console.log(this.big_points_cp)
              }
            })
          }

        }
        this.baiduMapGLMini()
        // console.log(this.points)
      })
    },
    //地图切换
    switchMapType(index){
        this.isSelectedIndex = index;
        var mapIndex = 0;
        switch(this.map.getMapType()){
            case "B_NORMAL_MAP":
                mapIndex = 0;
                break;
            case "B_EARTH_MAP":
                mapIndex = 1;
                break;
        }
        if(mapIndex != index){
            if(index == 0){ //是普通地图
                this.map.setMapType(BMAP_NORMAL_MAP);
            }else{  //是卫星地图
                this.map.setMapType(BMAP_EARTH_MAP);
            }
        }
    },
    //百度迷你地图
    baiduMapGLMini(){
      var map2 = new BMapGL.Map("baiduMapMini"); //创建地图实例
      this.map2 = map2;
      map2.setMapType(BMAP_EARTH_MAP);
      let point = new BMapGL.Point(
        103.73204,29.858068
        // this.InfoObj.longitude ? this.InfoObj.longitude : 120.182461,
        // this.InfoObj.latitude ? this.InfoObj.latitude : 30.279673
      ) //创建点坐标
      let maptype;
      /**
       *  添加地图控件
       **/
      function addMapControls() {

        //添加地图导航控件
        map2.addControl(new BMapGL.NavigationControl3D());

        //添加地图比例尺控件
        /**
         * 比例尺工具与版本标识工具所用同一个class，anchorBL, 所以，当采用CSS方式 display:none 去掉左下角
         * 的百度标识和版权标识时，缩放比例工具也会被隐藏。
         **/
        map2.addControl(new BMapGL.ScaleControl());

        map2.addControl(new BMapGL.ZoomControl());

      }
      // addMapControls();
      // this.getMapInfo()

      function drawPointAndLine(points,big_points_path,big_points_cp){
        //画点
        let data = points
        if(points.length>0){
          data.forEach((e, i) => {
            // 创建point, 将x,y值传入
            let pointNumber = new BMapGL.Point(e.x, e.y)
            // 将data中的name加入地图中
            var label = new BMapGL.Label(e.name, {
              position: pointNumber,
              offset: new BMapGL.Size(-75, -50)
            });
            let name = e.name;
            var myIcon = new BMapGL.Icon(coordinate,new BMapGL.Size(30,41));
            markerFun(pointNumber,myIcon,name,label)
          })
        }
        function markerFun(points, myicon, name,label) {
          let markers = new BMapGL.Marker(points,{
            icon:myicon,
            title:name
          });
          map2.addOverlay(markers); // 将标注添加到地图中
          label.setStyle({
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold',
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            width: '150px',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'center',
            fontFamily: '微软雅黑'
          });

          map2.addEventListener('maptypechange',()=>{
            maptype = map2.getMapType();
            if(maptype == 'B_NORMAL_MAP'){
              label.setStyle({
                color: '#333',
                fontSize: '14px',
                fontWeight: 'bold',
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                width: '150px',
                height: '30px',
                lineHeight: '30px',
                textAlign: 'center',
                fontFamily: '微软雅黑'
              });
            }else if(maptype == 'B_EARTH_MAP'){
                label.setStyle({
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                  width: '150px',
                  height: '30px',
                  lineHeight: '30px',
                  textAlign: 'center',
                  fontFamily: '微软雅黑'
                });
            }
            map2.addOverlay(label);
          })
          map2.addOverlay(label); // 将data中的name添加到地图中
        }
        //画线
        big_points_path.forEach((value,index)=>{
          let data_path = value
          let data_cp = big_points_cp[index]
          let path = []
          let cp = []
          if(data_path.length>0){
            // var myIcon2 = new BMapGL.Icon(dot,new BMapGL.Size(25,25));
            data_path.forEach((e,i)=>{
              let pointNumber2 = new BMapGL.Point(e.x, e.y)
              path.push(pointNumber2)
              // console.log(path)
              let markers = new BMapGL.Marker(pointNumber2,{
                icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
              });
              map2.addOverlay(markers);
            })
            data_cp.forEach((e,i)=>{
              let cpointNumber2 = new BMapGL.Point(e.x, e.y)
              cp.push(cpointNumber2)
            })
            makerLine(path,cp,'');
          }
        })

        // if(big_points_path.length>0){
        //   let point_start = new BMapGL.Point(103.737036,29.874055)
        //   let markers_start = new BMapGL.Marker(point_start,{
        //     icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
        //   });
        //   map2.addOverlay(markers_start);

        //   let point_end = new BMapGL.Point(103.857903,30.214493)
        //   let markers_end = new BMapGL.Marker(point_end,{
        //     icon:new BMapGL.Icon(dot,new BMapGL.Size(25,25))
        //   });
        //   map2.addOverlay(markers_end);
        // }
        
        function makerLine(paths,cpoints,myicon){
          let bc = new BMapGL.BezierCurve(paths, [cpoints])
          bc.setStrokeStyle('solid')
          bc.setStrokeColor('#FF0000')
          bc.setStrokeWeight(3)
          map2.addOverlay(bc)
        }
      }
     
      drawPointAndLine(this.points,this.big_points_path,this.big_points_cp)
      map2.centerAndZoom(point,14); //初始化地图，设置中心点坐标和地图级别
      map2.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      map2.addEventListener('click', (e)=> {
        // console.log('点击位置经纬度：' + e.Ag.lng + ',' + e.Ag.lat);
        this.visible0 = true;
        this.$nextTick(()=>{
          this.baiduMapGL()
        })
      });
    },
    //迷你地图切换
    switchMiniMapType(index){
        this.isSelectedIndex2 = index;
        var mapIndex2 = 0;
        switch(this.map2.getMapType()){
            case "B_NORMAL_MAP":
                mapIndex2 = 0;
                break;
            case "B_EARTH_MAP":
                mapIndex2 = 1;
                break;
        }
        if(mapIndex2 != index){
            if(index == 0){ //是普通地图
                this.map2.setMapType(BMAP_NORMAL_MAP);
            }else{  //是卫星地图
                this.map2.setMapType(BMAP_EARTH_MAP);
            }
        }
    },
    //百度地图
    baiduMap() {
      let map = new BMap.Map('baiduMap', { mapType: BMAP_HYBRID_MAP })
      let point = new BMap.Point(
        this.InfoObj.longitude ? this.InfoObj.longitude : 120.182461,
        this.InfoObj.latitude ? this.InfoObj.latitude : 30.279673
      )
      // 将标注添加到地图中
      let navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true,
      })
      // 添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        })
      )
      map.addControl(navigationControl)
      map.centerAndZoom(point, 14) // 初始化地图,设置中心点坐标和地图级别

      map.setCurrentCity('') // 设置地图显示的城市
      // 此项是必须设置的
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

      let data = [
        { x: 103.834039, y: 30.389009, name:'第一' },
        { x: 103.844039, y: 30.389016, name:'第三' },
        { x: 103.854039, y: 30.389026, name:'第二' }
      ]

      // 创建小车图标
      // let myIcon = new BMapGL.Icon("@/src/assets/zb.png", new BMapGL.Size(30, 41));
      //引入Marker,绘制点标记
      console.log(this.InfoObj.longitude)
      console.log(this.InfoObj.latitude)
      let arrLis = {}

      // map.addEventListener('click',(e)=>{
      //   this.visible0 = true;
      // })

      map.addEventListener('click', function (e) {
        console.log('点击位置经纬度：' + e.Ag.lng + ',' + e.Ag.lat);
        arrLis.x = e.Ag.lng
        arrLis.y = e.Ag.lat
        data.push(arrLis)
        console.log(data)
        data.forEach((e, i) => {data
          // 创建point, 将x,y值传入
          let pointNumber = new BMap.Point(e.x, e.y)
          // 将data中的name加入地图中
          var label = new BMap.Label(e.name, {
            offset: new BMap.Size(25, 5)
          });
          markerFun(pointNumber,label)
        })
        function markerFun(points,label) {
          let markers = new BMap.Marker(points);
          map.addOverlay(markers); // 将标注添加到地图中
          markers.setLabel(label);
        }
      });

    //   let data = [
    //     { x: 103.834039, y: 30.389009, name:'第一' },
    //   { x: 103.844039, y: 30.389016, name:'第三' },
    //   { x: 103.854039, y: 30.389026, name:'第二' }
    // ]
      console.log(data)
      data.forEach((e, i) => {
        // 创建point, 将x,y值传入
        let pointNumber = new BMap.Point(e.x, e.y)
        // var polyline = new BMap.Polyline((e.x, e.y), {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
        // map.addOverlay(polyline);   //增加折线
        // 创建信息窗口对象  点击时触发
        // let infoWindow = new BMap.InfoWindow("World", {
        //   width: 150, // 信息窗口宽度
        //   height: 100, // 信息窗口高度
        //   // title: "Hello" + i // 信息窗口标题
        // });
        // 将data中的name加入地图中
        var label = new BMap.Label(e.name, {
          offset: new BMap.Size(25, 5)
        });
        markerFun(pointNumber,'', label)
      })
      function markerFun(points, infoWindows, label) {
        let markers = new BMap.Marker(points);
        console.log(markers);
        map.addOverlay(markers); // 将标注添加到地图中

        markers.setLabel(label); // 将data中的name添加到地图中

        // 标注的点击事件

        // markers.addEventListener("click", function (event) {
        //
        //   map.openInfoWindow(infoWindows, points);//参数：窗口、点 根据点击的点出现对应的窗口
        //
        // });

      }

      // let marker = new BMap.Marker(point)
      // map.addOverlay(marker)

    },
    //获取项目信息
    getProjectInfo() {
      getAction(this.url.projectInfo, { relTenantIds: this.relTenantId }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.InfoObj = result.records[0]
          this.carousel = this.InfoObj.projectGeneralize


          this.projectPro = moment(this.InfoObj.projectEndDate).diff(moment(this.InfoObj.projectStartDate), 'days')
          let nowTime = moment().locale('zh-cn').format('YYYY-MM-DD')
          this.workSafety = moment(nowTime).diff(moment(this.InfoObj.projectStartDate), 'days')
          this.longitude = this.InfoObj.longitude
          this.latitude = this.InfoObj.latitude
          this.projectImageUrl = this.InfoObj.projectImageUrl.split(',')[0]
        }
      })
    },
    //获取宣传片信息
    getProjectVideo() {
      getAction(this.url.projectVideo, { relTenantIds: this.relTenantId, type: 1 }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.videoList = result.records
        }
      })
    },
    //获取团队信息
    getManageTeam() {
      getAction(this.url.manageTeam, { relTenantIds: this.relTenantId, pageSize: 50, isShow: 1,column: 'sort',order: 'asc' }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.teamList = result.records
        }
      })
    },
    //获取最新动态
    recentNews() {
      getAction(this.url.recentNews, { relTenantIds: this.relTenantId }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.stateList = result.records
        }
      })
    },
    //获取里程碑
    getMilestone() {
      getAction(this.url.milestone, { relTenantIds: this.relTenantId }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.milestoneList = result.records
        }
      })
    },

    //晴雨表数据
    getWeatherRecently() {
      var chartDom = document.getElementById('main')
      var myChart = echarts.init(chartDom)
      var option = {
        tooltip: {
          trigger: 'axis',
        },
        color: ['red', 'rgb(58, 236, 242)'],
        legend: {
          data: ['白天温度', '夜间温度'],
          show: false,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          //data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: this.xAxisList,
          show: false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: '#409EFF',
          },
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            name: '夜间温度',
            type: 'line',
            stack: '总量',
            data: this.nighttempList
          },
          {
            name: '白天温度',
            type: 'line',
            stack: '总量',
            data: this.daytempList,
            markLine: {
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
            },
            label: {
              normal: {
                show: true,
              },
            },
          },
        ],
        grid: {
          top: '30%',
          bottom: '2%',
          left: '6%',
          right: '6%',
          containLabel: true,
          borderColor: '#666',
          borderWidth: 1,
        },
      }

      myChart.setOption(option)
    },
    //获取天气
    getWeather() {
      getAction(this.url.weatherInfo, { relTenantIds: this.relTenantId }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.weatherInfo = result.baseResult.lives[0]
          switch (this.weatherInfo.weather){
              case '晴':this.weatherInfo.tempImg = require('../../../assets/sunny.png');
                break;
              case '阴':this.weatherInfo.tempImg = require('../../../assets/overcast.png');
                break;
              case '小雨':this.weatherInfo.tempImg = require('../../../assets/rain.png');
                break;
              case '中雨':this.weatherInfo.tempImg = require('../../../assets/rain.png');
              break;
              case '大雨':this.weatherInfo.tempImg = require('../../../assets/rain.png');
              break;
            case '多云':this.weatherInfo.tempImg = require('../../../assets/CTO.png');
              break;
            case '多云转雨':this.weatherInfo.tempImg = require('../../../assets/Turn-cloudy-rain.png');
              break;
            case '有风':this.weatherInfo.tempImg = require('../../../assets/windiness.png');
              break;
            case '雷阵雨':this.weatherInfo.tempImg = require('../../../assets/thundershower.png');
              break;
            case '暴雨':this.weatherInfo.tempImg = require('../../../assets/rainstorm.png');
              break;
            case '暴雪':this.weatherInfo.tempImg = require('../../../assets/blizzard.png');
              break;
          }

          this.weatherRecently = result.allResult.forecasts[0].casts;

          let xa = []
          let se = []
          let se1 = []
          this.weatherRecently.forEach((item) => {

            if(item.dayweather.indexOf('阴')>-1 || item.dayweather.indexOf('云')>-1 || item.dayweather.indexOf('雾')>-1){
              item.tempImg = require('../../../assets/digitalScreen-images/cloudy.png')
            }else if(item.dayweather.indexOf('雨')>-1){
              item.tempImg = require('../../../assets/digitalScreen-images/rain.png')
            }else if(item.dayweather.indexOf('晴')>-1){
              item.tempImg = require('../../../assets/digitalScreen-images/sunny.png')
            }else if(item.dayweather.indexOf('雪')>-1){
              item.tempImg = require('../../../assets/digitalScreen-images/snow.png')
            }else{
              item.tempImg = ''
            }

            xa.push(item.date.substring(6, 12))
            se.push(item.daytemp)
            se1.push(item.nighttemp)
          })


          this.xAxisList = xa
          this.daytempList = se
          this.nighttempList = se1
          this.getWeatherRecently()
          window.addEventListener('resize', function () {
            myChart.resize()
          })
        }
      })
    },
    //当前时间
    getNow() {
      let d = new Date()
      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let ds = d.getDate()
      if (ds <= 9) {
        ds = '0' + ds
      }
      let h = d.getHours()
      if (h <= 9) {
        h = '0' + h
      }
      let f = d.getMinutes()
      if (f <= 9) {
        f = '0' + f
      }
      let s = d.getSeconds()
      if (s <= 9) {
        s = '0' + s
      }
      let days = d.getDay()
      switch (days) {
        case 1:
          days = '星期一'
          break
        case 2:
          days = '星期二'
          break
        case 3:
          days = '星期三'
          break
        case 4:
          days = '星期四'
          break
        case 5:
          days = '星期五'
          break
        case 6:
          days = '星期六'
          break
        case 0:
          days = '星期日'
          break
      }

      this.nowTime =
        y +
        '-' +
        m +
        '-' +
        ds +
        '\xa0' +
        '\xa0' +
        '\xa0' +
        '\xa0' +
        ' ' +
        h +
        ':' +
        f +
        ':' +
        s +
        '\xa0' +
        '\xa0' +
        '\xa0' +
        '\xa0' +
        days
    },
    //修改日期
    onChange(date, dateString) {},
    //修改内容
    contentChange() {
      this.modelAss.forEach((item) => {
        item.relTenantId = this.relTenantId
      })

      for (let i = 0; i < this.modelAss.length; i++) {
        if (
          this.modelAss[i].milestoneDate == '' ||
          this.modelAss[i].milestoneDate == null ||
          this.modelAss[i].milestoneContent == '' ||
          this.modelAss[i].milestoneContent == null
        ) {
          this.$message.warning('请完善里程碑信息')
          return
        }
      }

      httpAction(this.url.editMilestone, this.modelAss, 'post')
        .then((res) => {
          if (res.code == 200) {
            this.popupClose()
            this.getMilestone()
          }
        })
        .finally(() => {})
    },
    //删除里程碑
    deleteMilestone(index) {
      this.modelAss.splice(index, 1)
    },
    editMilestone() {
      this.modelAss.push({
        milestoneDate: '',
        milestoneContent: '',
      })
    },
    //打开弹窗
    popupOpen() {
      this.popup = true
      this.model = Object.assign([], this.milestoneList)
      let modelCopy = JSON.stringify(this.model)
      this.modelAss = JSON.parse(modelCopy)
    },
    //关闭弹窗
    popupClose() {
      this.form.resetFields()
      this.popup = false
    },
    // 下拉切换视频
    findItemNameBYClass:function(e){
      this.selectTabIndex = e.target.value
      console.log( e.target.value)
    }
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
      .info {
        position: relative;
        box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
        height: 278px;

        .content {
          ul {
            padding: 0 20px;
            overflow: hidden;
            li {
              float: left;
              width: 50%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding: 24px 0;
              .content_bg {
                width: 60px;
                height: 70px;
                margin-right: 14px;
              }

              div {
                .title {
                  font-size: 14px;
                  color: white;
                }
                .data {
                  font-size: 18px;
                  font-weight: bold;
                }
                .color_yellow {
                  color: rgb(239, 162, 22) !important;
                }
                .color_red {
                  color: rgb(242, 83, 77) !important;
                }
                .color_blue {
                  color: rgb(58, 236, 242) !important;
                }
                .color_green {
                  color: rgb(50, 197, 78) !important;
                }
              }
            }
          }
        }
      }
      .intro {
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        height: 278px;
        .content {
          display: flex;
          justify-content: space-between;
          padding: 30px 20px 20px;
          height: 74%;
          overflow: hidden;
          .intro_info {
            position: relative;
            top: 0;
            width: 50%;
            height: 100%;
            color: white;
            text-indent: 26px;
            text-align: justify;
            overflow: hidden;
            line-height: normal;
            span {
              top: 0px;
              position: relative;
            }
          }
          img {
            width: 45%;
            display: inline-block;
            height: 100%;
            background: #d1d1d1;
          }
        }
      }
    }
    .project_video {
      overflow: hidden;
      height: 560px;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .top_weather_team {
      width: 100%;
      .weather {
        position: relative;
        color: white;
        height: 278px;

        .content {
          padding: 0 20px;
          .time_con {
            padding: 20px 0;
            img {
              float: left;

              margin-right: 7px;
            }
            .timeinfo {
              margin-top: 10px;
              p {
                display: flex;
                justify-content: start;
                font-size: 25px;
                span {
                  margin-right: 20px;
                  i {
                    font-style: normal;
                  }
                }
              }
              .time_now {
                font-size: 20px;
              }
              .celsius {
                font-family: '宋体', Helvetica, Arial, sans-serif;
                margin-top: 10px;
                line-height: 37px;
              }
            }
          }
          .exponent {
            border-radius: 4px;
            padding: 4%;
            font-size: 16px;
            display: flex;
            justify-content: space-around;
            margin: 0 0 10px;
            dl {
              float: left;
            }
          }
        }
      }
      .team {
        position: relative;
        margin-top: 10px;
        height: 278px;

        .content {
          padding: 20px;
          color: white;
          height: 80%;
          overflow-y: scroll;
          ul {
            overflow: hidden;
            li {
              float: left;
              width: 31%;
              background: #062744;
              text-align: center;
              line-height: 20px;
              margin-top: 3%;
              margin-right: 3%;
              padding: 6px 0;

              .title {
                font-size: 14px;
              }
              .name {
                font-size: 18px;
              }
            }
            li:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
        .content::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    }

    .bottom_mileage,
    .bottom_state,
    .bottom_map {
      position: relative;
      margin-top: 10px;
      height: 295px;
    }
    .bottom_mileage {
      .head_title {
        background-size: 96% !important;
      }
      .content {
        padding: 10px 20px 0;
        position: relative;
        height: 80%;
        //overflow-y: scroll;
        ul {
          font-size: 14px;
          overflow: hidden;
          li {
            float: left;
            width: 20%;
            .time {
              background: url('http://47.110.243.20:8080/aoz_cloud/static/common/images/bn.png');
              background-size: 100%;
              padding: 0 4px;
              height: 30px;
              color: #ccc;
              width: 53%;
              line-height: 25px;
              text-align: center;
              margin: 0 auto;
              font-size: 14px;
              font-family: 'Microsoft YaHei';
              font-weight: bold;
            }
            .line {
              width: 100%;
              padding-bottom: 8%;
              height: 0;
              margin-top: 11%;
              background: #4d4c4c;
            }

            .point {
              width: 16px;
              height: 16px;
              background: #7ed2ff;
              margin: 11% auto;
              border-radius: 50%;
              margin-top: -12%;
              background: #1d2c45;
            }
            .info {
              text-align: right;
              color: #4d4c4c;
              margin-top: 41%;
              width: 115%;
              margin-left: -45%;
              transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -webkit-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
              overflow: hidden;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              -webkit-text-overflow: ellipsis;
              -moz-text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          li:nth-child(1) .line {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
        }
        .editPen {
          position: absolute;
          cursor: pointer;
          bottom: 20px;
          right: 20px;
          font-size: 20px;
          color: white;
        }
        .weatherData {
          color: #fff;
          margin: 0 38px;
          display: flex;
            justify-content: space-between;
          .data_con{
            dl{
              .temp_date{
                color: rgb(58, 236, 242);
                margin-bottom: 10px;
              }
              dd{
                text-align: center;
              }
              img{
                width: 26px; height: 26px;
              }
            }
          }
        }
        #main {
          position: absolute;
          top: 60px;
          left: -1%;
          bottom: 0px;
          width: 100%;
          height: 200px;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      }
      .content::-webkit-scrollbar {
        height: 0;
        width: 0;
      }
    }
    .bottom_state {
      .content {
        padding: 20px;
        height: 210px;
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
        .stateSroll {
          overflow: hidden;
          position: relative;
          .state {
            display: flex;
            justify-content: start;
            margin-bottom: 16px;
            img {
              display: inline-block;
              width: 100px;
              height: 60px;
            }
            div {
              color: white;
              margin-left: 20px;
              .info {
                width: 100%;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
                overflow: hidden;
              }
              .updataTime {
                color: rgb(4, 163, 247);
              }
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

  .tabList{
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 12;
    ul.typeTab{
      height: 34px;
      font-size: 0;
      li{
        float: left;
        width: auto;
        height: 34px;
        margin-right: 3px;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        color: #efefef;
        background: url(../../../assets/digitalScreen-images/centerBtn.png) no-repeat;
        background-size: 100% 100%;
        display: block;
        cursor: pointer;
      }
      li.on{
        color: #3aecf2;
        font-weight: bold;
        background: url(../../../assets/digitalScreen-images/centerBtn-on.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .head_title {
    line-height: 50px;
    padding-left: 30px;
    font-size: 16px;
    color: white;
  }

  .frame {
    background-color: #061630;
    border: 1px solid #255a8b;
    opacity: 0.9;
    box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
    -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%);
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
    position: relative;
    height: 636px;
    overflow-y: auto;
    .addTime {
      color: rgba(4, 163, 247, 1);
      width: 93%;
      margin: 0 auto;
      margin-top: 3%;
      padding-bottom: 1.5%;
      border-bottom: 1px solid rgba(6, 68, 116, 1);
      cursor: pointer;
    }
    .cont {
      width: 93%;
      margin: 0 auto;
    }
  }
  .form_con {
    display: flex;
    justify-content: space-around;
    align-item: center;
    margin-top: 20px;
  }
  .check_time {
    width: 210px;
  }
  .input_cont {
    width: 280px;
    text-indent: 12px;
  }
  .delete_it {
    color: white;
    line-height: 32px;
    cursor: pointer;
  }
  .popup_footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
    div {
      border: 1px solid rgba(4, 163, 247, 1);
      border-radius: 5px;
      margin: 2.5% auto;
      font-size: 14px;
      text-align: center;
      color: rgba(4, 163, 247, 1);
      float: right;
      width: 15%;
      line-height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    .sure {
      background: rgba(4, 163, 247, 1);
      color: white;
    }
  }
}
li {
  list-style: none;
}
.maptype-card{
  position: absolute;
  // inset: 65px 80px auto auto;
  top: 65px;
  right: 80px;
  white-space: nowrap;
  z-index: 10;
  cursor: pointer;
}
.maptype-card2{
  position: absolute;
  // inset: 20px 20px auto auto;
  top: 20px;
  right: 20px;
  white-space: nowrap;
  z-index: 10;
  cursor: pointer;
}
.maptype-card .card-btn,.maptype-card2 .card-btn{
  box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
  border:1px solid rgb(139, 164, 220);
  background: rgb(255,255,255);
  padding: 2px 6px;
  font-style: normal;
  font-variant: normal;
  font-stretch: normal;
  font-size: 12px;
  line-height: 1.3em;
  font-family: arial, sans-serif;
  text-align: center;
  white-space: nowrap;
  color: rgb(0,0,0);
}
.maptype-card .normal .card-btn,.maptype-card2 .normal .card-btn{
  border-radius: 3px 0px 0px 3px;
}
.maptype-card .earth .card-btn,.maptype-card2 .earth .card-btn{
  border-radius: 0px 3px 3px 0px;
}
.maptype-card .active .card-btn,.maptype-card2 .active .card-btn{
  box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
  border:1px solid rgb(139, 164, 220);
  background: rgb(142, 168, 224);
  padding: 2px 6px;
  font: bold 12px / 1.3em arial, sans-serif;
  text-align: center;
  white-space: nowrap;
  color: rgb(255,255,255);
}
/deep/.ant-modal-mask{
  z-index: 999;
  background: rgba(4, 12, 25, 0.6)
}
/deep/.ant-modal {
    width: 800px !important;
}
/deep/.ant-modal-content {
    padding: 0 10px;
    width: 800px;
    height: 700px;
    color: #fff;
    background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;
    background-size: 96% 100% !important;
    p {
        font-size: 14px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color: #FFFFFF;
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
                    input::-webkit-input-placeholder{
                        color:rgba(115, 139, 169, 1);
                    }
                    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:rgba(115, 139, 169, 1);
                    }
                    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:rgba(115, 139, 169, 1);
                    }
                    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
                        color:rgba(115, 139, 169, 1);
                    }
                }
            }
        }
        .ok, .onOk {
            margin: 20px 40px 0 0;
            float: right;
            width: 80px;
            height: 34px;
            background: none;
            border-radius: 5px;
            border: 1px solid #04A3F7;
            color:#04A3F7;
        }
        .ok {
            background: #04A3F7;
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
    margin-top: 33px;
    margin-right: 20px;
    color:transparent;
    background:url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
}
/* 去除百度地图版权那行字 和 百度logo */
/deep/.BMap_cpyCtrl {
    display: none !important;
}
/deep/.anchorBL {
    display: none !important;
}
</style>