<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="仓库类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['warehouseTypeId']" :trigger-change="true" dictCode="aoz_materials_warehouse_type,warehouse_type,id"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仓库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['warehouseId']" :trigger-change="true" dictCode="aoz_materials_warehouse,warehouse_name,id"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物资类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['classifyTypeCode']" :trigger-change="true" dictCode="aoz_materials_classify_type,classify_type_name,classify_type_code"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物资名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialsName']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物资编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialsNumber']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['specifications']" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['modelNumber']" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['inventoryTotal']" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['materialUnit']" :trigger-change="true" dictCode="material_unit" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="换算系数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['conversionFactor']" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="盘点数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['checkNumber']" style="width: 100%" />
            </a-form-item>
          </a-col> -->
                    <a-col :span="24">
            <a-form-item label="累计入库" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['inTotal']"  style="width: 100%" />
            </a-form-item>
          </a-col>
                    <a-col :span="24">
            <a-form-item label="累计出库" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['outTotal']" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" ></a-input>
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
    name: 'InventoryForm',
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
        },
        url: {
          add: "/materials/inventory/add",
          edit: "/materials/inventory/edit",
          queryById: "/materials/inventory/queryById"
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
          this.form.setFieldsValue(pick(this.model,'warehouseTypeId','warehouseId','classifyTypeCode','materialsName','materialsNumber','specifications','modelNumber','inventoryTotal','materialUnit','conversionFactor','checkNumber','inTotal','outTotal','remarks'))
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
        this.form.setFieldsValue(pick(row,'warehouseTypeId','warehouseId','classifyTypeCode','materialsName','materialsNumber','specifications','modelNumber','inventoryTotal','materialUnit','conversionFactor','checkNumber','inTotal','outTotal','remarks'))
      },
    }
  }
</script>