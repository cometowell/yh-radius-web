<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
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
                      v-for="item in userStateList"
                      :key="item.key"
                      :value="item.key"
                    >{{item.value}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6" :style="{ textAlign: 'left' }">
                <a-button type="primary" icon="search" @click="searchUserFunc">搜 索</a-button>
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
            <a-button v-if="$store.getters.getButtonIds.indexOf(110) != -1" type="primary" @click="addUser">
              <a-icon type="plus"/>添加用户信息
            </a-button>
          </div>
        </div>
      </div>
      <template>
        <a-modal
          title="续订套餐"
          v-model="continueVisible"
          :footer="null"
          :maskClosable=false
        >
          <template>
            <a-form
              :form="continueForm"
              @submit="handleContinue"
            >
              <a-form-item
                label="ID"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
                :hidden="'hidden'"
              >
                <a-input :disabled=true
                  v-decorator="[
                    'id',
                    {rules: [{ required: true}]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                label="用户账号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-input :disabled=true
                  v-decorator="[
                    'username',
                    {rules: [{ required: true}]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                label="姓名"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-input :disabled=true
                  v-decorator="[
                    'realName',
                    {rules: [{ required: true}]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                label="选择产品"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select @change="productSelected"
                  v-decorator="[
                    'productId',
                    {rules: [{ required: true, message: '请选择续订产品!' }]}
                  ]"
                  placeholder="请选择续订产品"
                >
                  <a-select-option v-for="p in products" :value="p.id" :key="p.id" :type="p.type">
                    {{p.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :hidden="productType != 1"
                label="倍数"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-input
                  v-decorator="[
                    'count', 
                    {initialValue:1, rules: [{ validator:validateCount}]}
                  ]"
                />
              </a-form-item>
              <a-form-item
                :wrapper-col="{ span: 12, offset: 5 }"
              >
                <a-button
                  type="primary"
                  html-type="submit"
                >
                  确认提交
                </a-button>
              </a-form-item>
            </a-form>
          </template>
        </a-modal>
      </template>
      <template>
        <div>
          <a-drawer
            title="用户详情"
            :placement="placement"
            :closable="false"
            :width="600"
            @close="onDrawerClose"
            :visible="drawerVisible"
          >
          <UserInfo :userInfo="userInfo" :userId="userId" />    
          </a-drawer>
        </div>
      </template>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{ x: 1300}"
        :rowKey="record => record.radUser.id"
        @change="searchUserByParams"
      >
        <template slot="statusName" slot-scope="text">
          <div :style="getStatusColor(text)">{{userStates[text]}}</div>
        </template>
        <template slot="username" slot-scope="record">
          <a href="javascript:;" @click="showDrawer(record)">{{record.radUser.username}}</a>
        </template>
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(150) != -1" href="javascript:;" @click="userContinue(record.radUser)">
              <a-icon type="select" /> 续订
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(120) != -1" href="javascript:;" @click="modifyUser(record.radUser.id)">
              <a-icon type="edit"/> 修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.getButtonIds.indexOf(130) != -1" style="color:#da6868" @click="deleteUser(record.radUser.id)">
              <a-icon type="delete"/> 删除
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
const userStateList = [
  { key: 1, value: "正常" },
  { key: 2, value: "停机" },
  { key: 3, value: "禁用" },
  { key: 4, value: "销户" }
];

const userStates = {
  1: "正常",
  2: "停机",
  3: "禁用",
  4: "销户",
};

const productTypes = {
  1: "包月",
  2: "自由时长",
  3: "流量"
}

const columns = [
  { title: "姓名", dataIndex: "radUser.realName", key: "realName" },
  { title: "用户名", key: "username" ,
    scopedSlots: { customRender: 'username' }
  },
  { title: "套餐", dataIndex: "radProduct.name", key: "productName",
    customRender: (text,record) => {
      return text + "(" + productTypes[record.radProduct.type] +")";
    }
  },
  {
    title: "状态",
    dataIndex: "radUser.status",
    key: "status",
    scopedSlots: { customRender: "statusName" }
  },
  { title: "手机号码", dataIndex: "radUser.mobile", key: "mobile" },
  { title: "套餐剩余时长(分)", dataIndex: "radUser.availableTime", key: "availableTime",customRender: text => text / 60  },
  { title: "套餐剩余流量(M)", dataIndex: "radUser.availableFlow", key: "availableFlow", customRender: text => text / 1024.0 },
  { title: "套餐过期时间", dataIndex: "radUser.expireTime", key: "expireTime", customRender: text => text.substring(0,10) },
  { title: "电子邮件", dataIndex: "radUser.email", key: "email" },
  {
    title: "操作",
    key: "operator",
    fixed: "right",
    width: 220,
    scopedSlots: { customRender: "action" }
  }
];
import UserInfo from "./UserInfo"
export default {
  components: {
    UserInfo
  },
  data() {
    return {
      data: [],
      visible: false,
      continueVisible: false,
      drawerVisible: false,
      placement: "right",
      pagination: { showTotal: this.showTotal },
      loading: false,
      productTypes,
      columns,
      userStateList,
      userStates,
      formLayout: "horizontal",
      search: this.$form.createForm(this),
      continueForm: this.$form.createForm(this),
      products: [],
      id: 0,
      isUpdate: false,
      userInfo:{},
      userId: 0,
      continueUser: null,
      productType: 0,
    };
  },
  methods: {
    validateCount(_, value, callback) {
      if(isNaN(value) || value <= 0 ) {
          callback("必须是数字并且大于0");
          this.expire = null;
          return;
      } 
      callback();
    },
    productSelected(value, option) {
      this.productType = option.data.attrs.type;
    },
    fetchProducts() {
      this.axios
        .post(this.CONFIG.apiUrl + "/fetch/product", {})
        .then(response => {
          this.products = response.data.data;
        });
    },
    handleContinue(e) {
       e.preventDefault();
       this.continueForm.validateFields((err, values) => {
         values.id = parseInt(values.id);
         values.count = parseInt(values.count);
         values.beContinue = true;
         this.axios.post(this.CONFIG.apiUrl + "/user/continue", values).then(response => {
             alert(response.data.message);
             this.continueVisible = false;
             this.fetchUser({page: pageInit});
             return;
         }).catch((error) => {
            console.log(error);
         });
       });
    },
    userContinue(user) {
      this.productType = 0;
      this.continueForm.resetFields();
      this.continueVisible = true;
      this.continueUser = user;
      this.fetchProducts();
      delete user.productId;
      delete user.count;
      this.$nextTick(() => {
          this.continueForm.setFieldsValue(lodash.pick(user, Object.keys(this.continueForm.getFieldsValue())));
      });
      
    },
    getStatusColor(text) {
        return text == 4 ? {color: 'red'} : ( text == 3 ? {color: '#FF9933'} : (text == 2 ? {color:'#cc6869'} :{color:'#1890ff'}))
    },
    onDrawerClose() {
      this.drawerVisible = false;
    },
    showDrawer(user) {
      this.userInfo = user;
      this.userId = user.radUser.id;
      this.drawerVisible = true;
    },
    searchUserFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.fetchUser({ page: pageInit, ...values  });
      });
    },
    resetSearch() {
      this.search.resetFields();
      this.fetchUser({ page: { current: 1, pageSize: 10 } });
    },
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    show() {
      this.visible = true;
      this.isUpdate = false;
      this.form.resetFields();
    },
    modifyUser(id) {
        this.$router.push({path:'/user/modify', query:{id: id}})
    },
    deleteUser(id) {
      if (confirm("确认删除此用户信息吗?")) {
        this.axios
          .post(this.CONFIG.apiUrl + "/user/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.fetchUser({
              page: pageInit
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 分页查询
    searchUserByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetchUser({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    fetchUser(params = {}) {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/user/list", params)
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
    // 修改用户信息
    handleUpdate(values) {
      values["id"] = this.id;
      this.axios
        .post(this.CONFIG.apiUrl + "/user/update", values)
        .then(response => {
          alert(response.data.message);
          this.fetchUser({
            page: pageInit
          });
        });
      this.id = 0;
    },
    
    addUser() {
      this.$router.push('/user/add');
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
              this.visible = false;
              this.fetchUser({
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
    this.fetchUser({ page: pageInit });
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

.user-grid-25 {
  width:25%;
  text-align:center;
  height: 30px;
  padding: 5px;
  display:block;word-break: break-all;word-wrap: break-word;
}

.user-grid-50 {
  width:50%;
  text-align:center;
  padding: 5px;
  min-height: 31px;
  display:block;word-break: break-all;word-wrap: break-word;
}
</style>