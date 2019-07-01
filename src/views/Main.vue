<template>
<a-layout id="components-layout-demo-fixed-sider" style="min-height: 100vh">
    <Menu/>
    <a-layout :style="{ marginLeft: '200px' }">
      <PageHeader/>
      <router-view></router-view>
      <PageFooter/>
    </a-layout>
  </a-layout>
</template>

<script>
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default {
  name: "index",
  components: { Menu, "PageFooter":Footer, "PageHeader": Header },
  methods: {
    
  }
};
</script>

<style>
 .content-div {
   background-color: #ffffff
 }
.tableClass {
  margin-right: 20px;
  margin-bottom: 50px;
}

/* 搜索框样式 */
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
</style>
