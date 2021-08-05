<template>
  <a-row :gutter="10">
    <a-col :md="5" :sm="24">
      <a-card :bordered="false">
        <!-- <a-input-search @search="onSearch" style="width: 100%; margin-top: 10px" placeholder="请输入人员名称" /> -->
        <template>
          <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
            <span style="user-select: none">
              <a-tree
                multiple
                @select="onSelect"
                @check="onCheck"
                @rightClick="rightHandle"
                :selectedKeys="selectedKeys"
                :checkedKeys="checkedKeys"
                :treeData="departTree"
                :checkStrictly="checkStrictly"
                :expandedKeys="iExpandedKeys"
                :autoExpandParent="autoExpandParent"
                @expand="onExpand"
              />
            </span>
            <!--新增右键点击事件,和增加添加和删除功能-->
          </a-dropdown>
        </template>
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="人员姓名">
                  <!-- <a-input placeholder="请输入人员姓名" v-model="queryParam.personName"></a-input> -->
                  <j-input placeholder="请输入人员姓名" v-model="queryParam.personName"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="身份证号">
                  <!-- <a-input placeholder="请输入身份证号" v-model="queryParam.idNumber"></a-input> -->
                  <j-input placeholder="请输入身份证号" v-model="queryParam.idNumber"></j-input>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="电话号码">
                    <!-- <a-input placeholder="请输入电话号码" v-model="queryParam.phone"></a-input> -->
                    <j-input placeholder="请输入电话号码" v-model="queryParam.phone"></j-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="工种">
                    <j-dict-select-tag
                      placeholder="请选择工种"
                      v-model="queryParam.workId"
                      dictCode="aoz_person_work_type,work_name,id"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="在岗状态">
                    <j-dict-select-tag
                      placeholder="请选择在岗状态"
                      v-model="queryParam.onJobStatus"
                      dictCode="on_job_status"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="状态">
                    <j-dict-select-tag
                      placeholder="请选择状态"
                      v-model="queryParam.userStatus"
                      dictCode="user_status"
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
          <a-button type="primary" icon="download" @click="handleExportXls('人员表')">导出</a-button>
          <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload> -->
          <!-- 高级查询区域 -->
          <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
              <a-menu-item key="2" @click="batchgo('1')"><a-icon type="delete" />在岗</a-menu-item>
              <a-menu-item key="3" @click="batchgo('2')"><a-icon type="delete" />退场</a-menu-item>
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
        <person-modal ref="modalForm" @ok="modalFormOk"></person-modal>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
