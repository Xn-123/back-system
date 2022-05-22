<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
        // data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
      },
      yAxis: {
        show: false,
      },
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      //系列
      series: [
        {
          //图标形式-柱状图
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
          color: "cyan",
        },
      ],
      tooltip:{},
    });
  },
};
</script>

<style>
</style>