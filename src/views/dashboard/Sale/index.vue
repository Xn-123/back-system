<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!--  v-model="activeName" @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <el-row :gutter="8">
          <el-col :span="12"
            ><span @click="setDay">今日</span>
            <span @click="setWeek">本周</span>
            <span @click="setMonth">本月</span>
            <span @click="setYear">本年</span>
          </el-col>
          <el-col :span="12">
            <!-- 宽度问题 -->
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="chart" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li v-for="arr in store" :key="arr.no">
              <span :class="arr.no<4?'rindex':''">{{arr.no}}</span>
              <span>{{arr.name}}</span>
              <span class="rvalue">{{arr.money}}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
  </div>
</el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "",
  data() {
    return {
      activeName: "first",
      mycharts: null,
      //收集日历数据
      date: [],
    };
  },
  computed: {
    //计算属性-标题
    title() {
      //重新设置配置项
      return this.activeName == "first" ? "销售额" : "访问量";
    },
    // 排名店名、销量
    store() {
      //重新设
       return this.activeName == "first"? this.listState.orderRank:this.listState.userRank;
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    //重新修改图标的配置数据
    //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
    title: {
      handler(newName, oldName) {
        this.myCharts();
      },
    },
    //初始化：当listState一返回数据，直接渲染页面
    listState: {
      handler(newName, oldName) {
        this.myCharts();
      },
    },
  },
  methods: {
    //本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    myCharts() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYearAxis
                : this.listState.userFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
  width: 500px;
}
.right span {
  margin: 0px 10px;
}
.chart {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
ul li span:nth-child(1) {
  margin-right: 10px;
}
.rindex {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: black;
  text-align: center;
  color: white;
}
.rvalue {
  float: right;
}
.el-date-editor .el-range__close-icon {
  width: 0px;
}
</style>