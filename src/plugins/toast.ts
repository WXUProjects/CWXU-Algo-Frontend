import { createApp } from 'vue'
import type { App } from 'vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

const ToastPlugin = {
  install(app: App) {
    const toast = {
      show(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info', duration: number = 5000) {
        // 触发自定义事件
        const event = new CustomEvent('show-toast', {
          detail: { message, type, duration }
        })
        window.dispatchEvent(event)
      },

      success(message: string, duration: number = 5000) {
        this.show(message, 'success', duration)
      },

      warning(message: string, duration: number = 5000) {
        this.show(message, 'warning', duration)
      },

      error(message: string, duration: number = 5000) {
        this.show(message, 'error', duration)
      },

      info(message: string, duration: number = 5000) {
        this.show(message, 'info', duration)
      }
    }

    // 添加到全局属性
    app.config.globalProperties.$toast = toast

    // 也提供独立的导入使用方式
    app.provide('toast', toast)
  }
}

export default ToastPlugin