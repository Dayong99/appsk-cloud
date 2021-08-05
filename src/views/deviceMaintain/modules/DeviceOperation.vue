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
      <j-form-container :disabled="formDisabled">
        <a-form :form="form" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-item :label="formTitle + '时间'" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-date placeholder="请选择时间" v-decorator="['operatorTime', validatorRules.operatorTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 500px" />
              </a-form-item>
            </a-col>
            
            <a-col :span="24"
              v-if="operationModelType!=2">
              <a-form-item :label="formTitle + '人'" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select
                  style="width: 500px"
                  :placeholder="'请选择' + formTitle + '人'"
                  v-decorator="['operator', validatorRules.operator]">
                  <a-select-option
                    v-for="(item, index) in declarantList"
                    :key="index"
                    :value="item.phone"
                    >{{ item.personName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="operationModelType==1 || operationModelType==2">
              <a-form-item label="维修" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select
                  style="width: 500px"
                  placeholder="请选择维修人"
                  v-decorator="['repairman', validatorRules.repairman]"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="(item, index) in repairManList" :key="index" :value="item.personPhone">{{
                    item.personName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="formTitle + '描述'" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-textarea
                  placeholder="描述"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                  v-decorator="['describes', validatorRules.describes]"
                  style="width: 500px"
                  class="areaSize"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-image-upload isMultiple :number="1" v-decorator="['filePath']"></j-image-upload>
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
import JImageUpload from '@/components/jeecg/JImageUpload'

export default {
  name: 'HazardTypeForm',
  components: {
    JFormContainer,
    JImageUpload,
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
    operationModelType: Number,
    //申报人
    declarantList: {
      type: Array,
      default: () => {},
      required: false,
    },
    repairManList: {
      type: Array,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      title: '操作',
      formTitle: '申报',
      width: 800,
      visible: false,
      list: [],
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
        operatorTime: { rules: [{ required: true, message: `时间不能为空` }] },
        operator: { rules: [{ required: true, message: `此项不能为空` }] },
        repairman: { rules: [{ required: true, message: `此项不能为空` }] },
        describes: { rules: [{ required: true, message: `此项不能为空` }] },
      },
      url: {
        operation: '/deviceMaintain/maintainDevice/operation'
      },
      operationId: ''
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
  created() {},
  methods: {
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = this.url.operation
          let method = 'put'
          let formData = Object.assign(this.model, values)
          let formDatas = Object.assign(formData, { 
            deviceId: this.operationId,
            relTenantIds: this.$store.state.user.newValue,
            sysOrgCode: this.$store.state.user.info.orgCode,
            operatorType: this.operationModelType
          })
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
    operationHandle(record) {
      this.operationId = record.id;
      this.form.resetFields();
      this.visible = true
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'hazardTypeName', 'remarks'))
    },
  },
}
</script>

<style scoped>
.areaSize {
  resize: none;
}
</style>