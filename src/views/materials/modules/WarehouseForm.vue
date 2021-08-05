<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="仓库类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['warehouseTypeId', validatorRules.warehouseTypeId]" :trigger-change="true" dictCode="aoz_materials_warehouse_type,warehouse_type,id" placeholder="请选择仓库类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仓库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['warehouseName', validatorRules.warehouseName]" placeholder="请输入仓库名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仓库管理员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['warehouseAdmin', validatorRules.warehouseAdmin]" placeholder="请输入仓库管理员"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="管理员电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['phoneNumber', validatorRules.phoneNumber]" placeholder="请输入管理员电话"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仓库地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['warehouseAddress']" placeholder="请输入仓库地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="摄像头地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cameraAddress', validatorRules.cameraAddress]" placeholder="请输入摄像头地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仓库备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入仓库备注"  ></a-input>
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
    name: 'WarehouseForm',
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
          warehouseTypeId: {
            rules: [
              { required: true, message: '请选择仓库类型!'},
            ]
          },
          warehouseName: {
            rules: [
              { required: true, message: '请输入仓库名称!'},
            ]
          },
          warehouseAdmin: {
            rules: [
              { required: true, message: '请输入仓库管理员!'},
            ]
          },
          phoneNumber: {
            rules: [
              { required: true, message: '请输入管理员电话!'},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
            ]
          },
          cameraAddress: {
            rules: [
              { required: false},
              { pattern: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/, message: '请输入正确的网址!'},
            ]
          },
        },
        url: {
          add: "/materials/warehouse/add",
          edit: "/materials/warehouse/edit",
          queryById: "/materials/warehouse/queryById"
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
          this.form.setFieldsValue(pick(this.model,'warehouseTypeId','warehouseName','warehouseAdmin','phoneNumber','warehouseAddress','cameraAddress','remarks'))
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
        this.form.setFieldsValue(pick(row,'warehouseTypeId','warehouseName','warehouseAdmin','phoneNumber','warehouseAddress','cameraAddress','remarks'))
      },
    }
  }
</script>