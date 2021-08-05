<template>
<a-row :gutter="10">
    <a-col :md="5" :sm="24">
      <a-card @click="userclick">
        <div>参建单位</div>
        <div>
          <div v-for="(item,index1) in itemlist" :key="index1" class="itemlist" @click="showVal(item,index1)" :class="{'backColor':index1==currentVal}">
            <div class="dictext">{{item.contractorType_dictText}}</div>
            <div>{{item.contractorName}}</div>
            <img :src="index1==currentVal?require('@/assets/hazardType-point.png'):require('@/assets/blacks.png')" style="width:6px;height:20px;right:26px" alt="" @click.stop="editOut(index1)"/>
            <div class="editdelete" :class="{editshow:editorId==index1}">
              <div @click="addcontractoredit(item)">详情</div>
              <div @click="deleteID(item.id)">删除</div>
            </div>
          </div>
        </div>
        <div class="unitpent" @click="addcontractor">
          <img src="" alt="">
          <div>添加参建单位</div>
        </div>
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
        <a-card>
            <a-row>
              <a-col :span="8" style="display:flex;">
                  <div style="width:30%;margin-top:5px;">参建企业名称</div>
                  <a-input :disabled="true" placeholder=""  v-model="contractorName"></a-input>
              </a-col>
              <a-col :span="8" style="display:flex;">
                  <div style="width:43%;margin-top:5px;text-align:right;">统一社会信用代码</div>
                  <a-input :disabled="true" placeholder=""  v-model="creditCode"></a-input>
              </a-col>
              <a-col :span="8" style="display:flex;">
                 <div style="width:20%;margin-left:20px;margin-top:5px;">企业类别</div>
                  <j-dict-select-tag :disabled="true" type="list" v-model="contractorType" :trigger-change="true" dictCode="contractor_type" placeholder="" style="width:80%;" />
              </a-col>
            </a-row>
            <a-col :span="24" style="display:flex;margin-top:20px;">
                <div style="width:6%;margin-top:5px;text-align:right;margin-right:20px">经营范围</div>
                <textarea :disabled="true" placeholder="" v-model="businessScope"  rows="3" cols="200"></textarea>
            </a-col>
        </a-card>
        <a-card :bordered="false" @click="userclick">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
              <a-row :gutter="24">
              </a-row>
            </a-form>
          </div>
          <!-- 查询区域-END -->

          <!-- 操作按钮区域 -->
          <div class="table-operator">
            <a-button @click="handleAdd()" type="primary" icon="plus">新增</a-button>
            <!-- <a-button type="primary" icon="download" @click="handleExportXls('班组树')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload> -->
            <!-- 高级查询区域 -->
            <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
            </a-dropdown>
          </div>

          <!-- table区域-begin -->
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
              <a style="margin-left: 24px" @click="onClearSelected">清空</a>
            </div>

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

          <teamTree-modal ref="modalForm" @ok="modalFormOk" :contractorId="contractorId"></teamTree-modal>
          <contractor-form ref="modalForm1" @ok="modalFormOk1"></contractor-form>
        </a-card>
    </a-col>
</a-row>
</template>

