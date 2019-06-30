<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>修改用户</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <a-form :form="form" :style="{width:'800px', margin:'auto auto'}" @submit="handleSubmit">
        <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input disabled
            v-decorator="[
              'username',
              {rules: [{ required: true, message: '请输入用户名!' }]}
            ]"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            type="password" placeholder="选填,留空表示不修改"
            v-decorator="[
                          'password'
                          ]"
          />
        </a-form-item>
        <a-form-item label="真实姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[
          'realName',
          {rules: [{ required: true, message: '请输入姓名!' }]}
        ]"
            placeholder="请输入姓名"
          ></a-input>
        </a-form-item>
        <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="[
          'status',
          {rules: [{ required: true, message: '请选择状态!' }]}
        ]"
            placeholder="请选择状态"
          >
            <a-select-option
              v-for="item in userStateList"
              :key="item.key"
              :value="item.key"
              :disabled = "item.key == 4"
            >{{item.value}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="订购套餐" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select disabled
            v-decorator="[
          'productId',
          {rules: [{ required: true, message: '请选择套餐!' }]}
        ]"
            placeholder="请选择套餐"
          >
            <a-select-option
              v-for="item in products"
              :key="item.id"
              :value="item.id"
              :type="item.type"
              :serviceMonth = "item.serviceMonth"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
          <span slot="label">
            到期时间
            <a-tooltip title="流量和时长套餐可选择套餐使用的截止时间,不选择则使用套餐默认值(当日,当月,无限)！">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-date-picker style="width:100%" placeholder="选填,到期时间" disabled
            v-decorator="['expireTime', {initialValue: expire,rules: [{ type: 'object'}]}]"
          />
        </a-form-item>
        <a-form-item label="静态IP地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="选填，静态IP地址" v-decorator="[
          'framedIpAddr'
        ]"/>
        </a-form-item>
        <a-form-item label="手机号码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[
          'mobile'
        ]" placeholder="选填，手机号码"></a-input>
        </a-form-item>
        <a-form-item label="电子邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[
              'email'
             ]" placeholder="选填，电子邮件"/>
        </a-form-item>
        <a-form-item label="装机地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea :row="5"
            placeholder="请输入装机地址"
            v-decorator="[
          'installedAddr',
          {rules: [{ required: true, message: '请输入装机地址!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea
            :row="3"
            v-decorator="[
          'description'
        ]"
            placeholder="选填，描述"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5}">
          <a-button type="primary" style="width:100%" html-type="submit">提交修改</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-layout-content>
</template>

<script>

const userStateList = [
  { key: 1, value: "正常" },
  { key: 2, value: "停机" },
  { key: 3, value: "禁用" },
  { key: 4, value: "销户" }
];

import lodash from "lodash";
import moment from "moment";
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      products: [],
      userStateList,
      expire:null,
      id: 0,
    };
  },
  methods: {
    getUserInfo() {
      var id = parseInt(this.$route.query.id);
      this.isUpdate = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/user/info", { id: id })
        .then(response => {
          this.visible = true;
          var data = response.data.data;
          this.id = data.id;
          var expire = data['expireTime'];
          if(expire != null) {
              data['expireTime'] = moment(expire);
          }

          this.$nextTick(() => {
            this.form.setFieldsValue(
              lodash.pick(data, Object.keys(this.form.getFieldsValue()))
            );
          });
        })
        .catch(() => {
          alert("修改用户失败");
        });
    },
    fetchProducts() {
      this.axios
        .post(this.CONFIG.apiUrl + "/fetch/product", {})
        .then(response => {
          this.products = response.data.data;
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          delete values.expireTime;
          values['id'] = this.id;
          this.axios
            .post(this.CONFIG.apiUrl + "/user/update", values)
            .then(response => {
              alert(response.data.message);
              this.$router.push("/user");
              if(response.data.code == 1) {
                return;
              }
            })
            .catch(() => {});
        }
      });
    }
  },
  mounted() {
    this.fetchProducts();
    this.getUserInfo();
  }
};
</script>