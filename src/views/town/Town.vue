<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>村镇/街道管理</a-breadcrumb-item>
      <a-breadcrumb-item>村镇/街道列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'村镇/街道名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="村镇/街道名称模糊搜索"
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
            <a-button v-if="$store.getters.permissionGetter.indexOf(471) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加村镇/街道信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改村镇/街道信息' : '增加村镇/街道'"
              :maskClosable="false"
              v-model="visible"
              :footer="null"
            >
              <template>
                  <a-form :form="form" @submit="handleSubmit">
                    <a-form-item label="选择片区" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                    <a-select
                      v-decorator="[
                    'areaId',
                    {rules: [{ required: true, message: '请选择片区!' }]}
                  ]"
                      placeholder="请选择片区"
                    >
                      <!-- <a-select-option :key="0">---选择片区---</a-select-option> -->
                      <a-select-option
                        v-for="item in areas"
                        :key="item.id"
                        :value="item.id"
                      >{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="村镇/街道名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请输入村镇/街道名称!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'code',
                                    {rules: [{ required: true, message: '请输入村镇/街道编码!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="描述信息" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                    <a-textarea
                      v-decorator="[
                                    'description'
                                    ]"
                      :rows="3"
                    />
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 12, offset: 8 }">
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
        @change="searchTownByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(472) != -1" @click="modifyTown(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(473) != -1" style="color:#da6868" @click="deleteTown(record.id)">
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
  { title: "片区", dataIndex: "areaName", key: "areaName" },
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "编码", dataIndex: "code", key: "code" },
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
      areas:[]
    };
  },
  methods: {
    fetchAreas() {
      this.$axios.post("/fetch/areas", {})
        .then(response => {
          this.areas = response.data.data;
        });
    },
    resetSearch() {
      this.search.resetFields();
      this.listTown({ page: pageInit });
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listTown({ page: pageInit, ...values });
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
    listTown(params = {}) {
      this.loading = true;
      this.$axios.post("/town/list", params)
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
    searchTownByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listTown({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    modifyTown(id) {
      this.isUpdate = true;
      this.$axios.post("/town/info", { id: id })
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
          var url = "/town/add";
          if (this.isUpdate) {
            values["id"] = this.id;
            this.visible = false;
            url = "/town/update";
          }
          this.$axios.post(url, values)
            .then(response => {
              alert(response.data.message);
              if(response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.listTown({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    deleteTown(id) {
      if (confirm("确认删除此村镇/片区信息吗?")) {
        this.$axios.post("/town/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listTown({
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
    this.listTown({ page: pageInit });
    this.fetchAreas();
  }
};
</script>

<style>
</style>