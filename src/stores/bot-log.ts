import { ref } from 'vue'
import { defineStore } from 'pinia'

interface Log {
  time: string;
  content: string;
}

export const useBotLogStore = defineStore('botLog', () => {
  const log = ref<Log[]>([])

  const push = (content: string) => {
    log.value.push({
      time: new Date().toLocaleString(),
      content
    })
  }

  return {
    log,
    push
  }
})