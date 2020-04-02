<template>
  <el-container style="border: 1px solid #eee">
    <el-row style="width: 100%">
      <el-col :xs="10" :sm="10" :md="8" :lg="6" :xl="4" class="aside">

        <el-aside  >
          <el-card class="box-card">
            <el-input  placeholder="搜索权限"  prefix-icon="el-icon-search"   v-model="filterText"  size="medium"  style=" width: 240px; ">  </el-input>

            <!-- 权限树结构 -->
            <el-tree style="margin-top: 10px"   :data="setTree"   :props="defaultProps"  node-key="id"  ref="SlotMenuList"
                                 :filter-node-method="filterNode"  @node-contextmenu='rightClick' accordion  @node-click="changeFormData()"  >
              <span class="slot-t-node" slot-scope="{ node, data }">
                 <!-- 菜单图标 -->
              <span>
                 <i :class="data.icon"></i>
              </span>
              <span v-show="!node.isEdit">
                <span v-show="data.children && data.children.length >= 1">
                  <i :class="{ 'fa fa-plus-square': !node.expanded, 'fa fa-minus-square':node.expanded}" />
                  <span :class="[data.id >= maxExpandId ? 'slot-t-node--label' : '']">{{node.label}}</span>
                </span>
                <span v-show="!data.children || data.children.length == 0">
                  <i class='' style='margin-right:10px'></i>
                  <span :class="[data.id >= maxExpandId ? 'slot-t-node--label' : '']">{{node.label}}</span>
                </span>
              </span>
              <!-- 编辑输入框 -->
              <span v-show="node.isEdit">
                <el-input class="slot-t-input" size="mini" autofocus
                          v-model="data.name"
                          :ref="'slotTreeInput'+data.id"
                          @blur.stop="NodeBlur(node, data)"
                          @keyup.enter.native="NodeBlur(node, data)"></el-input>
              </span>
              </span>
            </el-tree>
          </el-card>
            <!--树结构鼠标右键点击出现页面-->
          <div v-show="menuVisible" >
            <el-menu  id = "rightClickMenu"  class="el-menu-vertical"   @select="handleRightSelect"   active-text-color="#fff"  text-color="#fff" >
              <el-menu-item index="1" class="menuItem">
                <span slot="title">添加同级菜单</span>
              </el-menu-item>
              <el-menu-item index="2" class="menuItem">
                <span slot="title">添加子级菜单</span>
              </el-menu-item>
              <el-menu-item index="3" class="menuItem">
                <span slot="title">删除当前菜单</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
      </el-col>

      <el-col :xs="14" :sm="14" :md="16" :lg="18" :xl="20">
        <el-container>
          <el-main>
            <el-card class="box-card">
              <!-- 表单编辑按钮 -->
              <el-button  icon="el-icon-edit" size="mini" @click="handleRemoveFormDisable()"></el-button>
              <!-- 表单 -->
              <el-form ref="permForm" :model="permForm" label-width="80px" size="mini" >
                <el-form-item label="父节点">
                  <el-input v-model="permForm.parentId" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                  <el-input v-model="permForm.title" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="类型"   >
                  <el-radio-group v-model="permForm.type">
                    <el-radio :label=1  :disabled="disabledForm" >菜单</el-radio>
                    <el-radio :label=0 :disabled="disabledForm" >权限</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="请求方法">
                  <el-select v-model="permForm.hrefMethod" placeholder="请求方法" :disabled="disabledForm">
                    <el-option label="GET" value="GET"></el-option>
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="PUT" value="PUT"></el-option>
                    <el-option label="DELETE" value="DELETE"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="url地址">
                  <el-input v-model="permForm.href" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                  <el-input v-model="permForm.icon" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="是否展开">
                  <el-switch v-model="permForm.spread"  :active-value= 1 :inactive-value= 0 :disabled="disabledForm" ></el-switch>
                </el-form-item>
                <el-form-item label="是否可见">
                  <el-switch v-model="permForm.enable"  :active-value= 1 :inactive-value= 0  :disabled="disabledForm"   ></el-switch>
                </el-form-item>
                <el-form-item label="排序号">
                  <el-input v-model="permForm.sortNumber" :readonly="readForm"></el-input>
                </el-form-item>