// import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PersonModal from './modules/PersonModal'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import JInput from '@/components/jeecg/JInput.vue'
import { personTreeList, documenByDepartId } from '@/api/api'
export default {
  name: 'PersonList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    JDictSelectTag,
    PersonModal,
    JSuperQuery,
  },
  data() {
    return {
      description: '人员表管理页面',
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
          title: '人员姓名',
          align: 'center',
          dataIndex: 'personName',
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex_dictText',
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age',
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idNumber',
        },
        {
          title: '电话号码',
          align: 'center',
          dataIndex: 'phone',
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'headPic',
          scopedSlots: { customRender: 'imgSlot' },
        },
        {
          title: '班组',
          align: 'center',
          dataIndex: 'teamId_dictText',
        },
        {
          title: '工种',
          align: 'center',
          dataIndex: 'workId_dictText',
        },
        {
          title: '工号',
          align: 'center',
          dataIndex: 'workNo',
        },
        {
          title: '在岗状态',
          align: 'center',
          dataIndex: 'onJobStatus_dictText',
        },
        {
          title: '最后登录时间',
          align: 'center',
          dataIndex: 'lastLogintime',
        },
        {
          title: '账号创建人',
          align: 'center',
          dataIndex: 'createBy_dictText',
        },
        {
          title: '注册时间',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'userStatus_dictText',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/person/person/list',
        delete: '/person/person/delete',
        deleteBatch: '/person/person/deleteBatch',
        exportXlsUrl: '/person/person/exportXls',
        importExcelUrl: 'person/person/importExcel',
      },
      dictOptions: {},
      superFieldList: [],

      // 目录树增加
      autoExpandParent: true,
      iExpandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      departTree: [],
      dropTrigger: '',
      checkStrictly: true,
    }
  },
  created() {
    this.getSuperFieldList()
    this.loadTree()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'personName', text: '人员姓名', dictCode: '' })
      fieldList.push({ type: 'int', value: 'sex', text: '性别', dictCode: 'sex' })
      fieldList.push({ type: 'int', value: 'age', text: '年龄', dictCode: '' })
      fieldList.push({ type: 'string', value: 'idNumber', text: '身份证号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'phone', text: '电话号码', dictCode: '' })
      fieldList.push({ type: 'string', value: 'headPic', text: '头像', dictCode: '' })
      fieldList.push({ type: 'string', value: 'teamId', text: '班组' })
      fieldList.push({ type: 'string', value: 'workId', text: '工种', dictCode: 'aoz_person_work_type,work_name,id' })
      fieldList.push({ type: 'string', value: 'workNo', text: '工号', dictCode: '' })
      fieldList.push({ type: 'int', value: 'onJobStatus', text: '在岗状态', dictCode: 'on_job_status' })
      fieldList.push({ type: 'datetime', value: 'lastLogintime', text: '最后登录时间' })
      fieldList.push({ type: 'string', value: 'createBy', text: '账号创建人', dictCode: 'sys_user,realname,username' })
      fieldList.push({ type: 'datetime', value: 'createTime', text: '注册时间' })
      fieldList.push({ type: 'string', value: 'roleId', text: '角色', dictCode: 'sys_role,role_name,id' })
      fieldList.push({ type: 'int', value: 'userStatus', text: '状态', dictCode: 'user_status' })
      this.superFieldList = fieldList
    },
    // 左侧目录树
    rightHandle(node) {
      console.log(node)
      this.dropTrigger = 'contextmenu'
      console.log(node.node.eventKey)
      this.rightClickSelectedKey = node.node.eventKey
      this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
      this.contents.id = node.node.eventKey
      this.contents.isAllowDelete = node.node.dataRef.isAllowDelete
      this.contents.isLeaf = node.node.dataRef.isLeaf
      this.contents.name = node.node.dataRef.name
      this.contents.pid = node.node.dataRef.pid
      this.contents.relTenantIds = node.node.dataRef.relTenantIds
      this.contents.remarks = node.node.dataRef.remarks
      this.contents.sort = node.node.dataRef.sort
    },
    onSelect(selectedKeys, e) {
      console.log('selected', selectedKeys, e)
      // this.hiding = false
      let record = e.node.dataRef
      console.log('onSelect-record', record)
      this.currSelected = Object.assign({}, record)
      this.model = this.currSelected
      this.selectedKeys = [record.key]
      this.model.parentId = record.parentId
      // this.setValuesToForm(record)
      console.log(record)
      this.url.list = '/person/person/list?teamId=' + record.key
      this.searchQuery()
      // this.$refs.departAuth.show(record.id);
    },
    closeDrop() {
      this.dropTrigger = ''
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      this.hiding = false
      //this.checkedKeys = checkedKeys.checked
      // <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
      // <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // onClearSelected() {
    //   this.hiding = true
    //   this.checkedKeys = []
    //   this.form.resetFields()
    //   this.selectedKeys = []
    //   this.$refs.departAuth.departId = ''
    // },
    checkALL() {
      this.checkStriccheckStrictlytly = false
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      //this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },
    /*---onSearch(value) {
      let that = this
      if (value) {
        personTreeList({ name: value, relTenantIds: this.$store.state.user.info.relTenantIds, hasPerson: 2 }).then(
          (res) => {
            if (res.success) {
              that.departTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.departTree.push(temp)
              }
            } else {
              that.$message.warning(res.message)
            }
          }
        )
      } else {
        that.loadTree()
      }
    },---*/
    loadTree() {
      var that = this
      that.treeData = []
      that.departTree = []
      personTreeList({ relTenantIds: this.$store.state.user.info.relTenantIds, hasPerson: 2 }).then((res) => {
        if (res.success) {
          //部门全选后，再添加部门，选中数量增多
          this.allTreeKeys = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            // that.setThisExpandedKeys(temp)
            // that.getAllKeys(temp);
            // console.log(temp.id)
          }
          this.loading = false
        }
      })
    },
  },
}
</script>
<style scoped>
</style>