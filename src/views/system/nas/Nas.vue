<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>NAS管理</a-breadcrumb-item>
      <a-breadcrumb-item>NAS列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'NAS名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="NAS名称模糊搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'IP地址'">
                  <a-input
                    v-decorator="[
                'ipAddr'
              ]"
                    placeholder="IP地址搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'厂商'">
                  <a-select
                    v-decorator="[
                                    'vendorId',
                                    ]"
                    placeholder="请选择厂商"
                  >
                    <a-select-option :value="1">标准</a-select-option>
                    <a-select-option :value="9">思科</a-select-option>
                    <a-select-option :value="2011">华为</a-select-option>
                    <a-select-option :value="3902">中兴</a-select-option>
                    <a-select-option :value="14988">MikroTik</a-select-option>
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
            <a-button v-if="$store.getters.getButtonIds.indexOf(421) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加NAS信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改NAS信息' : '增加NAS'"
              :maskClosable="false"
              v-model="visible"
              :footer="null"
            >
              <template>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item label="NAS名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请输入NAS名称!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item
                    v-if="isUpdate"
                    label="厂商"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-select
                      v-decorator="[
                                    'vendorId',
                                    {rules: [{ required: true, message: '请选择NAS厂商!' }]}]"
                      placeholder="请选择NAS厂商"
                    >
                      <a-select-option :value="1">标准</a-select-option>
                      <a-select-option :value="9">思科</a-select-option>
                      <a-select-option :value="2011">华为</a-select-option>
                      <a-select-option :value="3902">中兴</a-select-option>
                      <a-select-option :value="14988">MikroTik</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="IP地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'ipAddr',
                                    {rules: [{ required: true, message: '请输入NAS IP地址!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="秘钥" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'secret',
                                    {rules: [{ required: true, message: '请输入认证秘钥!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="授权端口" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'authorizePort',
                                    {rules: [{ required: true, message: '请输入授权端口!' }], initialValue: 3799}
                                    ]"
                      placeholder="请输入授权端口"
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
        :scroll="{ x: 980}"
        :rowKey="record => record.id"
        @change="searchNasByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(422) != -1" @click="modifyNas(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(423) != -1" style="color:#da6868" @click="deleteNas(record.id)">
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
const vendorTypeObj = {
  1: "标准",
  9: "思科",
  2011: "华为",
  3902: "中兴",
  14988: "MikroTik"
};
const columns = [
  { title: "名称", dataIndex: "name", key: "name" },
  {
    title: "厂商",
    dataIndex: "vendorId",
    key: "vendorId",
    customRender: text => {
      return vendorTypeObj[text];
    }
  },
  { title: "IP地址", dataIndex: "ipAddr", key: "ipAddr" },
  { title: "秘钥", dataIndex: "secret", key: "secret" },
  { title: "授权端口", dataIndex: "authorizePort", key: "authorizePort" },
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
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      search: this.$form.createForm(this),
      isUpdate: false,
      id:0,
    };
  },
  methods: {
    resetSearch() {
      this.search.resetFields();
      this.listNas({ page: pageInit });
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listNas({ page: pageInit, ...values });
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
    listNas(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/nas/list", params)
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
    searchNasByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listNas({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    modifyNas(id) {
      this.isUpdate = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/nas/info", { id: id })
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
          var url = this.CONFIG.apiUrl + "/nas/add";
          if (this.isUpdate) {
            values["id"] = this.id;
            this.visible = false;
            url = this.CONFIG.apiUrl + "/nas/update";
          }
          this.axios
            .post(url, values)
            .then(response => {
              alert(response.data.message);
              if(response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.listNas({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    deleteNas(id) {
      if (confirm("确认删除此NAS信息吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/nas/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listNas({
              page: pageInit
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  mounted() {
    this.listNas({ page: pageInit });
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