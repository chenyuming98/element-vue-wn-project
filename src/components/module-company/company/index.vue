<template>
  <el-container style="border: 1px solid #eee">
    <el-row style="width: 100%">
      <el-col :xs="6" :sm="10" :md="8" :lg="8" :xl="6" class="aside">
        <el-card class="box-card"  >
          <div style=" width: 335px; ">
            <el-row style=" padding-bottom: 7px;">
              <el-button type="primary" size="small" @click="addChildNode">添加子级节点</el-button>
              <el-button type="primary" size="small"  @click="addSameNode">添加同级节点</el-button>

              <el-dropdown @command="handleCommand" style="  margin-left: 10px;   border-left-width: 1px; ">
                <el-button   size="small">
                  更多功能<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="  margin-left: 18px;   border-left-width: 2px; ">
                  <el-dropdown-item command="changCheckStatus">复选框</el-dropdown-item>
                  <el-dropdown-item command="chooseAll">全部勾选</el-dropdown-item>
                  <el-dropdown-item command="notChooseAll">全部取消</el-dropdown-item>
                  <el-dropdown-item command="expandAll">展开所有</el-dropdown-item>
                  <el-dropdown-item command="notExpandAll">合并所有</el-dropdown-item>
                  <el-dropdown-item command="batchDelete">批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-row>
            <template v-if="this.currentNodeData">
              <el-tag  style=" width: 335px; ">
                当前操作对象： {{ this.currentNodeData.name}}  <i class="el-icon-info" style="margin-left: 30px;" @click="cancelChooseNode">  取消</i>
                </el-tag>
            </template>
            <template v-else>
              <el-tag  style=" width: 335px; ">当前操作对象： 请选择 </el-tag>
            </template>
            <el-input  placeholder="搜索节点"  prefix-icon="el-icon-search"   v-model="searchText"  size="medium"  style=" width: 335px; margin-top: 5px;"/>

            <!-- 权限树结构  自定义参数配置 1. node-key指定自定义的树结构ID的主键  2.:props="defaultProps 配置其他数据对象绑定 -->
            <el-tree style="margin-top: 10px"   :data="setTree"   :props="defaultProps"  node-key="companyId"  ref="treeObject"
                     :show-checkbox="useCheck" :default-expanded-keys="initCheckNode"
                     :filter-node-method="filterNode"  @node-contextmenu='rightClick'   @node-click="nodeClick"  >
          <span class="slot-t-node" slot-scope="{ node, data }">
             <span >
              <i :class="data.icon"></i>
              <span :class="[data.id ? 'slot-t-node--label' : '']">{{node.label}}</span>
            </span>
            <!--          <i :class="data.icon"></i>-->
          <span v-show="!node.isEdit">

