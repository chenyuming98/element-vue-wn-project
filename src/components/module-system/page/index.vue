<template>
  <el-table
    :data="userTable"
    style="width: 100%">
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
  </el-table>
</template>

<script>
    export default {
        name: "userIndex",
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
            },]
          }
      }
    }
</script>

<style scoped>

</style>
