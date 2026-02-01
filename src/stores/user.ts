import { ref } from 'vue'
import { defineStore } from 'pinia'
import JWT from '@/utils/jwt'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLogin = ref<boolean>(JWT.isValid())
  const isAdmin = ref<boolean>(JWT.getUserInfo()?.roleIds.includes(1) || false)

  // 更新状态
  function updateLoginStatus() {
    isLogin.value = JWT.isValid()
  }
  function updateAdminStatus() {
    isAdmin.value = JWT.getUserInfo()?.roleIds.includes(1) || false
  }

  // 手动设置状态
  function setLoginStatus(status: boolean) {
    isLogin.value = status
  }

  return {
    isLogin,
    isAdmin,
    updateLoginStatus,
    updateAdminStatus,
    setLoginStatus
  }
})