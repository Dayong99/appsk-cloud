<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['deivceCode']" :trigger-change="true" dictCode="aoz_device,device_name,device_number" placeholder="请选择设备" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="外部编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['wbbh']" placeholder="请输入外部编号" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试验类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['testType']" placeholder="请输入试验类型" ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-item label="试件品种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['variety']" placeholder="请输入试件品种" ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24" >
            <a-form-item label="强度等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['strengthGrade']" placeholder="请输入强度等级" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试件规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['specification']" placeholder="请输入试件规格" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="加荷速度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['speed']" placeholder="请输入加荷速度" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="本组实验数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['testCount']" placeholder="请输入本组实验数量" ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-item label="跨距" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['kj']" placeholder="请输入跨距" ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24" >
            <a-form-item label="面积" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['size']" placeholder="请输入面积" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="修正系数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['xs']" placeholder="请输入修正系数" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="有效力值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['yxlz']" placeholder="请输入有效力值" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="有效强度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['yxqd']" placeholder="请输入有效强度" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="龄期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lq']" placeholder="请输入龄期" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="试验日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择试验日期" v-decorator="['dateTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-item label="数据文件路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['filePath']" placeholder="请输入数据文件路径" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="试验是否完成" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['endFlag']" :trigger-change="true" dictCode="is_complete" placeholder="暂无完成情况" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="截面形状" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['shape']" :trigger-change="true" dictCode="section_shape" placeholder="暂无截面形状" />
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="实验员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['tester']" placeholder="请输入实验员" ></a-input>
            </a-form-item>
          </a-col> -->
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="试件试验记录" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="pressureSubRecordTable.loading"
          :columns="pressureSubRecordTable.columns"
          :dataSource="pressureSubRecordTable.dataSource"
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
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'PressureRecordForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
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
        refKeys: ['pressureSubRecord', ],
        tableKeys:['pressureSubRecord', ],
        activeKey: 'pressureSubRecord',
        // 压力试验机从表数据
        pressureSubRecordTable: {
          loading: false,
          dataSource: [],
          columns: [
            // {
            //   title: '压力机主表id',
            //   key: 'pressureRecordId',
            //   type: FormTypes.input,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            {
              title: '试件序号',
              key: 'serialNum',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '极限荷载(kN)',
              key: 'testLoad',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '极限强度(Mpa)',
              key: 'stress',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            // {
            //   title: '开始时间',
            //   key: 'startTime',
            //   type: FormTypes.date,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
            // {
            //   title: '结束时间',
            //   key: 'endTime',
            //   type: FormTypes.date,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
          ]
        },
        url: {
          add: "/mixingStation/pressureRecord/add",
          edit: "/mixingStation/pressureRecord/edit",
          queryById: "/mixingStation/pressureRecord/queryById",
          pressureSubRecord: {
            list: '/mixingStation/pressureRecord/queryPressureSubRecordByMainId'
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
        this.pressureSubRecordTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'deivceCode','testType','variety','strengthGrade','specification','speed','testCount','kj','size','xs','yxlz','yxqd','lq','dateTime','filePath','endFlag','wbbh','shape','tester')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.pressureSubRecord.list, params, this.pressureSubRecordTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          pressureSubRecordList: allValues.tablesValue[0].values,
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
       this.form.setFieldsValue(pick(row,'deivceCode','testType','variety','strengthGrade','specification','speed','testCount','kj','size','xs','yxlz','yxqd','lq','dateTime','filePath','endFlag','wbbh','shape','tester'))
     },

    }
  }
</script>

<style scoped>
</style>