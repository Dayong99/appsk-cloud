<template>
  <div class="videoManage">
    <div class="manage_left frame">
      <!-- 边角 -->
      <span class="span_icon top_left_icon"></span>
      <span class="span_icon top_right_icon"></span>
      <span class="span_icon bottom_left_icon"></span>
      <span class="span_icon bottom_right_icon"></span>
        <div class="data_search">
          <a-input-search placeholder="请输入关键字" style="width:249px"  @search="onSearch"/>
        </div>
        <div class="data_list">
        <a-tree
          :expanded-keys="expandedKeys"
          :selected-keys="selectedKeys"
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
        <ul class="file_full_screen" v-show="!isPdf">
          <li v-for="(item, index) in newArr" :key="index" v-show="item.type!='pdf'">
            <img
              v-if="item.type=='image'"
              :id="item.key"
              :src="item.img"
              :alt="item.name"
            >
            <video
              v-else-if="item.type=='video'"
              :id="item.key"
              class="video-js vjs-default-skin"
              controls
              style="width: 100%; height: 100%"
              preload="auto"
              :src="item.video"
            >
              <source :src="item.video" type="application/x-mpegURL" />
            </video>
            <!-- <div v-else-if="item.type=='pdf'" id="handout_wrap_inner"></div> -->
            <!-- <div v-else-if="item.type=='pdf'" class="pdf">
              <pdf ref="pdf" :src="item.pdf"></pdf>
            </div> -->
            <iframe v-else-if="item.type!='pdf'" :src="'https://view.officeapps.live.com/op/view.aspx?src='+item.office" width="100%" height="100%" frameborder="1"></iframe>
          </li>
        </ul>
        <ul class="file_full_screen" id="pdfbox" v-show="isPdf">
        </ul>
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
import LogoVue from '../../../components/tools/Logo.vue'
// import pdf from 'vue-pdf'
import '@/plugs/jquery-1.9.1.min.js'
import '@/plugs/jquery.media.js'

