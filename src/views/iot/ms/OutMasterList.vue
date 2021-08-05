<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="任务名称">
              <j-input placeholder="请输入任务名称" v-model="queryParam.taskName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="出货单名称">
              <j-input placeholder="请输入出货单" v-model="queryParam.deliveryName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="出货单号">
              <j-input placeholder="请输入出货单号" v-model="queryParam.deliveryId"></j-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('拌合站出货单表')">导出</a-button>
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

    <out-master-modal ref="modalForm" @ok="modalFormOk"></out-master-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OutMasterModal from './modules/OutMasterModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'OutMasterList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      OutMasterModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '拌合站出货单表管理页面',
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
            title:'出货单号',
            align:"center",
            dataIndex: 'deliveryId'
          },
          {
            title:'出货单名称',
            align:"center",
            dataIndex: 'deliveryName'
          },
          {
            title:'任务名称',
            align:"center",
            dataIndex: 'taskName'
          },
          {
            title:'生产日期',
            align:"center",
            dataIndex: 'deliveryDate'
          },
          // {
          //   title:'任务号',
          //   align:"center",
          //   dataIndex: 'taskId'
          // },
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
          {
            title:'配比编号',
            align:"center",
            dataIndex: 'recipeNo'
          },
          {
            title:'生产方数',
            align:"center",
            dataIndex: 'quantity'
          },
          {
            title:'单车盘数',
            align:"center",
            dataIndex: 'itemNo'
          },
          {
            title:'单车总盘数',
            align:"center",
            dataIndex: 'totalItemNo'
          },
          {
            title:'车号',
            align:"center",
            dataIndex: 'truckId'
          },
          {
            title:'运送地址',
            align:"center",
            dataIndex: 'shipAdd'
          },
          {
            title:'运距',
            align:"center",
            dataIndex: 'distance'
          },
          // {
          //   title:'发货员号',
          //   align:"center",
          //   dataIndex: 'employeeId'
          // },
          {
            title:'用户名称',
            align:"center",
            dataIndex: 'companyName'
          },
          {
            title:'施工单位',
            align:"center",
            dataIndex: 'projectCmpy'
          },
          {
            title:'施工部位',
            align:"center",
            dataIndex: 'projectPart'
          },
          {
            title:'计划方数',
            align:"center",
            dataIndex: 'planCount'
          },
          {
            title:'累计方数',
            align:"center",
            dataIndex: 'endCount'
          },
          {
            title:'发货员',
            align:"center",
            dataIndex: 'fname'
          },
          {
            title:'工程名称',
            align:"center",
            dataIndex: 'projectName'
          },
          {
            title:'累计车数',
            align:"center",
            dataIndex: 'outCount'
          },
          {
            title:'司机',
            align:"center",
            dataIndex: 'reserve2'
          },
          // {
          //   title:'水泥序号',
          //   align:"center",
          //   dataIndex: 'cementId'
          // },
          // {
          //   title:'水泥牌号',
          //   align:"center",
          //   dataIndex: 'cementName'
          // },
          {
            title:'强度等级',
            align:"center",
            dataIndex: 'intensityLevel'
          },
          // {
          //   title:'抗渗度',
          //   align:"center",
          //   dataIndex: 'ksd'
          // },
          // {
          //   title:'抗折度',
          //   align:"center",
          //   dataIndex: 'kzd'
          // },
          {
            title:'塌落度',
            align:"center",
            dataIndex: 'tld'
          },
          // {
          //   title:'沙粒径等级',
          //   align:"center",
          //   dataIndex: 'sljdj'
          // },
          {
            title:'碎石最大粒径',
            align:"center",
            dataIndex: 'sszdlj'
          },
          {
            title:'浇注方式',
            align:"center",
            dataIndex: 'workMethod'
          },
          {
            title:'调度员',
            align:"center",
            dataIndex: 'dname'
          },
          // {
          //   title:'备注',
          //   align:"center",
          //   dataIndex: 'memo2'
          // },
          // {
          //   title:'带砂浆:0 不带 | 1 带',
          //   align:"center",
          //   dataIndex: 'bslurry'
          // },
          // {
          //   title:'砂浆方量',
          //   align:"center",
          //   dataIndex: 'slurryQuantity'
          // },
          // {
          //   title:'砂浆配方',
          //   align:"center",
          //   dataIndex: 'slurryRecipeNo'
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
          list: "/ms/outMaster/list",
          delete: "/ms/outMaster/delete",
          deleteBatch: "/ms/outMaster/deleteBatch",
          exportXlsUrl: "/ms/outMaster/exportXls",
          importExcelUrl: "ms/outMaster/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
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
        fieldList.push({type:'string',value:'deliveryId',text:'出货单号',dictCode:''})
        fieldList.push({type:'string',value:'deliveryName',text:'名称',dictCode:''})
        fieldList.push({type:'datetime',value:'deliveryDate',text:'生产日期'})
        fieldList.push({type:'string',value:'taskId',text:'任务号',dictCode:''})
        fieldList.push({type:'string',value:'orderId',text:'合同号',dictCode:''})
        fieldList.push({type:'string',value:'itemId',text:'合同明细号',dictCode:''})
        fieldList.push({type:'string',value:'recipeNo',text:'配比编号',dictCode:''})
        fieldList.push({type:'double',value:'quantity',text:'生产方数',dictCode:''})
        fieldList.push({type:'double',value:'itemNo',text:'单车盘数',dictCode:''})
        fieldList.push({type:'string',value:'truckId',text:'车号',dictCode:''})
        fieldList.push({type:'string',value:'shipAdd',text:'运送地址',dictCode:''})
        fieldList.push({type:'int',value:'distance',text:'运距',dictCode:''})
        fieldList.push({type:'string',value:'employeeId',text:'发货员号',dictCode:''})
        fieldList.push({type:'string',value:'companyName',text:'用户名称',dictCode:''})
        fieldList.push({type:'string',value:'projectCmpy',text:'施工单位',dictCode:''})
        fieldList.push({type:'string',value:'projectPart',text:'施工部位',dictCode:''})
        fieldList.push({type:'double',value:'planCount',text:'计划方数',dictCode:''})
        fieldList.push({type:'double',value:'endCount',text:'累计方数',dictCode:''})
        fieldList.push({type:'string',value:'fname',text:'发货员',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'工程名称',dictCode:''})
        fieldList.push({type:'int',value:'outCount',text:'累计车数',dictCode:''})
        fieldList.push({type:'string',value:'reserve2',text:'司机',dictCode:''})
        fieldList.push({type:'string',value:'cementId',text:'水泥序号',dictCode:''})
        fieldList.push({type:'string',value:'cementName',text:'水泥牌号',dictCode:''})
        fieldList.push({type:'string',value:'intensityLevel',text:'强度等级',dictCode:''})
        fieldList.push({type:'string',value:'ksd',text:'抗渗度',dictCode:''})
        fieldList.push({type:'string',value:'kzd',text:'抗折度',dictCode:''})
        fieldList.push({type:'string',value:'tld',text:'塌落度',dictCode:''})
        fieldList.push({type:'string',value:'sljdj',text:'沙粒径等级',dictCode:''})
        fieldList.push({type:'string',value:'sszdlj',text:'碎石最大粒径',dictCode:''})
        fieldList.push({type:'string',value:'workMethod',text:'浇注方式',dictCode:''})
        fieldList.push({type:'string',value:'memo2',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'dname',text:'调度员',dictCode:''})
        fieldList.push({type:'string',value:'taskName',text:'任务名称',dictCode:''})
        fieldList.push({type:'int',value:'bslurry',text:'带砂浆:0 不带 | 1 带',dictCode:''})
        fieldList.push({type:'double',value:'slurryQuantity',text:'砂浆方量',dictCode:''})
        fieldList.push({type:'string',value:'slurryRecipeNo',text:'砂浆配方',dictCode:''})
        fieldList.push({type:'double',value:'totalItemNo',text:'单车总盘数',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>