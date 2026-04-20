<template>
    <div class="view-container">
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
    width: 100%;
    height: 100%;
}

.view-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
    color: var(--text-default-color);
}

@media (max-width:860px) {
    .view-content {
        justify-content: center;
        align-items: center;
    }
}
</style>
