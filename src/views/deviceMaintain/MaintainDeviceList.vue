<template>
  <a-row :gutter="10">
    <a-col :md="5" :sm="24">
      <a-card @click="deviceHandel">
        <div id="title-type">设备类型</div>
        <div>
          <div
            v-for="(item, index) in typeList"
            :key="index"
            class="itemlist"
            :class="{ currentpend: currentpends == index }"
            @click="showVal(item, index)"
          >
            <div class="dictext"></div>
            <div style="padding-left: 20px">{{ item.deviceTypeName }}</div>
            <div id="components-popover-demo-placement">
              <div :style="{ width: `10px`, marginLeft: `40 + 24}px` }">
                <a-popover placement="right">
                  <template slot="content">
                    <div class="hidden_trouble_editing" style="margin: 10px" @click="aeditDeviceType(item)">编辑</div>
                    <div class="hidden_trouble_editing" style="margin: 10px" @click="deleteDeviceType(item.id)">
                      删除
                    </div>
                  </template>
                  <img
                    :src="
                      currentpends == index ? require('@/assets/hazardType-point.png') : require('@/assets/blacks.png')
                    "
                    style="right: 26px"
                    alt=""
                  />
                </a-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="unitpent">
          <img src="" alt="" />
          <div @click="addDeviceType()">
            <a-icon type="plus" />
            添加设备类型
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="设备名称">
                  <a-input placeholder="请输入设备名称" v-model="queryParam.deviceName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="7" :lg="7" :md="8" :sm="24">
                <a-form-item label="设备运行状态">
                  <a-select v-model="queryParam.deviceRunStatus" placeholder="设备运行状态" style="width: 150px">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in runState" :key="item.state">{{ item.text }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                  <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                  </a> -->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 查询区域-END -->

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button type="primary" icon="download" @click="handleAdd(5)">打印二维码</a-button>
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
            <template slot="dictText" slot-scope="text, record">
              <span :class="{ redColor: record.deviceRunStatus == 1, greenColor: record.deviceRunStatus == 0 }">{{
                record.deviceRunStatus_dictText
              }}</span>
            </template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
              <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
                下载
              </a-button>
            </template>
            <template slot="serviceLog" slot-scope="text, record">
              <a @click="checkServiceLog(record)">查看</a>
            </template>

            <span slot="action" slot-scope="text, record">
              <template v-if="record.deviceRunStatus == 0">
                <a class="redColor mar_8" @click="devOperation(0, record)">停用</a>
                <a class="mar_8" @click="showModel(1, record)">申报维修</a>
                <a @click="showModel(3, record)">保养</a>
              </template>
              
              <template v-else-if="record.deviceRunStatus == 1">
                <a class="redColor mar_8" @click="devOperation(0, record)">停用</a>
                <a class="mar_8" @click="showModel(2, record)">维修</a>
                <a @click="showModel(3, record)">保养</a>
              </template>

              <template v-else>
                <a class="mar_8" @click="devOperation(1, record)">启用</a>
              </template>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleDetail(record)">详情</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleEdit(record)">编辑</a>
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
        <add-device-type-from ref="typeFrom" @ok="typeFromOK"></add-device-type-from>
        <maintain-device-modal ref="modalForm" @ok="loadDataList" :deviceTypeId="selectTypeId"></maintain-device-modal>
        <device-operation
          ref="operation"
          @ok="loadDataList"
          :operationModelType="operationModelType"
          :declarantList="declarantList"
          :repairManList="repairManList"
        ></device-operation>
        <print ref="modalForm1" @ok="modalFormOk"></print>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, putAction } from '@api/manage'
import { getDevTypeTree, deleteDevType, getPersonList, getSpecialPersonList } from '@api/api'
import AddDeviceTypeFrom from './modules/AddDeviceTypeFrom'
import MaintainDeviceModal from './modules/MaintainDeviceModal'
import DeviceOperation from './modules/DeviceOperation'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import Template1 from '../jeecg/JVxeDemo/layout-demo/Template1.vue'
import print from './modules/print'
import moment from 'moment'

