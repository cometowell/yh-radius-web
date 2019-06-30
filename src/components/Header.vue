<template>
  <a-affix :offsetTop="0">
    <a-layout-header style="background: #3d72ab; padding: 0;">
      <div style="float:right; margin-right:30px;">
        <div id="components-dropdown-demo-placement">
    <a-dropdown>
      <a-button style="color:#3f6d98;background-color:#e8e8e8">
        <a-icon type="user"/>
        {{realName}}
      </a-button>
      <a-menu slot="overlay">
        <a-menu-item>
          <a @click="logout()">
            退出登录
            <a-icon type="unlock"/>
          </a>
        </a-menu-item>
        <a-menu-item>
          <a @click="changePassword()">
            修改密码
            <a-icon type="key" />
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
      </div>
    </a-layout-header>
  </a-affix>
</template>

<script>
export default {
  name: "pageHeader",
  data() {
    return {
       realName: ""
    };
  },
  created() {
     this.getUser();
  },
  methods: {
    getUser() {
      this.$axios.post("/session/manager/info", {}
      ).then(response => {
            this.realName = response.data.data.manager.realName;
            this.$store.commit("permissionSetter", response.data.data.buttonPermissions);
        }).catch(() => {
            
        });
    },
    logout() {
      if (confirm("确定退出系统吗?!")) {
        this.$axios.post("/logout", {});
        localStorage.removeItem(AUTUORIZATION)
        this.$router.push("/");
      }
    },
    changePassword() {
      this.$router.push("/change/password");
    }
  }
};
</script>

<style scoped>
</style>