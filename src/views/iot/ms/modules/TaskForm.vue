<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="站名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['stationId']" :trigger-change="true" dictCode="aoz_device,device_name,device_number" placeholder="请选择站名" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['taskName']" placeholder="请输入任务名称"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['orderId']" placeholder="请输入合同号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同明细号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['itemId']" placeholder="请输入合同明细号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="调度员号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['employeeId']" placeholder="请输入调度员号"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="计划时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择计划时间" v-decorator="['planDate']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName']" placeholder="请输入工程名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="施工单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectCmpy']" placeholder="请输入施工单位"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="送货地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['shipToAdd1']" placeholder="请输入送货地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="配比编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['recipeNo']" placeholder="请输入配比编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="施工部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectPart']" placeholder="请输入施工部位"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="浇注方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['workMethod']" placeholder="请输入浇注方式"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计车次" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['outCount']" placeholder="请输入累计车次" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="计划方量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['planCount']" placeholder="请输入计划方量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="完成方量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['endCount']" placeholder="请输入完成方量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="运距" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['distance']" placeholder="请输入运距" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="大石料(G1)含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['dsl']" placeholder="请输入大石料(G1)含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中石料(G2)含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['zsl']" placeholder="请输入中石料(G2)含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="小石料(S2)含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['xsl']" placeholder="请输入小石料(S2)含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子(S1)含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sz']" placeholder="请输入沙子(S1)含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子1含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sz1']" placeholder="请输入沙子1含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子2含水率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sz2']" placeholder="请输入沙子2含水率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cementId']" placeholder="请输入水泥编号"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['memo2']" placeholder="请输入备注"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="任务状态：1 使用 | 0 停用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ustate']" placeholder="请输入任务状态：1 使用 | 0 停用"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['customerName']" placeholder="请输入合同名"  ></a-input>
            </a-form-item>
          </a-col> -->
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

  export default {
    name: 'TaskForm',
    components: {
      JFormContainer,
      JDate,
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
          add: "/ms/task/add",
          edit: "/ms/task/edit",
          queryById: "/ms/task/queryById"
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
          this.form.setFieldsValue(pick(this.model,'stationId','taskName','orderId','itemId','employeeId','planDate','outCount','planCount','endCount','dsl','zsl','xsl','sz','sz1','sz2','projectName','projectCmpy','shipToAdd1','recipeNo','projectPart','workMethod','cementId','memo2','distance','ustate','customerName'))
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
        this.form.setFieldsValue(pick(row,'stationId','taskName','orderId','itemId','employeeId','planDate','outCount','planCount','endCount','dsl','zsl','xsl','sz','sz1','sz2','projectName','projectCmpy','shipToAdd1','recipeNo','projectPart','workMethod','cementId','memo2','distance','ustate','customerName'))
      },
    }
  }
</script>