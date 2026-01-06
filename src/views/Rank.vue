<template>
    <div class="view-container">
        <div class="view-header">
            <div class="title">排行榜 Rank</div>
        </div>
        <div class="view-content">
            <RankPlus :data="rankData"></RankPlus>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Footer from '@/components/Footer.vue'
import RankPlus from '@/components/RankPlus.vue';
</script>

<style scoped>
@import url('@/assets/css/view.css');
</style>