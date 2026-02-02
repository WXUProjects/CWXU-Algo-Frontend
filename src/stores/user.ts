import { ref } from 'vue'
import { defineStore } from 'pinia'
import JWT, { type JwtPayload } from '@/utils/jwt'
import type { User } from '@/utils/type'
import API from '@/utils/api'
import Toast from '@/utils/toast'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLogin = ref<boolean>(JWT.isValid())
  const isAdmin = ref<boolean>(JWT.getUserInfo()?.roleIds.includes(1) || false)

  const info = ref<User | null>(null)

  // 同步状态
  async function syncStatus() {
    if (JWT.isValid()) {
      const jwtPayload = JWT.getUserInfo() as JwtPayload
      isLogin.value = true;
      isAdmin.value = jwtPayload.roleIds.includes(1) || false

      const response = await API.user.profile.getById(jwtPayload.userId);
      Toast.stdResponse(response, false);

      if (response.success) {
        info.value = response.data;
      } else {
        info.value = null;
        isLogin.value = false;
        isAdmin.value = false;
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
    info,
    syncStatus
  }
})