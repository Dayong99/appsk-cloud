<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="仓库类型">
              <j-dict-select-tag placeholder="请选择仓库类型" v-model="queryParam.warehouseTypeId" dictCode="aoz_materials_warehouse_type,warehouse_type,id"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="仓库名称">
              <a-input placeholder="请输入仓库名称" v-model="queryParam.warehouseId"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="物资类型">
              <j-dict-select-tag placeholder="请选择物资类型" v-model="queryParam.classifyTypeCode" dictCode="aoz_materials_classify_type,classify_type_name,classify_type_code"/>
            </a-form-item>
          </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物资名称">
                <a-input placeholder="请输入物资名称" v-model="queryParam.materialsName"></a-input> 
                <!-- <j-input placeholder="请输入物资名称" v-model="queryParam.materialsName"></j-input> -->
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物资编号">
                 <a-input placeholder="请输入物资编号" v-model="queryParam.materialsNumber"></a-input>
                 <!-- <j-input placeholder="请输入物资编号" v-model="queryParam.materialsNumber"></j-input> -->
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="规格">
                <a-input placeholder="请输入规格" v-model="queryParam.specifications"></a-input> 
                 <!-- <j-input placeholder="请输入规格" v-model="queryParam.specifications"></j-input> -->
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
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('库存管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div> -->

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
          <!-- <a @click="handleDetail(record)" style="margin-right:8px;">调配</a>
          <a @click="handleDetail(record)" style="margin-right:8px;">盘点</a> -->
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

    <inventory-modal ref="modalForm" @ok="modalFormOk"></inventory-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InventoryModal from './modules/InventoryModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  // import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'InventoryList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      InventoryModal,
      JSuperQuery
    },
    data () {
      return {
        description: '库存管理管理页面',
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
            title:'仓库类型',
            align:"center",
            dataIndex: 'warehouseTypeId_dictText'
          },
          {
            title:'仓库名称',
            align:"center",
            dataIndex: 'warehouseId_dictText'
          },
          {
            title:'物资类型',
            align:"center",
            dataIndex: 'classifyTypeCode_dictText'
          },
          {
            title:'物资名称',
            align:"center",
            dataIndex: 'materialsName'
          },
          {
            title:'物资编号',
            align:"center",
            dataIndex: 'materialsNumber'
          },
          {
            title:'规格',
            align:"center",
            dataIndex: 'specifications'
          },
          {
            title:'型号',
            align:"center",
            dataIndex: 'modelNumber'
          },
          {
            title:'库存数量',
            align:"center",
            dataIndex: 'inventoryTotal'
          },
          {
            title:'单位',
            align:"center",
            dataIndex: 'materialUnit_dictText'
          },
          {
            title:'换算系数',
            align:"center",
            dataIndex: 'conversionFactor'
          },
          // {
          //   title:'盘点数量',
          //   align:"center",
          //   dataIndex: 'checkNumber'
          // },
          {
            title:'累计入库',
            align:"center",
            dataIndex: 'inTotal'
          },
          {
            title:'累计出库',
            align:"center",
            dataIndex: 'outTotal'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remarks'
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
          list: "/materials/inventory/list",
          delete: "/materials/inventory/delete",
          deleteBatch: "/materials/inventory/deleteBatch",
          exportXlsUrl: "/materials/inventory/exportXls",
          importExcelUrl: "materials/inventory/importExcel",
          
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
        fieldList.push({type:'string',value:'warehouseTypeId',text:'仓库类型',dictCode:'aoz_materials_warehouse_type,warehouse_type,id'})
        fieldList.push({type:'string',value:'warehouseId',text:'仓库名称',dictCode:'aoz_materials_warehouse,warehouse_name,id'})
        fieldList.push({type:'string',value:'classifyTypeCode',text:'物资类型',dictCode:'aoz_materials_classify_type,classify_type_name,classify_type_code'})
        fieldList.push({type:'string',value:'materialsName',text:'物资名称',dictCode:''})
        fieldList.push({type:'string',value:'materialsNumber',text:'物资编号',dictCode:''})
        fieldList.push({type:'string',value:'specifications',text:'规格',dictCode:''})
        fieldList.push({type:'string',value:'modelNumber',text:'型号',dictCode:''})
        fieldList.push({type:'double',value:'inventoryTotal',text:'库存数量',dictCode:''})
        fieldList.push({type:'string',value:'materialUnit',text:'单位',dictCode:'material_unit'})
        fieldList.push({type:'double',value:'conversionFactor',text:'换算系数',dictCode:''})
        //fieldList.push({type:'double',value:'checkNumber',text:'盘点数量',dictCode:''})
        fieldList.push({type:'double',value:'inTotal',text:'累计入库',dictCode:''})
        fieldList.push({type:'double',value:'outTotal',text:'累计出库',dictCode:''})
        fieldList.push({type:'string',value:'remarks',text:'备注',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style>
</style>