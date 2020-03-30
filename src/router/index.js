import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Index from '../components/Index.vue'
import UserPage from '../components/module-system/user/index.vue'
import rolePage from '../components/module-system/role/index.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect:'/login'},
  { path: '/login' , component: Login},
  { path: '/home' , component: Home,redirect:'/index'
    ,children:[
      { path: '/index',component: Index},
      { path: '/userPage',component: UserPage},
      { path: '/rolePage',component: rolePage},
    ]},
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
