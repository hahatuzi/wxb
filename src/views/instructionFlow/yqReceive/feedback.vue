<template>
    <div>
<!--      <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--        <img src="/static/images/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--        <span>当前位置：</span>-->
<!--        <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--          <el-breadcrumb-item>舆情通报接收</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item>反馈</el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->
<!--      </div>-->





      <!--反馈窗口-->
      <el-dialog
        title="反馈信息"
        :visible.sync="feedbackWindow"
        width="40%">
        <div>
          <el-divider></el-divider>
          <el-form :model="feedbackForm" ref="feedbackForm" label-width="100px" :rules="rules" :show-message="false">
            <el-form-item label="反馈内容" prop="context">
              <el-input type="textarea"  :rows="12" v-model="feedbackForm.context"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="upload-wrap" style="width: 100%;">
                <el-upload
                  action=""
                  name="file"
                  :accept="$fileType.toString()"
                  :with-credentials="true"
                  ref="fileUpload"
                  :file-list="fileList"
                  list-type="picture-card"
                  :on-change="fileChange"
                  :on-success="handleUpload"
                  :http-request="uploadFile"
                  :before-upload="beforeUpload"
                  :on-preview="handlePictureCardPreview"
                >
                  <i class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}" >
                    <div  class="el-upload-list__item-thumbnail">
                      <div style="position: absolute; bottom: 10px; left: 10px; z-index: 10; font-size: 10px; font-weight:bold; height:20px; line-height: 20px; text-align: center;">{{file.name}}</div>
                      <img :src="file.url" alt="" style="margin-top: 2px; margin-left: 10px;"  width="70%" height="70%" @click="filePreview">
                    </div>
                    <label v-show="file.status='success'" class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
                    <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" >
         <img src="@/assets/yqInfo/tijiao.png" @click="feedback('feedbackForm')" height="35" class="click" />
         <img src="@/assets/common/fanhui.png" @click="closeFeedback" height="35" class="click" />
       </span>
      </el-dialog>

      <!--附件查看窗口-->
      <el-dialog
        title="查看附件"
        :visible.sync="fileWindow"
        width="40%">
        <div>
          <el-divider></el-divider>
          <el-form>
            <el-form-item label="相关附件">
              <div style="display: inline-block">
                <el-row class="file-list">
                  <el-col class="fileItem" v-for="file in feedbackFile" :key="file.FILEID">
                    <div class="fileItem-hover" @click="downloadFile(file)">
                      <i class="el-icon-download"></i>
                    </div>
                    <img :src="file.showUrl" />
                    <span class="label">{{file.file_name}}</span>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" >
         <img src="@/assets/common/fanhui.png" @click="fileWindow = false" height="35" class="click" />
       </span>
      </el-dialog>



      <div style="width:80vw;box-sizing: border-box;padding:20px 10vw;">
        <div>
          <el-form ref="form" :model="form"  label-width="100px">
            <el-form-item label="通报类型" prop="itype">
              <span>{{form.itype}}</span>
            </el-form-item>
            <el-form-item label="通报标题" prop="iname">
              <span>{{form.iname}}</span>
            </el-form-item>
            <el-form-item v-if="form.itype!='书面通报'"  label="链接" prop="iinfolink">
              <span>{{form.iinfolink}}</span>
            </el-form-item>

            <el-form-item  v-if="new Date().getTime() - form.orderdateTime <=  1000*60*60*24*3"  label="要求" prop="iname">
              <div v-if="new Date().getTime() - form.orderdateTime <=  1000*60*60*24*3">
                <span v-if="form.require == 1" class="show">{{requireList[0].label}}</span>
                <span v-if="form.require == 2" class="show">{{requireList[1].label}}</span>
                <span v-if="form.require == 3" class="show">{{requireList[2].label}}</span>
                <span v-if="form.require == 4" class="show">{{form.requirerk}}</span>
              </div>
            </el-form-item>

            <el-form-item label="内容" prop="itext">
              <span v-html="form.itext"></span>
            </el-form-item>
