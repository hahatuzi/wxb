<template>
    <div id="yqReceive">
      <div class="search-wrap">
        <el-form  :model="searchForm"  :inline="true " size="small" style="width: 100%">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" clearable></el-input>
          </el-form-item>
          <el-form-item label="通知日期">
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
          <el-form-item label="类型" >
            <el-select v-model="searchForm.type" >
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
          v-loading="loading"
          :data="yqReceiveList"
          :header-cell-style="{background:'#C0D7F7',color:'#333333',fontSize:'18px',fontFamily:'STHeitiSC-Medium',fontWeight:'bold'}"
          :cell-style="{fontSize:'16px'}"
          :row-style="{background: 'transparent'}"
          border
          style="width: 100%">
          <el-table-column
            prop="itype"
            label="类型"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="iname"
            label="标题"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.statecode == 1" style="color: red">【新】</span>
              {{scope.row.iname}}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderdate"
            label="通报时间"
            width="180"
            align="center">

          </el-table-column>

          <el-table-column
            prop="require"
            label="要求"
            width="200"
            align="center">
            <template slot-scope="scope">
              <div v-if="new Date().getTime() - scope.row.orderdateTime <=  1000*60*60*24*3">
                <span v-if="scope.row.require == 1" class="show">{{requireList[0].label}}</span>
                <span v-if="scope.row.require == 2" class="show">{{requireList[1].label}}</span>
                <span v-if="scope.row.require == 3" class="show">{{requireList[2].label}}</span>
                <span v-if="scope.row.require == 4" class="show">{{scope.row.requirerk}}</span>
              </div>
              <div v-else> ---- </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="state"
            label="反馈状态"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <img src="@/assets/yqInfo/fankui.png" class="function-button"  @click="feedback(scope.row)">
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

    import { parseTime } from '@/utils/ruoyi'
    import { downloadFile } from '@/utils/exportFile'
    import { requireList } from '@/utils/config'

    import { getList } from "@/api/yqReceive";
    import { queryConfigManage } from '@/api/config'
    import { calStartNum, calEndNum } from '@/utils/pagination'

    export default {
        name: "yqReceiveComponent",
        data(){
          return {
            requireList:requireList,
            searchForm:{
                type:''
            },
            queryParams:{},
            typeList:[
              {conid:'',conname:'全部',convalue:''}
            ],
            yqReceiveList:[],
            pagination: {
              currentPage:1,
              pageSize:10,
              total:0,
            },
            loading:true,
            startNum:0,
            endNum:0
          }
        },
        methods:{
          feedback(row){
            this.$router.push({
              path: '/instructionFlow/feedback',
              query: {
                receiveid: row.receiveid,
                informid: row.informid
              }
            })
          },
            handleCurrentChange(val){
                this.pagination.currentPage = val;
                this.query();
              this.startNum = calStartNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)
              this.endNum = calEndNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)

              // this.startNum = this.yqReceiveList.length > 0? ((this.pagination.currentPage -1)* this.pagination.pageSize +1):0;
              //   this.endNum = this.yqReceiveList.length > 0 ?(this.startNum + this.yqReceiveList.length -1):0;
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.query();
                this.startNum = calStartNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)
                this.endNum = calEndNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)
                // this.startNum = this.yqReceiveList.length > 0? ((this.pagination.currentPage -1)* this.pagination.pageSize +1):0;
                // this.endNum = this.yqReceiveList.length > 0 ?(this.startNum + this.yqReceiveList.length -1):0;
            },
            sousuo(){
                this.pagination.currentPage = 1;
                this.query();
            },
            query(){
              this.queryParams = {
                startTime: this.searchForm.startTime,
                endTime: this.searchForm.endTime,
                title: this.searchForm.title,
                type: this.searchForm.type,
                userUid: "1"
              };

              getList(this.queryParams).then(result => {
                this.yqReceiveList = result.rows;
                // _this.yqReceiveList.forEach(item=>{
                //   item.orderdate=parseTime(new Date(item.orderdate),'{y}-{m}-{d} {h}:{i}:{s}');
                // });
                this.pagination.total = result.total;
                this.startNum = calStartNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)
                this.endNum = calEndNum(this.yqReceiveList.length, this.pagination.currentPage, this.pagination.pageSize)


                // this.startNum = this.yqReceiveList.length > 0? ((this.pagination.currentPage -1)* this.pagination.pageSize +1):0;
                // this.endNum = this.yqReceiveList.length > 0 ?(this.startNum + this.yqReceiveList.length -1):0;
              }).finally(() => {
                this.loading = false;
              })
            },
          queryConfig(){
            queryConfigManage({ keyword:'通报类型' }).then(result => {
              this.typeList = this.typeList.concat(result.rows[0].childrenList);
            })
          },
          exportData(){
            var fileName = parseTime(new Date(),'{y}{m}{d}{h}{i}{s}')
            let downloadParam = {
              url: '/system/yqgz/inform/accept/exportSentimentReceiveList',
              params: this.queryParams,
              fileName: fileName
            };
            downloadFile(downloadParam);
          }
        },
        mounted() {
            this.queryConfig();
            this.query();
        }
    }
</script>

<style lang="scss">

  #yqReceive{

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
