<template>
  <a-layout-content style="margin: 0 16px;margin-bottom:50px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>系统发布日志</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="content-div">
      <a-card title="Go-Rad(V0.1)">
        <a href="javascript:;" slot="extra">查看更多</a>
        <p>发布第一个可使用版本V0.1！</p>
        <p>功能点: 用户管理，套餐管理，在线用户管理，NAS管理，管理员信息管理，部门管理，角色管理，菜单管理。</p>
        <p>系统采用前后端分离设计！</p>
      </a-card>
    </div>
    <div>
      <a-row :gutter="16">
        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>

        <a-col class="a-col-class" :span="12">
          <a-card :bordered="true">
            <v-chart :options="option"/>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>
<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/chart/bar";
var colors = ["#5793f3", "#d14a61", "#675bba"];
export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      option: {
        baseOption: {
          title: {
            text: "用户发展图表"
          },
          color: colors,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            }
          },
          grid: {
            right: "30%"
          },
          toolbox: {
            feature: {
              dataView: { show: false, readOnly: false },
              restore: { show: false },
              saveAsImage: { show: false }
            }
          },
          legend: {
            data: ["蒸发量", "降水量", "平均温度"]
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true
              },
              data: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月"
              ]
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "蒸发量",
              min: 0,
              max: 250,
              position: "right",
              axisLine: {
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: "{value} ml"
              }
            },
            {
              type: "value",
              name: "降水量",
              min: 0,
              max: 250,
              position: "right",
              offset: 80,
              axisLine: {
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: "{value} ml"
              }
            },
            {
              type: "value",
              name: "温度",
              min: 0,
              max: 25,
              position: "left",
              axisLine: {
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: "{value} °C"
              }
            }
          ],
          series: [
            {
              name: "蒸发量",
              type: "bar",
              data: [
                2.0,
                4.9,
                7.0,
                23.2,
                25.6,
                76.7,
                135.6,
                162.2,
                32.6,
                20.0,
                6.4,
                3.3
              ]
            },
            {
              name: "降水量",
              type: "bar",
              yAxisIndex: 1,
              data: [
                2.6,
                5.9,
                9.0,
                26.4,
                28.7,
                70.7,
                175.6,
                182.2,
                48.7,
                18.8,
                6.0,
                2.3
              ]
            },
            {
              name: "平均温度",
              type: "line",
              yAxisIndex: 2,
              data: [
                2.0,
                2.2,
                3.3,
                4.5,
                6.3,
                10.2,
                20.3,
                23.4,
                23.0,
                16.5,
                12.0,
                6.2
              ]
            }
          ]
        },
        media: [
          // 这里定义了 media query 的逐条规则。
          {
            query: { maxWidth:600}, // 这里写规则。
            option: {
              // 这里写此规则满足下的option。
              legend: {
                // legend 放在底部中间。
                right: "center",
                bottom: 0,
                orient: "horizontal" // legend 横向布局。
              },
               series: [                   // 两个饼图左右布局。
                {
                    radius: [30, '30%'],
                    center: ['30%', '30%']
                },
                {
                    radius: [30, '30%'],
                    center: ['30%', '30%']
                },
                {
                    radius: [30, '40%'],
                    center: ['40%', '40%']
                }
            ]
            }
          }
        ]
      }
    };
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