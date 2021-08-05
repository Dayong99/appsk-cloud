<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="站名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['stationId']" :trigger-change="true" dictCode="aoz_device,device_name,device_number" placeholder="请选择站名" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="生产时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择生产时间" v-decorator="['mdateTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="配方号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['recipeId']" placeholder="请输入配方号"  ></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="当前盘数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['itemId']" placeholder="请输入当前盘数"  ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="单车盘数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['itemNo']" placeholder="请输入单车盘数" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="方数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['operatorId']" placeholder="请输入方数" style="width: 100%" />
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="当前出货单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deliveryId']" placeholder="请输入当前出货单号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥1配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn1']" placeholder="请输入水泥1配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥1实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSn1']" placeholder="请输入水泥1实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥2配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn2']" placeholder="请输入水泥2配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥2实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSn2']" placeholder="请输入水泥2实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥3配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn3']" placeholder="请输入水泥3配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥3实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSn3']" placeholder="请输入水泥3实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉煤灰配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeFmh']" placeholder="请输入粉煤灰配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉煤灰实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualFmh']" placeholder="请输入粉煤灰实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉加剂配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeFjj']" placeholder="请输入粉加剂配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉加剂实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualFjj']" placeholder="请输入粉加剂实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="矿粉配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeKf']" placeholder="请输入矿粉配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="矿粉实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualKf']" placeholder="请输入矿粉实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂1配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeWjj1']" placeholder="请输入添加剂1配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂1实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualWjj1']" placeholder="请输入添加剂1实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂2配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeWjj2']" placeholder="请输入添加剂2配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂2实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualWjj2']" placeholder="请输入添加剂2实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="大石料(G1)配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeDsl']" placeholder="请输入大石料(G1)配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="大石料(G1)实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualDsl']" placeholder="请输入大石料(G1)实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中石料(G2)配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeZsl']" placeholder="请输入中石料(G2)配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中石料(G2)实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualZsl']" placeholder="请输入中石料(G2)实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="小石料(S2)配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeXsl']" placeholder="请输入小石料(S2)配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="小石料(S2)实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualXsl']" placeholder="请输入小石料(S2)实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子(S1)配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz']" placeholder="请输入沙子(S1)配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子(S1)实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSz']" placeholder="请输入沙子(S1)实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子1配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz1']" placeholder="请输入沙子1配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子1实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSz1']" placeholder="请输入沙子1实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeShui']" placeholder="请输入水配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualShui']" placeholder="请输入水实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="搅拌时间配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeOth1']" placeholder="请输入搅拌时间配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="搅拌时间实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualOth1']" placeholder="请输入搅拌时间实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="污水配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz2']" placeholder="请输入污水配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="污水实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSz2']" placeholder="请输入污水实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥4配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn4']" placeholder="请输入水泥4配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥4实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualSn4']" placeholder="请输入水泥4实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="M17配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM17']" placeholder="请输入M17配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M17实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualM17']" placeholder="请输入M17实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M18配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM18']" placeholder="请输入M18配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M18实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualM18']" placeholder="请输入M18实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M19配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM19']" placeholder="请输入M19配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M19实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualM19']" placeholder="请输入M19实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M20配方值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM20']" placeholder="请输入M20配方值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M20实际值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['actualM20']" placeholder="请输入M20实际值" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="带砂浆否:0 不带 | 1 带" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['bslurry']" placeholder="请输入带砂浆否:0 不带 | 1 带" style="width: 100%" />
            </a-form-item>
          </a-col> -->
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
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'ManufactureForm',
    components: {
      JFormContainer,
      JDate,
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
        },
        url: {
          add: "/ms/manufacture/add",
          edit: "/ms/manufacture/edit",
          queryById: "/ms/manufacture/queryById"
        }
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'stationId','mdateTime','recipeId','itemId','itemNo','operatorId','deliveryId','recipeSn1','actualSn1','recipeSn2','actualSn2','recipeSn3','actualSn3','recipeFmh','actualFmh','recipeFjj','actualFjj','recipeKf','actualKf','recipeWjj1','actualWjj1','recipeWjj2','actualWjj2','recipeDsl','actualDsl','recipeZsl','actualZsl','recipeXsl','actualXsl','recipeSz','actualSz','recipeSz1','actualSz1','recipeShui','actualShui','recipeOth1','actualOth1','recipeSz2','actualSz2','recipeSn4','actualSn4','recipeM17','actualM17','recipeM18','actualM18','recipeM19','actualM19','recipeM20','actualM20','bslurry'))
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
        this.form.setFieldsValue(pick(row,'stationId','mdateTime','recipeId','itemId','itemNo','operatorId','deliveryId','recipeSn1','actualSn1','recipeSn2','actualSn2','recipeSn3','actualSn3','recipeFmh','actualFmh','recipeFjj','actualFjj','recipeKf','actualKf','recipeWjj1','actualWjj1','recipeWjj2','actualWjj2','recipeDsl','actualDsl','recipeZsl','actualZsl','recipeXsl','actualXsl','recipeSz','actualSz','recipeSz1','actualSz1','recipeShui','actualShui','recipeOth1','actualOth1','recipeSz2','actualSz2','recipeSn4','actualSn4','recipeM17','actualM17','recipeM18','actualM18','recipeM19','actualM19','recipeM20','actualM20','bslurry'))
      },
    }
  }
</script>