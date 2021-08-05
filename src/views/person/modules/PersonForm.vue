<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="人员姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['personName', validatorRules.personName]" placeholder="请输入人员姓名"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['sex']" :trigger-change="true" dictCode="sex" placeholder="请选择性别" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['age', validatorRules.age]" placeholder="请输入年龄" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['idNumber', validatorRules.idNumber]" placeholder="请输入身份证号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['phone', validatorRules.phone]" placeholder="请输入电话号码"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple :number=1 v-decorator="['headPic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <!-- <a-form-item label="班组" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['teamId', validatorRules.teamId]" placeholder="请输入班组"  ></a-input>
            </a-form-item> -->
            <a-form-item label="班组" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select
                ref="treeSelect"
                placeholder="请输入班组"
                v-decorator="['teamId', validatorRules.teamId]"
                dict="aoz_person_team_tree,team_name,id"
                pidField="pid"
                pidValue="0"
                hasChildField="has_child"
                >
              </j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['workId', validatorRules.workId]" :trigger-change="true" dictCode="aoz_person_work_type,work_name,id" placeholder="请选择工种" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['workNo']" placeholder="请输入工号"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['roleId', validatorRules.roleId]" :trigger-change="true" dictCode="sys_role,role_name,id" placeholder="请选择角色" />
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['userStatus']" :trigger-change="true" dictCode="user_status" placeholder="请选择状态" />
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  export default {
    name: 'PersonForm',
    components: {
      JFormContainer,
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
          personName: {
            rules: [
              { required: true, message: '请输入人员姓名!'},
            ]
          },
          age: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          idNumber: {
            rules: [
              { required: true, message: '请输入身份证号!'},
              { validator: (rule, value, callback) => validateDuplicateValue('aoz_person', 'id_number', value, this.model.id, callback)},
            ]
          },
          phone: {
            rules: [
              { required: true, message: '请输入电话号码!'},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
              { validator: (rule, value, callback) => validateDuplicateValue('aoz_person', 'phone', value, this.model.id, callback)},
            ]
          },
          teamId: {
            rules: [
              { required: true, message: '请输入班组!'},
            ]
          },
          workId: {
            rules: [
              { required: true, message: '请输入工种!'},
            ]
          },
          // roleId: {
          //   rules: [
          //     { required: true, message: '请输入角色!'},
          //   ]
          // },
        },
        url: {
          add: "/person/person/add",
          edit: "/person/person/edit",
          queryById: "/person/person/queryById"
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
          this.form.setFieldsValue(pick(this.model,'personName','sex','age','idNumber','phone','headPic','teamId','workId','workNo','onJobStatus','lastLogintime','createBy','createTime','userStatus'))
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
        this.form.setFieldsValue(pick(row,'personName','sex','age','idNumber','phone','headPic','teamId','workId','workNo','onJobStatus','lastLogintime','createBy','createTime','userStatus'))
      },
    }
  }
</script>