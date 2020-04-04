import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Index from '../components/Index.vue'
import userPage from '../components/module-system/user/index.vue'
import rolePage from '../components/module-system/role/index.vue'
import permPage from '../components/module-system/permission/index.vue'
import companyPage from '../components/module-company/company/index.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect:'/login'},
  { path: '/login' , component: Login},
  { path: '/home' , component: Home,redirect:'/index'
    ,children:[
      { path: '/index',component: Index},
      { path: '/userpage',component: userPage},
      { path: '/rolepage',component: rolePage},
      { path: '/permpage',component: permPage},
      { path: '/companypage',component: companyPage},
    ]},
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
