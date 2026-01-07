<template>
  <div class="container">
    <div class="sidebar" @mouseenter="isSidebarHover = true" @mouseleave="isSidebarHover = false">
      <div class="logo">
        <img src="/favicon.ico" alt="CWXU- Algo Logo" class="logo-icon">
        <div class="title">CWXU - Algo</div>
      </div>
      <div class="sections">
        <router-link to="/" class="section" active-class="active">
          <font-awesome-icon icon="fa-solid fa-house" class="section-icon" />
          <div class="title">
            <div class="zh">首页</div>
            <div class="en">Home</div>
          </div>
        </router-link>
        <router-link to="/rank" class="section" active-class="active">
          <font-awesome-icon icon="fa-solid fa-trophy" class="section-icon" />
          <div class="title">
            <div class="zh">排行榜</div>
            <div class="en">Rank</div>
          </div>
        </router-link>
        <router-link to="/competition" class="section" active-class="active">
          <font-awesome-icon icon="fa-solid fa-flag" class="section-icon" />
          <div class="title">
            <div class="zh">比赛</div>
            <div class="en">Competition</div>
          </div>
        </router-link>
        <router-link to="/profile" class="section" active-class="active">
          <font-awesome-icon icon="fa-solid fa-user" class="section-icon" />
          <div class="title">
            <div class="zh">个人资料</div>
            <div class="en">Profile</div>
          </div>
        </router-link>
        <router-link to="/dashboard" class="section" active-class="active">
          <font-awesome-icon icon="fa-solid fa-gauge-high" class="section-icon" />
          <div class="title">
            <div class="zh">后台管理</div>
            <div class="en">Dashboard</div>
          </div>
        </router-link>
        <div class="section" @click="setTheme(currentTheme === 'dark' ? 'light' : 'dark')">
          <font-awesome-icon v-if="currentTheme === 'dark'" icon="fa-solid fa-sun" class="section-icon" />
          <font-awesome-icon v-else icon="fa-solid fa-moon" class="section-icon" />
          <div class="title">
            <div class="zh">切换主题</div>
            <div class="en">{{ currentTheme === 'dark' ? 'Light' : 'Dark' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import generateRainbowText from './utils/format'

const text = `
 ██████╗██╗    ██╗██╗  ██╗██╗   ██╗       █████╗ ██╗      ██████╗  ██████╗
██╔════╝██║    ██║╚██╗██╔╝██║   ██║      ██╔══██╗██║     ██╔════╝ ██╔═══██╗
██║     ██║ █╗ ██║ ╚███╔╝ ██║   ██║█████╗███████║██║     ██║  ███╗██║   ██║
██║     ██║███╗██║ ██╔██╗ ██║   ██║╚════╝██╔══██║██║     ██║   ██║██║   ██║
╚██████╗╚███╔███╔╝██╔╝ ██╗╚██████╔╝      ██║  ██║███████╗╚██████╔╝╚██████╔╝
 ╚═════╝ ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝       ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ `

const info=`
===================================
GitHash   ${__GIT_HASH__}
GitDate   ${__GIT_DATE__}
-----------------------------------
Fonts     Jetbrains Mono
          Noto Sans SC
Icons     Font Awesome
-----------------------------------
Frontend  Aoralsfout
Backend   srcenchen
===================================`

const rainbowText = generateRainbowText(text)
const rainbowInfo = generateRainbowText(info)

console.log(`
${rainbowText.string}

Welcome to CWXU - Algo

${rainbowInfo.string}
`, ...rainbowText.format, ...rainbowInfo.format);

// 侧边栏是否被Hover
const isSidebarHover = ref(false);

// 向子组件提供侧边栏悬停状态
provide('sidebarHover', isSidebarHover);

// 从本地储存中获取主题
const getTheme = (): 'dark' | 'light' => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    return theme as 'dark' | 'light';
  } else {
    // 如果本地储存中没有，则创建本地储存，默认为light
    localStorage.setItem('theme', 'light');
    return 'light';
  }
}

// 设置主题
const setTheme = (theme: 'dark' | 'light') => {
  localStorage.setItem('theme', theme);
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
}

const currentTheme = ref<'dark' | 'light'>(getTheme())

onMounted(() => {
  setTheme(getTheme())
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.container {
  display: flex;
}

.sidebar {
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 70px;
  height: 100vh;
  background-color: var(--background-color-2);
  border-right: solid 1px var(--divider-color);
  user-select: none;

  overflow: hidden;
  text-wrap: nowrap;

  transition: width 0.3s ease-in-out;

  z-index: 10;
}

.sidebar:hover {
  width: 300px;
}

.sidebar:hover .section .title {
  opacity: 1;
  transform: translateX(0px);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logo-icon {
  -webkit-user-drag: none;
}

.logo .title {
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  transform: translateX(10px);
  color: var(--text-default-color);
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section {
  display: flex;
  position: relative;
  align-items: center;
  height: 50px;
  padding-left: 20px;

  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

a.section {
  color: inherit;
  text-decoration: none;
}

.section.active {
  background-color: var(--section-background-color);
}

.section:hover {
  background-color: var(--section-background-color);
}

.section::before {
  content: '';
  position: absolute;
  left: 0;
  width: 5px;
  height: 0%;
  background-color: var(--section-active-color);
  margin-right: 10px;

  transition: height 0.2s ease-in-out;
}

.section.active::before {
  content: '';
  position: absolute;
  left: 0;
  width: 5px;
  height: 100%;
  background-color: var(--section-active-color);
  margin-right: 10px;
}

.section.active .section-icon {
  color: var(--section-active-color);
}

.section.active .title {
  color: var(--text-default-color);
}

.section-icon {
  font-size: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--section-default-color);

  transition: color 0.2s ease-in-out;
}

.section .title {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  opacity: 0;
  margin-left: 10px;
  font-size: 1rem;
  transform: translateX(-20px);
  color: var(--text-light-color);

  transition: all 0.2s ease-in-out;
}

.content {
  display: flex;
  flex: 1;
  background-color: var(--background-color-1);
  padding-left: 70px;
}

@media (max-width:860px) {
  .sidebar {
    width: 100vw;
    height: 70px;
    flex-direction: row;
    align-items: center;
    border-right: none;
    border-bottom: solid 1px var(--divider-color);
  }

  .logo .title {
    display: none;
  }

  .sidebar:hover {
    width: 100vw;
  }

  .sections {
    display: flex;
    flex-direction: row;
  }

  .section {
    padding: 0 10px;
  }

  .section::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 0%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;

    transition: width 0.2s ease-in-out;
  }

  .section.active::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;
  }

  .content {
    padding-top: 70px;
    padding-left: 0;
  }

  .section .title {
    display: flex;
    opacity: 1;
    transform: translateX(0px);
  }

  .title .en {
    display: none;
  }
}

@media (max-width: 740px) {
  .title .zh {
    display: none;
  }
}
</style>
