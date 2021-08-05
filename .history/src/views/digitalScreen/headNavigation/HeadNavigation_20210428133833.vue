<template>
  <div>
    <div class="head_bd">
      <div class="top_bot" :style="'background: url(' + options.images.topBoth + ') no-repeat'">
        <div class="top_content" :style="'background: url(' + options.images.topContent + ') no-repeat center 0'">
          <p>智慧工地</p>
        </div>
        <div class="top_company">
          <div class="top_company_logo" :style="'background: url(' + options.images.leftLogo + ') no-repeat'"></div>
          <p>中铁一局集团有限公司</p>
        </div>
        <div class="top_link">
          <router-link class="link_location" to="/dashboard/analysis">
            <div class="link_logo" :style="'background: url(' + options.images.blackLogo + ') no-repeat'"></div>
            <p>后台管理系统</p>
          </router-link>
          <div class="vertical_moulding"></div>
          <div class="link_location" @click="openCompanyWeb('https://www.hzaoz.com/webSiteHome/jumpMainBusiness')">
            <div class="link_logo" :style="'background: url(' + options.images.companyLogo + ') no-repeat'"></div>
            <p>埃欧哲科技</p>
          </div>
        </div>
      </div>
      <div class="top_navigation">
        <div class="quadrangle top_left"></div>
        <div class="quadrangle top_right"></div>
        <div class="navigation_msg">
          <ul class="navigation_msg_title" v-for="(res, idx) in data.list" :key="idx" @mouseleave="mouseLeave(res)" @click="currentDirectory(idx)">
            <div v-if="idx != 0" class="title_vertical_moulding"></div>
            <li class="navigation_title">
              <router-link  class="navigation_link" :to="res.url"
                ><p @mouseover="mouseOver(res)" :class="pitchOn === idx ? 'navigation_no' : ''">{{ res.name }}</p></router-link
              >
              <ul class="navigation_link_list" v-if="res.isSubShow" @mouseover="mouseOver(res)">
                <li v-for="(item, index) in res.title" :key="index">
                  <router-link @click.native="mouseLeave(res)" class="navigation_list" to="">{{ item.titleList }}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="quadrangle bottom_left"></div>
        <div class="quadrangle bottom_right"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'

export default {
  name: 'digitalScreenList',
  components: {},
  data() {
    return {
      options: {
        images: images,
      },
      showHide: null,
      pitchOn:0,
      data: {
        list: [
          {
            name: '项目概况',
            isSubShow:false,
            url:'/projectOverview/ProjectOverview',
            // title: [
            //   {
            //     titleList: '环境监测',
            //     url: '',
            //   },
            //   {
            //     titleList: '塔机安全',
            //     url: '',
            //   },
            //   {
            //     titleList: '未冲洗车辆安全监测',
            //     url: '',
            //   },
            //   {
            //     titleList: '人员定位',
            //     url: '',
            //   },
            //   {
            //     titleList: '水位定位',
            //     url: '',
            //   },
            // ],
          },
          {
            name: '质量安全',
            isSubShow: false,
            url: '/qualityAndSafety/QualityAndSafety',
            title: [],
          },
          //  {
          //   name: '视频管理',
          //   isSubShow: false,
          //   url: '/videoManagement/VideoManage',
          //   title: [],
          // },
          // {
          //   name: '智慧梁场',
          //   isSubShow: false,
          //   url: '/girderFabricationYard/GirderFabricationYard',
          //   title: [],
          },
          {
            name: '人员管理',
            isSubShow: false,
            url: '',
            // title: [
            //   {
            //     titleList: '环境监测',
            //     url: '',
            //   },
            //   {
            //     titleList: '塔机安全',
            //     url: '',
            //   },
            // ],
          },
         
          // {
          //   name: '机械设备',
          //   isSubShow: false,
          //   url: '',
          //   title: [],
          // },
         
          // {
          //   name: '架桥机',
          //   isSubShow: false,
          //   url: '',
          //   title: [],
          // },
          // {
          //   name: '龙门吊',
          //   isSubShow: false,
          //   url: '',
          //   title: [],
          // },
          // {
          //   name: '物料管理',
          //   isSubShow: false,
          //   url: '',
          //   title: [],
          // },
          // {
          //   name: '进度计划',
          //   isSubShow: false,
          //   url: '',
          //   title: [],
          // },
          
        ],
      },
    }
  },
  created() {},
  computed: {},

  methods: {
    openCompanyWeb(url) {
      window.open(url)
    },
    mouseOver(val) {
      val.isSubShow = true
    },
    mouseLeave(val) {
      val.isSubShow = false
    },
    currentDirectory(num){
      this.pitchOn = num;
    }
  },
}
</script>
<style scoped>
.head_bd {
  position: absolute;
  z-index: 999;
}
.top_bot {
  width: 99.5vw;
  height: 60px;
}

