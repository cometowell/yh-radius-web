<template>
  <a-layout-content style="margin: 0 16px;margin-bottom: 50px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>About</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <a-card title="关于系统" :bordered=false>
        <a href="https://github.com/cometowell/go-radius" target="_blank" slot="extra">
          <span style="font-size:16px">
            <a-icon type="github"/>&nbsp;github查看源代码
          </span>
        </a>
        <p>关于系统</p>
      </a-card>
      
    </div>
  </a-layout-content>
</template>
<script>
export default {
    
}
</script>

