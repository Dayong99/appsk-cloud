/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'

import { bigent } from '@/api/login'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import store from '@/store'
import {Modal} from 'ant-design-vue'

export const JeecgListMixin1 = {
  data(){
    return {
      //token header
      tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {
        relTenantIds:this.$store.state.user.info.relTenantIds
      },
      /* 数据源 */
      dataSource1:[],
      /* 分页参数 */
      ipagination1:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter:{
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading:false,
      /* table选中keys*/
      selectedRowKeys1: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus:false,
      /* 高级查询条件生效状态 */
      superQueryFlag:false,
      /* 高级查询条件 */
      superQueryParams: '',
      /** 高级查询拼接方式 */
      superQueryMatchType: 'and',
    }
  },
  created() {
      if(!this.disableMixinCreated){
        //console.log(' -- mixin created -- ')
          this.loadData1();
        //初始化字典配置 在自己页面定义
        this.initDictConfig();
      }
  },
  methods:{
    loadData1(arg,val) {
      if(!this.url1.list){
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination1.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      if(this.url1.list=='/sys/archives/list'){
        params=Object.assign(params,{archivesTreeId:val?val:''})
      }
      
      if(this.url1.list=='/sys/user/list'){
        params.field=params.field+','+'userType=user'
      }
      getAction(this.url1.list, params).then((res) => {
        if (res.success) {
          
          if(this.url1.list=='/materials/weighbridgeBill/list'){
            let rescordList=res.result.records
            if(rescordList){
              rescordList.forEach((a,c)=>{
                let marternames='';
                if((JSON.parse(a.materialsInfo))){
                  (JSON.parse(a.materialsInfo)).forEach((b,p)=>{
                    marternames+=b.materialsName+'、'
                  })
                  a.materialsSpare=marternames.substring(0,marternames.length-1)
                }
              })
            }
          }
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource1 = res.result.records||res.result;

          console.log("dataSource1---->",this.dataSource1)
          if(res.result.total)
          {
            this.ipagination1.total = res.result.total;
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    initDictConfig(){
      //console.log("--这是一个假的方法!")
    },
    handleSuperQuery(params, matchType) {
      //高级查询方法
      if(!params){
        this.superQueryParams=''
        this.superQueryFlag = false
      }else{
        this.superQueryFlag = true
        this.superQueryParams=JSON.stringify(params)
        this.superQueryMatchType = matchType
      }
      this.loadData1(1,'')
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination1.current;
      param.pageSize = this.ipagination1.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange1(selectedRowKeys1, selectionRows) {
      this.selectedRowKeys1 = selectedRowKeys1;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys1 = [];
      this.selectionRows = [];
    },
    searchQuery1(val) {
      this.loadData1(1,val);
    },
    superQuery1() {
      this.$refs.superQueryModal.show();
    },
    searchReset1() {
      this.queryParam = {relTenantIds:this.$store.state.user.info.relTenantIds}
      this.loadData1(1,'');
    },
    batchDel1: function () {
      if(!this.url1.deleteBatch){
        this.$message.error("请设置url1.deleteBatch属性!")
        return
      }
      if (this.selectedRowKeys1.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys1.length; a++) {
          ids += this.selectedRowKeys1[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url1.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData1();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    batchgo1(h){
      if(!this.url1.deleteBatch){
        this.$message.error("请设置url.deleteBatch属性!")
        return
      }
      if (this.selectedRowKeys1.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys1.length; a++) {
          ids += this.selectedRowKeys1[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "确认修改在岗状态",
          content: "是否修改在岗状态?",
          onOk: function () {
            that.loading = true;
            console.log(ids)
            console.log(ids.substring(0,ids.length-1))
            let data={
              ids:ids.substring(0,ids.length-1),
              value:h,
            }
            bigent(data).then(res=>{
              console.log(res)
              if (res.success) {
                that.$message.success(res.message);
                that.loadData1();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        });
      }
    },
    batchstart1: function () {
      if(!this.url1.deleteBatch){
        this.$message.error("请设置url.deleteBatch属性!")
        return
      }
      if (this.selectedRowKeys1.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys1.length; a++) {
          ids += this.selectedRowKeys1[a] + ",";
        }
        console.log(ids)
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url1.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData1();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete1: function (id) {
      if(!this.url1.delete){
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url1.delete, {id: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData1();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit1: function (record) {
      this.$refs.modalForm1.edit(record);
      this.$refs.modalForm1.title = "编辑";
      this.$refs.modalForm1.disableSubmit = false;
    },
    handleAdd1: function (val) {
      this.$store.state.user.vals=val;
      this.$refs.modalForm1.add();
      this.$refs.modalForm1.title = "新增";
      this.$refs.modalForm1.disableSubmit = false;
    },
    handleAddcreased1: function (val,record) {
      console.log(record)
      this.$store.state.user.vals=val;
      this.$refs.modalForms.add(record);
      this.$refs.modalForms.title = "新增";
      this.$refs.modalForms.disableSubmit = false;
    },
    handleTableChange1(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"

      }
      this.ipagination1 = pagination;
      this.loadData1();
    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    // 给popup查询使用(查询区域不支持回填多个字段，限制只返回一个字段)
    getPopupField(fields){
      return fields.split(',')[0]
    },
    modalFormOk1() {
      // 新增/修改 成功时，重载列表
      this.loadData1();
    },
    handleDetail1:function(record){
      console.log(record)
      console.log("ppppppppppppp")
      this.$refs.modalForm1.edit(record);
      this.$refs.modalForm1.title="详情";
      this.$refs.modalForm1.disableSubmit = true;
    },
    handleDetail1:function(record){
      console.log(record)
      console.log("ppppppppppppp")
      this.$refs.modalForm1.edit(record);
      this.$refs.modalForm1.title="详情";
      this.$refs.modalForm1.disableSubmit = true;
    },
    /* 导出 */
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      let param = this.getQueryParams();
      if(this.selectedRowKeys1 && this.selectedRowKeys1.length>0){
        param['selections'] = this.selectedRowKeys1.join(",")
      }
      console.log("导出参数",param)
      downFile(this.url.exportXlsUrl,param).then((data)=>{
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br/>
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData1()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        if (info.file.response.status === 500) {
          let data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes("Token失效")) {
            Modal.error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload();
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上传失败: ${info.file.msg} `);
        }
      }
    },
    /* 图片预览 */
    getImgView(text){
      if(text && text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      return getFileAccessHttpUrl(text)
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text){
      if(!text){
        this.$message.warning("未知的文件")
        return;
      }
      if(text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
  }

}