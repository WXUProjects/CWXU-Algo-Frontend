<template>
    <div class="terminal-window">
        <div class="terminal-header">
            <div class="terminal-dot red"></div>
            <div class="terminal-dot yellow"></div>
            <div class="terminal-dot green"></div>
            <div class="terminal-title">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="terminal-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
/* 终端窗口样式 */
.terminal-window {
    background-color: var(--background-color-1);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.terminal-header {
    background-color: var(--background-color-1);
    padding: 8px 16px;
    border-bottom: 1px solid var(--divider-color);
    display: flex;
    align-items: center;
    gap: 8px;
}

.terminal-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.terminal-dot.red {
    background-color: #ff5f56;
}

.terminal-dot.yellow {
    background-color: #ffbd2e;
}

.terminal-dot.green {
    background-color: #27c93f;
}

.terminal-title {
    color: var(--text-light-color);
    font-size: 12px;
    margin-left: auto;
}

.terminal-content {
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
}
</style>