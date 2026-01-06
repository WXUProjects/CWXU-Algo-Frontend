<template>
    <div class="view-container">
        <div class="view-header">
            <div class="title">比赛 Competition</div>
        </div>
        <div class="view-content">
            <div class="title">热门比赛</div>
            <div class="title">我参加的比赛</div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
@import url('@/assets/css/view.css');

.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}
</style>