<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>片区管理</a-breadcrumb-item>
      <a-breadcrumb-item>片区列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'片区名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="片区名称模糊搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'编码'">
                  <a-input
                    v-decorator="[
                'code'
              ]"
                    placeholder="编码搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ textAlign: 'left' }">
                <a-button type="primary" icon="search" @click="searchFunc">搜 索</a-button>
                <a-button
                  :style="{marginLeft: '8px'}"
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
            <a-button v-if="$store.getters.permissionGetter.indexOf(461) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加片区信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改片区信息' : '增加片区'"
              :maskClosable="false"
              v-model="visible"
              :footer="null"
            >
              <template>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item label="片区名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请输入片区名称!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="code" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'code',
                                    {rules: [{ required: true, message: '请输入编码!' }]}
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
      <a-table class="tableClass"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{ x: 980}"
        :rowKey="record => record.id"
        @change="searchAreaByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(462) != -1" @click="modifyArea(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(463) != -1" style="color:#da6868" @click="deleteArea(record.id)">
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
const columns = [
  { title: "序号", key: "index", customRender: (text, record, index) => index+1 },
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "编码", dataIndex: "code", key: "code" },
  { title: "创建时间", dataIndex: "createTime", key: "createTime" },
  { title: "修改时间", dataIndex: "updateTime", key: "updateTime" },
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
      this.listArea({ page: pageInit });
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listArea({ page: pageInit, ...values });
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
    listArea(params = {}) {
      this.loading = true;
      this.$axios.post("/area/list", params)
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
    searchAreaByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listArea({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    modifyArea(id) {
      this.isUpdate = true;
      this.$axios.post("/area/info", { id: id })
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
          var url = "/area/add";
          if (this.isUpdate) {
            values["id"] = this.id;
            this.visible = false;
            url = "/area/update";
          }
          this.$axios.post(url, values)
            .then(response => {
              alert(response.data.message);
              if(response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.listArea({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    deleteArea(id) {
      if (confirm("确认禁用此片区信息吗?")) {
        this.$axios.post("/area/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listArea({
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
    this.listArea({ page: pageInit });
  }
};
</script>

<style>
</style>