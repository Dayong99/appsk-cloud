<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="商品编号">
              <!-- <a-input placeholder="请输入商品编号" v-model="queryParam.goodsCode"></a-input> -->
              <j-input placeholder="请输入商品编号" v-model="queryParam.goodsCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="商品标题">
              <!-- <a-input placeholder="请输入商品标题" v-model="queryParam.goodsTitle"></a-input> -->
              <j-input placeholder="请输入商品标题" v-model="queryParam.goodsTitle"></j-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('商品管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
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

    <goods-modal ref="modalForm" @ok="modalFormOk"></goods-modal>
  </a-card>
</template>

<script>

  // import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GoodsModal from './modules/GoodsModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'GoodsList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      GoodsModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '商品管理管理页面',
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
            title:'商品编号',
            align:"center",
            dataIndex: 'goodsCode'
          },
          {
            title:'商品标题',
            align:"center",
            dataIndex: 'goodsTitle'
          },
          {
            title:'商品副标题',
            align:"center",
            dataIndex: 'goodsSubtitle'
          },
          {
            title:'商品大图',
            align:"center",
            dataIndex: 'goodsPic',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'库存数量',
            align:"center",
            dataIndex: 'stock'
          },
          {
            title:'已兑换数量',
            align:"center",
            dataIndex: 'conversion'
          },
          {
            title:'需要积分数',
            align:"center",
            dataIndex: 'score'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/stpe/goods/list",
          delete: "/stpe/goods/delete",
          deleteBatch: "/stpe/goods/deleteBatch",
          exportXlsUrl: "/stpe/goods/exportXls",
          importExcelUrl: "stpe/goods/importExcel",

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
        fieldList.push({type:'string',value:'goodsCode',text:'商品编号',dictCode:''})
        fieldList.push({type:'string',value:'goodsTitle',text:'商品标题',dictCode:''})
        fieldList.push({type:'string',value:'goodsSubtitle',text:'商品副标题',dictCode:''})
        fieldList.push({type:'string',value:'goodsPic',text:'商品大图',dictCode:''})
        fieldList.push({type:'int',value:'stock',text:'库存数量',dictCode:''})
        fieldList.push({type:'int',value:'conversion',text:'已兑换数量',dictCode:''})
        fieldList.push({type:'double',value:'score',text:'需要积分数',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>

</style>