<template>
  <div>
    <Header/>
    <Menu/>
    <router-view></router-view>
    <footer/>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default {
  name: "index",
  components: { Menu, "R-Footer":Footer, "R-Header": Header }
};
</script>

<style scoped>

</style>