export default {
  name: 'MaintainDeviceList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    JDictSelectTag,
    AddDeviceTypeFrom,
    MaintainDeviceModal,
    DeviceOperation,
    JSuperQuery,
    Template1,
    print,
  },
  data() {
    return {
      disableMixinCreated: true,
      typeList: [],
      runState: [
        { text: '正常', state: 0 },
        { text: '待维修', state: 1 },
        { text: '停用', state: 2 },
      ],
      currentpends: 0,
      selectTypeId: '',
      operationModelType: 1,
      declarantList: [],
      repairManList: [],
      description: '设备养护-设备表管理页面',
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
          title: '设备名称',
          align: 'center',
          dataIndex: 'deviceName',
        },
        {
          title: '设备唯一编号',
          align: 'center',
          dataIndex: 'deviceNumber',
        },
        {
          title: '设备位置',
          align: 'center',
          dataIndex: 'deviceLocation',
        },
        {
          title: '指定操作人',
          align: 'center',
          dataIndex: 'operator_dictText',
        },
        {
          title: '设备运行状态',
          align: 'center',
          dataIndex: 'deviceRunStatus_dictText',
          scopedSlots: { customRender: 'dictText' },
        },
        {
          title: '设备附件',
          align: 'center',
          dataIndex: 'attachment',
          scopedSlots: { customRender: 'fileSlot' },
        },
        {
          title: '维保记录',
          align: 'center',
          dataIndex: 'serviceLog',
          scopedSlots: { customRender: 'serviceLog' },
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
        list: '/deviceMaintain/maintainDevice/list',
        delete: '/deviceMaintain/maintainDevice/delete',
        deleteBatch: '/deviceMaintain/maintainDevice/deleteBatch',
        exportXlsUrl: '/deviceMaintain/maintainDevice/exportXls',
        importExcelUrl: 'deviceMaintain/maintainDevice/importExcel',
        operation: '/deviceMaintain/maintainDevice/operation',
        declaran: '/person/person/list',
        repairMan: '/deviceMaintain/deviceSpecialists/list',
      },
      dictOptions: {},
      superFieldList: [],
      deviceTypeCode: '',
      relTenantIds: '' //租户id
    }
  },
  created() {
    this.relTenantIds = this.$store.state.user.info.relTenantIds;
    this.initTypeTree();
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initTypeTree() {
      getDevTypeTree({
        relTenantIds: this.relTenantIds,
        pageNo: 1,
        pageSize: 10,
      }).then((res) => {
        const { code, result } = res
        if (code == 200) {
          this.typeList = result.records
          this.selectTypeId = result.records[0].id
          this.queryDataList()
        }
      })
    },
    deviceHandel() {
      this.loadDataList()
    },

    showVal(item, index) {
      this.currentpends = index
      const { id } = item
      this.selectTypeId = id
    },
    // 加载数据
    loadDataList() {
      // 封装查询条件
      let formData = {
        pageNo: 1,
        pageSize: 10,
        relTenantIds: this.relTenantIds,
        deviceTypeId: this.selectTypeId,
      }
      // 调用查询数据接口
      this.loading = true
      getAction(this.url.list, formData)
        .then((res) => {
          if (res.success) {
            // 将查询的数据赋值给 dataSource
            this.dataSource = res.result.records
            // 重置选择
            this.selectedRows = []
          } else {
            this.$error({ title: '主表查询失败', content: res.message })
          }
        })
        .finally(() => {
          // 这里是无论成功或失败都会执行的方法，在这里关闭loading
          this.loading = false
        })
    },
    operationOK() {
      this.loadDataList()
    },
    // 加载数据
    queryDataList() {
      if (this.currentpends == -1) {
        this.currentpends = 0
      }
      // 封装查询条件
      let formData = {
        pageNo: 1,
        pageSize: 10,
        relTenantIds: this.relTenantIds,
        deviceTypeId: this.selectTypeId,
      }
      // 调用查询数据接口
      this.loading = true
      getAction(this.url.list, formData)
        .then((res) => {
          if (res.success) {
            // 将查询的数据赋值给 dataSource
            this.dataSource = res.result.records
            // 重置选择
            this.selectedRows = []
          } else {
            this.$error({ title: '主表查询失败', content: res.message })
          }
        })
        .finally(() => {
          // 这里是无论成功或失败都会执行的方法，在这里关闭loading
          this.loading = false
        })
    },
    aeditDeviceType(record) {
      this.$refs.typeFrom.edit(record)
      this.$refs.typeFrom.title = '编辑'
      this.$refs.typeFrom.disableSubmit = false
    },
    addDeviceType() {
      this.$refs.typeFrom.add()
      this.$refs.typeFrom.title = '新增'
      this.$refs.typeFrom.disableSubmit = false
    },
    deleteDeviceType(id) {
      let _this = this
      let that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteDevType({ id: id }).then((res) => {
            that.initTypeTree()
            if (res.code == 200) {
              that.$message.success('删除成功')
            } else {
              that.$message.warning('删除失败')
            }
          })
        },
      })
    },
    //重置
    searchReset() {
      this.loadDataList();
      this.queryParam.deviceName="";
      this.queryParam.deviceRunStatus="";
    },
    typeFromOK() {
      this.initTypeTree()
    },
    handleTableChange(val) {
    },
    //table操作
    devOperation(type, record) {
      let operator = this.$store.state.user.info.phone
      let sysOrgCode = this.$store.state.user.info.orgCode
      let operatorTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
      let that = this
      let data = {}
      switch (type) {
        case 0:
          that.$confirm({
            title: '停用提醒',
            content: '您确定要停用该设备?',
            onOk: function () {
              that.operationAction(0, {
                deviceId: record.id,
                operatorType: 3,
                operator: operator,
                relTenantIds: that.relTenantIds,
                sysOrgCode: sysOrgCode,
                filePath: '',
                describes: '',
                operatorTime: operatorTime,
              })
            },
          })
          break
        case 1:
          that.$confirm({
            title: '启用提醒',
            content: '您确定要启用该设备?',
            onOk: function () {
              that.operationAction(1, {
                deviceId: record.id,
                operatorType: 4,
                operator: operator,
                relTenantIds: that.relTenantIds,
                sysOrgCode: sysOrgCode,
                filePath: '',
                describes: '',
                operatorTime: operatorTime,
              })
            },
          })
          break
        default:
          break
      }
    },
    //申报维修
    showModel(modelType, record) {
      modelType == 1? this.operationModelType = 1:modelType == 2? this.operationModelType = 2:this.operationModelType = 0;
      this.deviceTypeCode = record.deviceTypeId;
      this.getRepairManList();
      this.getDeclarantList();
      this.$refs.operation.operationHandle(record)
      this.$refs.operation.title = modelType == 1 ? '申报维修' : modelType == 2 ? '维修' : '保养'
      this.$refs.operation.formTitle = modelType == 1 ? '申报' : modelType == 2 ? '维修' : '保养'
      this.$refs.operation.disableSubmit = false
    },
    //设备启用&停用
    operationAction(type, data) {
      this.loading = true
      putAction(this.url.operation, data)
        .then((res) => {
          if (res.success) {
            this.$message.success(
              type == 0 ? '设备已停用' : '设备已启用'
            )
            this.loadDataList()
          } else {
            this.$error({ title: '操作失败', content: res.message })
          }
        })
        .finally(() => {
          // 这里是无论成功或失败都会执行的方法，在这里关闭loading
          this.loading = false
        })
    },

    //获取申报（人员）人员列表
    getDeclarantList() {
      getPersonList({
        pageNo: 1,
        pageSize: 100,
        relTenantIds: this.relTenantIds
      }).then((res) => {
        const {success , result} = res;
        if (success) {
          this.declarantList = result.records;
        }
      })
    },
    //获取维修人员（特种人员）列表
    getRepairManList() {
      getSpecialPersonList({
        personType : 1,
        deviceType: this.deviceTypeCode,
        relTenantIds: this.relTenantIds
      }).then((res)=> {
        const {success , result} = res;
        if(success){
          this.repairManList = result.records;
        }
      })
      
    },
    //查看维保记录
    checkServiceLog(row) {
      console.log('查看维保记录',row.id);
      this.$router.push({
        path: '/deviceMaintain/maintainRecord',
        query: {
          deviceId: row.id
        }
      });
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({
        type: 'string',
        value: 'deviceTypeId',
        text: '设备类型id',
        dictCode: 'aoz_device_maintain_type,device_type_name,id',
      })
      fieldList.push({ type: 'string', value: 'deviceName', text: '设备名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'deviceNumber', text: '设备唯一编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'deviceLocation', text: '设备位置', dictCode: '' })
      fieldList.push({
        type: 'string',
        value: 'operator',
        text: '指定操作人',
        dictCode: 'aoz_device_specialists,person_name,person_phone',
      })
      // fieldList.push({ type: 'int', value: 'deviceRunStatus', text: '设备运行状态', dictCode: 'device_run_status' })
      fieldList.push({ type: 'string', value: 'attachment', text: '附件', dictCode: '' })
      fieldList.push({ type: 'string', value: 'remarks', text: '备注信息', dictCode: '' })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

.itemlist {
  display: flex;
  height: 50px;
  line-height: 50px;
  margin: 10px auto;
  position: relative;
  cursor: pointer;

  .dictext {
  }

  .editdelete {
    position: absolute;
    display: none;
    right: -81px;
    top: 0px;
    z-index: 99;
    background: #fff;
    border: 1px solid #e7e7e7;
    width: 55px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }

  img {
    position: absolute;
    right: 3px;
    top: 14px;
  }
}

.unitpent {
  border: 1px solid #e7e7e7;
  height: 43px;
  line-height: 13px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
}

.editshow {
  display: block !important;
}

.currentpend {
  background: #1890ff;
  color: #fff;
  border-radius: 5px;
}

#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}

#title-type {
  font-weight: bold;
  font-size: 18px;
}

.hidden_trouble_editing:hover {
  cursor: pointer;
  border-bottom: 1px solid #649aff;
}
.hidden_trouble_editing {
  border-bottom: 1px solid #ffffff;
}
.redColor {
  color: red;
}
.greenColor {
  color: green;
}
.mar_8 {
  margin-right: 8px;
}
</style>