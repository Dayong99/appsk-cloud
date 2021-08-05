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
    <maintain-device-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :typeId="typeId"></maintain-device-form>
  </j-modal>
</template>

<script>

  import MaintainDeviceForm from './MaintainDeviceForm'
  export default {
    name: 'MaintainDeviceModal',
    components: {
      MaintainDeviceForm
    },
    props: {
      deviceTypeId: String
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        typeId: ''
      }
    },
    created() {
      
    },
    methods: {
      add () {
        this.typeId = this.deviceTypeId;
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