<template xmlns="http://www.w3.org/1999/html">
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
          :selected-keys="selectedKeys"
          auto-expand-parent
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
        <div v-if="newArr.length == 1">
          <img src="../../../assets/cloudControl.png"
               style="position: absolute;z-index: 2;left: 1377px;top: 90px"
               :style="{ 'display': cloudControlShow ? 'inline' : 'none' }"
               @click="openPlatform">
          <img src="../../../assets/cloudBack.png" alt="云台控制返回按键"
               style="position: absolute;z-index: 2;left: 1201.5px;top: 133.5px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="closePlatform">
          <img src="../../../assets/cloudbg.png" alt="云台控制背景图"
               style="position: absolute;z-index: 2;left: 1217.5px;top: 21px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
          >
          <img src="../../../assets/leftTop.png" alt="左上"
               style="position: absolute;z-index: 2;left: 1245.25px;top: 46.4px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,4)">
          <img src="../../../assets/left.png" alt="左"
               style="position: absolute;z-index: 2;left: 1245.25px;top: 108.8px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,2)">
          <img src="../../../assets/leftTop.png" alt="左下"
               style="position: absolute;transform:rotate(270deg);z-index: 2;left: 1245.25px;top: 171.2px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,5)">
          <img src="../../../assets/left.png" alt="下"
               style="position: absolute;transform:rotate(270deg);z-index: 2;left: 1309.5px;top: 171.2px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,1)">
          <img src="../../../assets/left.png" alt="上"
               style="position: absolute;transform:rotate(90deg);z-index: 2;left: 1309.5px;top: 46.4px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,0)">
          <img src="../../../assets/leftTop.png" alt="右上"
               style="position: absolute;transform:rotate(90deg);z-index: 2;left: 1373.75px;top: 46.4px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,6)">
          <img src="../../../assets/left.png" alt="右"
               style="position: absolute;transform:rotate(180deg);z-index: 2;left: 1373.75px;top: 108.8px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,3)">
          <img src="../../../assets/leftTop.png" alt="右下"
               style="position: absolute;transform:rotate(180deg);z-index: 2;left: 1373.75px;top: 171.2px"
               :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
               @click="controlPlatform(newArr,7)">
          <button
            style="position: absolute;z-index: 2;left: 1245.25px;top: 233.6px;color: #3aecf2;
               background-color: #2a5073;width: 70px;height: 30px;border: 1px solid #3aecf2;border-radius: 4px"
            :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
            @click="controlPlatform(newArr,10)">- 焦距
          </button>
          <button
            style="position: absolute;z-index: 2;left: 1342.58px;top: 233.6px;color: #3aecf2;
               background-color: #2a5073;width: 70px;height: 30px;border: 1px solid #3aecf2;border-radius: 4px"
            :style="{ 'display': cloudControlShow2 ? 'inline' : 'none' }"
            @click="controlPlatform(newArr,11)">+ 焦距
          </button>
        </div>
        <div v-if="newArr.length == 1 || newArr.length == 0" id="myVideoDiv" class="video_full_screen"
             style="z-index: 1">
        </div>
        <ul v-else-if="newArr.length > 1 && newArr.length <= 4" class="video4">
          <li v-for="(item, index) in newArr" :key="index">
            <video
              :id="item.key"
              class="video-js vjs-default-skin"
              controls
              autoplay="false"
              style="width: 100%; height: 100%"
              preload="auto"
              :src="item.video"
              muted
            >
              <source :src="item.video" type="application/x-mpegURL"/>
            </video>
          </li>
        </ul>
        <ul v-else-if="newArr.length > 4 && newArr.length <= 9" class="video9">
          <li v-for="(item, index) in newArr" :key="index">
            <video
              :id="item.key"
              class="video-js vjs-default-skin"
              controls
              style="width: 100%; height: 100%"
              preload="auto"
              :src="item.video"
              muted
            >
              <source :src="item.video" type="application/x-mpegURL"/>
            </video>
          </li>
        </ul>
        <ul v-else-if="newArr.length > 9 && newArr.length <= 16" class="video16">
          <!-- <ul :class="newArr.length === 1 ?'video_full_screen':'video'"> -->
          <!--        <ul class="video_full_screen">-->
          <li v-for="(item, index) in newArr" :key="index">
            <video
              :id="item.key"
              class="video-js vjs-default-skin vjs-fluid"
              controls
              style="width: 100%; height: 100%;"
              preload="auto"
              :src="item.video"
              muted
            >
              <source :src="item.video" type="application/x-mpegURL"/>
            </video>
          </li>
        </ul>


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
import {getAction, deleteAction, postAction} from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'

