<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <hazard-library-form ref="realForm" :hazardTypeId="hazardTypeId" @ok="submitCallback" :disabled="disableSubmit" :itemids="itemids"></hazard-library-form>
  </j-modal>
</template>

<script>

  import HazardLibraryForm from './HazardLibraryForm'
  export default {
    name: 'HazardLibraryModal',
    components: {
      HazardLibraryForm
    },
    props:{
      itemids:String,
      hazardTypeId:String
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    created(){
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>