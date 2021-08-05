<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <j-form-container>
        <a-form :form="form" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-item label="参建企业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['contractorName', validatorRules.contractorName]"
                  placeholder="请输入参建企业名称"
                  :disabled="recordId != undefined"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="统一社会信用代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['creditCode', validatorRules.creditCode]"
                  placeholder="请输入统一社会信用代码"
                  :disabled="recordId != undefined"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="企业类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-dict-select-tag
                  type="list"
                  v-decorator="['contractorType', validatorRules.contractorType]"
                  :trigger-change="true"
                  dictCode="contractor_type"
                  placeholder="请选择企业类别"
                  :disabled="recordId != undefined"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="经营范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['businessScope']" placeholder="请输入经营范围" :disabled="recordId != undefined"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['remarks']" placeholder="请输入备注" :disabled="recordId != undefined"></a-input>
              </a-form-item>
            </a-col>
            <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
              <a-button @click="submitForm">提 交</a-button>
            </a-col>
          </a-row>
        </a-form>
      </j-form-container>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'ContractorForm',
  components: {
    JFormContainer,
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
  },
  data() {
    return {
      recordId: '',
      form: this.$form.createForm(this),
      model: {},
      title: '操作',
      width: 800,
      visible: false,
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
        contractorName: {
          rules: [{ required: true, message: '请输入参建企业名称!' }],
        },
        creditCode: {
          rules: [{ required: true, message: '请输入统一社会信用代码!' }],
        },
        contractorType: {
          rules: [{ required: true, message: '请输入企业类别!' }],
        },
      },
      url: {
        list: '/contractor/contractor/list',
        add: '/contractor/contractor/add',
        edit: '/contractor/contractor/edit',
        queryById: '/contractor/contractor/queryById',
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
    handleOk() {
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
          let old_pid = this.model[this.pidField]
          let formData = Object.assign(this.model, values)
          let formDatas = Object.assign(formData, { relTenantIds: this.$store.state.user.newValue })
          let new_pid = this.model[this.pidField]

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
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    add() {
      this.edit({})
    },
    edit(record) {
      let recordSrt = JSON.stringify(record)
      if (recordSrt === '{}') {
        this.recordId = ''
      }
      this.recordId = record.id
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'contractorName', 'creditCode', 'contractorType', 'businessScope', 'remarks')
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
          let formData = Object.assign(this.model, values)
          console.log('表单提交数据', formData)
          httpAction(httpurl, formData, method)
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
        }
      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'contractorName', 'creditCode', 'contractorType', 'businessScope', 'remarks'))
    },
  },
}
</script>