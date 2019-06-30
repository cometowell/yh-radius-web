<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>在线用户</a-breadcrumb-item>
      <a-breadcrumb-item>在线用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'账号'">
                  <a-input
                    v-decorator="[
                'username'
              ]"
                    placeholder="账号模糊搜索"
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
                <a-form-item :label="'用户姓名'">
                  <a-input
                    v-decorator="[
                'realName'
              ]"
                    placeholder="用户姓名模糊搜索"
                  />
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
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{ x: 980}"
        :rowKey="record => record.onlineUser.id"
        @change="searchOnlineByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <span>
              <a-tooltip title="下线功能：系统发送下线请求至NAS，NAS处理用户下线后会向服务器发送停止计费请求,此时用户下线.">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a v-if="$store.getters.getButtonIds.indexOf(310) != -1" style="color:#da6868" @click="offlineUser(record.onlineUser.id)">
              下线 <a-icon type="login" /> 
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(320) != -1" style="color:#9a633b" @click="deleteOnline(record.onlineUser.id)">
              清理<a-icon type="delete"/>
            </a>
          </span>
        </span>
      </a-table>
    </div>
  </a-layout-content>
</template>
<script>
const pageInit = { page: 1, pageSize: 10 };
const columns = [
  { title: "用户姓名", dataIndex: "radUser.realName", key: "realName" },
  { title: "账号", dataIndex: "onlineUser.username", key: "username" },
  { title: "IP地址", dataIndex: "onlineUser.ipAddr", key: "ipAddr" },
  { title: "会话标识", dataIndex: "onlineUser.acctSessionId", key: "acctSessionId" },
  { title: "上线时间", dataIndex: "onlineUser.startTime", key: "startTime" },
  { title: "上线时长(分)", dataIndex: "onlineUser.usedDuration", key: "usedDuration", customRender: text => text / 60},
  { title: "NasIp地址", dataIndex: "onlineUser.nasIpAddr", key: "nasIpAddr" },
  { title: "MAC地址", dataIndex: "onlineUser.macAddr", key: "macAddr" },
  { title: "上行流量MB", dataIndex: "onlineUser.totalUpStream", key: "totalUpStream", customRender: text => text / 1024.0 },
  { title: "下行流量MB", dataIndex: "onlineUser.totalDownStream", key: "totalDownStream", customRender: text => text / 1024.0 },
  {
    title: "操作",
    key: "operator",
    fixed: "right",
    width: 180,
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
      search: this.$form.createForm(this),
    };
  },
  methods: {
    resetSearch() {
      this.search.resetFields();
      this.listOnlineUsers({ page: pageInit });
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listOnlineUsers({ page: pageInit, ...values });
      });
    },
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    listOnlineUsers(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/online/list", params)
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
    searchOnlineByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listOnlineUsers({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    offlineUser(id) {
      if (confirm("确定下线用户吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/online/off", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listOnlineUsers({
              page: pageInit
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    deleteOnline(id) {
      if (confirm("注意: 清理功能只是清理系统中在线用户的记录\n用户并不会下线,如果需要下线用户请使用下线功能!!!\n确定清理此在线用户吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/online/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listOnlineUsers({
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
    this.listOnlineUsers({ page: pageInit });
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