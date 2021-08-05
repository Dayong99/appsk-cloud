<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-item label="设备Code" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deviceCatagory']" :disabled="true"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deviceName', validatorRules.deviceName]" placeholder="请输入设备名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设备编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['deviceNumber', validatorRules.deviceNumber]"
                placeholder="请输入设备编号"
              ></a-input>
            </a-form-item>
          </a-col>
          <!-- camera -->
          <template v-if="model.deviceCatagory == 'camera'">
            <a-col :span="24">
              <a-form-item label="摄像机树" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-tree-select
                  v-decorator="['cameraTreeId', { rules: [{ required: true, message: '请选择摄像机树' }] }]"
                  style="width: 500px"
                  :treeData="treeData"
                  :replace-fields="replaceFields"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择摄像机树"
                  allow-clear
                  tree-default-expand-all
                  @select="onSelect"
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="摄像机类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select placeholder="请选择摄像机类型" v-decorator="['cameraType']">
                  <a-select-option value=1>球机</a-select-option>
                  <a-select-option value=2>枪机</a-select-option>
                  </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="接入方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select placeholder="接入方式" @change="handleChange" default-value="1" v-model="joinType">
                  <a-select-option v-for="(item, index) in joinTypeList" :key="index" :value="item.value">{{
                    item.title
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="joinType == 1">
              <a-col :span="24">
                <a-form-item label="设备序列号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['serialCode', validatorRules.serialCode]"
                    placeholder="请输入设备序列号"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input v-decorator="['authCode', validatorRules.authCode]" placeholder="请输入设备验证码"></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="joinType == 2">
              <a-col :span="24">
                <a-form-item label="NVR" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select placeholder="选择NVR" v-decorator="['nvr', validatorRules.nvr]">
                    <a-select-option
                      v-for="(item, index) in nvrList"
                      :key="index"
                      :value="item.id"
                      @click="getItem(item)"
                      >{{ item.deviceName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="通道号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['channelNumber', validatorRules.channelNumber]"
                    placeholder="请输入通道号"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :span="24">
              <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number v-decorator="['sort']" placeholder="请输入序号" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>

          <!-- NVR -->
          <template v-if="model.deviceCatagory == 'NVR'">
            <a-col :span="24">
              <a-form-item label="设备序列号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['serialCode', validatorRules.serialCode]"
                  placeholder="请输入设备序列号"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="设备验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['authCode', validatorRules.authCode]" placeholder="请输入设备验证码"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="24">
            <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['model']" placeholder="请输入型号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['manufacturer']" placeholder="请输入厂商"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设备照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload isMultiple  :number=1  v-decorator="['devicePic']" ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remarks']" placeholder="请输入备注信息"></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="更新时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date
                placeholder="请选择更新时间"
                v-decorator="['updateTime']"
                :trigger-change="true"
                style="width: 100%"
              />
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
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import Template1 from '../../jeecg/JVxeDemo/layout-demo/Template1.vue'

export default {
  name: 'DeviceForm',
  components: {
    JFormContainer,
    JDate,
    JDictSelectTag,
    Template1,
  },
  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {},
      required: false,
    },
    //表单模式：true流程表单 false普通表单
    formBpm: {
      type: Boolean,
      default: false,
      required: false,
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    typeInfo: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
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
        deviceName: { rules: [{ required: true, message: `设备名称不能为空` }] },
        deviceNumber: { rules: [{ required: true, message: `设备编号不能为空` }] },
        cameraTreeId: { rules: [{ required: true, message: `摄像机树不能为空` }] },
        serialCode: { rules: [{ required: true, message: `设备序列号不能为空` }] },
        authCode: { rules: [{ required: true, message: `设备验证码不能为空` }] },
        nvr: { rules: [{ required: true, message: `nvr不能为空` }] },
        channelNumber: { rules: [{ required: true, message: `通道号不能为空` }] },
      },
      url: {
        add: '/deviceManage/device/add',
        edit: '/deviceManage/device/edit',
        queryById: '/deviceManage/device/queryById',
        queryDeviceByDeviceCatagory: '/deviceManage/device/queryDeviceByDeviceCatagory',
        tree: '/deviceManage/cameraTree/queryBSCameraTrees',
      },
      joinType: 1,
      joinTypeList: [
        {
          value: 1,
          title: '序列号',
        },
        {
          value: 2,
          title: '通道号',
        },
      ],
      nvrList: [],
      nvrSerialCode: '',
      treeData: [],
      replaceFields: {
        key: 'id',
        value: 'id',
        title: 'name',
      },
      cameraTreeId: '',
      pickFrom: null,
      cameraType: ''
    }
  },
  watch: {},
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    },
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    this.showFlowData()
    this.getTree()
  },
  mounted() {},
  methods: {
    onSelect(value, node, extra) {
      this.cameraTreeId = value
    },
    //摄像头树
    getTree() {
      let params = {
        relTenantIds: this.$store.state.user.info.relTenantIds,
        pageSize: 100,
      }
      getAction(this.url.tree, params).then((res) => {
        if (res.code == 200) {
          this.treeData = res.result
        }
      })
    },
    add() {
      // this.edit({})
      this.form.resetFields();
      this.model = Object.assign({}, this.typeInfo)
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      // console.log(this.model);
      this.visible = true
      this.$nextTick(() => {
        //this.form.setFieldsValue(pick(this.model,'deviceTypeId','deviceName','remarks','updateTime'))
        let extInfoObj = null
        if (this.model.extInfo != null) {
          extInfoObj = JSON.parse(this.model.extInfo)
          if (extInfoObj.nvr !== undefined) {
            this.joinType = 2
          } else {
            this.joinType = 1
          }

          let a = pick(extInfoObj, 'serialCode', 'cameraTreeId', 'authCode', 'nvr', 'channelNumber','cameraType')
          let b = pick(this.model, 'deviceName', 'deviceNumber', 'sort', 'model','manufacturer', 'devicePic','remarks')

          this.pickFrom = Object.assign(a, b)
        }
        setTimeout(() => {
          this.form.setFieldsValue(this.pickFrom)
        }, 400)
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = { id: this.formData.dataId }
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result)
          }
        })
      }
    },
    //获取nvr设备
    handleChange(value) {
      this.joinType = value
      if (value == 2) {
        let params = {
          deviceCatagory: 'nvr',
          relTenantIds: this.$store.state.user.info.relTenantIds,
        }
        getAction(this.url.queryDeviceByDeviceCatagory, params).then((res) => {
          if (res.success) {
            this.nvrList = res.result
          }
        })
      }
    },
    //选择nvr设备
    getItem(item) {
      let extInfo = JSON.parse(item.extInfo)
      this.nvrSerialCode = extInfo.serialCode
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }

          let extInfo = JSON.stringify({
            serialCode: this.joinType == 2 ? this.nvrSerialCode : values.serialCode,
            cameraTreeId: this.cameraTreeId,
            cameraType: values.cameraType,
            authCode: values.authCode,
            nvr: values.nvr,
            channelNumber: values.channelNumber
          })

          let formData = Object.assign(this.model, values)
          formData.extInfo = extInfo

          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'deviceTypeId', 'deviceName','model','manufacturer','devicePic', 'remarks'))
    },
  },
}
</script>