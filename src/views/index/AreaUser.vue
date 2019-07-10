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
      option: {
        title: {
           text: "用户所在区域分布图示",
           subtext: '有效用户分布',
           x:'center'
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["直达", "营销广告", "搜索引擎"]
        },
        series: [
          {
            name:'访问来源',
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直达', selected:true},
                {value:679, name:'营销广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
        ]
      }
    };
  }
};
</script>
