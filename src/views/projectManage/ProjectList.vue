<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="创建日期">
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('项目管理-项目表')">导出</a-button>
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

        <template slot="engineeringUnit"  slot-scope="text, record">
          <span>{{record.projectScale}}</span>
          <span>{{record.projectScaleUnit_dictText}}</span>
        </template>

        <template slot="investmentUnit"  slot-scope="text, record">
          <span>{{record.investmentScale}}</span>
          <span>{{record.investmentScaleUnit_dictText}}</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <project-modal ref="modalForm" @ok="modalFormOk"></project-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { getAction } from '@/api/manage'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProjectModal from './modules/ProjectModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'ProjectList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDate,
      ProjectModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '项目管理-项目表管理页面',
        engineeringUnit:'',
        investmentUnit:'',
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
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName'
          },
          {
            title:'项目类型',
            align:"center",
            dataIndex: 'projectType_dictText'
          },
          {
            title:'城市名称',
            align:"center",
            dataIndex: 'cityName'
          },
          {
            title:'开工日期',
            align:"center",
            dataIndex: 'projectStartDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'竣工日期',
            align:"center",
            dataIndex: 'projectEndDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'工程规模',
            align:"center",
            dataIndex: 'projectScale',
            scopedSlots: { customRender: 'engineeringUnit' }
          },
          {
            title:'投资规模',
            align:"center",
            dataIndex: 'investmentScale',
            scopedSlots: { customRender: 'investmentUnit' }
          },
          {
            title:'项目地址',
            align:"center",
            dataIndex: 'projectAddress'
          },
          {
            title:'工程状态',
            align:"center",
            dataIndex: 'projectStatus'
          },
          {
            title:'创建日期',
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
          list: "/sys/project/list",
          delete: "/sys/project/delete",
          deleteBatch: "/sys/project/deleteBatch",
          exportXlsUrl: "/sys/project/exportXls",
          importExcelUrl: "sys/project/importExcel",

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
        fieldList.push({type:'string',value:'projectCode',text:'项目编码',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'项目名称',dictCode:''})
        fieldList.push({type:'string',value:'projectType',text:'项目类型',dictCode:'project_manage_project_type'})
        fieldList.push({type:'string',value:'logoUrl',text:'公司logo',dictCode:''})
        fieldList.push({type:'string',value:'cityName',text:'城市名称',dictCode:''})
        fieldList.push({type:'string',value:'cityCode',text:'城市编码',dictCode:''})
        fieldList.push({type:'date',value:'projectStartDate',text:'开工日期'})
        fieldList.push({type:'date',value:'projectEndDate',text:'竣工日期'})
        fieldList.push({type:'string',value:'projectScale',text:'工程规模',dictCode:''})
        fieldList.push({type:'string',value:'projectScaleUnit',text:'工程规模单位',dictCode:'project_manage_project_scale_unit'})
        fieldList.push({type:'string',value:'investmentScale',text:'投资规模',dictCode:''})
        fieldList.push({type:'string',value:'investmentScaleUnit',text:'投资规模单位',dictCode:'project_manage_investment_scale_unit'})
        fieldList.push({type:'string',value:'projectAddress',text:'项目地址',dictCode:''})
        fieldList.push({type:'string',value:'projectStatus',text:'工程状态',dictCode:''})
        fieldList.push({type:'string',value:'projectGeneralize',text:'工程概括',dictCode:''})
        fieldList.push({type:'string',value:'projectImageUrl',text:'项目图',dictCode:''})
        fieldList.push({type:'string',value:'longitude',text:'经度',dictCode:''})
        fieldList.push({type:'string',value:'latitude',text:'纬度',dictCode:''})
        fieldList.push({type:'string',value:'companyName',text:'公司名称(施工单位)',dictCode:''})
        fieldList.push({type:'string',value:'remarks',text:'备注信息',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建日期'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>