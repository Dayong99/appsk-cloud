<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="设备编号">
              <a-input placeholder="请输入设备编号" v-model="queryParam.deviceCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="定位状态">
              <j-dict-select-tag placeholder="请选择定位状态" v-model="queryParam.gps" dictCode="gps_status"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="开机状态">
                <j-dict-select-tag placeholder="请选择开机状态" v-model="queryParam.accStatus" dictCode="acc_status"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('车辆定位数据表')">导出</a-button>
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

          <!-- <a-divider type="vertical" />
          <a-dropdown>
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

    <vehicle-position-record-modal ref="modalForm" @ok="modalFormOk"></vehicle-position-record-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import VehiclePositionRecordModal from './modules/VehiclePositionRecordModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'VehiclePositionRecordList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDictSelectTag,
      VehiclePositionRecordModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '车辆定位数据表管理页面',
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
            title:'设备编号',
            align:"center",
            dataIndex: 'deviceCode'
          },
          {
            title:'定位状态',
            align:"center",
            dataIndex: 'gps_dictText'
          },
          {
            title:'经度',
            align:"center",
            dataIndex: 'latitude'
          },
          {
            title:'纬度',
            align:"center",
            dataIndex: 'longitude'
          },
          {
            title:'水温',
            align:"center",
            dataIndex: 'waterTemp'
          },
          {
            title:'油温',
            align:"center",
            dataIndex: 'oilTemp'
          },
          {
            title:'油量百分比',
            align:"center",
            dataIndex: 'oil'
          },
          {
            title:'电量百分比',
            align:"center",
            dataIndex: 'energy'
          },
          {
            title:'开机状态',
            align:"center",
            dataIndex: 'accStatus_dictText'
          },
          {
            title:'震动次数',
            align:"center",
            dataIndex: 'vibStatus'
          },
          {
            title:'红外次数',
            align:"center",
            dataIndex: 'redStatus'
          },
          {
            title:'地址',
            align:"center",
            dataIndex: 'address'
          },
          {
            title:'区域编号',
            align:"center",
            dataIndex: 'adcode'
          },
          {
            title:'时间',
            align:"center",
            dataIndex: 'timeCount'
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
          list: "/vehicle/positionRecord/list",
          delete: "/vehicle/positionRecord/delete",
          deleteBatch: "/vehicle/positionRecord/deleteBatch",
          exportXlsUrl: "/vehicle/positionRecord/exportXls",
          importExcelUrl: "vehicle/positionRecord/importExcel",
          
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
        fieldList.push({type:'string',value:'deviceCode',text:'设备编号',dictCode:''})
        fieldList.push({type:'int',value:'gps',text:'定位状态',dictCode:'gps_status'})
        fieldList.push({type:'string',value:'latitude',text:'经度',dictCode:''})
        fieldList.push({type:'string',value:'longitude',text:'纬度',dictCode:''})
        fieldList.push({type:'double',value:'waterTemp',text:'水温',dictCode:''})
        fieldList.push({type:'double',value:'oilTemp',text:'油温',dictCode:''})
        fieldList.push({type:'string',value:'oil',text:'油量百分比',dictCode:''})
        fieldList.push({type:'string',value:'energy',text:'电量百分比',dictCode:''})
        fieldList.push({type:'int',value:'accStatus',text:'开机状态',dictCode:'acc_status'})
        fieldList.push({type:'int',value:'vibStatus',text:'震动次数',dictCode:''})
        fieldList.push({type:'int',value:'redStatus',text:'红外次数',dictCode:''})
        fieldList.push({type:'string',value:'address',text:'地址',dictCode:''})
        fieldList.push({type:'string',value:'adcode',text:'区域编号',dictCode:''})
        fieldList.push({type:'datetime',value:'timeCount',text:'时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>