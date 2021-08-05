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
    <device-type-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :typeId="typeId"></device-type-form>
  </j-modal>
</template>

<script>

  import DeviceTypeForm from './DeviceTypeForm'
  export default {
    name: 'DeviceTypeModal',
    components: {
      DeviceTypeForm
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
        typeId: String
      }
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