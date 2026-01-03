import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 获取GIT信息
let gitHash = ''
let gitDate = ''

try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim()
  gitDate = new Date(execSync('git log -1 --format=%cd').toString().trim()).toISOString()
} catch (e) {
  console.error('Failed to get git info:', e)
  gitHash = 'N/A'
  gitDate = new Date().toISOString()
}

// https://vite.dev/config/
export default defineConfig({
  // 定义GIT相关环境变量
  define: {
    __GIT_HASH__: JSON.stringify(gitHash),
    __GIT_DATE__: JSON.stringify(gitDate),
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 指定端口 3000
  server: {
    port: 3000,
  }
})
