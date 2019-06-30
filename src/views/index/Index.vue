<template>
  <a-layout-content style="margin: 0 16px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>系统发布日志</a-breadcrumb-item>
    </a-breadcrumb>
    <div :class="'content-div'">
      <a-card title="Go-Rad(V0.1)">
        <a href="javascript:;" slot="extra">查看更多</a>
        <p>发布第一个可使用版本V0.1！</p>
        <p>功能点: 用户管理，套餐管理，在线用户管理，NAS管理，管理员信息管理，部门管理，角色管理，菜单管理。</p>
        <p>系统采用前后端分离设计！</p>
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
