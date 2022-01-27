<template>
  <div id="meetingNotice">
    <div class="search-wrap">
      <el-form  :model="searchForm"  :inline="true " size="small"  style="width: 100%">
        <el-row>
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="searchForm.keyword" clearable></el-input>
          </el-form-item>
          <el-form-item label="通知日期">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            至
            <el-date-picker
              v-model="searchForm.endTime"
              type="date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="反馈状态" prop="feedbackState">
            <el-select v-model="searchForm.feedbackState" >
              <el-option  v-for="item in feedbackList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <img src="@/assets/common/sousuo.png" class="function-button" @click="sousuo">
        </el-row>
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
          header-cell-class-name="headerCellClass"
          cell-class-name="tableCellClass"
          :row-style="{background: 'transparent'}"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%">

          <el-table-column
            prop="meetingName"
            label="会议名称"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveState == 0" style="color: red">【新】</span>
              {{scope.row.meetingName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="会议说明"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="通知时间"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="feedbackEnd"
            label="反馈截止时间"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="stateStr"
            label="反馈状态"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <template v-if="scope.row.feedbackState == 1">
                <img src="@/assets/common/chakan2.png"  class="function-button" @click="info(scope.row)">
              </template>

              <template v-else>
                <template v-if="scope.row.feedbackEnd != null && new Date() <= new Date(scope.row.feedbackEnd)">
                  <img src="@/assets/yqInfo/fankui.png"  class="function-button" @click="feedback(scope.row)">
                </template>
                <template v-else-if="scope.row.feedbackEnd != null && new Date() > new Date(scope.row.feedbackEnd)">
                  <img src="@/assets/common/chakan2.png"  class="function-button" @click="info(scope.row)">
                </template>
              </template>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="box-sizing: border-box;padding:10px 0">
        <el-row type="flex" justify="space-between">
          <div>
            <span>显示第{{pagination.total>0?startNum:0}}到第{{endNum}}条记录，总共{{pagination.total}}条记录</span>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pagination.pageSize"
              layout="sizes, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { getList, exportList } from '@/api/notice/meeting/index'

  export default {
    name: "meetingNotice",
    data(){
      return {
        searchForm:{
          feedbackState:''
        },
        queryParams:{},
        feedbackList:[
          {label:'全部',value:''},
          {label:'未接收',value:0},
          {label:'未反馈',value:1},
          {label:'已反馈',value:2}
        ],
        noticeList:[],
        pagination: {
          currentPage: 1,
          pageSize:10,
          total:0,
        },
        loading:true
      }
    },
    computed: {
      startNum() {
        return this.$calStartNum(this.noticeList.length, this.pagination.currentPage, this.pagination.pageSize)
      },
      endNum() {
        return this.$calEndNum(this.noticeList.length, this.pagination.currentPage, this.pagination.pageSize)
      }
    },
    methods:{

      /*表格动态底纹*/
      tableRowClassName({row, rowIndex}){
        if (row.state === 0) {   //未接收
          return 'noreceive-row';
        } else if (row.state === 1 || row.state === 2) {   //未反馈
          return 'nofeedback-row';
        }
        return '';
      },


      handleCurrentChange(val){
        this.pagination.currentPage = val;
        this.query();
      },
      handleSizeChange(val){
        this.pagination.currentPage = 1;
        this.pagination.pageSize = val;
        this.query();
      },
      info(row){
        //1查看
        this.$router.push({
          path: `/instructionFlow/notice/meetingInfo`,
          query: {
            operateType: 1,
            meetingUid: row.meetingUid,
            feedbackUid: row.feedbackUid
          }
        });
      },
      feedback(row){
        //0反馈
        this.$router.push({
          path: `/instructionFlow/notice/meetingInfo`,
          query: {
            operateType: 0,
            meetingUid: row.meetingUid,
            feedbackUid: row.feedbackUid
          }
        });
      },
      sousuo(){
        this.currentPage = 1;
        this.queryParams = JSON.parse(JSON.stringify(this.searchForm));
        this.loading = true;
        this.query();
      },
      query(){
        let params = {
          ...this.queryParams,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage
        }
        getList(params).then(res=>{
          this.noticeList = res.rows;
          this.pagination.total = res.total;
        }).finally(() => {
          this.loading = false;
        })
      },
      exportData(){
        exportList(this.queryParams);
      }
    },
    mounted(){
      this.sousuo();
    }
  }
</script>

<style lang="scss">



  .el-table .noreceive-row {
    background: rgb(242,222,222) !important;
  }

  .el-table .nofeedback-row {
    background: rgb(250,242,204) !important;
  }


  /*#meetingNotice{*/

  /*  .search-wrap{*/
  /*    box-sizing: border-box;*/
  /*    padding:20px 20px 0;*/
  /*  }*/

  /*  .table-content{*/
  /*    box-sizing: border-box;*/
  /*    .btn-wrap{*/
  /*      padding: 5px 10px;*/
  /*      box-sizing: border-box;*/
  /*      width: 100%;*/
  /*      display: flex;*/
  /*      justify-content:flex-end;*/
  /*      background: #87A4CE;*/
  /*    }*/
  /*  }*/
  /*}*/
</style>
