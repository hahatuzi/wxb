<template>
  <div id="otherInfo">
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
              <span>通知时间：</span>{{noticeObj.orderDate}}
              <template v-if="noticeObj.isFeedback != 0">
                <span style="margin-left:2em">反馈截止时间：</span>{{noticeObj.feedbackEnd}}
              </template>
            </el-row>
            <el-divider></el-divider>
            <el-row style="font-family: STHeitiSC-Medium;font-size: 16px;color: #333333;letter-spacing: 0.61px;" >
              <el-form :model="noticeObj" label-width="100px" ref="noticeObj" :rules="rules" :hide-required-asterisk="$route.query.operateType == 1">
                <el-form-item label="通知类型">
                  {{noticeObj.ntype}}
                </el-form-item>
                <el-form-item label="重要程度">
                  {{noticeObj.impLevel}}
                </el-form-item>
                <el-form-item label="通知内容">
                  {{noticeObj.noticeContent}}
                </el-form-item>
                <el-form-item label="相关附件">
                  <div style="display: inline-block">
                    <el-row class="file-list">
                      <el-col class="fileItem" v-for="file in noticeObj.fileList" :key="file.fileId">
                        <div class="fileItem-hover el-icon-download" @click="downloadFile(file)">
                        </div>
                        <img :src="file.url" />
                        <span class="label">{{file.fileName}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>


                <!-- 未过期可以输入内容或添加附件-->
                <el-form-item label="反馈内容" prop="feedbackContent">
                  <span v-if="operateType == 1">{{noticeObj.feedbackContent}}</span>
                  <el-input v-else type="textarea" v-model="noticeObj.feedbackContent"></el-input>
                </el-form-item>

                <template v-if="operateType == 1">
                  <el-form-item label="">
                    <div style="display: inline-block">
                      <el-row class="file-list">
                        <el-col class="fileItem" v-for="file in noticeObj.feedbackFileList" :key="file.fileId">
                          <div class="fileItem-hover el-icon-download" @click="downloadFile(file)">
                          </div>
                          <img :src="file.url" />
                          <span class="label">{{file.fileName}}</span>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item>
                    <div class="upload-wrap" style="width: 100%;">
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
                        :before-upload="beforeUpload"
                        :multiple="true"
                      >
                        <i class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}" >
                          <div  class="el-upload-list__item-thumbnail">
                            <div style="position: absolute; bottom: 10px; left: 10px; z-index: 10; font-size: 10px; font-weight:bold;height:20px; line-height: 20px; text-align: center;">{{file.name}}</div>
                            <img :src="file.url" alt="" style="margin-top: 2px; margin-left: 10px;"  width="70%" height="70%" >
                          </div>
                          <label v-show="file.status='success'" class="el-upload-list__item-status-label">
                            <i class="el-icon-upload-success el-icon-check"></i>
                          </label>
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
              <img v-if="operateType == 0" src="@/assets/common/fabiaofankui.png" class="function-button" @click="reportFeedback">
              <img src="@/assets/common/fanhui.png" class="function-button" @click="goBack">
            </el-row>
          </div>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import store from '../../../../store'
  import { uploadFile, download } from '@/api/file'
  import { select, feedbackDetail, feedback } from '@/api/notice/other'

  export default {
    name: "otherInfo",
    data(){
      return {
        informUid: this.$route.query.informUid,
        feedbackUid: this.$route.query.feedbackUid,
        operateType: this.$route.query.operateType,

        noticeObj:{},
        //文件上传部分
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList:[],
        fileIdList:[],
        loading:true,

        rules:{
          feedbackContent:[
            {required: true,message:'反馈内容必填',trigger:'blur'}
          ]
        }
      }
    },
    mounted() {
      this.query();
    },
    methods:{
      //查通知详情
      query(){
        select(this.informUid).then(res=>{
          store.dispatch('GetUnread')
          let obj = res.data;
          obj.fileList.forEach(file => {
            this.fileChange(file)
          })
          if(this.feedbackUid)
            this.queryFeedback(obj)
          else
            this.noticeObj = obj;
        }).finally(() => {
          this.loading = false;
        })
      },

      queryFeedback(obj) {
        if(this.feedbackUid)
          feedbackDetail(this.feedbackUid).then(res => {
            obj.feedbackContent = res.data.feedbackContent
            obj.feedbackFileList = res.data.fileList;
            obj.feedbackFileList.forEach(file => {
              this.fileChange(file)
            })
            this.noticeObj = obj;
          })
      },


      //文件下载
      downloadFile(file){
        download(file.fileId,file.fileName);
      },

      reportFeedback() {
        this.$refs['noticeObj'].validate((valid) => {
          if (valid) {
            this.doFeedback();
          } else {
            return false;
          }
        });
      },
      doFeedback(){
        let params = {
          informUid: this.informUid,
          feedbackContent:this.noticeObj.feedbackContent,
          fileList:this.fileIdList.slice(0),
        }
        feedback(params).then(res=>{
          this.$message.success('反馈成功');
          this.goBack();
        })

      },
      goBack() {
        this.$router.push('/instructionFlow/notice/otherNotice');
      },
      /***************文件上传部分***********************/

      //文件校验
      beforeUpload(file){
        return this.$validFile(file);
      },
      //文件上传
      uploadFile(content){
        const data = new FormData();
        data.append('file', content.file);
        uploadFile(data).then( res =>{
          content.onSuccess(res);
        })
      },
      //文件上传成功回调
      handleUpload(response){
        this.$message({showClose: false,message: '上传成功',duration:1500, type:'success'});
        this.fileIdList.push(response.data.id);
      },
      //文件移除部分
      handleRemove(file) {
        this.$refs.fileUpload.handleRemove(file);
        var index = this.fileIdList.indexOf(file.response.data.id);
        if(index!=-1){
          this.fileIdList.splice(index,1);
        }
      },

      fileChange(file){
        if(file.name)
          file.fileName = file.name
        var urlArr =  file.fileName.split('.');
        var fileType = urlArr[urlArr.length-1];
        file.url = this.$choiceTypeImg(fileType);
      },
      /*************End**********************/
    }
  }
</script>

<style lang="scss">

</style>
