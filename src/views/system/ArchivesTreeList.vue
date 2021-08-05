<template>
   <a-row :gutter="10">
    <a-col :md="5" :sm="24">
     
      <a-card :bordered="false">
          <a-row>
            <a-button @click="handleAdd(1)" type="primary" v-has="'archivesTree:add'">添加</a-button>
            <!-- <a-button @click="handleAdd(2)" type="primary">添加下级</a-button> -->
            <!-- <a-button title="删除多条数据" @click="batchDel" style="margin-left:14px;" type="default">批量删除</a-button> -->
          </a-row>
          <a-alert type="info" :showIcon="true" style="margin-top:14px;">
            <div slot="message">
              当前选择：<span v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</span>
              <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
            </div>
          </a-alert>
         <a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="请输入资料名称"/>
         <template>
          <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
            <span style="user-select: none">
        <a-tree
          
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
              <a-menu-item @click="handleAdd(3)" key="1" v-has="'archivesTree:addChild'">添加下级</a-menu-item>
              <a-menu-item @click="handleDelete" key="2" v-has="'archivesTree:delete'">删除</a-menu-item>
              <a-menu-item @click="certigier()" v-has="'archivesTree:authorize'">授权</a-menu-item>
              <a-menu-item @click="editcp()" v-has="'archivesTree:edit'">编辑</a-menu-item>
              <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      <archivesTree-modal ref="modalForm" @ok="modalFormOk"></archivesTree-modal> 
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
      <a-card :bordered="false" v-if="cenpt">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="文件名称">
                  <j-input placeholder="请输入文件名称" v-model="queryParam.fileName"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="文件格式">
                  <j-dict-select-tag placeholder="请选择文件格式" v-model="queryParam.fileType" dictCode="file_format"/>
                </a-form-item>
              </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :xl="12" :lg="12" :md="12" :sm="24">
                <a-form-item label="上传时间">
                  <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
                  <span class="query-group-split-cust"></span>
                  <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
                </a-form-item>
              </a-col>
            </template>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery1('')" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
                  <a @click="handleToggleSearch" style="margin-left: 8px">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 查询区域-END -->

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd1" type="primary" icon="plus" v-has="'archives:add'">新增</a-button>
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('协同资料库')">导出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload> -->
          <!-- 高级查询区域 -->
          <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
          <a-dropdown v-if="selectedRowKeys1.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel1" v-has="'archives:batchDel1'"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px" v-has="'archives:batch'"> 批量操作 <a-icon type="down"/></a-button>
          </a-dropdown>
        </div>
        <div>
          <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys1.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div> -->

          <a-table
            ref="table"
            size="middle"
            :scroll="{x:true}"
            bordered
            rowKey="id"
            :columns="columns1"
            :dataSource="dataSource1"
            :pagination="ipagination1"
            :loading="loading"
            :rowSelection="{selectedRowKeys1: selectedRowKeys1, onChange: onSelectChange1}"
            class="j-table-force-nowrap"
            @change="handleTableChange1"
            v-bind="tableProps1">

            <template slot="htmlSlot" slot-scope="text">
              <div v-html="text"></div>
            </template>
            <template slot="imgSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
              <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
            </template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
              <a-button
                v-else
                :ghost="true"
                type="primary"
                icon="download"
                size="small"
                @click="downloadFile(text)">
                下载
              </a-button>
            </template>

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit1(record)" v-has="'archives:edit'">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleDetail1(record)">详情</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a :href=arrpng @click="downpng(record)" v-has="'archives:download'">下载</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete1(record.id)">
                      <a v-has="'archives:delete'">删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>

          </a-table>
        </div>
        <archives-modal ref="modalForm1" @ok="modalFormOk1"></archives-modal>
        <document-tree ref="departModal" @ok="loadTree"></document-tree>
      </a-card>
      <a-card v-if="!cenpt">
        <a-empty>
          <span slot="description"> 暂无权限! </span>
        </a-empty>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>

  import { getAction, deleteAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { JeecgListMixin1 } from '@/mixins/JeecgListMixin1'
  import ArchivesTreeModal from './modules/ArchivesTreeModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { filterObj } from '@/utils/util';
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import { mixinDevice } from '@/utils/mixin'
  import ArchivesModal from './modules/ArchivesModal'
  import JInput from '@/components/jeecg/JInput.vue'

  import DepartAuthModal from './modules/DepartAuthModal'
  import DocumentTree from './modules/DocumentTree'
  import pick from 'lodash.pick'
  import {documenTreeList, documenByDepartId} from '@/api/api'
  import {httpAction} from '@/api/manage'


  export default {
    name: "ArchivesTreeList",
    mixins:[JeecgListMixin,mixinDevice,JeecgListMixin1],
    components: {
      ArchivesModal,
      JSuperQuery,
      ArchivesTreeModal,
      DepartAuthModal,
      DocumentTree
    },
    data () {
      return {
        description: '协同资料库Tree管理页面',
        disableMixinCreated:true,
        // 表头
        columns: [
          {
            title:'名称',
            align:"left",
            dataIndex: 'name'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        cenpt:true,
        columns1: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'文件类型',
            align:"center",
            dataIndex: 'type_dictText'
          },
          {
            title:'文件名称',
            align:"center",
            dataIndex: 'fileName'
          },
          {
            title:'文件格式',
            align:"center",
            dataIndex: 'fileType'
          },
          {
            title:'文件大小',
            align:"center",
            dataIndex: 'fileSize'
          },
          {
            title:'上传人',
            align:"center",
            dataIndex: 'createBy_dictText'
          },
          {
            title:'上传时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url1: {
          list: "/sys/archives/list",
          delete: "/sys/archives/delete",
          deleteBatch: "/sys/archives/deleteBatch",
          exportXlsUrl: "/sys/archives/exportXls",
          importExcelUrl: "sys/archives/importExcel",
          
        },
        expandedRowKeys:[],
        hasChildrenField:"hasChild",
        pidField:"pid",
        dictOptions: {},
        loadParent: false,
        superFieldList:[],


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
          delete: '/sys/archivesTree/delete',
          edit: '/sys/archivesTree/edit',
          deleteBatch: '/sys/archivesTree/deleteBatch',
          exportXlsUrl: "sys/archivesTree/exportXls",
          importExcelUrl: "sys/archivesTree/importExcel",
        },
         // url: {
        //   list: "/sys/archivesTree/rootList",
        //   childList: "/sys/archivesTree/childList",
        //   getChildListBatch: "/sys/archivesTree/getChildListBatch",
        //   delete: "/sys/archivesTree/delete",
        //   deleteBatch: "/sys/archivesTree/deleteBatch",
        //   exportXlsUrl: "/sys/archivesTree/exportXls",
        //   importExcelUrl: "sys/archivesTree/importExcel",
        // },
        orgCategoryDisabled:false,
        arrpng:"",
        contents:{
          id:"",
          isAllowDelete:"",
          isLeaf:"",
          name:"",
          pid:"",
          relTenantIds:"",
          remarks:"",
          sort:""
        }
      }
    },
    created() {
      this.getSuperFieldList();
      this.getSuperFieldList1();
      this.loadTree();
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      tableProps() {
        let _this = this
        return {
          // 列表项是否可选择
          rowSelection: {
            selectedRowKeys: _this.selectedRowKeys,
            onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
          }
        }
      },
      tableProps1() {
        let _this = this
        return {
          // 列表项是否可选择
          rowSelection: {
            selectedRowKeys1: _this.selectedRowKeys1,
            onChange: (selectedRowKeys1) => _this.selectedRowKeys1 = selectedRowKeys1
          }
        }
      }
    },
    methods: {
      downpng(png){
        console.log(png)
        this.arrpng=png.filePath+"?response-content-type=application/octet-stream"
      },
      loadData(arg){
         this.refresh();
        if(arg==1){
          this.ipagination.current=1
        }
        this.loading = true
        let params = this.getQueryParams()
        params.hasQuery = 'true'
        if(this.url.list=='/sys/archivesTree/rootList'){
          delete params.column;
          delete params.order;
        }
        getAction(this.url.list,params).then(res=>{
          if(res.success){
            let result = res.result
            if(Number(result.total)>0){
              this.ipagination.total = Number(result.total)
              this.dataSource = this.getDataByResult(res.result.records)
              return this.loadDataByExpandedRows(this.dataSource)
            }else{
              this.ipagination.total=0
              this.dataSource=[]
            }
          }else{
            this.$message.warning(res.message)
          }
        }).finally(()=>{
          this.loading = false
        })
      },
      // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
      loadDataByExpandedRows(dataList) {
        if (this.expandedRowKeys.length > 0) {
          return getAction(this.url.getChildListBatch,{ parentIds: this.expandedRowKeys.join(',') }).then(res=>{
            if (res.success && res.result.records.length>0) {
              //已展开的数据批量子节点
              let records = res.result.records
              const listMap = new Map();
              for (let item of records) {
                let pid = item[this.pidField];
                if (this.expandedRowKeys.join(',').includes(pid)) {
                 let mapList = listMap.get(pid);
                  if (mapList == null) {
                    mapList = [];
                  }
                  mapList.push(item);
                  listMap.set(pid, mapList);
                }
              }
              let childrenMap = listMap;
              let fn = (list) => {
                if(list) {
                  list.forEach(data => {
                    if (this.expandedRowKeys.includes(data.id)) {
                      data.children = this.getDataByResult(childrenMap.get(data.id))
                      fn(data.children)
                    }
                  })
                }
              }
              fn(dataList)
            }
          })
        } else {
          return Promise.resolve()
        }
      },
      getQueryParams(arg) {
        //获取查询条件
        let sqp = {}
        let param = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        if(arg){
          param = Object.assign(sqp, this.isorter ,this.filters);
        }else{
          param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        }
        if(JSON.stringify(this.queryParam) === "{}" || arg){
          param.hasQuery = 'false'
        }else{
          param.hasQuery = 'true'
        }
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      searchReset() {
        //重置
        this.expandedRowKeys = []
        this.queryParam = {}
        this.loadData(1);
      },
      getDataByResult(result){
        if(result){
          return result.map(item=>{
            //判断是否标记了带有子节点
            if(item[this.hasChildrenField]=='1'){
              let loadChild = { id: item.id+'_loadChild', name: 'loading...', isLoading: true }
              item.children = [loadChild]
            }
            return item
          })
        }
      },
      handleExpand(expanded, record){
        // 判断是否是展开状态
        if (expanded) {
          this.expandedRowKeys.push(record.id)
          if (record.children.length>0 && record.children[0].isLoading === true) {
            let params = this.getQueryParams(1);//查询条件
            params[this.pidField] = record.id
            params.hasQuery = 'false'
            params.superQueryParams=""
            getAction(this.url.childList,params).then((res)=>{
              if(res.success){
                if(res.result.records){
                  record.children = this.getDataByResult(res.result.records)
                  this.dataSource = [...this.dataSource]
                }else{
                  record.children=''
                  record.hasChildrenField='0'
                }
              }else{
                this.$message.warning(res.message)
              }
            })
          }
        }else{
          let keyIndex = this.expandedRowKeys.indexOf(record.id)
          if(keyIndex>=0){
            this.expandedRowKeys.splice(keyIndex, 1);
          }
        }
      },
      handleAddChild(record){
        this.loadParent = true
        let obj = {}
        obj[this.pidField] = record['id']
        this.$refs.modalForm.add(obj);
      },
      handleDeleteNode(id) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
             that.loadData(1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      // handleDelete1(id){
      //   if(!this.url1.delete){
      //     this.$message.error("请设置url.delete属性!")
      //     return
      //   }
      //   var that = this;
      //   deleteAction(that.url1.delete, {id: id}).then((res) => {
      //     if (res.success) {
      //        that.loadData(1)
      //     } else {
      //       that.$message.warning(res.message);
      //     }
      //   });
      // },
      // batchDel(){
      //   if(this.selectedRowKeys.length<=0){
      //     this.$message.warning('请选择一条记录！');
      //     return false;
      //   }else{
      //     let ids = "";
      //     let that = this;
      //     that.selectedRowKeys.forEach(function(val) {
      //       ids+=val+",";
      //     });
      //     that.$confirm({
      //       title:"确认删除",
      //       content:"是否删除选中数据?",
      //       onOk: function(){
      //         that.handleDeleteNode(ids)
      //         that.onClearSelected();
      //       }
      //     });
      //   }
      // },
      // batchDel1(){
      //   if(this.selectedRowKeys1.length<=0){
      //     this.$message.warning('请选择一条记录！');
      //     return false;
      //   }else{
      //     let ids = "";
      //     let that = this;
      //     that.selectedRowKeys1.forEach(function(val) {
      //       ids+=val+",";
      //     });
      //     that.$confirm({
      //       title:"确认删除",
      //       content:"是否删除选中数据?",
      //       onOk: function(){
      //         that.handleDelete1(ids)
      //       }
      //     });
      //   }
      // },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'pid',text:'父级节点',dictCode:''})
        fieldList.push({type:'string',value:'name',text:'名称',dictCode:''})
        fieldList.push({type:'string',value:'remarks',text:'备注',dictCode:''})
        fieldList.push({type:'double',value:'sort',text:'排序',dictCode:''})
        fieldList.push({type:'switch',value:'isAllowDelete',text:'是否允许删除'})
        this.superFieldList = fieldList
      },
      getSuperFieldList1(){
        let fieldList=[];
        fieldList.push({type:'string',value:'archivesTreeId',text:'资料库111',dictCode:'aoz_sys_archives_tree,name,id'})
        fieldList.push({type:'string',value:'type',text:'文件类型',dictCode:'file_belong_type'})
        fieldList.push({type:'string',value:'fileName',text:'文件名称',dictCode:''})
        fieldList.push({type:'string',value:'filePath',text:'文件',dictCode:''})
        fieldList.push({type:'string',value:'fileType',text:'文件格式',dictCode:''})
        fieldList.push({type:'string',value:'fileSize',text:'文件大小',dictCode:''})
        fieldList.push({type:'string',value:'remarks',text:'简介',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'上传人',dictCode:'sys_user,realname,username'})
        fieldList.push({type:'datetime',value:'createTime',text:'上传时间'})
        this.superFieldList = fieldList
      },
      click(record, index){
        return {
            on: {
               click: () => {
                    console.log(record,index)
                    this.searchQuery1(record.id)
               }
            }
        }
      },
      loadTree() {
        var that = this
        that.treeData = []
        that.departTree = []
        documenTreeList().then((res) => {
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
        console.log(node)
        this.dropTrigger = 'contextmenu'
        console.log(node.node.eventKey)
        this.rightClickSelectedKey = node.node.eventKey
        this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
        this.contents.id=node.node.eventKey
        this.contents.isAllowDelete=node.node.dataRef.isAllowDelete
        this.contents.isLeaf=node.node.dataRef.isLeaf
        this.contents.name=node.node.dataRef.name
        this.contents.pid=node.node.dataRef.pid
        this.contents.relTenantIds=node.node.dataRef.relTenantIds
        this.contents.remarks=node.node.dataRef.remarks
        this.contents.sort=node.node.dataRef.sort

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
          documenTreeList({name: value}).then((res) => {
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
        // this.hiding = false
        let record = e.node.dataRef
        console.log('onSelect-record', record)
        this.currSelected = Object.assign({}, record)
        this.model = this.currSelected
        this.selectedKeys = [record.key]
        this.model.parentId = record.parentId
        // this.setValuesToForm(record)
        console.log(record)
        if(record.hasPermiss){
          this.cenpt=true;
          this.searchQuery1(record.id)
        }else{
          this.cenpt=false;
          // this.$message.error("暂无权限")
        }
        // this.$refs.departAuth.show(record.id);
        

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
        console.log('this.currSelected.title',this.currSelected.title)
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
      editcp() {
        console.log(this.contents)
        this.$refs.departModal.add(this.contents)
        this.$refs.departModal.title = '编辑'
        // console.log("11111111111111")
        // console.log(this.model)
        // if(JSON.stringify(this.model)=='{}'){
        //   this.$message.warning('请先点击选中部门！')
        // }else{
        //     if(this.rightClickSelectedKey!=this.model.id){
        //        this.$message.warning('请编辑选中部门！')
        //     }else{
              
        //     }
        // }
     
      },
      handleDelete() {
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除此部门以及子节点数据吗?',
          onOk: function () {
            documenByDepartId({id: that.rightClickSelectedKey}).then((resp) => {
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
                that.$message.warning(resp.message)
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
      },
      // 授权
      certigier(){
        this.$refs.modalForm.add(this.rightClickSelectedKey);
        this.$refs.modalForm.title = "授权";
        this.$refs.modalForm.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  /* @import '~@assets/less/common.less'; */
   .ant-card-body .table-operator {
    margin: 15px;
  }

  .anty-form-btn {
    width: 100%;
    text-align: center;
  }

  .anty-form-btn button {
    margin: 0 5px;
  }

  .anty-node-layout .ant-layout-header {
    padding-right: 0
  }

  .header {
    padding: 0 8px;
  }

  .header button {
    margin: 0 3px
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }

  #app .desktop {
    height: auto !important;
  }

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .drawer-bootom-button {
    /*position: absolute;*/
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: left;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>