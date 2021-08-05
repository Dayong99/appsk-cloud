<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['imagePath']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="图片名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['imageName']" placeholder="请输入图片名称"  ></a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-item label="图片类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['imageType']" placeholder="请输入图片类型"  ></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-item label="图片大小" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['imageSize']" placeholder="请输入图片大小"  ></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-item label="图片用途" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['useType']" :trigger-change="true" dictCode="image_use_type" placeholder="请选择图片用途" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="图片位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['imagePosition']" placeholder="请输入图片位置"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="长度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['imageLength']" placeholder="请输入长度" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['imageWidth']" placeholder="请输入宽度" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="比例" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['proportion']" placeholder="请输入比例"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="SVG文件解析字符串" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['imageSvgparse']" placeholder="请输入SVG文件解析字符串"  ></a-input>
            </a-form-item>
          </a-col> -->
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
  import JImageUpload from '@/components/jeecg/JImageUpload'

  export default {
    name: 'BannerForm',
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
        },
        url: {
          add: "/sys/banner/add",
          edit: "/sys/banner/edit",
          queryById: "/sys/banner/queryById"
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
          this.form.setFieldsValue(pick(this.model,'imagePath','imageName','imageType','imageSize','useType','imagePosition','imageLength','imageWidth','proportion','imageSvgparse','remarks'))
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
        this.form.setFieldsValue(pick(row,'imagePath','imageName','imageType','imageSize','useType','imagePosition','imageLength','imageWidth','proportion','imageSvgparse','remarks'))
      },
    }
  }
</script>