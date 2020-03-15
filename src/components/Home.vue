<template>
  <!-- <el-container>：外层容器。-->
  <el-container class="home-container" >
    <!-- 头部容器  <el-header>：顶栏容器-->
    <el-header style="text-align: right; font-size: 12px">
      <span>你好！王小虎</span>
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </el-header>

    <el-container>
      <!--左侧菜单  <el-aside>：侧边栏容器。-->
      <el-aside width="200px"  style="background-color: rgb(238, 241, 246)">
        <!--开启路由跳转 -->
        <el-menu :default-openeds="['1']" :router="true">

          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>系统管理</template>
            <el-menu-item-group>
              <el-menu-item index="/userPage">用户管理</el-menu-item>
              <el-menu-item index="1-2">角色管理</el-menu-item>
              <el-menu-item index="1—3">权限管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!--右侧主要内容区域-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {}
    }
  };
</script>

<style>
  .home-container {
    /*
    * 整个容器高度
    */
    height: 100%;
  }
  .el-main {
    background-color: #eaedf1;
  }

  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    background-color: #409EFF;
    height: 100%;
  }
  .el-menu{
    border-right: none;
  }
</style>


