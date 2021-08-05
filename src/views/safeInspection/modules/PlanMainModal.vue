<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"

  >
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24" :sm="12">
            <a-form-item label="计划类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag
                type="list"
                v-decorator="['planType']"
                :trigger-change="true"
                dictCode="plan_type"
                @change="getPlanType"
                placeholder="请选择计划类型"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="计划起始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                format="YYYY-MM-DD"
                v-decorator="['planStartTime', {}]"
                @change="getStarTime"
                :disabledDate="disabledDate"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="计划终止时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                showTime
                format="YYYY-MM-DD"
                v-decorator="['planEndTime', {}]"
                :disabledDate="disabledDateEnd"
                disabled
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="质量巡检计划" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="planSubTable.loading"
            :columns="planSubTable.columns"
            :dataSource="planSubTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
          />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </j-modal>
</template>

<script>
import pick from 'lodash.pick'
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { validateDuplicateValue } from '@/utils/util'
import JDate from '@/components/jeecg/JDate'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import moment from 'moment'

export default {
  name: 'PlanMainModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JDictSelectTag,
  },
  data() {
    return {
      planType: null,
      startTime: null,
      endTime: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {},
      refKeys: ['planSub'],
      tableKeys: ['planSub'],
      activeKey: 'planSub',
      // 质量巡检计划子表
      planSubTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '巡检人',
            key: 'inspector',
            type: FormTypes.select,
            width: '200px',
            placeholder: '请选择${title}',
            defaultValue: '',
            dictCode: 'aoz_person,person_name,phone',
          },
          {
            title: '巡检地点',
            key: 'inspectionAddr',
            type: FormTypes.input,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '巡检内容',
            key: 'inspectionContent',
            type: FormTypes.input,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
          },
        ],
      },
      url: {
        add: '/sys/planMain/add',
        edit: '/sys/planMain/edit',
        planSub: {
          list: '/sys/planMain/queryPlanSubByMainId',
        },
      },
    }
  },
  methods: {
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      let fieldval = pick(this.model, 'planType', 'planStartTime', 'planEndTime')

      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.planSub.list, params, this.planSubTable)
      }
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      let planMain = Object.assign(main, {orderType:0})
      planMain.planStartTime = planMain.planStartTime ? planMain.planStartTime.format('YYYY-MM-DD') : null
      return {
        ...planMain, // 展开
        planSubList: allValues.tablesValue[0].values,
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'planType', 'planStartTime', 'planEndTime'))
    },
    //类型选择
    getPlanType(val) {
      this.planType = val
      let msg = null;
      if(this.startTime !== null && this.planType == 0){
        this.form.setFieldsValue({
          planEndTime: this.startTime,
        })
      } else if (this.startTime !== null && this.planType == 1) {
        msg = moment(this.startTime).add(7, 'days').format('YYYY-MM-DD')
         this.form.setFieldsValue({
          planEndTime: msg,
        })
      } else if (this.startTime !== null && this.planType == 2){
        msg = moment(this.startTime).add(7, 'days').format('YYYY-MM-DD')
         this.form.setFieldsValue({
          planEndTime: msg,
        })
      }
    },
    //时间选择
    getStarTime(date, val) {
      this.startTime = val;
      let msg = "";
      if (this.planType !== null && this.planType == 0) {
        this.form.setFieldsValue({
          planEndTime: val,
        })
      } else if (this.planType !== null && this.planType == 1) {
        msg = moment(val).add(7, 'days').format('YYYY-MM-DD')
        this.form.setFieldsValue({
          planEndTime: msg,
        })
      } else if (this.planType !== null && this.planType == 2) {
        msg = moment(val).add(1, 'months').format('YYYY-MM-DD')
        this.form.setFieldsValue({
          planEndTime: msg,
        })
      }

      console.log(msg)
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days')
    },
    disabledDateEnd(current) {},
  },
}
</script>

<style scoped>
</style>