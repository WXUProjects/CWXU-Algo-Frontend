<template>
    <BaseLayout>
        <div class="title">热门比赛</div>
        <div class="title">我参加的比赛</div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
</script>

<style scoped>
.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}
</style>