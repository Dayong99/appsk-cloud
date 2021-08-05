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
            <a-form-item label="出货单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deliveryId']" placeholder="请输入出货单号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="出货单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deliveryName']" placeholder="请输入出货单名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['taskName']" placeholder="请输入任务名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="生产日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择生产日期" v-decorator="['deliveryDate']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="任务号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['taskId']" placeholder="请输入任务号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['orderId']" placeholder="请输入合同号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同明细号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['itemId']" placeholder="请输入合同明细号"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="配比编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['recipeNo']" placeholder="请输入配比编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="生产方数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['quantity']" placeholder="请输入生产方数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单车盘数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['itemNo']" placeholder="请输入单车盘数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单车总盘数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalItemNo']" placeholder="请输入单车总盘数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="车号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['truckId']" placeholder="请输入车号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="运送地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['shipAdd']" placeholder="请输入运送地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="运距" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['distance']" placeholder="请输入运距" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="发货员号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['employeeId']" placeholder="请输入发货员号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['companyName']" placeholder="请输入用户名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="施工单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectCmpy']" placeholder="请输入施工单位"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="施工部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectPart']" placeholder="请输入施工部位"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="计划方数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['planCount']" placeholder="请输入计划方数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计方数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['endCount']" placeholder="请输入累计方数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="发货员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['fname']" placeholder="请输入发货员"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName']" placeholder="请输入工程名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计车数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['outCount']" placeholder="请输入累计车数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="司机" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['reserve2']" placeholder="请输入司机"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="水泥序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cementId']" placeholder="请输入水泥序号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cementName']" placeholder="请输入水泥牌号"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="强度等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['intensityLevel']" placeholder="请输入强度等级"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="抗渗度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ksd']" placeholder="请输入抗渗度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="抗折度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['kzd']" placeholder="请输入抗折度"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="塌落度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['tld']" placeholder="请输入塌落度"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="沙粒径等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sljdj']" placeholder="请输入沙粒径等级"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="碎石最大粒径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sszdlj']" placeholder="请输入碎石最大粒径"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="浇注方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['workMethod']" placeholder="请输入浇注方式"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['memo2']" placeholder="请输入备注"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="调度员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dname']" placeholder="请输入调度员"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="带砂浆:0 不带 | 1 带" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['bslurry']" placeholder="请输入带砂浆:0 不带 | 1 带" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="砂浆方量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['slurryQuantity']" placeholder="请输入砂浆方量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="砂浆配方" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['slurryRecipeNo']" placeholder="请输入砂浆配方"  ></a-input>
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
    name: 'OutMasterForm',
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
          add: "/ms/outMaster/add",
          edit: "/ms/outMaster/edit",
          queryById: "/ms/outMaster/queryById"
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
          this.form.setFieldsValue(pick(this.model,'stationId','deliveryId','deliveryName','deliveryDate','taskId','orderId','itemId','recipeNo','quantity','itemNo','truckId','shipAdd','distance','employeeId','companyName','projectCmpy','projectPart','planCount','endCount','fname','projectName','outCount','reserve2','cementId','cementName','intensityLevel','ksd','kzd','tld','sljdj','sszdlj','workMethod','memo2','dname','taskName','bslurry','slurryQuantity','slurryRecipeNo','totalItemNo'))
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
        this.form.setFieldsValue(pick(row,'stationId','deliveryId','deliveryName','deliveryDate','taskId','orderId','itemId','recipeNo','quantity','itemNo','truckId','shipAdd','distance','employeeId','companyName','projectCmpy','projectPart','planCount','endCount','fname','projectName','outCount','reserve2','cementId','cementName','intensityLevel','ksd','kzd','tld','sljdj','sszdlj','workMethod','memo2','dname','taskName','bslurry','slurryQuantity','slurryRecipeNo','totalItemNo'))
      },
    }
  }
</script>