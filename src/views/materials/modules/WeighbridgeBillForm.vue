<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="车牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['plateNo']" placeholder="请输入车牌号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="车牌照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['platePic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场称重(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['inWeight']" placeholder="请输入进场称重" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['inType']" placeholder="请输入进场类型"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="直进直出类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['inOutType']" :trigger-change="true" dictCode="materials_in_out_type" placeholder="请选择直进直出类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="过磅类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['weighType']" :trigger-change="true" dictCode="material_weigh_type" placeholder="请选择过磅类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物资名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialsSpare']" placeholder="请输入物资名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="发料单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialCompany']" placeholder="请输入发料单位"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="运单数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['waybillNum']" placeholder="请输入运单数量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="扣量百分比" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['deductionPercent']" placeholder="请输入扣量百分比" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="扣量实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['deductionValue']" placeholder="请输入扣量实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择进场时间" v-decorator="['inTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="毛重(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['grossWeight']" placeholder="请输入毛重" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="皮重(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['freightWeight']" placeholder="请输入皮重" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="净重(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['suttleWeight']" placeholder="请输入净重" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="实际重量(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['realWeight']" placeholder="请输入实际重量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="运单重量(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['waybillWeight']" placeholder="请输入运单重量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="实际数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['realNum']" placeholder="请输入实际数量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="实际偏差" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['realOffset']" placeholder="请输入实际偏差" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="正负差" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['posiNegaDiff']" placeholder="请输入正负差"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="偏差结果" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['offsetResult_dictText']" placeholder="请输入偏差结果"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登记时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择登记时间" v-decorator="['registTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登记人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['registrar']" placeholder="请输入登记人"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="出场时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择出场时间" v-decorator="['outTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场抓拍" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['inUpPic']" ></j-image-upload>
              <j-image-upload isMultiple  v-decorator="['inDownPic']" ></j-image-upload>
              <j-image-upload isMultiple  v-decorator="['inLeftPic']" ></j-image-upload>
               <j-image-upload isMultiple  v-decorator="['inRightPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="进场抓拍-下" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['inDownPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场抓拍-左" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['inLeftPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进场抓拍-右" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['inRightPic']" ></j-image-upload>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="出场抓拍" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['outUpPic']" ></j-image-upload>
              <j-image-upload isMultiple  v-decorator="['outDownPic']" ></j-image-upload>
              <j-image-upload isMultiple  v-decorator="['outLeftPic']" ></j-image-upload>
              <j-image-upload isMultiple  v-decorator="['outRightPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="出场抓拍-下" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['outDownPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="出场抓拍-左" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['outLeftPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="出场抓拍-右" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['outRightPic']" ></j-image-upload>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="拍照留底" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['photograph']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注"  ></a-input>
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
    name: 'WeighbridgeBillForm',
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
          add: "/materials/weighbridgeBill/add",
          edit: "/materials/weighbridgeBill/edit",
          queryById: "/materials/weighbridgeBill/queryById"
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
          this.form.setFieldsValue(pick(this.model,'plateNo','platePic','inWeight','inType','inOutType','weighType','materialsSpare','materialCompany','waybillNum','deductionPercent','deductionValue','inTime','grossWeight','freightWeight','suttleWeight','realWeight','waybillWeight','realNum','realOffset','posiNegaDiff','offsetResult_dictText','registTime','registrar','outTime','inUpPic','inDownPic','inLeftPic','inRightPic','outUpPic','outDownPic','outLeftPic','outRightPic','photograph','remarks'))
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
        this.form.setFieldsValue(pick(row,'plateNo','platePic','inWeight','inType','inOutType','weighType','materialsInfo','materialCompany','waybillNum','deductionPercent','deductionValue','inTime','grossWeight','freightWeight','suttleWeight','realWeight','waybillWeight','realNum','realOffset','posiNegaDiff','offsetResult','registTime','registrar','outTime','inUpPic','inDownPic','inLeftPic','inRightPic','outUpPic','outDownPic','outLeftPic','outRightPic','photograph','remarks'))
      },
    }
  }
</script>
<style>
 #inUpPic,#inDownPic,#inLeftPic,#inRightPic,#outUpPic,#outDownPic,#outLeftPic,#outRightPic{
   float: left;
 }
 .ant-modal-body{
    padding:9px!important;
  }
</style>