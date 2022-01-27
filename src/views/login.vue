<template>
  <div id="main">
    <div id="loginContainer">
      <el-row type="flex" style="padding-top: 10px;box-sizing: border-box" justify="center">
        <img src="@/assets/images/mingcheng.png" style="height:80px">
        <img src="@/assets/common/xxbaosong.png" style="width:24px;height:28px;line-height: 40px;margin-top:10px;">

      </el-row>
      <el-row type="flex" justify="center">
        <el-form :model="loginForm" id="loginForm" label-width="100px">
          <el-form-item label="用户名：" >
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码：" >
            <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" show-password size="small"></el-input>
          </el-form-item>

          <template v-if="true">
            <el-form-item label="验证码：" >
              <div style="position:relative">
                <el-input prefix-icon="el-icon-mobile-phone" v-model="loginForm.code" size="small"></el-input>
                <span v-if="second==0" type="primary" style="position: absolute;right: 10px;top: 2px; cursor: pointer;" @click="getVerificationCode" id="getVerificationCode" :underline="false" >获取验证码</span>
                <span v-else="second==0" type="primary" style="position: absolute;right: 10px;top: 2px; cursor: pointer;"  :underline="false" >{{second}}秒后重新获取</span>
              </div>
            </el-form-item>
            <el-form-item label='发送方式：'>
              <el-radio-group v-model="loginForm.operation" >
                <el-radio :label="1" style="padding-right: 40px;">邮件</el-radio>
                <el-radio :label="2" >手机</el-radio>
              </el-radio-group>
              <!--            <el-row>-->
              <!--              <span style="color:#A6A5A5;margin-bottom:10px">非上海手机号码用户请填写邮件中获取的验证码</span>-->
              <!--            </el-row>-->
            </el-form-item>
          </template>


          <el-form-item>
            <el-button type="primary" @click="login" size="small">登录</el-button>
          </el-form-item>
          <el-row type="flex" justify="end">
            <span style="color:#f0f0f0;cursor: pointer" @click="dialogFormVisible = true">忘记密码</span>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <div id="beian">
      <a href="http://www.beian.miit.gov.cn/"  target="_blank" style="color:gray">备案/许可证编号为：沪ICP备19026927号-1</a>
    </div>


    <el-dialog title="重置密码" :visible.sync="dialogFormVisible" width="30%" >
        <el-form :model="resetForm" label-width="100px" :rules="rules" ref="resetForm">
          <el-form-item label="用户名" prop="userName" >
            <el-input v-model="resetForm.userName" size="small"></el-input>
          </el-form-item>
          <el-form-item label='验证方式' prop="type">
            <el-radio-group v-model="resetForm.type" >
              <el-radio :label="'2'" style="padding-right: 40px;">邮件</el-radio>
              <el-radio :label="'1'" >手机</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div style="position:relative">
              <el-input prefix-icon="el-icon-mobile-phone" v-model="resetForm.code" size="small"></el-input>
              <span v-if="second==0" type="primary" style="position: absolute;right: 10px;top: 2px; cursor: pointer;" @click="forgetPwd" :underline="false">获取验证码</span>
              <span v-else="second==0" type="primary" style="position: absolute;right: 10px;top: 2px; cursor: pointer;"  :underline="false" >{{second}}秒后重新获取</span>
            </div>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="resetForm.newPassword" size="small"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <img src="@/assets/common/queding.png" class="function-button" style="margin-right:10px;" @click="resetPwd">
          <img src="@/assets/common/quxiao3.png" class="function-button" @click="dialogFormVisible = false">
        </el-row>

      </el-dialog>

  </div>
</template>

