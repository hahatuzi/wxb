<template>
  <div>
    <div class="search-wrap">
      <el-form  :model="searchForm"  :inline="true " size="small"   class="demo-form-inline"  style="width: 100%">
        <el-row >
          <el-form-item label="关键字" prop="keywords">
            <el-input v-model="searchForm.keywords" clearable></el-input>
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker
              v-model="searchForm.startDate"
              type="date">
            </el-date-picker>
            至
            <el-date-picker
              v-model="searchForm.endDate"
              type="date">
            </el-date-picker>
          </el-form-item>
          <img src="@/assets/common/sousuo.png" class="function-button" @click="sousuo">
        </el-row>
      </el-form>
    </div>
    <div style="border: 1px solid #F9FCFF;box-shadow: 0 3px 4px 0 rgba(0,0,0,0.50);border-radius: 0 0 5px 5px;margin: 10px;height:100%">
      <div style="width: 100%;box-sizing: border-box">
        <el-table :data="noticeList"
                  v-loading="loading"
                  border
                  style="width: 100%"
                  :header-cell-style="{background:'#C0D7F7',color:'#333333',fontSize:'18px',fontFamily:'STHeitiSC-Medium',fontWeight:'bold'}"
                  :cell-style="{fontSize:'16px'}"
                  :row-style="{background: 'transparent'}"
                  @row-click="selectRow"
                  :highlight-current-row="true">
          <el-table-column
            prop="degree"
            label="程度"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.ntop== 1" style="color: red">「置顶」</span>
              <span v-if="scope.row.nlevel== 1" style="color: #64b4ff">「重要」</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="NNAME"
            label="名称"
            align="center"
            width="600">
            <template slot-scope="scope">
              {{scope.row.nname}}
              <span v-if="scope.row.state == 0" style="color: white;background-color: red;border-radius: 2px;">新</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="PDATE"
            label="时间"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.PDATE}}
            </template>
          </el-table-column>
          <el-table-column
            prop="ntype"
            label="类型"
            align="center"
          >
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
    import {getList} from '@/api/bulletin/index'
    export default {
      name: "bulletinBoard",
      data(){
        return {
          searchForm:{},
          queryParams:{},
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
        sousuo(){
          this.currentPage = 1;
          this.queryParams = JSON.parse(JSON.stringify(this.searchForm));
          this.query();
        },
        query(){
          var _this = this;
          var start = '';
          var end = '';
          if(_this.queryParams.startDate) {
            start = new Date(_this.queryParams.startDate);
            start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
          }
          if(_this.queryParams.endDate){
            end = new Date(_this.queryParams.endDate);
            end = end.getFullYear() + '-' + (end.getMonth()+1) + '-' + end.getDate();
          }


          let params = {
            keyword:_this.queryParams.keywords,
            start:start,
            end:end,
            type:'',
            pageSize:this.pageSize,
            pageNum:this.currentPage
          }


          getList(this.reqPrefix,params).then(res=>{
            _this.loading = false;
            _this.noticeList = res.rows;
            _this.total = res.total;
            _this.startNum = _this.noticeList.length > 0 ? ((_this.currentPage - 1) * _this.pageSize + 1) : 0;
            _this.endNum = _this.noticeList.length > 0 ? (_this.startNum + _this.noticeList.length - 1) : 0;
          })
        },
        selectRow(row){
          this.$router.push({path:`/instructionFlow/viewBulletin`,query:{noticeId:row.id}});

        },
        handleCurrentChange(val){
          this.currentPage = val;
          this.query();
          this.startNum = this.noticeList.length > 0? ((this.currentPage -1)* this.pageSize +1):0;
          this.endNum = this.noticeList.length > 0 ?(this.startNum + this.noticeList.length -1):0;
        },
        handleSizeChange(val){
          this.pageSize = val;
          this.query();
          this.startNum = this.noticeList.length > 0? ((this.currentPage -1)* this.pageSize +1):0;
          this.endNum = this.noticeList.length > 0 ?(this.startNum + this.noticeList.length -1):0;
        },

      },
      mounted() {
        this.query();
      }

    }
</script>

<style lang="scss">
  .search-wrap{
    box-sizing: border-box;
    padding: 20px 20px 0;
  }
</style>
