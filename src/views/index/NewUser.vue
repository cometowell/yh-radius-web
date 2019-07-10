<template>
  <v-chart :options="option" />
</template>
<script>
import ECharts from "vue-echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/chart/line";
export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      option: {}
    };
  },
  methods: {
    statistic() {
      this.$axios
        .post("/statistic/new/user", {})
        .then(response => {
          this.option = {
            title: {
              text: "新用户发展趋势"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985"
                }
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                data: response.data.xAxis
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                name: "新用户发展",
                type: "line",
                stack: "总量",
                areaStyle: {},
                data: response.data.data
              }
            ]
          };
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.statistic();
  }
};
</script>
