<template>
  <!-- <el-container>：外层容器。-->
  <el-container class="home-container" >
    <!--左侧菜单  <el-aside>：侧边栏容器。  ：width根据是否是折叠菜单 动态显示宽度-->
    <el-aside   :width="isCollapse?'68px':'200px'" style="background-color: rgb(238, 241, 246)">
      <!-- 开:router启路由跳转会以index为跳转连接路径 index使用不能重复不然会引起BUG
          collapse为true开启折叠菜单   min-height设置菜单的高度 -->
      <el-menu  style="min-height: 100%" :router="true" :unique-opened="true"
                :collapse="isCollapse" :default-active = "activePath"   :default-openeds = "firstOpenMenuItem">
        <div class="toggle-button" @click="toggleCollapse" style="text-align: center">|||</div>
        <template v-for="item in menuDataList">
          <el-submenu :index="item.permissionId" v-if="item.children.length>0" >
            <template slot="title" >
              <i :class="item.icon"/>
              <span >{{item.title}}</span>
            </template>
            <el-menu-item-group v-if="item.children">
              <template v-for="item2 in item.children">
                <el-menu-item :index="item2.href">
                  <i :class="item2.icon"/>
                  <span>{{item2.title}}</span>
                </el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item :index="item.href" v-else>
              <i :class="item.icon" />
              <span >{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 头部容器  <el-header>：顶栏容器-->
      <el-header style="text-align: right; font-size: 12px" >
        <span>你好！ 管理员</span>
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-header>

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
        activePath: "notActivePath",
        firstOpenMenuItem: [], //初次打开展开菜单栏

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
            for (let i = 0; i < this.menuDataList.length; i++) {
                if (this.menuDataList[i]['spread']==1){
                  this.firstOpenMenuItem.push(this.menuDataList[i]['permissionId']);
                }
            }
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


