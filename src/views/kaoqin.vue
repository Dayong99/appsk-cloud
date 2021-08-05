<template>
  <div class="max_box">
    <div class="head">
      <div class="logo">
        <img src="../assets/digitalScreen-images/clLogo.png" alt="">
        <p>
          中交第四公路工程局有限公司成乐高速扩容建设项目TJ2标项目经理部 <br>
        </p>
      </div>
      <div class="tittle">
        智慧云平台
      </div>
      <div class="gsLogo">
        <img src="../assets/digitalScreen-images/companyLogo.png" alt="">
         <br> 埃欧哲科技
      </div>
      <router-link to="/dashboard/analysis"><div class="htgl">
        <img src="../assets/digitalScreen-images/blackLogo.png" alt="">
        <br> 后台管理系统
      </div></router-link>
    </div>
    <div class="count">
      <div class="count_left">
        <a-input ref="userNameInput" v-model="keyword" placeholder="请输入关键字">
          <a-icon slot="prefix" type="search" />
        </a-input>
        <ul>
          <li>
            <img src="../assets/digitalScreen-images/headPhoto1.png" alt="" class="headPhoto">
            <p class="name">张三</p>
          </li>
          <li>
            <img src="../assets/digitalScreen-images/headPhoto1.png" alt="" class="headPhoto">
            <p class="name">张三</p>
          </li>
          <li>
            <img src="../assets/digitalScreen-images/headPhoto1.png" alt="" class="headPhoto">
            <p class="name">张三</p>
          </li>
          <li>
            <img src="../assets/digitalScreen-images/headPhoto1.png" alt="" class="headPhoto">
            <p class="name">张三</p>
          </li>
        </ul>
      </div>
      <div class="count_right">
        <div class="jiaobiao"></div>
        <div class="nav">
          <div class="map farm">
            <span>选择地图：</span>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                隧道左 <a-icon type="caret-down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a>隧道左</a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a>隧道中</a>
                </a-menu-item>
                <a-menu-item key="2">
                  <a>隧道右</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="man farm">
            <span>人员：</span>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                王胜 <a-icon type="caret-down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a>张三</a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a>张三</a>
                </a-menu-item>
                <a-menu-item key="2">
                  <a>张三</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="time farm">
            <span> 起止时间：</span>
             <a-range-picker @change="onChange" />
          </div>
          <div class="times farm">
            <span>倍率：</span>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                1X <a-icon type="caret-down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a>1X</a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a>2X</a>
                </a-menu-item>
                <a-menu-item key="2">
                  <a>3X</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="btn farm">
            <a-button>轨迹回放</a-button>
            <a-button>重置</a-button>
          </div>
        </div>
        <div class="message">
          <div class="tag_box">
            <a-icon type="carry-out" />
            人员考勤表
          </div>
          <div class="tag_box">
            <a-icon type="carry-out" />
            人员考勤表
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   data() {
    return {
      keyword: '',
    };
  },
  methods: {
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.keyword = '';
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
  },
}
</script>

<style scoped lang="less">
  .max_box {
    width: 100%;
    height: 1080px;
    background: url(../assets/digitalScreen-images/loginBg.png) no-repeat;
    color: #C8E3F8;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    .head {
      position: relative;
      width: 100%;
      height: 60px;
      background: url(../assets/digitalScreen-images/topBoth.png) no-repeat;
      background-size: 100% 60px;
      text-align: center;
      .logo {
        float: left;
        width: 30%;
        img {
          float: left;
          width: 50px;
          height: 50px;
          margin: 6px 10px 0 20px;
        }
        p {
          font-size: 18px;
          line-height: 60px;
          white-space:nowrap
        }
      }
      .tittle {
        width: 736px;
        height: 76px;
        margin: 0 auto;
        background: url(../assets/digitalScreen-images/topContent.png) no-repeat;
        font-size: 30px;
        font-family: "FZZhengHeiS-DB-GB";
        line-height: 76px;
      }
      .gsLogo, .htgl {
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
        width: 100px;
        height: 36px;
        font-size: 11px;
        color: #fff;
      }
      .gsLogo {
        height: 35px;
        right: 100px;
        border-right: 1px solid #153C64;
      }
    }
    .count {
      margin-top: 40px;
      padding: 0 20px;
      width: 100%;
      height: 960px;
      .count_left {
        float: left;
        position: relative;
        padding: 10px;
        width: 300px;
        height: 100%;
        background: url(../assets/digitalScreen-images/count_left.png) no-repeat;
        background-size: 100% 100%;
        /deep/.ant-input {
          background: #345188;
          border-radius: 0;
          border: none;
          color: #8BBBD8;
        }
        ul {
          margin-top: 25px;
          li {
            height: 45px;
            list-style: none;
            .headPhoto {
              float: left;
              width: 32px;
              height: 32px;
              margin-right: 11px;
            }
            .name {
              line-height: 34px;
            }
          }
        }
      }
      .count_right {
        float: right;
        position: relative;
        width: 1550px;
        height: 100%;
        background: rgba(7, 39, 63, 0.33);
        border: 2px solid #126193;
        .jiaobiao {
          position: absolute;
          width: 100%;
          bottom: 0;
        }
        .jiaobiao::before {
            content: "";
            width: 192px;
            height: 45px;
            position: absolute;
            left: -83px;
            bottom: 65px;
            background: url(../assets/digitalScreen-images/jiaobiao.png) no-repeat;
            transform:rotate(270deg);
          }
          .jiaobiao::after {
            content: "";
            width: 192px;
            height: 45px;
            position: absolute;
            right: -9px;
            bottom: -7px;
            background: url(../assets/digitalScreen-images/jiaobiao.png) no-repeat;
            transform:rotate(180deg);
          }
          .nav {
            width: 100%;
            height: 100px;
            padding-left: 30px;
            border-bottom: 1px solid #153C64;
            .farm {
              float: left;
              margin-top: 30px;
              padding: 0 20px;
              height: 30px;
              line-height: 30px;
              .ant-dropdown-link {
                display: inline-block;
                padding-left: 15px;
                width: 180px;
                background: #0C2041;
                border: 1px solid #1A3767;
                border-radius: 3px;
                color: #fff;
                .anticon {
                  float: right;
                  margin: 8px 15px 0 0;
                }
              }
            }
            .map {
              border-right:1px solid #1A3767;
            }
            .time {
              /deep/.ant-input {
                width: 250px;
                background: #0C2041;
                border: 1px solid #1A3767;
                border-radius: 3px;
              }
            }
            .btn {
              padding-left: 0;
                /deep/.ant-btn {
                  margin-right: 10px;
                  width: 85px;
                  height: 30px;
                  background: #04A3F7;
                  border-radius: 3px;
                  border: none;
                  color:#fff;
                  font-size: 14px;
                }
              }
          }
      }
      .count_right::before {
        content: "";
        width: 192px;
        height: 45px;
        position: absolute;
        left: -10px;
        top: -10px;
        background: url(../assets/digitalScreen-images/jiaobiao.png) no-repeat;
      }
      .count_right::after {
        content: "";
        width: 192px;
        height: 45px;
        position: absolute;
        right: -85px;
        top: 65px;
        background: url(../assets/digitalScreen-images/jiaobiao.png) no-repeat;
        transform:rotate(90deg);
      }
    }
  }
</style>