<template>
<a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <Menu/>
    <a-layout>
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

<style scoped>

</style>
