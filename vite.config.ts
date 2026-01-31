import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 获取GIT信息，用于页脚显示git信息（没啥用，主要是感觉很高级awa
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    // 定义GIT相关环境变量
    define: {
      __GIT_HASH__: JSON.stringify(gitHash),
      __GIT_DATE__: JSON.stringify(gitDate),
    },
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      // 指定端口 3000
      port: 3000,
      // 将 /api 请求代理到 http://dev.algo.zhiyuansofts.cn/v1 上
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/v1'),
        }
      }
    }

    // 我连不上API接口了，我用主站中转一下
    // 临时使用
    // server: {
    //   port: 3000,
    //   proxy: {
    //     '/api': {
    //       target: "http://algo.zhiyuansofts.cn/",
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '/api'),
    //     }
    //   }
    // }
  }
})
