<!--
TODO:
1.组管理
1.成员管理
2.数据统计
-->

<template>
    <BaseLayout>
        <div>
            <div class="sections">
                <router-link to="/dashboard/statistics" class="section" active-class="active">
                    <font-awesome-icon icon="fa-solid fa-chart-line" class="section-icon" />
                    <div class="title">
                        <div class="zh">数据统计</div>
                        <div class="en">Statistics</div>
                    </div>
                </router-link>
                <router-link to="/dashboard/group" class="section" active-class="active">
                    <font-awesome-icon icon="fa-solid fa-people-group" class="section-icon" />
                    <div class="title">
                        <div class="zh">组管理</div>
                        <div class="en">Group</div>
                    </div>
                </router-link>
                <router-link to="/dashboard/user" class="section" active-class="active">
                    <font-awesome-icon icon="fa-solid fa-user" class="section-icon" />
                    <div class="title">
                        <div class="zh">用户管理</div>
                        <div class="en">User</div>
                    </div>
                </router-link>
            </div>
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
</script>

<style scoped>
.sections {
    display: flex;
    flex-direction: row;
}

.section {
    display: flex;
    position: relative;
    align-items: center;
    height: 50px;
    border: 1px solid var(--divider-color);
    border-bottom: none;
    border-right: none;
    padding: 0 10px;

    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

.section:last-child {
    border-right: 1px solid var(--divider-color);
}

a.section {
    color: inherit;
    text-decoration: none;
}

.section.active {
    background-color: var(--section-background-color);
}

.section:hover {
    background-color: var(--section-background-color);
}

.section::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;

    transition: width 0.2s ease-in-out;
}

.section.active::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;
}

.section.active .section-icon {
    color: var(--section-active-color);
}

.section.active .title {
    color: var(--text-default-color);
}

.section-icon {
    font-size: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--section-default-color);

    transition: color 0.2s ease-in-out;
}

.section .title {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin: 0 20px 0 10px;
    font-size: 1rem;
    color: var(--text-light-color);

    transition: all 0.2s ease-in-out;
}

@media (max-width:860px) {
    .en {
        display: none;
    }
}

@media (max-width:500px) {
    .section .title {
        display: none;
    }
}
</style>