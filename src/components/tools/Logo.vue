<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <img src="~@/assets/logi.png" alt="logo">
      <!-- <img :src="logons" alt="logo"> -->
      <!-- <img v-else src="~@/assets/logo.svg" alt="logo"> --> 
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <!-- <img alt="logo" src=""> -->
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'
  import {logosign} from '@/api/login'
  export default {
    name: 'Logo',
    mixins: [mixin],
    data(){
      return{
        logons:''
      }
    },
    created(){
      this.init();
    },
    methods:{
      init(){
        logosign().then(res=>{
          //console.log(333)
          //console.log(res)
          if(res.success&&res.result.records.length>0){
            this.logons=res.result.records[0].sysLogo
          }else{
            this.logons='/img/logo.b59796ea.svg'
          }
        })
      }
    },
    props: {
      title: {
        type: String,
        default: '智慧工地云平台',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>