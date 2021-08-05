<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <!-- :disabled="formDisabled" -->
      <a-form :form="form" slot="detail">
        <div class="openrt">
          <div @click="record(1)">生产记录</div>
          <div @click="record(2)">基本属性</div>
        </div>
        <a-row v-if="current==1" style="margin-top:30px;">
          <div class="penttab">
            <div class="boxlistdata">
              <div v-for="(item,index) in itemList" :key="index" class="listdata">
                <div class="dicttext">{{item.operator_dictText}}{{item.structStatusSort_dictText}}</div>
                <div class="remakes">{{item.remarks}}已完成</div>
                <div class="photo">
                  <img :src="item.filePath"/>
                </div>
                <div class="square"></div>
                <div class="datetime">{{item.updateTime}}</div>
              </div>
            </div> 
          </div>
        </a-row>
        <a-row v-if="current==2" style="margin-top:30px;">
          <a-col :span="24">
            <a-form-item label="桥名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['bridgeName']" placeholder="请输入桥名"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="桥孔编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['bridgeHoleNumber', validatorRules.bridgeHoleNumber]" placeholder="请输入桥孔编号" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="对应墩号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['correspondingPierNumber']" placeholder="请输入对应墩号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="梁编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['beamNumber', validatorRules.beamNumber]" placeholder="请输入梁编号" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中/边梁" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['centerOrSideBeam']" placeholder="请输入中/边梁"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="理论跨径（cm）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['theoreticalSpan', validatorRules.theoreticalSpan]" placeholder="请输入理论跨径（cm）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="标准梁长（cm）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['standardBeamLength', validatorRules.standardBeamLength]" placeholder="请输入标准梁长（cm）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="（N-1）号墩顶伸缩缝类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['n1pierTopExpansionJointType']" placeholder="请输入（N-1）号墩顶伸缩缝类型"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="（N）号墩顶伸缩缝类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['npierTopExpansionJointType']" placeholder="请输入（N）号墩顶伸缩缝类型"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预制梁长（cm）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['prefabricatedBeamLength', validatorRules.prefabricatedBeamLength]" placeholder="请输入预制梁长（cm）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="梁长差值（cm）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['beamLengthDifference', validatorRules.beamLengthDifference]" placeholder="请输入梁长差值（cm）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="小箱梁预制横坡i（%）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['smallBgpcsI', validatorRules.smallBgpcsI]" placeholder="请输入小箱梁预制横坡i（%）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="砼方量（m³）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['concreteVolume', validatorRules.concreteVolume]" placeholder="请输入砼方量（m³）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="HRB400" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['hrb400', validatorRules.hrb400]" placeholder="请输入HRB400" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="HPB300" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['hpb300', validatorRules.hpb300]" placeholder="请输入HPB300" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="钢绞线（kg）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['steelStrand', validatorRules.steelStrand]" placeholder="请输入钢绞线（kg）" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="关联台座" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['pedestalId']" :trigger-change="true" dictCode="aoz_beam_yard_pedestal_ledger,prefabricated_pedestal_number,id" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="施工工序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['structStatusSort']" :trigger-change="true" dictCode="aoz_beam_yard_struct_status,struct_status,tenant_id_sort" />
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
  import {productionSearch} from '@/api/api'
  import JFormContainer from '@/components/jeecg/JFormContainer'

  export default {
    name: 'StructLedgerForm',
    components: {
      JFormContainer,
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
        form: this.$form.createForm(this),
        itemList:[],
        model: {},
        current:1,
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
          bridgeHoleNumber: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          beamNumber: {
            rules: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
            ]
          },
          theoreticalSpan: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          standardBeamLength: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          prefabricatedBeamLength: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          beamLengthDifference: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          smallBgpcsI: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          concreteVolume: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          hrb400: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          hpb300: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
          steelStrand: {
            rules: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]
          },
        },
        url: {
          add: "/beamyard/structLedger/add",
          edit: "/beamyard/structLedger/edit",
          queryById: "/beamyard/structLedger/queryById"
        },
        modelListid:''
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
      record(val){
        this.current=val
        if(val==2){
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'bridgeName','bridgeHoleNumber','correspondingPierNumber','beamNumber','centerOrSideBeam','theoreticalSpan','standardBeamLength','n1pierTopExpansionJointType','npierTopExpansionJointType','prefabricatedBeamLength','beamLengthDifference','smallBgpcsI','concreteVolume','hrb400','hpb300','steelStrand','pedestalId','structStatusSort'))
          })
        }
      },
      init(){
        let data={
          relTenantIds:this.$store.state.user.info.relTenantIds,
          structLedgerId:this.modelListid
        }
        productionSearch(data).then(res=>{
          if(res.success){
            this.itemList=res.result.records
          }
        })
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.modelListid=this.model.id;
        this.init();
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'bridgeName','bridgeHoleNumber','correspondingPierNumber','beamNumber','centerOrSideBeam','theoreticalSpan','standardBeamLength','n1pierTopExpansionJointType','npierTopExpansionJointType','prefabricatedBeamLength','beamLengthDifference','smallBgpcsI','concreteVolume','hrb400','hpb300','steelStrand','pedestalId','structStatusSort'))
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
        this.form.setFieldsValue(pick(row,'bridgeName','bridgeHoleNumber','correspondingPierNumber','beamNumber','centerOrSideBeam','theoreticalSpan','standardBeamLength','n1pierTopExpansionJointType','npierTopExpansionJointType','prefabricatedBeamLength','beamLengthDifference','smallBgpcsI','concreteVolume','hrb400','hpb300','steelStrand','pedestalId','structStatusSort'))
      },
    }
  }
</script>
<style scoped lang="less">
.penttab{
  height:500px;
  overflow: auto;
}

.listdata{
  width: 60%;
  border-left: 1px solid #e7e7e7;
  position: relative;
  left: 33%;
  padding-left: 20px;
  .datetime{
    position: absolute;
    left:-34%;
    background: #e7e7e7;
    top:5%;
  }
  .dicttext{
    padding-top:11px;
    margin-bottom: 8px;
  }
  .remakes{
    margin-top:5px;
    margin-bottom: 5px;
  }
  .square{
    width: 15px;
    height: 15px;
    background: #e7e7e7;
    position: absolute;
    top:6%;
    left:-1.9%;
    border-radius: 50%;
  }
  .photo{
    width: 200px;
    height:200px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.openrt{
  display: flex;
  div{
    margin:0 20px;
    cursor: pointer;
  }
}
</style>