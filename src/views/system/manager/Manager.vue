<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>管理员管理</a-breadcrumb-item>
      <a-breadcrumb-item>管理员列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'用户名'">
                  <a-input
                    v-decorator="[
                'username'
              ]"
                    placeholder="用户名模糊搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'姓名'">
                  <a-input
                    v-decorator="[
                'realName'
              ]"
                    placeholder="姓名模糊搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'状态'">
                  <a-select
                    v-decorator="[
                                    'status',
                                    ]"
                    placeholder="请选择状态"
                  >
                    <a-select-option
                      v-for="item in managerStatusList"
                      :key="item.key"
                      :value="item.key"
                    >{{item.value}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ textAlign: 'left' }">
                <a-button type="primary" icon="search" @click="searchFunc">搜 索</a-button>
                <a-button
                  :style="{ marginLeft: '8px', backgroundColor:'#ffca7e', color:'white' }"
                  icon="reload"
                  @click="resetSearch"
                >重 置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div style="height:39px">
        <template>
          <div>
            <a-button v-if="$store.getters.getButtonIds.indexOf(411) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加管理员信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改管理员信息' : '增加管理员'"
              :maskClosable="false"
              v-model="visible"
              :footer="null"
            >
              <template>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      :disabled="isUpdate"
                      v-decorator="[
                                    'username',
                                    {rules: [{ required: true, message: '请输入用户名!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item
                    v-if="isUpdate"
                    label="状态"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-select
                      v-decorator="[
                                    'status',
                                    {rules: [{ required: true, message: '请选择状态!' }]}
                                    ]"
                      placeholder="请选择状态"
                    >
                      <a-select-option
                        v-for="item in managerStatusList"
                        :key="item.key"
                        :value="item.key"
                        :disabled="isUpdate && item.key == 3"
                      >{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="真实姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'realName',
                                    {rules: [{ required: !isUpdate, message: '请输入姓名!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      type="password"
                      v-decorator="[
                                    'password',
                                    {rules: [{ required: !isUpdate, message: '请输入密码!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="选择部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-select
                      v-decorator="[
                                    'departmentId',
                                    {rules: [{ required: true, message: '请选择部门!' }]}
                                    ]"
                      placeholder="请选择部门"
                    >
                      <a-select-option
                        v-for="item in departments"
                        :key="item.id"
                        :value="item.id"
                      >{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="联系方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'mobile'
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="电子邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'email'
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="描述信息" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-textarea
                      v-decorator="[
                                    'description'
                                    ]"
                      :rows="3"
                    />
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">提交</a-button>
                  </a-form-item>
                </a-form>
              </template>
            </a-modal>
          </div>
        </template>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{ x: 1300}"
        :rowKey="record => record.id"
        @change="searchManagerByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(412) != -1" @click="modifyManager(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(413) != -1" style="color:#da6868" @click="deleteManager(record.id)">
              <a-icon type="delete"/>删除
            </a>
          </span>
        </span>
      </a-table>
    </div>
  </a-layout-content>
</template>
<script>
import lodash from "lodash";

const pageInit = { page: 1, pageSize: 10 };

const managerStatusList = [
  { key: 1, value: "正常" },
  { key: 2, value: "禁用" },
  { key: 3, value: "已删除" }
];

const managerStates = {
  1: "正常",
  2: "禁用",
  3: "已删除"
};

const columns = [
  { title: "姓名", dataIndex: "realName", key: "realName" },
  { title: "用户名", dataIndex: "username", key: "username" },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    customRender: text => {
      return managerStates[text];
    }
  },
  { title: "手机号码", dataIndex: "mobile", key: "mobile" },
  { title: "电子邮件", dataIndex: "email", key: "email" },
  { title: "创建时间", dataIndex: "createTime", key: "createTime" },
  { title: "描述", dataIndex: "description", key: "description" },
  {
    title: "操作",
    key: "operator",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];
export default {
  components: {},
  data() {
    return {
      data: [],
      visible: false,
      pagination: { showTotal: this.showTotal },
      loading: false,
      columns,
      managerStates,
      managerStatusList,
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      search: this.$form.createForm(this),
      departments: [],
      id: 0,
      isUpdate: false,
    };
  },
  methods: {
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.fetchManager({ page: pageInit, ...values  });
      });
    },
    resetSearch() {
      this.search.resetFields();
      this.fetchManager({ page: pageInit });
    },
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    show() {
      this.visible = true;
      this.isUpdate = false;
      this.form.resetFields();
    },
    modifyManager(id) {
      this.isUpdate = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/manager/info", { id: id })
        .then(response => {
          this.visible = true;
          var data = response.data.data;
          this.id = data.id;
          this.$nextTick(() => {
            this.form.setFieldsValue(
              lodash.pick(data, Object.keys(this.form.getFieldsValue()))
            );
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteManager(id) {
      if (confirm("确认删除此管理员信息吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/manager/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.fetchManager({
              page: pageInit
            });
          })
          .catch(error => {
            alert("删除管理员失败: " + error.response.data.message);
          });
      }
    },
    // 分页查询
    searchManagerByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetchManager({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    fetchManager(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/manager/list", params)
        .then(response => {
          const pagination = { ...this.pagination };
          pagination.total = response.data.data.totalCount;
          pagination.pageSize = response.data.data.size;
          pagination.current = response.data.data.current;
          this.loading = false;
          this.data = response.data.data.data;
          this.pagination = pagination;
        });
    },
    // 修改管理员信息
    handleUpdate(values) {
      values["id"] = this.id;
      this.axios
        .post(this.CONFIG.apiUrl + "/manager/update", values)
        .then(response => {
          alert(response.data.message);
          if(response.data.code == 1) {
                return;
          }
          this.fetchManager({
            page: pageInit
          });
        });
      this.id = 0;
    },
    getDepartments() {
      // 获取部门列表
      this.axios
        .post(this.CONFIG.apiUrl + "/fetch/department", {})
        .then(response => {
          this.departments = response.data.data;
        });
    },

    // 表单提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.isUpdate) {
            this.handleUpdate(values);
            this.visible = false;
            return;
          }
          this.axios
            .post(this.CONFIG.apiUrl + "/manager/add", values)
            .then(response => {
              alert(response.data.message);
              if(response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.fetchManager({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    }
  },
  mounted() {
    this.fetchManager({ page: pageInit });
    this.getDepartments();
  }
};
</script>

<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.title-name {
  color: #90a0af;
  display: block;
  height: 32px;
  text-align: center;
  padding-top: 5px;
}

.float-right {
  float: right;
}
</style>