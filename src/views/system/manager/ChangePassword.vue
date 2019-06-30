<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>管理员管理</a-breadcrumb-item>
      <a-breadcrumb-item>修改管理员密码</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <a-form :form="form" @submit="handleSubmit" :style="{width:'800px', margin:'auto auto'}">
        <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            :disabled="true"
            v-decorator="[
          'realName',
          {rules: [{ required: true}]}
        ]"
          />
        </a-form-item>
        <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            :disabled="true"
            v-decorator="[
          'username',
          {rules: [{ required: true}]}
        ]"
          />
        </a-form-item>
        <a-form-item label="新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="请输入新密码"
            v-decorator="[
          'newPassword',
          {rules: [{ required: true, message: '请输入新密码,至少六位数字字母组合(6-18位)', min: 6}]}
        ]"
          />
        </a-form-item>
        <a-form-item label="确认新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="确认新密码"
            v-decorator="[
          'comfirmPassword',
          {rules: [{ required: true, message: '确认新密码,至少六位数字字母组合(6-18位)', min: 6}]}
        ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button style="width:100%" type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-layout-content>
</template>

<script>
const pwdReg = /^[0-9a-zA-z]{6,18}$/;
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      realName: "",
      username: "",
      id: 0
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword != values.comfirmPassword) {
            alert("密码不一致,请重新输入");
            return;
          }

          if (!pwdReg.test(values.newPassword)) {
            alert("密码是6-18位数字或者字母组合,请重新输入");
            return;
          }

          values.id = this.id;
          this.axios
            .post(this.CONFIG.apiUrl + "/manager/change/password", values)
            .then(response => {
                alert(response.data.message);
                this.axios.post(this.CONFIG.apiUrl + "/logout", {});
                localStorage.removeItem("rad_access_token")
                this.$router.push("/");
            })
            .catch(() => {});
        }
      });
    },
    getUser() {
      this.axios
        .post(this.CONFIG.apiUrl + "/session/manager/info", {})
        .then(response => {
          var manager = response.data.data.manager;
          this.realName = manager.realName;
          this.username = manager.username;
          this.form.setFieldsValue({
            realName: this.realName,
            username: this.username
          });
          this.id = manager.id;
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getUser();
  }
};
</script>