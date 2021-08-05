<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-item label="试验室编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-input v-decorator="['sysbh']" placeholder="请输入试验室编号" ></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="设备编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['deviceNumber']" :trigger-change="true" dictCode="aoz_device,device_name,device_number" placeholder="请选择设备编号" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试验类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['testTypeCode']" :trigger-change="true" dictCode="test_type_code" placeholder="请选择试验类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="组编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['testNo']" placeholder="请输入组编号" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试件数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sampleCode']" placeholder="请输入试件数量" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试验日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择试验日期" v-decorator="['dateTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="操作人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['operator']" placeholder="请输入操作人员" ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="试件实验记录" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="universalRecordSubTable.loading"
          :columns="universalRecordSubTable.columns"
          :dataSource="universalRecordSubTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'UniversalRecordForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
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
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['universalRecordSub', ],
        tableKeys:['universalRecordSub', ],
        activeKey: 'universalRecordSub',
        // 万能试验机记录子表
        universalRecordSubTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '试件序号',
              key: 'curOrder',
              type: FormTypes.inputNumber,
              width:"100px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            // {
            //   title: '形状',
            //   key: 'shape',
            //   type: FormTypes.input,
            //   width:"100px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '直径',
            //   key: 'diameter',
            //   type: FormTypes.inputNumber,
            //   width:"100px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '面积(mm²)',
            //   key: 'area',
            //   type: FormTypes.inputNumber,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '原始标距(mm)',
            //   key: 'guage',
            //   type: FormTypes.input,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            {
              title: '最大力(N)',
              key: 'maxLoad',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '最大位移(mm)',
              key: 'maxPosi',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上屈服力(kN)',
              key: 'feH',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下屈服力(kN)',
              key: 'feL',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上屈服强度',
              key: 'peH',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下屈服强度',
              key: 'peL',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '弹性模量（MPa）',
              key: 'elasticty',
              type: FormTypes.inputNumber,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '抗压抗拉强度(MPa)',
              key: 'kyqd',
              type: FormTypes.input,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '最大力总延伸率',
              key: 'agt',
              type: FormTypes.input,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '最大力塑性延伸率',
              key: 'ag',
              type: FormTypes.input,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            // {
            //   title: '强度等级',
            //   key: 'qddj',
            //   type: FormTypes.input,
            //   width:"300px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '有效力值（kN）',
            //   key: 'yxlz',
            //   type: FormTypes.input,
            //   width:"300px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '有效强度(MPa)',
            //   key: 'yxqd',
            //   type: FormTypes.input,
            //   width:"300px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '试验点数据',
            //   key: 'testPoint',
            //   type: FormTypes.input,
            //   width:"300px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            {
              title: '试验开始时间',
              key: 'testBTime',
              type: FormTypes.datetime,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '试验结束时间',
              key: 'testETime',
              type: FormTypes.datetime,
              width:"300px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            // {
            //   title: '试验持续时间(s)',
            //   key: 'duration',
            //   type: FormTypes.inputNumber,
            //   width:"300px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
          ]
        },
        url: {
          add: "/universal/universalRecord/add",
          edit: "/universal/universalRecord/edit",
          queryById: "/universal/universalRecord/queryById",
          universalRecordSub: {
            list: '/universal/universalRecord/queryUniversalRecordSubByMainId'
          },
        }
      }
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：false流程表单 true普通表单
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
      addBefore(){
        this.form.resetFields()
        this.universalRecordSubTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'sysbh','deviceNumber','testTypeCode','testNo','sampleCode','dateTime','operator')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.universalRecordSub.list, params, this.universalRecordSubTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          universalRecordSubList: allValues.tablesValue[0].values,
        }
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          })
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'sysbh','deviceNumber','testTypeCode','testNo','sampleCode','dateTime','operator'))
     },

    }
  }
</script>

<style scoped>
</style>