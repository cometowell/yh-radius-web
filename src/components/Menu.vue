<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu mode="inline" theme="dark" :openKeys="openKeys" @openChange="onOpenChange">
        <a-sub-menu v-for="menu in menus" :key="menu.frontKey">
          <span slot="title">
            <a-icon :type="menu.icon" />
            <span>{{menu.name}}</span>
          </span>
          <a-menu-item v-for="(c,index) in menu.children" :key="menu.frontKey + index">
            <i class="glyphicon glyphicon-record"/>
            {{c.name}}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      menus: [],
      collapsed: false,
      rootSubmenuKeys: [],
      openKeys: []
    };
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    loadMenus() {
       this.$axios.post("/session/resource").then(data =>{
         var menus = data.data.data;
         menus.forEach((element, index) => {
           this.menus.push(element);
           this.rootSubmenuKeys.push(element.frontKey);
         });
       }).catch((error) => {
          console.log(error);
       });
    }
  },
  mounted() {
    this.loadMenus();
  }
};
</script>

<style>
.logo {
  height: 32px;
  background-image: url("../assets/logo.png");
  margin: 16px;
}
</style>
