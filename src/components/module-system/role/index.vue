<template>

  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--表头菜单-->
      <div class="tableHeaderToolButtonGroup">
        <el-button icon="el-icon-plus" size="mini"  @click="handleAdd" ></el-button>
        <el-button  icon="el-icon-edit" size="mini" ></el-button>
        <el-button  icon="el-icon-delete" size="mini"   @click="batchDelete" ></el-button>
      </div>
    </el-card>
    <el-card class="tableCard" >
      <!--表格内容  ref绑定选中内容-->
      <el-table :data="dataList"  style="width: 100%" border  ref="multipleTable" >
        <el-table-column type="selection" width="40" prop="roleId"> </el-table-column>
        <el-table-column  prop="roleName"  label="角色名称"  width="180"> </el-table-column>
        <el-table-column  prop="description"  label="描述"  > </el-table-column>

        <el-table-column  fixed="right"  label="操作"  width="180">
          <template slot-scope="scope">
            <el-button @click="handleRowDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleRowEdit(scope.row)"   type="text" size="small">编辑</el-button>
            <el-button @click="handleRowDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格分页-->
      <div class="block">
        <!-- current-page 当前页数  每页显示数-->
        <div class="tablePagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="requestParameters.page"
            :page-size="requestParameters.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>

    </el-card>

    <!--2. 添加编辑表单  -->
    <el-dialog :title="formTitle"  :visible.sync="dialogFormVisible" :before-close="cancel" :close-on-click-modal="false" :width="'40%'">
      <!-- :model绑定表单对象  status-icon控制每一行表单校验通过后图标显示正确和错误   :rules绑定校验规则  autocomplete="off" 关闭表单默认以及功能-->
      <el-form :model="formBase" status-icon :rules="rules" ref="refForm" label-width="120px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="formBase.roleName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description" >
          <el-input v-model="formBase.description" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <!--        <el-button @click="resetForm('refForm')">重置</el-button>-->
      </div>
    </el-dialog>
  </div>

</template>
<!--主页面板-->
<script>
  import {list,add,update,remove,batchRemove} from "@/api/base/role"

  const  multipleSelectionList =  new Set([]);
    export default {

      data() {
        return {
          roleAdd: 'UserAdd',
          dataList: [],
          multipleSelection: multipleSelectionList,
          total: 0,
          requestParameters: {
            page: 1,
            size: 10,
          },

          //定义弹框绑定显示状态
          dialogFormVisible: false,
          formTitle : '添加',
          //定义表单初始化参数
          formBase: {
            roleId: '',
            roleName: '',
            description: '',
          },
          //v-model 绑定校验规则
          rules: {
            roleName: [
              {required: true, message: '请输入角色名称', trigger: 'blur'},
              {min: 2, max: 11, message: '角色名称长度在 2 到 11 个字符', trigger: 'blur'}
            ],
          },
        }
      },

      methods: {

        /*
        * 查询表格
        */
        doQuery(params) {
          list(this.requestParameters)
            .then(res => {
              let resp = res.data;
              this.dataList = resp.data;
              this.total = resp.total;

            })
        },

        /*
        *改变每页显示数
        */
        handleSizeChange(val) {
          this.requestParameters.size = val;
          this.doQuery()
        },

        /*
        *改变当前页码数
       */
        handleCurrentChange(val) {
          this.requestParameters.page = val;
          this.doQuery()
        },



        /**
         * 添加新员工
         */
        handleAdd() {
          // this.$refs.addUser.dialogFormVisible = true
          this.formBase = {
            formRoleId: '',
            roleName: '',
            description: '',
          };
          this.formTitle = "添加";
          this.dialogFormVisible = true
        },

        /**
         * 表格行编辑
         */
        handleRowEdit(rowData){
          this.dialogFormVisible = true;
          this.formTitle = "编辑";
          this.formBase = {
            roleId: rowData.roleId,
            roleName: rowData.roleName,
            description: rowData.description,
          };
        },

        /**
         * 表格行删除员工
         */
        handleRowDelete(rowData) {
          this.$confirm(
            `本次操作将删除${rowData.roleName}删除后角色将不可恢复，您确认删除吗？`, {
              type: 'warning'
            }
          ).then(() => {
            remove({id: rowData.roleId})
              .then(res => {
                let resp = res.data;
                if (resp.code === 200) {
                  this.$message.success('删除成功!');
                  this.doQuery();
                } else {
                  this.$message.success(resp.msg);
                }
              })
          })
        },

        /**
         *  表头批量删除员工
         */
        batchDelete() {
          let list = this.$refs.multipleTable.selection;
          if (list.length===0){
            this.$message.warning("请勾选操作对象！");
            return false;
          }
          let deleteNames,deleteIds;
          let submitData = new FormData();
          for (let i = 0; i < list.length; i++) {
            if (i===0){
              deleteNames = list[i].roleName;
              deleteIds = list[i].roleId;
            }else {
              deleteNames += ","+list[i].roleName;
              deleteIds +=  ","+list[i].roleId;
            }
          }
          this.$confirm(  `本次操作将删除[${ deleteNames }],删除后角色将不可恢复，您确认删除吗？`, {
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

        /**
         * 表单取消对话框事件
         */
        cancel() {
          this.dialogFormVisible = false;
          this.$refs['refForm'].resetFields();
        },

        /**
         * 提交表单
         */
        submitForm(){
          this.$refs['refForm'].validate((valid) => {
            if (valid) {
              if (this.formBase.roleId){
                update(this.formBase).then(res => {
                  let resp  = res.data;
                  this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
                  if(resp.code===200) {
                    this.dialogFormVisible = false;
                    this.$refs['refForm'].resetFields();
                    this.doQuery();
                  }
                })
              }else {
                add(this.formBase).then(res => {
                  let resp  = res.data;
                  this.$message({message:resp.msg,type:resp.code===200?"success":"error"});
                  if(resp.code===200) {
                    this.dialogFormVisible = false;
                    this.$refs['refForm'].resetFields();
                    this.doQuery();
                  }
                })
              }
            } else {
              return false;
            }
          });

        },

        // resetForm(formName) {
        //   this.$nextTick(() => {
        //     this.$refs[formName].resetFields();
        //   })
        // },
      },
      // 创建完毕状态
      created: function () {
        this.doQuery()
      }
    }
</script>

<style scoped>
  .el-input{
    width: 300px;
  }
</style>
