<template>
  <div class="project_overview jiaobiaoImg_box">
    <div class="jiaobiaoImg"></div>
    <div class="map">
      <div class="drawer_btn" :class="sidebarSwitch ? 'sidebar-folded' : ''" @click="foldSidebar">
        <img src="../../../assets/digitalScreen-images/personnelLocation/drawer_icon.png" alt="" />
      </div>
      <div class="drawer jiaobiao_box" :class="sidebarSwitch ? 'sidebar-folded' : ''">
        <div class="jiaobiao"></div>
        <a-input-search placeholder="人员姓名/设备号/手机号/身份证号" />
        <div class="list" v-show="isShow2">
          <div class="tittle">
            <div class="tittle_list" @click="show(1)" :class="index === 1 ? 'active' : ''">人员</div>
            <div class="tittle_list" @click="show(2)" :class="index === 2 ? 'active' : ''">告警</div>
          </div>
          <!-- 人员列表 -->
          <a-menu
            mode="inline"
            :open-keys="openKeys"
            style="width: 298px"
            class="personnel"
            v-show="index === 1 && isShow"
            @openChange="onOpenChange"
          >
            <a-sub-menu key="sub1">
              <span slot="title" class="title"><span>工程部</span></span>
              <a-menu-item @click="click"> 林小力 </a-menu-item>
              <a-menu-item @click="click"> 徐文长 </a-menu-item>
              <a-menu-item @click="click"> 李英杰 </a-menu-item>
              <a-menu-item @click="click"> 陈群 </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title" class="title"><span>技术部</span></span>
              <a-menu-item @click="click"> 林小力 </a-menu-item>
              <a-menu-item @click="click"> 徐文长 </a-menu-item>
              <a-menu-item @click="click"> 李英杰 </a-menu-item>
              <a-menu-item @click="click"> 陈群 </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <span slot="title" class="title"><span>物资部</span></span>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
              <a-menu-item> 林小力 </a-menu-item>
              <a-menu-item> 徐文长 </a-menu-item>
              <a-menu-item> 李英杰 </a-menu-item>
              <a-menu-item> 陈群 </a-menu-item>
            </a-sub-menu>
          </a-menu>
          <!-- 告警列表 -->
          <a-menu
            mode="inline"
            :open-keys="openKeys"
            style="width: 298px"
            class="personnel warn"
            @openChange="onOpenChange"
            v-show="index === 2 && isShow"
          >
            <a-sub-menu key="sub1">
              <span slot="title" class="title"><span>技术部</span></span>
              <a-menu-item @click="click"> 李丽丽 </a-menu-item>
              <a-menu-item @click="click"> 陈群 </a-menu-item>
              <a-menu-item @click="click"> 张萌 </a-menu-item>
              <a-menu-item @click="click"> 路飞 </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title" class="title"><span>物资部</span></span>
              <a-menu-item @click="click"> 李小琴 </a-menu-item>
              <a-menu-item @click="click"> 高玉峰 </a-menu-item>
              <a-menu-item @click="click"> 闫秀丽 </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div>
        <!-- 点击人员弹出告警信息 -->
        <div class="showMessage" v-show="isShow1">
          <p class="head" @click="click2">
            <img src="../../../assets/digitalScreen-images/personnelLocation/return.png" alt="" />返回人员列表
          </p>
          <div class="warn_relieve">
            <span>低电量</span>
            <span class="relieve">解除警告</span>
          </div>
          <p class="name">
            张萌&nbsp;&nbsp;&nbsp;&nbsp;男&nbsp;&nbsp;&nbsp;&nbsp;45岁&nbsp;&nbsp;&nbsp;&nbsp;信号工 <br />
            部门：技术部<br />
            部门领导：易忠轩<br />
            紧急联系人电话：15788888888
          </p>
          <div class="voice">
            <p>内置语音：</p>
            <a-cascader
              :options="options"
              placeholder="请选择发送语音"
              :popup-style="{background:'rgba(13, 35, 70, 0.95)',color:'rgba(115, 207, 255, 1)'}"
              @change="onChange"
              notFoundContent="请添加语音"
              popupClassName="cascader"
            />
            <!-- :popup-style="{background:'#345188',color:'#fff'}" API方式更改样式 -->
            <a-button class="voiceBtn">发送语音</a-button>
          </div>
          <div class="video">
            <p>选择日期:</p>
            <a-date-picker @change="onChange" />
            <div class="play">
              <img src="../../../assets/digitalScreen-images/personnelLocation/speed.png" class="speed_left" alt="" />
              <img src="../../../assets/digitalScreen-images/personnelLocation/play.png" class="play_img" alt="" />
              <img src="../../../assets/digitalScreen-images/personnelLocation/speed.png" class="speed_right" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- 人员信息气泡 -->
      <div class="person_message">
        <div class="cell1">
          <img class="photo" src="../../../assets/digitalScreen-images/personnelLocation/bubble_photo.png" alt="" />
          <p>
            张萌&nbsp;&nbsp;&nbsp;2021/07/21&nbsp;14:55<br />信号工<span>低电量</span
            ><img src="../../../assets/digitalScreen-images/personnelLocation/cell1.png" alt="" />
          </p>
        </div>
        <div class="cell1 cell2">
          <img class="photo" src="../../../assets/digitalScreen-images/personnelLocation/bubble_photo.png" alt="" />
          <p>
            张萌&nbsp;&nbsp;&nbsp;2021/07/21&nbsp;14:55<br />信号工<span>低电量</span
            ><img src="../../../assets/digitalScreen-images/personnelLocation/cell2.png" alt="" />
          </p>
        </div>
        <div class="cell1 cell2">
          <img class="photo" src="../../../assets/digitalScreen-images/personnelLocation/bubble_photo.png" alt="" />
          <p>
            张萌&nbsp;&nbsp;&nbsp;2021/07/21&nbsp;14:55<br />信号工<span>低电量</span
            ><img src="../../../assets/digitalScreen-images/personnelLocation/cell3.png" alt="" />
          </p>
        </div>
      </div>
      <!-- 人员坐标 -->
      <div class="person_coordinates">
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
        <div class="person">
          <img
            src="../../../assets/digitalScreen-images/personnelLocation/person_footer.png"
            class="person_footer"
            alt=""
          />
          <img src="../../../assets/digitalScreen-images/personnelLocation/person_top.png" class="person_top" alt="" />
        </div>
      </div>
      <div class="footer_down" :class="sidebarSwitch1 ? 'sidebar-folded1' : ''" @click="foldSidebar1"><img src="../../../assets/digitalScreen-images/personnelLocation/down.gif" 
        alt=""></div>
      
      <div class="footer" :class="sidebarSwitch1 ? 'sidebar-folded1' : ''">
        <ul class="left">
          <li>在场人员 <span>22</span></li>
          <li>场外人员 <span>13</span></li>
        </ul>
        <ul class="right">
          <li>
            人员情况
            <a-switch default-checked>
              <a-icon slot="checkedChildren" type="check" />
            </a-switch>
          </li>
          <li>
            告警信息
            <a-switch default-checked>
              <a-icon slot="checkedChildren" type="check" />
            </a-switch>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: '1',
          label: '请带好安全帽',
        },
        {
          value: '2',
          label: '请不要吸烟',
        },
        {
          value: '3',
          label: '请不要乱扔垃圾',
        },
        {
          value: '4',
          label: '注意前方车辆',
        },
      ],
      // 控制切换按钮后按钮改变样式
      index: 1,
      // 控制点击按钮后子组件显示，再次点击隐藏
      isShow: true,
      isShow1: false,
      isShow2: true,
      sidebarSwitch: false,
      sidebarSwitch1: false,
      visible: false,
      //   设置树组件不可同时展开菜单
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3'],
      openKeys: ['sub1'],
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    },
  },
  methods: {
    // 点击人员显示详细信息
    click() {
      this.isShow1 = !this.isShow1
      this.isShow2 = !this.isShow2
    },
    // 点击文字返回人员列表
    click2() {
      this.isShow1 = !this.isShow1
      this.isShow2 = !this.isShow2
    },
    //   部门/告警切换
    show(value) {
      this.index === value ? this.isShow : (this.isShow = true)
      this.index = value
    },

    // 日期选择框
    onChange(date, dateString, value) {
      console.log(date, dateString, value)
    },
    // 下拉内置语音
    handleMenuClick(e) {
      console.log('click', e)
    },
    // 隐藏/展开侧边栏
    foldSidebar() {
      if (this.sidebarSwitch) {
        this.sidebarSwitch = false
      } else {
        this.sidebarSwitch = true
      }
    },
    // 隐藏/展开底边栏
    foldSidebar1() {
      if (this.sidebarSwitch1) {
        this.sidebarSwitch1 = false
      } else {
        this.sidebarSwitch1 = true
      }
    },
    // 部门树点击
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
  },
}
</script>

