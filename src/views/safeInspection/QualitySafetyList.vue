<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="检查人">
              <a-input placeholder="请输入检查人" v-model="queryParam.inspector"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="检查时间">
              <j-date
                :show-time="false"
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
                class="query-group-cust"
                v-model="queryParam.inspectTime_begin"
              ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date
                :show-time="false"
                date-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
                class="query-group-cust"
                v-model="queryParam.inspectTime_end"
              ></j-date>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="隐患类别">
                <j-dict-select-tag
                  placeholder="请选择隐患类别"
                  @changehtm="loadOptions"
                  v-model="queryParam.hazardTypeId"
                  dictCode="aoz_sys_inspection_hazard_type,hazard_type_name,id"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="隐患事件">
                <!--<j-dict-select-tag placeholder="请选择隐患事件" v-model="queryParam.hazardContentId" dictCode="aoz_sys_inspection_hazard_library,hazard_content,id"/>-->
                <!-- <a-select v-model="queryParam.hazardContentId" placeholder="请选择隐患事件">
                  <a-select-option :value="undefined">请选择</a-select-option>
                  <a-select-option v-for="(item, key) in eventOptions" :key="key" :value="item.value" @click="getSelectValue(item.text)">
                    <span  :title="item.text || item.label">
                      {{ item.text || item.label }}
                    </span>
                  </a-select-option>
                </a-select> -->

                <a-select @change="getSelectValue">
                  <a-select-option :value="undefined">请选择</a-select-option>
                  <a-select-option
                    v-for="(item, key) in eventOptions"
                    :key="key"
                    :value="item.text"
                    placeholder="请选择隐患事件"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="问题分类">
                <j-dict-select-tag placeholder="请选择问题分类" v-model="queryParam.inspectProblemClassify" dictCode="inspect_problem_classify"/>
              </a-form-item>
            </a-col> -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否超时">
                <j-dict-select-tag
                  placeholder="请选择是否超时"
                  v-model="queryParam.repairIsOutTime"
                  dictCode="is_timeout"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="整改状态">
                <j-dict-select-tag
                  placeholder="请选择整改状态"
                  v-model="queryParam.orderStatus"
                  dictCode="correction_status"
                />
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('安全问题')">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
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

    <quality-safety-modal :pollingResult="pollingResult" ref="modalForm" @ok="modalFormOk"></quality-safety-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import  getUser from '@/store/modules/user'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import QualitySafetyModal from './modules/QualitySafetyModal'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import { ajaxGetDictItems } from '@/api/api'