<script>
    import axios from 'axios'
    // import 'babel-polyfill'
    // import permission from "../vuex/permission";
    // import watermark from "../vuex/watermark";
    import {getRouter,login,loginssl,getVerificationCode,getUserInfo} from '@/api/user/user'
    import {setToken,removeToken} from '@/utils/auth'

    export default {
        name: "Login",
        data(){
            return {
                loginForm:{
                    username:'',
                    password:'',
                      // code:'',
                      // uuid:'',
                    operation:2,
                    type:1
                },
                handMode:'1',
                second:0,
                timeInterval:{},
                showCode:false,
                resetForm:{
                  userName:'',
                  type:'2',
                  newPassword:'',
                  uuid:'',
                  code:''
                },
                dialogFormVisible:false,
                rules: {
                  newPassword: [
                    {required: true, message: "新密码不能为空", trigger: "blur"},
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                      message: "至少8-16个字符，至少1个大写字母，1个小写字母和1个数字",
                      trigger: "blur"
                    }
                  ]
                }
            }
        },
        created(){
          /*
          loginssl().then(res =>{
            if(res.data.hasOwnProperty("access_token")){
              const Authorization = res.data.access_token;
              localStorage.setItem('Authorization',Authorization);
              localStorage.setItem('userName',this.loginForm.username);
              setToken(Authorization);
              // this.$router.push("/moduleSelect");
              this.queryUser();
              this.getRouters();
            }
          })
           */
        },
        methods:{
            login(){
                if(!this.loginForm.username || !this.loginForm.password){
                    this.$message.error('用户名或密码为空');
                }else{

                  this.$store.dispatch('user/login',this.loginForm).then(res => {
                    this.$router.push('/')
                  })

                  //   //登录验证
                  // login(this.loginForm).then(res=>{
                  //
                  //   if('没在本电脑登陆过' == res.msg ){
                  //     this.showCode = true;
                  //     this.$message({showClose: false,message: res.msg,duration:1500, type:'error'});
                  //     return;
                  //   }
                  //   const Authorization = res.data.access_token;
                  //   console.log("Authorization:"+Authorization);
                  //   localStorage.setItem('userName',this.loginForm.username);
                  //   setToken(Authorization);
                  //   this.queryUser();
                  //   this.getRouters();
                  // })
                }
            },
            getVerificationCode(){
                var _this = this;
                _this.second = 60;
                _this.setTime();

                let form = {
                  username:this.loginForm.username,
                  password:this.loginForm.password,
                  oper:this.loginForm.operation,
                  type:1
                }
              getVerificationCode(form).then(res=>{
                this.loginForm.uuid = res.msg;
              })

            },
          setTime(){
            var _this = this;
            this.timeInterval = setInterval(()=>{
              _this.second--;
              if(_this.second<=0){
                clearInterval(_this.timeInterval);
              }
            },1000);
          },
          //用户信息
          queryUser(){
              var _this = this;

            getUserInfo().then(res=>{
              console.log(res.data)
              localStorage.setItem("nickName",res.data.nickName);
              localStorage.setItem("unitName",res.data.unit.unitname);
              localStorage.setItem("phonenumber",res.data.phonenumber);
            })
          },
          getRouters(){
              var _this = this;
              // getRouter().then(res=>{
              //     permission.setRouter(res.data);
              //     permission.setMenu(JSON.parse(JSON.stringify(res.data)));
              //     var a = setInterval(function () {
              //       if(permission.getRouter() != null){
              //         clearInterval(a);
              //         _this.$router.push('/moduleSelect');
              //       }
              //     },1000);
              // });

          },
          forgetPwd(){
            var _this = this;
            if(!this.resetForm.userName){
              this.$message.error('用户名不能为空!');
            }else{
              _this.axios({
                url:'/retpwdcode',
                method:'get',
                params:{
                  userName:this.resetForm.userName,
                  type:this.resetForm.type
                }
              }).then(result => {
                _this.resetForm.uuid = result.data.uuid;
              })
            }
          },
          resetPwd(){
            this.$refs['resetForm'].validate((valid) => {
              if (valid) {
                this.doResetPwd();
              } else {
                // console.log('error submit!!');
                return false;
              }
            });
          },
          doResetPwd(){
              var _this = this;
              _this.axios({
                url:'/system/user/profile/ResetPwd',
                method:'put',
                params:JSON.parse(JSON.stringify(_this.resetForm))
              }).then(result => {
                if(result.data.code == 200){
                  this.$message.success('重置密码成功!');
                  this.dialogFormVisible = false;
                }

              })

          }
        },
        mounted() {
          // permission.logOut();
          // watermark.clear();

        }
    }
</script>

<style lang="scss">

  #main{
    background-image: url("/static/images/ditu.png");
    background-size: 100% 100%;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    #loginContainer{
      width: 37.3vw;
      /*height: 50vh;*/
      margin: 0 auto;
      border: 0.5px solid rgba(163,203,247,0.9);
      background-color: rgba(52,87,160,0.75);
      opacity: 0.8;
      border-radius: 7px;

      .el-radio__label{
        color: white;
      }
      #loginForm{
        width: 30vw;
        margin-bottom: 30px;

        .el-form-item__label{
          color: #ffffff;
          text-align: justify
        }


        .el-button--primary{
          width: 100%;
        }

        #getVerificationCode{
          position: relative;
          z-index:100;
          line-height: 40px;
          top:-40px;
          right:10px;
          display: flex;
          justify-content: flex-end;
        }
      }

    }

    #beian{
      color:gray;
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom:20px;
    }
  }
</style>