<!--                <el-form-item>-->
<!--                  <el-button type="primary" @click="onSubmit">提交</el-button>-->
<!--                  <el-button>取消</el-button>-->
<!--                </el-form-item>-->
              </el-form>

            </el-card>
          </el-main>
        </el-container>
      </el-col>
    </el-row>



  </el-container>
</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  import {getMenuList,add,update} from "@/api/base/permission";

  let id = 1000;
  export default {

    components: { ElCol },
    data() {

      return {
        permForm: {
          parentId: "",
          permissionId: "",
          title: "",
          type: 1,
          icon: "",
          href: "",
          hrefMethod: "",
          code: "",
          sortNumber: "",
          spread: 1,
          enable: 1,
        },
        readForm: true,
        disabledForm: true,
        currentNodeObject: null,
        currentNodeData: null,
        currentNodeParentObject: null,
        currentNodeParentData: null,
        DATA: null,
        NODE: null,
        dialogNewFormVisible: false,
        dialogFormVisible: false,
        dialogClassifyVisible: false,

        maxExpandId: 99999999999999999999,//新增节点开始id
        non_maxexpandId: 99999999999999999999,//新增节点开始id(不更改)
        isLoadingTree: true,//是否加载节点树
        setTree: [],

        defaultProps: {
          label: 'title',
          children: 'children'
        },
        filterText: '',
        input: "",
        input2: "",
        currentPage4: 4,
        editObj: {},
        menuVisible: false,
        objectID: null,
        /*分类修改*/
        menuVisible2: false,
        objectID2: null
      };
    },
    methods: {
      /*
      * 查询菜单树结构
      */
      doQuery() {
        getMenuList()
          .then(res => {
            let resp = res.data;
            this.setTree = resp.data;
          })
      },
      onSubmit() {
        console.log('submit!');
      },

      filterNode(value, data) {
        console.log('value:',value)
        console.log('data:',data)
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },


      NodeBlur(n, d){//输入框失焦
        console.log(n, d)
        if(n.isEdit){
          this.$set(n, 'isEdit', false)
        }
        this.$nextTick(() => {
          this.$refs['slotTreeInput'+d.id].$refs.input.focus()
        })
      },
      NodeEdit(n, d){//编辑节点
        console.log(n, d)
        if(!n.isEdit){//检测isEdit是否存在or是否为false
          this.$set(n, 'isEdit', true)
        }
      },
      NodeDel(n, d){//删除节点
        console.log(n, d)
        let that = this;
        if(d.children && d.children.length !== 0){
          this.$message.error("此节点有子级，不可删除！");
          return false;
        }else{
          //新增节点可直接删除，已存在的节点要二次确认
          //删除操作
          let DelFun = () => {
            let _list = n.parent.data.children || n.parent.data;//节点同级数据
            let _index = _list.map((c) => c.id).indexOf(d.id);
            console.log(_index)
            _list.splice(_index, 1);
            this.$message.success("删除成功！")
          };
          //二次确认
          let ConfirmFun = () => {
            this.$confirm("是否删除此节点？","提示",{
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              DelFun()
            }).catch(() => {})
          }
          //判断是否是新增节点
          d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
        }
      },

      /*
      * 右键点击触发菜单
      *  object 当前节点数据
      *  value 当前html对象
      */
      rightClick(event, object, value, element) {

        if (this.objectID !== object.permissionId) {
          this.objectID = object.permissionId;
          this.menuVisible = true;
          this.currentNodeObject =  value ;
          this.currentNodeData = object;
          this.currentNodeParentObject =  value.parent;
          this.currentNodeParentData = value.parent.data;
        } else {
          this.menuVisible = !this.menuVisible;
        }
        // 给右键菜单添加 点击关闭事件
        document.addEventListener('click',(e)=>{
          this.menuVisible = false;
        });
        //给悬浮口菜单添加 相对位置样式
        let menu = document.querySelector("#rightClickMenu");
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 -205 + "px";
        menu.style.top = event.clientY - 30 - 20 + "px";
        menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
        menu.style.width = 130 + "px"; //设置右键菜单的宽度

      },


      /*
      *  添加子节点
      *  n 当前操作节点包含html对象
      *  d 当前操作节点纯对象
      */
       addChildNode(nodeData, object){
        //判断层级
        if(nodeData.level >= 3){
          this.$message.error("最多只支持三级！");
          return false;
        }
        //新增数据
        object.children.push({
          permissionId: ++this.maxExpandId,
          title: '新增节点',
          parentId: object.permissionId,
          spread: 0,
          enable: 1,
          type: 1,
          children: []
        });
        //同时展开节点
        if(!nodeData.expanded){
          nodeData.expanded = true
        }
      },

      /*
      *  添加同级节点
      *  object 当前操作节点包含html对象
      *  nodeData 当前操作节点纯对象
      */
       addSameNode(object,nodeData){
         this.$refs.SlotMenuList.insertAfter({
           title: '新增节点',
           spread: 0,
           enable: 1,
           type: 1,
           children: []
         } ,this.currentNodeData.id);
        //同时展开节点
        if(!object.expanded){
          object.expanded = true
        }
      },

      /*
      * 菜单激活回调
      */
      handleRightSelect(key) {
        console.log(key);

        if (key === "1") {
          this. addSameNode(this.currentNodeObject, this.currentNodeData);
          this.menuVisible = false;
        }
        else if (key === "2") {
          debugger
          this. addChildNode(this.currentNodeObject, this.currentNodeData);
          this.menuVisible = false;
        } else if (key === "3") {
          this.NodeDel(this.currentNodeObject, this.currentNodeObject);
          this.menuVisible = false;
        }
        // if (key === "1") {
        //   this. addChildNode(this.NODE, this.DATA);
        //   this.menuVisible = false;
        // }
        // else if (key === "2") {
        //   this.NodeEdit(this.NODE, this.DATA);
        //   this.menuVisible = false;
        // } else if (key === "3") {
        //   this.NodeDel(this.NODE, this.DATA);
        //   this.menuVisible = false;
        // }
      },


      handleEdit(index, row) {
        this.editObj = row;
        this.dialogFormVisible = true;
        console.log(index, row);
      },
      handleClassifyEdit(index, row) {
        console.log(index);
        console.log(row);
        this.dialogClassifyVisible = true;
        // console.log(index, row);
      },

      changeFormData(){
        this.disabledForm = true;
        this.readForm = true;
        this.permForm = this.$refs.SlotMenuList.getCurrentNode();
      },


      handleRemoveFormDisable(){
         this.readForm = false;
         this.disabledForm = false;
      }
    },
    // 创建完毕状态
    created: function () {
      this.doQuery()
    }
  };
</script>
<style lang="less" scoped>

  .asideButton .el-row{
    padding: 10px;
  }
  .asideButton .el-row i{
    color: #bdc1ca;
  }
  .asideButton .el-input{
    width: 220px;
  }
  .asideButton .el-input input{
    border-radius: 35px;
  }
  label{
    line-height: 40px;
  }

  .block{
    padding-top: 5%;
  }
  .block i{
    color: #777777;
  }
  /*************************标签鼠标右击页面样式******************************/
  .el-menu-vertical{
    border: 3px solid rgb(84, 92, 100);
    border-radius: 10px;
    z-index: 100;
  }
  .el-menu-vertical i{
    color: #777777;
  }
  .menuItem{
    height: 40px;
    line-height: 40px;
    background-color: #545c64;
    font-size: 0.9rem;
  }
  .menuItem:hover{
    background-color: #409EFF;
  }

  .el-container .el-main .el-card .el-form .el-form-item .el-input {
    width: 300px;
  }
</style>

