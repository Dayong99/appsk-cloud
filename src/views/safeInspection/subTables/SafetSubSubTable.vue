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

      <template slot="hiddenDangers" slot-scope="text, row">
        <a v-if="row.inspectionResult == 1" @click="skipHiddenDanger(row)">隐患整改</a>
      </template>

      <template slot="polling" slot-scope="text,row">
        <a v-if="row.isTimeout == 0 && row.inspectionStatus == 0" @click="handleAdd();onEdit(row)">巡检</a>
      </template>

    </a-table>
    <safetSubSubTable-modal :tableRowData="tableRowData" ref="modalForm" @ok="modalFormOk"></safetSubSubTable-modal>
  </div>
</template>

<script>
import { getAction } from '@api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SafetSubSubTableModal from '../modules/SafetSubSubTableModal'

export default {
  name: 'SafetSubSubTable',
  mixins: [JeecgListMixin],
  components: {
    SafetSubSubTableModal,
  },
  props: {
    record: {
      type: Object,
      default: null,
    },
    queryCondition: Object,
  },
  data() {
    return {
      description: '安全巡检计划',
      disableMixinCreated: true,
      loading: false,
      dataSource: [],
      tableRowData:null,
      showComponent: false,
      columns: [
        {
          title: '巡检人',
          align: 'center',
          dataIndex: 'inspector_dictText',
        },
        {
          title: '巡检地点',
          align: 'center',
          dataIndex: 'inspectionAddr',
        },
        {
          title: '巡检内容',
          align: 'center',
          dataIndex: 'inspectionContent',
        },
        {
          title: '是否超时',
          align: 'center',
          dataIndex: 'isTimeout_dictText',
        },
        {
          title: '巡检状态',
          align: 'center',
          dataIndex: 'inspectionStatus_dictText',
        },
        {
          title: '巡检时间',
          align: 'center',
          dataIndex: 'inspectionTime',
        },
        {
          title: '巡检结果',
          align: 'center',
          dataIndex: 'inspectionResult_dictText',
        },
        {
          title: '隐患整改',
          align: 'center',
          dataIndex: 'hiddenDangers',
          scopedSlots: { customRender: 'hiddenDangers' },
        },
        {
          title: '巡检',
          dataIndex: 'polling',
          align: 'center',
          scopedSlots: { customRender: 'polling' },
        },
      ],
      url: {
        listByMainId: '/sys/planMain/queryPlanSubByMainId',
      },
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
  created() {
    console.log(9123)
  },
  methods: {
    loadData(record) {
      this.loading = true
      this.dataSource = []
      getAction(this.url.listByMainId, {
        id: record.id,
        inspectionResult: this.queryCondition.inspectionResult,
        inspectionStatus: this.queryCondition.inspectionStatus,
        isTimeout: this.queryCondition.isTimeout,
        personName: this.queryCondition.personName,
      })
        .then((res) => {
          console.log(res)
          if (res.success) {
            this.dataSource = res.result.records
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onEdit(value){
      this.tableRowData = value;
    },
    skipHiddenDanger(value){
      this.$router.push({path:'/safeInspection/qualitySafetyList',query:{dangerId:value.id}});
    } 
  },
}
</script>

<style scoped>
</style>
