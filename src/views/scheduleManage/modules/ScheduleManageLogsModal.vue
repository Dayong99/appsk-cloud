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
    <schedule-manage-logs-form :logId="logId" ref="realForm" @ok="submitCallback" @change="handleChange" :disabled="disableSubmit" :id="id" :total="total" :defaultCurrent="defaultCurrent"></schedule-manage-logs-form>
  </j-modal>
</template>

<script>

  import ScheduleManageLogsForm from './ScheduleManageLogsForm'
  export default {
    name: 'ScheduleManageLogsModal',
    components: {
      ScheduleManageLogsForm
    },
    props:{
      logId:Number,
      id:'',
      total:Number,
      defaultCurrent:Number
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
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
      },
      handleChange(res){
        this.$emit('change',res)
      }
    }
  }
</script>