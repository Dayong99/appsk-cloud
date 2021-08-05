<template>
   <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
         <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :xl="15" :lg="8" :md="8" :sm="24">
                <a-form-item label="名称">
                  <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>
        </div>
        <div>
          <a-table
            ref="table"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :expandedRowKeys="expandedRowKeys"
            @change="handleTableChange"
            @expand="handleExpand"
            v-bind="tableProps">

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
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleAddChild(record)">添加下级</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteNode(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>

          </a-table>
        </div>
      <archivesTree-modal ref="modalForm" @ok="modalFormOk"></archivesTree-modal>
      </a-card>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
               <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery1" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
                </span>
            </a-row>
          </a-form>
        </div>
        <!-- 查询区域-END -->

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd1" type="primary" icon="plus">新增</a-button>
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('协同资料库')">导出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload> -->
          <!-- 高级查询区域 -->
          <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel1"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>
        </div>
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

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
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange1}"
            class="j-table-force-nowrap"
            @change="handleTableChange1">

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
              <a @click="handleEdit1(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleDetail1(record)">详情</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete1(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>

          </a-table>
        </div>
        <archives-modal ref="modalForm1" @ok="modalFormOk1"></archives-modal>
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

  export default {
    name: "ArchivesTreeList",
    mixins:[JeecgListMixin,mixinDevice,JeecgListMixin1],
    components: {
      ArchivesModal,
      JSuperQuery,
      ArchivesTreeModal
    },
    data () {
      return {
        description: '协同资料库Tree管理页面',
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
        columns1: [
          {
            title: '#',
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
            dataIndex: 'createBy'
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
        url: {
          list: "/sys/archivesTree/rootList",
          childList: "/sys/archivesTree/childList",
          getChildListBatch: "/sys/archivesTree/getChildListBatch",
          delete: "/sys/archivesTree/delete",
          deleteBatch: "/sys/archivesTree/deleteBatch",
          exportXlsUrl: "/sys/archivesTree/exportXls",
          importExcelUrl: "sys/archivesTree/importExcel",
        },
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
      }
    },
    created() {
      this.getSuperFieldList();
      this.getSuperFieldList1();
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
      }
    },
    methods: {
      loadData(arg){
        if(arg==1){
          this.ipagination.current=1
        }
        this.loading = true
        let params = this.getQueryParams()
        params.hasQuery = 'true'
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
      batchDel(){
        if(this.selectedRowKeys.length<=0){
          this.$message.warning('请选择一条记录！');
          return false;
        }else{
          let ids = "";
          let that = this;
          that.selectedRowKeys.forEach(function(val) {
            ids+=val+",";
          });
          that.$confirm({
            title:"确认删除",
            content:"是否删除选中数据?",
            onOk: function(){
              that.handleDeleteNode(ids)
              that.onClearSelected();
            }
          });
        }
      },
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
      }
    }
  }
</script>
<style scoped>
  /* @import '~@assets/less/common.less'; */
</style>