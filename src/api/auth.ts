import { request } from '@/utils/request'
import { getUrlQueryParams } from '@/utils/common'

/**
 * login 系统登录
 * logout 系统退出
 * modifyPassword 修改密码
 */
const api = {
  ssoAuth: '/authorize/getSsoUrl',
  login: '/authorize/getUserInfo',
  logout: '/authorize/logout',
  modifyPassword: '/auth/modifyPassword'
}

/**
 * 获取URL的SSO token参数
 * @returns
 */
export function getSSOTicket() {
  const urlParam: string = getUrlQueryParams('token') || ''
  const flagIndex = urlParam ? urlParam.lastIndexOf('#/') : -1
  let ticket = null
  if (flagIndex !== -1) ticket = urlParam ? urlParam.substring(0, flagIndex) : null
  else ticket = urlParam

  return ticket
}

export function ssoAuth<T = any, D = any>(redirectUrl: string) {
  return request<T, D>({
    url: api.ssoAuth,
    method: 'get',
    params: {
      redirectUrl
    }
  })
}

export function login<T = any, D = any>(token: string) {
  return request<T, D>({
    url: api.login,
    method: 'get',
    params: { token }
  })
}

export function logout<T = any, D = any>(data: D) {
  return request<T, D>({
    url: api.logout,
    method: 'get',
    data: data
  })
}

export function modifyPassword<T = any, D = any>(data: D) {
  return request<T, D>({
    url: api.modifyPassword,
    method: 'post',
    data: data
  })
}

export default api
