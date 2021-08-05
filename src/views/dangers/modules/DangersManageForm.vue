<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="危险源类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['dangersTypeId', validatorRules.dangersTypeId]" :trigger-change="true" dictCode="aoz_sys_dangers_type,type_name,id" placeholder="请选择危险源类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="位置类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['gisType', validatorRules.gisType]" :trigger-change="true" dictCode="gis_type" placeholder="请选择位置类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dangersName', validatorRules.dangersName]" placeholder="请输入名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="经纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['gis', validatorRules.gis]" placeholder="请输入经纬度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="危险等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['dangersLevel', validatorRules.dangersLevel]" :trigger-change="true" dictCode="dangers_level" placeholder="请选择危险等级" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="告警阈值(m)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['threshold', validatorRules.threshold]" placeholder="请输入告警阈值(m)" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="位置范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['locationRange']" placeholder="请输入位置范围"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入描述"  ></a-input>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'DangersManageForm',
    components: {
      JFormContainer,
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
          dangersTypeId: {
            rules: [
              { required: true, message: '请选择危险源类型!'},
            ]
          },
          gisType: {
            rules: [
              { required: true, message: '请选择位置类型!'},
            ]
          },
          dangersName: {
            rules: [
              { required: true, message: '请输入名称!'},
            ]
          },
          gis: {
            rules: [
              { required: true, message: '请输入经纬度!'},
            ]
          },
          dangersLevel: {
            rules: [
              { required: true, message: '请选择危险等级!'},
            ]
          },
          threshold: {
            rules: [
              { required: true, message: '请输入告警阈值(m)!'},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          add: "/sys/dangersManage/add",
          edit: "/sys/dangersManage/edit",
          queryById: "/sys/dangersManage/queryById"
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
          this.form.setFieldsValue(pick(this.model,'dangersTypeId','gisType','dangersName','gis','dangersLevel','threshold','locationRange','remarks'))
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
        this.form.setFieldsValue(pick(row,'dangersTypeId','gisType','dangersName','gis','dangersLevel','threshold','locationRange','remarks'))
      },
    }
  }
</script>