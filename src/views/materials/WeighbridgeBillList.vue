<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="车牌号">
              <!-- <a-input placeholder="请输入车牌号" v-model="queryParam.plateNo"></a-input> -->
              <j-input placeholder="请输入车牌号" v-model="queryParam.plateNo"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="直进直出类型">
              <j-dict-select-tag placeholder="请选择直进直出类型" v-model="queryParam.inOutType" dictCode="materials_in_out_type"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="过磅类型">
                <j-dict-select-tag placeholder="请选择过磅类型" v-model="queryParam.weighType" dictCode="material_weigh_type"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物资名称">
                <!-- <a-input placeholder="请输入物资名称" v-model="queryParam.materialsInfo"></a-input> -->
                <j-input placeholder="请输入物资名称" v-model="queryParam.materialsSpare"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="偏差结果">
                <j-dict-select-tag placeholder="请输入偏差结果" v-model="queryParam.offsetResult"  dictCode="material_offset_result"/>
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="登记时间">
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.registTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.registTime_end"></j-date>
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
      <a-button type="primary" icon="download" @click="handleExportXls('磅单管理')">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown> -->
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
          <a @click="handleDetail(record)" style="margin-right:8px;">详情</a>
          <a v-if="record.inOutType_dictText=='发料'" @click="handleAddcreased(2,record)">收料</a>
          <a v-if="record.inOutType_dictText=='收料'" @click="handleAddcreased(3,record)">发料</a>
          <a v-if="record.inOutType_dictText=='直进直出'" @click="handleAddcreased(1,record)">直进直出</a>
          <a-divider type="vertical" />
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
    <in-out-modal ref="modalForms" @ok="modalFormOk"/>
    <weighbridge-bill-modal ref="modalForm" @ok="modalFormOk"></weighbridge-bill-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import InOutModal from './modules/InOutModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import WeighbridgeBillModal from './modules/WeighbridgeBillModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import JDate from '@/components/jeecg/JDate.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'WeighbridgeBillList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDictSelectTag,
      JDate,
      WeighbridgeBillModal,
      InOutModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '磅单管理管理页面',
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
            title:'车牌号',
            align:"center",
            dataIndex: 'plateNo'
          },
          {
            title:'进场称重(吨)',
            align:"center",
            dataIndex: 'inWeight'
          },
          {
            title:'进场类型',
            align:"center",
            dataIndex: 'inType_dictText'
          },
          {
            title:'直进直出类型',
            align:"center",
            dataIndex: 'inOutType_dictText'
          },
          {
            title:'过磅类型',
            align:"center",
            dataIndex: 'weighType_dictText'
          },
          {
            title:'物资名称',
            align:"center",
            dataIndex: 'materialsSpare'
          },
          {
            title:'发料单位',
            align:"center",
            dataIndex: 'materialCompany'
          },
          {
            title:'毛重(吨)',
            align:"center",
            dataIndex: 'grossWeight'
          },
          {
            title:'皮重(吨)',
            align:"center",
            dataIndex: 'freightWeight'
          },
          {
            title:'净重(吨)',
            align:"center",
            dataIndex: 'suttleWeight'
          },
          {
            title:'正负差',
            align:"center",
            dataIndex: 'posiNegaDiff'
          },
          {
            title:'偏差结果',
            align:"center",
            dataIndex: 'offsetResult_dictText'
          },
          {
            title:'登记时间',
            align:"center",
            dataIndex: 'registTime'
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
          list: "/materials/weighbridgeBill/list",
          delete: "/materials/weighbridgeBill/delete",
          deleteBatch: "/materials/weighbridgeBill/deleteBatch",
          exportXlsUrl: "/materials/weighbridgeBill/exportXls",
          importExcelUrl: "materials/weighbridgeBill/importExcel",
          
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
      goclerk1(vak){
        console.log(vak,'inOutType_dictText')
      },
      goclerk2(vak){
        console.log(vak,'inOutType_dictText')
      },
      goclerk3(vak){
        console.log(vak,'inOutType_dictText')
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'plateNo',text:'车牌号',dictCode:''})
        fieldList.push({type:'string',value:'platePic',text:'车牌照片',dictCode:''})
        fieldList.push({type:'double',value:'inWeight',text:'进场称重',dictCode:''})
        fieldList.push({type:'string',value:'inType',text:'进场类型',dictCode:''})
        fieldList.push({type:'string',value:'inOutType',text:'直进直出类型',dictCode:'materials_in_out_type'})
        fieldList.push({type:'string',value:'weighType',text:'过磅类型',dictCode:'material_weigh_type'})
        fieldList.push({type:'string',value:'materialsInfo',text:'物资名称',dictCode:''})
        fieldList.push({type:'string',value:'materialCompany',text:'发料单位',dictCode:''})
        fieldList.push({type:'double',value:'waybillNum',text:'运单数量',dictCode:''})
        fieldList.push({type:'double',value:'deductionPercent',text:'扣量百分比',dictCode:''})
        fieldList.push({type:'double',value:'deductionValue',text:'扣量实际值',dictCode:''})
        fieldList.push({type:'date',value:'inTime',text:'进场时间'})
        fieldList.push({type:'double',value:'grossWeight',text:'毛重',dictCode:''})
        fieldList.push({type:'double',value:'freightWeight',text:'皮重',dictCode:''})
        fieldList.push({type:'double',value:'suttleWeight',text:'净重',dictCode:''})
        fieldList.push({type:'double',value:'realWeight',text:'实际重量',dictCode:''})
        fieldList.push({type:'double',value:'waybillWeight',text:'运单重量',dictCode:''})
        fieldList.push({type:'double',value:'realNum',text:'实际数量',dictCode:''})
        fieldList.push({type:'double',value:'realOffset',text:'实际偏差',dictCode:''})
        fieldList.push({type:'string',value:'posiNegaDiff',text:'正负差',dictCode:''})
        fieldList.push({type:'string',value:'offsetResult',text:'偏差结果',dictCode:''})
        fieldList.push({type:'datetime',value:'registTime',text:'登记时间'})
        fieldList.push({type:'string',value:'registrar',text:'登记人',dictCode:''})
        fieldList.push({type:'datetime',value:'outTime',text:'出场时间'})
        fieldList.push({type:'string',value:'inUpPic',text:'进场抓拍-前',dictCode:''})
        fieldList.push({type:'string',value:'inDownPic',text:'进场抓拍-后',dictCode:''})
        fieldList.push({type:'string',value:'inLeftPic',text:'进场抓拍-左',dictCode:''})
        fieldList.push({type:'string',value:'inRightPic',text:'进场抓拍-右',dictCode:''})
        fieldList.push({type:'string',value:'outUpPic',text:'出场抓拍-前',dictCode:''})
        fieldList.push({type:'string',value:'outDownPic',text:'出场抓拍-后',dictCode:''})
        fieldList.push({type:'string',value:'outLeftPic',text:'出场抓拍-左',dictCode:''})
        fieldList.push({type:'string',value:'outRightPic',text:'出场抓拍-右',dictCode:''})
        fieldList.push({type:'string',value:'photograph',text:'拍照留底',dictCode:''})
        fieldList.push({type:'string',value:'remarks',text:'备注',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style>
</style>