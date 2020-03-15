<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        :formatter="formatterRoles"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userStatus"
        label="状态">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--主页面板-->
<script>
    export default {
      data() {
        return {
            userList:[],
        }
      },
      created(){
        this.getUserList()
      },
      methods: {
        async getUserList() {
          const {data: res} = await this.$http.get('/system/user')
          if (res.code !== 200) return this.$message.error(res.msg)
          this.userList = res.data;
          // this.total = res.count;
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
      }
    }
</script>

<style scoped>

</style>
