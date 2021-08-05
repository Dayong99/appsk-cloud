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
       <!-- <a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="请输入部门名称"/> -->
      <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
            <a-tree
              checkable
              multiple
              @select="onSelect"
              @check="onCheck"
              @rightClick="rightHandle"
              :selectedKeys="selectedKeys"
              :checkedKeys="checkedKeys"
              :treeData="departTree"
              :checkStrictly="checkStrictly"
              :expandedKeys="iExpandedKeys"
              :autoExpandParent="autoExpandParent"
              @expand="onExpand"/>
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1">添加</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JSwitch from '@/components/jeecg/JSwitch'
  
  import pick from 'lodash.pick'
  import {queryDepartTreeList, searchByKeywords, deleteByDepartId,documencertigier,documencertigierID} from '@/api/api'
  import {deleteAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  // import DepartAuthModal from './modules/DepartAuthModal'


  export default {
    name: "ArchivesTreeModal",
    components: { 
      JSwitch,
      JTreeSelect
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,

        // url: {
        //   add: "/sys/archivesTree/add",
        //   edit: "/sys/archivesTree/edit",
        // },



        iExpandedKeys: [],
        loading: false,
        autoExpandParent: true,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        treeData: [],
        visible: false,
        departTree: [],
        rightClickSelectedKey: '',
        rightClickSelectedOrgCode: '',
        hiding: true,
        model: {},
        dropTrigger: '',
        depart: {},
        disableSubmit: false,
        checkedKeys: [],
        selectedKeys: [],
        autoIncr: 1,
        currSelected: {},

        allTreeKeys:[],
        checkStrictly: true,

        form: this.$form.createForm(this),
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        graphDatasource: {
          nodes: [],
          edges: []
        },
        validatorRules: {
          departName: {rules: [{required: true, message: '请输入机构/部门名称!'}]},
          orgCode: {rules: [{required: true, message: '请输入机构编码!'}]},
          orgCategory: {rules: [{required: true, message: '请输入机构类型!'}]},
          mobile: {rules: [{validator: this.validateMobile}]}
        },
        url: {
          delete: '/sys/sysDepart/delete',
          edit: '/sys/sysDepart/edit',
          deleteBatch: '/sys/sysDepart/deleteBatch',
          exportXlsUrl: "sys/sysDepart/exportXls",
          importExcelUrl: "sys/sysDepart/importExcel",
        },
        orgCategoryDisabled:false,
        entsid:''
      }
    },
    created () {
      this.currFlowId = this.$route.params.id
      this.currFlowName = this.$route.params.name
    },
    methods: {
      add (obj) {
        this.entsid=obj
        this.loadData();
        // this.loadTree()
        this.edit(obj);
        this.getdocumencertigierID()
      },
      // 获取已勾选的部门id
      getdocumencertigierID(){
        let data={
          relTenantIds:this.$store.state.user.info.relTenantIds,
          archivesTreeId:this.entsid
        }
        documencertigierID(data).then(res=>{
          if(res.success){
            this.checkedKeys=res.result
          } 
        })
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          // this.form.setFieldsValue(pick(this.model,'pid','name','remarks','sort','isAllowDelete'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        console.log(111)

          var ids = ''
          for (var a = 0; a < this.checkedKeys.length; a++) {
            ids += this.checkedKeys[a] + ','
          }
          let data={
            relTenantIds:this.$store.state.user.info.relTenantIds,
            archivesTreeId:this.entsid,
            depIds:ids
          }
          let that=this;
          documencertigier(data).then(res=>{
              if (res.success) {
                  that.$message.success(res.message)
                   that.$emit('ok');
                } else {
                  that.$message.warning(res.message)
                }
          }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          // var that = this
          // this.$confirm({
          //   title: '确认',
          //   content: '保存资料部门授权?',
          //   onOk: function () {
              
          //     deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
          //       if (res.success) {
          //         that.$message.success(res.message)
          //         that.loadTree()
          //         that.onClearSelected()
          //       } else {
          //         that.$message.warning(res.message)
          //       }
          //     })
          //   }
          // })
   
        // const that = this;
        // // 触发表单验证
        // this.form.validateFields((err, values) => {
        //   if (!err) {
        //     that.confirmLoading = true;
        //     let httpurl = '';
        //     let method = '';
        //     if(!this.model.id){
        //       httpurl+=this.url.add;
        //       method = 'post';
        //     }else{
        //       httpurl+=this.url.edit;
        //        method = 'put';
        //     }
        //     let old_pid = this.model[this.pidField]
        //     let formData = Object.assign(this.model, values);
        //     let new_pid = this.model[this.pidField]
        //     console.log("表单提交数据",formData)
        //     httpAction(httpurl,formData,method).then((res)=>{
        //       if(res.success){
        //         that.$message.success(res.message);
        //         this.$emit('ok');
        //       }else{
        //         that.$message.warning(res.message);
        //       }
        //     }).finally(() => {
        //       that.confirmLoading = false;
        //       that.close();
        //     })
        //   }
         
        // })
      },
      handleCancel () {
        this.close()
      },
      // popupCallback(row){
      //   this.form.setFieldsValue(pick(row,'pid','name','remarks','sort','isAllowDelete'))
      // },
      // submitSuccess(formData,flag){
      //   if(!formData.id){
      //     let treeData = this.$refs.treeSelect.getCurrTreeData()
      //     this.expandedRowKeys=[]
      //     this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
      //     this.$emit('ok',formData,this.expandedRowKeys.reverse());
      //   }else{
      //     this.$emit('ok',formData,flag);
      //   }
      // },
      loadData() {
        this.refresh();
      },
      loadTree() {
        var that = this
        that.treeData = []
        that.departTree = []
        queryDepartTreeList().then((res) => {
          if (res.success) {
            //部门全选后，再添加部门，选中数量增多
            this.allTreeKeys = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.treeData.push(temp)
              that.departTree.push(temp)
              that.setThisExpandedKeys(temp)
              that.getAllKeys(temp);
              // console.log(temp.id)
            }
            this.loading = false
          }
        })
      },
      setThisExpandedKeys(node) {
        if (node.children && node.children.length > 0) {
          this.iExpandedKeys.push(node.key)
          for (let a = 0; a < node.children.length; a++) {
            this.setThisExpandedKeys(node.children[a])
          }
        }
      },
      refresh() {
        this.loading = true
        this.loadTree()
      },
      // 右键操作方法
      rightHandle(node) {
        this.dropTrigger = 'contextmenu'
        console.log(node.node.eventKey)
        this.rightClickSelectedKey = node.node.eventKey
        this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.iExpandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      backFlowList() {
        this.$router.back(-1)
      },
      // 右键点击下拉框改变事件
      dropStatus(visible) {
        if (visible == false) {
          this.dropTrigger = ''
        }
      },
      // 右键店家下拉关闭下拉框
      closeDrop() {
        this.dropTrigger = ''
      },
      addRootNode() {
        this.$refs.nodeModal.add(this.currFlowId, '')
      },
      batchDel: function () {
        console.log(this.checkedKeys)
        if (this.checkedKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
        } else {
          var ids = ''
          for (var a = 0; a < this.checkedKeys.length; a++) {
            ids += this.checkedKeys[a] + ','
          }
          var that = this
          this.$confirm({
            title: '确认删除',
            content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
            onOk: function () {
              deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadTree()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },
      onSearch(value) {
        let that = this
        if (value) {
          searchByKeywords({keyWord: value}).then((res) => {
            if (res.success) {
              that.departTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.departTree.push(temp)
              }
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.loadTree()
        }

      },
      nodeModalOk() {
        this.loadTree()
      },
      nodeModalClose() {
      },
      hide() {
        console.log(111)
        this.visible = false
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info)
        this.hiding = false
        //this.checkedKeys = checkedKeys.checked
        // <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
        if(this.checkStrictly){
          this.checkedKeys = checkedKeys.checked;
        }else{
          this.checkedKeys = checkedKeys
        }
        // <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
      },
      onSelect(selectedKeys, e) {
        console.log('selected', selectedKeys, e)
        this.hiding = false
        let record = e.node.dataRef
        console.log('onSelect-record', record)
        this.currSelected = Object.assign({}, record)
        this.model = this.currSelected
        this.selectedKeys = [record.key]
        this.model.parentId = record.parentId
        this.setValuesToForm(record)
        this.$refs.departAuth.show(record.id);

      },
      // 触发onSelect事件时,为部门树右侧的form表单赋值
      setValuesToForm(record) {
        if(record.orgCategory == '1'){
          this.orgCategoryDisabled = true;
        }else{
          this.orgCategoryDisabled = false;
        }
        this.$nextTick(() => {
          this.form.getFieldDecorator('fax', {initialValue: ''})
          this.form.setFieldsValue(pick(record, 'departName','orgCategory', 'orgCode', 'departOrder', 'mobile', 'fax', 'address', 'memo'))
        })
      },
      getCurrSelectedTitle() {
        return !this.currSelected.title ? '' : this.currSelected.title
      },
      onClearSelected() {
        this.hiding = true
        this.checkedKeys = []
        this.currSelected = {}
        this.form.resetFields()
        this.selectedKeys = []
        this.$refs.departAuth.departId = ''
      },
      handleNodeTypeChange(val) {
        this.currSelected.nodeType = val
      },
      notifyTriggerTypeChange(value) {
        this.currSelected.notifyTriggerType = value
      },
      receiptTriggerTypeChange(value) {
        this.currSelected.receiptTriggerType = value
      },
      submitCurrForm() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.currSelected.id) {
              this.$message.warning('请点击选择要修改部门!')
              return
            }

            let formData = Object.assign(this.currSelected, values)
            console.log('Received values of form: ', formData)
            httpAction(this.url.edit, formData, 'put').then((res) => {
              if (res.success) {
                this.$message.success('保存成功!')
                this.loadTree()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      emptyCurrForm() {
        this.form.resetFields()
      },
      nodeSettingFormSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
      },
      openSelect() {
        this.$refs.sysDirectiveModal.show()
      },
      handleAdd(num) {
        if (num == 1) {
          this.$refs.departModal.add()
          this.$refs.departModal.title = '新增'
        } else if (num == 2) {
          let key = this.currSelected.key
          if (!key) {
            this.$message.warning('请先点击选中上级部门！')
            return false
          }
          this.$refs.departModal.add(this.selectedKeys)
          this.$refs.departModal.title = '新增'
        } else {
          this.$refs.departModal.add(this.rightClickSelectedKey)
          this.$refs.departModal.title = '新增'
        }
      },
      handleDelete() {
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除此部门以及子节点数据吗?',
          onOk: function () {
            deleteByDepartId({id: that.rightClickSelectedKey}).then((resp) => {
              if (resp.success) {
                //删除成功后，去除已选中中的数据
                that.checkedKeys.splice(that.checkedKeys.findIndex(key => key === that.rightClickSelectedKey), 1);
                that.$message.success('删除成功!')
                that.loadTree()
                //删除后同步清空右侧基本信息内容
                let orgCode=that.form.getFieldValue("orgCode");
                if(orgCode && orgCode === that.rightClickSelectedOrgCode){
                  that.onClearSelected()
                }
              } else {
                that.$message.warning('删除失败!')
              }
            })
          }
        })
      },
      selectDirectiveOk(record) {
        console.log('选中指令数据', record)
        this.nodeSettingForm.setFieldsValue({directiveCode: record.directiveCode})
        this.currSelected.sysCode = record.sysCode
      },
      getFlowGraphData(node) {
        this.graphDatasource.nodes.push({
          id: node.id,
          text: node.flowNodeName
        })
        if (node.children.length > 0) {
          for (let a = 0; a < node.children.length; a++) {
            let temp = node.children[a]
            this.graphDatasource.edges.push({
              source: node.id,
              target: temp.id
            })
            this.getFlowGraphData(temp)
          }
        }
      },
     // <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
      expandAll () {
        this.iExpandedKeys = this.allTreeKeys
      },
      closeAll () {
        this.iExpandedKeys = []
      },
      checkALL () {
        this.checkStriccheckStrictlytly = false
        this.checkedKeys = this.allTreeKeys
      },
      cancelCheckALL () {
        //this.checkedKeys = this.defaultCheckedKeys
        this.checkedKeys = []
      },
      switchCheckStrictly (v) {
        if(v==1){
          this.checkStrictly = false
        }else if(v==2){
          this.checkStrictly = true
        }
      },
      getAllKeys(node) {
        // console.log('node',node);
        this.allTreeKeys.push(node.key)
        if (node.children && node.children.length > 0) {
          for (let a = 0; a < node.children.length; a++) {
            this.getAllKeys(node.children[a])
          }
        }
      }
      
      
    }
  }
</script>