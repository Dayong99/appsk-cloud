<template>
  <div>
    <a-table
      rowKey="id"
      size="middle"
      bordered
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
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

      <template slot="action" slot-scope="index, row">
        <span>
          <a @click="maintainOperation(row.id)" v-if="row.maintainStatus == 0">保养</a>
          <!-- <a class="mar_r8" @click="editPlan(row)">编辑</a>
        <a @click="deletePlan(row)">删除</a> -->
        </span>
      </template>
    </a-table>
    <maintain-from ref="operationFrom" :personList="personList" :modelTitle="modelTitle"></maintain-from>
  </div>
</template>

<script>
import { getAction } from '@api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MaintainFrom from './MaintainFrom'
import { getPersonList } from '@api/api'

export default {
  name: 'DeviceMaintainPlanSubSubTable',
  mixins: [JeecgListMixin],
  components: {
    MaintainFrom
  },
  props: {
    record: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      description: '设备保养计划附表内嵌列表',
      disableMixinCreated: true,
      loading: false,
      dataSource: [],
      columns: [
        {
          title: '保养人',
          align: 'center',
          dataIndex: 'maintainers_dictText',
        },
        {
          title: '保养设备ID',
          align: 'center',
          dataIndex: 'deviceId_dictText',
        },
        {
          title: '保养内容',
          align: 'center',
          dataIndex: 'maintainContent',
        },
        {
          title: '是否超时',
          align: 'center',
          dataIndex: 'isTimeout_dictText',
        },
        {
          title: '保养状态',
          align: 'center',
          dataIndex: 'maintainStatus_dictText',
        },
        {
          title: '保养时间',
          align: 'center',
          dataIndex: 'maintainTime',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        listByMainId: '/deviceMaintain/deviceMaintainPlanMain/queryDeviceMaintainPlanSubByMainId',
        maintainOperation: '/deviceMaintain/deviceMaintainPlanMain/maintain',
      },
      personList: [],
      selectId: '',
      modelTitle: '保养'
    }
  },
  watch: {
    record: {
      immediate: true,
      handler() {
        if (this.record != null) {
          this.loadData(this.record)
        }
      },
    },
  },
  methods: {
    maintainOperation(record) {
      this.selectId = record;
      console.log('row---->', record)
      this.getPersonList();
      this.$refs.operationFrom.edit(record)
      this.$refs.operationFrom.title = '保养'
      this.$refs.operationFrom.disableSubmit = false
    },
    //获取申报（人员）人员列表
    getPersonList() {
      getPersonList({
        pageNo: 1,
        pageSize: 123250,
        relTenantIds: this.$store.state.user.info.relTenantIds
      }).then((res) => {
        const {success , result} = res;
        if (success) {
          this.personList = result.records;
        }
      })
    },
    loadData(record) {
      console.log('loadData',record)
      this.loading = true
      this.dataSource = []
      getAction(this.url.listByMainId, {
        id: record.id,
      })
        .then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped lang="less">
.mar_r8 {
  margin-right: 8px;
}
</style>
