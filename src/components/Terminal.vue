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