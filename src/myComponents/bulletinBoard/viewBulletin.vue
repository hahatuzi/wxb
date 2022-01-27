<template>
  <div>
<!--    <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--      <img src="@/assets/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--      <span>当前位置：</span>-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--        <el-breadcrumb-item>公告栏</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>查看</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <div style="box-sizing: border-box;padding:20px;">
      <el-row type="flex" justify="center">
        <p style="font-family: STHeitiSC-Medium;font-size: 24px;color: #02214D;letter-spacing: -0.73px;text-align: center;margin:10px 0;">
          {{noticeObj.nname}}
        </p>
      </el-row>
      <div style="background: #F9FCFF;box-shadow: 0 2px 4px 2px rgba(0,0,0,0.50);border-radius: 3px;width:70vw;margin:0 auto;padding:10px;">
        <el-row  type="flex" justify="center">
          <div style="width: 94%;">
            <el-row type="flex" justify="center" style="font-family: STHeitiSC-Medium;font-size: 16px;color: #666666;letter-spacing: 0;margin-top:10px">
              <span>时间：</span>{{noticeObj.pdate}}
              <span style="margin-left:2em">类型：</span>{{noticeObj.ntype}}
              <span style="margin-left:2em">重要程度：</span>
              <span v-if="noticeObj.nlevel == 1" style="color: orange">重要</span>
            </el-row>
            <el-divider></el-divider>
            <el-row style="font-family: STHeitiSC-Medium;font-size: 16px;color: #333333;letter-spacing: 0.61px;" >
              <el-form>
                <el-form-item>
                  <span v-html="noticeObj.ntext"></span>
                </el-form-item>
                <el-form-item label="相关附件">
                  <div style="display: inline-block">
                    <el-row class="file-list">
                      <el-col class="fileItem" v-for="file in fileList" :key="file.file_id">
                        <div class="fileItem-hover" @click="downloadFile(file)">
                          下载
                        </div>
                        <img src="@/assets/common/fujianbg.png" />
                        <span class="label">{{file.file_name}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-form>
            </el-row>
            <el-divider></el-divider>
            <el-row type="flex" justify="center">
              <img src="@/assets/common/fanhui.png" class="function-button" @click="$router.back()">
            </el-row>
          </div>
        </el-row>
      </div>


    </div>
  </div>
</template>

<script>
  import {select} from '@/api/bulletin/index'
  import {download} from '@/api/file/index'
    export default {
        name: "viewBulletin",
        props:['pathPrefix','reqPrefix'],
        data(){
            return {
                noticeObj:{},
                fileList:[]
            }
        },
        mounted() {
            this.query();
        },
        methods:{

            query(){
                var _this = this;
              select(this.reqPrefix,this.$route.query.noticeId).then(res=>{
                _this.noticeObj = res.data.notice;
                _this.fileList = res.data.file;
                this.$root.$children[0].$children[0].queryUnreadCounts();
              })

            },
            //文件下载
            downloadFile(file){
                download(file.file_id,file.file_name);
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
