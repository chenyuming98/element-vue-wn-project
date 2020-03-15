<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="userTable"
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
            userTable: [{
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2022',
              role: '超级管理员'
            },{
              userStatus: '冻结',
              userName: 'wnn2023',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            },{
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2022',
              role: '超级管理员'
            },{
              userStatus: '冻结',
              userName: 'wnn2023',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            },{
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2022',
              role: '超级管理员'
            },{
              userStatus: '冻结',
              userName: 'wnn2023',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            },{
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2022',
              role: '超级管理员'
            },{
              userStatus: '冻结',
              userName: 'wnn2023',
              role: '超级管理员'
            }, {
              userStatus: '正常',
              userName: 'wnn2020',
              role: '超级管理员'
            },]
          }
      }
    }
</script>

<style scoped>

</style>
