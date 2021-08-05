<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="视频标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['title', validatorRules.title]" placeholder="请输入视频标题"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="视频封面图" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple :number=1 v-decorator="['videoPic', validatorRules.videoPic]" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['videoFile']" :trigger-change="true"  :number=1></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="视频积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['score', validatorRules.score]" placeholder="请输入视频积分" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="获取积分时长(秒)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['lookTime', validatorRules.lookTime]" placeholder="请输入获取积分时长(秒)" style="width: 100%" />
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
  import JUpload from '@/components/jeecg/JUpload'
  import JImageUpload from '@/components/jeecg/JImageUpload'

  export default {
    name: 'VideoForm',
    components: {
      JFormContainer,
      JUpload,
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
          title: {
            rules: [
              { required: true, message: '请输入视频标题!'},
            ]
          },
          videoPic: {
            rules: [
              { required: true, message: '请输入视频封面图!'},
            ]
          },
          score: {
            rules: [
              { required: true, message: '请输入视频积分!'},
            ]
          },
          lookTime: {
            rules: [
              { required: true, message: '请输入获取积分时长(秒)!'},
            ]
          },
        },
        url: {
          add: "/stpe/video/add",
          edit: "/stpe/video/edit",
          queryById: "/stpe/video/queryById"
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
          this.form.setFieldsValue(pick(this.model,'title','videoPic','videoFile','score','lookTime','createBy','createTime'))
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
        this.form.setFieldsValue(pick(row,'title','videoPic','videoFile','score','lookTime','createBy','createTime'))
      },
    }
  }
</script>