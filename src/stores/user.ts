import { ref } from 'vue'
import { defineStore } from 'pinia'
import JWT, { type JwtPayload } from '@/utils/jwt'
import type { User } from '@/utils/type'
import API from '@/utils/api'
import Toast from '@/utils/toast'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLogin = ref<boolean>(JWT.isValid())
  const isAdmin = ref<boolean>(JWT.getUserInfo()?.roleId === 1)
  const isCoach = ref<boolean>(JWT.getUserInfo()?.roleId === 2)

  const info = ref<User | null>(null)

  // 同步状态
  async function syncStatus() {
    if (JWT.isValid()) {
      const jwtPayload = JWT.getUserInfo() as JwtPayload

      // Token 格式过旧（缺少 roleId 字段），自动登出
      if (jwtPayload.roleId === undefined) {
        JWT.clearToken()
        info.value = null
        isLogin.value = false
        isAdmin.value = false
        isCoach.value = false
        Toast.error('登录状态已过期，请重新登录')
        return
      }

      isLogin.value = true;
      isAdmin.value = jwtPayload.roleId === 1
      isCoach.value = jwtPayload.roleId === 2

      const response = await API.user.profile.getById(jwtPayload.userId);
      Toast.stdResponse(response, false);

      if (response.success) {
        info.value = response.data;
      } else {
        info.value = null;
        isLogin.value = false;
        isAdmin.value = false;
        isCoach.value = false;
      }
    } else {
      info.value = null;
      isLogin.value = false;
      isAdmin.value = false;
    }
  }

  return {
    isLogin,
    isAdmin,
    isCoach,
    info,
    syncStatus
  }
})