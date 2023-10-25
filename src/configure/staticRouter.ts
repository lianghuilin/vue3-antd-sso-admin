export default [
  {
    sort: 1000000,
    id: '27245863256459422',
    name: 'system',
    path: '',
    parentId: '0',
    component: 'PageView',
    redirect: '/system/PassengerFlowAmendment',
    meta: { icon: 'CodepenOutlined', title: '系统管理', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y' }
  },
  // {
  //   sort: 1000100,
  //   id: '1127282136000102507',
  //   name: 'OrganizeManage',
  //   path: '/system/OrganizeManage',
  //   parentId: '27245863256459422',
  //   component: 'OrganizeManage',
  //   redirect: '',
  //   meta: { icon: '', title: '组织管理', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y' }
  // },
  {
    sort: 1000500,
    id: '1127282136000102580',
    name: 'PassengerFlowAmendment',
    path: '/system/PassengerFlowAmendment',
    parentId: '27245863256459422',
    component: 'PassengerFlowAmendment',
    redirect: '',
    meta: {
      icon: '', title: '客流优化', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y'
    }
  },
  // {
  //   sort: 1000200,
  //   id: '27245863256459445',
  //   name: 'ResourceManage',
  //   path: '/system/ResourceManage',
  //   parentId: '27245863256459422',
  //   component: 'ResourceManage',
  //   redirect: '',
  //   meta: { icon: '', title: '资源管理', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y' }
  // },
  // {
  //   sort: 1000300,
  //   id: '27245863256459495',
  //   name: 'RoleManage',
  //   path: '/system/RoleManage',
  //   parentId: '27245863256459422',
  //   component: 'RoleManage',
  //   redirect: '',
  //   meta: { icon: '', title: '角色管理', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y' }
  // },
  // {
  //   sort: 1000400,
  //   id: '1127282136000102579',
  //   name: 'UserManage',
  //   path: '/system/UserManage',
  //   parentId: '27245863256459422',
  //   component: 'UserManage',
  //   redirect: '',
  //   meta: { icon: '', title: '用户管理', hideChildInMenu: 'N', hideInMenu: 'N', allowCache: 'Y' }
  // }
]
