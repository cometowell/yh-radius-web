<template>
  <div class="panel-wrapper">
    <div class="panel">
      <!--面板的头部-->
      <div class="panel-top">
        <h2>Radius管理系统</h2>
      </div>
      <form id="theForm">
        <div class="panel-content">
          <div class="int">
            <label>
              <img src="../../assets/images/user.png" width="20px" height="20px">
            </label>
            <input v-model="username" id="username" @keyup.enter="login()" placeholder="你的手机号或者用户名">
          </div>
          <div class="int">
            <label>
              <img src="../../assets/images/passwd.png" width="20px" height="20px">
            </label>
            <input type="password" v-model="password" id="password" @keyup.enter="login()" placeholder="请输入密码">
          </div>
          <div class="login">
            <button type="button" @click="login()">登录</button>
          </div>
          <div class="reg">
            <span style="font-weight: 500;color: orangered"></span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      if(this.username.length === 0 || this.password.length === 0) {
        alert("please enter your username and password!");
        return;
      }
      this.$axios.post("login", {
            username: this.username,
            password: this.password
        }).then(response => {
            var resultData = response.data;
            if(resultData.code == 1) {
              alert(resultData.message);
              return;
            }
            this.$store.commit("permissionSetter", resultData.data.buttonPermissions);
            localStorage.setItem(AUTUORIZATION, resultData.data.sessionId);
            this.$router.push("/index");
        }).catch(function() {
            return;
        });
    }
  },
  mounted() {
    var msg = this.$route.query.reason;
    if(msg != undefined && msg.length != 0) {
      alert(msg);
    }
  }
};
</script>

<style scoped>
@import "./login.css";
</style>