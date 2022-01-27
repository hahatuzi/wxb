<template>
    <div style="height:100%">
<!--      <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--        <img src="@/assets/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--        <span>当前位置：</span>-->
<!--        <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--          <el-breadcrumb-item>舆情线索</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item v-if="$route.query.operateType == 0">添加</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item v-else-if="$route.query.operateType == 1">查看</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item v-else>编辑</el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->
<!--      </div>-->
      <div style="width:80vw;box-sizing: border-box;padding:20px 10vw;">
        <el-form ref="form" :model="form"  label-width="100px" :hide-required-asterisk="!editable" :rules="rules" :inline-message="true">
          <el-form-item label="标题" prop="iname">
            <span v-if="!editable">{{form.iname}}</span>
            <el-input v-else v-model="form.iname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="iinfolink">
            <span v-if="!editable">{{form.iinfolink}}</span>
            <el-input v-else v-model="form.iinfolink" size="small"></el-input>
          </el-form-item>
          <el-form-item label="报送类型" prop="submissionType">
            <span v-if="!editable">{{form.submissionType}}</span>
            <el-select v-else v-model="form.submissionType" size="small">
              <el-option v-for="item in typeList"
                         :key="item.id"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="infocontent">
            <span v-if="!editable" v-html="form.infocontent"></span>
            <div v-show="editable" ref="editor" v-model="form.infocontent">
            </div>
          </el-form-item>
          <template v-if="form.submissionType == '舆情线索'">
            <el-form-item label="处置情况" required prop="disposalSituation">
              <span v-if="!editable">{{form.disposalSituation}}</span>
              <el-select v-else v-model="form.disposalSituation" size="small">
                <el-option v-for="item in disposeList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <template v-if="form.disposalSituation == '已处置'">
              <el-form-item label="处置内容" required>
                <span v-if="!editable">{{form.disposalRemark}}</span>
                <el-input  v-else type="textarea" size="small" v-model="form.disposalRemark"></el-input>
              </el-form-item>
            </template>
          </template>
          <el-form-item label="备注" prop="remark">
            <span v-if="!editable">{{form.remark}}</span>
            <el-input type="textarea" v-else v-model="form.remark" size="small"></el-input>
          </el-form-item>
          <template v-if="!editable">
            <el-form-item label="相关附件">
              <div style="display: inline-block">
                <el-row class="file-list">
                  <el-col class="fileItem" v-for="file in form.fileList" :key="file.FILEID">
                    <div class="fileItem-hover" @click="downloadFile(file)">
                      下载
                    </div>
                    <img src="@/assets/common/fujianbg.png" />
                    <span class="label">{{file.file_name}}</span>
                  </el-col>
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
          </template>
        </el-form>
        <el-row type="flex" justify="center">
          <template v-if="editable">
            <img src="@/assets/common/zabcun.png" class="function-button" @click="submit(0)">
            <img src="@/assets/common/shangbao.png" class="function-button" @click="submit(1)">
            <img src="@/assets/common/quxiao3.png" class="function-button" @click="returnToList">
          </template>
          <img v-else src="@/assets/common/fanhui.png" class="function-button" @click="returnToList">
        </el-row>
      </div>
    </div>

</template>

