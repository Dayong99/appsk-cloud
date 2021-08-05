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
        <a-menu
          :default-selected-keys="['1']"
          :default-open-keys="['2']"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
        >
          <template v-for="item in dataManageList">
            <a-menu-item v-if="!item.children" :key="item.key"  >
              <a-icon type="file" />
              <span>{{ item.name }}</span>
            </a-menu-item>
            <sub-menu v-else :key="item.key" :menu-info="item"  @tranUSem="subinterface"/>
          </template>
        </a-menu>
        </div>
    </div>
    <div class="manage_right frame">
      <div class="mansge_cont">
        <span class="line_bg_topLeft"></span>
        <span class="line_bg_topRight"></span>
        <span class="line_bg_bottomLeft"></span>
        <span class="line_bg_bottomRigth"></span>
        <img :src="imageLIsts" alt="" >
      </div>
    </div>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import { Menu } from 'ant-design-vue'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

import videojs from 'video.js/dist/video.js'
import 'videojs-contrib-hls'
// import SubMenu from 'SubMenu'
// <a-icon type="folder" />
const SubMenu = {
  template: `
      <a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners" >
        <span slot="title">
          <a-icon type="folder" /><span>{{ menuInfo.name }}</span>
        </span>
        <template v-for="item in menuInfo.children" @click="dataShow(item)">
          <a-menu-item v-if="!item.children" :key="item.key"  >
            <a-icon type="file" />
            <span>{{ item.name }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-sub-menu>
    `,
  name: 'SubMenu',
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods:{
          dataShow(item){
            console.log(item)
            // debugger;
          this.$emit('tranUSem',item);
      },
  },
  subinterface(item){
      console.log('父',item)
      this.imageLIsts = item.children.filePath
    },
};

export default {
  name: 'VideoManage',
  components: {
    videoPlayer,
    videojs,
    'sub-menu': SubMenu,
  },
  data() {
    return {
      imageLIsts:'',
      options: {
        images: images,
      },
      
      collapsed: false,
      list: [
        {
          key: '1',
          title: 'Option 1',
        },
        {
          key: '2',
          title: 'Navigation 2',
          children: [
            {
              key: '2.1',
              title: 'Navigation 3',
              children: [{ key: '2.1.1', title: 'Option 2.1.1' }],
            },
          ],
        },
      ],
      dataManageList:''
    }
  },
  created() {
  },
  computed: {
    
  },
  mounted() {
    this.dataManage();
  },
  watch: {
    
  },
  methods: {
    subinterface(item){
      console.log('父',item)
      this.imageLIsts = item.filePath
    },
      onSearch(){
          
      },
      dataManage(){
        getAction('/sys/archives/queryBsArchivesTree',{
          // relTenantIds:this.$store.state.user.info.relTenantIds
        }).then((res)=>{
          if(res.code == 200){
            console.log(res);
            this.dataManageList = res.result;
          }
        })
      },
    
      toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
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
.data_list .ant-menu {
    background: none;
    color:rgba(115, 207, 255, 1);
    border-right: none;
    .ant-menu-submenu-inline {
    border-bottom: 1px solid rgba(18, 97, 147, .3);
    }
    .ant-menu-submenu {
    color:rgba(115, 207, 255, 1);
        
    }
}
/deep/.ant-menu-submenu > .ant-menu {
    background: none;
    color:rgba(115, 207, 255, 1);
}
/deep/.ant-menu-item-active {
    background-color: rgba(4, 163, 247, .5);
    color:#fff;
}
/deep/.ant-menu-item-selected {
    background: rgba(4, 163, 247, 1) !important;
    color:#fff;
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