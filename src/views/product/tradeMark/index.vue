<template>
  <div>
    <!-- 按钮 -->
    <el-button
      icon="el-icon-plus"
      type="primary"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器-->
    <!-- 
        @size-change="handleSizeChange"  
        @current-change="handleCurrentChange"
        current-page:代表的是当前第几页
        total：代表分页器一共需要展示数据条数
        page-size：代表的是每一页需要展示多少条数据
        page-sizes：代表可以设置每一页展示多少条数据
        layout：可以实现分页器布局
        pager-count:按钮的数量  如果 9  连续页码是7

     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="3"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getDateList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 对话框
    :visible.sync="dialogFormVisible" 设置显示隐藏
     -->
    <el-dialog
      :title="tmForm.id ? '修改商品' : '添加商品'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    //  var validateTmName = (rule, value, callback) => {
    //   //自定义校验规则
    //   if (value.length < 2 || value.length > 10) {
    //     callback(new Error("品牌名称2-10位"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      //代表的分页器第几页
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //列表展示的数据
      list: [],
      //总共数据条数
      total: 0,
      //对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      //收集品牌信息:对象身上的属性
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur、change）
        tmName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
        //品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  methods: {
    //获取品牌列表的数据
    async getDateList(page1 = 1) {
      // 防止handleSizeChange默认代参page1 = 1
      if (page1 != 1) {
        //跳转页码
        this.page = page1;
      }
      //解构出参数
      const { page, limit } = this;
      //获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      } else {
        alert("获取品牌列表请求失败");
      }
    },
    //当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getDateList();
    },
    //点击添加品牌的按钮
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息，直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      // 浅拷贝
      this.tmForm = { ...row };
    },
    // 删除某一个品牌
    deleteTradeMark(row) {
       //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确定按钮的时候会出发
          //向服务器发请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
             //再次获取品牌列表数据
            this.getDateList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      console.log(file.raw);
      this.tmForm.logoUrl = URL.createObjectURL(file.raw);
    },
    //图片上传成功
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确认添加||修改商品
    addOrUpdateTradeMark() {
      // 隐藏对话框
      this.dialogFormVisible = false;
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message(this.tmForm.id ? "修改成功" : "添加成功");
            // 跳转到修改||添加的当前页码   需优化！！！！！！！
            // if(!this.tmForm.id){
            //   this.page = Math.ceil(this.total/this.limit)
            //   console.log(this.page)
            // }
            this.getPageList();
          } else {
            console.log("error submit!!");
            return false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    this.getDateList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>