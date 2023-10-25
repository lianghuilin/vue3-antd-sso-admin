import { request, submitPost } from '@/utils/request'

const api = {
  updAmendment: '/passenger_flow_amendment/operate',
  getAmendmentList: '/passenger_flow_amendment/search',
  delAmendment: '/passenger_flow_amendment/delete/{id}',
  getAmendmentGroup: '/passenger_flow_amendment/groupList',
  getAmendmentInout: '/passenger_flow_amendment/inout',
}

interface AmendmentParams {
  gid: number
  switch: number
  type: number
  inPlus: number
  outPlus: number
}

/**
 * 修改优化配置
 * @param data
 * @returns
 */
export function updAmendment<D = AmendmentParams>(data: D) {
  return submitPost(api.updAmendment, data)
}

/**
 * 获取优化配置列表
 * @param data
 * @returns
 */
export function getAmendmentList<T = any, D = { switch: number; page: number; pageSize: number }>(data: D) {
  return request<T, D>({
    url: api.getAmendmentList,
    method: 'get',
    data,
  })
}

/**
 * 删除优化配置
 * @param data
 * @returns
 */
export function delAmendment<T = any, D = { id: string }>(data: D) {
  return request<T, D>({
    url: api.delAmendment,
    method: 'delete',
    data,
  })
}

/**
 * 获取统计组数据
 * @returns
 */
export function getAmendmentGroup<T = any, D = any>() {
  return request<T, D>({
    url: api.getAmendmentGroup,
    method: 'get',
  })
}

/**
 * 查询实时出入园数据
 * @param gid
 * @returns
 */
export function getAmendmentInout<T = any, D = any>(gid: string) {
  return request<T, D>({
    url: api.getAmendmentInout,
    method: 'get',
    params: {
      gid,
    },
  })
}
