<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="操作类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['operatorType']" placeholder="请输入操作类型" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设备id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deviceId']" placeholder="请输入设备id"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="维保时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择维保时间" v-decorator="['operatorTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="操作人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['operator']" placeholder="请输入操作人"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="维修员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['repairman']" placeholder="请输入维修员"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['describes']" placeholder="请输入描述"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['filePath']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注信息"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
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

  export default {
    name: 'MaintainRecordForm',
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
      }
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
          add: "/deviceMaintain/maintainRecord/add",
          edit: "/deviceMaintain/maintainRecord/edit",
          queryById: "/deviceMaintain/maintainRecord/queryById"
        }
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
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'operatorType','deviceId','operatorTime','operator','repairman','describes','filePath','remarks'))
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
            let formData = Object.assign(this.model, values);
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
        this.form.setFieldsValue(pick(row,'operatorType','deviceId','operatorTime','operator','repairman','describes','filePath','remarks'))
      },
    }
  }
</script>