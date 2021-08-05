<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24" :sm="12">
            <a-form-item label="计划起始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择计划起始时间" v-decorator="['planStartTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="计划终止时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择计划终止时间" v-decorator="['planTerminationTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="设备保养计划附表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="deviceMaintainPlanSubTable.loading"
            :columns="deviceMaintainPlanSubTable.columns"
            :dataSource="deviceMaintainPlanSubTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
        </a-tab-pane>

      </a-tabs>

    </a-spin>
  </j-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'DeviceMaintainPlanMainModal',
    mixins: [JEditableTableMixin],
    components: {
      JDate,
    },
    data() {
      return {
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
        validatorRules: {
        },
        refKeys: ['deviceMaintainPlanSub', ],
        tableKeys:['deviceMaintainPlanSub', ],
        activeKey: 'deviceMaintainPlanSub',
        relTenantIds: '',
        // 设备保养计划附表
        deviceMaintainPlanSubTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '保养人',
              key: 'maintainers',
              type: FormTypes.select,
              dictCode:`aoz_person,person_name,phone,rel_tenant_ids=${this.relTenantIds}`,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '保养设备ID',
              key: 'deviceId',
              type: FormTypes.select,
              dictCode:"aoz_device_maintain,device_name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '保养内容',
              key: 'maintainContent',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/deviceMaintain/deviceMaintainPlanMain/add",
          edit: "/deviceMaintain/deviceMaintainPlanMain/edit",
          deviceMaintainPlanSub: {
            list: '/deviceMaintain/deviceMaintainPlanMain/queryDeviceMaintainPlanSubByMainId'
          },
        }
      }
    },
    beforeCreate() {
      let userInfo = JSON.parse(localStorage.getItem('infouser')).relTenantIds;
      if(userInfo){
        this.relTenantIds = userInfo;
      }
    },
    methods: {
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'planStartTime','planTerminationTime')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.deviceMaintainPlanSub.list, params, this.deviceMaintainPlanSubTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          deviceMaintainPlanSubList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'planStartTime','planTerminationTime'))
     },

    }
  }
</script>

<style scoped>
</style>