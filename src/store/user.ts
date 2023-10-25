import { defineStore } from 'pinia'
import { Ref, ref, computed } from 'vue'
import defaultAvatar from '@/assets/avatar/default_avatar.png?url'
import useTagStore from '@/store/tag'
import * as authApi from '@/api/auth'

// 用户角色
interface UserRole {
  permissionList: Array<string>
  permissions: Array<{
    roleId: string
    permissionId: string
    actionEntitySet: Array<{ action: string; describe: string }>
    actionList: Array<string>
  }>
}

// 用户信息
interface UserInfo {
  userNo?: string | null
  userName?: string | null
  mobilePhone?: string | null
  avatar?: string | null
  postName?: string | null
  role?: UserRole | null
  orgId?: string | null
  orgName?: string | null
  deptName?: string | null
  deptId?: string | null
  dataFlag?: string | null
  activity?: string | null
}

const mockUserInfo = {
  userNo: '182588xxx88',
  userName: 'admin',
  mobilePhone: '182588xxx88',
  postName: '系统管理',
  orgId: '101.100.131',
  orgName: '北仑网安通信有限公司',
  deptName: '软件部',
  deptId: '1126534161135795132',
  dataFlag: '2',
  activity: 'Y',
  role: {
    permissions: [
      {
        roleId: '27442970747734159',
        permissionId: 'ResourceManage',
        actionEntitySet: [
          { action: 'add', defaultCheck: false, describe: '新增' },
          { action: 'del', defaultCheck: false, describe: '删除' },
        ],
      },
      {
        roleId: '27442970747734159',
        permissionId: 'RoleManage',
        actionEntitySet: [
          { action: 'add', defaultCheck: false, describe: '新增' },
          { action: 'del', defaultCheck: false, describe: '删除' },
          { action: 'edit', defaultCheck: false, describe: '修改' },
          { action: 'query', defaultCheck: false, describe: '查询' },
        ],
      },
      {
        roleId: '27442970747734159',
        permissionId: 'OrganizeManage',
        actionEntitySet: [
          { action: 'add', defaultCheck: false, describe: '新增' },
          { action: 'del', defaultCheck: false, describe: '删除' },
          { action: 'edit', defaultCheck: false, describe: '修改' },
          { action: 'query', defaultCheck: false, describe: '查询' },
        ],
      },
      {
        roleId: '27442970747734159',
        permissionId: 'UserManage',
        actionEntitySet: [
          { action: 'add', defaultCheck: false, describe: '新增' },
          { action: 'del', defaultCheck: false, describe: '删除' },
          { action: 'edit', defaultCheck: false, describe: '修改' },
          { action: 'query', defaultCheck: false, describe: '查询' },
        ],
      },
    ],
  },
}

/**
 * 用户管理
 */
export default defineStore(
  'user',
  () => {
    const token = ref('')
    const userNo = ref('')
    const userName = ref('')
    const mobilePhone = ref('')
    const avatar = ref(defaultAvatar)
    const orgId = ref('')
    const orgName = ref('')
    const deptId = ref('')
    const deptName = ref('')
    const dataFlag = ref('')
    const userInfo = ref({}) as Ref<UserInfo>
    const userRole = ref({}) as Ref<UserRole>
    const nickname = computed(() => userName.value)
    const tagStore = useTagStore()

    const ssoAuth = async (redirectUrl: string) => {
      return authApi.ssoAuth<AxiosResponseResult<string>>(redirectUrl).then(res => {
        window.location.href = res + ''
      })
    }

    const setToken = (tok: string) => {
      token.value = tok
    }

    const login = async (ssoTicket: string) => {
      if (tagStore) {
        tagStore.delAllTags()
      }

      return authApi.login<AxiosResponseResult<any>>(ssoTicket).then(result => {
        localStorage.setItem('SSO-TOKEN', result.token)
        token.value = result.token
        avatar.value = result.avatar || avatar.value
        userNo.value = ''
        userName.value = result.nick || userName.value
        mobilePhone.value = ''
        orgId.value = ''
        orgName.value = ''
        deptId.value = ''
        deptName.value = ''

        return result
      })
    }

    const logout = async () => {
      if (tagStore) {
        tagStore.delAllTags()
      }

      return authApi
        .logout<AxiosResponseResult>({
          redirectUrl: 'http://vscreen.12301.io/#/login/LoginCallback',
          token: token.value,
        })
        .then(res => {
          window.location.href = res + ''
        })
    }

    const getUserInfo = async () => {
      return new Promise(resolve => {
        const result: any = mockUserInfo

        userInfo.value = result || userInfo.value
        userRole.value = result.role || userRole.value
        userNo.value = result.userNo || userNo.value
        userName.value = result.userName || userName.value
        avatar.value = result.avatar || avatar.value
        orgId.value = result.orgId || orgId.value
        orgName.value = result.orgName || orgName.value
        deptId.value = result.deptId || deptId.value
        deptName.value = result.deptName || deptName.value
        dataFlag.value = result.dataFlag || dataFlag.value

        if (userRole.value && userRole.value.permissions) {
          for (const permission of userRole.value.permissions) {
            if (permission.actionEntitySet) {
              permission.actionList = permission.actionEntitySet.map(action => action.action)
            }
          }
          userRole.value.permissionList = userRole.value.permissions.map(permission => permission.permissionId)
        }

        resolve(mockUserInfo)
      })
    }

    return {
      token,
      userNo,
      userName,
      mobilePhone,
      avatar,
      orgId,
      orgName,
      deptId,
      deptName,
      dataFlag,
      userInfo,
      userRole,
      nickname,

      setToken,
      ssoAuth,
      login,
      logout,
      getUserInfo,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          key: 'user-token',
          paths: ['token'],
        },
        {
          storage: localStorage,
          key: 'user-orgId',
          paths: ['orgId'],
        },
        {
          storage: localStorage,
          key: 'user-userNo',
          paths: ['userNo'],
        },
      ],
    },
  }
)
