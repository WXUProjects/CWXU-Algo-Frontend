import { ref } from 'vue'
import { defineStore } from 'pinia'
import JWT from '@/utils/jwt'

export const useUserStore = defineStore('user', () => {
  // 登录状态
  const isLogin = ref<boolean>(JWT.isValid())
  
  // 更新登录状态
  function updateLoginStatus() {
    isLogin.value = JWT.isValid()
  }
  
  // 手动设置登录状态
  function setLoginStatus(status: boolean) {
    isLogin.value = status
  }

  return { 
    isLogin, 
    updateLoginStatus, 
    setLoginStatus 
  }
})