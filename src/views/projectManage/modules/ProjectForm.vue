<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="项目编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectCode']" placeholder="请输入项目编码"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName', validatorRules.projectName]" placeholder="请输入项目名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['projectType', validatorRules.projectType]" :trigger-change="true" dictCode="project_manage_project_type" placeholder="请选择项目类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="公司logo" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['logoUrl']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="城市名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cityName']" placeholder="请输入城市名称"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="城市编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cityCode', validatorRules.cityCode]" placeholder="请输入城市编码"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="开工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
<!--              <j-date placeholder="请选择开工日期" v-decorator="['projectStartDate']" :trigger-change="true" style="width: 100%" />-->
              <a-date-picker
                format="YYYY-MM-DD"
                v-decorator="['projectStartDate', validatorRules.projectStartDate]"
                @change="startTimeChange"
                :disabledDate="disabledStartTime"
                style="width: 100%"
              >
              </a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="竣工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
<!--              <j-date placeholder="请选择竣工日期" v-decorator="['projectEndDate']" :trigger-change="true" style="width: 100%" />-->
              <a-date-picker
                format="YYYY-MM-DD"
                v-decorator="['projectEndDate', validatorRules.projectEndDate]"
                @change="endTimeChange"
                :disabledDate="disabledEndTime"
                style="width: 100%"
              >
              </a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程规模" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectScale', validatorRules.projectScale]" placeholder="请输入工程规模"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程规模单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['projectScaleUnit', validatorRules.projectScaleUnit]" :trigger-change="true" dictCode="project_manage_project_scale_unit" placeholder="请选择工程规模单位" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="投资规模" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['investmentScale', validatorRules.investmentScale]" placeholder="请输入投资规模"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="投资规模单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['investmentScaleUnit', validatorRules.investmentScaleUnit]" :trigger-change="true" dictCode="project_manage_investment_scale_unit" placeholder="请选择投资规模单位" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectAddress']" placeholder="请输入项目地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectStatus', validatorRules.projectStatus]" placeholder="请输入工程状态"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工程概括" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectGeneralize']" placeholder="请输入工程概括"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目图" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  v-decorator="['projectImageUrl']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['longitude', validatorRules.longitude]" placeholder="请输入经度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['latitude', validatorRules.latitude]" placeholder="请输入纬度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="公司名称(施工单位)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['companyName']" placeholder="请输入公司名称(施工单位)"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注信息"  ></a-input>
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
  import moment from "moment";

  export default {
    name: 'ProjectForm',
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
          projectName: {
            rules: [
              { required: true, message: '请输入项目名称!'},
            ]
          },
          projectType: {
            rules: [
              { required: true, message: '请输入项目类型!'},
            ]
          },
          cityCode: {
            rules: [
              { required: true, message: '请输入城市编码!'},
            ]
          },
          projectStartDate: {
            rules: [
              { required: true, message: '请输入开工日期!'},
            ]
          },
          projectEndDate: {
            rules: [
              { required: true, message: '请输入竣工日期!'},
            ]
          },
          projectScale: {
            rules: [
              { required: true, message: '请输入工程规模!'},
            ]
          },
          projectScaleUnit: {
            rules: [
              { required: true, message: '请输入工程规模单位!'},
            ]
          },
          investmentScale: {
            rules: [
              { required: true, message: '请输入投资规模!'},
              { pattern: /^\d+\.?\d*$/, message: '请输入一个正数!'},
            ]
          },
          investmentScaleUnit: {
            rules: [
              { required: true, message: '请输入投资规模单位!'},
            ]
          },
          projectStatus: {
            rules: [
              { required: true, message: '请输入工程状态!'},
            ]
          },
          longitude: {
            rules: [
              { required: true, message: '请输入经度!'},
            ]
          },
          latitude: {
            rules: [
              { required: true, message: '请输入纬度!'},
            ]
          },
        },
        url: {
          add: "/sys/project/add",
          edit: "/sys/project/edit",
          queryById: "/sys/project/queryById"
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
      startTimeChange(value,date) {
        this.projectStartDate = value
      },
      endTimeChange(value,date) {
        this.projectEndDate = value
      },
      disabledStartTime(current) {
        if (this.projectEndDate) {
          return current > moment(this.projectEndDate)
        }
      },
      disabledEndTime(current) {
        if (this.projectStartDate) {
          return current < moment(this.projectStartDate)
        }
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'projectCode','projectName','projectType','logoUrl','cityName','cityCode','projectStartDate','projectEndDate','projectScale','projectScaleUnit','investmentScale','investmentScaleUnit','projectAddress','projectStatus','projectGeneralize','projectImageUrl','longitude','latitude','companyName','remarks','createTime'))
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
        this.form.setFieldsValue(pick(row,'projectCode','projectName','projectType','logoUrl','cityName','cityCode','projectStartDate','projectEndDate','projectScale','projectScaleUnit','investmentScale','investmentScaleUnit','projectAddress','projectStatus','projectGeneralize','projectImageUrl','longitude','latitude','companyName','remarks','createTime'))
      },
    }
  }
</script>