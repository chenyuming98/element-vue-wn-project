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
        <el-menu :router="true">
            <template v-for="item in menuDataList">
              <el-submenu :index="item.href" v-if="item.children">
                <template slot="title" ><i :class="item.icon"/>{{item.title}}</template>
                <el-menu-item-group>
                  <template v-for="item2 in item.children">
                      <el-menu-item :index="item2.href"><i :class="item2.icon"/>{{item2.title}}</el-menu-item>
                  </template>
                </el-menu-item-group>
              </el-submenu>
            </template>
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
  import {getMenuList} from "@/api/base/permission";
  export default {
    data() {
      return {
        menuDataList: null,
      }
    },
    methods: {
      /*
      * 查询菜单树结构
      */
      doQuery() {
        getMenuList()
          .then(res => {
            let resp = res.data;
            this.menuDataList = resp.data;
          })
      },
    },
    // 创建完毕状态
    created: function () {
      this.doQuery()
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

</style>


