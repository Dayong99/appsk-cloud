<template>
  <div>
    <yard-left  :tenementId='tenementId'/>
    <yard-middle :tenementId='tenementId'/>
    <yard-right :tenementId='tenementId' />
  </div>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import getUser from '@/store/modules/user'
import images from '@/utils/Imgaes.js'
import YardLeft from '@/views/digitalScreen/girderFabricationYard/moudule/GirderFabricationYardLeft'
import YardMiddle from '@/views/digitalScreen/girderFabricationYard/moudule/GirderFabricationYardMiddle'
import YardRight from '@/views/digitalScreen/girderFabricationYard/moudule/GirderFabricationYardRight'

export default {
  name: 'GirderFabricationYard',
  components: {
    YardLeft,
    YardMiddle,
    YardRight,
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
.frame {
  position: relative;
  background-color: #061630;
  border: 1px solid #255a8b;
  opacity: 0.9;
  float: left;
}
</style>