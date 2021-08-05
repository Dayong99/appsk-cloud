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
            <a-form-item label="配比编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['recipeName']" placeholder="请输入配比编号"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥1" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn1']" placeholder="请输入水泥1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥2" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn2']" placeholder="请输入水泥2" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥3" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn3']" placeholder="请输入水泥3" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉煤灰" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeFmh']" placeholder="请输入粉煤灰" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="粉加剂" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeFjj']" placeholder="请输入粉加剂" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="矿粉" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeKf']" placeholder="请输入矿粉" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂1" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeWjj1']" placeholder="请输入添加剂1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="添加剂2" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeWjj2']" placeholder="请输入添加剂2" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="大石料(G1)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeDsl']" placeholder="请输入大石料(G1)" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中石料(G2)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeZsl']" placeholder="请输入中石料(G2)" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="小石料(S2)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeXsl']" placeholder="请输入小石料(S2)" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子(S1)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz']" placeholder="请输入沙子(S1)" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙子1" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz1']" placeholder="请输入沙子1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeShui']" placeholder="请输入水" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="搅拌时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeOth1']" placeholder="请输入搅拌时间" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水泥4" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSn4']" placeholder="请输入水泥4" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="污水或粉料单独" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeSz2']" placeholder="请输入污水或粉料单独" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="强度等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['intensityLevel']" placeholder="请输入强度等级"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="抗渗度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ksd']" placeholder="请输入抗渗度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="抗折度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['kzd']" placeholder="请输入抗折度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="塌落度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['tld']" placeholder="请输入塌落度"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沙粒径等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sljdj']" placeholder="请输入沙粒径等级"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="碎石最大粒径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sszdlj']" placeholder="请输入碎石最大粒径"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="水胶比" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sjb']" placeholder="请输入水胶比" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="砂率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['sl']" placeholder="请输入砂率" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="表观密度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['bgmd']" placeholder="请输入表观密度" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="M17备用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM17']" placeholder="请输入M17备用" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M18备用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM18']" placeholder="请输入M18备用" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M19备用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM19']" placeholder="请输入M19备用" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="M20备用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['recipeM20']" placeholder="请输入M20备用" style="width: 100%" />
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

  export default {
    name: 'RecipeForm',
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
          add: "/ms/recipe/add",
          edit: "/ms/recipe/edit",
          queryById: "/ms/recipe/queryById"
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
          this.form.setFieldsValue(pick(this.model,'stationId','recipeName','recipeSn1','recipeSn2','recipeSn3','recipeFmh','recipeFjj','recipeKf','recipeWjj1','recipeWjj2','recipeDsl','recipeZsl','recipeXsl','recipeSz','recipeSz1','recipeShui','recipeOth1','recipeSn4','recipeSz2','intensityLevel','ksd','kzd','tld','sljdj','sszdlj','sjb','sl','bgmd','recipeM17','recipeM18','recipeM19','recipeM20'))
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
        this.form.setFieldsValue(pick(row,'stationId','recipeName','recipeSn1','recipeSn2','recipeSn3','recipeFmh','recipeFjj','recipeKf','recipeWjj1','recipeWjj2','recipeDsl','recipeZsl','recipeXsl','recipeSz','recipeSz1','recipeShui','recipeOth1','recipeSn4','recipeSz2','intensityLevel','ksd','kzd','tld','sljdj','sszdlj','sjb','sl','bgmd','recipeM17','recipeM18','recipeM19','recipeM20'))
      },
    }
  }
</script>