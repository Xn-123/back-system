<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene==0"
      ></CategorySelect>
    </el-card>
    <el-card>
        <!--  底部这里将来是有三部分进行切换  -->
        <div v-show="scene==0">
             <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpuForm">添加SPU</el-button>
        <el-table style="width: 100%" :data="records">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="spu名称" width="width">
        </el-table-column>
        <el-table-column prop="description" label="spu描述" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button type="success" icon="el-icon-plus" size="mini"  @click="addSku(row)" ></el-button>
            <el-button type="warning"  icon="el-icon-edit"  size="mini"  @click="updateSpuForm(row)"></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" style="margin-right:10px" @click="handler(row)"></el-button>
            <el-popconfirm title="这是一段内容确定删除吗？"  @onConfirm="deleteSpu(row)" >
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" title="删除spu"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page="page"
        :total="total"
        :page-size="limit"
        :pager-count="7"
        :page-sizes="[3, 5, 10]"
        @current-change="getSpuList"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper,->,sizes,total"
      ></el-pagination>
        </div>
        <!--  -->
        <SpuForm v-show="scene==1"  @changeScene="changeScene" ref="spu"></SpuForm>
        <SkuForm v-show="scene==2"  @changeScenes="changeScenes" ref="sku"></SkuForm>

        <!-- table展示sku列表-->
         <el-dialog
            :title="`${spu.spuName}的sku列表`"
            :visible.sync="dialogTableVisible"
            :before-close="close"
        >
        <el-table :data="skuList" style="width: 100%" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="width">
          </el-table-column>
          <el-table-column prop="weight" label="重量" width="width">
          </el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row,$index}">
                <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
    name:'Spu',
    data() {
        return {
            // 搜索三级联动id
            category1Id:'',
            category2Id:'',
            category3Id:'',
            // 是否禁用
            page:1, //当前页码
            limit:5, //每一页容量
            records:[], //存储请求的SpuList数据
            total:0 , //总记录条数
            scene: 0, //0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
             //控制对话框的显示与隐藏
            dialogTableVisible: false,
            spu: {},
            skuList: [], //存储的是SKU列表的数据
            loading:true
        }
    },
    components:{
        SpuForm,
        SkuForm
    },
    methods:{
        //自定义事件：用于子组件页面撤回(切换场景)
        changeScene({scene,flag}){
          this.scene = scene;
          // 重新请求数据
          if(flag=="修改"){
            this.getSpuList(this.page)
          }else{
            this.getSpuList()
          } 
        },
        getCategoryId({ categoryId, level }){
            if(level==1){
                this.category1Id = categoryId;
                this.category2Id = '';
                this.category3Id = '';
            }else if(level==2){
                this.category2Id = categoryId;
                this.category3Id = '';
            }else{
                this.category3Id = categoryId;
                // category3Id选中时，请求数据
                this.getSpuList(); 
                this.isDisButton = false
            }
        },
        // 数据请求
        async getSpuList(page1 = 1){
            // 防止handleSizeChange默认代参page1 = 1
            if (page1 != 1) {
            //跳转页码
            this.page = page1;
            }
            const {page,limit,category3Id} = this 
            let result =  await this.$API.spu.reqSpuList(page,limit,category3Id)
            try {
                if(result.code==200){
                this.records = result.data.records
                this.total =  result.data.total
                }
            } catch (error) {
                this.$message(error.message)
            }
        },
        //当分页器的某一个展示数据条数发生变化的回调
        handleSizeChange(limit) {
            //修改参数
            this.limit = limit;
            //再发请求
            this.getSpuList();
        },
        // 添加SPU
        addSpuForm(){
            this.scene = 1;
            // 发送请求（初始化SpuForm组件中品牌、销售属性）
            this.$refs.spu.addSpuData(this.category3Id)
        },
        //修改 SPU
        updateSpuForm(row){
            this.scene = 1;
            this.$refs.spu.initSpuData(row)
        },
        //删除SPU的回调 
        async deleteSpu(row) {
        let result = await this.$API.spu.reqDeleteSpu(row.id);
        if (result.code == 200) {
          this.$message({ type: "success", message: "删除成功" });
          //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
          } 
        },
       //添加SKU按钮的回调
        addSku(row) {
          //切换场景为2
          this.scene = 2;
          //父组件调用子组件的方法，让子组件发请求------三个请求
          this.$refs.sku.getData(this.category1Id, this.category2Id, row);
        },
        //skuform通知父组件修改场景
          changeScenes(scene) {
            this.scene = scene;
          },
        //查看SKU的按钮的回调
        async handler(spu) {
          //点击这个按钮的时候，对话框可见的
          this.dialogTableVisible = true;
          //保存spu信息
          this.spu = spu;
          //获取sku列表的数据进行展示
          let result = await this.$API.spu.reqSkuList(spu.id);
          if (result.code == 200) {
            this.skuList = result.data;
            //loading隐藏
            this.loading = false;
          }
        },
        //关闭对话框的回调
        close(done){
          //loading属性再次变为真
          this.loading = true;
          //清除sku列表的数据
          this.skuList = [];
          //管理对话框
          done();
        }
    },
}
</script>

<style>
</style>