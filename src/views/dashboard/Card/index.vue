<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="总销售额" count="¥ 126560">
            <template slot="charts"> 
                <span>周同比&nbsp;&nbsp;56.67%&nbsp;</span>
                <svg t="1647927574279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4087" width="12" height="12"><path d="M952.32 715.2l-416-485.376c-12.16-14.176-36.448-14.176-48.608 0l-416 485.376c-8.128 9.472-9.984 22.848-4.768 34.176C72.16 760.704 83.488 768 96 768l832 0c12.512 0 23.84-7.296 29.056-18.624S960.448 724.672 952.32 715.2z" p-id="4088" fill="#d81e06"></path></svg>
                <span>&nbsp;日同比&nbsp;&nbsp;19.96% &nbsp;</span>
                <svg t="1647927617137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4960" width="12" height="12"><path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="4961" fill="#1afa29"></path></svg>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第二个card -->
          <Detail title="访问量" count="88460">
            <template slot="charts"> <lineChart/> </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第三个card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts"> <barCharts></barCharts> </template>
            <template slot="footer">
              <span>转换率64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第四个card -->
          <Detail title="运营活动效果" count="78%">
              <template slot="charts"> <progressCharts/> </template>
              <template slot="footer"> 
                <span>周同比&nbsp;&nbsp;12%&nbsp;</span>
                <svg t="1647927574279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4087" width="12" height="12"><path d="M952.32 715.2l-416-485.376c-12.16-14.176-36.448-14.176-48.608 0l-416 485.376c-8.128 9.472-9.984 22.848-4.768 34.176C72.16 760.704 83.488 768 96 768l832 0c12.512 0 23.84-7.296 29.056-18.624S960.448 724.672 952.32 715.2z" p-id="4088" fill="#d81e06"></path></svg>
                <span>&nbsp;日同比&nbsp;&nbsp;11% &nbsp;</span>
                <svg t="1647927617137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4960" width="12" height="12"><path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="4961" fill="#1afa29"></path></svg>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barCharts from "./barCharts";
import progressCharts from "./progressCharts";

export default {
  name: "",
  components: {
    Detail,
    lineChart,
    barCharts,
    progressCharts,
  },
};
</script>

<style>
</style>