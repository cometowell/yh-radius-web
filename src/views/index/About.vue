<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>About</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <a-card title="关于系统">
        <a href="https://github.com/cometowell/go-radius" target="_blank" slot="extra"><a-icon type="github" /> github查看源代码</a>
        <p>关于系统</p>
      </a-card>
    </div>
  </a-layout-content>
</template>
<script>
export default {
  data() {
    return {
      data:[]
    }
  }
}
</script>

<style>
</style>
