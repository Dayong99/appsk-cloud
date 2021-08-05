<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="商品编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['goodsCode', validatorRules.goodsCode]" placeholder="请输入商品编号" disabled ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="商品标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['goodsTitle', validatorRules.goodsTitle]" placeholder="请输入商品标题"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="商品副标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['goodsSubtitle', validatorRules.goodsSubtitle]" placeholder="请输入商品副标题"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="商品大图" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple :number=1 v-decorator="['goodsPic', validatorRules.goodsPic]" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['stock', validatorRules.stock]" placeholder="请输入库存数量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="需要积分数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['score', validatorRules.score]" placeholder="请输入需要积分数" style="width: 100%" />
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

  import { httpAction, getAction, putAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JImageUpload from '@/components/jeecg/JImageUpload'

  export default {
    name: 'GoodsForm',
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
          goodsCode: {
            initialValue:"${aoz_goods_code}",
            rules: [
              { required: true, message: '请输入商品编号!'},
            ]
          },
          goodsTitle: {
            rules: [
              { required: true, message: '请输入商品标题!'},
            ]
          },
          goodsSubtitle: {
            rules: [
              { required: true, message: '请输入商品副标题!'},
            ]
          },
          goodsPic: {
            rules: [
              { required: true, message: '请输入商品大图!'},
            ]
          },
          stock: {
            rules: [
              { required: true, message: '请输入库存数量!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          score: {
            rules: [
              { required: true, message: '请输入需要积分数!'},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          add: "/stpe/goods/add",
          edit: "/stpe/goods/edit",
          queryById: "/stpe/goods/queryById",
          rule: {
            goodsCode: '/sys/fillRule/executeRuleByCode/aoz_goods_code'
          },
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
      this.getGoodsCode();
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
          this.form.setFieldsValue(pick(this.model,'goodsCode','goodsTitle','goodsSubtitle','goodsPic','stock','conversion','score'))
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
        this.form.setFieldsValue(pick(row,'goodsCode','goodsTitle','goodsSubtitle','goodsPic','stock','conversion','score'))
      },
      getGoodsCode() {
        putAction(this.url.rule.goodsCode, this.model).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            this.validatorRules.goodsCode.initialValue = res.result;
          }
        })
      }
    }
  }
</script>