<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="桥名">
              <!-- <a-input placeholder="请输入桥名" v-model="queryParam.bridgeName"></a-input> -->
              <j-input placeholder="请输入桥名" v-model="queryParam.bridgeName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="桥孔编号">
              <j-input placeholder="请输入桥孔编号" v-model="queryParam.bridgeHoleNumber"></j-input>
              <!-- <j-input placeholder="请输入桥孔编号" v-model="queryParam.bridgeHoleNumber"></j-input> -->
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <j-form-item label="对应墩号">
                <!-- <a-input placeholder="请输入对应墩号" v-model="queryParam.correspondingPierNumber"></a-input> -->
                <j-input placeholder="请输入对应墩号" v-model="queryParam.correspondingPierNumber"></j-input>
              </j-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="梁编号">
                <j-input placeholder="请输入梁编号" v-model="queryParam.beamNumber"></j-input>
                <!-- <j-input placeholder="请输入梁编号" v-model="queryParam.beamNumber"></j-input> -->
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <!-- <a-form-item label="施工工序">
                <a-input placeholder="请输入施工工序" v-model="queryParam.structStatusSort"></a-input>
              </a-form-item> -->
              <a-form-item label="施工工序">
                <j-dict-select-tag placeholder="请选择施工工序" vv-model="queryParam.structStatusSort" dictCode="aoz_beam_yard_struct_status,struct_status,tenant_id_sort"></j-dict-select-tag>
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
      <a-button type="primary" icon="download" @click="handleExportXls('小箱梁模板下载')">下载模板</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="handleAdd(5)">打印二维码</a-button>
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
          <a @click="handleDetail(record)">详情</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a style="margin-left:10px;">删除</a>
                </a-popconfirm>
          <a-divider type="vertical" />
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>

                <a @click="handleEdit(record)">编辑</a>
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

    <struct-ledger-modal ref="modalForm" @ok="modalFormOk"></struct-ledger-modal>
    <print ref="modalForm1" @ok="modalFormOk"></print>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StructLedgerModal from './modules/StructLedgerModal'
    import print from './modules/print'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
import JDictSelectTag from '../../components/dict/JDictSelectTag.vue'

  export default {
    name: 'StructLedgerList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      StructLedgerModal,
      JSuperQuery,
      print
    },
     data () {
      return {
        description: '智慧梁场_构件台账管理页面',
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
            title:'桥名',
            align:"center",
            dataIndex: 'bridgeName'
          },
          {
            title:'桥孔编号',
            align:"center",
            dataIndex: 'bridgeHoleNumber'
          },
          {
            title:'对应墩号',
            align:"center",
            dataIndex: 'correspondingPierNumber'
          },
          {
            title:'梁编号',
            align:"center",
            dataIndex: 'beamNumber'
          },
          {
            title:'中/边梁',
            align:"center",
            dataIndex: 'centerOrSideBeam'
          },
          {
            title:'理论跨径（cm）',
            align:"center",
            dataIndex: 'theoreticalSpan'
          },
          {
            title:'标准梁长（cm）',
            align:"center",
            dataIndex: 'standardBeamLength'
          },
          {
            title:'（N-1）号墩顶伸缩缝类型',
            align:"center",
            dataIndex: 'n1pierTopExpansionJointType'
          },
          {
            title:'（N）号墩顶伸缩缝类型',
            align:"center",
            dataIndex: 'npierTopExpansionJointType'
          },
          {
            title:'预制梁长（cm）',
            align:"center",
            dataIndex: 'prefabricatedBeamLength'
          },
          {
            title:'梁长差值（cm）',
            align:"center",
            dataIndex: 'beamLengthDifference'
          },
          {
            title:'小箱梁预制横坡i（%）',
            align:"center",
            dataIndex: 'smallBgpcsI'
          },
          {
            title:'砼方量（m³）',
            align:"center",
            dataIndex: 'concreteVolume'
          },
          {
            title:'HRB400',
            align:"center",
            dataIndex: 'hrb400'
          },
          {
            title:'HPB300',
            align:"center",
            dataIndex: 'hpb300'
          },
          {
            title:'钢绞线（kg）',
            align:"center",
            dataIndex: 'steelStrand'
          },
          {
            title:'施工工序',
            align:"center",
            dataIndex: 'structStatusSort_dictText'
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
          list: "/beamyard/structLedger/list",
          delete: "/beamyard/structLedger/delete",
          deleteBatch: "/beamyard/structLedger/deleteBatch",
          exportXlsUrl: "/beamyard/structLedger/exportXls",
          importExcelUrl: "beamyard/structLedger/importExcel"

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
        let importExcel=this.url.importExcelUrl+'?relTenantIds='+this.$store.state.user.info.relTenantIds
        return `${window._CONFIG['domianURL']}/${importExcel}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'bridgeName',text:'桥名',dictCode:''})
        fieldList.push({type:'int',value:'bridgeHoleNumber',text:'桥孔编号',dictCode:''})
        fieldList.push({type:'string',value:'correspondingPierNumber',text:'对应墩号',dictCode:''})
        fieldList.push({type:'int',value:'beamNumber',text:'梁编号',dictCode:''})
        fieldList.push({type:'string',value:'centerOrSideBeam',text:'中/边梁',dictCode:''})
        fieldList.push({type:'double',value:'theoreticalSpan',text:'理论跨径（cm）',dictCode:''})
        fieldList.push({type:'double',value:'standardBeamLength',text:'标准梁长（cm）',dictCode:''})
        fieldList.push({type:'string',value:'n1pierTopExpansionJointType',text:'（N-1）号墩顶伸缩缝类型',dictCode:''})
        fieldList.push({type:'string',value:'npierTopExpansionJointType',text:'（N）号墩顶伸缩缝类型',dictCode:''})
        fieldList.push({type:'double',value:'prefabricatedBeamLength',text:'预制梁长（cm）',dictCode:''})
        fieldList.push({type:'double',value:'beamLengthDifference',text:'梁长差值（cm）',dictCode:''})
        fieldList.push({type:'double',value:'smallBgpcsI',text:'小箱梁预制横坡i（%）',dictCode:''})
        fieldList.push({type:'double',value:'concreteVolume',text:'砼方量（m³）',dictCode:''})
        fieldList.push({type:'double',value:'hrb400',text:'HRB400',dictCode:''})
        fieldList.push({type:'double',value:'hpb300',text:'HPB300',dictCode:''})
        fieldList.push({type:'double',value:'steelStrand',text:'钢绞线（kg）',dictCode:''})
        fieldList.push({type:'string',value:'pedestalId',text:'关联台座',dictCode:'aoz_beam_yard_pedestal_ledger,prefabricated_pedestal_number,id'})
        fieldList.push({type:'int',value:'structStatusSort',text:'施工工序',dictCode:'aoz_beam_yard_struct_status,struct_status,tenant_id_sort'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>