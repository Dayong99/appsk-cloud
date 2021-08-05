<template>
  <div class="project_overview">
    <a-row :gutter="16">
      <a-col :span="6">
        <div class="left_box frame jiaobiao_box">
          <div class="jiaobiao"></div>
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            行为动态记录
          </p>
          <ul>
            <li v-for="item in behavior" :key="item.id">
              <img src="../../../assets/digitalScreen-images/Integral_photo.png" alt="" />
              <p>
                {{ item.personId_dictText }} <span class="explain">（{{ item.teamId_dictText }}）</span> <br />
                <span>{{ item.detail }}</span
                ><br />
                <span class="integral" v-if="item.type == 0">+{{ item.score }}分</span>
                <span class="integral reduce" v-else-if="item.type == 1">-{{ item.score }}分</span>
              </p>
              <span class="time">{{ item.createTime }}</span>
            </li>
          </ul>
        </div>
      </a-col>
      <a-col :span="9">
        <div class="center_box frame jiaobiao_box">
          <div class="jiaobiao"></div>
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            安全之星
          </p>
          <div class="button">
            <a-button
              v-for="(item, index) in personRankBtns"
              :key="index"
              :class="selectPersonRank == index ? 'active' : ''"
              :disabled="selectPersonRank == index ? true : false"
              @click="switchPersonRank(index)"
              >{{ item }}</a-button
            >
            <!-- <a-button>周排行</a-button>
        <a-button>月排行</a-button> -->
          </div>
          <div class="ranking">
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/two_photo.png" alt="" />
              <p>
                {{ personSecond.name }} <br />
                <span>积分：{{ personSecond.score }}分</span>
              </p>
            </div>
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/one_photo.png" alt="" />
              <p>
                {{ personChampion.name }} <br />
                <span>积分：{{ personChampion.score }}分</span>
              </p>
            </div>
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/three_photo.png" alt="" />
              <p>
                {{ personThird.name }} <br />
                <span>积分：{{ personThird.score }}分</span>
              </p>
            </div>
          </div>
          <table>
            <tr>
              <td>排名</td>
              <td>姓名</td>
              <td>班组</td>
              <td>积分</td>
            </tr>
            <tr v-for="(item, index) in personRank" :key="index">
              <td>{{ item.rank }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.reservoirId_dictText }}</td>
              <td v-if="item.score > 0">+{{ item.score }}</td>
              <td v-else>{{ item.score }}</td>
            </tr>
          </table>
        </div>
      </a-col>
      <a-col :span="9">
        <div class="center_box frame jiaobiao_box">
          <div class="jiaobiao"></div>
          <p class="head_title" :style="'background: url(' + options.images.frameTitle + ') 10px bottom no-repeat'">
            班组排行
          </p>
          <div class="button">
            <a-button
              v-for="(item, index) in teamRankBtns"
              :key="index"
              :class="selectTeamRank == index ? 'active' : ''"
              :disabled="selectTeamRank == index ? true : false"
              @click="switchTeamRank(index)"
              >{{ item }}</a-button
            >
          </div>
          <div class="ranking">
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/two_photo.png" alt="" />
              <p>
                {{ teamSecond.name }} <br />
                <span>人均积分: {{ teamSecond.score }}分</span>
              </p>
            </div>
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/one_photo.png" alt="" />
              <p>
                {{ teamChampion.name }} <br />
                <span>人均积分: {{ teamChampion.score }}分</span>
              </p>
            </div>
            <div class="ranking_list">
              <img src="../../../assets/digitalScreen-images/three_photo.png" alt="" />
              <p>
                {{ teamThird.name }} <br />
                <span>人均积分: {{ teamThird.score }}分</span>
              </p>
            </div>
          </div>
          <table>
            <tr>
              <td>排名</td>
              <td>班组</td>
              <td>班组人数</td>
              <td>人均积分</td>
            </tr>
            <tr v-for="(item, index) in teamRank" :key="index">
              <td>{{ item.rank }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.reservoirId_dictText }}</td>
              <td v-if="item.score > 0">+{{ item.score }}</td>
              <td v-else>{{ item.score }}</td>
            </tr>
          </table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import images from '@/utils/Imgaes.js'
