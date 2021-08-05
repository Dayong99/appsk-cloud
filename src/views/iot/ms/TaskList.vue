<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="站名">
              <j-input placeholder="请输入站名" v-model="queryParam.stationId"></j-input>
            </a-form-item>
          </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="任务名称">
              <j-input placeholder="请输入任务名称" v-model="queryParam.taskName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('拌合站任务表')">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

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
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>

    <task-modal ref="modalForm" @ok="modalFormOk"></task-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TaskModal from './modules/TaskModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'TaskList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      TaskModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '拌合站任务表管理页面',
        // 表头
        columns: [
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
            title:'站名',
            align:"center",
            dataIndex: 'stationId_dictText'
          },
          {
            title:'任务名称',
            align:"center",
            dataIndex: 'taskName'
          },
          // {
          //   title:'合同号',
          //   align:"center",
          //   dataIndex: 'orderId'
          // },
          // {
          //   title:'合同明细号',
          //   align:"center",
          //   dataIndex: 'itemId'
          // },
          // {
          //   title:'调度员号',
          //   align:"center",
          //   dataIndex: 'employeeId'
          // },
          {
            title:'计划时间',
            align:"center",
            dataIndex: 'planDate'
          },
          {
            title:'工程名称',
            align:"center",
            dataIndex: 'projectName'
          },
          {
            title:'施工单位',
            align:"center",
            dataIndex: 'projectCmpy'
          },
          {
            title:'送货地址',
            align:"center",
            dataIndex: 'shipToAdd1'
          },
          {
            title:'配比编号',
            align:"center",
            dataIndex: 'recipeNo'
          },
          {
            title:'施工部位',
            align:"center",
            dataIndex: 'projectPart'
          },
          {
            title:'浇注方式',
            align:"center",
            dataIndex: 'workMethod'
          },
          {
            title:'累计车次',
            align:"center",
            dataIndex: 'outCount'
          },
          {
            title:'计划方量',
            align:"center",
            dataIndex: 'planCount'
          },
          {
            title:'完成方量',
            align:"center",
            dataIndex: 'endCount'
          },
          {
            title:'运距',
            align:"center",
            dataIndex: 'distance'
          },
          // {
          //   title:'大石料(G1)含水率',
          //   align:"center",
          //   dataIndex: 'dsl'
          // },
          // {
          //   title:'中石料(G2)含水率',
          //   align:"center",
          //   dataIndex: 'zsl'
          // },
          // {
          //   title:'小石料(S2)含水率',
          //   align:"center",
          //   dataIndex: 'xsl'
          // },
          // {
          //   title:'沙子(S1)含水率',
          //   align:"center",
          //   dataIndex: 'sz'
          // },
          // {
          //   title:'沙子1含水率',
          //   align:"center",
          //   dataIndex: 'sz1'
          // },
          // {
          //   title:'沙子2含水率',
          //   align:"center",
          //   dataIndex: 'sz2'
          // },
          // {
          //   title:'水泥编号',
          //   align:"center",
          //   dataIndex: 'cementId'
          // },
          {
            title:'备注',
            align:"center",
            dataIndex: 'memo2'
          },
          // {
          //   title:'任务状态：1 使用 | 0 停用',
          //   align:"center",
          //   dataIndex: 'ustate'
          // },
          // {
          //   title:'合同名',
          //   align:"center",
          //   dataIndex: 'customerName'
          // },
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
          list: "/ms/task/list",
          delete: "/ms/task/delete",
          deleteBatch: "/ms/task/deleteBatch",
          exportXlsUrl: "/ms/task/exportXls",
          importExcelUrl: "ms/task/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
        isorter:{
          column: 'planDate',
          order: 'desc',
        },
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'stationId',text:'站名',dictCode:'aoz_device,device_name,device_number'})
        fieldList.push({type:'string',value:'taskName',text:'任务名称',dictCode:''})
        fieldList.push({type:'string',value:'orderId',text:'合同号',dictCode:''})
        fieldList.push({type:'string',value:'itemId',text:'合同明细号',dictCode:''})
        fieldList.push({type:'string',value:'employeeId',text:'调度员号',dictCode:''})
        fieldList.push({type:'datetime',value:'planDate',text:'计划时间'})
        fieldList.push({type:'int',value:'outCount',text:'累计车次',dictCode:''})
        fieldList.push({type:'double',value:'planCount',text:'计划方量',dictCode:''})
        fieldList.push({type:'double',value:'endCount',text:'完成方量',dictCode:''})
        fieldList.push({type:'double',value:'dsl',text:'大石料(G1)含水率',dictCode:''})
        fieldList.push({type:'double',value:'zsl',text:'中石料(G2)含水率',dictCode:''})
        fieldList.push({type:'double',value:'xsl',text:'小石料(S2)含水率',dictCode:''})
        fieldList.push({type:'double',value:'sz',text:'沙子(S1)含水率',dictCode:''})
        fieldList.push({type:'double',value:'sz1',text:'沙子1含水率',dictCode:''})
        fieldList.push({type:'double',value:'sz2',text:'沙子2含水率',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'工程名称',dictCode:''})
        fieldList.push({type:'string',value:'projectCmpy',text:'施工单位',dictCode:''})
        fieldList.push({type:'string',value:'shipToAdd1',text:'送货地址',dictCode:''})
        fieldList.push({type:'string',value:'recipeNo',text:'配比编号',dictCode:''})
        fieldList.push({type:'string',value:'projectPart',text:'施工部位',dictCode:''})
        fieldList.push({type:'string',value:'workMethod',text:'浇注方式',dictCode:''})
        fieldList.push({type:'string',value:'cementId',text:'水泥编号',dictCode:''})
        fieldList.push({type:'string',value:'memo2',text:'备注',dictCode:''})
        fieldList.push({type:'int',value:'distance',text:'运距',dictCode:''})
        fieldList.push({type:'string',value:'ustate',text:'任务状态：1 使用 | 0 停用',dictCode:''})
        fieldList.push({type:'string',value:'customerName',text:'合同名',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>