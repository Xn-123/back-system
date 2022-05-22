<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 查询表单 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 搜索匹配的平台属性表单  height固定表头 -->
        <el-table :data="attrList" style="width: 100%"  height="500"  >
          <el-table-column
            type="index"
            label="序列"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="100px"
            :filters="filterAttrName"
            :filter-method="filterHandler"
          ></el-table-column>
          <el-table-column prop="prop" label="属性列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-popover trigger="hover" placement="top">
                 <p>【模拟】未实现其功能</p>
                 <div style="display: inline;margin-left: 10px;" slot="reference" class="name-wrapper">
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                 </div>  
              </el-popover> 
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性||修改表单 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="300"
            v-model="attrInfo.attrName"
          >
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder=""
                size="mini"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <!-- onConfirm老版本  confirm现版本 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttrValue" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  computed:{
  //下拉框条件刷选的数组
    filterAttrName(){
        const  filterAttrName = []
        // 去重
        const  arr =Array.from(new Set(this.attrName))
        arr.every(item => {
           filterAttrName.push({
               text: item,  
               value: item
           })
           return true
        })
        return filterAttrName
      }
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的数据
      attrList: [],
      //切换查询表单||（添加属性||修改表单）显示影藏
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
      // 收集attrName用于筛选
      attrName:[]
    };
  },
  methods: {
    // 对属性名称进行筛选 value:筛选条件值  column：筛选的Object
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
    },
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取平台的属性数据
        this.getAttrList();
      }
    },
    //发请求获取平台的属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if ((result.code = 200)) {
        this.attrList = result.data;
        // 收集attrName用于筛选 
        this.attrName = result.data.map((item) => {
           return item.attrName
        });
      }
    },
    //添加属性
    addAttr() {
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //添加属性值
    addAttrValue() {
      const { attrInfo } = this;
      const attrValueList = {
        attrId: attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      };
      attrInfo.attrValueList.push(attrValueList);
      // 一创建新的input就聚焦到当前
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //删除对应添加的属性值
    deleteAttrValue(index) {
      //当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //修改指定属性
    updateAttr(attrInfo) {
      this.isShowTable = false;
      //加载需要修改的原有属性
      // 深拷贝 attrInfo对象中存着对象  解决方案：浅拷贝{...attrInfo}会出现bug
      this.attrInfo = cloneDeep(attrInfo);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    //失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复 // enter键
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // data数据发生改变后，页面重新渲染需要时间加载直接执行代码将无法获取真实的row
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttrValue() {
      // 整理参数
      // 首先过滤掉无效数据
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 有效数据返回
          if (item.valueName != "") {
            //删除掉flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性的信号量进行切换
        this.isShowTable = true;
        //提示消失
        this.$message({ type: "success", message: "保存成功" });
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        // this.$message('保存失败')
      }
    },
  },
};
</script>

<style>
</style>