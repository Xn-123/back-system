<template>
<div>
     <div class="header">
         <span class="search-header">搜索用户数</span>
         <svg t="1637478175000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2179" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2180" fill="#8a8a8a"></path></svg>
     </div>
     <div class="main" >
          <span class="main-title">12321</span>
          <span class="main-content">17.1</span>
            <svg t="1647927617137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4960" width="12" height="12"><path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="4961" fill="#1afa29"></path></svg>
            <!-- <svg t="1647927574279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4087" width="12" height="12"><path d="M952.32 715.2l-416-485.376c-12.16-14.176-36.448-14.176-48.608 0l-416 485.376c-8.128 9.472-9.984 22.848-4.768 34.176C72.16 760.704 83.488 768 96 768l832 0c12.512 0 23.84-7.296 29.056-18.624S960.448 724.672 952.32 715.2z" p-id="4088" fill="#d81e06"></path></svg> -->
     </div>
     <div class="footer" >
         <div class="charts" ref="charts"></div>
     </div>   
</div>

</template>

<script>
import * as echarts from "echarts";
export default {
    name:'',
    mounted(){
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
        //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          data: [10, 7, 33, 12, 48, 9,29,10,44],
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          smooth: true ,
          //线条的样式
          lineStyle: {
            color: "blue",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
    }
}
</script>

<style scoped>
.header{
  display: flex;
  align-items: center;
}
.search-header{
  margin-right: 20px;
}
.main{
  margin: 10px 0px ;
}
.main-title{
  margin-right: 30px;
}
.main-content{
  margin-right: 10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>