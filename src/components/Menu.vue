<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo"/>
      <a-menu mode="inline" theme="dark" :openKeys="openKeys" @openChange="onOpenChange">
        <a-sub-menu v-for="menu in menus" :key="menu.key">
          <span slot="title">
            <a-icon type="mail"/>
            <span>{{menu.name}}</span>
          </span>
          <a-menu-item v-for="c in menu.children" :key="c.key">
            <a-icon type="right" /> {{c.name}}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>
<script>
var menus = 
    [{name:"测试1", key:"test1",children:[{name:"测试1-1", key:"test1-1"}]},
    {name:"测试2", key:"test2",children:[{name:"测试2-1", key:"test2-1"}]},
    {name:"测试3", key:"test3",children:[{name:"测试3-1", key:"test3-1"}]},
    {name:"测试4", key:"test4",children:[{name:"测试4-1", key:"test4-1"}]},
    {name:"测试5", key:"test5",children:[{name:"测试5-1", key:"test5-1"}]}
    ];
export default {
  data() {
    return {
        menus: menus,
      collapsed: false,
      rootSubmenuKeys: ["test1", "test2", "test3", "test4", "test5"],
      openKeys: ["test1"]
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
    }
  },
  mounted() {

  },
};
</script>

<style>
.logo {
  height: 32px;
  background-image: url("../assets/logo.png");
  margin: 16px;
}
</style>
