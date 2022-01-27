<template>
  <div id="otherInfo">
<!--    <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--      <img src="@/assets/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--      <span>当前位置：</span>-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--        <el-breadcrumb-item>约稿</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>上传</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div style="box-sizing: border-box;padding:20px;">
      <el-row type="flex" justify="center">
        <p style="font-family: STHeitiSC-Medium;font-size: 24px;color: #02214D;letter-spacing: -0.73px;text-align: center;margin:10px 0;">
          {{noticeObj.title}}
        </p>
      </el-row>
      <div style="background: #F9FCFF;box-shadow: 0 2px 4px 2px rgba(0,0,0,0.50);border-radius: 3px;width:70vw;margin:0 auto;padding:10px;">
        <el-row  type="flex" justify="center">
          <div style="width: 94%;">
            <el-row type="flex" justify="center" style="font-family: STHeitiSC-Medium;font-size: 16px;color: #666666;letter-spacing: 0;margin-top:10px">
              <span>通知时间：</span>{{noticeObj.informTime|formatDate('order')}}
              <template v-if="noticeObj.ISFEED != 0">
                <span style="margin-left:2em">上传截止时间：</span>{{noticeObj.endTime|formatDate('order')}}
              </template>
            </el-row>
            <el-divider></el-divider>
            <el-row style="font-family: STHeitiSC-Medium;font-size: 16px;color: #333333;letter-spacing: 0.61px;" >
              <el-form :model="noticeObj" label-width="100px" ref="noticeObj" :rules="rules" :hide-required-asterisk="$route.query.operateType == 1">

                <el-form-item label="约稿内容">
                  <div v-html="noticeObj.conHtml"></div>
                </el-form-item>
                <el-form-item label="联系电话">
                  {{noticeObj.phone}}
                </el-form-item>

                <el-form-item label="相关附件">
                  <div style="display: inline-block">
                    <el-row class="file-list">
                      <el-col class="fileItem" v-for="file in noticeObj.fileList" :key="file.FILEID">
                        <div class="fileItem-hover" @click="downloadFile(file)">
                          下载
                        </div>
                        <img :src="file.showUrl" />
                        <span class="label">{{file.file_name}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>

                <!-- 未过期可以输入内容或添加附件-->
                <el-form-item label="上传内容" prop="feedbackContent" class="is-required">
                  <span v-if="$route.query.operateType == 1">{{noticeObj.draftFeedback && noticeObj.draftFeedback.content}}</span>
                  <el-input v-else type="textarea" v-model="feedbackObj.content"></el-input>
                </el-form-item>

                <template v-if="$route.query.operateType == 1">
                  <el-form-item label="">
                    <div style="display: inline-block">
                      <el-row class="file-list">
                        <template v-if="noticeObj.draftFeedback">
                          <el-col class="fileItem" v-for="file in noticeObj.draftFeedback.fileList" :key="file.FILEID">
                            <div class="fileItem-hover" @click="downloadFile(file)">
                              下载
                            </div>
                            <img :src="file.showUrl" />
                            <span class="label">{{file.file_name}}</span>
                          </el-col>
                        </template>
                      </el-row>
                    </div>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item>
                    <div class="upload-wrap"style="width: 100%;">
                      <el-upload
                        name="file"
                        action=""
                        :accept="$fileType.toString()"
                        :with-credentials="true"
                        ref="fileUpload"
                        :file-list="fileList"
                        list-type="picture-card"
                        :on-change="fileChange"
                        :on-success="handleUpload"
                        :http-request="uploadFile"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeUpload"
                        :multiple="true"
                      >
                        <i class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}" >
                          <div  class="el-upload-list__item-thumbnail">
                            <div style="position: absolute; bottom: 10px; left: 10px; z-index: 10; font-size: 10px; font-weight:bold;height:20px; line-height: 20px; text-align: center;">{{file.name}}</div>
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
                </template>
              </el-form>

            </el-row>
            <el-divider></el-divider>
            <el-row type="flex" justify="center">
              <img v-if="$route.query.operateType == 0" src="@/assets/yqInfo/shangchuan.png" class="function-button" @click="feedbackInfo">
              <img src="@/assets/common/fanhui.png" class="function-button" @click="goBack">
            </el-row>
          </div>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import {select,feedback} from '@/api/yg/index'
  import { downloadFile } from '@/utils/exportFile'
  import { parseTime } from '@/utils/ruoyi'
  import { ygUploadFile } from '@/api/file/index'


  export default {
    name: "otherInfo",
    data(){
      return {
        reqPrefix:'yqgz',
        pathPrefix:'/yqInforComponent',
        recId:this.$route.query.id,
        noticeObj:{},
        feedbackList:[],
        feedbackFileList:[],
        //反馈
        feedbackObj:{
          content:undefined,
          fileIdList:[],
          recId:this.$route.query.id
        },
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
        rules:{
          feedbackContent:[
            // {required: true,message:'上传内容必填',trigger:'blur'}
          ]
        }
      }
    },
    computed:{
      total:function () {
        return this.feedbackList.length;
      }
    },
    mounted() {
      this.getDetail();
    },
    methods:{
      goBack(){
        this.$router.go(-1);
      },

      getDetail(){
        select(this.recId).then(res=>{
          this.noticeObj = res.data;
          this.noticeObj.fileList.forEach(item=>{item.showUrl = this.choiceTypeImg(item.file_name.substring(item.file_name.lastIndexOf(".")+1).toLowerCase())})
          this.noticeObj.draftFeedback && this.noticeObj.draftFeedback.fileList.forEach( item => {
            item.showUrl = this.choiceTypeImg(item.file_name.substring(item.file_name.lastIndexOf(".")+1).toLowerCase())
          });
        })
      },
      //反馈
      feedbackInfo(){
        this.feedbackObj.fileIdList = this.fileIdList;
        console.log(this.feedbackObj);
        if(this.feedbackObj.content==''){
          this.$message({showClose: false,message: '内容不可为空',duration:1500, });
          return;
        }

        feedback(this.feedbackObj).then( res =>{
          this.$message({showClose: false,message: '上传成功',duration:1000, type:'success'});
          setTimeout(()=>{
            this.goBack();
          },500)
        })
      },


      //文件下载
      downloadFile(file){
        console.log(file)

        let downloadParam = {
          url: '/system/filed/get',
          params: {p:file.file_id},
          fileName: file.file_name
        }
        downloadFile(downloadParam);

        // config.downloadFile('/filed/get',{p:file.FILEID},file.FILENAME);
      },



      //文件校验
      beforeUpload(file){
        console.log(file.name,file.size);
        return this.$validFile(file);
      },
      //文件上传
      uploadFile(content){
        const data = new FormData();
        data.append('file', content.file);

        ygUploadFile(data).then(response =>{
          console.log("文件上传");
          console.log(response);
          content.onSuccess(response);
        })
      },
      //文件上传成功回调
      handleUpload(response){
        console.log(response);
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
        console.log(this.fileIdList);
      },
      handlePictureCardPreview(){},
      handleDownload(file) {
        console.log(file);
      },
      filePreview(fileUrl){
        console.log('预览');
      },
      choiceTypeImg(fileType){
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
        var urlArr =  file.name.split('.');
        var fileType = urlArr[urlArr.length-1];
        console.log("文件类型："+fileType);
        file.url = this.choiceTypeImg(fileType);
      },
      /*************End**********************/
    },
    filters:{
      formatDate(val,type){

        if(val === ''||val === undefined){
          return '';
        }
        var date = new Date(val);
        if(type === 'order'){
          return parseTime(date,'{y}-{m}-{d} {h}:{i}:{s}');
        }
        else if(type === 'meeting'){
          return parseTime(date,'{y}-{m}-{d} {h}:{i}');
        }
        else{
          return ''
        }
      }
    }
  }
</script>

<style lang="scss">
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
</style>
