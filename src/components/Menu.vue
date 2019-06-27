<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo"/>
      <a-menu mode="inline" theme="dark" :openKeys="openKeys" @openChange="onOpenChange">
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon type="mail"/>
            <span>Navigation One</span>
          </span>
          <a-menu-item key="1">
            <a-icon type="caret-right"/>Option 1
          </a-menu-item>
          <a-menu-item key="2">Option 2</a-menu-item>
          <a-menu-item key="3">Option 3</a-menu-item>
          <a-menu-item key="4">Option 4</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="appstore"/>
            <span>Navigation Two</span>
          </span>
          <a-menu-item key="5">Option 5</a-menu-item>
          <a-menu-item key="6">Option 6</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title">
            <a-icon type="setting"/>
            <span>Navigation Three</span>
          </span>
          <a-menu-item key="9">Option 9</a-menu-item>
          <a-menu-item key="10">Option 10</a-menu-item>
          <a-menu-item key="11">Option 11</a-menu-item>
          <a-menu-item key="12">Option 12</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
      rootSubmenuKeys: ["sub1", "sub2", "sub4"],
      openKeys: ["sub1"]
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
  }
};
</script>

<style>
.logo {
  height: 32px;
  background-image: url('../assets/logo.png');
  margin: 16px;
}
</style>
