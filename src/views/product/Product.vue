<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>套餐管理</a-breadcrumb-item>
      <a-breadcrumb-item>套餐列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'套餐名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="套餐名称模糊搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'类型'">
                  <a-select
                    v-decorator="[
                                    'type',
                                    ]"
                    placeholder="选择类型搜索"
                  >
                    <a-select-option :value="1">包月</a-select-option>
                    <a-select-option :value="2">计时</a-select-option>
                    <a-select-option :value="3">流量</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'状态'">
                  <a-select
                    v-decorator="[
                                    'status',
                                    ]"
                    placeholder="选择状态搜索"
                  >
                    <a-select-option :value="1">正常</a-select-option>
                    <a-select-option :value="2">停用</a-select-option>
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
      <div style="margin-bottom: 10px">
        <div style="height:39px">
          <div>
            <a-button v-if="$store.getters.getButtonIds.indexOf(210) != -1" type="primary" @click="addProduct">
              <a-icon type="plus"/>添加套餐
            </a-button>
          </div>
        </div>
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
            <a v-if="$store.getters.getButtonIds.indexOf(230) != -1" @click="modifyProduct(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(240) != -1" style="color:#da6868" @click="deleteProduct(record.id)">
              <a-icon type="delete"/>停用
            </a>
          </span>
        </span>
      </a-table>
    </div>
  </a-layout-content>
</template>
<script>
const pageInit = { page: 1, pageSize: 10 };
const productStatusList = [
  { key: 1, value: "正常" },
  { key: 2, value: "停用" }
];

const productStates = {
  1: "正常",
  2: "停用",
};

const productTypes = {
  1: "包月",
  2: "计时",
  3: "流量"
};

const columns = [
  { title: "套餐名", dataIndex: "name", key: "name" },
  { title: "类型", dataIndex: "type", key: "type",
    customRender: text => {
      return productTypes[text];
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    customRender: text => {
      return productStates[text];
    }
  },
  {
    title: "绑定MAC",
    dataIndex: "shouldBindMacAddr",
    key: "shouldBindMacAddr",
    customRender: text => {
      return text == 1 ? '是' : "否";
    }
  },
  {
    title: "绑定VLAN",
    dataIndex: "shouldBindVlan",
    key: "shouldBindVlan",
    customRender: text => {
      return text == 1 ? '是' : "否";
    }
  },
  { title: "并发数", dataIndex: "concurrentCount", key: "concurrentCount" },
  { title: "时长(分钟)", dataIndex: "productDuration", key: "productDuration", 
    customRender: text => {
      return text / 60;
    }
  },
  { title: "月数", dataIndex: "serviceMonth", key: "serviceMonth" },
  { title: "流量(M)", dataIndex: "productFlow", key: "productFlow", customRender: text => text / 1024.0 },
  { title: "价格(元)", dataIndex: "price", key: "price",customRender: text => text / 100.0 },
  { title: "上行限速(Mbps)", dataIndex: "upStreamLimit", key: "upStreamLimit"},
  { title: "下行限速(Mbps)", dataIndex: "downStreamLimit", key: "downStreamLimit"},
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
      productStates,
      productStatusList,
      formLayout: "horizontal",
      search: this.$form.createForm(this),
    };
  },
  methods: {
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listProducts({ page: pageInit, ...values  });
      });
    },
    resetSearch() {
      this.search.resetFields();
      this.listProducts({ page: pageInit });
    },
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    addProduct() {
      this.$router.push('/product/add');
    },
    modifyProduct(id) {
        this.$router.push({path:'/product/modify', query:{id: id}});
    },
    deleteProduct(id) {
      if (confirm("确认停用此套餐信息吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/product/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listProducts({
              page: pageInit
            });
          })
          .catch(error => {
            console.log("删除套餐失败", error);
          });
      }
    },
    // 分页查询
    searchManagerByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listProducts({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    listProducts(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/product/list", params)
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
  },
  mounted() {
    this.listProducts({ page: pageInit });
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