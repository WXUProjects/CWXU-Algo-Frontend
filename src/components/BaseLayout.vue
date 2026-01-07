<template>
    <div class="view-container">
        <div class="view-header">
            <div class="title">
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
import Footer from './Footer.vue'
</script>

<style scoped>
.view-container {
    width: calc(100% - 40px);
    height: 100%;
}

.view-content {
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding: 20px;
    width: 100%;
}

.view-header {
    padding: 20px;
    display: flex;
    border-bottom: solid 1px var(--divider-color);
    user-select: none;
}

.view-header .title {
    color: var(--text-default-color);
    opacity: 0;
    transform: translate(-100px);
    animation: slide 0.3s ease forwards;
}

@keyframes slide {
    0% {
        opacity: 0;
        transform: translate(-100px);
    }
    100% {
        opacity: 1;
        transform: translate(0);
    }
}
</style>