<!--            <el-form-item label="备注" prop="remark">-->
<!--              <span>{{form.remark}}</span>-->
<!--            </el-form-item>-->
            <el-form-item label="相关附件">
              <div style="display: inline-block">
                <el-row class="file-list">
                  <el-col class="fileItem" v-for="file in form.fileList" :key="file.FILEID">
                    <div class="fileItem-hover" @click="downloadFile(file)">
                      <i class="el-icon-download"></i>
                    </div>
                    <img src="@/assets/common/fujianbg.png" />
                    <span class="label">{{file.file_name}}</span>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-form>
        </div>


        <el-row style="padding: 0 0px; box-sizing: border-box">
          <div class="title-wrap"></div>
          <h2 style="font-size: 20px; font-weight: 400;font-family: 微软雅黑;">反馈内容</h2>
          <el-col style="margin-left: 5%;" :span="21">
            <el-row class="feedback-list">
              <el-col
                class="feedback-item-wrap">
                <el-col class="feedback-item">
                  <div class="feedback-unit">
                    反馈单位：{{this.unitName}}
                    <img src="@/assets/xz/fankui.png" class="click feed-btn" @click="feedbackWindow = true"  height="35" />
                  </div>
                  <div class="feedback-content">

                    <template v-for="feedback in feedbackList " >

                      <el-row  style="margin-bottom: 20px;">
                        <div class="time-wrap">{{parseTime(new Date(feedback.sdate))}}</div>
                        <el-row type="flex" :justify="feedback.type=='2'?'start':'end'">
                          <el-col    style="max-width: 50%;width:auto">
                            <div :class="{'user-wrap':true, 'left':feedback.type=='2','right':feedback.type=='1'}">
                              <template v-if="feedback.type=='2'">
                                <span class="name">{{feedback.susername}}</span>
                                <span v-if="feedback.fileList!=null && feedback.fileList.length>0" class="file"  @click="showFj(feedback.fileList)"><img src="/static/images/img/xz/fj.png" style="width:16px; height:16px;" alt="">相关附件</span>
                              </template>
                              <template v-else>
                                <span v-if="feedback.fileList!=null && feedback.fileList.length>0" class="file" @click="showFj(feedback.fileList)"><img src="/static/images/img/xz/fj.png" style="width:16px; height:16px;" alt="">相关附件</span>
                                <span class="name">{{feedback.susername}}</span>
                              </template>
                            </div>
                            <div :class="{'message-wrap':true,'left':feedback.type==2,'right':feedback.type==1}">
                              {{feedback.stext}}
                            </div>
                          </el-col>
                        </el-row>

                      </el-row>

                    </template>

                  </div>
                </el-col>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="text-align: center">
          <img src="@/assets/common/fanhui.png" class="function-button" @click="$router.push('/instructionFlow/yqReceive')">
        </el-row>

      </div>
    </div>
</template>

<script>
    import { requireList } from '@/utils/config'
    import { uploadFile, download } from '@/api/file/index'
    import { queryDetail, queryFeedback, doFeedback } from '@/api/yqReceive'
    import { parseTime } from '@/utils/ruoyi'

    import store from "../../../store";
    export default {
        name: "feedback",
        data(){
          return {
            form:{},
            requireList:requireList,
            feedbackList:[],
            fileWindow:false,
            //反馈附件列表
            feedbackFile:[],
            feedbackForm:{
              context:''
            },
            rules:{
                context:[
                    {required:true,message:'反馈内容不能为空',trigger:'blur'}
                ]
            },
            feedbackWindow:false,
            //文件上传部分
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList:[],
            fileIdList:[],
            fileType:{
                file:'file.png',
                img:'img.png',
                pdf:'pdf.png',
                word:'word.png',
                excel:'excel.png',
                rar:'rar.png',
                txt:'txt.png',
                ppt:'ppt.png'
            },
            unitName: ''
          }
        },
        mounted() {
          this.unitName = localStorage.getItem("unitName")
          this.query();
          this.queryFeedback();
        },
        methods:{

          //查看附件
          showFj(fileList){
            this.feedbackFile = fileList.slice(0);
            this.feedbackFile.forEach(item=>{item.showUrl = this.choiceTypeImg(item.file_name)});
            this.fileWindow = true;
          },
          //关闭反馈窗口
          closeFeedback(){
            this.feedbackWindow = false;
            this.fileList = [];
            this.fileIdList = [];
            this.feedbackForm.context = '';
          },
          query(){
            var _this = this;
            queryDetail(_this.$route.query.informid).then(result => {
              _this.form = result.data;
              _this.form.orderdateTime = new Date(Date.parse(new Date(_this.form.orderdate.replace(/-/g,"/")))).getTime();
              store.dispatch('GetUnread')
            })
          },
          queryFeedback(){
              var _this = this;
              queryFeedback({
                receiveid:_this.$route.query.receiveid
              }).then(result => {
                _this.feedbackList = result.data;
              })
          },
          feedback(formName){
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.$confirm('是否反馈？', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                      }).then(() => {
                          this.submit();
                      }).catch(() => {
                      });
                  } else {
                      this.$alert('反馈内容不能为空！');
                      return false;
                  }
              });
          },
          submit(){
              var _this = this;
              var sentimentReceiveFeedbakDetail = {
                  "feedbackid": "",
                  "fileIdList": _this.fileIdList.slice(0),
                  "fileList": [{}],
                  "receiveid": _this.$route.query.receiveid,
                  "sdate": "",
                  "state": "",
                  "stext": _this.feedbackForm.context,
                  "suser": "",
                  "susername": ""
              };

              doFeedback(sentimentReceiveFeedbakDetail).then(result => {
                this.$message({showClose: false,message: '反馈成功',duration:1000, type:'success'});
                this.queryFeedback();
                this.closeFeedback();
              })
          },

          //文件下载
          downloadFile(file){
              // config.downloadFile('/filed/get',{p:file.FILEID},file.FILENAME);
            download(file.file_id,file.file_name);
          },
            /***************文件上传部分***********************/
            //文件校验
            beforeUpload(file){
              console.log(file.name,file.size);
              return this.$validFile(file);
            },

            //文件上传
            uploadFile(content){
              const data = new FormData();
              data.append('file', content.file);
              uploadFile(data).then( res =>{
                console.log("文件上传");
                console.log(res);
                content.onSuccess(res);
              })
            },
            //文件上传成功回调
            handleUpload(response){
                this.$message({showClose: false,message: '上传成功',duration:1500, type:'success'});
                this.fileIdList.push(response.data.id);
                console.log(this.fileIdList);
            },
            //文件移除部分
            handleRemove(file) {
                this.$refs.fileUpload.handleRemove(file);
                var index = this.fileIdList.indexOf(file.response.data.id);
                if(index!=-1){
                    this.fileIdList.splice(index,1);
                }
            },
            handlePictureCardPreview(){},
            handleDownload(file) {
                console.log(file);
            },
            filePreview(fileUrl){
                console.log('预览');
            },
            choiceTypeImg(fileName){

                var urlArr =  fileName.split('.');
                var fileType = urlArr[urlArr.length-1];
                var imgUrl = '';
                if(fileType=='bmp'||fileType=='jpg'||fileType=='png'||fileType=='jpeg'||fileType=='mpg'){
                    imgUrl = 'static/images/img/'+this.fileType.img;
                }
                else if(fileType=='txt'){
                    imgUrl = 'static/images/img/'+this.fileType.txt;
                }
                else if(fileType=='doc'||fileType=='docx'){
                    imgUrl = 'static/images/img/'+this.fileType.word;
                }
                else if(fileType=='pdf'){
                    imgUrl= 'static/images/img/'+this.fileType.pdf;
                }
                else if(fileType=='xls'||fileType=='xlsx'){
                    imgUrl= 'static/images/img/'+this.fileType.excel;
                }
                else if(fileType=='rar'||fileType=='zip'){
                    imgUrl = 'static/images/img/'+this.fileType.rar;
                }
                else if(fileType=='ppt'||fileType=='pptx'){
                    imgUrl = 'static/images/img/'+this.fileType.ppt;
                }
                else{
                    imgUrl = 'static/images/img/'+this.fileType.file;
                }
                return imgUrl;
            },
            fileChange(file){
                file.url = this.choiceTypeImg(file.name);
            },
            /*************End**********************/

        }
    }
