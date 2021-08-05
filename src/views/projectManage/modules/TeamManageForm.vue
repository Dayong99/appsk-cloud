<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="人员类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['personType',validatorRules.personType]" :trigger-change="true" dictCode="project_manage_person_type" placeholder="请选择人员类别" @change="personTypeChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['jobTitle',validatorRules.jobTitle]" :trigger-change="true" dictCode="project_manage_position" placeholder="请选择职位"  v-if="personType == 1"/>
              <a-input placeholder="请输入职位名称" v-decorator="['jobTitle',validatorRules.jobTitle]" v-else/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name',validatorRules.name]" placeholder="请输入姓名"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['phone', validatorRules.phone]" placeholder="请输入电话"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sort',validatorRules.sort]" placeholder="请输入排序" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="是否显示" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isShow',validatorRules.isShow]" :trigger-change="true" dictCode="project_manage_person_is_show" placeholder="请选择是否显示" />
            </a-form-item>
          </a-col>

          <a-col :span="24" v-if="personType == 1">
            <a-form-item label="班次" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-multi-select-tag type="checkbox" v-decorator="['frequency']" :trigger-change="true" dictCode="project_manage_frequency" placeholder="请选择班次" />
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
  import JMultiSelectTag from "@/components/dict/JMultiSelectTag"

  export default {
    name: 'TeamManageForm',
    components: {
      JFormContainer,
      JDictSelectTag,
      JMultiSelectTag,
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
          phone: {
            rules: [
              { required: false},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
            ]
          },
          personType: {
            rules: [
              { required: true, message: '人员类别不能为空'}
            ]
          },
          jobTitle: {
            rules: [
              { required: true, message: '职位不能为空!'},
            ]
          },
          name: {
            rules: [
              { required: true, message: '姓名不能为空!'},
            ]
          },
          sort: {
            rules: [
              { required: true, message: '排序不能为空!'},
            ]
          },
          isShow: {
            rules: [
              { required: true, message: '是否显示不能为空!'},
            ]
          },
        },
        url: {
          add: "/sys/teamManage/add",
          edit: "/sys/teamManage/edit",
          queryById: "/sys/teamManage/queryById"
        },
        personType:''
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
      personTypeChange(val){
        this.personType = val;
        this.model.jobTitle = '';
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'jobTitle','name','phone','sort','isShow','personType','frequency'))
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
        this.form.setFieldsValue(pick(row,'jobTitle','name','phone','sort','isShow','personType','frequency'))
      },
    }
  }
</script>