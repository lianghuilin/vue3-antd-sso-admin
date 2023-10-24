import { generateLayoutRouter, generateViewsRouter } from '@/router/generate-routes'

const layoutMap: any = import.meta.glob('./layout/*.{tsx,vue}', { eager: true })
const componentMap: any = import.meta.glob('./views/**/*.{tsx,vue}', { eager: true })

/**
 * 动态路由映射
 */
export default {
  ...generateLayoutRouter(layoutMap),
  ...generateViewsRouter(componentMap)
}
