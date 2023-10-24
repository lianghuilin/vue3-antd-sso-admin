import router from '@/router'
import useAppStore from '@/store/app'
import useUserStore from '@/store/user'
import useRouterStore from '@/store/router'
import routerComponents from '@/router.dynamic'
import Notification from 'ant-design-vue/es/notification'
import NProgress from 'nprogress'
import { getSSOTicket } from '@/api/auth'

/**
 * 进度配置
 */
NProgress.configure({ showSpinner: false })

/**
 * 路由配置
 */
const indexRoutePath = '/index'
const loginRoutePath = '/login/Login'
const loginCallbackRoutePath = '/login/LoginCallback'
const whiteRouteList = ['/login/Login', '/login/LoginCallback']

/**
 * 路由处理
 */
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  console.log(to, from)

  const localToken = localStorage.getItem('SSO-TOKEN')
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  const urlTicket = getSSOTicket()

  const token = userStore.token
  const userRole = userStore.userRole

  if (!token && localToken) {
    userStore.setToken(localToken)
    return next()
  }

  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: indexRoutePath })
      return
    }

    console.log('51', JSON.stringify(userRole))
    if (!userRole.permissions || userRole.permissions.length === 0) {
      try {
        await userStore.getUserInfo()
        await routerStore.generateRouter({}, routerComponents)

        console.log('56', router.getRoutes())
        const dynamicRoutes = toRaw(routerStore.dynamicRoutes)
        console.log(61, dynamicRoutes)
        const visitRedirect = from.query.redirect || to.path
        const pathRedirect = typeof visitRedirect === 'string'
          ? decodeURIComponent(visitRedirect)
          : ''

        for (const route of dynamicRoutes) {
          router.addRoute(route as any)
        }
        console.log('68', router.getRoutes())

        console.log('70', to, pathRedirect)
        to.path === pathRedirect
          ? next({ ...to, replace: true })
          : next({ path: pathRedirect })
      } catch (e) {
        console.error('router error', e)
        await new Promise(() => {
          Notification.error({
            duration: 0.8,
            message: '系统通知',
            description: '获取用户信息失败，请重新登录!'
            // onClose: () => userStore.logout().then(resolve)
          })
        })

        // next({
        //   path: loginRoutePath,
        //   query: { redirect: to.fullPath }
        // })
      }
      return
    }
    console.log(95, JSON.stringify(router.getRoutes()))
    console.log(96, to.path)
    return next()
  }

  if (!to || !to.name) {
    if (!urlTicket) {
      alert('go loginRoutePath')
      return next({ path: loginRoutePath })
    } else {
      alert('go loginCallbackRoutePath')
      return next({ path: loginCallbackRoutePath, query: { token: urlTicket } })
    }
  }

  if (whiteRouteList.includes(to.path)) {
    return next()
  }

  return next()

  // await new Promise(resolve => {
  //   Notification.error({
  //     duration: 0.8,
  //     message: '系统通知',
  //     description: 'token 已过期, 请重新登录!',
  //     onClose: () => userStore.logout().then(resolve)
  //   })
  // })

  // next({
  //   path: loginRoutePath,
  //   query: { redirect: to.fullPath }
  // })
})

/**
 * 路由处理
 */
router.afterEach(to => {
  let domTitle = ''

  for (const route of to.matched) {
    const isNotIndexRoute = route.path !== '/'
    const isNotEmptyTitle = typeof route.meta.title === 'string' && route.meta.title.trim()

    isNotIndexRoute && isNotEmptyTitle
      ? domTitle = domTitle ? domTitle + ' - ' + isNotEmptyTitle : isNotEmptyTitle
      : null
  }

  useAppStore().toggleDomTitle(domTitle)
  NProgress.done()
})
