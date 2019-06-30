<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>部门管理</a-breadcrumb-item>
      <a-breadcrumb-item>部门列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'部门名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="部门名称搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'编码'">
                  <a-input
                    v-decorator="[
                'code'
              ]"
                    placeholder="根据编码搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'上级部门'">
                  <a-select
                    v-decorator="[
                                    'parentId',
                                    ]"
                    placeholder="根据上级部门搜索"
                  >
                  <a-select-option v-for="d in departments" :key="d.id" :value="d.id" :disabled = "d.status == 2">{{d.name}}</a-select-option>
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
            <a-button v-if="$store.getters.getButtonIds.indexOf(431) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加部门信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改部门信息' : '增加部门'"
              :maskClosable="false"
              v-model="visible"
              :footer="null"
            >
              <template>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item label="编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input :disabled="isUpdate"
                      v-decorator="[
                                    'code',
                                    {rules: [{ required: true, message: '请输入部门编码!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="部门名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'name',
                                    {rules: [{ required: !isUpdate, message: '请输入部门名称!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item
                    label="上级部门"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-select
                      v-decorator="['parentId']" placeholder="选填，选择上级部门!">
                      <a-select-option :value="0">无上级部门</a-select-option>
                      <template v-for="d in departments">
                        <a-select-option v-if="id != d.id" :key="d.id" :disabled="d.status == 2" :value="d.id">{{d.name}}</a-select-option>
                      </template>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="isUpdate"
                    label="状态"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-select
                      v-decorator="['status']" placeholder="选择状态!">
                      <a-select-option :value="1">正常</a-select-option>
                      <a-select-option :value="2">停用</a-select-option>
                    </a-select>
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
        :scroll="{ x: 960}"
        :rowKey="record => record.department.id"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(432) != -1" @click="modifyDepartment(record.department.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(433) != -1" style="color:#da6868" @click="deleteDepartment(record.department.id)">
              <a-icon type="delete"/>停用
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

const columns = [
  { title: "名称", dataIndex: "department.name", key: "name" },
  { title: "编码", dataIndex: "department.code", key: "code"},
  { title: "上级部门", dataIndex: "name", key: "parentName" },
  { title: "状态", dataIndex: "department.status", key: "status",
    customRender: text => {
      return text == 1 ? "正常" : "停用";
    }
  },
  { title: "创建时间", dataIndex: "department.createTime", key: "createTime" },
  { title: "最近修改时间", dataIndex: "department.updateTime", key: "updateTime" },
  { title: "描述", dataIndex: "department.description", key: "description" },
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
      departments:[],
      pagination: { showTotal: this.showTotal },
      loading: false,
      columns,
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      search: this.$form.createForm(this),
      isUpdate: false,
      id: 0
    };
  },
  methods: {
    resetSearch() {
      this.search.resetFields();
      this.listDepartment({ page: pageInit });
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listDepartment({ page: pageInit, ...values });
      });
    },
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    show() {
      this.visible = true;
      this.isUpdate = false;
      this.form.resetFields();
    },
    listDepartment(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/department/list", params)
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
    searchDepartmentByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listDepartment({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    modifyDepartment(id) {
      this.isUpdate = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/department/info", { id: id })
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
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var url = this.CONFIG.apiUrl + "/department/add";
          if (this.isUpdate) {
            values["id"] = this.id;
            this.visible = false;
            url = this.CONFIG.apiUrl + "/department/update";
          }
          this.axios
            .post(url, values)
            .then(response => {
              alert(response.data.message);
              if(response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.fetchDepartment();
              this.listDepartment({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    deleteDepartment(id) {
      if (confirm("确认停用此部门信息吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/department/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listDepartment({
              page: pageInit
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    fetchDepartment() {
      this.axios
          .post(this.CONFIG.apiUrl + "/fetch/department", {})
          .then(response => {
            this.departments = response.data.data;
          })
    }
  },
  mounted() {
    this.listDepartment({ page: pageInit });
    this.fetchDepartment();
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