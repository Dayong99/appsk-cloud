<template>
  <div class="videoManage">
    <div class="manage_left frame">
      <!-- 边角 -->
      <span class="span_icon top_left_icon"></span>
      <span class="span_icon top_right_icon"></span>
      <span class="span_icon bottom_left_icon"></span>
      <span class="span_icon bottom_right_icon"></span>

      <!-- <div class="search">
        <a-input-search placeholder="请输入关键字" style="width: 350px" @search="onSearch" />
      </div> -->

      <!-- <a-tree :tree-data="treeData" default-expand-all :replace-fields="replaceFields" class="a_tree">

      </a-tree> -->
      <div class="tree_cont">
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="treeData"
          :replace-fields="replaceFields"
          @expand="onExpand"
          @select="onSelect"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="manage_right frame">
      <div class="mansge_cont">
        <span class="line_bg_topLeft"></span>
        <span class="line_bg_topRight"></span>
        <span class="line_bg_bottomLeft"></span>
        <span class="line_bg_bottomRigth"></span>
        <!-- <ul v-if="newArr.length != 0 && newArr.length > 1" class="video"> -->
        <ul :class="newArr.length === 1 ? 'video_full_screen' : 'video'">
          <li v-for="(item, index) in newArr" :key="index">
            <div :id="item.key" style="width: 100%; height: 100%">
              <video
                :id="item.key"
                class="video-js vjs-default-skin"
                controls
                style="width: 100%; height: 100%"
                preload="auto"
              >
                <source :src="item.video" type="application/x-mpegURL" />
              </video>
            </div>
          </li>
        </ul>
        <!-- <ul :class="newArr.length === 1 ? 'video_full_screen' : 'video'">
          <li v-for="(item, index) in newArr" :key="index">
            <div style="width:100%;height:100%">
              <video
                :id="item.key"
                class="video-js vjs-default-skin"
                controls
                style="width: 100%; height: 100%"
                preload="auto"
              >
                <source :src="item.video" type="application/x-mpegURL" />
              </video>
            </div>
          </li>
        </ul> -->
        <!-- <ul v-if="newArr.length === 1" class="video_full_screen">
          <li>
            <video
              id="video10"
              class="video-js vjs-default-skin"
              controls
              style="width: 100%; height: 100%"
              preload="auto"
            >
              <source :src="newArr[0].video" type="application/x-mpegURL" />
            </video>
          </li>
        </ul> -->
        <!-- <ul v-if="newArr.length != 0 && newArr.length > 1" class="video">
          <li v-for="(item, index) in newArr" :key="index">
            <video-player
              class="video-player vjs-custom-skin"
              :playsinline="true"
              :options="{
                events: [],
                //playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                autoplay: true, // 如果true,浏览器准备好时开始回放。
                controls: true, //  控制条
                preload: 'auto', // 视频预加载
                //muted: false, //  默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                language: 'zh-CN',
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                },
                fluid: true,
                sources: [
                  {
                    type: 'application/x-mpegURL',
                    src: item.video,
                  },
                ],
                hls: true,
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
              }"
            >
            </video-player>
          </li>
        </ul>
        <ul v-if="newArr.length === 1" class="video_full_screen">
          <li>
            <video-player
              class="video-player vjs-custom-skin"
              :playsinline="true"
              :options="{
                events: [],
               // playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                autoplay: true, // 如果true,浏览器准备好时开始回放。
                controls: true, //  控制条
                preload: 'auto', // 视频预加载
                //muted: false, //  默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                language: 'zh-CN',
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                },
                fluid: true,
                poster:newArr[0].video,
                sources: [
                  {
                    type: 'application/x-mpegURL',
                    src: newArr[0].video,
                  },
                ],
                hls: true,
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
              }"
            >
            </video-player>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

import videojs from 'video.js/dist/video.js'
import 'videojs-contrib-hls'