</script>

<style lang="scss">

  ul{
    padding:0;
    li{
      list-style: none;

    }
  }

  /*文件下载  */
  .file-list {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    .fileItem {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      position: relative;
      margin: 10px;
      box-sizing: border-box;
      img {
        width: 55px;
        height: 55px;
        display: block;
        margin: 0 auto;
      }
      .label {
        width: 80px;
        font-size: 10px;
        text-align: center;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fileItem-hover {
        display: none;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        line-height: 80px;
        text-align: center;
        color: white;
        font-size: 12px;
      }
    }
    .fileItem:hover .fileItem-hover {
      display: block;
    }
  }

  .feedback-list{
    margin-top: 15px;
    .feedback-item-wrap{
      margin-bottom: 30px;
      .feedback-item{
        border: 1px solid rgba(195, 195, 195, 1);
        padding-bottom: 10px;
        box-sizing: border-box;
        .feedback-unit{
          width: 100%;
          height: 60px;
          line-height: 60px;
          padding-left: 15px;
          box-sizing: border-box;
          opacity: 0.6;
          border-radius: 2px;
          background-color: #E3E8F1;
          box-shadow:  inset 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
          color: #333;
          font-size: 16px;
          text-align: left;
          font-family: STHeitiSC-Medium;
          position: relative;
          .feed-btn{
            position: absolute;
            width: 84px;
            height: 34px;
            top:13px;
            right: 65px;
          }
        }
        .feedback-content{
          width: 100%;
          height: auto;
          padding: 15px;
          box-sizing: border-box;
          .time-wrap{
            text-align: center;
            color: rgba(102, 102, 102, 100);
            font-size: 16px;
            text-align: center;
            font-family: STHeitiSC-Medium;
          }
          .user-wrap{
            width: 100%;
            .name{
              color: rgba(102, 102, 102, 100);
              font-size: 16px;
              text-align: left;
              font-family: STHeitiSC-Medium;
              margin: 0 10px;
            }
            .file{
              color: rgba(27, 132, 188, 100);
              font-size: 16px;
              text-align: left;
              font-family: STHeitiSC-Medium;
              cursor: pointer;
            }
          }
          .user-wrap.left{
            text-align: left;
          }
          .user-wrap.right{
            text-align: right;
          }
          .message-wrap{
            margin-top: 15px;
            width: 100%;
            height: auto;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 5px;
          }
          .message-wrap.left{
            background-color: #E3E8F1;
          }
          .message-wrap.right{
            background-color: rgb(77,160,154);
            color:white;
          }
        }
        .remark{
          width: 100%;
          margin-top: 50px;
          padding-right:20px;
          box-sizing: border-box
        }
      }
    }

  }



</style>