export default {
  data() {
    return {
      behavior: {},
      options: {
        images: images,
      },
      personRankBtns: ['周排行', '月排行'],
      selectPersonRank: 0,
      personChampion: {
        name: '张 三',
        score: '',
      },
      personSecond: {
        name: '李 四',
        score: '',
      },
      personThird: {
        name: '',
        score: '',
      },
      personRank: [
        {
          rank: 1,
          name: '张 三',
          score: 20,
        },
      ],
      teamRankBtns: ['周排行', '月排行'],
      selectTeamRank: 0,
      teamChampion: {
        name: 'XX镇',
        score: '',
      },
      teamSecond: {
        name: '',
        score: '',
      },
      teamThird: {
        name: '',
        score: '',
      },
      teamRank: [
        {
          rank: 1,
          name: '',
          teamId_dictText: '',
          score: 20,
        },
      ],
    }
  },
  mounted() {
    this.checkMenu()
    this.getbehavior()
    this.getRankData(0)
    this.getRankData(1)
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
    // 获取行为记录动态数据
    getbehavior() {
      getAction('/stpe/revpay/queryRecord', {
        // relTenantIds: this.$store.state.user.info.relTenantIds,
        relTenantIds: 2,
      }).then((res) => {
        let { code, result } = res
        if (code == 200) {
          this.behavior = result
        }
      })
    },
    // 获取人员排行、班组排行数据
    getRankData(count, time) {
      let param = {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        countType: count,
        timeType: time,
      }
      getAction('/stpe/revpay/rankCount', param).then((res) => {
        let { code, result } = res
        if (code == 200) {
          if (count == 0) {
            //人员
            if (this.personRank.length > 0) {
              this.personRank.splice(0, this.personRank.length)
            }
            if (result.length != 0) {
              result.forEach((value, index) => {
                this.personRank.push({
                  rank: value.rank,
                  name: value.name,
                  reservoirId_dictText: value.reservoirId_dictText,
                  score: value.score,
                })
              })
              if (result[0]) {
                this.personChampion = { name: result[0].name, score: result[0].personTotal }
              } else {
                this.personChampion = { name: '', score: '' }
              }
              if (result[1]) {
                this.personSecond = { name: result[1].name, score: result[1].personTotal }
              } else {
                this.personSecond = { name: '', score: '' }
              }
              if (result[2]) {
                this.personThird = { name: result[2].name, score: result[2].personTotal }
              } else {
                this.personThird = { name: '', score: '' }
              }
            }
          } else if (count == 1) {
            //班组
            if (this.teamRank.length > 0) {
              this.teamRank.splice(0, this.teamRank.length)
            }
            if (result.length != 0) {
              result.forEach((value, index) => {
                this.teamRank.push({
                  rank: value.rank,
                  name: value.name,
                  teamId_dictText: value.teamId_dictText,
                  score: value.score,
                })
              })
              if (result[0]) {
                this.teamChampion = { name: result[0].name, score: result[0].personTotal }
              } else {
                this.teamChampion = { name: '', score: '' }
              }
              if (result[1]) {
                this.teamSecond = { name: result[1].name, score: result[1].personTotal }
              } else {
                this.teamSecond = { name: '', score: '' }
              }
              if (result[2]) {
                this.teamThird = { name: result[2].name, score: result[2].personTotal }
              } else {
                this.teamThird = { name: '', score: '' }
              }
            }
          }
        }
      })
    },
    switchPersonRank(index) {
      this.selectPersonRank = index
      if (index == 0) {
        this.getRankData(0)
      } else {
        this.getRankData(0, 1)
      }
    },
    switchTeamRank(index) {
      this.selectTeamRank = index
      if (index == 0) {
        this.getRankData(1)
      } else {
        this.getRankData(1, 1)
      }
    },
  },
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.frame {
  height: 862px;
  padding-top: 10px;
  border: 1px solid #04a3f7;
  box-sizing: border-box;
  box-shadow: 0 0 15px rgba(18, 97, 147, 0.5) inset;
}
.jiaobiao_box {
  &::before {
    position: absolute;
    left: 7px;
    top: -1px;
    width: 20px;
    height: 20px;
    border-top: 3px solid #04a3f7;
    border-left: 3px solid #04a3f7;
    content: '';
  }
  &::after {
    position: absolute;
    right: 7px;
    top: -1px;
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
      left: 7px;
      bottom: -1px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-left: 3px solid #04a3f7;
      content: '';
    }
    &::after {
      position: absolute;
      right: 7px;
      bottom: -1px;
      width: 20px;
      height: 20px;
      border-bottom: 3px solid #04a3f7;
      border-right: 3px solid #04a3f7;
      content: '';
    }
  }
}
.head_title {
  line-height: 40px;
  padding-left: 25px;
  font-size: 16px;
  color: white;
  background-size: 96% 100% !important;
}
.project_overview {
  width: 100%;
  height: auto;
  margin-top: 10px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  font-weight: 400;
  color: #ffffff;
  .left_box {
    ul {
      padding: 0 20px;
      width: 100%;
      height: 780px;
      overflow-x: hidden;
      li {
        padding-top: 20px;
        position: relative;
        width: 100%;
        height: 120px;
        border-bottom: 1px solid rgba(24, 127, 255, 0.2);
        img {
          float: left;
          width: 70px;
          height: 70px;
        }
        p {
          float: left;
          margin-left: 10px;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: #efefef;
          font-size: 16px;
          span {
            display: inline-block;
            width: 320px;
            font-size: 14px;
            font-weight: 400;
          }
          .explain {
            width: 200px;
          }
          .integral {
            color: rgba(50, 197, 78, 1);
          }
          .integral {
            color: #f2534d;
          }
        }
        .time {
          position: absolute;
          right: 0;
          top: 20px;
          color: #187fff;
        }
      }
    }
    ul::-webkit-scrollbar {
      width: 1px;
    }
    ul::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(4, 163, 247, 0.8);
    }
    ul::-webkit-scrollbar-track {
      border-radius: 5px;
      background: rgba(24, 127, 255, 0.2);
    }
  }
  .center_box {
    .button {
      margin: 20px auto 0;
      width: 160px;
      height: 25px;
      .ant-btn {
        width: 80px;
        height: 25px;
        color: #fff;
        background: transparent;
        border: 1px solid rgba(24, 127, 255, 1);
        box-sizing: border-box;
        &:first-child {
          border-radius: 13px 0px 0px 13px;
        }
        &:nth-child(2) {
          border-radius: 0px 13px 13px 0px;
        }
      }
      .ant-btn.active {
        background: rgba(24, 127, 255, 1);
      }
      .ant-btn[disabled],
      .ant-btn[disabled].active {
        color: #fff;
        border-color: rgba(24, 127, 255, 1);
      }
    }
    .ranking {
      margin-top: 26px;
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 237px;
      .ranking_list {
        padding-top: 21px;
        width: 190px;
        height: 237px;
        background: url(../../../assets/digitalScreen-images/one.png);
        text-align: center;
        img {
          width: 90px;
          height: 113px;
        }
        p {
          margin-top: 15px;
          font-size: 19px;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: #ffffff;
          span {
            font-size: 15px;
            font-weight: 400;
          }
        }
        &:nth-child(1) {
          margin-top: 7px;
          width: 191px;
          height: 223px;
          background: url(../../../assets/digitalScreen-images/two.png);
        }
        &:nth-child(3) {
          position: relative;
          margin-top: 7px;
          width: 191px;
          height: 223px;
          background: none;
          &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            background: url(../../../assets/digitalScreen-images/two.png);
            transform: rotateY(180deg);
          }
        }
      }
    }

    table {
      margin: 30px auto 0;
      padding: 0 20px;
      width: 96%;
      font-size: 14px;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
      color: #dedede;
      text-align: center;
      tr {
        width: 100%;
        height: 40px;
        line-height: 40px;
        &:nth-child(2n + 1) {
          height: 35px;
          background: rgba(24, 127, 255, 0.2);
        }
        &:nth-child(1) {
          line-height: 30px;
          height: 30px;
          background: rgba(24, 127, 255, 1);
        }
      }
    }
  }
}
</style>