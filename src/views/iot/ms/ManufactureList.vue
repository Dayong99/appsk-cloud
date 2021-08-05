<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="出货单号">
              <j-input placeholder="请输入出货单号" v-model="queryParam.deliveryId"></j-input>
           </a-form-item>
          </a-col>
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="生产时间">
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.mdateTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.mdateTime_end"></j-date>
            </a-form-item>
          </a-col>
          <!-- <template v-if="toggleSearchStatus">

          </template> -->
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
      <a-button type="primary" icon="download" @click="handleExportXls('拌合站生产数据表')">导出</a-button>
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

    <manufacture-modal ref="modalForm" @ok="modalFormOk"></manufacture-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ManufactureModal from './modules/ManufactureModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'ManufactureList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      JDate,
      ManufactureModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '拌合站生产数据表管理页面',
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
            title:'生产时间',
            align:"center",
            dataIndex: 'mdateTime'
          },
          // {
          //   title:'配方号',
          //   align:"center",
          //   dataIndex: 'recipeId'
          // },
          {
            title:'当前盘数',
            align:"center",
            dataIndex: 'itemId'
          },
          // {
          //   title:'单车盘数',
          //   align:"center",
          //   dataIndex: 'itemNo'
          // },
          // {
          //   title:'方数',
          //   align:"center",
          //   dataIndex: 'operatorId'
          // },
          {
            title:'出货单号',
            align:"center",
            dataIndex: 'deliveryId'
          },
          {
            title:'水泥1配方值',
            align:"center",
            dataIndex: 'recipeSn1'
          },
          {
            title:'水泥1实际值',
            align:"center",
            dataIndex: 'actualSn1'
          },
          {
            title:'水泥2配方值',
            align:"center",
            dataIndex: 'recipeSn2'
          },
          {
            title:'水泥2实际值',
            align:"center",
            dataIndex: 'actualSn2'
          },
          {
            title:'水泥3配方值',
            align:"center",
            dataIndex: 'recipeSn3'
          },
          {
            title:'水泥3实际值',
            align:"center",
            dataIndex: 'actualSn3'
          },
          {
            title:'粉煤灰配方值',
            align:"center",
            dataIndex: 'recipeFmh'
          },
          {
            title:'粉煤灰实际值',
            align:"center",
            dataIndex: 'actualFmh'
          },
          {
            title:'粉加剂配方值',
            align:"center",
            dataIndex: 'recipeFjj'
          },
          {
            title:'粉加剂实际值',
            align:"center",
            dataIndex: 'actualFjj'
          },
          {
            title:'矿粉配方值',
            align:"center",
            dataIndex: 'recipeKf'
          },
          {
            title:'矿粉实际值',
            align:"center",
            dataIndex: 'actualKf'
          },
          {
            title:'添加剂1配方值',
            align:"center",
            dataIndex: 'recipeWjj1'
          },
          {
            title:'添加剂1实际值',
            align:"center",
            dataIndex: 'actualWjj1'
          },
          {
            title:'添加剂2配方值',
            align:"center",
            dataIndex: 'recipeWjj2'
          },
          {
            title:'添加剂2实际值',
            align:"center",
            dataIndex: 'actualWjj2'
          },
          {
            title:'大石料(G1)配方值',
            align:"center",
            dataIndex: 'recipeDsl'
          },
          {
            title:'大石料(G1)实际值',
            align:"center",
            dataIndex: 'actualDsl'
          },
          {
            title:'中石料(G2)配方值',
            align:"center",
            dataIndex: 'recipeZsl'
          },
          {
            title:'中石料(G2)实际值',
            align:"center",
            dataIndex: 'actualZsl'
          },
          {
            title:'小石料(S2)配方值',
            align:"center",
            dataIndex: 'recipeXsl'
          },
          {
            title:'小石料(S2)实际值',
            align:"center",
            dataIndex: 'actualXsl'
          },
          {
            title:'沙子(S1)配方值',
            align:"center",
            dataIndex: 'recipeSz'
          },
          {
            title:'沙子(S1)实际值',
            align:"center",
            dataIndex: 'actualSz'
          },
          {
            title:'沙子1配方值',
            align:"center",
            dataIndex: 'recipeSz1'
          },
          {
            title:'沙子1实际值',
            align:"center",
            dataIndex: 'actualSz1'
          },
          {
            title:'水配方值',
            align:"center",
            dataIndex: 'recipeShui'
          },
          {
            title:'水实际值',
            align:"center",
            dataIndex: 'actualShui'
          },
          {
            title:'搅拌时间配方值',
            align:"center",
            dataIndex: 'recipeOth1'
          },
          {
            title:'搅拌时间实际值',
            align:"center",
            dataIndex: 'actualOth1'
          },
          {
            title:'污水配方值',
            align:"center",
            dataIndex: 'recipeSz2'
          },
          {
            title:'污水实际值',
            align:"center",
            dataIndex: 'actualSz2'
          },
          {
            title:'水泥4配方值',
            align:"center",
            dataIndex: 'recipeSn4'
          },
          {
            title:'水泥4实际值',
            align:"center",
            dataIndex: 'actualSn4'
          },
          // {
          //   title:'M17配方值',
          //   align:"center",
          //   dataIndex: 'recipeM17'
          // },
          // {
          //   title:'M17实际值',
          //   align:"center",
          //   dataIndex: 'actualM17'
          // },
          // {
          //   title:'M18配方值',
          //   align:"center",
          //   dataIndex: 'recipeM18'
          // },
          // {
          //   title:'M18实际值',
          //   align:"center",
          //   dataIndex: 'actualM18'
          // },
          // {
          //   title:'M19配方值',
          //   align:"center",
          //   dataIndex: 'recipeM19'
          // },
          // {
          //   title:'M19实际值',
          //   align:"center",
          //   dataIndex: 'actualM19'
          // },
          // {
          //   title:'M20配方值',
          //   align:"center",
          //   dataIndex: 'recipeM20'
          // },
          // {
          //   title:'M20实际值',
          //   align:"center",
          //   dataIndex: 'actualM20'
          // },
          // {
          //   title:'带砂浆否:0 不带 | 1 带',
          //   align:"center",
          //   dataIndex: 'bslurry'
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
          list: "/ms/manufacture/list",
          delete: "/ms/manufacture/delete",
          deleteBatch: "/ms/manufacture/deleteBatch",
          exportXlsUrl: "/ms/manufacture/exportXls",
          importExcelUrl: "ms/manufacture/importExcel",

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
        fieldList.push({type:'datetime',value:'mdateTime',text:'生产时间'})
        fieldList.push({type:'string',value:'recipeId',text:'配方号',dictCode:''})
        fieldList.push({type:'string',value:'itemId',text:'当前盘数',dictCode:''})
        fieldList.push({type:'double',value:'itemNo',text:'单车盘数',dictCode:''})
        fieldList.push({type:'int',value:'operatorId',text:'方数',dictCode:''})
        fieldList.push({type:'string',value:'deliveryId',text:'当前出货单号',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn1',text:'水泥1配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSn1',text:'水泥1实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn2',text:'水泥2配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSn2',text:'水泥2实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn3',text:'水泥3配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSn3',text:'水泥3实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeFmh',text:'粉煤灰配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualFmh',text:'粉煤灰实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeFjj',text:'粉加剂配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualFjj',text:'粉加剂实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeKf',text:'矿粉配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualKf',text:'矿粉实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeWjj1',text:'添加剂1配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualWjj1',text:'添加剂1实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeWjj2',text:'添加剂2配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualWjj2',text:'添加剂2实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeDsl',text:'大石料(G1)配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualDsl',text:'大石料(G1)实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeZsl',text:'中石料(G2)配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualZsl',text:'中石料(G2)实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeXsl',text:'小石料(S2)配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualXsl',text:'小石料(S2)实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz',text:'沙子(S1)配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSz',text:'沙子(S1)实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz1',text:'沙子1配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSz1',text:'沙子1实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeShui',text:'水配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualShui',text:'水实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeOth1',text:'搅拌时间配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualOth1',text:'搅拌时间实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz2',text:'污水配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSz2',text:'污水实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn4',text:'水泥4配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualSn4',text:'水泥4实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeM17',text:'M17配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualM17',text:'M17实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeM18',text:'M18配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualM18',text:'M18实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeM19',text:'M19配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualM19',text:'M19实际值',dictCode:''})
        fieldList.push({type:'double',value:'recipeM20',text:'M20配方值',dictCode:''})
        fieldList.push({type:'double',value:'actualM20',text:'M20实际值',dictCode:''})
        fieldList.push({type:'int',value:'bslurry',text:'带砂浆否:0 不带 | 1 带',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>