<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="问题标题">
              <j-input placeholder="请输入问题标题" v-model="queryParam.title"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="上报人">
              <j-dict-select-tag placeholder="请选择上报人" v-model="queryParam.personId" dictCode="aoz_person,person_name,id"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="上报时间">
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="审核结果">
                <j-dict-select-tag placeholder="请选择审核结果" v-model="queryParam.checkResultStatus" dictCode="stpe_result_check_status"/>
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download" @click="handleExportXls('安全积分问题上报')">导出</a-button>
     <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <!-- 高级查询区域 -->
      <!--<j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
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
          <a @click="handleDetail(record)">详情</a>
          <!--<a @click="handleEdit(record)">编辑</a>
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
          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <problem-report-modal ref="modalForm" @ok="modalFormOk"></problem-report-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProblemReportModal from './modules/ProblemReportModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import JDate from '@/components/jeecg/JDate.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'ProblemReportList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDictSelectTag,
      JDate,
      ProblemReportModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '安全积分问题上报管理页面',
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
            title:'问题标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'问题描述',
            align:"center",
            dataIndex: 'content'
          },
          {
            title:'上传照片',
            align:"center",
            dataIndex: 'picture',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'上报人',
            align:"center",
            dataIndex: 'personId_dictText'
          },
          {
            title:'上报时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title:'审核状态',
            align:"center",
            dataIndex: 'checkStatus_dictText'
          },
          {
            title:'审核结果',
            align:"center",
            dataIndex: 'checkResultStatus_dictText'
          },
          {
            title:'审核说明',
            align:"center",
            dataIndex: 'checkExplain'
          },
          {
            title:'分值',
            align:"center",
            dataIndex: 'score'
          },
          {
            title:'审核人',
            align:"center",
            dataIndex: 'updateBy_dictText'
          },
          {
            title:'审核时间',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title:'有无复审',
            align:"center",
            dataIndex: 'reCheckStatus_dictText'
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
          list: "/stpe/problemReport/list",
          delete: "/stpe/problemReport/delete",
          deleteBatch: "/stpe/problemReport/deleteBatch",
          exportXlsUrl: "/stpe/problemReport/exportXls",
          importExcelUrl: "stpe/problemReport/importExcel",

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
        fieldList.push({type:'string',value:'title',text:'问题标题',dictCode:''})
        fieldList.push({type:'string',value:'content',text:'问题描述',dictCode:''})
        fieldList.push({type:'Text',value:'picture',text:'上传照片',dictCode:''})
        fieldList.push({type:'string',value:'personId',text:'上报人',dictCode:'aoz_person,person_name,id'})
        fieldList.push({type:'datetime',value:'createTime',text:'上报时间'})
        fieldList.push({type:'string',value:'checkStatus',text:'审核状态',dictCode:'stpe_check_status'})
        fieldList.push({type:'string',value:'checkResultStatus',text:'审核结果',dictCode:'stpe_result_check_status'})
        fieldList.push({type:'string',value:'reCheckStatus',text:'有无复审',dictCode:'stpe_re_check_status'})
        fieldList.push({type:'string',value:'checkExplain',text:'审核说明',dictCode:''})
        fieldList.push({type:'double',value:'score',text:'分值',dictCode:''})
        fieldList.push({type:'string',value:'updateBy',text:'审核人',dictCode:'sys_user,realname,username'})
        fieldList.push({type:'datetime',value:'updateTime',text:'审核时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>