import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'; // cookie.js


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/Index/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/manage',
  //   component: Layout,
  //   redirect: '/manage/home',
  //   children: [{
  //     path: 'home',
  //     name: 'home',
  //     component: () => import('@/views/Index/index'),
  //     meta: { title: '首页', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
]

const router = new Router({
  mode: 'history', // require service support
  base: process.env.BASE_URL,
  routes: constantRoutes
})

// // 路由全局守卫
router.beforeEach((to, from, next) => {
  let token = Cookie.get("adminToken");
  if(token) {
    if (to.path === '/login') {
      next({path: '/'})
    }
    next();
  } else {
    if(to.path !== "/login") { // 没有登录，它想访问其它页面，让它到达登录页面
      sessionStorage.removeItem('vuex');
      next({path: "/login"});
    } else { // 没有登录，但是人家去访问Login，则放行
      next();
    }
  }
});

export default router
