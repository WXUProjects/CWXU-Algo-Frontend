<template>
  <div class="container">
    <!-- 侧边栏 -->
    <div class="sidebar">

      <div class="sidebar-logo">
        <div class="logo-icon">
          <div class="logo-glitch">CWXU-Algo</div>
        </div>
      </div>

      <div class="sections">
        <router-link to="/" class="section navigation-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-house" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">首页</span>
              <span class="en">Home</span>
            </div>
            <div class="item-description">数据总览</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <!-- <router-link to="/rank" class="section navigation-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-trophy" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">排行榜</span>
              <span class="en">Rank</span>
            </div>
            <div class="item-description">查看排行数据</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link> -->

        <router-link to="/competition" class="section navigation-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-flag" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">比赛</span>
              <span class="en">Competition</span>
            </div>
            <div class="item-description">查看比赛数据</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <router-link to="/profile" class="section navigation-item" active-class="active" v-if="isLogin">
          <font-awesome-icon icon="fa-solid fa-user" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">个人资料</span>
              <span class="en">Profile</span>
            </div>
            <div class="item-description">查看/修改个人资料</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <router-link to="/problem" class="section navigation-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-list" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">公共题单</span>
              <span class="en">Problem</span>
            </div>
            <div class="item-description">上传或练习题目</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <router-link to="/star" class="section navigation-item" active-class="active" v-if="isLogin">
          <font-awesome-icon icon="fa-solid fa-star" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">收藏</span>
              <span class="en">Star</span>
            </div>
            <div class="item-description">查看或管理您的收藏</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <router-link to="/dashboard" class="section navigation-item" active-class="active" v-if="isLogin && isAdmin">
          <font-awesome-icon icon="fa-solid fa-gauge-high" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">后台管理</span>
              <span class="en">Dashboard</span>
            </div>
            <div class="item-description">管理学生和小组</div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <a href="http://bbs.algo.zhiyuansofts.cn/" target="_blank" class="section navigation-item">
          <font-awesome-icon icon="fa-solid fa-comment" class=" item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">论坛</span>
              <span class="en">BBS</span>
            </div>
            <div class="item-description">进入论坛</div>
          </div>
          <div class="item-indicator">▶</div>
        </a>

        <!-- 主题切换 -->
        <div class="section navigation-item" @click="setTheme(currentTheme === 'dark' ? 'light' : 'dark')">
          <font-awesome-icon v-if="currentTheme === 'dark'" icon="fa-solid fa-sun" class="item-icon" />
          <font-awesome-icon v-else icon="fa-solid fa-moon" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">主题</span>
              <span class="en">{{ currentTheme === 'dark' ? 'Light_mode' : 'Dark_mode' }}</span>
            </div>
            <div class="item-description">切换主题</div>
          </div>
          <div class="item-indicator">▶</div>
        </div>

        <router-link to="/login" class="section navigation-item" active-class="active" v-if="!isLogin">
          <font-awesome-icon icon="fa-solid fa-gauge-high" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">登录账号</span>
              <span class="en">Login</span>
            </div>
            <div class="item-description"></div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

        <router-link to="/register" class="section navigation-item" active-class="active" v-if="!isLogin">
          <font-awesome-icon icon="fa-solid fa-gauge-high" class="item-icon" />
          <div class="item-content">
            <div class="item-title">
              <span class="zh">注册账号</span>
              <span class="en">register</span>
            </div>
            <div class="item-description"></div>
          </div>
          <div class="item-indicator">▶</div>
        </router-link>

      </div>

      <!-- 状态栏 -->
      <div class="sidebar-footer">
        <div class="system-info">
          <span class="info-item">v1.0.0</span>
          <span class="info-divider">|</span>
          <span class="info-item">{{ new Date().getHours().toString().padStart(2, '0') }}:{{ new
            Date().getMinutes().toString().padStart(2, '0') }}</span>
        </div>
        <div class="logo-status">
          <div class="status-indicator" :class="{ 'status-online': true }"></div>
          <span class="status-text">{{ currentTheme === 'dark' ? 'DARK_MODE' : 'LIGHT_MODE' }}</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <div class="content-header">
        <div class="header-info">
          <span class="info-label">></span>
          <span class="info-value">{{ currentRouteName }}</span>
        </div>
        <div class="header-tabs">
          <div class="tab" @click="router.back()">返回</div>
        </div>
      </div>

      <div class="announcements">
        <div class="announcement" v-for="anno in annos" :class="anno.type" v-show="!anno.isclosed">
          <span class="content">{{ anno.content }}</span>
          <span class="close" @click="closeAnno(anno.id)"></span>
        </div>
      </div>

      <div class="content-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import generateRainbowText from './utils/format'
