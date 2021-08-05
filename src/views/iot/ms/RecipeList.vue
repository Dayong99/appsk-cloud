<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="站名">
              <j-input placeholder="请输入站名" v-model="queryParam.stationId"></j-input>
            </a-form-item>
          </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="配比编号">
              <j-input placeholder="请输入配比编号" v-model="queryParam.recipeName"></j-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('拌合站配方表')">导出</a-button>
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

    <recipe-modal ref="modalForm" @ok="modalFormOk"></recipe-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import RecipeModal from './modules/RecipeModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

  export default {
    name: 'RecipeList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      RecipeModal,
      JSuperQuery,
    },
    data () {
      return {
        description: '拌合站配方表管理页面',
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
            title:'配比编号',
            align:"center",
            dataIndex: 'recipeName'
          },
          {
            title:'水泥1',
            align:"center",
            dataIndex: 'recipeSn1'
          },
          {
            title:'水泥2',
            align:"center",
            dataIndex: 'recipeSn2'
          },
          {
            title:'水泥3',
            align:"center",
            dataIndex: 'recipeSn3'
          },
          {
            title:'粉煤灰',
            align:"center",
            dataIndex: 'recipeFmh'
          },
          {
            title:'粉加剂',
            align:"center",
            dataIndex: 'recipeFjj'
          },
          {
            title:'矿粉',
            align:"center",
            dataIndex: 'recipeKf'
          },
          {
            title:'添加剂1',
            align:"center",
            dataIndex: 'recipeWjj1'
          },
          {
            title:'添加剂2',
            align:"center",
            dataIndex: 'recipeWjj2'
          },
          {
            title:'大石料(G1)',
            align:"center",
            dataIndex: 'recipeDsl'
          },
          {
            title:'中石料(G2)',
            align:"center",
            dataIndex: 'recipeZsl'
          },
          {
            title:'小石料(S2)',
            align:"center",
            dataIndex: 'recipeXsl'
          },
          {
            title:'沙子(S1)',
            align:"center",
            dataIndex: 'recipeSz'
          },
          {
            title:'沙子1',
            align:"center",
            dataIndex: 'recipeSz1'
          },
          {
            title:'水',
            align:"center",
            dataIndex: 'recipeShui'
          },
          {
            title:'搅拌时间',
            align:"center",
            dataIndex: 'recipeOth1'
          },
          {
            title:'水泥4',
            align:"center",
            dataIndex: 'recipeSn4'
          },
          {
            title:'污水或粉料单独',
            align:"center",
            dataIndex: 'recipeSz2'
          },
          {
            title:'强度等级',
            align:"center",
            dataIndex: 'intensityLevel'
          },
          {
            title:'抗渗度',
            align:"center",
            dataIndex: 'ksd'
          },
          {
            title:'抗折度',
            align:"center",
            dataIndex: 'kzd'
          },
          {
            title:'塌落度',
            align:"center",
            dataIndex: 'tld'
          },
          {
            title:'沙粒径等级',
            align:"center",
            dataIndex: 'sljdj'
          },
          {
            title:'碎石最大粒径',
            align:"center",
            dataIndex: 'sszdlj'
          },
          {
            title:'水胶比',
            align:"center",
            dataIndex: 'sjb'
          },
          {
            title:'砂率',
            align:"center",
            dataIndex: 'sl'
          },
          {
            title:'表观密度',
            align:"center",
            dataIndex: 'bgmd'
          },
          // {
          //   title:'M17备用',
          //   align:"center",
          //   dataIndex: 'recipeM17'
          // },
          // {
          //   title:'M18备用',
          //   align:"center",
          //   dataIndex: 'recipeM18'
          // },
          // {
          //   title:'M19备用',
          //   align:"center",
          //   dataIndex: 'recipeM19'
          // },
          // {
          //   title:'M20备用',
          //   align:"center",
          //   dataIndex: 'recipeM20'
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
          list: "/ms/recipe/list",
          delete: "/ms/recipe/delete",
          deleteBatch: "/ms/recipe/deleteBatch",
          exportXlsUrl: "/ms/recipe/exportXls",
          importExcelUrl: "ms/recipe/importExcel",

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
        fieldList.push({type:'string',value:'recipeName',text:'配比编号',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn1',text:'水泥1',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn2',text:'水泥2',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn3',text:'水泥3',dictCode:''})
        fieldList.push({type:'double',value:'recipeFmh',text:'粉煤灰',dictCode:''})
        fieldList.push({type:'double',value:'recipeFjj',text:'粉加剂',dictCode:''})
        fieldList.push({type:'double',value:'recipeKf',text:'矿粉',dictCode:''})
        fieldList.push({type:'double',value:'recipeWjj1',text:'添加剂1',dictCode:''})
        fieldList.push({type:'double',value:'recipeWjj2',text:'添加剂2',dictCode:''})
        fieldList.push({type:'double',value:'recipeDsl',text:'大石料(G1)',dictCode:''})
        fieldList.push({type:'double',value:'recipeZsl',text:'中石料(G2)',dictCode:''})
        fieldList.push({type:'double',value:'recipeXsl',text:'小石料(S2)',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz',text:'沙子(S1)',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz1',text:'沙子1',dictCode:''})
        fieldList.push({type:'double',value:'recipeShui',text:'水',dictCode:''})
        fieldList.push({type:'double',value:'recipeOth1',text:'搅拌时间',dictCode:''})
        fieldList.push({type:'double',value:'recipeSn4',text:'水泥4',dictCode:''})
        fieldList.push({type:'double',value:'recipeSz2',text:'污水或粉料单独',dictCode:''})
        fieldList.push({type:'string',value:'intensityLevel',text:'强度等级',dictCode:''})
        fieldList.push({type:'string',value:'ksd',text:'抗渗度',dictCode:''})
        fieldList.push({type:'string',value:'kzd',text:'抗折度',dictCode:''})
        fieldList.push({type:'string',value:'tld',text:'塌落度',dictCode:''})
        fieldList.push({type:'string',value:'sljdj',text:'沙粒径等级',dictCode:''})
        fieldList.push({type:'string',value:'sszdlj',text:'碎石最大粒径',dictCode:''})
        fieldList.push({type:'double',value:'sjb',text:'水胶比',dictCode:''})
        fieldList.push({type:'double',value:'sl',text:'砂率',dictCode:''})
        fieldList.push({type:'double',value:'bgmd',text:'表观密度',dictCode:''})
        fieldList.push({type:'double',value:'recipeM17',text:'M17备用',dictCode:''})
        fieldList.push({type:'double',value:'recipeM18',text:'M18备用',dictCode:''})
        fieldList.push({type:'double',value:'recipeM19',text:'M19备用',dictCode:''})
        fieldList.push({type:'double',value:'recipeM20',text:'M20备用',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>