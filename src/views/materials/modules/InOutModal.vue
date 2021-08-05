<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">
    <in-out-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :isEdit="isEdit" />
  </j-modal>
</template>

<script>

  import InOutForm from './InOutForm'

  export default {
    name: 'InOutModal',
    components: {
      InOutForm
    },
    data() {
      return {
        title:'',
        isEdit: false,
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods:{
      add (record) {
        this.isEdit = false;
        this.visible=true
        this.$nextTick(()=>{
          if(record){
            this.$refs.realForm.add(record);
          }else{
            this.$refs.realForm.add();
          } 
        })
      },
      edit (record) {
        this.isEdit = true;
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
        this.$refs.realForm.handleOk();
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

<style scoped>
</style>