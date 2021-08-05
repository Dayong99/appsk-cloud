<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="试验类型">
              <j-input placeholder="请输入试验类型" v-model="queryParam.testType"></j-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="试件品种">
              <j-input placeholder="请输入试件品种" v-model="queryParam.variety"></j-input>
            </a-form-item>
          </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="试验日期">
              <j-date placeholder="请选择试验日期" v-model="queryParam.dateTime"></j-date>
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('压力试验机记录表')">导出</a-button>
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
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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

    <pressure-record-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PressureRecordModal from './modules/PressureRecordModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import '@/assets/less/TableExpand.less'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: "PressureRecordList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      PressureRecordModal,
      JSuperQuery
    },
    data () {
      return {
        description: '压力试验机记录表管理页面',
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
            title:'设备名称',
            align:"center",
            dataIndex: 'deivceCode_dictText'
          },
          {
            title:'外部编号',
            align:"center",
            dataIndex: 'wbbh'
          },
          {
            title:'试验类型',
            align:"center",
            dataIndex: 'testType'
          },
          // {
          //   title:'试件品种',
          //   align:"center",
          //   dataIndex: 'variety'
          // },
          {
            title:'强度等级',
            align:"center",
            dataIndex: 'strengthGrade'
          },
          {
            title:'试件规格',
            align:"center",
            dataIndex: 'specification'
          },
          {
            title:'加荷速度',
            align:"center",
            dataIndex: 'speed'
          },
          {
            title:'本组实验数量',
            align:"center",
            dataIndex: 'testCount'
          },
          // {
          //   title:'跨距',
          //   align:"center",
          //   dataIndex: 'kj'
          // },
          {
            title:'面积',
            align:"center",
            dataIndex: 'size'
          },
          {
            title:'修正系数',
            align:"center",
            dataIndex: 'xs'
          },
          {
            title:'有效力值',
            align:"center",
            dataIndex: 'yxlz'
          },
          {
            title:'有效强度',
            align:"center",
            dataIndex: 'yxqd'
          },
          {
            title:'龄期',
            align:"center",
            dataIndex: 'lq'
          },
          {
            title:'试验日期',
            align:"center",
            dataIndex: 'dateTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          // {
          //   title:'数据文件路径',
          //   align:"center",
          //   dataIndex: 'filePath'
          // },
          // {
          //   title:'试验是否完成',
          //   align:"center",
          //   dataIndex: 'endFlag_dictText'
          // },

          // {
          //   title:'截面形状',
          //   align:"center",
          //   dataIndex: 'shape_dictText'
          // },
          // {
          //   title:'实验员',
          //   align:"center",
          //   dataIndex: 'tester'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/mixingStation/pressureRecord/list",
          delete: "/mixingStation/pressureRecord/delete",
          deleteBatch: "/mixingStation/pressureRecord/deleteBatch",
          exportXlsUrl: "/mixingStation/pressureRecord/exportXls",
          importExcelUrl: "mixingStation/pressureRecord/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
        isorter:{
          column: 'dateTime',
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
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'deivceCode',text:'设备编号',dictCode:''})
         fieldList.push({type:'string',value:'testType',text:'试验类型',dictCode:''})
         fieldList.push({type:'string',value:'variety',text:'试件品种',dictCode:''})
         fieldList.push({type:'string',value:'strengthGrade',text:'强度等级',dictCode:''})
         fieldList.push({type:'string',value:'specification',text:'试件规格',dictCode:''})
         fieldList.push({type:'string',value:'speed',text:'加荷速度',dictCode:''})
         fieldList.push({type:'string',value:'testCount',text:'本组实验数量(numb)',dictCode:''})
         fieldList.push({type:'string',value:'kj',text:'跨距',dictCode:''})
         fieldList.push({type:'string',value:'size',text:'面积(mj)',dictCode:''})
         fieldList.push({type:'string',value:'xs',text:'修正系数',dictCode:''})
         fieldList.push({type:'string',value:'yxlz',text:'有效力值',dictCode:''})
         fieldList.push({type:'string',value:'yxqd',text:'有效强度',dictCode:''})
         fieldList.push({type:'string',value:'lq',text:'龄期',dictCode:''})
         fieldList.push({type:'date',value:'dateTime',text:'试验日期'})
         fieldList.push({type:'string',value:'filePath',text:'数据文件路径',dictCode:''})
         fieldList.push({type:'string',value:'endFlag',text:'试验是否完成',dictCode:'is_complete'})
         fieldList.push({type:'string',value:'wbbh',text:'外部编号',dictCode:''})
         fieldList.push({type:'int',value:'shape',text:'截面形状',dictCode:'section_shape'})
         fieldList.push({type:'string',value:'tester',text:'实验员',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>