<style lang="less" scoped>
// 大角标图片
.jiaobiaoImg_box {
  position: relative;
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
}
// 小角标
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
li {
  list-style: none;
}
.project_overview {
  padding: 12px;
  width: 100%;
  height: 880px;
  background: rgba(7, 39, 63, 0.33);
  border: 1px solid rgba(18, 97, 147, 1);
  .map {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url(../../../assets/digitalScreen-images/personnelLocation/map.png);
    background-size: 100% 100%;
    border: 1px solid rgba(18, 97, 147, 1);
    box-sizing: border-box;
    // 抽屉按钮
    .drawer_btn {
      position: absolute;
      top: 50%;
      margin-top: -34px;
      width: 32px;
      height: 68px;
      background: url(../../../assets/digitalScreen-images/personnelLocation/drawer.png);
      text-align: center;
      transform: translateX(312px);
      transition: all 0.6s ease-in;
      img {
        width: 20px;
        height: 18px;
        margin-top: 24px;
        transform: scaleX(-1);
        transition: all 0.6s ease-in;
      }
    }
    // 侧边抽屉
    .drawer {
      position: absolute;
      opacity: 1;
      margin: 12px 0 0 12px;
      width: 300px;
      height: 829px;
      background: rgba(13, 35, 70, 0.8);
      border: 1px solid #126193;
      box-shadow: 0px 0px 20px rgba(115, 207, 255, 0.2) inset;
      transition: all 0.6s ease-in;
      // 搜索框
      /deep/.ant-input-search {
        position: relative;
        .ant-input {
          margin: 10px 6px 0 6px;
          padding-left: 30px;
          width: 287px;
          height: 36px;
          background: #345188;
          border: none;
          border-radius: 0;
          outline: none;
          color: rgba(139, 187, 216, 1);
        }
        input::-webkit-input-placeholder {
          color: rgba(139, 187, 216, 1);
        }
        .ant-input-suffix {
          width: 30px;
          left: 8px;
          .ant-input-search-icon {
            margin: 10px 4px 0 8px;
            color: rgba(139, 187, 216, 1);
            background: transparent;
          }
        }
      }

      //放大镜图标
      //   /deep/.ant-input-suffix {
      //     left: 8px;
      //     .ant-input-search-icon {
      //       margin: 10px 4px 0 8px;
      //       color: rgba(139, 187, 216, 1);
      //       background: transparent;
      //     }
      //   }
      .tittle {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 43px;
        border-bottom: 1px solid rgba(34, 89, 123, 1);
        box-sizing: border-box;
        .tittle_list {
          width: 40%;
          height: 43px;
          border-bottom: 1px solid rgba(34, 89, 123, 1);
          font-size: 14px;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: rgba(115, 207, 255, 1);
          line-height: 43px;
          text-align: center;

          &.active {
            color: #ff9c1c;
            border-bottom: 1px solid #ff9c1c;
          }
        }
      }
      //   部门人员树
      /deep/.personnel {
        background: none;
        border: none;
        color: rgba(115, 207, 255, 1);
        .ant-menu-submenu-inline,
        .ant-menu-submenu {
          position: relative;
          text-indent: 3em;
          &::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 12px;
            width: 18px;
            height: 18px;
            background: url(../../../assets/digitalScreen-images/personnelLocation/icon+.png);
            color: rgba(58, 236, 242, 1);
            font-weight: 700;
            text-align: center;
            line-height: 20px;
          }
          &::after {
            content: '';
            position: absolute;
            top: 12px;
            left: 36px;
            width: 24px;
            height: 16px;
            background: url(../../../assets/digitalScreen-images/personnelLocation/bumen.png);
          }
          .ant-menu-item {
            position: relative;
            background: none;
            text-indent: 2em;
            &::before {
              content: '';
              position: absolute;
              top: 12px;
              left: 54px;
              width: 16px;
              height: 15px;
              background: url(../../../assets/digitalScreen-images/personnelLocation/renyuan.png);
            }
            &:hover {
              color: #ff9c1c;
            }
          }
          //   选中样式
          .ant-menu-item-selected {
            color: #ff9c1c;
            &::before {
              content: '';
              background: url(../../../assets/digitalScreen-images/personnelLocation/renyuan2.png);
            }
            &::after {
              border-right: 3px solid #ff9c1c;
            }
          }
          .ant-menu-submenu-arrow {
            display: none;
          }
        }
        // 展开树 图标变化
        .ant-menu-submenu-open {
          &::before {
            content: '';
            background: url(../../../assets/digitalScreen-images/personnelLocation/icon-.png);
          }
        }
        .ant-menu-submenu > .ant-menu {
          background: none;
          color: rgba(115, 207, 255, 1);
        }
        .ant-menu-sub.ant-menu-inline {
          max-height: 500px;
          overflow-x: hidden;
        }
        // 滚动条样式
        .ant-menu-sub.ant-menu-inline::-webkit-scrollbar {
          width: 1px;
        }
        .ant-menu-sub.ant-menu-inline::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: rgba(4, 163, 247, 0.8);
        }
        .ant-menu-sub.ant-menu-inline::-webkit-scrollbar-track {
          border-radius: 5px;
          background: rgba(24, 127, 255, 0.2);
        }
      }
      //   告警人员树
      /deep/.warn {
        .ant-menu-submenu-inline,
        .ant-menu-submenu {
          .ant-menu-item {
            &::before {
              background: url(../../../assets/digitalScreen-images/personnelLocation/renyuan3.png);
            }
          }
          .ant-menu-item-selected {
            &::before {
              background: url(../../../assets/digitalScreen-images/personnelLocation/renyuan2.png);
            }
          }
        }
        .ant-menu-submenu-open {
          &::before {
            content: '';
            background: url(../../../assets/digitalScreen-images/personnelLocation/icon-.png) !important;
          }
        }
        .ant-menu-submenu > .ant-menu {
          color: rgba(242, 83, 77, 1);
        }
      }
      //点击人员弹出告警信息
      .showMessage {
        .head {
          margin: 0 0 0 21px;
          line-height: 43px;
          color: rgba(115, 207, 255, 1);
          img {
            width: 11px;
            height: 16px;
            margin-right: 5px;
          }
        }
        .warn_relieve {
          height: 49px;
          border-top: 1px solid rgba(34, 89, 123, 0.5);
          border-bottom: 1px solid rgba(34, 89, 123, 0.5);
          span {
            margin-left: 21px;
            color: rgba(242, 83, 77, 1);
            line-height: 50px;
          }
          .relieve {
            margin: 9px 0 0 100px;
            display: inline-block;
            width: 112px;
            height: 32px;
            background: url(../../../assets/digitalScreen-images/personnelLocation/relieve.png);
            text-align: center;
            line-height: 32px;
            color: #fff;
          }
        }
        .name {
          margin: 22px 0 21px 21px;
          color: #fff;
        }
        .voice {
          height: 150px;
          border-top: 1px solid rgba(34, 89, 123, 0.5);
          border-bottom: 1px solid rgba(34, 89, 123, 0.5);
          p {
            margin: 22px 0 10px 21px;
            color: #ffffff;
            line-height: 14px;
          }
          //   内置语音
          /deep/.ant-cascader-picker {
            margin-left: 21px;
            width: 258px;
            height: 34px;
            background: none;
            border: 1px solid rgba(66, 195, 253, 0.45);
            color: rgba(139, 187, 216, 1);
            .ant-input {
              border: none;
            }
            .ant-cascader-picker-arrow {
              color: rgba(4, 163, 247, 1);
            }
            .ant-cascader-picker-clear {
              color: rgba(4, 163, 247, 1);
            }
          }

          .voiceBtn {
            margin: 18px 0 0 21px;
            width: 256px;
            height: 30px;
            background: rgba(4, 163, 247, 1);
            border: none;
            border-radius: 4px;
            color: #fff;
            text-align: center;
          }
        }
        .video {
          p {
            margin: 22px 0 10px 21px;
            color: #ffffff;
            line-height: 14px;
          }
          /deep/.ant-input {
            margin: 0 0 0 21px;
            width: 258px;
            height: 34px;
            background: none;
            border: 1px solid rgba(66, 195, 253, 0.45);
          }
          /deep/.ant-calendar-picker-icon {
            color: rgba(4, 163, 247, 1);
          }
          .play {
            margin: 20px auto 0;
            width: 70%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .speed_left {
              width: 21px;
              height: 15px;
            }
            .play_img {
              width: 42px;
              height: 42px;
            }
            .speed_right {
              width: 21px;
              height: 15px;
              transform: scaleX(-1);
            }
          }
        }
      }
    }
    //隐藏/展开侧边栏
    .drawer_btn.sidebar-folded {
      transform: translateX(0px);
      img {
        transform: scaleX(1);
      }
    }
    .drawer.sidebar-folded {
      opacity: 0;
      transform: translateX(-312px);
    }
    //隐藏/展开底边栏
    .footer_down.sidebar-folded1 {
      transform: translateY(0px);
      img {
        transform: scaleY(-1);
      }
    }
    .footer.sidebar-folded1 {
      opacity: 0;
      transform: translateY(120px);
    }
    .footer_down {
        position: absolute;
        left: 49.1%;
        bottom: 0px;
        transform: translateX(-50%);
        width: 30px;
        height: 39px;
        opacity: 0.7;
        z-index: 99;
      transform: translateY(-120px);
        transition: all 0.6s ease-in;
        img {
        width: 30px;
        height: 39px;
        opacity: 0.7;
        transform: scaleY(1);
        transition: all 0.6s ease-in;
        }
      }
    // 页脚盒子
    .footer {
      display: flex;
      justify-content: space-around;
      position: absolute;
      left: 50%;
      bottom: 0;
      margin-left: -581px;
      width: 1162px;
      height: 115px;
      background: url(../../../assets/digitalScreen-images/personnelLocation/footer_bg.png);
      font-size: 16px;
      font-family: ' Microsoft YaHei';
      font-weight: 400;
      color: #ffffff;
      transition: all 0.6s ease-in;
      ul {
        width: 30%;
        display: flex;
        justify-content: space-around;
        li {
          margin-top: 36px;
          height: 42px;
          line-height: 42px;
          span {
            margin-left: 5px;
            font-size: 36px;
            font-family: 'DS-Digital';
            font-weight: normal;
            color: #1cfeff;
          }
          .ant-switch {
            margin-left: 5px;
            background: #81889b;
          }
          .ant-switch-checked {
            background: #1890ff;
          }
        }
      }
      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 25px;
        transform: translateX(-50%);
        width: 3px;
        height: 65px;
        background: url(../../../assets/digitalScreen-images/personnelLocation/xian.png);
      }
      
    }
    
    //人员信息气泡
    .person_message {
      .cell1 {
        position: absolute;
        width: 280px;
        height: 68px;
        background: url(../../../assets/digitalScreen-images/personnelLocation/bubble_top.png);
        .photo {
          float: left;
          width: 62px;
          height: 62px;
          margin: 3px 20px 0 3px;
        }
        p {
          display: inline-block;
          margin-top: 10px;
          color: #fff;
          font-size: 14px;
          line-height: 24px;
          span {
            margin: 10px;
            color: rgba(242, 83, 77, 1);
          }
          img {
            margin-top: 4px;
            float: right;
          }
        }
        &:nth-child(1) {
          left: 551px;
          top: 382px;
        }
        &:nth-child(2) {
          left: 929px;
          top: 454px;
        }
        &:nth-child(3) {
          left: 1099px;
          top: 204px;
        }
      }
      .cell2 {
        background: url(../../../assets/digitalScreen-images/personnelLocation/bubble_top2.png);
      }
    }
    //人员坐标气泡
    .person_coordinates {
      .person {
        position: absolute;
        width: 30px;
        height: 42px;
        text-align: center;
        .person_footer {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }
        .person_top {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }
        &:nth-child(1) {
          left: 566px;
          top: 459px;
        }
        &:nth-child(2) {
          left: 954px;
          top: 528px;
        }
        &:nth-child(3) {
          left: 614px;
          top: 341px;
        }
        &:nth-child(4) {
          left: 974px;
          top: 321px;
        }
        &:nth-child(5) {
          left: 1113px;
          top: 281px;
        }
        &:nth-child(6) {
          left: 767px;
          top: 208px;
        }
      }
    }
  }
}
// 内置语音下拉列表样式
/deep/.ant-cascader-menus {
  min-width: 500px;
  background: violet !important;
}
</style>