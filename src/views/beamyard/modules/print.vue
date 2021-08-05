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
          <a-form id="printDom" ref="print" style="height:auto!important;overflow: initial!important;">
            <div v-for="(item,index) in arrInfoList" :key="index" class="item">
              <!-- <div class="printtitle">{{item.reservoirName}}</div> -->
              <div class="printbox clearfix">
                <div class="printbox-left">
                  <div class="printtxt">桥名称：<span class="printspan">{{item.bridgeName}}</span></div>
                  <div class="printtxt">梁长差值（cm）：<span class="printspan">{{item.beamLengthDifference}}</span></div>
                  <!-- <div class="printtxt">点位ID：<span>{{item.id}}</span></div> -->
                  <div class="printtxt">创建时间：<span class="printspan">{{item.createTime}}</span></div>
                </div>
                <div class="printbox-right">
                  <div :id="'qrcode'+index"></div>
                </div>
              </div>
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
        arrList:[],
        arrInfoList:[]
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
          this.arrInfoList = []
          val=val.substring(0,val.length-1);
          this.arrList=val.split(';');
          // console.log(this.arrList)
          this.arrList.forEach((value,index) =>{
            let data = value.split(',');
            this.arrInfoList.push({createTime:data[0],id:data[1],bridgeName:data[2],beamLengthDifference:data[3]})
          })
          // console.log(this.arrInfoList);
           this.arrInfoList.forEach((a,b)=>{
              this.$nextTick (function () {
                let qrcodeEL = document.getElementById("qrcode"+b);
                let qrcode = new QRCode(qrcodeEL);  
                document.getElementById("qrcode"+b).innerHTML = "";
                qrcode=new QRCode('qrcode'+b, {
                  width: 160,  
                  height: 160,
                  text: a.id
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
.clearfix:after{
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix{
    zoom: 1;
}
@media print{
  html,body,div{
      height:auto!important;
      overflow: initial!important;
  }
}
/deep/.ant-modal-body{
  background-color: rgba(153,153,153,0.1);
}
#printDom{
  .item{
    margin:20px auto 20px;
    width: 80%;
    height: 220px;
    box-shadow: 5px 5px 5px rgba(51,51,51,0.3);
    background-color: #FFF;
    .printtitle{
      font-size: 18px;
      color: #000;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-bottom: 1px solid #e8e8e8;
    }
    .printbox{
      padding: 30px;
      .printbox-left{
        float: left;
        width: calc(100% - 180px);
        height: 160px;
        padding: 35px 30px 30px 50px;
        .printtxt{
          font-size: 16px;
          color: #333;
          font-weight: bold;
          margin-bottom: 10px;
          .printspan{
            color: #666;
            font-weight: normal;
          }
        }
      }
      .printbox-right{
        float: right;
        width: 160px;
        height: 160px;
        margin-right: 20px;
      }
    }
  }
}
#printDombox{
  height:600px;
  overflow: auto;
}
// #printDom{
//   width: 35%;
//   margin:0 auto;
//   div{
//     margin-top:30px;
//   }
// }

</style>