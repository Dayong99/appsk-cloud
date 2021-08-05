<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="检查人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <a-input v-decorator="['inspector', validatorRules.inspector]" placeholder="请输入检查人"  ></a-input> -->
              <j-dict-select-tag
                type="list"
                v-decorator="['inspector', validatorRules.inspector]"
                :trigger-change="true"
                dictCode="aoz_person,person_name,phone"
                placeholder="请选择责任人"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="检查时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="请选择检查时间"
                v-decorator="['inspectTime', validatorRules.inspectTime]"
                :trigger-change="true"
                :show-time="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="责任人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <a-input v-decorator="['inspectDutyPerson', validatorRules.inspectDutyPerson]" placeholder="请输入责任人"  ></a-input> -->
              <j-dict-select-tag
                type="list"
                v-decorator="['inspectDutyPerson', validatorRules.inspectDutyPerson]"
                :trigger-change="true"
                dictCode="aoz_person,person_name,phone"
                placeholder="请选择责任人"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="问题部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['inspectProblemArea']" placeholder="请输入问题部位"></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="隐患类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['hazardTypeId', validatorRules.hazardTypeId]" :trigger-change="true" dictCode="aoz_inspection_hazard_type,hazard_type_name,id" placeholder="请选择隐患类别" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="隐患事件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['hazardContentId', validatorRules.hazardContentId]" :trigger-change="true" dictCode="aoz_inspection_hazard_library,hazard_content,id" placeholder="请选择隐患事件" />
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="问题分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['inspectProblemClassify', validatorRules.inspectProblemClassify]" :trigger-change="true" dictCode="aoz_sys_inspection_quality_question,quality_question,id" placeholder="请选择问题分类" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="需整改内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['inspectContent', validatorRules.inspectContent]"
                placeholder="请输入需整改内容"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="整改期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="请选择整改期限"
                v-decorator="['inspectValidityTime', validatorRules.inspectValidityTime]"
                :trigger-change="true"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="需整改图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple v-decorator="['inspectPath']"></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注信息"></a-input>
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
import { httpAction, getAction, putAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDate from '@/components/jeecg/JDate'
import JImageUpload from '@/components/jeecg/JImageUpload'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'QualityForm',
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
      default: () => {},
      required: false,
    },
    //表单模式：true流程表单 false普通表单
    formBpm: {
      type: Boolean,
      default: false,
      required: false,
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    pollingResult: Object,
  },
  data() {
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
        inspector: {
          rules: [{ required: true, message: '请输入检查人!' }],
        },
        inspectTime: {
          rules: [{ required: true, message: '请输入检查时间!' }],
        },
        inspectDutyPerson: {
          rules: [{ required: true, message: '请输入责任人!' }],
        },
        // hazardTypeId: {
        //   rules: [
        //     { required: true, message: '请输入隐患类别!'},
        //   ]
        // },
        // hazardContentId: {
        //   rules: [
        //     { required: true, message: '请输入隐患事件!'},
        //   ]
        // },
        inspectProblemClassify: {
          rules: [{ required: true, message: '请选择问题分类!' }],
        },
        inspectContent: {
          rules: [{ required: true, message: '请输入需整改内容!' }],
        },
        inspectValidityTime: {
          rules: [{ required: true, message: '请输入整改期限!' }],
        },
      },
      url: {
        add: '/sys/qualitySafety/add',
        edit: '/sys/qualitySafety/edit',
        queryById: '/sys/qualitySafety/queryById',
      },
    }
  },
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    },
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    this.showFlowData()
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'inspector',
            'inspectTime',
            'inspectDutyPerson',
            'inspectProblemArea',
            'inspectProblemClassify',
            'inspectContent',
            'inspectValidityTime',
            'inspectPath',
            'repairer',
            'repairTime',
            'repairIsOutTime',
            'checkPerson',
            'checkTime',
            'checkStatus',
            'orderStatus',
            'remarks'
          )
        )
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = { id: this.formData.dataId }
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result)
          }
        })
      }
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          console.log(values)
          let formData = Object.assign(this.model, values)
          let formDatas = Object.assign(formData, {
            orderType: 0,
            planId: that.pollingId,
          })
          //新增表单提交
          httpAction(httpurl, formDatas, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
          //提交巡检结果
          putAction('/sys/planMain/editSub', that.pollingResult)
            .then((res) => {
              if (res.success) {
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(
        pick(
          row,
          'inspector',
          'inspectTime',
          'inspectDutyPerson',
          'inspectProblemArea',
          'inspectProblemClassify',
          'inspectContent',
          'inspectValidityTime',
          'inspectPath',
          'repairer',
          'repairTime',
          'repairIsOutTime',
          'checkPerson',
          'checkTime',
          'checkStatus',
          'orderStatus',
          'remarks'
        )
      )
    },
  },
}
</script>