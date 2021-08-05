<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <!-- <a-form-item label="资料库" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['archivesTreeId', validatorRules.archivesTreeId]" :trigger-change="true" dictCode="aoz_sys_archives_tree,name,id" placeholder="请选择资料库" />
            </a-form-item> -->

            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="资料库" hasFeedback>
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
              
              v-decorator="['archivesTreeId', validatorRules.archivesTreeId]"
              placeholder="请选择资料库">
            </a-tree-select>
            <!-- v-model="model.archivesTreeId" -->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type']" :trigger-change="true" dictCode="file_belong_type" placeholder="请选择文件类型" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload1 v-decorator="['filePath',validatorRules.filePath]" :trigger-change="true" :number=1 @changepng="changepng"></j-upload1>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入简介"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JUpload1 from '@/components/jeecg/JUpload1'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
    import {documenTreeList} from '@/api/api'
  export default {
    name: 'ArchivesForm',
    components: {
      JFormContainer,
      JUpload1,
      JDictSelectTag,
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：true流程表单 false普通表单
      formBpm: {
        type: Boolean,
        default: false,
        required: false
      },
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        departTree:[],
        arr:[],
        form: this.$form.createForm(this),
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          archivesTreeId: {
            rules: [
              { required: true, message: '请输入资料库!'},
            ]
          },
          filePath: {
            rules: [
              { required: true, message: '请输入文件!'},
            ]
          },
        },
        url: {
          add: "/sys/archives/add",
          edit: "/sys/archives/edit",
          queryById: "/sys/archives/queryById"
        },
        pngList:[]
      }
    },
    computed: {
      formDisabled(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return false
          }
          return true
        }
        return this.disabled
      },
      showFlowSubmitButton(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return true
          }
        }
        return false
      }
    },
    created () {
      //如果是流程中表单，则需要加载流程表单data
      this.showFlowData();
    },
    methods: {
      changepng(png){
       this.pngList=png
      },
      loadTreeData(){
        var that = this;
        that.arr=[]
        documenTreeList().then((res)=>{
          if(res.success){
            that.getParentId(res.result)
            that.departTree =that.arr
            // for (let i = 0; i < res.result.length; i++) {
            //   let temp = res.result[i];
            //   that.departTree.push(temp);
            // }
            //  console.log(11222)
            //  console.log(that.arr)
            //  console.log(that.departTree)
          }

        })
      },
      getParentId(list) {
         list.forEach(i=>{
            if(i.children!=null){
              this.getParentId(i.children);
            }else{
              this.arr.push(i)
            }
         })       
      },
      add () {
        this.loadTreeData();
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'archivesTreeId','type','fileName','filePath','fileType','fileSize','remarks','createBy','createTime'))
        })
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          });
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            var obj={}
            var formDatas={}
            console.log(that.pngList)
            if(that.pngList.length>0){
              obj.fileName=this.pngList[0].fileName
              obj.fileSize=this.pngList[0].fileSize
              obj.fileType=this.pngList[0].fileType
              formData.filePath=this.pngList[0].filePath
              formDatas=Object.assign(formData,obj);
              console.log(formDatas)
              httpAction(httpurl,formDatas,method).then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  that.$emit('ok');
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            }else{
              console.log(formDatas)
              httpAction(httpurl,formDatas,method).then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  that.$emit('ok');
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            }  
          }
         
        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'archivesTreeId','type','fileName','filePath','fileType','fileSize','remarks','createBy','createTime'))
      },
    }
  }
</script>