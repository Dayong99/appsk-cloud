<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭" class="printcont">
    <a-spin :spinning="confirmLoading">
      <div id="printDombox">
          <a-form id="printDom" ref="print">
            <div v-for="(item,index) in arrList" :key="index" class="item">
              <div :id="'qrcode'+index"></div>
            </div>
          </a-form>
      </div>
    </a-spin>
    <template slot="footer">
        <a-button type="primary" @click="printClick()">打印</a-button>
      </template>
  </a-modal>
</template>

<script>
  import { httpAction,putAction,getAction } from '@/api/manage'
  import { documenTreeList } from '@/api/api'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import QRCode from 'qrcodejs2'
  export default {
    name: "SysDepartModal",
    components: { ATextarea ,QRCode},
    data () {
      return {
        departTree:[],
        orgTypeData:[],
        phoneWarning:'',
        title:"打印二维码",
        seen:false,
        visible: false,
        condition:true,
        disableSubmit:false,
        model: {},
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          add: "/sys/archivesTree/add",
           edit: "/sys/archivesTree/edit",
        },
        dictDisabled:true,
        editid:'',
        arrList:[]
      }
    },
    created () {
      
    },
    methods: {
      loadTreeData(){
        // var that = this;
        // documenTreeList().then((res)=>{
        //   if(res.success){
        //     that.departTree = [];
        //     for (let i = 0; i < res.result.length; i++) {
        //       let temp = res.result[i];
        //       that.departTree.push(temp);
        //     }
        //   }

        // })
      },
      add (val) {
        this.seen = true;
        this.dictDisabled = true;
        this.edit(val);
        if(val) {
          this.arrList=[]
          val=val.substring(0,val.length-1);
          this.arrList=val.split(',');
          console.log(this.arrList.length)
           this.arrList.forEach((a,b)=>{
              this.$nextTick (function () {
                let qrcodeEL = document.getElementById("qrcode"+b);
                let qrcode = new QRCode(qrcodeEL);  
                document.getElementById("qrcode"+b).innerHTML = "";
                qrcode=new QRCode('qrcode'+b, {
                  width: 232,  
                  height: 232,
                  text: a
                })
            })
          })
        }
      },
      printClick(){
         setTimeout(()=>{
            this.$print(this.$refs.print);
          },200)
      },
      edit (record) {
        console.log(record)
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          // this.loadTreeData();
          this.model.pid = record!=null?record.toString():null;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'name','remarks','sort','isAllowDelete','departNameEn','departNameAbbr','departOrder','description','orgType','orgCode','status','delFlag'))
          });
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk () {

      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped lang="less">
@media print{
  html,body,div{
      height:auto!important;
    //  overflow: initial!important;
  }
  #printDom .item{
    margin-top:20px;
  }
}
#printDombox{
  height:600px;
  overflow: auto;
}
#printDom{
  width: 35%;
  margin:0 auto;
  div{
    margin-top:30px;
  }
}

</style>