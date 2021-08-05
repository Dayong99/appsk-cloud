<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="租户" v-if="$store.state.user.info.username!='admin'"
          :labelCol="labelCol" 
          :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" @changehtm="changehtm" v-decorator="['relTenantIds', validatorRules.relTenantIds]" :disabled="roleDisabledab" :trigger-change="true" dictCode="sys_tenant,name,id" placeholder="请选择租户" />
        </a-form-item>
         <a-form-item label="租户" v-if="$store.state.user.info.username=='admin'"
          :labelCol="labelCol" 
          :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" @changehtm="changehtm" v-decorator="['relTenantIds', validatorRules.relTenantIds]" :trigger-change="true" dictCode="sys_tenant,name,id" placeholder="请选择租户" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称">
          <a-input placeholder="请输入角色名称" v-decorator.trim="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>



         
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色选择">
          <a-select v-model="queryStatus" placeholder="请选择" @change="changeStatus(queryStatus)">
            <a-select-option value="1">普通用户</a-select-option>
            <a-select-option value="2">APP用户</a-select-option>
            <a-select-option value="3">大屏角色</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码" v-if="queryStatus==1">
          <a-input placeholder="请输入角色编码" :disabled="roleDisabled" v-decorator.trim="[ 'roleCode', validatorRules.roleCode]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码" v-if="queryStatus==2">
          <a-input placeholder="请输入角色编码" :disabled="true" v-decorator.trim="[ 'roleCode', validatorRules.roleCode]" />
        </a-form-item> -->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码">
          <a-input placeholder="请输入角色编码" :disabled="queryStatus != 1" v-decorator.trim="[ 'roleCode', validatorRules.roleCode]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea :rows="5" placeholder="..." v-decorator="[ 'description', validatorRules.description ]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addRole,editRole,duplicateCheck } from '@/api/api'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  export default {
    name: "RoleModal",
    data () {
      return {
        title:"操作",
        visible: false,
        roleDisabled: false,
        roleDisabledab:false,
        model: {},
        queryStatus:"1",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        valspent:'',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          relTenantIds:{
            rules: [
              { required: true, message: '请选择租户!'},
            ]},
          roleName:{
            rules: [
              { required: true, message: '请输入角色名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]},
          roleCode:{
            rules: [
              { required: true, message: '请输入角色名称!'},
              { min: 0, max: 64, message: '长度不超过 64 个字符', trigger: 'blur' },
              { validator: this.validateRoleCode}
            ]},
          description:{
            rules: [
              { min: 0, max: 126, message: '长度不超过 126 个字符', trigger: 'blur' }
            ]}
        }
      }
    },
    components: {
      JDictSelectTag
    },
    created () {

    },
    methods: {
      changehtm(val){
        this.valspent=val
        if(this.queryStatus==2 || this.queryStatus==3){
          this.form.setFieldsValue({
              roleCode:this.queryStatus==2? 'APP_CODE_'+this.valspent : 'BS_CODE_'+ this.valspent, //前面的值为表单中的值
         })
        }
      },
      add () {
        this.edit({});
      },
      changeStatus(val){
        this.queryStatus=val;
        switch (val) {
          case '2':
            this.form.setFieldsValue({
              roleCode:'APP_CODE_'+this.valspent, //前面的值为表单中的值
            })
            break;
          case '3':
            this.form.setFieldsValue({
              roleCode:'BS_CODE_'+ this.valspent
            })
            break;
        
          default:
            break;
        }
      },
      edit (record) {
        
        this.form.resetFields();
        this.model = Object.assign({}, record);
        console.log(this.model)
        this.visible = true;
        if(this.$store.state.user.newValue){
          this.model.relTenantIds=this.$store.state.user.newValue
          this.roleDisabledab = true;

          console.log(88888888888)
          console.log(this.model.relTenantIds)
          if(this.model.relTenantIds=="null"&&this.model.relTenantIds_dictText=="null"){
            this.model.relTenantIds=''
          }
        }else{
          if(this.model.relTenantIds=="null"&&this.model.relTenantIds_dictText=="null"){
            this.model.relTenantIds=''
          }
        }
        
        console.log(this.model.relTenantIds)
        //编辑页面禁止修改角色编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'relTenantIds','roleName', 'description','roleCode'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log(values)
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if(!this.model.id){
              obj=addRole(formData);
            }else{
              obj=editRole(formData);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateRoleCode(rule, value, callback){
        if(/[\u4E00-\u9FA5]/g.test(value)){
          callback("角色编码不可输入汉字!");
        }else{
          var params = {
            tableName: "sys_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          duplicateCheck(params).then((res)=>{
            if(res.success){
              callback();
            }else{
              callback(res.message);
            }
          });
        }
      }

    }
  }
</script>

<style scoped>

</style>