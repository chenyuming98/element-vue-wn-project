import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import homePage from '../components/module-home/home.vue'
import userPage from '../components/module-system/user/index.vue'
import rolePage from '../components/module-system/role/index.vue'
import permPage from '../components/module-system/permission/index.vue'
import dictionaryPage from '../components/module-system/dictionary/index.vue'
import companyPage from '../components/module-company/company/index.vue'
import employeePage from '../components/module-company/employee/index.vue'

Vue.use(VueRouter);

const routes = [
  // { path: '/', redirect:'/login'},
  { path: '/', redirect:'/index'},
  { path: '/login' , component: Login},
  { path: '/index' , component: Index,redirect:'/homepage'
    ,children:[
      { path: '/homepage',component: homePage},
      { path: '/userpage',component: userPage},
      { path: '/rolepage',component: rolePage},
      { path: '/permpage',component: permPage},
      { path: '/companypage',component: companyPage},
      { path: '/dictionarypage',component: dictionaryPage},
      { path: '/employee',component: employeePage},
    ]},
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
