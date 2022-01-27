<template>
  <div id="meetingInfo">
    <div style="box-sizing: border-box;padding:20px;">
      <el-row type="flex" justify="center">
        <p style="font-family: STHeitiSC-Medium;font-size: 24px;color: #02214D;letter-spacing: -0.73px;text-align: center;margin:10px 0;">
          {{noticeObj.meetingName}}
        </p>
      </el-row>
      <div style="background: #F9FCFF;box-shadow: 0 2px 4px 2px rgba(0,0,0,0.50);border-radius: 3px;width:70vw;margin:0 auto;padding:10px;">
        <el-row  type="flex" justify="center">
          <div style="width: 94%;">
            <el-row type="flex" justify="center" style="font-family: STHeitiSC-Medium;font-size: 16px;color: #666666;letter-spacing: 0;margin-top:10px">
              <span>会议时间：</span>{{noticeObj.meetingTime}}
              <span style="margin-left:2em">反馈截止时间：</span>{{parseTime(new Date(noticeObj.feedbackEnd),'{y}-{m}-{d}')}}
            </el-row>
            <el-divider></el-divider>
            <el-row style="font-family: STHeitiSC-Medium;font-size: 16px;color: #333333;letter-spacing: 0.61px;" >
              <el-form label-width="100px" :model="noticeObj" ref="noticeObj" :rules="outRules" :hide-required-asterisk="this.$route.query.operateType == 1">
                <el-form-item label="会议地点">
                  {{noticeObj.meetingAddr}}
                </el-form-item>
                <el-form-item label="会议说明">
                  {{noticeObj.description}}
                </el-form-item>
                <el-form-item label="相关附件">
                  <div style="display: inline-block">
                    <el-row class="file-list">
                      <el-col class="fileItem" v-for="file in noticeObj.fileList" :key="file.fileId">
                        <div class="fileItem-hover" @click="downloadFile(file)">
                          下载
                        </div>
                        <img :src="file.url" />
                        <span class="label">{{file.fileName}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>


                <template v-if="this.$route.query.operateType == 0">
                  <el-divider></el-divider>
                  <el-row type="flex" justify="center">
                    <img src="@/assets/yqInfo/fankui.png" class="function-button" @click="showFeedback = true">
                    <img src="@/assets/common/fanhui.png" class="function-button" @click="goBack">
                  </el-row>
                </template>


                <el-row type="flex" justify="center" v-if="showFeedback">
                  <p style="font-family: STHeitiSC-Medium;font-size: 24px;color: #02214D;letter-spacing: -0.73px;text-align: center;margin:10px 0;">
                    需要反馈的内容：
                  </p>
                </el-row>
                <template v-if="$route.query.operateType == 1 || ($route.query.operateType == 0 && showFeedback == true)">
                  <el-form-item label="反馈内容" prop="userList">
                    <img src="@/assets/common/tianjia1.png" class="function-button" @click="showAdd" v-if="$route.query.operateType == 0 && showFeedback == true">
                    <el-table
                      :data="noticeObj.userList"
                      header-cell-class-name="headerCellClass"
                      cell-class-name="tableCellClass"
                      border
                      v-loading="loading"
                      style="width: 100%">
                      <el-table-column
                        prop="userName"
                        label="出席人员姓名"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="post"
                        label="职务"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="tel"
                        label="联系方式"
                        align="center">
                      </el-table-column>
                      <el-table-column v-if="showFeedback"
                                       label="操作"
                                       align="center">
                        <template slot-scope="scope">
                          <img src="@/assets/common/shanchu2.png" class="function-button" @click="deletePerson(scope.row)">
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <el-form-item>
                    <span>显示第{{noticeObj.userList.length > 0?1:0}}到第{{noticeObj.userList.length}}条记录，总共{{noticeObj.userList.length}}条记录</span>
                  </el-form-item>
                  <el-form-item label="备注">
                    <template v-if="$route.query.operateType == 1">
                      {{noticeObj.feedbackContent}}
                    </template>
                    <template v-else>
                      <el-input type="textarea" v-model="noticeObj.feedbackContent"></el-input>
                    </template>
                  </el-form-item>
                  <el-form-item label="相关附件">
                    <template v-if="$route.query.operateType == 1">
                      <div style="display: inline-block">
                        <el-row class="file-list">
                          <el-col class="fileItem" v-for="file in noticeObj.feedbackFileList" :key="file.fileId">
                            <div class="fileItem-hover el-icon-download" @click="downloadFile(file)"></div>
                            <img :src="file.url" />
                            <span class="label">{{file.fileName}}</span>
                          </el-col>
                        </el-row>
                      </div>
                    </template>
                    <template v-else>
                      <div class="upload-wrap"style="width: 100%;">
                        <el-upload
                          :multiple="true"
                          name="file"
                          action=""
                          :accept="$fileType.toString()"
                          :with-credentials="true"
                          ref="fileUpload"
                          :file-list="fileList"
                          list-type="picture-card"
                          :on-change="fileChange"
                          :on-success="handleUpload"
                          :before-upload="beforeUpload"
                          :http-request="uploadFile">
                          <i class="el-icon-plus"></i>
                          <div slot="file" slot-scope="{file}" >
                            <div  class="el-upload-list__item-thumbnail">
                              <div style="position: absolute; bottom: 10px; left: 10px; z-index: 10; font-size: 10px; font-weight:bold;height:20px; line-height: 20px; text-align: center;">{{file.name}}</div>
                              <img :src="file.url" alt="" style="margin-top: 2px; margin-left: 10px;"  width="70%" height="70%">
                            </div>
                            <label v-show="file.status='success'" class="el-upload-list__item-status-label">
                              <i class="el-icon-upload-success el-icon-check"></i>
                            </label>
                            <span class="el-upload-list__item-actions">
                              <span
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                              </span>
                            </span>
                          </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                          <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                      </div>
                    </template>
                  </el-form-item>
                </template>

                <template v-if="$route.query.operateType == 1">
                  <el-row type="flex" justify="center">
                    <img src="@/assets/common/fanhui.png" class="function-button" @click="goBack">
                  </el-row>
                </template>
                <template v-if="$route.query.operateType == 0 && showFeedback == true">
                  <el-row type="flex" justify="center">
                    <img src="@/assets/common/shangbao.png" class="function-button" @click="reportFeedback">
                  </el-row>
                </template>
              </el-form>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>

    <el-dialog title="添加人员" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="personInfo" label-width="120px" ref="personInfo" :rules="rules">
        <el-form-item label="出席人员姓名" prop="name">
          <el-input v-model="personInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-input v-model="personInfo.position" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="personInfo.tel" placeholder="请填写11位有效的手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <img src="@/assets/common/queding.png" class="function-button" @click="addPerson">
        <img src="@/assets/common/quxiao3.png" class="function-button" @click="cancelAdd">
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import store from '../../../../store'
  import { select, feedbackDetail, addUser, deleteUser, feedback } from '@/api/notice/meeting'
  import { uploadFile, download } from '@/api/file'

  export default {
    name: "meetingInfo",
    data(){
      var validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
            callback(new Error('请填写11位有效的手机号码'));
          }else
            callback();
        }
      };
      var validateContent = (rule, value, callback) => {
        if(this.noticeObj.userList.length < 1)
          callback('反馈内容不能为空');
        else
          callback();
      };
      return {
        meetingUid: this.$route.query.meetingUid,
        feedbackUid: this.$route.query.feedbackUid,
        noticeObj:{
          userList:[]
        },
        outRules:{
          userList:[
            {validator:validateContent,trigger:'blur'}
          ]
        },
        showFeedback:false,
        personInfo:{
          name:'',
          position:'',
          tel:''
        },
        dialogFormVisible:false,
        files:[],
        rules:{
          name:[
            {required:true,message:'姓名必填',trigger:'blur'}
          ],
          position:[
            {required:true,message:'职务必填',trigger:'blur'}
          ],
          tel:[
            {required:true,message:'手机号必填',trigger:'blur'},
            {validator:validateTel,trigger:'blur'}
          ]
        },
        total:0,
        loading:true,

        //文件上传部分
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList:[],
        fileIdList:[]
      }
    },
    mounted() {
      this.query();
    },
    methods:{

      query(){
        select(this.meetingUid).then(res=>{
          this.noticeObj = res.data;
          this.noticeObj.userList = [];
          store.dispatch('GetUnread')
          // this.total = this.noticeObj.userList.length;

          this.noticeObj.fileList.forEach(file => {
            this.fileChange(file)
          })

          this.queryFeedback()
        }).finally(() => {
          this.loading = false;
        })
      },

      queryFeedback() {
        if(this.feedbackUid)
          feedbackDetail(this.feedbackUid).then(res => {
            this.noticeObj.userList = res.data.userList
            this.noticeObj.feedbackContent = res.data.feedbackContent
            this.noticeObj.feedbackFileList = res.data.fileList;
            this.noticeObj.feedbackFileList.forEach(file => {
              this.fileChange(file)
            })
          })
      },

      addPerson(){
        this.$refs['personInfo'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            this.showFeedback = true;
            this.reportPerson();
          } else {
            return false;
          }
        });
      },
      reportPerson(){
        var person = {
          post:this.personInfo.position,
          tel:this.personInfo.tel,
          userName:this.personInfo.name,
        };
        addUser(person).then(res=>{
          this.$message.success('新增成功')
          person.id = res.msg;
          this.noticeObj.userList.push(person);
          this.cancelAdd()
        })
      },

      deletePerson(row){
        deleteUser(row.id).then(res=>{
          this.$message.success('删除成功');
          this.noticeObj.userList = this.noticeObj.userList.filter(item => item.id !== row.id)
        })
      },

      showAdd(){
        this.dialogFormVisible = true;
        this.personInfo = {};
      },

      cancelAdd(){
        this.dialogFormVisible = false;
        this.$refs['personInfo'].resetFields();
      },

      //文件下载
      downloadFile(file){
        download(file.fileId,file.fileName);
      },

      reportFeedback() {
        this.$refs['noticeObj'].validate((valid) => {
          if (valid) {
            this.doReport();
          } else {
            return false;
          }
        });
      },
      doReport(){
        let params = {
          fileList:this.fileIdList.slice(0),
          meetingUid: this.meetingUid,
          feedbackContent:this.noticeObj.feedbackContent,
          meetingUserList: this.noticeObj.userList.map(item => item.id)
        }
        feedback(params).then(res =>{
          this.$message.success('反馈成功');
          this.goBack();
        })

      },
      goBack() {
        this.$router.push(`/instructionFlow/notice/meetingNotice`);
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
    }

  }
</script>


<style lang="scss">

</style>
