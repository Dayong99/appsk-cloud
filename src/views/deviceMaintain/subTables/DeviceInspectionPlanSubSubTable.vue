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
        <div style="font-size: 12px;font-style: italic;">
          <span v-if="!text">无图片</span>
          <img v-else :src="getImgView(text)" alt="" style="max-width:80px;height:25px;"/>
        </div>
      </template>

      <template slot="fileSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
        <a-button
                v-else
                ghost
                type="primary"
                icon="download"
                size="small"
                @click="downloadFile(text)"
        >
          <span>下载</span>
        </a-button>
      </template>
      <template slot="action" slot-scope="index,row">
        <span>
          <a class="mar_r8" @click="inspectionOperation(row.id)" v-if="row.inspectionStatus == 0">检查</a>
        </span>
      </template>
    </a-table>
    <maintain-from ref="operationFrom" :personList="personList" :modelTitle="modelTitle"></maintain-from>
  </div>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getPersonList } from '@api/api'
  import MaintainFrom from './MaintainFrom'

  export default {
    name: 'DeviceInspectionPlanSubSubTable',
    mixins: [JeecgListMixin],
    components: {
      MaintainFrom
    },
    props: {
      record: {
        type: Object,
        default: null,
      }
    },
    data() {
      return {
        description: '设备检查计划附表内嵌列表',
        disableMixinCreated: true,
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '检查人',
            align: 'center',
            dataIndex: 'inspectors_dictText',
          },
          {
            title: '检查设备ID',
            align: 'center',
            dataIndex: 'deviceId_dictText'
          },
          {
            title: '检查内容',
            align: 'center',
            dataIndex: 'inspectionContent',
          },
          {
            title: '是否超时',
            align: 'center',
            dataIndex: 'isTimeout_dictText'
          },
          {
            title: '检查状态',
            align: 'center',
            dataIndex: 'inspectionStatus_dictText'
          },
          {
            title: '检查时间',
            align: 'center',
            dataIndex: 'inspectionTime',
          },
          {
            title: '检查结果',
            align: 'center',
            dataIndex: 'inspectionResult_dictText'
          },
            {
              title: '操作',
              align: 'center',
              dataIndex: 'action',
              align: 'center',
              scopedSlots: { customRender: 'action' },
            }
        ],
        url: {
          listByMainId: '/deviceMaintain/deviceInspectionPlanMain/queryDeviceInspectionPlanSubByMainId',
        },
        personList: [],
        selectId: '',
        modelTitle: '检查'
      }
    },
    watch: {
      record: {
        immediate: true,
        handler() {
          if (this.record != null) {
            this.loadData(this.record)
          }
        }
      }
    },
    methods: {
      inspectionOperation(row) {
        this.selectId = row;
        console.log('row---->', row)
        this.getPersonList();
        this.$refs.operationFrom.edit(row)
        this.$refs.operationFrom.title = '检查'
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
      editInspection(row) {},
      deleteInspection(row) {},
      loadData(record) {
        this.loading = true
        this.dataSource = []
        getAction(this.url.listByMainId, {
          id: record.id
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
          }
        }).finally(() => {
          this.loading = false
        })
      },

    },
  }
</script>

<style scoped lang="less">
  .mar_r8{margin-right: 8px;}
</style>
