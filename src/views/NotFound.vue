<template>
    <div class="view-container">
        <div class="view-header">
            <div class="title">未知页面 Not-Found</div>
        </div>
        <div class="view-content">
            <div class="nf">
                <div class="code">404</div>
                <div class="text">页面未找到</div>
                <div class="desc">抱歉，您查找的页面不存在，请检查URL拼写是否正确。</div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.nf{
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: var(--text-default-color);
}

.code{
    font-size: 10rem;
}

.text{
    font-size: 3rem;
}

.desc{
    font-size: 1rem;
    margin-top: 1rem;
}
</style>

<style scoped>
@import url('@/assets/css/view.css');
</style>