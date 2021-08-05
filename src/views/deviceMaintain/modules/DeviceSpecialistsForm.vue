<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="人员类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['personType', validatorRules.personType]" :trigger-change="true" dictCode="person_type" placeholder="请选择人员类别" @change="personSelect"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="特种人员姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['personPhone', validatorRules.personPhone]" :trigger-change="true" dictCode="aoz_person,person_name,phone" placeholder="请选择特种人员" @change="nameSelect"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="特种人员手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-dict-select-tag type="list" v-model="personName" :disabled=true placeholder="特种人员姓名"/> -->
              <a-input v-model="personPhone" placeholder="特种人员手机号" :disabled=true></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-dict-select-tag type="list" v-decorator="['sex']" :trigger-change="true" dictCode="sex" placeholder="请选择性别" /> -->
              <a-input v-model="personSex" placeholder="性别" :disabled=true></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="productTypes == 1">
            <a-form-item label="维修设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
<!--              <a-input v-decorator="['deviceType']" placeholder="请输入维修设备类型"  ></a-input>-->
              <j-dict-select-tag type="list" v-decorator="['deviceType']" :trigger-change="true" dictCode="aoz_device_maintain_type,device_type_name,id" placeholder="请选择维修设备类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="证书编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['certificateNumber', validatorRules.certificateNumber]" placeholder="请输入证书编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="证书有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择证书有效期" v-decorator="['certificateValidity', validatorRules.certificateValidity]" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="证书照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['photo', validatorRules.photo]" ></j-image-upload>
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

  import {getPersonList} from '@/api/api';
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDate from '@/components/jeecg/JDate'
  import JImageUpload from '@/components/jeecg/JImageUpload'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'DeviceSpecialistsForm',
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
        personSex: '',
        personPhone: '',
        personResult: '',
        productTypes: '',
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
          personType: {
            rules: [
              { required: true, message: '请选择人员类别!'},
            ]
          },
          personPhone: {
            rules: [
              { required: true, message: '请选择特种人员!'},
            ]
          },
          certificateNumber: {
            rules: [
              { required: true, message: '请输入证书编号!'},
            ]
          },
          certificateValidity: {
            rules: [
              { required: true, message: '请输入证书有效期!'},
            ]
          },
          photo: {
            rules: [
              { required: true, message: '请上传证书照片!'},
            ]
          },
        },
        url: {
          add: "/deviceMaintain/deviceSpecialists/add",
          edit: "/deviceMaintain/deviceSpecialists/edit",
          queryById: "/deviceMaintain/deviceSpecialists/queryById"
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
      //人员查询
      nameSelect(val) {
        this.personSex = '';

        getPersonList({
          phone: val
        }).then(res => {
          const {code,result} = res;
          if(val && code == 200){
            this.personResult = Object.assign({},  result.records[0]);
            this.personSex = result.records[0].sex_dictText;
            this.personPhone = result.records[0].phone;

          }
        })
      },
      //获取人员类别
      personSelect(val) {
        this.productTypes = val;
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'personType','personPhone','sex','deviceType','certificateNumber','certificateValidity','photo'))
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
            formData.sex = this.personResult.sex;
            formData.personName = this.personResult.personName;
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
        this.form.setFieldsValue(pick(row,'personType','personPhone','sex','deviceType','certificateNumber','certificateValidity','photo'))
      },
    }
  }
</script>