import { useUserStore } from '@/stores/user'
import router from './router'
import ToastNotification from './components/ToastNotification.vue'
import type { Anno } from './utils/type'
import AnnoStore from './utils/anno'
import Bot from './utils/bot'
import Random from './utils/random'

const route = useRoute()

const userStore = useUserStore()

const isLogin = computed(() => userStore.isLogin)
const isAdmin = computed(() => userStore.isAdmin)

// 获取当前路由名称用于显示
const currentRouteName = computed(() => {
  const name = route.name?.toString() || 'home'
  return name.replace(/_/g, ' ')
})

const text = `
 ██████╗██╗    ██╗██╗  ██╗██╗   ██╗       █████╗ ██╗      ██████╗  ██████╗
██╔════╝██║    ██║╚██╗██╔╝██║   ██║      ██╔══██╗██║     ██╔════╝ ██╔═══██╗
██║     ██║ █╗ ██║ ╚███╔╝ ██║   ██║█████╗███████║██║     ██║  ███╗██║   ██║
██║     ██║███╗██║ ██╔██╗ ██║   ██║╚════╝██╔══██║██║     ██║   ██║██║   ██║
╚██████╗╚███╔███╔╝██╔╝ ██╗╚██████╔╝      ██║  ██║███████╗╚██████╔╝╚██████╔╝
 ╚═════╝ ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝       ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ `

const info = `
===================================
GitHash   ${__GIT_HASH__}
GitDate   ${__GIT_DATE__}
-----------------------------------
Fonts     Jetbrains Mono
          Maple Mono CN
Icons     Font Awesome
-----------------------------------
Frontend  Aoralsfout
Backend   srcenchen
          hyhgfrgh
===================================`

const rainbowText = generateRainbowText(text)
const rainbowInfo = generateRainbowText(info)

console.log(`
${rainbowText.string}

Welcome to CWXU - Algo

${rainbowInfo.string}
`, ...rainbowText.format, ...rainbowInfo.format);

// 从本地储存中获取主题
const getTheme = (): 'dark' | 'light' => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    return theme as 'dark' | 'light';
  } else {
    // 如果本地储存中没有，则创建本地储存，默认为跟随系统
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem('theme', 'dark');
      return 'dark';
    } else {
      localStorage.setItem('theme', 'light');
      return 'light';
    }
  }
}

// 设置主题
const setTheme = (theme: 'dark' | 'light') => {
  localStorage.setItem('theme', theme);
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
}

const currentTheme = ref<'dark' | 'light'>(getTheme())

const annos = ref<Anno[]>([])

const closeAnno = (id: number) => {
  AnnoStore.closeAnno(id);
  annos.value = AnnoStore.getStorageAnnos()
}

onMounted(() => {
  setTheme(getTheme())
  userStore.syncStatus()
  AnnoStore.syncAnnos()
  if (Random.range(0, 1)) {
    Bot.getHitokoto();
  } else {
    Bot.tip.timeTip();
  }
  Bot.tip.loginTip();
  annos.value = AnnoStore.getStorageAnnos()
})
</script>

<style scoped>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 主容器 */
.container {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color-1);
  color: var(--text-default-color);
  overflow: hidden;
}

/* 侧边栏 */
.container>.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 320px;
  background-color: var(--background-color-2);
  border-right: 1px solid var(--divider-color);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: all 0.3s ease;
}

/* 侧边栏logo区域 */
.sidebar-logo {
  padding: 24px;
  border-bottom: 1px solid var(--divider-color);
}

.logo-icon {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logo-glitch {
  font-size: 2.5rem;
  font-weight: bolder;
  /* color: var(--neon-cyan) */
  color: var(--text-default-color);
  position: relative;
  letter-spacing: 1px;
}

.logo-icon img {
  width: 70px;
}

/* 状态指示器 */
.logo-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 8px 12px;
  background-color: var(--section-background-color);
  border-radius: 4px;
  border: 1px solid var(--divider-color);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5f56;
}

.status-indicator.status-online {
  background-color: #27c93f;
  box-shadow: 0 0 8px #27c93f;
}

.status-text {
  font-size: var(--text-xs);
  color: var(--text-light-color);
  flex-grow: 1;
}

/* 导航区域 */
.sections {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

/* 导航项 */
.navigation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-light-color);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.navigation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.navigation-item:hover::before {
  left: 100%;
}

.navigation-item:hover {
  /* border-color: var(--neon-cyan); */
  background-color: var(--section-background-color);
  color: var(--text-default-color);
  transform: translateX(4px);
}

.navigation-item.active {
  border-color: var(--neon-cyan);
  background-color: var(--section-background-color);
  color: var(--text-default-color);
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.2);
}

