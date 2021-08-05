<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-item label="系统Logo" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['sysLogo']" ></j-image-upload>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="每日答题数量限制" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['limitAnswer', validatorRules.limitAnswer]" placeholder="请输入每日答题数量限制" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="每日文章数量上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['limitArticle', validatorRules.limitArticle]" placeholder="请输入每日文章数量上限" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="每日视频数量上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['limitVideo', validatorRules.limitVideo]" placeholder="请输入每日视频数量上限" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上报问题得分" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['uploadScore', validatorRules.uploadScore]" placeholder="请输入上报问题得分" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="二维码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['qrCode']" ></j-image-upload>
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
  import JImageUpload from '@/components/jeecg/JImageUpload'

  export default {
    name: 'SysSettingForm',
    components: {
      JFormContainer,
      JImageUpload,
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
          limitAnswer: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          limitArticle: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          limitVideo: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          uploadScore: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          add: "/stpe/sysSetting/add",
          edit: "/stpe/sysSetting/edit",
          queryById: "/stpe/sysSetting/queryById"
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
          this.form.setFieldsValue(pick(this.model,'sysLogo','limitAnswer','limitArticle','limitVideo','uploadScore','qrCode'))
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
            let formDatas =Object.assign(formData,{relTenantIds:this.$store.state.user.newValue})
            httpAction(httpurl,formDatas,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                window.location.reload()
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
        this.form.setFieldsValue(pick(row,'sysLogo','limitAnswer','limitArticle','limitVideo','uploadScore','qrCode'))
      },
    }
  }
</script>