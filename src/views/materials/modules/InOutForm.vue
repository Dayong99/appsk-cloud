<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag
                type="list"
                v-decorator="['warehouseId', validatorRules.warehouseId]"
                :trigger-change="true"
                dictCode="aoz_materials_warehouse,warehouse_name,id"
                :disabled="isEdit"
                placeholder="请选择仓库"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="领用部门" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.$store.state.user.vals!=2">
              <a-input v-decorator="['department']" placeholder="请输入领用部门"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="使用部位/工程" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.$store.state.user.vals!=2">
              <a-input v-decorator="['userProject']" placeholder="请输入使用部位/工程"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登记人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['registrar', validatorRules.registrar]" placeholder="请输入登记人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登记时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="请选择登记时间"
                v-decorator="['registTime', validatorRules.registTime]"
                :trigger-change="true"
                :show-time="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['fileUrl']" :trigger-change="true"></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="直进直出记录表" :key="refKeys[0]" :forceRender="true" v-if="this.$store.state.user.vals == 1">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="inoutRecordTable.loading"
          :columns="inoutRecordTable.columns"
          :dataSource="inoutRecordTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
        />
      </a-tab-pane>
    </a-tabs>
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="入库表" :key="refKeys[0]" :forceRender="true" v-if="this.$store.state.user.vals == 2">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="inoutRecordTable.loading"
          :columns="inoutRecordTable.columns"
          :dataSource="inoutRecordTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
        />
      </a-tab-pane>
    </a-tabs>
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="出库表" :key="refKeys[0]" :forceRender="true" v-if="this.$store.state.user.vals == 3">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="inoutRecordTable.loading"
          :columns="inoutRecordTable.columns"
          :dataSource="inoutRecordTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
        />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import pick from 'lodash.pick'
import { getAction } from '@/api/manage'
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { validateDuplicateValue } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDate from '@/components/jeecg/JDate'
import JUpload from '@/components/jeecg/JUpload'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'InOutForm',
  mixins: [JEditableTableMixin],
  components: {
    JFormContainer,
    JDate,
    JUpload,
    JDictSelectTag,
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
      addDefaultRowNum: 0,
      validatorRules: {
        warehouseId: {
          rules: [{ required: true, message: '请输入仓库!' }],
        },
        registrar: {
          rules: [{ required: true, message: '请输入登记人!' }],
        },
        registTime: {
          rules: [{ required: true, message: '请输入登记时间!' }],
        },
      },
      refKeys: ['inoutRecord'],
      tableKeys: ['inoutRecord'],
      activeKey: 'inoutRecord',
      // 直进直出记录表
      inoutRecordTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '物资名称',
            key: 'materialsName',
            type: FormTypes.popup,
            popupCode: 'aoz_materials_classify',
            destFields:
              'classifyId,materialsName,materialsNumber,specifications,modelNumber,inventoryTotal,materialUnit',
            orgFields: 'id,materials_name,materials_number,specifications,model_number,inventory_total,material_unit',
            width: '200px',
            placeholder: '请选择物资',
            defaultValue: '',
            validateRules: [{ required: true, message: '物资不能为空' }],
          },

          {
            title: '材料ID',
            key: 'classifyId',
            type: 'hidden',
          },

          {
            title: '物资编号',
            key: 'materialsNumber',
            type: FormTypes.input,
            disabled: true,
            width: '200px',
            // placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '规格',
            key: 'specifications',
            type: FormTypes.input,
            disabled: true,
            width: '200px',
            // placeholder: '请输入${title}',
            defaultValue: '',
          },

          {
            title: '型号',
            key: 'modelNumber',
            type: FormTypes.input,
            disabled: true,
            width: '200px',
            // placeholder: '请输入${title}',
            defaultValue: '',
          },

          {
            title: '库存',
            key: 'inventoryTotal',
            type: FormTypes.input,
            disabled: true,
            width: '200px',
            // placeholder: '请输入${title}',
            defaultValue: '',
          },

          {
            title: '重量',
            key: 'inOutNumber',
            type: FormTypes.inputNumber,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },

          {
            title: '单位',
            key: 'materialUnit',
            type: FormTypes.select,
            disabled: false,
            dictCode: 'material_unit',
            width: '200px',
            placeholder: '请选择${title}',
            defaultValue: '',
          },

          {
            title: 'classify_id',
            key: 'classify_id',
            type: 'hidden',
          },

          {
            title: 'materials_name',
            key: 'materials_name',
            type: 'hidden',
          },
        ],
      },
      url: {
        add: '/materials/inOut/add',
        edit: '/materials/inOut/edit',
        queryById: '/materials/inOut/queryById',
        inoutRecord: {
          list: '/materials/inOut/queryInoutRecordByMainId',
        },
      },
    }
  },
  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {},
      required: false,
    },
    //表单模式：false流程表单 true普通表单
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
    isEdit: false
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
    console.log(this.formData)
  },
  methods: {
    addBefore() {
      this.form.resetFields()
      this.inoutRecordTable.dataSource = []
    },
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    cAfter(recordList) {
      if (recordList) {
        let recordsp = JSON.parse(recordList.materialsInfo)
        recordsp.forEach((a) => {
          const classifyId = { classifyId: a.id }
          Object.assign(a, classifyId)
        })
        this.inoutRecordTable.dataSource = recordsp
      }
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      let fieldval = pick(
        this.model,
        'serialNumber',
        'warehouseId',
        'department',
        'userProject',
        'registrar',
        'registTime',
        'fileUrl',
        'remarks'
      )
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.inoutRecord.list, params, this.inoutRecordTable)
      }
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        inoutRecordList: allValues.tablesValue[0].values,
      }
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
    validateError(msg) {
      this.$message.error(msg)
    },
    popupCallback(row) {
      this.form.setFieldsValue(
        pick(
          row,
          'serialNumber',
          'warehouseId',
          'department',
          'userProject',
          'registrar',
          'registTime',
          'fileUrl',
          'remarks'
        )
      )
    },
  },
}
</script>

<style scoped>
</style>