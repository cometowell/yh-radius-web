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
            text: "上下行流量使用趋势",
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
            data: ["上行流量", "下行流量", "总流量"]
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
              name: "流量单位GB",
              axisLabel: {
                formatter: "{value} GB"
              }
            },
            {
              type: "value",
              name: "流量单位GB",
              axisLabel: {
                formatter: "{value} GB"
              }
            }
          ],
          series: [
            {
              name: "上行流量",
              type: "bar",
              data: response.data.input
            },
            {
              name: "下行流量",
              type: "bar",
              data: response.data.output
            },
            {
              name: "总流量",
              type: "line",
              yAxisIndex: 1,
              data: response.data.totalFlow
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
