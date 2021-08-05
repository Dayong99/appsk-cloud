<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24"> </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增进度</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('进度管理-进度计划表')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query> -->
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps"
      >
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

        <template slot="engineeringUnit"  slot-scope="text, record">
          <span>{{record.plannedProductionValue}}</span>
          <span>{{record.productionUnit_dictText}}</span>
        </template>

        <template slot="engineeringUnitTW"  slot-scope="text, record">
          <span>{{record.actualProductionValue}}</span>
          <span>{{record.productionUnit_dictText}}</span>
        </template>

        <template slot="logDetails" slot-scope="text,record">
          <a v-if="text" @click="getLogDetails(record)">日志详情</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleAddLog();getLogID(record)">添加日志</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleAddChild(record)">添加下级</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteNode(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>

    <schedule-manage-logs-modal :logId="logId" ref="modalLogForm" @ok="modalFormOk" @change="handleChange" :id="id" :total="total" :defaultCurrent="defaultCurrent"></schedule-manage-logs-modal>
    <scheduleManagePlan-modal ref="modalForm" @ok="modalFormOk"></scheduleManagePlan-modal>
  </a-card>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import  getUser from '@/store/modules/user'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ScheduleManagePlanModal from './modules/ScheduleManagePlanModal'
import ScheduleManageLogsModal from './modules/ScheduleManageLogsModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { filterObj } from '@/utils/util'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'

export default {
  name: 'ScheduleManagePlanList',
  mixins: [JeecgListMixin],
  components: {
    ScheduleManagePlanModal,
    JSuperQuery,
    ScheduleManageLogsModal
  },
  data() {
    return {
      description: '进度管理-进度计划表管理页面',
      logId:0,
      engineeringUnit:'',
      engineeringUnitTW:'',
      // 表头
      columns: [
        {
          title: '任务名称',
          align: 'left',
          dataIndex: 'taskName',
        },
        {
          title: '工期',
          align: 'left',
          dataIndex: 'duration',
        },
        {
          title: '计划开始时间',
          align: 'left',
          dataIndex: 'planStartTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '计划完成时间',
          align: 'left',
          dataIndex: 'planCompletionTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '实际开始时间',
          align: 'left',
          dataIndex: 'actualStartTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '实际完成时间',
          align: 'left',
          dataIndex: 'actualCompletionTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title:'计划产值',
          align:"left",
          dataIndex: 'plannedProductionValue',
          scopedSlots: { customRender: 'engineeringUnit' }
        },
        {
          title:'实际产值',
          align:"left",
          dataIndex: 'actualProductionValue',
          scopedSlots: { customRender: 'engineeringUnitTW' }
        },
        {
          title: '任务状态',
          align: 'left',
          dataIndex: 'taskStatus_dictText',
        },
        {
          title: '滞后情况',
          align: 'left',
          dataIndex: 'laggingSituation_dictText',
        },
        {
          title:'滞后原因',
          align:"left",
          dataIndex: 'laggingReasons'
        },
        {
          title:'解决措施',
          align:"left",
          dataIndex: 'solution'
        },
        {
          title: '日志详情',
          align: 'center',
          scopedSlots: { customRender: 'logDetails' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 180,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sys/scheduleManagePlan/rootList',
        childList: '/sys/scheduleManagePlan/childList',
        getChildListBatch: '/sys/scheduleManagePlan/getChildListBatch',
        delete: '/sys/scheduleManagePlan/delete',
        deleteBatch: '/sys/scheduleManagePlan/deleteBatch',
        exportXlsUrl: '/sys/scheduleManagePlan/exportXls',
        importExcelUrl: 'sys/scheduleManagePlan/importExcel',
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      dictOptions: {},
      loadParent: false,
      superFieldList: [],
      id:'',
      total:0,
      defaultCurrent:1
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    tableProps() {
      let _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selectedRowKeys: _this.selectedRowKeys,
          onChange: (selectedRowKeys) => (_this.selectedRowKeys = selectedRowKeys),
        },
      }
    },
  },
  methods: {
    loadData(arg) {
      if (arg == 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      let params = this.getQueryParams()
      params.hasQuery = 'true'
      getAction(this.url.list, params)
        .then((res) => {
          if (res.success) {
            let result = res.result
            if (Number(result.total) > 0) {
              this.ipagination.total = Number(result.total)
              this.dataSource = this.getDataByResult(res.result.records)
              return this.loadDataByExpandedRows(this.dataSource)
            } else {
              this.ipagination.total = 0
              this.dataSource = []
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
    loadDataByExpandedRows(dataList) {
      if (this.expandedRowKeys.length > 0) {
        return getAction(this.url.getChildListBatch, { parentIds: this.expandedRowKeys.join(',') }).then((res) => {
          if (res.success && res.result.records.length > 0) {
            //已展开的数据批量子节点
            let records = res.result.records
            const listMap = new Map()
            for (let item of records) {
              let pid = item[this.pidField]
              if (this.expandedRowKeys.join(',').includes(pid)) {
                let mapList = listMap.get(pid)
                if (mapList == null) {
                  mapList = []
                }
                mapList.push(item)
                listMap.set(pid, mapList)
              }
            }
            let childrenMap = listMap
            let fn = (list) => {
              if (list) {
                list.forEach((data) => {
                  if (this.expandedRowKeys.includes(data.id)) {
                    data.children = this.getDataByResult(childrenMap.get(data.id))
                    fn(data.children)
                  }
                })
              }
            }
            fn(dataList)
          }
        })
      } else {
        return Promise.resolve()
      }
    },
    getQueryParams(arg) {
      //获取查询条件
      let sqp = {}
      let param = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      if (arg) {
        param = Object.assign(sqp, this.isorter, this.filters)
      } else {
        param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      }
      if (JSON.stringify(this.queryParam) === '{}' || arg) {
        param.hasQuery = 'false'
      } else {
        param.hasQuery = 'true'
      }
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    searchReset() {
      //重置
      this.expandedRowKeys = []
      this.queryParam = {}
      this.loadData(1)
    },
    getDataByResult(result) {
      if (result) {
        return result.map((item) => {
          //判断是否标记了带有子节点
          if (item[this.hasChildrenField] == '1') {
            let loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      }
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.id)
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          let params = this.getQueryParams(1) //查询条件
          params[this.pidField] = record.id
          params.hasQuery = 'false'
          params.superQueryParams = ''
          getAction(this.url.childList, params).then((res) => {
            if (res.success) {
              if (res.result.records) {
                record.children = this.getDataByResult(res.result.records)
                this.dataSource = [...this.dataSource]
              } else {
                record.children = ''
                record.hasChildrenField = '0'
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    handleAddChild(record) {
      this.loadParent = true
      let obj = {}
      obj[this.pidField] = record['id']
      this.$refs.modalForm.add(obj)
    },
    handleDeleteNode(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.loadData(1)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    batchDel() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return false
      } else {
        let ids = ''
        let that = this
        that.selectedRowKeys.forEach(function (val) {
          ids += val + ','
        })
        that.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            that.handleDeleteNode(ids)
            that.onClearSelected()
          },
        })
      }
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'taskName', text: '任务名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'duration', text: '工期', dictCode: '' })
      fieldList.push({ type: 'date', value: 'planStartTime', text: '计划开始时间' })
      fieldList.push({ type: 'date', value: 'planCompletionTime', text: '计划完成时间' })
      fieldList.push({ type: 'date', value: 'actualStartTime', text: '实际开始时间' })
      fieldList.push({ type: 'date', value: 'actualCompletionTime', text: '实际完成时间' })
      fieldList.push({type:'string',value:'productionUnit',text:'产值单位',dictCode:'project_manage_investment_scale_unit'})
      fieldList.push({type:'BigDecimal',value:'plannedProductionValue',text:'计划产值',dictCode:''})
      fieldList.push({type:'BigDecimal',value:'actualProductionValue',text:'实际产值',dictCode:''})
      fieldList.push({ type: 'int', value: 'taskStatus', text: '任务状态', dictCode: 'task_status' })
      fieldList.push({ type: 'int', value: 'laggingSituation', text: '滞后情况', dictCode: 'lagging_situation' })
      fieldList.push({type:'string',value:'laggingReasons',text:'滞后原因',dictCode:''})
      fieldList.push({type:'string',value:'solution',text:'解决措施',dictCode:''})
      fieldList.push({ type: 'string', value: 'pid', text: '父级节点', dictCode: '' })
      this.superFieldList = fieldList
    },
    getLogDetails(value){
      let that = this;
      // handleDetail()
      that.id = value.id;
      let params = {
          sysOrgCode : getUser.state.info.orgCode,
          relTenantIds : getUser.state.info.relTenantIds,
          planId : value.id,
          pageNo: 1,
          pageSize: 1
        };
        getAction("/sys/scheduleManageLogs/list",params).then((res) => {
          that.handleDetailLog(res.result.records[0])
          that.total = res.result.total
        })
    },
    getLogID(value){
      console.log(value.id)
      this.logId = value.id
    },
    handleChange(res){
      this.handleDetailLog(res.result.records[0])
    }
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>