.navigation-item.active .item-prefix {
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
}

.navigation-item.active .item-icon {
  color: var(--neon-cyan);
  transform: scale(1.1);
}

.item-icon {
  font-size: var(--text-lg);
  color: var(--section-default-color);
  transition: all 0.2s ease;
  min-width: 24px;
  text-align: center;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-base);
  font-weight: 500;
}

.item-title .zh {
  font-size: var(--text-base);
  color: var(--text-default-color);
}

.item-title .en {
  color: var(--text-light-color);
  font-size: var(--text-sm);
  opacity: 0.7;
}

.item-description {
  font-size: var(--text-xs);
  color: var(--text-light-color);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-indicator {
  font-size: var(--text-sm);
  color: var(--neon-cyan);
  opacity: 0.7;
  transition: all 0.2s ease;
}

.navigation-item:hover .item-indicator {
  opacity: 1;
  transform: translateX(4px);
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--divider-color);
  background-color: var(--section-background-color);
}

.system-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-base);
  color: var(--text-light-color);
}

.info-item {
  font-size: var(--text-xs);
  padding: 4px 8px;
  background-color: var(--section-background-color);
  border-radius: 4px;
  border: 1px solid var(--divider-color);
}

.info-divider {
  color: var(--neon-cyan);
  opacity: 0.5;
}

/* 主内容区域 */
.container>.content {
  padding-left: 320px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.content-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--divider-color);
  background-color: var(--background-color-2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px;

    .tab {
      padding: 6px 12px;
      border-radius: 6px;
      background-color: var(--section-background-color);
      color: var(--text-light-color);
      font-size: var(--text-base);
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        color: var(--text-default-color);
        background-color: var(--divider-color);
      }

      &.active {
        background-color: var(--neon-cyan);
        color: var(--background-color-1);
        font-weight: 500;
      }
    }
  }
}

.content .announcements {
  display: flex;
  flex-direction: column;

  .announcement {
    padding: 10px;
    display: flex;
    align-items: center;
    height: auto;
    color: var(--text-default-color);

    &.warn {
      background-color: rgba(255, 0, 0, 0.5);
    }

    &.info {
      background-color: rgba(0, 255, 255, 0.5);
    }

    .close {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      margin-left: 10px;
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #ffffff80;
      }

      &::before {
        content: '';
        position: absolute;
        height: 50%;
        width: 3px;
        border-radius: 1.5px;
        left: 50%;
        transform: translate(-50%, 0%) rotate(45deg);
        background-color: var(--text-default-color);
      }

      &::after {
        content: '';
        position: absolute;
        height: 50%;
        width: 3px;
        border-radius: 1.5px;
        left: 50%;
        transform: translate(-50%, 0%) rotate(-45deg);
        background-color: var(--text-default-color);
      }
    }
  }
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-base);
}

.info-label {
  color: var(--text-light-color);
}

.info-value {
  color: var(--neon-cyan);
  font-weight: 600;
}

/* 主要内容区域 */
.content-main {
  flex: 1;
  /* padding: 24px; */
  overflow-y: none;
  position: relative;
}

/* 内容底部 */
.content-footer {
  margin: 24px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .container>.content {
    padding-left: 320px;
  }

  .sidebar {
    width: 280px;
  }
}

@media (max-width: 860px) {
  .sidebar {
    position: relative;
  }

  .container>.content {
    padding-left: 0px;
    padding-top: 67px;
  }

  .content-header {
    display: none;
  }

  .sidebar-logo {
    display: none;
  }

  .container {
    flex-direction: column;
  }

  .container>.sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--divider-color);
  }

  .sections {
    flex-direction: row;
    overflow-x: auto;
    padding: 12px;
    gap: 8px;
  }

  .navigation-item {
    min-width: 200px;
    flex-shrink: 0;
  }

  .item-title .en {
    display: none;
  }

  .item-description {
    display: none;
  }

  .sidebar-footer {
    display: none;
  }

  .container>.content {
    min-height: calc(100vh - 300px);
  }

  .content-header {
    padding: 12px 16px;
  }

  /* .content-main {
    padding: 16px;
  } */

  .content-footer {
    margin: 16px;
  }
}

@media (max-width: 640px) {
  .navigation-item {
    min-width: 160px;
    padding: 10px 12px;
  }

  .item-prefix {
    display: none;
  }

  .content-footer {
    margin: 12px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: var(--background-color-2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--neon-cyan);
  border-radius: 3px;
  opacity: 0.5;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

/* 选择文本样式 */
::selection {
  background-color: rgba(0, 255, 255, 0.3);
  color: var(--text-default-color);
}
</style>
