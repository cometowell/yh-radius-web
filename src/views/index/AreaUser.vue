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
import "echarts/lib/chart/pie";
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
        .post("/statistic/area/user", {})
        .then(response => {
          this.option = {
            title: {
              text: "用户所在区域分布图示",
              subtext: "有效用户分布",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: response.data.areaNames,
            },
            series: [
              {
                name: "片区用户",
                type: "pie",
                radius: "65%",
                center: ["50%", "50%"],
                selectedMode: "single",
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: response.data.total
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
