<template>
  <div id="yqClues">
<!--    <div style="background-color: #87A4CE;color: #fff;height: 20px;padding:5px;display:flex;justify-content: flex-start">-->
<!--      <img src="@/assets/config/dangqianweizhi.png" style="height:16px;padding:0 5px;">-->
<!--      <span>当前位置：</span>-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right" >-->
<!--        <el-breadcrumb-item>舆情线索</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div >
      <div class="search-wrap">
        <el-form  :model="searchForm"  :inline="true " size="small"  style="width: 100%">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" clearable></el-input>
          </el-form-item>
          <el-form-item label="上报日期">
            <el-date-picker
              v-model="searchForm.startDate"
              type="date"
              :picker-options="pickerOptions1">
            </el-date-picker>
            至
            <el-date-picker
              v-model="searchForm.endDate"
              type="date"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="处置情况">
            <el-select v-model="searchForm.dispose">
              <el-option  v-for="item in disposeList"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采纳情况">
            <el-select v-model="searchForm.adopt">
              <el-option  v-for="item in adoptList"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报送类型">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="display: inline-block;margin-right:30px">全选</el-checkbox>
            <el-checkbox-group v-model="searchForm.bsType" @change="handleCheckedCitiesChange" style="display: inline-block">
              <el-checkbox v-for="type in types" :label="type" :key="type">{{type}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <img src="@/assets/common/sousuo.png" class="function-button" @click="sousuo">
        </el-form>
      </div>
      <div style="border: 1px solid #F9FCFF;box-shadow: 0 3px 4px 0 rgba(0,0,0,0.50);border-radius: 0 0 5px 5px;margin: 10px;height:100%">
        <div class="table-content">
        <div class="btn-wrap">
          <div style="display: flex;flex-direction: column;justify-content: center">
            <img src="@/assets/common/tianjia.png" class="exportButton" @click="addInfo">
          </div>
        </div>
        <el-table
          :data="yqCluesList"
          :header-cell-style="{background:'#C0D7F7',color:'#333333',fontSize:'18px',fontFamily:'STHeitiSC-Medium',fontWeight:'bold'}"
          :cell-style="{fontSize:'16px'}"
          :row-style="{background: 'transparent'}"
          border
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="iname"
            label="标题"
            align="center"
            width="300">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" style="font-size:16px;"  @click="info(scope.row)">{{scope.row.iname}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="submissionType"
            label="报送类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="disposalSituation"
            label="处置情况"
            align="center">
          </el-table-column>
          <el-table-column
            prop="istate"
            label="录用情况"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <span v-if="scope.row.istate=='1'">未查看</span>
              <span v-else-if="scope.row.istate=='2'">已查看</span>
              <span v-else-if="scope.row.istate=='3'">已采纳</span>
              <span v-else-if="scope.row.istate=='4'">已查看</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportdate"
            label="上报日期"
            width="200"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <span v-if="scope.row.istate=='0'">——</span>
              <span v-else>{{scope.row.reportdate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope" style="text-align: center">
              <template v-if="scope.row.istate=='0'">
                <img src="@/assets/common/bianji2.png" class="function-button"  @click="modify(scope.row)">
                <img src="@/assets/common/shanchu2.png" class="function-button"  @click="deleteInfo(scope.row)">
              </template>
              <img v-else src="@/assets/common/chakan2.png" class="function-button"  @click="info(scope.row)">
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
  </div>
</template>

<script>
  import { queryClueList, deleteClue } from '@/api/yqClues'
    const typeOptions =  ['舆情线索','情况通报','工作动态','分析研究','约稿','其他'];
    export default {
        name: "yqCluesComponent",
        data(){
          return {
            searchForm:{
              title:'',
              dateRange:'',
              dispose:'',
              adopt:'',
              bsType:typeOptions
            },
            disposeList:[
              {id:'',value:'',label:'全部'},
              {id:0,value:'未处置',label:'未处置'},
              {id:1,value:'已处置',label:'已处置'}
            ],
            adoptList:[
              {id:'',value:'',label:'全部'},
              {id:1,label:'未查看'},
              {id:2,label:'已查看'},
              {id:3,label:'已采纳'}
            ],
            checkAll: true,
            types:typeOptions,
            isIndeterminate: false,
            bsTypeList:[
                {label:'舆情线索',value:'舆情线索'},
                {label:'情况通报',value:'情况通报'},
                {label:'工作动态',value:'工作动态'},
                {label:'分析研究',value:'分析研究'},
                {label:'约稿',value:'约稿'},
                {label:'其他',value:'其他'}
            ],
            yqCluesList:[],
            // total:100,
            currentPage:1,
            pageSize:10,
            total:0,
            pickerOptions1:{
                disabledDate:(time)=>{
                    if(this.searchForm.endDate != ''){
                        return time.getTime() > new Date(this.searchForm.endDate).getTime()+ 8.64e6;
                    }
                }
            },
            pickerOptions2:{
                disabledDate:(time)=>{
                    if(this.searchForm.startDate != ''){
                        return time.getTime() <new Date(this.searchForm.startDate).getTime()- 8.64e6;
                    }
                }
            },
            loading:true,
            startNum:0,
            endNum:0
          }
        },
        methods:{
            handleCurrentChange(val){
                this.currentPage = val;
                this.query();
                this.startNum = this.yqCluesList.length > 0? ((this.currentPage -1)* this.pageSize +1):0;
                this.endNum = this.yqCluesList.length > 0 ?(this.startNum + this.yqCluesList.length -1):0;
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.query();
                this.startNum = this.yqCluesList.length > 0? ((this.currentPage -1)* this.pageSize +1):0;
                this.endNum = this.yqCluesList.length > 0 ?(this.startNum + this.yqCluesList.length -1):0;
              },
            handleCheckAllChange(val) {
                this.searchForm.bsType = val ? typeOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.types.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length;
            },
            info(row){
              //operateType:0新增，1查看,2修改
              this.$router.push({path:'/instructionFlow/yqClueInfo',query:{operateType:'1',id:row.infoid}});
            },
            addInfo(){
                this.$router.push({path:'/instructionFlow/yqClueInfo',query:{operateType:'0'}});
            },
            modify(row){
                this.$router.push({path:'/instructionFlow/yqClueInfo',query:{operateType:'2',id:row.infoid}});
            },
            sousuo(){
                this.currentPage = 1;
                this.query();
            },
            query(){
                var _this = this;
                var start = '';
                var end = '';
                if(_this.searchForm.startDate) {
                    start = new Date(_this.searchForm.startDate);
                    start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
                }
                if(_this.searchForm.endDate){
                    end = new Date(_this.searchForm.endDate);
                    end = end.getFullYear() + '-' + (end.getMonth()+1) + '-' + end.getDate();
                }
                var yqgzTdinfo = {
                    appointstype: "",
                    appointtype: "",
                    createtime: "",
                    disposalRemark: "",
                    disposalSituation: _this.searchForm.dispose,
                    endTime: end,
                    fileIdList: [],
                    fileList: [{}],
                    groupid: "",
                    iinfolink: "",
                    iname: _this.searchForm.title,
                    infocontent: "",
                    infoid: "",
                    istate: _this.searchForm.adopt,
                    remark: "",
                    reportdate: "",
                    reportunit: "",
                    reportunitname: "",
                    reportuser: "",
                    reportusername: "",
                    resultdate: "",
                    resulttxt: "",
                    resultuser: "",
                    resultusernmae: "",
                    startTime: start,
                    submissionList: _this.searchForm.bsType,
                    submissionType: ""
                };

                queryClueList(yqgzTdinfo, _this.currentPage, _this.pageSize).then(result => {
                  _this.loading = false;
                  _this.yqCluesList = result.rows;
                  _this.total = result.total;
                  _this.startNum = _this.yqCluesList.length > 0? ((_this.currentPage -1)* _this.pageSize +1):0;
                  _this.endNum = _this.yqCluesList.length > 0 ?(_this.startNum + _this.yqCluesList.length -1):0;
                })

            },
            deleteInfo(row){
                this.$confirm('确定要删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(row.infoid);
                }).catch(() => {
                });
            },
            handleDelete(id){
                deleteClue({infoid:id}).then(result =>{
                  this.query();
                })
            }
        },
        mounted() {
            this.query();
        }
    }
</script>

<style lang="scss">
  #yqClues{
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