<!--            <span v-show="!data.children || data.children.length == 0">-->
            <!--              <i class='' style='margin-right:10px'></i>-->
            <!--              <span :class="[data.id ? 'slot-t-node--label' : '']">{{node.label}}</span>-->
            <!--            </span>-->
          </span>
            <!-- 编辑输入框 -->
            <!--          <span v-show="node.isEdit">-->
            <!--            <el-input class="slot-t-input" size="mini" autofocus-->
            <!--                      v-model="data.name"-->
            <!--                      :ref="'slotTreeInput'+data.id"-->
            <!--                      @blur.stop="NodeBlur(node, data)"-->
            <!--                      @keyup.enter.native="NodeBlur(node, data)"></el-input>-->
            <!--          </span>-->
        </span>
            </el-tree>
          </div>

        </el-card>
        <!--树结构鼠标右键点击出现页面-->
        <div v-show="menuVisible" >
          <el-menu  id = "rightClickMenu"  class="el-menu-vertical"   @select="handleRightSelect"   active-text-color="#fff"  text-color="#fff" >
            <el-menu-item index="1" class="menuItem">
              <span slot="title">添加同级节点</span>
            </el-menu-item>
            <el-menu-item index="2" class="menuItem">
              <span slot="title">添加子级节点</span>
            </el-menu-item>
            <el-menu-item index="3" class="menuItem">
              <span slot="title">删除当前节点</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>

      <el-col :offset="2" :xs="8" :sm="14" :md="16" :lg="11" :xl="15" >
        <el-card class="box-card" >
          <div>
            <!-- 表单编辑按钮 -->
            <el-button  icon="el-icon-edit" size="mini" @click="handleRemoveFormDisable()" style="
                                                margin-bottom: 20px;
                                                margin-left: 25px;
                                            "/>

            <div style="">
              <!-- 表单 -->
              <el-form ref="companyForm" :model="companyForm" label-width="80px" size="mini" >
                <el-form-item label="父节点">
                  <el-input v-model="companyForm.parentId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                  <el-input v-model="companyForm.name" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="编号">
                  <el-input v-model="companyForm.code" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="类型" >
                  <el-radio-group v-model="companyForm.type" @change="formTypeChange" >
                    <el-radio label="1"  :disabled="disabledForm" >部门</el-radio>
                    <el-radio label="2"  :disabled="disabledForm" >组织</el-radio>
                    <el-radio label="0"  :disabled="disabledForm" >公司</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="排序号">
                  <el-input-number size="mini" :min="numberNum" v-model="companyForm.sortNumber" :disabled="readForm"></el-input-number>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="companyForm.email" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input v-model="companyForm.telephone" :readonly="readForm"></el-input>
                </el-form-item>
                <el-form-item label="信息描述">
                  <el-input type="textarea" v-model="companyForm.info" :readonly="readForm" style=" width: 300px;" ></el-input>
                </el-form-item>
                <el-form-item>
                  <div v-show="showSubmitButton" >
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="restForm">重置</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  import {getTreeList,add,update,remove,batchRemove} from "@/api/base/company";
  export default {

    // 公司管理
    components: { ElCol },

    watch: {
      searchText(val) {
        this.$refs.treeObject.filter(val);
      }
    },
    data() {
      return {
        staticType:{
          company : "0",
          department:"1",
          group:"2",
        },
        tempForm: null, //修改前重置按钮用的数据
        readForm: true, //控制表单只读
        disabledForm: true, //控制表单禁用状态
        menuShow: true, //控制表单展示权限还是菜单
        showSubmitButton:false, //右侧提交 重置按钮显示隐藏
        currentNodeObject: null,
        currentNodeData: null,
        currentNodeParentObject: null,
        currentNodeParentData: null,
        dialogFormVisible: false,
        dialogClassifyVisible: false,
        numberNum: 1,
        initCheckNode: [],// 默认展开节点
        setTree: [],  //全部后台树结构数据绑定对象
        useCheck:false,
        defaultProps: {//绑定树结构映射基础参数
          label: 'name',
          children: 'children'
        },
        searchText: '',
        input: "",
        input2: "",
        editObj: {},
        menuVisible: false, //树结构右键 显示框 v-show
        objectID: null,
        companyForm: {
          parentId: "",
          companyId: "",
          name: "",
          type: "0",
          icon: "",
          telephone:"",
          sortNumber: 99,
          email:"",
          info:"",
          code: "",
        },
      };
    },
    methods: {
      /*
      * 查询菜单树结构
      */
      doQuery(chooseId) {
        getTreeList()
          .then(res => {
            let resp = res.data;
            this.setTree = resp.data;
            if (chooseId){
              this.initChooseNode(chooseId);
            }
          })
      },

      /*
      *  提交表单修改树几点
      */
      onSubmit() {
        if (this.companyForm.companyId){
          update(this.companyForm).then(res => {
            let resp  = res.data;
            this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
            if(resp.code===200) {
              this.doQuery(this.companyForm.companyId);
              this.showSubmitButton =false;
            }
          })
        }else {
          add(this.companyForm).then(res => {
            let resp  = res.data;
            this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
            if(resp.code===200) {
              this.doQuery(resp.data);
              this.showSubmitButton =false;
            }
          })
        }
      },

      /*
      * 树结构搜索过滤器
      */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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

        // deleteNewChild 方法删除还没有入库 没有id的节点
        let deleteNewChildNotInDataDB = () => {
          let _list = n.parent.data.children || n.parent.data;//节点同级数据
          let _index = _list.map((c) => c.id).indexOf(d.id);
          console.log(_index)
          _list.splice(_index, 1);
          this.$message.success("删除成功！")
        }
        if(this.currentNodeData.children && this.currentNodeData.children.length !== 0){
          this.$message.error("此节点有子级，不可删除！");
          return false;
        }else{
          let tempDeleteNode =  this.currentNodeData; // 弹出框莫名其妙数据丢失
          this.$confirm(
            `本次操作将删除[ ${this.currentNodeData.name} ]节点对象，您确认删除吗？`, {
              type: 'warning'
            }
          ).then(() => {
            if (tempDeleteNode.companyId){
              remove({id: tempDeleteNode.companyId})
                .then(res => {
                  let resp = res.data;
                  if (resp.code === 200) {
                    this.$message.success('删除成功!');
                    this.doQuery();
                  } else {getTreeList
                    this.$message.success(resp.msg);
                  }
                })
            }else {
              deleteNewChildNotInDataDB()
            }

          }).catch(() => {
          });
        }
      },

      /*
      * 右键点击触发菜单
      *  object 当前节点数据
      *  value 当前html对象
      */
      rightClick(event, object, value, element) {

        if (this.objectID !== object.companyId) {
          this.objectID = object.companyId;
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
        menu.style.top = event.clientY - 30 - 60 + "px";

        menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
        menu.style.width = 130 + "px"; //设置右键菜单的宽度

      },

      /*
      *  添加子节点
      *  n 当前操作节点包含html对象
      *  d 当前操作节点纯对象
      */
      addChildNode(){
        if (this.currentNodeObject==null){
          this.$message.error("请选择一个操作节点！");
        }
        let nowIcon = "";
        let thisType = "";
        //获取父级的层级
        let level = this.currentNodeObject.parent.level;
        if (level===0){
          thisType = this.staticType.department;
          nowIcon = 'fa fa-sitemap'
        }else {
          thisType = this.staticType.group;
          nowIcon = 'fa fa-user-md'
        }
        //新增数据
        let childData = {
          name: '新增子节点',
          parentId: this.currentNodeData.companyId,
          icon: nowIcon,
          type: thisType,
          sortNumber: 99,
          children: []
        };
        this.currentNodeData.children.push(childData);
        this.disabledForm = false;
        this.readForm = false;
        this.companyForm = childData;
        //同时展开节点
        this.onSubmit();
        if(!this.currentNodeObject.expanded){
          this.currentNodeObject.expanded = true
        }
      },

      /*
      *  添加同级节点
      *  object 当前操作节点包含html对象
      *  nodeData 当前操作节点纯对象
      */
      addSameNode(){
        let nowIcon = '';
        let thisType =this.currentNodeData.type;
        if (thisType==="0"){
          nowIcon = 'fa fa-building'
        }else if (thisType==="1"){
          nowIcon = 'fa fa-sitemap'
        }else if (thisType==="2"){
          nowIcon = 'fa fa-user-md'
        }
        let childData = {
          parentId: this.currentNodeData.parentId,
          name: '新增节点',
          icon: nowIcon,
          type: thisType,
          sortNumber: 99,
          children: []
        };
        this.$refs.treeObject.insertAfter( childData,this.currentNodeData.companyId);
        this.companyForm = childData;
        this.disabledForm = false;
        this.readForm = false;
        this.onSubmit();
        //同时展开节点
        if(!this.currentNodeData.expanded){
          this.currentNodeData.expanded = true
        }
      },

      /*
      * 菜单激活回调
      */
      handleRightSelect(key) {
        if (key === "1") {
          this.addSameNode(this.currentNodeObject, this.currentNodeData);
          this.menuVisible = false;
        }
        else if (key === "2") {
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

      /*
      *  左键单击菜单树结构，
      *  1.控制表单的展示类型
      *  2.恢复默认只读和禁用状态
      */
      nodeClick(object, value){
        this.currentNodeObject =  value ;
        this.currentNodeData = object;
        this.currentNodeParentObject =  value.parent;
        this.currentNodeParentData = value.parent.data;
        this.disabledForm = true;
        this.readForm = true;
        this.companyForm = this.$refs.treeObject.getCurrentNode();
        this.tempForm =  JSON.parse(JSON.stringify(this.companyForm));
        this.showSubmitButton= false;
        // if ( this.companyForm.type===1){
        //   // 1为菜单权限
        //   this.menuShow = true;
        // }else {
        //   // 0为菜单权限
        //   this.menuShow = false;
        // }
      },

      /*
      *  单击表单的类型单选按钮
      *  动态改变表单显示类型
      */
      formTypeChange(val){
        if (val==="0"){
          this.companyForm.icon = 'fa fa-building';
        }else if (val==="1"){
          this.companyForm.icon = 'fa fa-sitemap';
        }else if (val==="2"){
          this.companyForm.icon = 'fa fa-user-md';
        }
      },

      batchDelete() {
        let list = this.$refs.treeObject.getCheckedNodes();
        if (list.length===0){
          this.$message.warning("请勾选操作对象！");
          return false;
        }
        let deleteNames,deleteIds;
        let submitData = new FormData();
        for (let i = 0; i < list.length; i++) {
          if (i===0){
            deleteNames = list[i].name;
            deleteIds = list[i].companyId;
          }else {
            deleteNames += ","+list[i].name;
            deleteIds +=  ","+list[i].companyId;
          }
        }
        this.$confirm(  `本次操作将删除[${ deleteNames }]节点,删除将不可恢复，您确认删除吗？`, {
          type: 'warning'
        }  ).then(() => {
          submitData.append("ids",deleteIds);
          batchRemove(submitData)
            .then(res => {
              let resp = res.data;
              if (resp.code === 200) {
                this.$message.success('删除成功!');
                this.doQuery();
              } else {
                this.$message.error(resp.msg);
              }
            })
        })

      },

      /*
      *  重置表单到加载时的值
      */
      restForm(){
        if (this.tempForm){
          this.companyForm =  this.tempForm;
          this.tempForm =  JSON.parse(JSON.stringify( this.companyForm));
        }
      },

      /*
      *  点击右侧表单上方编辑按钮 解除编辑表单的禁用
      */
      handleRemoveFormDisable(){
        if (!this.companyForm['companyId']){
          this.$message.error("请选择一个节点！");
          return
        }
        this.readForm = false;
        this.disabledForm = false;
        this.showSubmitButton = true;
      },

      initChooseNode(lastNodeId){
        this.initCheckNode = [];
        this.initCheckNode = [ lastNodeId ]
      },

      /*
      *  左侧树结构 多功能菜单功能
      */
      handleCommand(command) {
        if (command==="changCheckStatus"){
          this.useCheck = !this.useCheck
        }else if (command==="chooseAll"){
          if (this.useCheck){
            this.$refs.treeObject.setCheckedNodes(this.setTree);
          }else {
            this.$message({message: "请先开启复选框！",type:  "error"});
          }
        }else if (command==="notChooseAll"){
          if (this.useCheck){
            this.$refs.treeObject.setCheckedKeys([]);
          }
          else {
            this.$message({message: "请先开启复选框！",type:  "error"});
          }
        }else if (command==="expandAll"){
          for(let i=0;i<this.$refs.treeObject.store._getAllNodes().length;i++){
            this.$refs.treeObject.store._getAllNodes()[i].expanded=true;
          }
        }else if (command==="notExpandAll"){
          for(let i=0;i<this.$refs.treeObject.store._getAllNodes().length;i++){
            this.$refs.treeObject.store._getAllNodes()[i].expanded=false;
          }
        }else if (command==="batchDelete"){
          if (this.useCheck){
            this.batchDelete();
          }else {
            this.$message({message: "请先开启复选框！",type:  "error"});
          }
        }
      },

      /*
      *  取消选中的树节点
      */
      cancelChooseNode(){
        this.companyForm = {};
        this.currentNodeData = [];
        this.currentNodeData['name'] = "请选择";
        this.showSubmitButton = false;
        //清空复选框的值
        this.$refs.treeObject.setCheckedKeys([]);
      },

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
   .iconMenuTool{
    width: 300px;
  }


</style>

