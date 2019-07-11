<template>
    <v-chart :options="option"/>
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
        .post("/statistic/product/order", {})
        .then(response => {
          this.option = {
            title: {
              text: "产品订购趋势",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: response.data.productNames,
            },
            series: [
              {
                name: "产品订购",
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
