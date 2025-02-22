<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="预制场编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedSiteNumber']" placeholder="请输入预制场编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedPedestalNumber']" placeholder="请输入预制台座编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座长（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalLength', validatorRules.prefabricatedPedestalLength]" placeholder="请输入预制台座长（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座宽（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalWidth', validatorRules.prefabricatedPedestalWidth]" placeholder="请输入预制台座宽（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座高（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalHeight', validatorRules.prefabricatedPedestalHeight]" placeholder="请输入预制台座高（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制梁类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedBeamType']" placeholder="请输入预制梁类型"  ></a-input>
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

  export default {
    name: 'PedestalLedgerForm',
    components: {
      JFormContainer,
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
          prefabricatedPedestalLength: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          prefabricatedPedestalWidth: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          prefabricatedPedestalHeight: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          add: "/beamyard/pedestalLedger/add",
          edit: "/beamyard/pedestalLedger/edit",
          queryById: "/beamyard/pedestalLedger/queryById"
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
          this.form.setFieldsValue(pick(this.model,'prefabricatedSiteNumber','prefabricatedPedestalNumber','prefabricatedPedestalLength','prefabricatedPedestalWidth','prefabricatedPedestalHeight','prefabricatedBeamType'))
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
        this.form.setFieldsValue(pick(row,'prefabricatedSiteNumber','prefabricatedPedestalNumber','prefabricatedPedestalLength','prefabricatedPedestalWidth','prefabricatedPedestalHeight','prefabricatedBeamType'))
      },
    }
  }
</script>