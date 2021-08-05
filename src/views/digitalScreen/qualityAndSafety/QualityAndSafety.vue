<template>
  <div>
    <quality-safety-top :tenementId='tenementId'/>
    <quality-safety-bottom :tenementId='tenementId'/>
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import QualitySafetyTop from '@/views/digitalScreen/qualityAndSafety/modules/QualitySafetyTop'
import QualitySafetyBottom from '@/views/digitalScreen/qualityAndSafety/modules/QualitySafetyBottom'

export default {
  name: 'QualityAndSafety',
  components: {
    QualitySafetyTop,
    QualitySafetyBottom,
  },
  data() {
    return {
      options: {
        images: images,
      },
      tenementId: null,
      currentIndex:''
    }
  },
  created() {
    this.tenementId = getUser.state.newValue
  },
  computed: {},
  mounted(){
    this.checkMenu();
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
    }
  }
}
</script>
<style scoped>
</style>