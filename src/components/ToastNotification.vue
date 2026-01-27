<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast" 
        :class="toast.type"
      >
        <div class="toast-content">
          {{ toast.message }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const toasts = ref([])

const showToast = async (message, type = 'info', duration = 5000) => {
  const id = Date.now()
  const toast = {
    id,
    message,
    type,
    duration,
    timer: null
  }

  toasts.value.push(toast)

  // 等待DOM更新完成
  await nextTick()

  // 找到对应的toast并设置定时器
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    // 设置定时器，duration + 300ms（滑入动画时间）
    toasts.value[index].timer = setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    if (toasts.value[index].timer) {
      clearTimeout(toasts.value[index].timer)
    }
    toasts.value.splice(index, 1)
  }
}

// 监听全局toast事件
const handleToastEvent = (event) => {
  const { message, type, duration } = event.detail
  showToast(message, type, duration)
}

onMounted(() => {
  window.addEventListener('show-toast', handleToastEvent)
})

onUnmounted(() => {
  window.removeEventListener('show-toast', handleToastEvent)
})

// 暴露方法供全局调用
defineExpose({
  showToast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  min-width: 300px;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #ccc;
  backdrop-filter: blur(2px);
  margin-bottom: 10px;
}

.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast.success {
  background-color: #4caf5090;
  color: white;
  /* border-left: 4px solid #388e3c; */
}

.toast.warn {
  background-color: #ff980090;
  color: black;
  /* border-left: 4px solid #f57c00; */
}

.toast.error {
  background-color: #f4433690;
  color: white;
  /* border-left: 4px solid #d32f2f; */
}

.toast.info {
  background-color: #2196f390;
  color: white;
  /* border-left: 4px solid #1976d2; */
}

.toast-content {
  font-size: 14px;
  line-height: 1.4;
}
</style>