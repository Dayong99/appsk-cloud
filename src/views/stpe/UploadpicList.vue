<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="标题">
              <!-- <a-input placeholder="请输入标题" v-model="queryParam.title"></a-input> -->
              <j-input placeholder="请输入题目" v-model="queryParam.title"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="审核状态">
              <j-dict-select-tag placeholder="请选择审核状态" v-model="queryParam.examineStatus" dictCode="examine_status"/>
            </a-form-item>
          </a-col>
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
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('上传图片管理')">导出</a-button>
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

    <uploadpic-modal ref="modalForm" @ok="modalFormOk"></uploadpic-modal>
  </a-card>
</template>

<script>

  // import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import UploadpicModal from './modules/UploadpicModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'UploadpicList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDictSelectTag,
      UploadpicModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '上传图片管理管理页面',
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
            title:'标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'教育成果',
            align:"center",
            dataIndex: 'eduResult'
          },
          {
            title:'教育图片',
            align:"center",
            dataIndex: 'eduPic',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'上传用户',
            align:"center",
            dataIndex: 'personId'
          },
          {
            title:'审核状态',
            align:"center",
            dataIndex: 'examineStatus_dictText'
          },
          {
            title:'审核备注',
            align:"center",
            dataIndex: 'examineRemark'
          },
          {
            title:'审批人',
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
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/stpe/uploadpic/list",
          delete: "/stpe/uploadpic/delete",
          deleteBatch: "/stpe/uploadpic/deleteBatch",
          exportXlsUrl: "/stpe/uploadpic/exportXls",
          importExcelUrl: "stpe/uploadpic/importExcel",

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
        fieldList.push({type:'string',value:'title',text:'标题',dictCode:''})
        fieldList.push({type:'string',value:'eduResult',text:'教育成果',dictCode:''})
        fieldList.push({type:'string',value:'eduPic',text:'教育图片',dictCode:''})
        fieldList.push({type:'string',value:'personId',text:'上传用户',dictCode:'aoz_person,person_name,id'})
        fieldList.push({type:'int',value:'examineStatus',text:'审核状态',dictCode:'examine_status'})
        fieldList.push({type:'string',value:'examineRemark',text:'审核备注',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'审批人',dictCode:'sys_user,realname,username'})
        fieldList.push({type:'datetime',value:'createTime',text:'上传时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
 
</style>