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
    <device-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :typeInfo="typeInfo"></device-form>
  </j-modal>
</template>

<script>

  import DeviceForm from './DeviceForm'
  export default {
    name: 'DeviceModal',
    components: {
      DeviceForm
    },
    props: {
      deviceTypeId: String,
      deviceTypeIofo: {
        type: Object,
        default: () => {},
        required: false,
      },
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        typeInfo: {}
      }
    },
    methods: {
      add () {
        this.typeInfo = this.deviceTypeIofo;
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