<script>
    import E from "wangeditor";
    import $ from "jquery"
    import {uploadFile,download} from '@/api/file/index'
    import {addClues,updateClues,addOrUpdateCluesSign, queryDetail} from '@/api/yg/aloneUtil'
    import {getCurrentUserId} from '@/api/user/user'
    export default {
        name: "yqCertClueInfo",
        data(){
          return {
            currentUserId:'',
            form:{submissionType:'约稿'
            },
            editable:false,
            typeList:[
                  {id:5, label:'约稿'}
              ],
            disposeList:[
                {id:1,label:'未处置'},
                {id:2,label:'已处置'}
            ],
            rules:{
                iname:[
                    {required:true,message:'标题必填',trigger:'blur'}
                ],
                submissionType:[
                    {required: true,message:'请选择报送类型',trigger:'blur'}
                ]
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
            }
          }
        },
        created(){
          getCurrentUserId().then(res=>{
            this.currentUserId = res.msg;
          })
        },
        methods:{
            returnToList(){
              this.$router.push('/instructionFlow/yqCertClues');
            },
            query(){
              queryDetail(this.$route.query.id).then(result =>{
                  this.form = result.data;
                  this.fileList = result.data.fileList;
                  this.editor.txt.html(result.data.infocontent);
                  if(this.$route.query.operateType == 2){
                      this.fileList = this.form.fileList.slice(0);
                      // this.fileIdList = [];
                      for(let i in this.fileList){
                          this.fileList[i].name = this.fileList[i].file_name;
                          this.fileChange(this.fileList[i]);
                          this.fileIdList.push(this.fileList[i].file_id);
                      }
                  }
              });
            },
            submit(val){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if(this.$route.query.operateType == 0){  //新增
                            this.report(val);
                        }else{  //修改
                            this.report2(val);
                        }
                    } else {
                        this.$alert('请填写必填项');
                        return false;
                    }
                });
            },
            //新增
            report(val){
                //val:0暂存1上报
                var _this = this;
                _this.form.infocontent = $(".w-e-text")[0].innerHTML;
                var tdinfo = {
                    "appointstype": "",
                    "appointtype": "",
                    "createtime": "",
                    "disposalRemark": _this.form.disposalRemark,
                    "disposalSituation": _this.form.disposalSituation,
                    "endTime": "",
                    "fileIdList": _this.fileIdList.slice(0),
                    "fileList": [
                        {}
                    ],
                    "groupid": "",
                    "iinfolink": _this.form.iinfolink,
                    "iname": _this.form.iname,
                    "infocontent": _this.form.infocontent,
                    "infoid": '',
                    "istate": val,
                    "remark": _this.form.remark,
                    "reportdate": "",
                    "reportunit": "",
                    "reportunitname": "CERT上海舆情",
                    "reportuser": this.currentUserId,
                    "reportusername": "",
                    "resultdate": "",
                    "resulttxt": "",
                    "resultuser": "",
                    "resultusernmae": "",
                    "startTime": "",
                    "submissionList": [],
                    "submissionType": _this.form.submissionType
                };
              //签名验签是验收时候用的，暂时先注掉，以后再弄
              // addOrUpdateCluesSign(tdinfo).then(res=>{
              //     let signHeader = res.msg;
              //     addClues(tdinfo,signHeader).then(res=>{
              //       _this.$router.push('/yqInforComponent/yqInfo_yqCertClues');
              //     })
              //   })
              let signHeader=undefined
              addClues(tdinfo,signHeader).then(res=>{
                this.returnToList()
              })
            },
            //修改
            report2(val){
                var _this = this;
                _this.form.infocontent = $(".w-e-text")[0].innerHTML;
                var tdinfo = {
                    "appointstype": "",
                    "appointtype": "",
                    "createtime": "",
                    "disposalRemark": _this.form.disposalRemark,
                    "disposalSituation":_this.form.disposalSituation,
                    "endTime": "",
                    "fileIdList": _this.fileIdList.slice(0),
                    "fileList": [
                        {}
                    ],
                    "groupid": "",
                    "iinfolink": _this.form.iinfolink,
                    "iname": _this.form.iname,
                    "infocontent": _this.form.infocontent,
                    "infoid": _this.$route.query.id,
                    "istate": val,
                    "remark": _this.form.remark,
                    "reportdate": "",
                    "reportunit": "",
                    "reportunitname": "CERT上海舆情",
                    "reportuser": this.currentUserId,
                    "reportusername": "",
                    "resultdate": "",
                    "resulttxt": "",
                    "resultuser": "",
                    "resultusernmae": "",
                    "startTime": "",
                    "submissionList": [],
                    "submissionType": _this.form.submissionType
                };
              //签名验签是验收时候用的，暂时先注掉，以后再弄
              // addOrUpdateCluesSign(tdinfo).then(res=>{
              //    let signHeader = res.msg;
              //    updateClues(tdinfo,signHeader).then(res=>{
              //      _this.$router.push('/yqInforComponent/yqInfo_yqCertClues');
              //    })
              //  })
              let signHeader=undefined
              updateClues(tdinfo,signHeader).then(res=>{
                this.returnToList()
              })
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
                console.log(response);
                this.$message({showClose: false,message: '上传成功',duration:1500, type:'success'});
                this.fileIdList.push(response.data.id);
                console.log(this.fileIdList);
            },
            //文件移除部分
            handleRemove(file) {
                this.$refs.fileUpload.handleRemove(file);
                var index=-1;
                if(("response" in file)){
                    index = this.fileIdList.indexOf(file.response.data.id);
                    this.fileIdList.splice(index,1);
                }
                else{
                    index = this.fileIdList.indexOf(file.file_id);
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

            //文件下载
            downloadFile(file){
                // config.downloadFile('/filed/get',{p:file.FILEID},file.file_name);
              download(file.file_id,file.file_name);
            }
        },
        mounted(){
            let _this = this;
            this.editor = new E(this.$refs.editor);
            this.editor.customConfig.zIndex = 100;
            // 关闭粘贴样式的过滤
            this.editor.customConfig.pasteFilterStyle = false
            // 忽略粘贴内容中的图片
            this.editor.customConfig.pasteIgnoreImg = true
            this.editor.customConfig.menus = this.editorMenu
            this.editor.customConfig.pasteTextHandle = (content)=> {
              // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
              return _this.$pasteTextHandle(content);
            }

            this.editor.create();

            console.log(this.$route.query.operateType);
            if(this.$route.query.operateType === '0') { //新增
                this.editable = true;
                this.form = {submissionType:'约稿'};
            }else if(this.$route.query.operateType === '2'){//修改
                this.editable = true;
                this.query();
            }else{//查看
                this.query();
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
