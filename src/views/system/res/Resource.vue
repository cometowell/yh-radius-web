<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>菜单管理</a-breadcrumb-item>
      <a-breadcrumb-item>菜单列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <a-table style="margin-bottom: 20px"
        :columns="columns"
        :dataSource="data"
        :bordered=true
        :rowKey="record => record.id"
        class="components-table-demo-nested"
        :pagination="false"
      >
        <a-table
          slot-scope="record"
          :columns="columns"
          :dataSource="record.children"
          :rowKey="record => record.id"
          :pagination="false"
        >
        </a-table>
      </a-table>
    </div>
  </a-layout-content>
</template>
<script>
const resTypeObj = {
  1: "模块",
  2: "栏目",
  3: "按钮"
};
const columns = [
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "URL", dataIndex: "url", key: "url" },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    customRender: text => {
      return resTypeObj[text];
    }
  },
  { title: "权限标识", dataIndex: "permMark", key: "permMark" },
  {
    title: "是否需要权限",
    dataIndex: "needPrem",
    key: "needPrem",
    customRender: text => {
      return text == 0 ? "不需要" : "需要";
    }
  },
  { title: "描述", dataIndex: "description", key: "description" }
];

export default {
  components: {},
  data() {
    return {
      data: [],
      columns,
      loading: false,
    };
  },
  methods: {
    listResource() {
      this.loading = true;
      this.axios
        .post(this.CONFIG.apiUrl + "/resource/list", {})
        .then(response => {
          this.loading = false;
          this.data = response.data.data;
        });
    },
    expandFunc(expand, record) {
      console.log(expand, record);
    }
  },
  mounted() {
    this.listResource();
  },
};
</script>

<style>
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