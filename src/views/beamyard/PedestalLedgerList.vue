<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="空闲状态">
              <!-- <a-input placeholder="请输入空闲状态" v-model="queryParam.status"></a-input> -->
              <!-- <j-input placeholder="请输入空闲状态" v-model="queryParam.status"></j-input> -->
              <!-- <j-tree-select
                style="width: 300px"
                v-model="treeValue"
                dict="sys_depart,depart_name,id"
                pid-field="parent_id"
              >
              </j-tree-select> -->
              <j-dict-select-tag
                type="list"
                dictCode="pedestal_ledger_status"
                v-model="queryParam.status"
                placeholder="选择台座状态"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="预制场编号">
              <!-- <a-input placeholder="请输入预制场编号" v-model="queryParam.prefabricatedSiteNumber"></a-input> -->
              <j-input placeholder="请输入预制场编号" v-model="queryParam.prefabricatedSiteNumber"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="预制台座编号">
                <!-- <a-input placeholder="请输入预制台座编号" v-model="queryParam.prefabricatedPedestalNumber"></a-input> -->
                <j-input placeholder="请输入预制台座编号" v-model="queryParam.prefabricatedPedestalNumber"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="预制梁类型">
                <!-- <a-input placeholder="请输入预制梁类型" v-model="queryParam.prefabricatedBeamType"></a-input> -->
                <j-input placeholder="请输入预制梁类型" v-model="queryParam.prefabricatedBeamType"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
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
      <a-button type="primary" icon="download" @click="handleExportXls('台座模板下载')">下载模板</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width: 80px; font-size: 12px; font-style: italic"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a @click="handleDetail(record)">详情</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a style="margin-left: 10px">删除</a>
          </a-popconfirm>
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

    <pedestal-ledger-modal ref="modalForm" @ok="modalFormOk"></pedestal-ledger-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PedestalLedgerModal from './modules/PedestalLedgerModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import JInput from '@/components/jeecg/JInput.vue'

export default {
  name: 'PedestalLedgerList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    PedestalLedgerModal,
    JSuperQuery,
  },
  data() {
    return {
      description: '智慧梁场_台座台账管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '空闲状态',
          align: 'center',
          dataIndex: 'status_dictText',
        },
        {
          title: '预制场编号',
          align: 'center',
          dataIndex: 'prefabricatedSiteNumber',
        },
        {
          title: '预制台座编号',
          align: 'center',
          dataIndex: 'prefabricatedPedestalNumber',
        },
        {
          title: '预制台座长（m）',
          align: 'center',
          dataIndex: 'prefabricatedPedestalLength',
        },
        {
          title: '预制台座宽（m）',
          align: 'center',
          dataIndex: 'prefabricatedPedestalWidth',
        },
        {
          title: '预制台座高（m）',
          align: 'center',
          dataIndex: 'prefabricatedPedestalHeight',
        },
        {
          title: '预制梁类型',
          align: 'center',
          dataIndex: 'prefabricatedBeamType',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/beamyard/pedestalLedger/list',
        delete: '/beamyard/pedestalLedger/delete',
        deleteBatch: '/beamyard/pedestalLedger/deleteBatch',
        exportXlsUrl: '/beamyard/pedestalLedger/exportXls',
        importExcelUrl: 'beamyard/pedestalLedger/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      let importExcel = this.url.importExcelUrl + '?relTenantIds=' + this.$store.state.user.info.relTenantIds
      return `${window._CONFIG['domianURL']}/${importExcel}`
    },
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'status', text: '空闲状态', dictCode: 'pedestal_ledger_status' })
      fieldList.push({ type: 'string', value: 'prefabricatedSiteNumber', text: '预制场编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'prefabricatedPedestalNumber', text: '预制台座编号', dictCode: '' })
      fieldList.push({ type: 'double', value: 'prefabricatedPedestalLength', text: '预制台座长（m）', dictCode: '' })
      fieldList.push({ type: 'double', value: 'prefabricatedPedestalWidth', text: '预制台座宽（m）', dictCode: '' })
      fieldList.push({ type: 'double', value: 'prefabricatedPedestalHeight', text: '预制台座高（m）', dictCode: '' })
      fieldList.push({ type: 'string', value: 'prefabricatedBeamType', text: '预制梁类型', dictCode: '' })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>