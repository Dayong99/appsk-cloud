<template>
  <a-card class="j-inner-table-wrapper" :bordered="false">
    <!-- 查询区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="ee" :form="form">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="计划类型">
              <j-dict-select-tag v-model="queryParam.planType" placeholder="请选择计划类型" dictCode="plan_type" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="巡检人">
              <a-input placeholder="请输入巡检人" v-model="queryParam.personName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否超时">
                <j-dict-select-tag placeholder="请选择是否超时" v-model="queryParam.isTimeout" dictCode="is_timeout" />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="巡检状态">
                <j-dict-select-tag
                  placeholder="请选择巡检状态"
                  v-model="queryParam.inspectionStatus"
                  dictCode="inspection_status"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="巡检结果">
                <j-dict-select-tag
                  placeholder="请选择巡检结果"
                  v-model="queryParam.inspectionResult"
                  dictCode="inspection_result"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span class="table-page-search-submitButtons table-operator">
              <a-button
                type="primary"
                icon="search"
                @click="
                  searchQuery()
                  getSecondaryQueryData()
                "
                >查询</a-button
              >
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                <span>{{ toggleSearchStatus ? '收起' : '展开' }}</span>
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域 end -->

    <!-- 操作按钮区域 begin -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('安全巡检计划主表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            <span>删除</span>
          </a-menu-item>
        </a-menu>
        <a-button>
          <span>批量操作</span>
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!-- 操作按钮区域 end -->

    <!-- table区域 begin -->
    <div>
      <a-alert type="info" showIcon style="margin-bottom: 16px">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600; padding: 0 4px">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :expandedRowKeys="expandedRowKeys"
        :rowSelection="{ selectedRowKeys, onChange: onSelectChange }"
        @expand="handleExpand"
        @change="handleTableChange"
      >
        <!-- 内嵌table区域 begin -->
        <template slot="expandedRowRender" slot-scope="record">
          <a-tabs tabPosition="top">
            <a-tab-pane tab="质量巡检计划" key="planSub" forceRender>
              <plan-sub-sub-table :record="record" :queryCondition="queryCondition" />
            </a-tab-pane>
          </a-tabs>
        </template>
        <!-- 内嵌table区域 end -->

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>

        <template slot="imgSlot" slot-scope="text">
          <div style="font-size: 12px; font-style: italic">
            <span v-if="!text">无图片</span>
            <img v-else :src="getImgView(text)" alt="" style="max-width: 80px; height: 25px" />
          </div>
        </template>

        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else ghost type="primary" icon="download" size="small" @click="downloadFile(text)">
            <span>下载</span>
          </a-button>
        </template>

        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              <span>更多 <a-icon type="down" /></span>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
      <planSubSubTable-modal ref="modalForm" @ok="modalFormOk"></planSubSubTable-modal>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
    <plan-main-modal ref="modalForm" @ok="modalFormOk" />
    
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PlanMainModal from './modules/PlanMainModal'
import PlanSubSubTable from './subTables/PlanSubSubTable'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import PlanSubSubTableModal from './modules/PlanSubSubTableModal'

export default {
  name: 'PlanMainList',
  mixins: [JeecgListMixin],
  components: {
    PlanMainModal,
    PlanSubSubTable,
    JDictSelectTag,
    JSuperQuery,
    PlanSubSubTableModal
  },
  data() {
    return {
      description: '质量巡检',
      form: this.$form.createForm(this),
      // 表头
      columns: [
        {
          title: '#',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => parseInt(index) + 1,
        },
        {
          title: '计划类型',
          align: 'center',
          dataIndex: 'planType_dictText',
        },
        {
          title: '计划起始时间',
          align: 'center',
          dataIndex: 'planStartTime',
        },
        {
          title: '计划终止时间',
          align: 'center',
          dataIndex: 'planEndTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 字典选项
      dictOptions: {},
      // 展开的行test
      expandedRowKeys: [],
      url: {
        list: '/sys/planMain/list?orderType=0',
        delete: '/sys/planMain/delete',
        deleteBatch: '/sys/planMain/deleteBatch',
        exportXlsUrl: '/sys/planMain/exportXls',
        importExcelUrl: '/sys/planMain/importExcel',
      },
      superFieldList: [],
      queryCondition: {},
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl() {
      return window._CONFIG['domianURL'] + this.url.importExcelUrl
    },
  },
  methods: {
    initDictConfig() {},
    handleExpand(expanded, record) {
      this.expandedRowKeys = []
      if (expanded === true) {
        this.expandedRowKeys.push(record.id)
      }
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'int', value: 'planType_dictText', text: '计划类型', dictCode: 'plan_type' })
      fieldList.push({ type: 'date', value: 'planStartTime', text: '计划起始时间' })
      fieldList.push({ type: 'date', value: 'planEndTime', text: '计划终止时间' })
       console.log(this.ipagination)
      this.superFieldList = fieldList
    },
    getSecondaryQueryData() {
      this.queryCondition = this.getQueryParams()
      let key = 'orderType'
      let val = 0
      this.queryCondition[key] = val
    },
  },
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
</style>