<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="dataList"
      style="width: 100%" border>
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        :formatter="formatterRoles"
        width="250">
      </el-table-column>
      <el-table-column
        prop="userStatus"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.userStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value= 0
            :inactive-value=  1
            @change="handleStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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

  </div>
</template>

<!--主页面板-->
<script>
  import {list,remove} from "@/api/base/users"
    export default {
      data() {
        return {
          dataList: [],
          total: '',
          requestParameters: {
            page: 1,
            size: 10,
          },
        }
      },
      methods: {
        // 列表查询
        doQuery(params) {
          list(this.requestParameters)
            .then(res => {
              let resp  = res.data;
              this.dataList  = resp.data;
              this.total  = resp.total;

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
        formatterRoles(row, column) {
          let roles = row['roles'];
          let rolesNames = '';
          if(roles!=undefined){
            $.each(roles, function (index, val) { //index是数组对象索引，val是对象
              if (index === 0) {
                rolesNames = val.roleName;
              } else {
                rolesNames = rolesNames + ',' + val.roleName;
              }
            });
          }
          return rolesNames;
        },
        handleDelete(item) {
          this.$confirm(
            `本次操作将删除${item.username}删除后账号将不可恢复，您确认删除吗？`,{
              type: 'warning'
            }
          ).then(() => {
            remove({ id: item.userId })
              .then(res => {
                let resp  = res.data;
                if (resp.code===200){
                  this.$message.success('删除成功!');
                  this.doQuery();
                }else {
                  this.$message.success(resp.msg);
                }
              })
          })
        },
      },
      // 创建完毕状态
      created: function() {
        this.doQuery()
      },

    }
</script>

<style scoped>

</style>
