<template>
  <a-row :gutter="10">
    <a-col :md="5" :sm="24">
      <a-card @click="userclick">
        <div id="title-type">隐患类型</div>
        <div>
          <div v-for="(item,index) in itemlist" :key="index" class="itemlist" @click="showVal(item,index)"
               :class="{currentpend:currentpends==index}">
            <div class="dictext"></div>
            <div style="padding-left:20px">{{item.hazardTypeName}}</div>
            <div id="components-popover-demo-placement">
              <div :style="{ width: `10px`, marginLeft: `40 + 24}px` }">
                <a-popover placement="right">
                  <template slot="content">
                    <div class="hidden_trouble_editing" style="margin:10px" @click="addcontractoredit(item)">编辑</div>
                    <div class="hidden_trouble_editing" style="margin:10px" @click="deleteID(item.id)">删除</div>
                  </template>
                  <img :src="currentpends==index?require('@/assets/hazardType-point.png'):require('@/assets/blacks.png')" style="right:26px" alt="">
                </a-popover>

              </div>
            </div>
          </div>
        </div>
        <div class="unitpent" @click="addcontractor">
          <img src="" alt="">
          <div>添加隐患类型</div>
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
                <a-form-item label="隐患事件">
                  <j-input placeholder="请输入隐患事件" ref="describe" v-model="queryParam.hazardContent"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="queryDataList" icon="search">查询</a-button>
                  <a-button type="primary" @click="resetInquire()" icon="reload" style="margin-left: 8px">重置</a-button>
                  <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
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
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel">
                <a-icon type="delete"/>
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
            selectedRowKeys.length }}</a>项
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
              <img v-else :src="getImgView(text)" height="25px" alt=""
                   style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical"/>
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
        <hazard-type-form ref="modalForm1" @ok="modalFormOk1"></hazard-type-form>
        <hazard-library-modal :hazardTypeId="hazardTypeId" ref="modalForm" @ok="loadDataList"
                              :itemids="itemids"></hazard-library-modal>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import {mixinDevice} from '@/utils/mixin';
  import {JeecgListMixin} from '@/mixins/JeecgListMixin';
  import HazardLibraryModal from './modules/HazardLibraryModal';
  import HazardTypeForm from './modules/HazardTypeForm';
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil';
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  import {danger, dangerdelete} from '@/api/api';
  import {getAction} from '@api/manage';
  import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'HazardLibraryList',
    mixins: [JeecgListMixin, mixinDevice],
    components: {
      HazardLibraryModal,
      JSuperQuery,
      HazardTypeForm,
      JInput
    },
    data() {
      return {
        description: '隐患库管理页面',
        currentpends: 0,
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '隐患事件',
            align: "center",
            dataIndex: 'hazardContent'
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remarks'
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createBy_dictText'
          },
          {
            title: '创建日期',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: {customRender: 'action'}
          }
        ],
        url: {
          list: "/sys/hazardLibrary/list",
          delete: "/sys/hazardLibrary/delete",
          deleteBatch: "/sys/hazardLibrary/deleteBatch",
          exportXlsUrl: "/sys/hazardLibrary/exportXls",
          importExcelUrl: "sys/hazardLibrary/importExcel",

        },
        dictOptions: {},
        superFieldList: [],
        itemlist: [],
        hazardTypeId: "",
        itemids: ''
      }
    },
    created() {
      this.initDateVal();
      setTimeout(() => {
        this.loadDataList();
      }, 300);

    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      modalFormOk1() {
        this.initDateVal();
      },
      editOut(val) {
      },
      showVal(item, index) {
        this.itemids = item.id;
        this.currentpends = index;
        this.contractorName = item.contractorName;
        this.creditCode = item.creditCode;
        this.contractorType = item.contractorType;
        this.businessScope = item.businessScope;
        this.contractorId = item.id;
        this.hazardTypeId = item.id;
      },
      addcontractor() {
        this.$refs.modalForm1.add();
        this.$refs.modalForm1.title = "新增隐患类型";
        this.$refs.modalForm1.disableSubmit = false;
      },
      deleteID(val) {
        let that = this;
        that.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            dangerdelete({id: val}).then(res => {
              that.initDateVal();
              if (res.code == 200) {
                that.$message.success("删除成功");
              } else {
                that.$message.warning("删除失败");
              }
            })
          }
        })
      },
      userclick() {
        this.loadDataList();
      },
      // 加载数据
      loadDataList() {
        // 封装查询条件
        let formData = {
          pageNo: 1, pageSize: 10,
          relTenantIds: this.$store.state.user.info.relTenantIds,
          hazardTypeId: this.hazardTypeId
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

      // 加载数据
      queryDataList() {
        if (this.currentpends == -1) {
          this.currentpends = 0;
        }
        // 封装查询条件
        let formData = {
          pageNo: 1, pageSize: 10,
          relTenantIds: this.$store.state.user.info.relTenantIds,
          hazardTypeId: this.hazardTypeId,
          hazardContent: "*"+this.$refs.describe.inputVal+"*",
        }
        // 调用查询数据接口
        this.loading = true
        getAction(this.url.list, formData).then(res => {
          if (res.success) {
            console.log(res)
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
      addcontractoredit(record) {
        this.$refs.modalForm1.edit(record);
        this.$refs.modalForm1.title = "编辑";
        this.$refs.modalForm1.disableSubmit = false;
      },
      initDateVal() {
        let data = {
          relTenantIds: this.$store.state.user.info.relTenantIds
        }
        danger(data).then(res => {
          if (res.code == 200) {
            console.log(res.result)
            this.itemlist = res.result.records;
            this.hazardTypeId = res.result.records[0].id;
          }
        })
      },
      initDictConfig() {
      },
      getSuperFieldList() {
        let fieldList = [];
        fieldList.push({type: 'string', value: 'hazardContent', text: '隐患事件', dictCode: ''})
        fieldList.push({type: 'string', value: 'remarks', text: '描述', dictCode: ''})
        fieldList.push({type: 'string', value: 'createBy', text: '创建人', dictCode: 'sys_user,realname,username'})
        fieldList.push({type: 'datetime', value: 'createTime', text: '创建日期'})
        this.superFieldList = fieldList
      },
      resetInquire(){
        this.$refs.describe.inputVal = null;
         // 封装查询条件
        let formData = {
          pageNo: 1, pageSize: 10,
          relTenantIds: this.$store.state.user.info.relTenantIds,
          hazardTypeId: this.hazardTypeId,
        }
         // 调用查询数据接口
        this.loading = true
        getAction(this.url.list, formData).then(res => {
          if (res.success) {
            console.log(res)
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
      }
    }
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
    background: #1890FF;
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

  .hidden_trouble_editing:hover{
    cursor:pointer;
    border-bottom: 1px solid #649AFF;
  }
  .hidden_trouble_editing{
    border-bottom: 1px solid #ffffff;
  }
</style>