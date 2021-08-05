<template>
  <div class="project_overview">
    <!-- 上面盒子 -->
    <a-row class="project_top">
      <!-- 视频 -->
      <div class="video">
        <div class="jiaobiaoImg"></div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        >
        </video-player>
      </div>
      <!-- 文章发布 -->
      <div class="article jiaobiao_box">
        <div class="jiaobiao"></div>
        <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
          文章发布
        </p>
        <ul class="articleList">
          <li type="primary" @click="articleShowModal(item.id)" v-for="item in Article" :key="item.id">
            <p>{{ item.title }}</p>
            <p class="time">{{ item.createTime }}</p>
          </li>
          <a-modal v-model="articleVisible" :footer="null" :centered="true">
            <p class="box_title">文章发布</p>
            <span>{{ article_List.title }}</span>
            <h6>{{ article_List.createTime }}</h6>
            <a-divider />
            <div class="party_content" v-html="article_List.content"></div>
          </a-modal>
        </ul>
      </div>
      <!-- 党团活动 -->
      <div class="activity article jiaobiao_box">
        <div class="jiaobiao"></div>
        <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
          党团活动
        </p>
        <img src="../../../assets/digitalScreen-images/activityImg.png" alt="" />
        <ul class="activity articleList">
          <li type="primary" @click="activityShowModal(item.id)" v-for="item in Activity" :key="item.id">
            <p>{{ item.title }}</p>
            <p class="time">{{ item.createTime }}</p>
          </li>
          <a-modal v-model="activityVisible" :footer="null" :centered="true">
              <p class="box_title">党团活动</p>
            <span>{{ activity_List.title }}</span>
            <h6>{{ activity_List.createTime }}</h6>
            <a-divider />
            <div class="party_content" v-html="activity_List.content"></div>
          </a-modal>
        </ul>
      </div>
    </a-row>
    <!-- 下面盒子 -->
    <a-row class="project_bottom">
      <!-- 党史课堂 -->
      <div class="classroom jiaobiao_box">
        <div class="jiaobiao"></div>
        <p class="head_title" :style="'background: url(' + options.images.big_Title_bg + ') 10px bottom no-repeat'">
          党史课堂
        </p>
        <vue-seamless-scroll :data="classroom_listData" :class-option="classOption1" class="warp">
          <ul :style="'width:' + wid_data + 'px'">
            <li type="primary" @click="classroomShowModal(item.id)" v-for="(item, index) in classroom_listData" :key="index">
              <img :src="item.pic" alt="" />
              <div class="classroom_footer">
                <span class="tittle" v-text="item.title"></span><br />
                <span class="content" v-text="item.origin"></span>
                <span class="time" v-text="item.createTime"></span>
                <img src="../../../assets/digitalScreen-images/footer_img.png" alt="" />
              </div>
            </li>
            <a-modal v-model="classroomVisible" :footer="null" :centered="true">
              <p class="box_title">党史课堂</p>
              <span>{{ classroom_List.title }}</span>
              <h6>{{ classroom_List.createTime }}</h6>
            <a-divider />
              <div class="party_content" v-html="classroom_List.content"></div>
            </a-modal>
          </ul>
        </vue-seamless-scroll>
      </div>
      <!-- 党组成员 -->
      <div class="member jiaobiao_box">
        <div class="jiaobiao"></div>
        <p class="head_title" :style="'background: url(' + options.images.big_Title_bg + ') 10px bottom no-repeat'">
          党组成员
        </p>
        <vue-seamless-scroll :data="member_listData" :class-option="classOption2" class="warp">
          <ul :style="'width:' + wid_data2 + 'px'">
            <li type="primary" v-for="(item, index) in member_listData" :key="index">
              <img :src="item.personImage" alt="" />
              <p class="duty" v-text="item.position"></p>
              <p class="name" v-text="item.personName"></p>
            </li>
          </ul>
        </vue-seamless-scroll>
        <vue-seamless-scroll :data="member_listData2" :class-option="classOption2" class="warp">
          <ul :style="'width:' + wid_data2 + 'px'">
            <li type="primary" v-for="(item, index) in member_listData2" :key="index">
              <img :src="item.personImage" alt="" />
              <p class="duty" v-text="item.position"></p>
              <p class="name" v-text="item.personName"></p>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </a-row>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import images from '@/utils/Imgaes.js'
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {
  components: {
    videoPlayer,
    vueSeamlessScroll,
  },
  data() {
    return {
      // 文章发布
      Article: {},
      article_List: {},
      articleVisible: false,
      // 党团活动
      Activity: {},
      activity_List: {},
      activityVisible: false,
      // 党史课堂
      wid_data: 0,
      classroom_listData: [],
      classroom_List: {},
      classroomVisible: false,
    //   党组成员
      wid_data2: 0,
      member_listData: [],
      member_listData2: [],
      options: {
        images: images,
      },
      //   视频
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '976:515', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4',
            src: 'http://flv4mp4.people.com.cn/videofile7/pvmsvideo/2020/12/25/SongHeLi_488c1b771d69704f8745972409f64528.mp4', //视频url地址
          },
        ],
        poster: require('../../../assets/digitalScreen-images/PartyBuilding-videoImg.png'), //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
    }
  },
  computed: {
    classOption1() {
      return {
        direction: 2,
        step: 1,
        limitMoveNum: 3,
        openWatch: true, // 开启数据实时监控刷新dom
        hoverStop: true, // 是否开启鼠标悬停stop
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      }
    },
    classOption2() {
      return {
        direction: 2,
        step: 1,
        limitMoveNum: 9,
        openWatch: true, // 开启数据实时监控刷新dom
        hoverStop: true, // 是否开启鼠标悬停stop
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      }
    },
  },
  mounted() {
    this.checkMenu()
    this.getarticle()
    this.getactivity()
    this.getclassroom()
    this.getmember()
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
    // 关闭弹窗
    handleOk(e) {
      console.log(e)
    },
    // 获取文章发布数据
    getarticle() {
      getAction('/sys/vrArticle/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.Article = result.records
        }
      })
    },
    // 获取文章发布弹窗数据
    articleShowModal(id) {
      let arr = {
        id: id,
      }
      this.articleVisible = true
      getAction('/sys/vrArticle/list', arr).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.article_List = result.records[0]
        }
      })
    },
    // 获取党团活动数据
    getactivity() {
      getAction('/sys/vrArticle/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.Activity = result.records
        }
      })
    },
    // 获取党团活动弹窗数据
    activityShowModal(id) {
      let arr = {
        id: id,
      }
      this.activityVisible = true
      getAction('/sys/vrArticle/list', arr).then((res) => {
        let { code, result } = res
        if (code == 200) {
          console.log(res)
          this.activity_List = result.records[0]
        }
      })
    },
    // 获取党史课堂数据
    getclassroom() {
      getAction('/sys/vrClass/list', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.classroom_listData = result.records
          this.wid_data = this.classroom_listData.length * 306
        }
      })
    },
    // 获取党史课堂弹窗数据
    classroomShowModal(id) {
      let arr = {
        id: id,
      }
      this.classroomVisible = true
      getAction('/sys/vrClass/list', arr).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.classroom_List = result.records[0]
        }
      })
    },
    // 获取党组成员数据
    getmember() {
      getAction('/sys/vrPerson/noPageList', {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        let { code, result } = res
        console.log(result)
        if (code == 200) {
          let member_listData_new = []

          if(result.length>8&&result.length<=16){
              member_listData_new = result.splice(0,8)
              console.log(member_listData_new)
          }else if(result.length>16){
              let split_num = result.length/2;
              split_num = Math.ceil(split_num);
              console.log(split_num)
              member_listData_new = result.splice(0,split_num)
              console.log(member_listData_new)
          }  
          this.member_listData = member_listData_new
          this.member_listData2 = result;
          this.wid_data2 = this.member_listData.length * 107
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.head_title {
  line-height: 40px;
  padding-left: 20px;
  font-size: 16px;
  color: white;
  background-size: 96% !important;
}
.jiaobiao_box {
  &::before {
    position: absolute;
    left: -2px;
    top: -2px;
    width: 20px;
    height: 20px;
    border-top: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
    content: '';
  }
  &::after {
    position: absolute;
    right: -2px;
    top: -2px;
    width: 20px;
    height: 20px;
    border-top: 3px solid #04a3f7;
    border-right: 3px solid #04a3f7;
    content: '';
  }
  .jiaobiao {
    width: 100%;
    &::before {
      position: absolute;
      left: -2px;
      bottom: -2px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-left: 3px solid #04a3f7;
      content: '';
    }
    &::after {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-right: 3px solid #04a3f7;
      content: '';
    }
  }
}
/deep/.ant-modal {
  width: 800px !important;
}
/deep/.ant-modal-content {
  position: relative;
  padding: 0 10px;
  width: 800px;
  height: 700px;
  color: #fff;
  background: url(../../../assets/digitalScreen-images/certificate_img_bg.png) no-repeat !important;
  background-size: 100% 100% !important;
  text-align: center;
  .box_title {
    position: absolute;
    top: 23px;
    left: 38px;
  }
  span {
    display: inline-block;
    margin-top: 40px;
    // width: 650px;
    font-size: 16px;
    font-weight: 700;
  }
  h6 {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
  }
  .ant-divider-horizontal {
    margin: 15px 0 10px;
    opacity: 0.1;
  }
  .party_content {
    margin-top: 20px;
    padding: 0 20px;
    position: relative;
    height: 480px;
    overflow-x: hidden;
    font-size: 14px;
    line-height: 25px;
    letter-spacing: 2px;
    text-indent: 2em;
    font-weight: 400;
    text-align: left;
  }
  .party_content::-webkit-scrollbar {
    width: 2px;
  }
  .party_content::-webkit-scrollbar-thumb {
    border-radius: 5px;
    /* background: rgb(31, 143, 255, .5); */
    background: rgb(255, 255, 255, 0.8);
  }
  .party_content::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(24, 127, 255, 0.2);
  }
}
/deep/.ant-modal-close-x {
  position: absolute;
  right: 32px;
  top: 0;
  width: 18px;
  height: 18px;
  color: transparent;
  background: url(../../../assets/digitalScreen-images/closeWindow.png) no-repeat;
}
.project_overview {
  width: 100%;
  height: auto;
  .project_top {
    display: flex;
    justify-content: flex-start;
    // 党团视频
    .video {
      position: relative;
      width: 1020px;
      height: 525px;
      border: 1px solid #04a3f7;
      box-sizing: border-box;
      &::before {
        position: absolute;
        left: -5px;
        top: -8px;
        width: 192px;
        height: 45px;
        background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
        background-size: 100% 100%;
        content: '';
        z-index: 2;
      }
      &::after {
        position: absolute;
        right: -81px;
        top: 69px;
        width: 192px;
        height: 45px;
        background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
        background-size: 100% 100%;
        transform: rotate(90deg);
        content: '';
        z-index: 2;
      }
      .jiaobiaoImg {
        width: 100%;
        &::before {
          position: absolute;
          left: -81px;
          bottom: 70px;
          width: 192px;
          height: 45px;
          background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
          background-size: 100% 100%;
          transform: rotate(270deg);
          content: '';
          z-index: 2;
        }
        &::after {
          position: absolute;
          right: -5px;
          bottom: -7px;
          width: 192px;
          height: 45px;
          background: url(../../../assets/digitalScreen-images/jiaobiao.png) no-repeat;
          background-size: 100% 100%;
          transform: rotate(180deg);
          content: '';
          z-index: 2;
        }
      }
      .vjs-custom-skin {
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }
    // 文章发布
    .article {
      position: relative;
      padding: 10px 0 0 0;
      margin-left: 20px;
      width: 419px;
      height: 525px;
      border: 1px solid #126193;
      background: rgba(7, 39, 63, 0.33);
      box-sizing: border-box;
      .articleList {
        padding-left: 30px;
        width: 100%;
        height: 430px;
        overflow-x: hidden;
        li {
          padding-top: 10px;
          width: 90%;
          height: 100px;
          color: #fff;
          border-bottom: 1px solid #1f314e;
          box-sizing: border-box;
          .time {
            color: #04a3f7;
          }
        }
      }
      .articleList::-webkit-scrollbar {
        width: 1px;
      }
      .articleList::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(4, 163, 247, 0.8);
      }
      .articleList::-webkit-scrollbar-track {
        border-radius: 5px;
        background: rgba(24, 127, 255, 0.2);
      }
    }
    // 党团活动
    .activity {
      img {
        width: 378px;
        height: 170px;
        margin-left: 14px;
      }
      .activity {
        margin-top: 20px;
        height: 240px;
      }
    }
  }
  .project_bottom {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    // 党史课堂
    .classroom {
      padding-top: 10px;
      position: relative;
      width: 996px;
      height: 340px;
      border: 1px solid #04a3f7;
      box-sizing: border-box;
      box-shadow: 0 0 15px rgba(18, 97, 147, 0.5) inset;
      .warp {
        width: 96%;
        margin: 0 auto;
        overflow: hidden;
        ul {
          width: 100%;
          padding-left: 10px;
          li {
            float: left;
            width: 296px;
            margin-right: 10px;
            img {
              width: 296px;
              height: 180px;
            }
            .classroom_footer {
              position: relative;
              padding: 0 15px;
              height: 60px;
              margin-top: 10px;
              border: 1px solid #3d76a7;
              .tittle {
                display: inline-block;
                color: #fff;
                padding: 5px 25px 0 0;
                width: 296px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .content {
                float: left;
                color: rgba(24, 127, 255, 1);
              }
              .time {
                float: right;
                color: rgba(24, 127, 255, 1);
              }
              img {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 10px;
                height: 10px;
              }
            }
          }
          li:last-child {
            margin-right: 0;
          }
        }
      }
    }
    // 党组成员
    .member {
      padding-top: 10px;
      margin-left: 20px;
      position: relative;
      width: 853px;
      height: 340px;
      border: 1px solid #04a3f7;
      box-sizing: border-box;
      box-shadow: 0 0 15px rgba(18, 97, 147, 0.5) inset;
      .warp {
        width: 96%;
        margin: 0 auto;
        overflow: hidden;
        ul {
          width: 100%;
          padding-left: 0;
          display: flex;
          li {
            float: left;
            width: 107px;
            margin-right: 10px;
            img {
              width: 60px;
              height: 68px;
              margin-bottom: 5px;
            }
            p {
              display: inline-block;
              margin: 0;
              width: 60px;
              line-height: 14px;
              color: #fff;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>