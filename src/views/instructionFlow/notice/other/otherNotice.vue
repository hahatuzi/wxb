<template>
  <div id="otherNotice">
    <div class="search-wrap">
      <el-form  :model="searchForm"  :inline="true " size="small"   class="demo-form-inline"  style="width: 100%">
        <el-form-item label="关键词">
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
        <el-form-item label="反馈状态">
          <el-select v-model="searchForm.feedbackState">
            <el-option  v-for="item in feedbackList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.nType">
            <el-option  v-for="item in typeList"
                        :key="item.conid"
                        :label="item.conname"
                        :value="item.convalue"></el-option>
          </el-select>
        </el-form-item>
        <img src="@/assets/common/sousuo.png" class="function-button" @click="sousuo">
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
          border
          style="width: 100%">
          <el-table-column
            prop="title"
            label="标题"
            align="center"
            width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveState == 0" style="color: red">【新】</span>
              {{scope.row.title}}
            </template>
          </el-table-column>
          <el-table-column
            prop="ntype"
            label="类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="通知时间"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="impLevel"
            label="重要程度"
            align="center">
          </el-table-column>
          <el-table-column
            prop="feedbackEnd"
            label="反馈截止时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.isFeedback == 1">
                {{scope.row.feedbackEnd}}
              </span>
              <span v-else>——</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stateStr"
            label="反馈状态"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <template v-if="scope.row.isFeedback == 0">
                <img src="@/assets/common/chakan2.png"  class="function-button" @click="info(scope.row)">
              </template>
              <template v-else>
                <template v-if="scope.row.feedbackState == 0">
                  <template v-if="scope.row.feedbackEnd != null && new Date() <= new Date(scope.row.feedbackEnd)">
                    <img src="@/assets/yqInfo/fankui.png"  class="function-button" @click="feedbackNotice(scope.row)">
                  </template>
                  <template v-else-if="scope.row.feedbackEnd != null && new Date() > new Date(scope.row.feedbackEnd)">
                    <img src="@/assets/common/chakan2.png"  class="function-button" @click="info(scope.row)">
                  </template>
                </template>
                <template v-else>
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

  import { getList, exportList } from '@/api/notice/other/index'
  import { queryConfigManage } from '@/api/config/index'


  export default {
    name: "otherNotice",
    data(){
      return {
        searchForm:{
          keyword:'',
          feedbackState:'',
          nType:'',
        },
        queryParams:{},
        feedbackList:[
          {id:'',label:'全部',value:''},
          {id:0,label:'已反馈',value:'3'},
          {id:1,label:'未反馈',value:'2'},
          {id:2,label:'未接收',value:'1'}
        ],
        typeList:[
          {conid:'',convalue:'',conname:'全部'}
        ],
        noticeList:[],

        pagination: {
          currentPage: 1,
          pageSize:10,
          total:0,
        },
        loading:true,
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
    mounted(){
      this.queryConfig();
      this.sousuo();
    },
    methods:{
      info(row){
        //operateType:1查看
        this.$router.push({
          path: `/instructionFlow/notice/otherInfo`,
          query: {
            operateType: 1,
            informUid: row.informUid,
            feedbackUid: row.feedbackUid
          }
        });
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.query();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.query();
      },
      sousuo(){
        this.currentPage = 1;
        this.queryParams = JSON.parse(JSON.stringify(this.searchForm));
        this.query();
      },
      //查列表
      query(){
        let params = {
          ...this.queryParams,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage
        }

        getList(params).then(res=>{
          this.loading = false;
          this.noticeList = res.rows;
          this.pagination.total = res.total;
        }).finally(() => {
          this.loading = false;
        })
      },
      //查配置
      queryConfig(){
        queryConfigManage({modid:7,keyword:'通知类型'}).then(res=>{
          this.typeList = this.typeList.concat(res.rows[0].childrenList);
        })
      },
      exportData(){
        exportList(this.queryParams);
      },
      feedbackNotice(row){
        //operateType:0反馈
        this.$router.push({
          path: `/instructionFlow/notice/otherInfo`,
          query: {
            operateType: 0,
            informUid: row.informUid,
            feedbackUid: row.feedbackUid
          }
        });
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