.top_content {
  width: 100%;
  height: 76px;
  padding-top: 10px;
}
.top_content p {
  font-size: 30px;
  color: #c8e3f8;
  margin-left: 900px;
  top: 10px;
}
.top_company {
  position: relative;
  top: -70px;
  left: 30px;
  float: left;
}
.top_company_logo {
  background-color: blue;
  width: 48px;
  height: 48px;
  float: left;
}
.top_company p {
  font-size: 18px;
  color: #c8e3f8;
  float: left;
  margin-left: 13px;
  margin-top: 10px;
}
.top_link {
  position: relative;
  top: -65px;
  right: 30px;
}
.link_location {
  float: right;
}
.link_location :hover {
  cursor: pointer;
}
.link_logo {
  background-color: chartreuse;
  width: 22px;
  height: 24px;
  margin: auto;
}
.link_location p {
  font-size: 11px;
  color: #8097ac;
}
.top_navigation {
  position: relative;
  margin: auto;
  top: 16px;
  /* overflow: hidden; */
  padding: 16px 16px 4px 16px;
  float: left;
}
.navigation_msg {
  background-color: #0a3150;
  height: 50px;
  border: 1px solid #255a8b;
  opacity: 0.9;
}
.vertical_moulding {
  width: 1px;
  height: 38px;
  background-color: #153c64;
  float: right;
  margin: auto 20px;
}
.title_vertical_moulding {
  width: 2px;
  height: 22px;
  background-color: #37526e;
  float: left;
}
.quadrangle {
  position: absolute;
  width: 10px;
  height: 10px;
}
.top_left {
  top: 0px;
  left: 0;
  border-top: 1px solid #c8e3f8;
  border-left: 1px solid #c8e3f8;
}
.top_right {
  top: 0;
  right: 0;
  border-top: 1px solid #c8e3f8;
  border-right: 1px solid #c8e3f8;
}
.bottom_left {
  bottom: 0;
  left:0;
  border-bottom: 1px solid #c8e3f8;
  border-left: 1px solid #c8e3f8;
}
.bottom_right {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid #c8e3f8;
  border-right: 1px solid #c8e3f8;
}
.navigation_msg_title {
  margin-top: 10px;
  padding: 0;
  float: left;
}
.navigation_title {
  float: left;
  list-style-type: none;
}
.navigation_link p {
  font-size: 16px;
  color: #efefef;
}
.navigation_link:hover p {
  color: #3aecf2;
  font-weight: bold;
}
.navigation_no{
  color: #3aecf2 !important;
  font-weight: bold !important;
}
.navigation_link {
  width: 80px;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
  float: left;
}
.navigation_link_list {
  position: absolute;
  text-align: center;
  background-color: #0a3150;
  width: 140px;
  top: 146px;
  opacity: 1;
}
.navigation_link_list {
  padding: 0;
}
.navigation_link_list li {
  list-style-type: none;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 16px;
  color: #efefef;
}
.navigation_link_list li:hover {
  background-color: black;
}
.navigation_list {
  color: #efefef;
}
</style>