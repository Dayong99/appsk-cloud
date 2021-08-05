<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 主表单区域 -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="巡检时间">
          <a-date-picker
            showTime
            format="YYYY-MM-DD"
            v-decorator="[
              'orderDate',
              {
                rules: [{ required: true, message: '请选择巡检时间' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="巡检结果">
          <a-select
            placeholder="请选择巡检结果"
            v-decorator="[
              'ctype',
              {
                rules: [{ required: true, message: '请选择巡检类型' }],
              },
            ]"
          >
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">异常</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction } from '@api/manage'
import JDate from '@/components/jeecg/JDate'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'SafetSubSubTableModal',
  components: {
    JDate,
  },
  props: {
    tableRowData: Object,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      orderMainModel: {
        jeecgOrderCustomerList: [{}],
        jeecgOrderTicketList: [{}],
      },
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
      validatorRules: {},
      url: {
        editSub: '/sys/planMain/editSub',
      },
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.orderMainModel = Object.assign({}, record)
      //初始化明细表数据
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.orderMainModel, 'ctype', 'orderMoney'))
        this.form.setFieldsValue({
          orderDate: this.orderMainModel.orderDate ? moment(this.orderMainModel.orderDate) : null,
        }) //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.orderMainModel.id) {
            httpurl += this.url.add
            console.log('0', httpurl)
            method = 'post'
          } else {
            console.log('1', mhttpurl)
            httpurl += this.url.edit
            method = 'put'
          }
          let orderMainData = Object.assign(this.orderMainModel, values)
          //时间格式化
          orderMainData.orderDate = orderMainData.orderDate
            ? orderMainData.orderDate.format('YYYY-MM-DD hh:mm:ss')
            : null
          let formData = {
            ...orderMainData,
          }
          let polling = {
            createBy: that.tableRowData.createBy,
            createTime: that.tableRowData.createTime,
            id: that.tableRowData.id,
            inspectionAddr: that.tableRowData.inspectionAddr,
            inspectionContent: that.tableRowData.inspectionContent,
            inspectionResult: formData.ctype,
            inspectionStatus: 1,
            inspectionTime: formData.orderDate,
            inspector: that.tableRowData.inspector,
            isTimeout: that.tableRowData.isTimeout,
            planMainId: that.tableRowData.planMainId,
            relTenantIds: that.tableRowData.relTenantIds,
            sysOrgCode: that.tableRowData.sysOrgCode,
            updateBy: that.tableRowData.updateBy,
            updateTime: that.tableRowData.updateTime,
          }
          if (formData.ctype == 1) {
            this.$router.push({
              path: '/safeInspection/qualitySafetyList',
              query: {
                polling: polling,
              },
            })
          } else {
            console.log(this.url.editSub)
            putAction(this.url.editSub, {
              createBy: that.tableRowData.createBy,
              createTime: that.tableRowData.createTime,
              id: that.tableRowData.id,
              inspectionAddr: that.tableRowData.inspectionAddr,
              inspectionContent: that.tableRowData.inspectionContent,
              inspectionResult: formData.ctype,
              inspectionStatus: 1,
              inspectionTime: formData.orderDate,
              inspector: that.tableRowData.inspector,
              isTimeout: that.tableRowData.isTimeout,
              planMainId: that.tableRowData.planMainId,
              relTenantIds: that.tableRowData.relTenantIds,
              sysOrgCode: that.tableRowData.sysOrgCode,
              updateBy: that.tableRowData.updateBy,
              updateTime: that.tableRowData.updateTime,
            })
              .then((res) => {
                console.log(res)
                if (res.success) {
                  that.handleCancel()
                }
              })
              .finally(() => {
                this.loading = false
              })
            setTimeout(() => {
              this.$router.go(0)
            }, 500)
          }
        }
      })
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>