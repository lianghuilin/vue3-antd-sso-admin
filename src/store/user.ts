import { defineStore } from 'pinia'
import { Ref, ref, computed } from 'vue'
import { requestBuilder } from '@/utils/common'
import defaultAvatar from '@/assets/avatar/default_avatar.png?url'
import useTagStore from '@/store/tag'
import * as authApi from '@/api/auth'
import * as userApi from '@/api/user'

// 用户角色
interface UserRole {
  permissionList: Array<string>;
  permissions: Array<{
    roleId: string;
    permissionId: string;
    actionEntitySet: Array<{ action: string, describe: string }>;
    actionList: Array<string>;
  }>;
}

// 用户信息
interface UserInfo {
  userNo?: string | null;
  userName?: string | null;
  mobilePhone?: string | null;
  avatar?: string | null;
  postName?: string | null;
  role?: UserRole | null;
  orgId?: string | null;
  orgName?: string | null;
  deptName?: string | null;
  deptId?: string | null;
  dataFlag?: string | null;
  activity?: string | null;
}

/**
 * 用户管理
 */
export default defineStore('user', () => {
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

  const ssoAuth = async(redirectUrl: string) => {
    return authApi.ssoAuth<AxiosResponseResult<any>>(redirectUrl).then(res => {
      console.log('authApi.ssoAuth', res)
      if (res.code === 0) {
        window.location.href = res.result
      }
    })
  }

  const login = async(ssoTicket: string) => {
    if (tagStore) {
      tagStore.delAllTags()
    }

    // interface CustomResult {
    //   token: string;
    //   data: UserInfo;
    // }

    return authApi.login<AxiosResponseResult<any>>(ssoTicket).then(res => {
      console.log('authApi.login', res)
      const { code, result } = res
      if (code !== 0) {
        return Promise.reject(res)
      }

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

      return res
    })
  }

  const logout = async(redirectUrl: string) => {
    if (tagStore) {
      tagStore.delAllTags()
    }

    return authApi.logout<AxiosResponseResult>({ redirectUrl, token: token.value }).then(res => {
      if (res.code !== 0) {
        return Promise.reject(res)
      } else {
        token.value = ''
        userNo.value = ''
        userName.value = ''
        orgId.value = ''
        orgName.value = ''
        deptId.value = ''
        deptName.value = ''
        dataFlag.value = ''
        avatar.value = defaultAvatar
        userInfo.value = {} as UserInfo
        userRole.value = {} as UserRole
        // window.location.href = res.result
      }
    })
  }

  const getUserInfo = async(params: Record<string, any>) => {
    return userApi.getUserInfo<AxiosResponseResult<UserInfo>>(requestBuilder('getInfo', params)).then(res => {
      if (res.code !== 0) {
        return Promise.reject(new Error(res.message || '获取用户失败!'))
      }

      const result = res.result

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

      return res
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

    ssoAuth,
    login,
    logout,
    getUserInfo
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        key: 'user-token',
        paths: ['token']
      },
      {
        storage: localStorage,
        key: 'user-orgId',
        paths: ['orgId']
      },
      {
        storage: localStorage,
        key: 'user-userNo',
        paths: ['userNo']
      }
    ]
  }
})