export default {
  name: 'VideoManage',
  components: {
    videoPlayer,
    videojs,
  },
  data() {
    return {
      options: {
        images: images,
      },
      treeData: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      replaceFields: {
        key: 'id',
        title: 'name',
      },
      url: {
        tree: '/deviceManage/cameraTree/queryBSCameraTree',
      },
      vedioList: [],
      newArr: [],
    }
  },
  created() {
    this.getTree()
  },
  computed: {},
  mounted() {},
  watch: {
    // treeData(value) {
    //   setTimeout(() => {
    //     this.getVideo()
    //   }, 500)
    // },
  },

  methods: {
    getTree() {
      getAction(this.url.tree, {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          this.treeData = res.result
          // this.serverArray(this.treeData)
          console.log(this.newArr)
        }
      })
    },
    onSearch() {},
    onSelect(selectedKeys, info) {
      this.newArr = []
      let any = []
      any.push(info.node.dataRef)
      this.serverArray(any)
      console.log(this.newArr)
      setTimeout(() => {
        this.getVideoFullScreen()
      }, 500)
    },
    //递归遍历数据
    serverArray(arr) {
      for (var i in arr) {
        let any = {}
        if (arr[i].addressMapExt && this.newArr.length < 9) {
          any.video = arr[i].addressMapExt.hlsHd
          any.key = 'my-video' + i
          this.newArr.push(any)
        }
        if (arr[i].children) {
          this.serverArray(arr[i].children)
        }
      }
    },
    getVideoFullScreen() {
      // if (this.newArr.length > 1) {
      let myPlayer

      // for (let y = 0; y < this.newArr.length; y++) {}
      this.vedioList = []

      for (let i = 0; i < this.newArr.length; i++) {
        myPlayer = document.getElementById('my-video' + i).childNodes
        console.log(myPlayer)
        if (typeof myPlayer != 'undefined' && myPlayer.length != null) {
          // var myPlayer = videojs('my-video' + i)
          console.log('我是y', i)
          myPlayer.dispose()
        }
        myPlayer.innerHTML =
          "<video class='video-js vjs-default-skin' controls style='width: 100%; height: 100%' preload='auto'><source :src='" +
          this.newArr[i].video +
          "' type='application/x-mpegURL' /></video>"

        let id = this.newArr[i].key
        console.log(id)
        this.vedioList.push(
          videojs(id, {
            bigPlayButton: false,
            textTrackDisplay: false,
            posterImage: true,
            errorDisplay: false,
            controlBar: true,
          })
        )
        // console.log(this.newArr[i].video)
        // myPlayer[i].src(this.newArr[i].video)

        // myPlayer[i].play()
      }

      // }
      // else {
      //   this.vedioList = videojs('video0', {
      //     autoplay: false,
      //     bigPlayButton: false,
      //     errorDisplay: false,
      //     controlBar: true,
      //   })
      //   // myPlayernOn.src([
      //   //   {
      //   //     type: 'application/x-mpegURL',
      //   //     src: this.newArr[0].video,
      //   //   },
      //   // ])
      //   // var myPlayern = document.getElementById('video_10')
      //   // myPlayern.src = this.newArr[0].video
      //   // myPlayernOn.play()
      // }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
  },
}
</script>
<style scoped lang="less">
li {
  list-style: none;
}
* {
  margin: 0;
  padding: 0;
}
body {
  line-height: 0;
}
.videoManage {
  display: flex;
  justify-content: space-between;
  .manage_left {
    position: relative;
    width: 20%;
    height: 0;
    padding-bottom: 46.6%;
    background: rgba(13, 35, 70, 0.33);
    border: 1px solid rgba(18, 97, 147, 1);
    color: white;
    .search {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .tree_cont {
      padding: 20px;
    }
  }
  .ant-tree {
    color: white !important;
    margin-top: 10px;
  }
  .manage_left /deep/ .ant-input {
    height: 40px;
    border: none;
    background: #2b4371;
    outline: none;
    color: white;
  }
  .manage_left /deep/ .ant-input-search-icon {
    color: wheat;
    font-size: 20px;
  }
  .manage_left /deep/ .ant-tree li {
    padding: 0;
  }
  .manage_left /deep/ .ant-tree li span {
    height: 40px;
    line-height: 40px;
  }
  .manage_left /deep/ .ant-tree li .ant-tree-node-content-wrapper {
    color: white;
    width: 87%;
  }
  .manage_left /deep/ .ant-tree li .ant-tree-node-content-wrapper:hover {
    background: #1f448a;
  }
  .manage_left /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background: #1f448a;
  }
  .manage_right {
    position: relative;
    width: 80%;
    margin: 0 10px;
    .mansge_cont {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 20px;

      span {
        position: absolute;
        height: 46px;
        width: 192px;
      }
      .line_bg_topLeft {
        top: -8px;
        left: -8px;
        background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat 0 0;
      }

      .line_bg_topRight {
        top: -8px;
        right: -8px;
        background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat -842px 0;
      }
      .line_bg_bottomLeft {
        bottom: -8px;
        left: -8px;
        background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat 0 -550px;
      }
      .line_bg_bottomRigth {
        bottom: -8px;
        right: -8px;
        background: url('../../../assets/digitalScreen-images/middleBg.png') no-repeat -842px -550px;
      }
    }
  }
}

.video {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}
.video li {
  width: 33.3%;
  height: 33.3%;
  float: left;
  border: 1px solid #1b3863;
}

.video_full_screen {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}

.video_full_screen li {
  width: 100%;
  height: 100%;
}

.frame {
  background-color: #061630 !important;
  border: 1px solid #255a8b !important;
  opacity: 0.9 !important;
  box-shadow: inset 0 0 20px rgb(41 197 254 / 22%) !important;
  -webkit-box-shadow: inset 0 0 20px rgb(41 197 254 / 22%) !important;
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
.video-js .vjs-big-play-button {
  width: 72px;
  height: 72px;
  border-radius: 100%;
  z-index: 100;
  background-color: #ffffff;
  border: solid 1px #979797;
}
</style>