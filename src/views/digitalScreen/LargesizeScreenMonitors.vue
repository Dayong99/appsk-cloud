<template>
    <div class="background_picture" :style="'background:url(' + options.images.loginBg + ') no-repeat center 0px'">
        <head-navigation :pitchOn="pitchOn"/>
        <div class="router_st">
            <router-view/>
        </div>
    </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import HeadNavigation from './headNavigation/HeadNavigation'


export default {
  name: 'LargesizeScreenMonitors',
  components: {
    HeadNavigation,
  },
  data() {
    return {
        options:{
            images:images
        },
        pitchOn:{index:0}
    }
  },
  created() {
      
  },
  computed: {},
  mounted(){
      this.pitchOn.index = this.$store.state.enhance.selectOn
    //   console.log(this.$store.state.enhance.selectOn)
  },
  methods: {},
}
</script>
<style scoped>
.background_picture{
    width: 100%;
    height: 1072px;
}
.router_st{
    position: absolute;
    top: 180px;
    width: 1910px;
    padding: 0 30px 0 30px;
    z-index: 99;
}
</style>