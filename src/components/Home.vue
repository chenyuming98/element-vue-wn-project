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
      <el-aside   :width="isCollapse?'64px':'200px'" style="background-color: rgb(238, 241, 246)">
        <!--开启路由跳转 -->

        <el-menu  style="min-height: 100%" :router="true" :unique-opened="true" :collapse="isCollapse" :default-active = "activePath">
          <div class="toggle-button" @click="toggleCollapse" style="text-align: center">|||</div>
            <template v-for="item in menuDataList">
              <el-submenu :index="item.permissionId" v-if="item.children">
                <template slot="title" >
                  <i :class="item.icon"/>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <template v-for="item2 in item.children">
                    <el-menu-item :index="item2.href">
                      <i :class="item2.icon"/>
                      <span>{{item2.title}}</span>
                    </el-menu-item>
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
        isCollapse: false,
        menuDataList: null,
        activePath: "",
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

      // 点击按钮，切换菜单的折叠与展开
      toggleCollapse () {
        this.isCollapse = !this.isCollapse
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

  /*.el-aside {*/
  /*  background-color: #409EFF;*/
  /*  height: 100%;*/
  /*}*/

  /*菜单折叠按钮样式*/
  .toggle-button {
    background-color: #c1c1c1;
    font-size: 10px;
    line-height: 24px;
    color: #9095b7;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }


</style>


