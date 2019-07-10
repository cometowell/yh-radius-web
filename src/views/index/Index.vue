<template>
  <a-layout-content style="margin: 0 16px;margin-bottom:50px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>统计视图</a-breadcrumb-item>
    </a-breadcrumb>
    <div>
      <a-row :gutter="16">
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <AreaUser />
          </a-card>
        </a-col>
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <NewUser />
          </a-card>
        </a-col>
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <ProductOrder />
          </a-card>
        </a-col>
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <FlowTrend />
          </a-card>
        </a-col>
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <OnlineTrend/>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>
<script>
import AreaUser from "./AreaUser";
import ProductOrder from "./ProductOrder";
import FlowTrend from "./FlowTrend";
import OnlineTrend from "./OnlineTrend";
import NewUser from "./NewUser";
export default {
  components: {
    AreaUser: AreaUser,
    ProductOrder: ProductOrder,
    FlowTrend: FlowTrend,
    OnlineTrend: OnlineTrend,
    NewUser: NewUser,
  },
  data() {
    return {
        newUser: {},
        onlineAndFlowTrendStatistic: {}
    }
  },
  methods: {
    statistic() {
      this.$axios.post("/statistic", {})
      .then(response => {
          var data = response.data.data;
          console.log(data);
          this.newUser = data.newUserStatistic;
          this.onlineAndFlowTrendStatistic = data.onlineAndFlowTrendStatistic;
      })
    }
  },
  mounted() {
    // this.statistic();
  }
};
</script>

<style scoped>
div .echarts {
  width: 650px;
  height: 350px;
}
.a-col-class {
  margin-top: 5px;
}
</style>