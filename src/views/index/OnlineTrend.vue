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
import "echarts/lib/chart/bar";
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
      this.$axios.post("/statistic/online/user", {}).then(response => {
        this.option = {
          title: {
            text: "在线用户趋势",
            x: "left"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            }
          },
          legend: {
            data: ["在线用户-柱形", "在线用户-线型"]
          },
          xAxis: [
            {
              type: "category",
              data: response.data.xAxis,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "在线用户数",
              axisLabel: {
                formatter: "{value} 人次"
              }
            },
            {
              type: "value",
              name: "在线用户数",
              axisLabel: {
                formatter: "{value} 人次"
              }
            }
          ],
          series: [
            {
              name: "在线用户-柱形",
              type: "bar",
              data: response.data.total
            },
            {
              name: "在线用户-线型",
              type: "line",
              yAxisIndex: 1,
              data: response.data.total
            }
          ]
        };
      });
    }
  },
  mounted() {
    this.statistic();
  }
};
</script>
