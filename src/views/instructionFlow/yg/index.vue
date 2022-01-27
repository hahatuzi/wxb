<template>
  <div id="otherNotice">
<!--    <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--      <img src="@/assets/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--      <span>当前位置：</span>-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--        <el-breadcrumb-item>约稿</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div class="search-wrap">
      <el-form  :model="searchForm"  :inline="true " size="small"   class="demo-form-inline"  style="width: 100%">
        <el-form-item label="约稿标题">
          <el-input v-model="searchForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="约稿时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          至
          <el-date-picker
            v-model="searchForm.endTime"
            type="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="上传状态">
          <el-select v-model="searchForm.FkState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="0" label="未上传"></el-option>
            <el-option :value="1" label="已上传"></el-option>

          </el-select>
        </el-form-item>
        <img src="@/assets/common/sousuo.png" class="function-button" @click="search">
      </el-form>
    </div>
    <div style="border: 1px solid #F9FCFF;box-shadow: 0 3px 4px 0 rgba(0,0,0,0.50);border-radius: 0 0 5px 5px;margin: 10px;height:100%">
      <div class="table-content">
        <div class="btn-wrap">
          <div style="display: flex;flex-direction: column;justify-content: center">
            <img src="@/assets/common/daochue.png" class="exportButton" @click="exportData">
          </div>
        </div>
        <el-table
          :data="noticeList"
          v-loading="loading"
          :header-cell-style="{background:'#C0D7F7',color:'#333333',fontSize:'18px',fontFamily:'STHeitiSC-Medium',fontWeight:'bold'}"
          :cell-style="{fontSize:'16px'}"
          :row-style="{background: 'transparent'}"
          border
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="title"
            label="约稿标题"
            align="center">
            <template slot-scope="scope">
              <span style="color:red" v-if="scope.row.jsState==0">[新]</span>
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>


          <el-table-column
            prop="informTime"
            label="通报时间"
            align="center"
            width="300">
            <template slot-scope="scope">
              {{scope.row.informTime|formatDate('feedback')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="STATE"
            label="上传状态"
            width="300"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <span v-if="scope.row.jsState==0">未接收</span>
              <span v-else-if="scope.row.fkState==0">未上传</span>
              <span v-else-if="scope.row.fkState==1">已上传</span>
              <span v-else>已接收</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <img v-if="scope.row.fkState==1" src="@/assets/common/chakan2.png"   class="function-button" @click="feedback(scope.row,1)">
              <img v-else src="@/assets/yqInfo/shangchuan.png"   style="width:53px" class="function-button" @click="feedback(scope.row,0)">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="box-sizing: border-box;padding:10px 0">
        <el-row type="flex" justify="space-between">
          <div>
            <span>显示第{{startNum}}到第{{endNum}}条记录，总共{{total}}条记录</span>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              layout="sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {getList} from '@/api/yg/index'
  import { queryConfigManage } from '@/api/config'

  import { parseTime } from '@/utils/ruoyi'
  import { downloadFile } from '@/utils/exportFile'

  export default {
    name: "otherNotice",
    // props:['reqPrefix','pathPrefix'],
    data(){
      return {
        reqPrefix:'yqgz',
        pathPrefix:'/yqInforComponent/yqInfo',
        searchForm:{
          title:'',
          startTime:'',
          endTime:'',
          FkState:''
        },
        queryParams:{},
        feedbackList:[
          {id:'',label:'全部',value:''},
          {id:0,label:'已上传',value:'3'},
          {id:1,label:'未上传',value:'2'},
          {id:2,label:'未接收',value:'0'}
        ],
        typeList:[
          {conid:'',convalue:'',conname:'全部'}
        ],
        noticeList:[],
        currentPage:1,
        pageSize:10,
        total:0,
        loading:true,
        startNum:0,
        endNum:0
      }
    },
    methods:{
      handleCurrentChange(val){
        this.currentPage = val;
        this.searchList();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.searchList();
      },

      search(){
        this.queryParams = JSON.parse(JSON.stringify(this.searchForm));
        this.currentPage = 1;
        this.searchList();
      },

      searchList(){
        this.queryParams.pageSize = this.pageSize;
        this.queryParams.pageNum = this.currentPage;
        getList(this.queryParams).then(res=>{
          this.noticeList = res.rows;
          this.total = res.total;
          this.loading = false;
          this.startNum = this.noticeList.length > 0? ((this.currentPage -1)* this.pageSize +1):0;
          this.endNum = this.noticeList.length > 0 ?(this.startNum + this.noticeList.length -1):0;
        })
      },

      //查配置
      queryConfig(){
        var _this = this;

        queryConfigManage(this.reqPrefix, {
          keyword:'通知类型'
        }).then(result => {
          if(result.code == 200) {
            _this.typeList = _this.typeList.concat(result.rows[0].childrenList);
          }
        });
      },
      exportData(){
        var fileName = parseTime(new Date(),'{y}{m}{d}{h}{i}{s}')

        let downloadParam = {
          url: `/system/${this.reqPrefix}/notice/inform/exportbs`,
          params: this.queryParams,
          fileName: fileName
        }
        downloadFile(downloadParam);
      },
      feedback(row,operateType){
        //operateType:0上传
        this.$router.push({
          path: `/instructionFlow/ygFeedback`,
          query: {
            id: row.recId,
            operateType: operateType
          }
        });
      }
    },
    mounted(){
      this.queryConfig();
      this.search();
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
        else if(type === 'feedback'){
          return parseTime(date,'{y}-{m}-{d} {h}')+':00:00';
        }
        else{
          return ''
        }
      }
    }
  }
</script>

<style lang="scss">
  #otherNotice{
    /*height: 100%;*/
    .search-wrap{
      box-sizing: border-box;
      padding:20px 20px 0;
    }

    .table-content{
      /*padding: 5px 10px;*/
      box-sizing: border-box;
      .btn-wrap{
        padding: 5px 10px;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content:flex-end;
        background: #87A4CE;
      }
    }
  }
</style>
