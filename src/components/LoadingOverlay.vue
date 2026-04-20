<template>
    <div class="loading-overlay" v-show="show">
        <div class="spinner"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean;
}>();
</script>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    border-radius: 8px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--divider-color);
    border-top-color: var(--neon-cyan);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