export default {
  name: 'VideoManage',
  components: {
    videoPlayer,
    videojs,
    // pdf
  },
  data() {
    return {
      options: {
        images: images,
      },
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      firstSelect: [],
      searchValue: '',
      autoExpandParent: true,
      replaceFields: {
        key: 'id',
        title: 'name',
      },
      url: {
        tree: '/sys/archives/queryBsArchivesTree',
      },
      vedioList: [],
      newArr: [],
      myPlayernOn: '',
      videoId: '',
      flag: false,
      isPdf:false,
      currentIndex:''
    }
  },
  created() {
    this.getTree()
  },
  computed: {
    
  },
  mounted() {
    this.checkMenu();
  },
  watch: {
    
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
    onSearch(){ 
    },
    getTree() {
      getAction(this.url.tree, {
        relTenantIds: this.$store.state.user.info.relTenantIds,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.treeData = res.result
          console.log(this.treeData)
          //设置父节点为不可选
          this.getParentNode(this.treeData)
          // this.serverArray(this.treeData)
          // console.log(this.newArr)
          this.chooseChildNode(this.treeData)
        }
      })
    },
  //递归获取父节点并设为不可选
    getParentNode(tree){
      for(var i in tree){
        if(tree[i].children){
          tree[i].selectable = false
        }
        if(tree[i].children){
          this.getParentNode(tree[i].children)
        }
      }
    }, 
    chooseChildNode(tree){
      for(var i in tree){
        if(tree[i]){
          for(var j in tree[i].children){
            if(tree[i].children[j].filePath){
              if(this.firstSelect.length == 0){
                this.expandedKeys = []
                this.selectedKeys = []
                this.firstSelect = []
                this.expandedKeys.push(tree[i].id)
                this.selectedKeys.push(tree[i].children[j].id)
                this.firstSelect.push(tree[i].children[j]);
              }
              this.serverArray(this.firstSelect)
              setTimeout(() => {
                this.getVideoFullScreen()
              }, 500)
            }
          }
        }
        if(tree[i].children){
          this.chooseChildNode(tree[i].children)
          break;
        }
      }
    },
  onSearch() {},
  onSelect(selectedKeys, info) {
      //整屛时需把下一行代码注释
      // this.newArr = []
      if(selectedKeys.length>0){
        this.selectedKeys = selectedKeys;
      }
      let any = []
      any.push(info.node.dataRef)
      // console.log(info)
      // console.log(any)
      // console.log(this.newArr)
      console.log(any);
      this.serverArray(any)
      console.log(this.newArr)
      // setTimeout(() => {
      //   this.getVideoFullScreen()
      // }, 500)
      // this.getVideoFullScreen()
      // this.shake(this.getVideoFullScreen(),500)
    },
  //递归遍历数据
    serverArray(arr) {
      for (var i in arr) {
        let any = {}

        if(arr[i]){

            this.newArr = []
            if(arr[i].fileType == 'jpg'|| arr[i].fileType == 'png'){
              any.img = arr[i].filePath
              any.key = 'my_img' + arr[i].id
              any.name = arr[i].name
              any.type = 'image'
              this.isPdf = false;
            }else if(arr[i].fileType == 'mp4'|| arr[i].fileType == 'avi'){
              any.video = arr[i].filePath
              any.key = 'my_video' + arr[i].id
              any.type = 'video'
              this.isPdf = false;
            }else if(arr[i].fileType == 'pdf'){
              any.type = 'pdf'
              this.isPdf = true;
              $('#pdfbox').html('<div id="handout_wrap_inner"></div>')
              $('#handout_wrap_inner').media({
                width: '100%',
                height: '100%',
                autoplay: true,
                src:arr[i].filePath
              })
              $('#handout_wrap_inner').css({"width":"100%","height":"100%"})
            }else{
              any.office = arr[i].filePath
              any.type = arr[i].fileType
              this.isPdf = false;
            }
            this.newArr.push(any)
            this.flag = true
          
        }else{
          this.flag = false
        }

        // if (arr[i].addressMapExt && this.newArr.length < 9) {
        //   if(arr[i].addressMapExt.hlsHd){
        //     any.video = arr[i].addressMapExt.hlsHd
        //     any.key = 'my_video' + arr[i].id
        //     this.newArr.push(any)
        //   }
        // }
        // if(arr[i].children){
        //   this.serverArray(arr[i].children)
        // }
      
      }
    },   
    getVideoFullScreen() {
      // console.log(this.newArr)

      if(this.flag){
        let id = this.newArr[0].key;
        let dataSrc = this.newArr[0].filePath;
        
        // this.myPlayernOn = videojs(id,{
        //   autoplay :true,
        //   bigPlayButton: false,
        //   errorDisplay: false,
        //   controlBar: true,
        // })
        
        // this.myPlayernOn.src({
        //   src:dataSrc
        // })
        // console.log(dataSrc)
        // this.myPlayernOn.play()
      } 
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
  },
  destroyed(){
    // console.log("实例销毁完成");
    // this.myPlayernOn.dispose()
  }
}
</script>
<style scoped lang="less">
@font-face {
  font-family: 'iconfont';  /* Project id 2542451 */
  src: url('//at.alicdn.com/t/font_2542451_ql4maa9080k.woff2?t=1620787477097') format('woff2'),
  url('//at.alicdn.com/t/font_2542451_ql4maa9080k.woff?t=1620787477097') format('woff'),
  url('//at.alicdn.com/t/font_2542451_ql4maa9080k.ttf?t=1620787477097') format('truetype');
}

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
    width: 271px;
    height: 0;
    padding-bottom: 46.6%;
    background: rgba(13, 35, 70, 0.33);
    border: 1px solid rgba(18, 97, 147, 1);
    color: white;
    
  }
  .manage_left /deep/ .ant-input {
    height: 40px;
    border: none;
    background: #2b4371;
    outline: none;
    color: white;
  }
  
  .manage_right {
    position: relative;
    width: 1586px;
    margin: 0 10px;
    .mansge_cont {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 20px;
      img {
        width: 100%;
        height: 100%;
      }
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
    .file_full_screen{
      width: 100%;
      height: 100%;
      #handout_wrap_inner{
      width: 100% !important;
      height: 100% !important;
    }
    }
    .file_full_screen li{
      width: 100%;
      height: 100%;
    }
    
  }
}
/* 搜索框 */
.data_search {
  width: 257px;
  height: 40px;
  margin-top: 6px;
  margin-left: 6px;
  margin-bottom: 10px;
  background: #2B4371;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  font-weight: 400;
  color: #8BBBD8;
  line-height: 40px;
}
input::-webkit-input-placeholder {
  color: #8BBBD8;
}
/* 资料索引盒子 */
.data_list {
    background: none;
    color:#FFF;
    border-right: none;
    height: 808px;
    overflow: hidden;
    padding-bottom: 8px;
}
.data_list::-webkit-scrollbar {
    width: 2px;
}
.data_list::-webkit-scrollbar-thumb {
    border-radius: 5px;
    //  background: rgb(31, 143, 255, .5);
    background: rgb(255, 255, 255, .2);
}
.data_list::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(24, 127, 255, .2);
}
.data_list:hover{
  overflow-y: scroll;
}
.ant-tree {
    color: white !important;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

</style>