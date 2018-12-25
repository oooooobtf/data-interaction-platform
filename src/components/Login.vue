<template>
  <div class="login">
    <img src="../assets/login-com.png" class="computer-logo">
    <div class="login-area vertical-center">
      <p class="img"><span><img src="../assets/login-icon.png"/></span></p>
      <p class="img"><img src="../assets/login-name.png"/></p>
      <div class="login-form">
        <p>
          <i class="icon glyphicon glyphicon-user"></i>
          <input type="text" placeholder="请输入用户名" @keyup="verifyUserName()" @keyup.13="login()" v-model="userName"/>
          <span class="error-hint" v-show="userNameverify">{{userNameErrorHint}}</span>
        </p>
        <p>
          <i class="icon wb-lock"></i>
          <input type="password" @keyup.13="login()" @keyup="verifyPassword()" placeholder="请输入密码" v-model="password"/>
          <span class="error-hint" v-show="passwordverify">{{passwordErrorHint}}</span>
        </p>
        <div class="remember-pass clearfix">
          <span class="fl">忘记密码？请联系管理员</span>
          <span class="fr">
            <input type="checkbox"  autocomplete="off" oncopy="return false" oncut="return false"  onpaste="return false" oncontextmenu="return false"  id="rememberPass" v-model="isRememberPass"/>
            <label for="rememberPass" @click="remenber()"></label>
            <span>记住密码</span>
          </span>
        </div>
        <div class="login-btn">
          <button @click="login()">登录<i class="icon md-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import g from './common.vue'

  export default {
    name: 'Login',
    data() {
      return {
        userName:'',
        userNameverify:false,
        userNameErrorHint:'用户名不能为空',
        password:'',
        passwordverify:false,
        passwordErrorHint:'密码不能为空',
        isRememberPass:false
      }
    },
    methods:{
      verifyUserName(){
        this.userNameverify = false;
      },
      verifyPassword(){
        this.passwordverify = false;
      },
      login(){
        let self = this;
        if(self.userName == ''){
          self.userNameverify = true;
        }else if(self.password == ''){
          self.passwordverify = true;
        }else{
          Login(self);
        }
      },
      remenber:function () {
        console.log("记住")
        this.isRememberPass=true;
      }
    },
    mounted(){
    },
  }

  /*
  * 登录
  * */
  function Login(self) {
   var data = {
     password:self.password,
     userName:self.userName
   }
    $.ajax({
      url:g.url+'/user/doLogin',
      type:'post',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      data:JSON.stringify(data),
      success:function (result) {
        if(Number(result.status) == 200){
          if(self.isRememberPass){
            console.log("true")
            //如果选择了记住密码，就保存到localStorage里面
            window.localStorage.setItem('userName',self.userName);
            window.localStorage.setItem('pwd',self.password);
          }else{
            //反之清除
            window.localStorage.clear();
          }
//          self.$router.push({path: "/menu",params:{username:self.userName}});

          sessionStorage.setItem('username',self.userName);
          sessionStorage.setItem('token',result.data.token);
          self.$router.push({path: "/menu"});
        }else{
          self.$message({
            type:"error",
            message:"用户名或密码错误！"
          })
        }
      }
    })
  }




</script>

<style scoped>
  span.error-hint{
    color: #ff4f59;
    display: block;
    height: 11px;
    font-size: 12px;
    /*margin-top: 10px;*/
  }

  div.login {
    background: url(../assets/bg.jpg) no-repeat 50% 0 !important;
    background-size: cover;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }

  img.computer-logo {
    position: absolute;
    bottom: 0;
    left: 0;

  }

  div.login-area p.img {
    text-align: center;
  }

  div.login p.img>span{
    display: inline-block;
    width: 93px;
    height: 93px;
    border: solid 3px #492b75;
    border-radius: 50%;
    line-height: 133px;
  }

  div.login p.img>span img{
    margin-left: 6px;
  }


  div.login-form p{
    position: relative;
    margin-bottom: 26px;
  }

  div.login-form p i{
    position: absolute;
    width: 14px;
    height: 14px;
    color: #fff;
    top:10px;
    left: 10px;
  }


  div.login-form p input {
    /*width: 273px;*/
    height: 35px;
    width: 228px;
    background-color: #363e48;
    border-radius: 3px;
    border: none;
    outline: none;
    padding: 0 10px 0 35px;
    color: #fff;
  }
  input[type='checkbox'] {
    visibility:hidden;
    position:absolute;
  }

  label {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: solid 1px #ffffff;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin-right: 4px;
  }


  #rememberPass:checked+label:after {
    content: '\2714';
    position: absolute;
    top: -4px;
    left: 0px;
    color: #fff;
    width: 100%;
    text-align: center;
    font-size: 14px;
    vertical-align: text-top;
  }

  .remember-pass>span:first-child{
    font-size: 13px;
    line-height: 22px;
    color: #718bac;
  }

  .remember-pass>span:last-child{
    color: #fff;
    font-size: 13px;
  }

  .remember-pass>span:last-child span{
    vertical-align: middle;
  }

  .login-form{
    margin-top: 71px;
  }

  .login-btn{
    text-align: right;
    margin-top: 45px;
  }

  .login-btn i{
    position:absolute;
    color: #fff;
    right: 10px;
    top:9px;
    width: 13px;
    font-size: 14px;
    height: 12px;
  }

  .login-btn button{
    position: relative;
    /*width: 84px;*/
    height: 30px;
    padding: 0 37px 0 19px;
    background-color: #62a8ea;
    border-radius: 3px;
    border: none;
    font-size: 13px;
    /*line-height: 30px;*/
    cursor: pointer;
    color: #ffffff;
  }
</style>

