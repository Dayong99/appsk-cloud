<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择时间" v-decorator="['datetime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="操作人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['operators']" :trigger-change="true" dictCode="aoz_person,person_name,phone" placeholder="请选择操作人" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="今日实际产值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualProductionValue']" placeholder="请输入今日实际产值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="任务状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['taskStatus']" :trigger-change="true" dictCode="task_status" placeholder="请选择任务状态" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['detail']" placeholder="请输入详情"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['file']" :trigger-change="true"  ></j-upload>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>  
      </a-form>
    </j-form-container>
    <a-pagination :current="current" :defaultCurrent="defaultCurrent" :total="total" :pageSize="1" :hideOnSinglePage="true" @change="onChange" :id="id" style="text-align:center"/>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDate from '@/components/jeecg/JDate'
  import JImageUpload from '@/components/jeecg/JImageUpload'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import  getUser from '@/store/modules/user'

  export default {
    name: 'ScheduleManageLogsForm',
    components: {
      JFormContainer,
      JDate,
      JImageUpload,
      JDictSelectTag,
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：true流程表单 false普通表单
      formBpm: {
        type: Boolean,
        default: false,
        required: false
      },
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      logId:Number,
      id:'',
      total:Number,
      defaultCurrent:Number
    },
    data () {
      return {
        form: this.$form.createForm(this),
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/sys/scheduleManageLogs/add",
          edit: "/sys/scheduleManageLogs/edit",
          queryById: "/sys/scheduleManageLogs/queryById"
        },
        current:1
      }
    },
    computed: {
      formDisabled(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return false
          }
          return true
        }
        return this.disabled
      },
      showFlowSubmitButton(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return true
          }
        }
        return false
      }
    },
    created () {
      //如果是流程中表单，则需要加载流程表单data
      this.showFlowData();
    },
    mounted(){
      
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'datetime','operators','actualProductionValue','taskStatus','detail','file'))
        })
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          });
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            console.log(that.logId)
            let fdata = Object.assign(this.model, {planId:that.logId});
            let formData = Object.assign(fdata, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'datetime','operators','actualProductionValue','taskStatus','detail','file'))
      },
      onChange(current){
        this.current = current
        let params = {
          sysOrgCode : getUser.state.info.orgCode,
          relTenantIds : getUser.state.info.relTenantIds,
          planId : this.id,
          pageNo: this.current,
          pageSize: 1
        };
        getAction("/sys/scheduleManageLogs/list",params).then((res) => {
          this.$emit('change',res)
        })
      }
    }
  }
</script>