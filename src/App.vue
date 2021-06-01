<template>
  <!-- <el-container>：外层容器。-->
  <el-container class="home-container" >   <!-- 头部容器  <el-header>：顶栏容器-->
    <el-header style="text-align: right; font-size: 12px;" height="60px">

      <div class="app-breadcrumb">
        管理系统
      </div>
      <el-button  style="float: left;margin-top: 10px;"  icon="fa fa-outdent"  @click="toggleCollapse"  ></el-button>

      <!--        <el-popover  trigger="click" placement="bottom-end" class="el-icon-message-solid" style="margin-right: 15px">-->
      <!--          <el-button >hover 激活</el-button>-->
      <!--        </el-popover>-->

      <el-popover
        trigger="click"
        placement="bottom-end"
        width="250">
        <el-tabs v-model="activeName"  >
          <el-tab-pane :label="mTitle" name="first">
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
            <el-button style="width: 250px;" round size="mini" @click="">查看更多</el-button>
          </el-tab-pane>
          <el-tab-pane :label="sTitle" name="second">
            <div v-for="o in 15" :key="o" class="text item">
              {{'系统列表内容 ' + o }}
            </div>
            <el-button style="width: 250px;" round size="mini" @click="">查看更多</el-button>
          </el-tab-pane>
        </el-tabs>
        <el-button   icon="el-icon-message-solid" slot="reference"></el-button>
        <!--          <i class="el-icon-message-solid"  slot="reference"></i>-->
      </el-popover>

      <span> 你好！ {{this.username}}</span>
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item > <span @click="logout"> 退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <!--左侧菜单  <el-aside>：侧边栏容器。  ：width根据是否是折叠菜单 动态显示宽度-->
      <el-aside  :width="isCollapse?'68px':'200px'" style="background-color: rgb(238, 241, 246)" >
        <!-- 开:router启路由跳转会以index为跳转连接路径 index使用不能重复不然会引起BUG
    collapse为true开启折叠菜单   min-height设置菜单的高度  @select="handleSelect" -->
        <el-menu  style="min-height: 100%" :router="true" :unique-opened="true"
                  :collapse="isCollapse" :default-active = "activePath"   :default-openeds = "firstOpenMenuItem">
          <!--                  <div class="toggle-button" style="text-align: center">LOG</div>-->
          <template v-for="item in menuDataList">
            <el-submenu :index="item.permissionId" v-if="item.children.length>0" >
              <template slot="title" >
                <i :class="item.icon"/>
                <span >{{item.title}}</span>
              </template>
              <el-menu-item-group v-if="item.children">
                <template v-for="item2 in item.children">
                  <el-menu-item   :index="item2.href">
                    <i :class="item2.icon"/>
                    <span >{{item2.title}}</span>
                    <router-link :to="item2.href"></router-link>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.href" v-else>
              <i :class="item.icon" />
              <span >{{item.title}}</span>
            </el-menu-item>
            <el-divider ></el-divider>
          </template>
        </el-menu>
      </el-aside>
      <!--右侧主要内容区域-->
      <el-main >
        <router-view />
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
        editableTabsValue: '2',
        editableTabs: [],
        // editableTabs: [{
        //   title: 'Tab 1',
        //   name: '1',
        //   content: 'Tab 1 content'
        // }, {
        //   title: 'Tab 2',
        //   name: '2',
        //   content: 'Tab 2 content'
        // }],
        tabIndex: 2,
        path:"ws://127.0.0.1:9001/websocket/",
        socket:"",
        activeName: 'first',
        mTitle: '通知',
        sTitle: '系统通知',
      }
    },

    mounted () {
      // 初始化
      this.websocketInit()
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

      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: targetName,
          name: newTabName,
          content: ''
        });
        this.editableTabsValue = newTabName;
      },

      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      /*
      * 退出登录
      */
      logout(){
        window.localStorage.clear();
        this.$router.push({ path: '/login' })
      },

      //websocket 初始化
      websocketInit: function () {
        if(typeof(WebSocket) === "undefined"){
          alert("您的浏览器不支持socket")
        }else{
          // 实例化socket
          this.accessToken = window.localStorage.getItem("accessToken");
          this.accessToken = this.accessToken.substring(7);
          let wsUrl = this.path + this.accessToken;
          this.socket = new WebSocket(wsUrl);
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;

        }
      },

      // 前端收到服务器消息
      getMessage(e){
        console.log(e.data);
        let mData = JSON.parse(e.data);//将json字符串转换成json对象
        let mTitleNew = "通知";
        let mCount = mData.mTitleSize;
        this.mTitle = mTitleNew + "(" + mCount  + ")";

        let sTitleNew = "系统通知";
        let sCount = mData.sTitleSize;
        this.sTitle = sTitleNew + "(" + sCount  + ")";

      },

    },

    // 创建完毕状态
    created: function () {
      this.username = window.localStorage.getItem("username");
      this.doQuery()
    },

    destroyed () {
      // 销毁监听
      this.socket.onclose = this.close
    },

    addTab(targetName) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  };
</script>

<style lang="scss">
  /*.home-container {*/
  /*  !**/
  /*  * 整个容器高度*/
  /*  *!*/
  /*  height: 100%;*/
  /*}*/

  /*.el-main {*/
  /*  background-color: #eaedf1;*/
  /*}*/

  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    background-color: #409EFF;
    height: 100%;
  }

  /*!*菜单折叠按钮样式*!*/
  /*.toggle-button {*/
  /*  background-color: #409EFF;*/
  /*  font-size: 10px;*/
  /*  line-height: 40px;*/
  /*  color: #2b2b2b;*/
  /*  text-align: center;*/
  /*  letter-spacing: 0.2em;*/
  /*  cursor: pointer;*/
  /*}*/

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-divider{
    margin-top:0px;margin-bottom: 0px;
  }
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    margin-right: 750px;
  }

</style>



<!--<style lang="scss">-->
<!--  /*html,*/-->
<!--  /*body {*/-->
<!--  /*  margin: 0;*/-->
<!--  /*  width: 100%;*/-->
<!--  /*  height: 100%;*/-->
<!--  /*}*/-->
<!--  /*#app {*/-->
<!--  /*  font-family: Avenir, Helvetica, Arial, sans-serif;*/-->
<!--  /*  -webkit-font-smoothing: antialiased;*/-->
<!--  /*  -moz-osx-font-smoothing: grayscale;*/-->
<!--  /*  color: #2c3e50;*/-->
<!--  /*  display: flex;*/-->
<!--  /*  width: 100%;*/-->
<!--  /*  height: 100%;*/-->
<!--  /*  overflow: hidden;*/-->
<!--  /*}*/-->

<!--  .router-tab {-->
<!--    flex: 1 1 0px;-->

<!--    &-page {-->
<!--      padding: 20px 15px;-->
<!--    }-->
<!--  }-->

<!--  // 移动端尺寸-->
<!--  $smallScreen: 767.98px;-->

<!--  // 移动端样式-->
<!--  @media screen and (max-width: $smallScreen) {-->
<!--    #app {-->
<!--      flex-direction: column;-->
<!--    }-->
<!--    #nav {-->
<!--      padding: 0 15px;-->
<!--      width: 100%;-->
<!--      height: 40px;-->
<!--      line-height: 40px;-->
<!--      white-space: nowrap;-->
<!--      overflow: auto;-->

<!--      a {-->
<!--        margin: 0 1em;-->
<!--        display: inline-block;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
