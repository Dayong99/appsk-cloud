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
      <a-form :form="form">
        <a-form-item label="父级节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-tree-select
            ref="treeSelect"
            placeholder="请选择父级节点"
            v-decorator="['pid']"
            dict="aoz_person_team_tree,team_name,id"
            pidField="pid"
            pidValue="0"
            hasChildField="has_child"
            :disabled=" canEdit != undefined"
          >
          </j-tree-select>
        </a-form-item>
        <a-form-item label="班组名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['teamName']" placeholder="请输入班组名称"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JTreeSelect from '@/components/jeecg/JTreeSelect'

export default {
  props: {
    contractorId: {
      type: String,
    },
  },
  name: 'TeamTreeModal',
  components: {
    JTreeSelect,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      title: '操作',
      width: 800,
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
      validatorRules: {},
      url: {
        add: '/teamTree/teamTree/add',
        edit: '/teamTree/teamTree/edit',
      },
      expandedRowKeys: [],
      pidField: 'pid',
      canEdit: ''
    }
  },
  created() {},
  methods: {
    add(obj) {
      this.edit(obj)
    },
    edit(record) {
      let recordStr = JSON.stringify(record);
      if(recordStr == '{}'){
        this.canEdit = '';
      }
      this.canEdit = record;
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'createBy', 'createTime', 'pid', 'hasChild', 'teamName'))
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
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let old_pid = this.model[this.pidField]
          let formData = Object.assign(this.model, values)

          let formDatas = Object.assign(formData, {
            relTenantIds: this.$store.state.user.newValue,
            contractorId: this.contractorId,
          })
          console.log(formDatas)
          if (!formDatas.contractorId) {
            this.$message.warning('请选择参建单位')
            this.confirmLoading = false
            return false
          } else {
            let new_pid = this.model[this.pidField]

            httpAction(httpurl, formDatas, method)
              .then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  this.$emit('ok')
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
                that.close()
              })
          }
        }
      })
    },
    handleCancel() {
      this.close()
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'createBy', 'createTime', 'pid', 'hasChild', 'teamName'))
    },
    submitSuccess(formData, flag) {
      if (!formData.id) {
        let treeData = this.$refs.treeSelect.getCurrTreeData()
        this.expandedRowKeys = []
        this.getExpandKeysByPid(formData[this.pidField], treeData, treeData)
        this.$emit('ok', formData, this.expandedRowKeys.reverse())
      } else {
        this.$emit('ok', formData, flag)
      }
    },
    getExpandKeysByPid(pid, arr, all) {
      if (pid && arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].key == pid) {
            this.expandedRowKeys.push(arr[i].key)
            this.getExpandKeysByPid(arr[i]['parentId'], all, all)
          } else {
            this.getExpandKeysByPid(pid, arr[i].children, all)
          }
        }
      }
    },
  },
}
</script>