import {videoPlayer} from 'vue-video-player'
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
      videoNum: 0,
      treeData: [],//视频树数据
      expandedKeys: [],//父节点id
      selectedKeys: [],//子节点id
      firstSelect: [],//子节点
      searchValue: '',
      // autoExpandParent: true,//是否自动展开父节点，默认为true
      replaceFields: {
        key: 'id',
        title: 'name',
      },
      url: {
        tree: '/deviceManage/cameraTree/queryBSCameraTree',
      },
      vedioList: [],
      newArr: [],
      myPlayer: [],//实例>1
      myPlayernOn: '', //实例=1
      videoId: '',
      flag: false,
      currentIndex: 1,
      cloudControlShow: true,//云台控制
      cloudControlShow2: false,//云台控制
    }
  },
  created() {
    this.getTree()
  },
  mounted() {
    this.checkMenu();
  },
  destroyed() {
    if (this.myPlayernOn) {
      this.destroyedOne()
    }
    if (this.myPlayer) {
      this.destroyedMore()
      console.log('destroyed后有实例this.myPlayernOn吗', this.myPlayernOn)
      console.log('destroyed后有实例this.myPlayer吗', this.myPlayer)
    }
  },
  computed: {},

  watch: {},

  methods: {
    // 获取所有路由，该方法与本页无关
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
// 云台控制
    openPlatform() {
      this.cloudControlShow = false
      this.cloudControlShow2 = true
    },
    closePlatform() {
      this.cloudControlShow2 = false
      this.cloudControlShow = true
    },
    controlPlatform(newArr, val) {
      console.log('newArr', newArr)
      let params = {
        channelNo: newArr[0].channelNo,
        deviceSerial: newArr[0].deviceSerial,
        direction: val,
        speed: 1
      }
      console.log('params', params)
      postAction('/deviceManage/videoSurveillance/ptzStart', params).then(res => {
        console.log('结果', res)
      });

    },
    // 获取a-tree所有节点数据
    getTree() {
      getAction(this.url.tree, {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          this.treeData = res.result
          console.log('获取a-tree所有节点数据', this.treeData)
          this.serverArray(this.treeData)
          setTimeout(() => {
            this.getVideoFullScreen()
          }, 800)
          //设置父节点为不可选
          // this.getParentNode(this.treeData)
          // this.serverArray(this.treeData)
          // console.log(this.newArr)
          // 递归获取第一个父节点的最终子节点
          // this.chooseChildNode(this.treeData)
        }
      })
    },

    //递归获取父节点并设为不可选
    // getParentNode(tree) {
    //   for (let i in tree) {
    //     if (tree[i].children) {
    //       tree[i].selectable = false
    //     }
    //     if (tree[i].children) {
    //       this.getParentNode(tree[i].children)
    //     }
    //   }
    // },

    // 递归获取第一个父节点的最终子节点
    // chooseChildNode(tree) {
    //   for (let i in tree) {
    //     if (tree[i]) {
    //       for (let j in tree[i].children) {
    //         // 如果子节点存在addressMapExt，说明子节点有视频链接，则获取该节点和该节点的id
    //         if (tree[i].children[j].addressMapExt) {
    //           if (this.firstSelect.length == 0) {
    //             this.expandedKeys = [] //每一次都置空新父节点id
    //             this.selectedKeys = [] //每一次都置空新子节点id
    //             this.firstSelect = [] //每一次都置空新子节点，最后一次就是想要获得的最终子节点
    //             this.expandedKeys.push(tree[i].id)
    //             this.selectedKeys.push(tree[i].children[j].id)
    //             this.firstSelect.push(tree[i].children[j]);
    //           }
    //           this.serverArray(this.firstSelect)
    //           setTimeout(() => {
    //             this.getVideoFullScreen()
    //           }, 500)
    //           // break;
    //         }
    //       }
    //     }
    //     // 循环完第一个父节点后，再循环子节点的子节点，直到递归尽
    //     if (tree[i].children) {
    //       this.chooseChildNode(tree[i].children)
    //       break;
    //     }
    //   }
    // },
    // shake(fn, wait) {
    //     let timer = null;
    //     return function () {
    //         if (timer) {
    //             clearTimeout(timer)
    //             timer = null
    //         }
    //         timer = setTimeout(() => {
    //             fn.apply(this, arguments)
    //         }, wait);
    //     }
    // },
    onSearch() {
    },

    // 点击树节点触发
    onSelect(selectedKeys, info) {
      console.log('newArrLength', this.newArr)
      // if(this.myPlayer){
      //   this.destroyedMore()
      // }
      // if(this.myPlayernOn){
      //   this.destroyedOne()
      // }
      //整屛时需把下一行代码注释
      this.newArr = []
      if (selectedKeys.length > 0) {
        this.selectedKeys = selectedKeys;
        // console.log('this.selectedKeys', this.selectedKeys)
        // console.log('info', info)
        // console.log('info.node.dataRef', info.node.dataRef)
      }
      let any = []
      any.push(info.node.dataRef)
      console.log('clickAny', any)
      this.serverArray(any)
      setTimeout(() => {
        this.getVideoFullScreen()
      }, 500)
      // this.getVideoFullScreen()
      // this.shake(this.getVideoFullScreen(),500)
    },

    //递归遍历数据
    serverArray(arr) {

      for (let i in arr) {
        let any = {}
        // 丁
        // if (arr[i].addressMapExt) {
        //   if (arr[i].addressMapExt.hlsHd) {
        //     this.newArr = []
        //     any.video = arr[i].addressMapExt.hlsHd
        //     any.key = 'my_video' + arr[i].id
        //     this.newArr.push(any)
        //     this.flag = true
        //   } else {
        //     this.flag = false
        //   }
        // } else {
        //   this.flag = false
        // }

        // 原来的
        // 有arr[i].addressMapExt表示这是终点，此时没有children，直接对其封装
        if (arr[i].addressMapExt) {
          if (arr[i].addressMapExt.hlsHd) {
            any.video = arr[i].addressMapExt.hlsHd
            any.key = 'my_video' + arr[i].id
            any.channelNo = arr[i].addressMapExt.channelNo
            any.deviceSerial = arr[i].addressMapExt.deviceSerial
            this.newArr.push(any)
          }
        }
          // 没有arr[i].addressMapExt表示这是节点或者没有视频，此时如果有children，递归之
        // if (arr[i].children)
        else {
          this.serverArray(arr[i].children)
        }
      }

    },

    getVideoFullScreen() {
      // if(this.myPlayer){
      //   this.destroyedMore()
      // }
      // console.log(this.flag)
      // 丁
      // if (this.flag) {
      //   let id = this.newArr[0].key;
      //   let videoSrc = this.newArr[0].video;
      //
      //   this.myPlayernOn = videojs(id, {
      //     autoplay: true,
      //     bigPlayButton: false,
      //     errorDisplay: false,
      //     controlBar: true,
      //   })
      //
      //   this.myPlayernOn.src({
      //     src: videoSrc
      //   })
      //   // console.log(videoSrc)
      //   this.myPlayernOn.play()
      // }
      console.log('this.newArr', this.newArr)
      if (this.newArr.length > 1) {
        for (let i = 0; i < this.newArr.length; i++) {
          // this.videoNum++
          let id = this.newArr[i].key
          //   + this.videoNum
          // let myVideoDiv = document.getElementById("myVideoDiv")
          // myVideoDiv.innerHTML = '<video '+'id="old"' + "class='video-js vjs-default-skin' " +
          //   "style='width: 100%;height: 100%'></video>"
          // // 使得用html指令写的video的id成为动态id，这一步极其关键（一路搞来举步维艰啊），
          // // 否则会报The element or ID supplied is not valid. (videojs)
          // document.getElementById("old").id= this.newArr[0].key + this.videoNum
          this.myPlayer.push(
            videojs(id, {
              autoPlay: false,
              bigPlayButton: false,
              errorDisplay: false,
              controlBar: true
            })
          )
          this.myPlayer[i].src({
            src: this.newArr[i].video
          })
          this.myPlayer[i].play()
          // this.myPlayer[i].pause()
        }
      } else if (this.newArr.length == 1) {
        /**从有到有及从无到有（this.newArr.length == 1）不要销毁，只管新增*/
        // if(this.myPlayernOn){
        console.log('this.newArr.length == 1时', this.myPlayernOn)
        // 这里不要销毁
        // this.destroyedOne()
        console.log('nima')
        this.videoNum++
        let id = this.newArr[0].key + this.videoNum
        let myVideoDiv = document.getElementById("myVideoDiv")
        myVideoDiv.innerHTML = '<video ' + 'id="old"' + "class='video-js vjs-default-skin' " +
          "style='width: 100%;height: 100%'></video>"
        /**使得用html指令写的video的id成为动态id，这一步极其关键（一路搞来举步维艰啊），
         否则会报The element or ID supplied is not valid. (videojs)*/
        document.getElementById("old").id = this.newArr[0].key + this.videoNum
        let videoSrc = this.newArr[0].video;
        this.myPlayernOn = videojs(id, {
            autoplay: false,
            bigPlayButton: false,
            errorDisplay: false,
            controlBar: true,
          },
        );
        this.myPlayernOn.src({
          src: videoSrc
        })
        this.myPlayernOn.play()
        // }
        // else {
        //   // 即使是有this.newArr，如果没有
        //   console.log('没有this.myPlayernOn时')
        //   // 在vue方法里创建div元素方法
        //   // let rebuildDiv = document.createElement('DIV')
        //   // rebuildDiv.setAttribute("id","myVideoDiv");
        //   // document.body.appendChild(rebuildDiv)
        //   let myVideoDiv = document.getElementById("myVideoDiv")
        //   myVideoDiv.innerHTML = "<video id='video1' class='video-js vjs-default-skin' " +
        //     "style='width: 100%;height: 100%'></video>"
        //   let videoSrc = this.newArr[0].video;
        //   this.myPlayernOn = videojs('video1', {
        //       autoplay: true,
        //       bigPlayButton: false,
        //       errorDisplay: false,
        //       controlBar: true,
        //     },
        //     // 一种在视频里加元素的方式
        //     // function () {
        //     //   let newbtn = document.createElement('btn');
        //     //   newbtn.innerHTML = '<button class="vjs-control" style="width: 30px" id="downloadButton" onclick="cloudCol()">云台控制</button>';
        //     //   let controlBar = document.getElementsByClassName('vjs-control-bar')[0];
        //     //   let insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];
        //     //   controlBar.insertBefore(newbtn, insertBeforeNode);
        //     // },
        //   );
        //   this.myPlayernOn.src({
        //     src: videoSrc
        //   })
        //   this.myPlayernOn.play()
        // }
      }
        /**从有到无则要销毁，否则见鬼，
         * 并且这样从无到有就只有一种情况：
         * 新进来的就新增，从无到有已被销毁、新增*/
        // 因为你有可能是从有视频的地方过来的，而此时是有实例this.myPlayernOn的，是需要销毁的
      // 否则当你进入没有视频的节点时，此时还是会显示上面的视频，这不见鬼了吗
      else if (this.newArr.length == 0) {
        if (this.myPlayernOn) {
          this.destroyedOne()
        }
        console.log('this.newArr.length == 0时', this.myPlayernOn)
      }
    },
    wsnd(newArr) {
      console.log('wsnd!', newArr)
    },

    // 展开/收起节点时触发，获取所有展开的父节点
    onExpand(expandedKeys, e) {
      // console.log('onExpand(e)', e)
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false //关闭父节点
    },
    destroyedOne() {
      this.myPlayernOn.dispose()
      console.log("单个实例销毁完成");
    },
    destroyedMore() {
      for (let i = 0; i < this.myPlayer.length; i++) {
        this.myPlayer[i].dispose()
      }
      console.log("多个实例销毁完成");
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
      height: 864px;
      overflow: hidden;
    }

    .tree_cont::-webkit-scrollbar {
      width: 2px;
    }

    .tree_cont::-webkit-scrollbar-thumb {
      border-radius: 5px;
      //  background: rgb(31, 143, 255, .5);
      background: rgb(255, 255, 255, .2);
    }

    .tree_cont::-webkit-scrollbar-track {
      border-radius: 5px;
      background: rgba(24, 127, 255, .2);
    }

    .tree_cont:hover {
      overflow-y: scroll;
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

.video_full_screen {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}

.video_full_screen li {
  width: 100%;
  height: 100%;
}

.video4 {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}

.video4 li {
  overflow: hidden;
  width: 50%;
  height: 50%;
  float: left;
  border: 1px solid #1b3863;
}

.video9 {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}

.video9 li {
  overflow: hidden;
  width: 33.3%;
  height: 33.3%;
  float: left;
  border: 1px solid #1b3863;
}

.video16 {
  overflow: hidden;
  border: 2px solid #1b3863;
  height: calc(100%);
}

.video16 li {
  overflow: hidden;
  width: 25%;
  height: 25%;
  float: left;
  border: 1px solid #1b3863;
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

/deep/ .vjs-tech {
  object-fit: fill !important;
}

.video-js .my-image {
  width: 40px;
  background: url(https://placekitten.com/38/28) center center no-repeat;
}


</style>