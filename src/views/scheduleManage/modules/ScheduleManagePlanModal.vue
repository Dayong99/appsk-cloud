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
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
<!--          <a-form-item label="父级节点" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-tree-select-->
<!--            ref="treeSelect"-->
<!--            placeholder="请选择父级节点"-->
<!--            v-decorator="['pid']"-->
<!--            dict="aoz_sys_schedule_plan,task_name,id"-->
<!--            pidField="pid"-->
<!--            pidValue="0"-->
<!--            hasChildField="has_child"-->
<!--            >-->
<!--          </j-tree-select>-->
<!--        </a-form-item>-->
        <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['taskName', validatorRules.taskName]" placeholder="请输入任务名称" ></a-input>
        </a-form-item>
<!--        <a-form-item label="工期" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-input v-decorator="['duration']" placeholder="请输入工期" ></a-input>-->
<!--        </a-form-item>-->
        <a-form-item label="计划开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择计划开始时间" v-decorator="['planStartTime', validatorRules.planStartTime]" :trigger-change="true" style="width: 100%" />
        </a-form-item>
        <a-form-item label="计划完成时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择计划完成时间" v-decorator="['planCompletionTime', validatorRules.planCompletionTime]" :trigger-change="true" style="width: 100%" />
        </a-form-item>
<!--        <a-form-item label="实际开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-date placeholder="请选择实际开始时间" v-decorator="['actualStartTime']" :trigger-change="true" style="width: 100%" />-->
<!--        </a-form-item>-->
<!--        <a-form-item label="实际完成时间" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-date placeholder="请选择实际完成时间" v-decorator="['actualCompletionTime']" :trigger-change="true" style="width: 100%" />-->
<!--        </a-form-item>-->
<!--        <a-form-item label="产值单位" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-dict-select-tag type="list" v-decorator="['productionUnit']" :trigger-change="true" dictCode="project_manage_investment_scale_unit" placeholder="请选择产值单位" />-->
<!--        </a-form-item>-->
        <a-form-item label="计划产值(万)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['plannedProductionValue', validatorRules.plannedProductionValue]" placeholder="请输入计划产值，单位：万" style="width: 100%" />
        </a-form-item>
        <a-form-item label="实际产值(万)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number disabled v-decorator="['actualProductionValue', validatorRules.actualProductionValue]" placeholder="请输入实际产值，单位：万" style="width: 100%" />
        </a-form-item>
<!--        <a-form-item label="任务状态" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-dict-select-tag type="list" v-decorator="['taskStatus']" :trigger-change="true" dictCode="task_status" placeholder="请选择任务状态" />-->
<!--        </a-form-item>-->
<!--        <a-form-item label="滞后情况" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <j-dict-select-tag type="list" v-decorator="['laggingSituation']" :trigger-change="true" dictCode="lagging_situation" placeholder="请选择滞后情况" />-->
<!--        </a-form-item>-->
        <a-form-item label="滞后原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['laggingReasons']" placeholder="请输入滞后原因" ></a-input>
        </a-form-item>
        <a-form-item label="解决措施" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['solution']" placeholder="请输入解决措施" ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from '@/components/jeecg/JTreeSelect'

  export default {
    name: "ScheduleManagePlanModal",
    components: {
      JDate,
      JDictSelectTag,
      JTreeSelect
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
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
          taskName: {
            rules: [
              {required: true,message: '请输入任务名称'}
            ]
          },
          planStartTime: {
            rules: [
              {required: true,message: '请输入计划开始时间'}
            ]
          },
          planCompletionTime: {
            rules: [
              {required: true,message: '请输入计划结束时间'}
            ]
          },
          plannedProductionValue: {
            rules: [
              {required: true,message: '请输入计划产值'},
              {pattern: /^\d+\.?\d*$/, message: '请输入一个正数!'}
            ]
          }
        },
        url: {
          add: "/sys/scheduleManagePlan/add",
          edit: "/sys/scheduleManagePlan/edit",
        },
        expandedRowKeys:[],
        pidField:"pid"

      }
    },
    created () {
    },
    methods: {
      add (obj) {
        this.edit(obj);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'taskName','planStartTime','planCompletionTime','actualStartTime','actualCompletionTime','productionUnit','plannedProductionValue','actualProductionValue','taskStatus','laggingSituation','laggingReasons','solution','pid'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
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
            let old_pid = this.model[this.pidField]
            let formData = Object.assign(this.model, values);
            let new_pid = this.model[this.pidField]
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                this.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }

        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'taskName','planStartTime','planCompletionTime','actualStartTime','actualCompletionTime','productionUnit','plannedProductionValue','actualProductionValue','taskStatus','laggingSituation','laggingReasons','solution','pid'))
      },
      submitSuccess(formData,flag){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData,flag);
        }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      }


    }
  }
</script>