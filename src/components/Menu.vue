<template>
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu mode="inline" theme="dark" :openKeys="openKeys" @openChange="onOpenChange">
        <template v-for="menu in menus">
          <a-sub-menu v-if="hasChild(menu)" :key="menu.frontKey">
            <span slot="title">
              <a-icon :type="menu.icon" />
              <span>{{menu.name}}</span>
            </span>
              <a-menu-item v-for="(c,index) in menu.children" @click="jumpTo(c.frontRouter)" :key="menu.frontKey + index">
                <i class="glyphicon glyphicon-record"/> {{c.name}}
              </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="menu.frontKey" @click="jumpTo(menu.frontRouter)">
            <a-icon :type="menu.icon" /><span>{{menu.name}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
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
    },
    hasChild(menu) {
      return menu.children.length > 0 && menu.children[0].level != 3;
    },
    jumpTo(frontRouter) {
       this.$router.push(frontRouter);
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
