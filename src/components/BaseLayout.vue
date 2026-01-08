<template>
    <div class="view-container">
        <div class="view-header">
            <div class="title" :class="{ sidebarHover }" ref="titleRef">
                <slot name="header">
                    <!-- 调用者提供标题插槽内容 -->
                </slot>
            </div>
        </div>
        <div class="view-content">
            <slot></slot>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import Footer from './Footer.vue'

// 从App.vue注入侧边栏悬停状态
const sidebarHover = inject('sidebarHover', false)

const titleRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    setTimeout(() => {
        if (titleRef.value) {
            titleRef.value.style.opacity = '1';
            titleRef.value.style.transform = 'translate(0)';
        }
    }, 0)
})
</script>

<style scoped>
.view-container {
    width: calc(100% - 40px);
    height: 100%;
}

.view-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding: 20px;
}

.view-header {
    width: 100%;
    padding: 20px;
    display: flex;
    border-bottom: solid 1px var(--divider-color);
    user-select: none;
}

.view-header .title {
    color: var(--text-default-color);
    opacity: 0;
    transform: translate(-100px);
    transition: all 0.3s ease-in-out;
}

.sidebarHover {
    transform: translate(230px) !important;
}

@media (max-width:860px) {
    .sidebarHover {
        transform: translate(0px) !important;
    }

    .view-content{
        justify-content: center;
        align-items: center;
    }
}
</style>