<script>

  import { getAction, deleteAction } from '@/api/manage'
  import {contractor,contractordelete} from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TeamTreeModal from './modules/TeamTreeModal'
  import ContractorForm from './modules/ContractorForm'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { filterObj } from '@/utils/util';
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: "TeamTreeList",
    mixins:[JeecgListMixin],
    components: {
      TeamTreeModal,
      JSuperQuery,
      ContractorForm
    },
    data () {
      return {
        description: '班组树管理页面',
        // 表头
        columns: [
          {
            title:'班组名称',
            align:"left",
            dataIndex: 'teamName'
          },
          {
            title:'创建人',
            align:"left",
            dataIndex: 'createBy_dictText'
          },
          {
            title:'创建日期',
            align:"left",
            dataIndex: 'createTime'
          },
          {
            title:'是否有子节点',
            align:"left",
            dataIndex: 'hasChild_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/teamTree/teamTree/rootList",
          childList: "/teamTree/teamTree/childList",
          getChildListBatch: "/teamTree/teamTree/getChildListBatch",
          delete: "/teamTree/teamTree/delete",
          deleteBatch: "/teamTree/teamTree/deleteBatch",
          exportXlsUrl: "/teamTree/teamTree/exportXls",
          importExcelUrl: "teamTree/teamTree/importExcel",
        },
        expandedRowKeys:[],
        hasChildrenField:"hasChild",
        pidField:"pid",
        dictOptions: {},
        loadParent: false,
        superFieldList:[],
        itemlist:[],
        editorId:-1,
        contractorName:'', 
        creditCode:'',
        contractorType:'',
        businessScope:'',
        contractorId:'',
        currentVal:0
      }
    },
    created() {
      this.getSuperFieldList();
      this.initDate();
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
      deleteID(val){
        let that=this;
         that.$confirm({
            title:"确认删除",
            content:"是否删除选中数据?",
            onOk: function(){
              contractordelete({id:val}).then(res=>{
                that.initDate();
                if(res.code==200){
                  that.$message.success("删除成功");
                }else{
                  that.$message.warning("删除失败");
                }
              })
            }
          })
      },
      userclick(){
        console.log(99992)
        this.editorId=-1;
      },
      modalFormOk1(){
        this.initDate();
      },
      editOut(val){
        console.log(val)
        this.editorId=val;
      },
      showVal(item,index1){
        this.currentVal=index1;
        console.log(item)
        this.contractorName=item.contractorName
        this.creditCode=item.creditCode
        this.contractorType=item.contractorType
        this.businessScope=item.businessScope
        this.contractorId=item.id
        this.loadData(1,item.id);
      },
      addcontractor(){
         this.$refs.modalForm1.add();
        this.$refs.modalForm1.title = "新增";
        this.$refs.modalForm1.disableSubmit = false;
      },
      addcontractoredit(record){
         this.$refs.modalForm1.edit(record);
        this.$refs.modalForm1.title = "详情";
        this.$refs.modalForm1.disableSubmit = false;
      },
      initDate(){
        let data={relTenantIds:this.$store.state.user.info.relTenantIds}
        contractor(data).then(res=>{
          if(res.code==200){
            this.itemlist=res.result.records
            if(this.itemlist.length>0){
              this.contractorId=this.itemlist[0].id
            }
          }
        })
      },
      loadData(arg,vals){
        if(arg==1){
          this.ipagination.current=1
        }
        this.loading = true
        let params = this.getQueryParams()
        params.hasQuery = 'true'
        if(vals) params=Object.assign(params,{contractorId:vals})
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
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:'sys_user,realname,username'})
        fieldList.push({type:'datetime',value:'createTime',text:'创建日期'})
        fieldList.push({type:'string',value:'pid',text:'父级节点',dictCode:''})
        fieldList.push({type:'string',value:'hasChild',text:'是否有子节点',dictCode:'yn'})
        fieldList.push({type:'string',value:'teamName',text:'班组名称',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped lang="less">
  .itemlist{
    display: flex;
    height: 50px;
    line-height: 50px;
    border-radius: 3px;
    margin:10px auto;
    position: relative;
    cursor: pointer;
    .dictext{
      margin-right: 10px;
      // height: 35px;
      // width: 35px;
    }
    .editdelete{
      position: absolute;
      display: none;
      right: -81px;
      top:0px;
      z-index: 99;
      background: #fff;
      border: 1px solid #e7e7e7;
      width: 55px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
    }
    img{
      position: absolute;
      right: 3px;
      top:14px;
    }
  }
  .unitpent{
    border: 1px solid #e7e7e7;
    height: 43px;
    line-height: 13px;
    text-align: center;
    cursor: pointer;
    margin-top:20px;
  }
  .editshow{
    display: block!important;
  }
  .backColor{
    background: #40a9ff;
  }
</style>