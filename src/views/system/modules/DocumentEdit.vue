<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false" v-if="selectedKeys.length>0">
            <a-form :form="form">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="机构名称">
                <a-input placeholder="请输入机构/部门名称1" v-decorator="['departName', validatorRules.departName ]"/>
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
                <a-tree-select
                  style="width:100%"
                  :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                  :treeData="treeData"
                  :disabled="disable"
                  v-model="model.parentId"
                  placeholder="无">
                </a-tree-select>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="机构编码">
                <a-input disabled placeholder="请输入机构编码" v-decorator="['orgCode', validatorRules.orgCode ]"/>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="机构类型">
                <template v-if="orgCategoryDisabled">
                  <a-radio-group v-decorator="['orgCategory',validatorRules.orgCategory]" placeholder="请选择机构类型">
                    <a-radio value="1">
                      公司
                    </a-radio>
                  </a-radio-group>
                </template>
                <template v-else>
                  <a-radio-group v-decorator="['orgCategory',validatorRules.orgCategory]" placeholder="请选择机构类型">
                    <a-radio value="2">
                      部门
                    </a-radio>
                    <a-radio value="3">
                      岗位
                    </a-radio>
                  </a-radio-group>
                </template>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="排序">
                <a-input-number v-decorator="[ 'departOrder',{'initialValue':0}]"/>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="手机号">
                <a-input placeholder="请输入手机号" v-decorator="['mobile', {'initialValue':''}]"/>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="地址">
                <a-input placeholder="请输入地址" v-decorator="['address', {'initialValue':''}]"/>
              </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="备注">
                <a-textarea placeholder="请输入备注" v-decorator="['memo', {'initialValue':''}]"/>
              </a-form-item>
            </a-form>
            <div class="anty-form-btn">
              <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
              <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">保存</a-button>
            </div>
          </a-card>
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="seen" label="父级节点" hasFeedback>
        <a-tree-select
          style="width:100%"
          :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
          :treeData="departTree"
          v-model="model.pid"
          placeholder="请选择父级节点"
          :disabled="condition">
        </a-tree-select>
        </a-form-item>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', validatorRules.name]" placeholder="请输入名称" ></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['remarks']" placeholder="请输入备注" ></a-input>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['sort', validatorRules.sort]" placeholder="请输入排序" style="width: 100%" />
        </a-form-item>
        <a-form-item label="是否允许删除" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-switch v-decorator="['isAllowDelete', validatorRules.isAllowDelete]" :options="[1,2]"></j-switch>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { documenTreeList } from '@/api/api'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  export default {
    name: "SysDepartModal",
    components: { ATextarea },
    data () {
      return {
        departTree:[],
        orgTypeData:[],
        phoneWarning:'',
        title:"操作",
        seen:false,
        visible: false,
        condition:true,
        disableSubmit:false,
        model: {},
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          name: {
            rules: [
              { required: true, message: '请输入名称!'},
            ]
          },
          sort: {
            rules: [
              { required: true, message: '请输入排序!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          isAllowDelete: {
            rules: [
              { required: true, message: '请输入是否允许删除!'},
            ]
          },
        orgCode:{rules: [{ required: true, message: '请输入机构编码!' }]},
         mobile:{rules: [{validator:this.validateMobile}]}
        },
        url: {
          add: "/sys/archivesTree/add",
        },
        dictDisabled:true,
      }
    },
    created () {
    },
    methods: {
      loadTreeData(){
        var that = this;
        documenTreeList().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          }

        })
      },
      add (depart) {
        if(depart){
          this.seen = false;
          this.dictDisabled = false;
        }else{
          this.seen = true;
          this.dictDisabled = true;
        }
        this.edit(depart);
      },
      edit (record) {
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          this.loadTreeData();
          this.model.pid = record!=null?record.toString():null;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'name','remarks','sort','isAllowDelete','departNameEn','departNameAbbr','departOrder','description','orgType','orgCode','status','delFlag'))
          });
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //时间格式化
            console.log(formData)
            httpAction(this.url.add,formData,"post").then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadTreeData();
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
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手机号码格式不正确!");
        }

      }
    }
  }
</script>

<style scoped>

</style>