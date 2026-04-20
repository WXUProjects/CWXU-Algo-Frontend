import { ref } from 'vue'
import { defineStore } from 'pinia'

interface Log {
  time: string;
  content: string;
}

export const useBotLogStore = defineStore('botLog', () => {
  const log = ref<Log[]>([])

  const MAX_LOG_SIZE = 200;

  const push = (content: string) => {
    log.value.push({
      time: new Date().toLocaleString(),
      content
    })
    if (log.value.length > MAX_LOG_SIZE) {
      log.value = log.value.slice(-MAX_LOG_SIZE)
    }
  }

  return {
    log,
    push
  }
})