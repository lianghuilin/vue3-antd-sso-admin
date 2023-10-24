import UserLayout from '@/layout/UserLayout'
import defaultRouter from '@/configure/defaultRouter'
import type { Route } from '@/router/generate-typing'
// import LoginCallBack from '@/views/login/LoginCallBack.vue'

interface defineRoute extends Route { sort?: number; }

export const baseRoutes: defineRoute[] = defaultRouter.constantRoutes // 基础路由
export const menuRoutes: defineRoute[] = defaultRouter.rootRoute.children // 菜单路由

baseRoutes.push(
  {
    path: '/index',
    name: 'index',
    redirect: '/system/OrganizeManage'
  },
  // {
  //   path: '/loginCallback',
  //   // redirect: '/login/loginCallback',
  //   component: UserLayout,
  //   children: [
  //     {
  //       path: 'LoginCallback',
  //       name: 'LoginCallback',
  //       component: () => import(`@/views/login/LoginCallback.vue`),
  //       meta: { title: '系统授权' }
  //     }
  //   ]
  // },
  {
    path: '/login',
    // redirect: '/login/Login',
    component: UserLayout,
    children: [
      {
        path: 'Login',
        name: 'Login',
        component: () => import(`@/views/login/Login.vue`),
        meta: { title: '系统登录' }
      },
      {
        path: 'LoginCallback',
        name: 'LoginCallback',
        component: () => import(`@/views/login/LoginCallback.vue`),
        meta: { title: '系统授权' }
      }
    ]
  }
)
