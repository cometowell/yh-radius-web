<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>角色管理</a-breadcrumb-item>
      <a-breadcrumb-item>角色列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <div style="margin-bottom: 10px">
        <template>
          <a-form class="ant-advanced-search-form" :form="search">
            <a-row :gutter="24">
              <a-col :span="6" :style="{ display:'block'}">
                <a-form-item :label="'角色名称'">
                  <a-input
                    v-decorator="[
                'name'
              ]"
                    placeholder="角色名称搜索"
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
              <a-col :span="6" :style="{ textAlign: 'left' }">
                <a-button type="primary" icon="search" @click="searchFunc">搜 索</a-button>
                <a-button
                  :style="{ marginLeft: '8px' }"
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
            <a-button v-if="$store.getters.permissionGetter.indexOf(441) != -1" type="primary" @click="show()">
              <a-icon type="plus"/>添加角色信息
            </a-button>
            <a-modal
              :title="isUpdate ? '修改角色信息' : '增加角色'"
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
                                    {rules: [{ required: true, message: '请输入角色编码!' }]}
                                    ]"
                    />
                  </a-form-item>
                  <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input
                      v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请输入角色名称!' }]}
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
      <a-modal
        :width="'500px'"
        :title="'角色赋权'"
        style="top: 10px;"
        :maskClosable="false"
        v-model="empowerVisible"
        :cancelText="'取消'"
        :okText="'确认'"
        @ok="okFunc"
        :bodyStyle="{overflowY: 'scroll',
                      height: '500px'}"
      >
        <template>
          <a-tree
            checkable
            @expand="onExpand"
            v-model="defaultCheckedKeyList"
            :expandedKeys="expandedKeys"
            :checkStrictly=true
            :showLine=true
            :treeData="treeData"
            @check="checkFunc"
          />
        </template>
      </a-modal>
      <a-table class="tableClass"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{ x: 960}"
        :rowKey="record => record.id"
        @change="searchRoleByParams"
      >
        <span slot="action" slot-scope="record" class="table-operation">
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(443) != -1" @click="modifyRole(record.id)">
              <a-icon type="edit"/>修改
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(445) != -1" @click="empower(record.id)">
              <a-icon type="link"/>赋权
            </a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a v-if="$store.getters.permissionGetter.indexOf(444) != -1" style="color:#da6868" @click="deleteRole(record.id)">
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
  { title: "最近修改时间", dataIndex: "updateTime", key: "updateTime" },
  { title: "描述", dataIndex: "description", key: "description" },
  {
    title: "操作",
    key: "operator",
    fixed: "right",
    width: 230,
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
      id: 0,
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      search: this.$form.createForm(this),
      isUpdate: false,
      expandedKeys: [],
      checkedKeys: [],
      defaultCheckedKeyList:[],
      treeData: [],
      empowerVisible: false,
      resources: new Map(),
      currentRoleId: 0,
    };
  },
  methods: {
    listRoles(params = {}) {
      this.loading = true;
      this.$axios.post("/role/list", params)
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
    resetSearch() {
      this.listRoles({ page: pageInit });
      this.search.resetFields();
    },
    searchFunc(e) {
      e.preventDefault();
      this.search.validateFields((_, values) => {
        this.listRoles({ page: pageInit, ...values });
      });
    },
    searchRoleByParams(pagination) {
      var values = this.search.getFieldsValue();
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.listRoles({
        page: {
          pageSize: pagination.pageSize,
          page: pagination.current
        },
        ...values
      });
    },
    modifyRole(id) {
      this.isUpdate = true;
      this.$axios.post("/role/info", { id: id })
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
    showTotal(total) {
      return "每页" + this.pagination.pageSize + "条 | 共" + total + "条数据";
    },
    show() {
      this.visible = true;
      this.isUpdate = false;
      this.form.resetFields();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var url = "/role/add";
          if (this.isUpdate) {
            values["id"] = this.id;
            this.visible = false;
            url = "/role/update";
          }
          this.$axios.post(url, values)
            .then(response => {
              alert(response.data.message);
              if (response.data.code == 1) {
                return;
              }
              this.visible = false;
              this.listRoles({
                page: pageInit
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    deleteRole(id) {
      if (confirm("确认删除此角色吗?")) {
        this.$axios.post("/role/delete", { id: id })
          .then(response => {
            alert(response.data.message);
            this.listRoles({
              page: pageInit
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    empower(id) {
      this.defaultCheckedKeyList = [];
      this.treeData = [];
      this.empowerVisible = true;
      this.$axios.post("/role/resources", { id: id })
        .then(response => {
          var resList = response.data.data;
          resList.forEach(element => {
            var result = {};
            this.buildTreeData(element, result);
            this.treeData.push(result);
          });
          this.currentRoleId = id;
        });
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    buildTreeData(res, item = {}) {
      this.resources[res.id] = res.parentId;
      if (res.selected) {
        this.defaultCheckedKeyList.push(res.id);
        this.checkedKeys.push(res.id);
      }
      item.children = [];
      item.key = res.id;
      item.title = res.name;
      res.children.forEach(element => {
        this.resources[element.id] = element.parentId;
        var c = { key: element.id, title: element.name };
        c.parent = res.id;
        item.children.push(c);
        this.buildTreeData(element, c);
      });
    },
    checkFunc(_, info) {
      var dataInfo = info.node.$vnode.data.props.dataRef;
      var checked = info.checked;
      this.doCheck(dataInfo, checked);
    },
    selectParent(key) {
      var parent = this.resources[key];
      if(parent != undefined && parent != 0) {
        this.checkedKeys.push(parent);
        this.defaultCheckedKeyList.checked.push(parent);
        this.selectParent(parent);
      }
    },
    doCheck(dataInfo, checked) {
      if(checked) {
          this.checkedKeys.push(dataInfo.key);
          this.defaultCheckedKeyList.checked.push(dataInfo.key);
          // 选中父节点
          this.selectParent(dataInfo.key);
          dataInfo.children.forEach(e => {
              this.checkedKeys.push(e.key);
              this.defaultCheckedKeyList.checked.push(e.key);
              this.doCheck(e, true);
          });
      } else {
        // 子项全部取消选择
        this.checkedKeys = this.removeArrayItem(this.checkedKeys, dataInfo.key);
        dataInfo.children.forEach(e => {
          this.checkedKeys = this.removeArrayItem(this.checkedKeys, e.key);
          this.defaultCheckedKeyList.checked = this.removeArrayItem(this.defaultCheckedKeyList.checked, e.key);
          this.doCheck(e, false);
        });
        this.defaultCheckedKeyList.checked = this.removeArrayItem(this.defaultCheckedKeyList.checked, dataInfo.key);
      }
      this.checkedKeys = [...(new Set(this.checkedKeys))];
      this.defaultCheckedKeyList.checked = [...(new Set(this.defaultCheckedKeyList.checked))];
    },
    removeArrayItem(arr, value) {
      if(arr == null || arr.length == 0) {
        return arr;
      }
      var index = arr.indexOf(value);
      if(index == -1) {
        return arr;
      }
      return [...arr.slice(0, index), ...arr.slice(index+1)];
    },
    okFunc() {
      var values = [];
      this.checkedKeys.forEach(val => {
        values.push({roleId: this.currentRoleId, resourceId: val});
      });
      this.$axios.post("/role/empower/" + this.currentRoleId, values)
        .then(response => {
          alert(response.data.message);
          this.empowerVisible = false;
        });
    }
  },
  mounted() {
    this.listRoles({ page: pageInit });
  },
  
};
</script>

<style>
</style>