export default {
  name: 'QualitySafetyList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    JDictSelectTag,
    JDate,
    QualitySafetyModal,
    JSuperQuery,
  },
  data() {
    return {
      description: '质量安全管理页面',
      eventOptions: [],
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
          title: '检查人',
          align: 'center',
          dataIndex: 'inspector_dictText',
        },
        {
          title: '检查时间',
          align: 'center',
          dataIndex: 'inspectTime',
        },
        {
          title: '责任人',
          align: 'center',
          dataIndex: 'inspectDutyPerson_dictText',
        },
        {
          title: '隐患类别',
          align: 'center',
          dataIndex: 'hazardTypeId_dictText',
        },
        {
          title: '隐患事件',
          align: 'center',
          dataIndex: 'hazardContentId_dictText',
        },
        {
          title: '整改期限',
          align: 'center',
          dataIndex: 'inspectValidityTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '整改人',
          align: 'center',
          dataIndex: 'repairer_dictText',
        },
        {
          title: '整改时间',
          align: 'center',
          dataIndex: 'repairTime',
        },
        {
          title: '是否超时',
          align: 'center',
          dataIndex: 'repairIsOutTime_dictText',
        },
        {
          title: '验收人',
          align: 'center',
          dataIndex: 'checkPerson_dictText',
        },
        {
          title: '验收时间',
          align: 'center',
          dataIndex: 'checkTime',
        },
        {
          title: '是否合格',
          align: 'center',
          dataIndex: 'checkStatus_dictText',
        },
        {
          title: '整改状态',
          align: 'center',
          dataIndex: 'orderStatus_dictText',
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
        list: '/sys/qualitySafety/list?orderType=1',
        delete: '/sys/qualitySafety/delete',
        deleteBatch: '/sys/qualitySafety/deleteBatch',
        exportXlsUrl: '/sys/qualitySafety/exportXls?orderType=1',
        importExcelUrl: 'sys/qualitySafety/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
      pollingResult:'',
    }
  },
  created() {
    this.getSuperFieldList()
    this.pollingQualityProblem()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    loadOptions(val) {
     // debugger
      this.queryParam.hazardContentId = ''
      let dictCodes =
        'aoz_sys_inspection_hazard_library,hazard_content,id' +
        ',rel_tenant_ids=' +
        this.$store.state.user.newValue +
        ',hazard_type_id=' +
        val
      ajaxGetDictItems(dictCodes, null).then((res) => {
        if (res.success) {
          console.log(res.result)
          this.eventOptions = res.result
        }
      })
    },
    getSelectValue(n){
      console.log(n)
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'inspector', text: '检查人', dictCode: 'aoz_person,person_name,phone' })
      fieldList.push({ type: 'datetime', value: 'inspectTime', text: '检查时间' })
      fieldList.push({
        type: 'string',
        value: 'inspectDutyPerson',
        text: '责任人',
        dictCode: 'aoz_person,person_name,phone',
      })
      fieldList.push({ type: 'string', value: 'inspectProblemArea', text: '问题部位', dictCode: '' })
      fieldList.push({
        type: 'string',
        value: 'hazardTypeId',
        text: '隐患类别',
        dictCode: 'aoz_sys_inspection_hazard_type,hazard_type_name,id',
      })
      fieldList.push({
        type: 'string',
        value: 'hazardContentId',
        text: '隐患事件',
        dictCode: 'aoz_sys_inspection_hazard_library,hazard_content,id',
      })
      fieldList.push({ type: 'string', value: 'inspectContent', text: '需整改内容', dictCode: '' })
      fieldList.push({ type: 'date', value: 'inspectValidityTime', text: '整改期限' })
      fieldList.push({ type: 'string', value: 'inspectPath', text: '需整改图片', dictCode: '' })
      fieldList.push({ type: 'string', value: 'repairer', text: '整改人', dictCode: 'aoz_person,person_name,phone' })
      fieldList.push({ type: 'datetime', value: 'repairTime', text: '整改时间' })
      fieldList.push({ type: 'int', value: 'repairIsOutTime', text: '是否超时', dictCode: 'is_timeout' })
      fieldList.push({ type: 'string', value: 'checkPerson', text: '验收人', dictCode: 'aoz_person,person_name,phone' })
      fieldList.push({ type: 'datetime', value: 'checkTime', text: '验收时间' })
      fieldList.push({ type: 'int', value: 'checkStatus', text: '是否合格', dictCode: 'is_qualified' })
      fieldList.push({ type: 'int', value: 'orderStatus', text: '整改状态', dictCode: 'correction_status' })
      fieldList.push({ type: 'string', value: 'remarks', text: '备注信息', dictCode: '' })
      this.superFieldList = fieldList
    },
    pollingQualityProblem() {
      let that = this;
      //巡检页跳转新增
      if (this.$route.query.pollingResult != '' && typeof this.$route.query.pollingResult != 'undefined' ) {
        this.pollingResult = this.$route.query.polling
        setTimeout(() => {
          this.handleAdd();
        }, 500);

      }
       //巡检整改跳转详情
      if(typeof this.$route.query.dangerId != 'undefined'){
        let params = {
          sysOrgCode : getUser.state.info.orgCode,
          relTenantIds : getUser.state.info.relTenantIds,
          planId : this.$route.query.dangerId,
          orderType:1
        };
        getAction("/sys/qualitySafety/list",params).then((res) => {
          that.handleDetail(res.result.records[0])
        })
      }
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';

</style>