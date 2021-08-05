<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <!-- :disabled="formDisabled" -->
      <a-form :form="form" slot="detail">
       <div class="openrt" v-if="beamtim">
          <div @click="record(1)">关联梁板</div>
          <div @click="record(2)">基本属性</div>
        </div>
        <a-row v-if="current==1">
          <div>
            <div class="totaldiv">制作中的梁板</div>
              <a-table
                ref="table"
                size="middle"
                :scroll="{x:true}"
                bordered
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource1"
                :pagination="ipagination"
                :loading="loading"
                
                class="j-table-force-nowrap"
                @change="handleTableChange">
                <template slot="htmlSlot" slot-scope="text">
              <div v-html="text"></div>
            </template>
            <template slot="imgSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
              <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
              <a @click="handleDetail(record)">详情</a>
              <a-divider type="vertical" />
            </span>
            </a-table>
            <div class="totaldiv">已制作的梁板</div>
              <a-table
                ref="table"
                size="middle"
                :scroll="{x:true}"
                bordered
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource2"
                :pagination="ipagination"
                :loading="loading"
               
                class="j-table-force-nowrap"
                @change="handleTableChange">
                <template slot="htmlSlot" slot-scope="text">
              <div v-html="text"></div>
            </template>
            <template slot="imgSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
              <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
              <a @click="handleDetail(record)">详情</a>
              <a-divider type="vertical" />
            </span>
            </a-table>
          </div>
        </a-row> 
        <a-row v-if="current==2" style="margin-top:30px;">
          <a-col :span="24">
            <a-form-item label="空闲状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['status']" placeholder="请输入空闲状态"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制场编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedSiteNumber']" placeholder="请输入预制场编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedPedestalNumber']" placeholder="请输入预制台座编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座长（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalLength', validatorRules.prefabricatedPedestalLength]" placeholder="请输入预制台座长（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座宽（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalWidth', validatorRules.prefabricatedPedestalWidth]" placeholder="请输入预制台座宽（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制台座高（m）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedPedestalHeight', validatorRules.prefabricatedPedestalHeight]" placeholder="请输入预制台座高（m）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制梁类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['prefabricatedBeamType']" placeholder="请输入预制梁类型"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
    <struct-ledger-modal ref="modalForm" @ok="modalFormOk"></struct-ledger-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import {relationalrecord} from '@/api/api'
  import JFormContainer from '@/components/jeecg/JFormContainer'
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
   import { mixinDevice } from '@/utils/mixin'
   import StructLedgerModal from '../modules/StructLedgerModal'
   
  export default {
    name: 'PedestalLedgerForm',
    mixins:[JeecgListMixin,mixinDevice],
    components: {
      JFormContainer,StructLedgerModal
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
        beamtim:true,
        form: this.$form.createForm(this),
        dataSource1:[],
        dataSource2:[],
        columns: [
          {
            title:'桥名',
            align:"center",
            dataIndex: 'bridgeName'
          },
          {
            title:'桥孔编号',
            align:"center",
            dataIndex: 'bridgeHoleNumber'
          },
          {
            title:'对应墩号',
            align:"center",
            dataIndex: 'correspondingPierNumber'
          },
          {
            title:'梁编号',
            align:"center",
            dataIndex: 'beamNumber'
          },
          {
            title:'中/边梁',
            align:"center",
            dataIndex: 'centerOrSideBeam'
          },
          {
            title:'理论跨径（cm）',
            align:"center",
            dataIndex: 'theoreticalSpan'
          },
          {
            title:'标准梁长（cm）',
            align:"center",
            dataIndex: 'standardBeamLength'
          },
          {
            title:'（N-1）号墩顶伸缩缝类型',
            align:"center",
            dataIndex: 'n1pierTopExpansionJointType'
          },
          {
            title:'（N）号墩顶伸缩缝类型',
            align:"center",
            dataIndex: 'npierTopExpansionJointType'
          },
          {
            title:'预制梁长（cm）',
            align:"center",
            dataIndex: 'prefabricatedBeamLength'
          },
          {
            title:'梁长差值（cm）',
            align:"center",
            dataIndex: 'beamLengthDifference'
          },
          {
            title:'小箱梁预制横坡i（%）',
            align:"center",
            dataIndex: 'smallBgpcsI'
          },
          {
            title:'砼方量（m³）',
            align:"center",
            dataIndex: 'concreteVolume'
          },
          {
            title:'HRB400',
            align:"center",
            dataIndex: 'hrb400'
          },
          {
            title:'HPB300',
            align:"center",
            dataIndex: 'hpb300'
          },
          {
            title:'钢绞线（kg）',
            align:"center",
            dataIndex: 'steelStrand'
          },
          {
            title:'施工工序',
            align:"center",
            dataIndex: 'structStatusSort_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
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
          prefabricatedPedestalLength: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          prefabricatedPedestalWidth: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          prefabricatedPedestalHeight: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          list:"/beamyard/structLedger/list",
          add: "/beamyard/pedestalLedger/add",
          edit: "/beamyard/pedestalLedger/edit",
          queryById: "/beamyard/pedestalLedger/queryById"
        },
        current:1
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
      this.getSuperFieldList();
      this.init(1);
      this.init(2)
    },
    methods: {
       record(val){
        this.current=val
        if(val==2){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'status','prefabricatedSiteNumber','prefabricatedPedestalNumber','prefabricatedPedestalLength','prefabricatedPedestalWidth','prefabricatedPedestalHeight','prefabricatedBeamType'))
          })
        }
      },
      add (val) {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'status','prefabricatedSiteNumber','prefabricatedPedestalNumber','prefabricatedPedestalLength','prefabricatedPedestalWidth','prefabricatedPedestalHeight','prefabricatedBeamType'))
        })
      },
      init(val){
        let data={
          pageNo: 1,
          pageSize:"",
          pedestalStatus:val
        }
        relationalrecord(data).then(res=>{
          console.log(res)
          if(val==1){
             this.dataSource1=res.result.records;
          }else{
             this.dataSource2=res.result.records;
          }
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
            httpAction(httpurl,formData,method).then((res)=>{
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
         
        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'status','prefabricatedSiteNumber','prefabricatedPedestalNumber','prefabricatedPedestalLength','prefabricatedPedestalWidth','prefabricatedPedestalHeight','prefabricatedBeamType'))
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'bridgeName',text:'桥名',dictCode:''})
        fieldList.push({type:'int',value:'bridgeHoleNumber',text:'桥孔编号',dictCode:''})
        fieldList.push({type:'string',value:'correspondingPierNumber',text:'对应墩号',dictCode:''})
        fieldList.push({type:'int',value:'beamNumber',text:'梁编号',dictCode:''})
        fieldList.push({type:'string',value:'centerOrSideBeam',text:'中/边梁',dictCode:''})
        fieldList.push({type:'double',value:'theoreticalSpan',text:'理论跨径（cm）',dictCode:''})
        fieldList.push({type:'double',value:'standardBeamLength',text:'标准梁长（cm）',dictCode:''})
        fieldList.push({type:'string',value:'n1pierTopExpansionJointType',text:'（N-1）号墩顶伸缩缝类型',dictCode:''})
        fieldList.push({type:'string',value:'npierTopExpansionJointType',text:'（N）号墩顶伸缩缝类型',dictCode:''})
        fieldList.push({type:'double',value:'prefabricatedBeamLength',text:'预制梁长（cm）',dictCode:''})
        fieldList.push({type:'double',value:'beamLengthDifference',text:'梁长差值（cm）',dictCode:''})
        fieldList.push({type:'double',value:'smallBgpcsI',text:'小箱梁预制横坡i（%）',dictCode:''})
        fieldList.push({type:'double',value:'concreteVolume',text:'砼方量（m³）',dictCode:''})
        fieldList.push({type:'double',value:'hrb400',text:'HRB400',dictCode:''})
        fieldList.push({type:'double',value:'hpb300',text:'HPB300',dictCode:''})
        fieldList.push({type:'double',value:'steelStrand',text:'钢绞线（kg）',dictCode:''})
        fieldList.push({type:'string',value:'pedestalId',text:'关联台座',dictCode:'aoz_beam_yard_pedestal_ledger,prefabricated_pedestal_number,id'})
        fieldList.push({type:'int',value:'structStatusSort',text:'施工工序',dictCode:'aoz_beam_yard_struct_status,struct_status,sort'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped lang="less">
.openrt{
  display: flex;
  div{
    margin:0 20px;
    cursor: pointer;
  }
}
.totaldiv{
  background: #c2dbf5;
  height:30px;
  line-height:30px;
  padding-left: 10px;
  margin:30px auto;
}
</style>