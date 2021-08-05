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
                    <div class="hidden_trouble_editing" style="margin: 10px" @click="editDeviceType(item)">编辑</div>
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
                <a-form-item label="设备类型">
                  <j-dict-select-tag
                    placeholder="请选择设备类型"
                    v-model="queryParam.deviceTypeId"
                    dictCode="aoz_device_type,device_type_name,id"
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="设备名称">
                  <a-input placeholder="请输入设备名称" v-model="queryParam.deviceName"></a-input>
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
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('设备表')">导出</a-button>
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
        <device-type-modal ref="typeFrom" @ok="typeModalFormOk"></device-type-modal>
        <device-modal ref="modalForm" @ok="loadDataList" :deviceTypeIofo="deviceTypeIofo"></device-modal>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DeviceModal from './modules/DeviceModal'
import DeviceTypeModal from './modules/DeviceTypeModal'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import { queryDeviceType, queryNoPageDeviceType, deviceTypeDelete } from '@api/api'
import {getAction} from '@api/manage';

export default {
  name: 'DeviceList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    JDictSelectTag,
    DeviceModal,
    JSuperQuery,
    DeviceTypeModal
  },
  data() {
    return {
      disableMixinCreated:true,
      description: '设备表管理页面',
      typeList: [],
      currentpends: 0,
      selectTypeId: '',
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
          title: '设备类型',
          align: 'center',
          dataIndex: 'deviceTypeId_dictText',
        },
        {
          title: '设备名称',
          align: 'center',
          dataIndex: 'deviceName',
        },
        {
          title: '设备照片',
          align: 'center',
          dataIndex: 'devicePic',
          scopedSlots: { customRender: 'imgSlot' },
        },
        {
          title: '设备编号',
          align: 'center',
          dataIndex: 'deviceNumber',
          customRender: function(text) {
            let textObj = text
            // console.log(textObj)
            return textObj?textObj:'-'
            // for (const key in textObj) {
            //   if (Object.hasOwnProperty.call(textObj, key)) {
            //     return textObj['deviceNumber']?textObj['deviceNumber']:'-'
            //   }
            // }
          }
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
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
        list: '/deviceManage/device/list',
        delete: '/deviceManage/device/delete',
        deleteBatch: '/deviceManage/device/deleteBatch',
        exportXlsUrl: '/deviceManage/device/exportXls',
        importExcelUrl: 'deviceManage/device/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
      deviceTypeIofo: {}
    }
  },
  created() {
    this.initTypeTree()
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initTypeTree() {
      queryNoPageDeviceType({
        pageNo: 1,
        pageSize: 10,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        column: 'createTime',
        order: 'desc',
      }).then((res) => {
        const { code, result } = res
        /*if (code == 200) {
          this.typeList = result.records
          this.selectTypeId = result.records[0].id
          this.showVal(result.records[0],0)
          this.queryDataList();
        }*/
        if (code == 200) {
          this.typeList = result
          this.selectTypeId = result[0].id
          this.showVal(result[0],0)
          this.queryDataList();
        }
      })
    },
    deviceHandel() {
      this.loadDataList();
    },
    showVal(item,index) {
      this.currentpends = index
      const { id } = item
      this.deviceTypeIofo.deviceCatagory = item.deviceCatagory;
      this.deviceTypeIofo.deviceTypeId = id;
      this.selectTypeId = id
    },
    // 加载数据
    loadDataList() {
      // 封装查询条件
      let formData = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        deviceTypeId: this.selectTypeId
      }
      // 调用查询数据接口
      this.loading = true
      getAction(this.url.list, formData).then(res => {
        if (res.success) {
          // 将查询的数据赋值给 dataSource
          this.dataSource = res.result.records
          console.log(this.dataSource);
          this.ipagination.total = res.result.total;

          // 重置选择
          this.selectedRows = []
        } else {
          this.$error({title: '主表查询失败', content: res.message})
        }
      }).finally(() => {
        // 这里是无论成功或失败都会执行的方法，在这里关闭loading
        this.loading = false
      })
    },
    // 加载数据
    queryDataList() {
      if (this.currentpends == -1) {
        this.currentpends = 0;
      }
      // 封装查询条件
      let formData = {
        pageNo: 1, pageSize: 10,
        relTenantIds: this.$store.state.user.info.relTenantIds,
        deviceTypeId: this.selectTypeId,
      }
      // 调用查询数据接口
      this.loading = true
      getAction(this.url.list, formData).then(res => {
        if (res.success) {
          // 将查询的数据赋值给 dataSource
          this.dataSource = res.result.records
          // 重置选择
          this.selectedRows = []
        } else {
          this.$error({title: '主表查询失败', content: res.message})
        }
      }).finally(() => {
        // 这里是无论成功或失败都会执行的方法，在这里关闭loading
        this.loading = false
      })
    },
    editDeviceType(record) {
      this.$refs.typeFrom.edit(record);
      this.$refs.typeFrom.title = "编辑";
      this.$refs.typeFrom.disableSubmit = false;
    },
    deleteDeviceType(id) {
      let that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deviceTypeDelete({ id: id }).then((res) => {
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
    addDeviceType() {
      this.$refs.typeFrom.add();
      this.$refs.typeFrom.title = "新增";
      this.$refs.typeFrom.disableSubmit = false;
    },
    typeModalFormOk() {
      this.initTypeTree();
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({
        type: 'string',
        value: 'deviceTypeId',
        text: '设备类型',
        dictCode: 'aoz_device_type,device_type_name,id',
      })
      fieldList.push({ type: 'string', value: 'deviceName', text: '设备名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'devicePic', text: '设备照片', dictCode: '' })
      fieldList.push({ type: 'string', value: 'remarks', text: '备注信息', dictCode: '' })
      fieldList.push({ type: 'date', value: 'updateTime', text: '更新时间' })
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
</style>