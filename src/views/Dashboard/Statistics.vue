<template>
    <div class="dashboardContent">
        <h1>数据统计</h1>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="card-header">
                    <font-awesome-icon icon="fa-solid fa-trophy" class="card-icon" />
                    <div class="card-title">
                        <div class="title-main">Total Users</div>
                        <div class="title-sub">用户数量</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ userCount }}</div>
                    <div class="data-unit">users</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

export interface Response {
    list: List[];
    [property: string]: any;
}

export interface List {
    avatar: string;
    groupId: string;
    lastSubmit: string;
    name: string;
    userId: string;
    username: string;
    [property: string]: any;
}

const userCount = ref(0);

const getUserCount = async () => {
    // try{
    //     const response = await axios.get("/api/user/profile/list",{});

    //     if (response.status === 200) {
    //         userCount.value = response.data.list.length;
    //     }
    // }catch (error) {
    //     console.error(error);
    // }
}

onMounted(() => {
    getUserCount();
})
</script>

<style scoped>
.dashboardContent {
    height: 100%;
    border: 1px solid var(--divider-color);
    color: var(--text-default-color);
    padding: 10px;

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-top: 8px;
    }

    .stat-card {
        position: relative;
        padding: 20px;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
    }

    .card-icon {
        font-size: 2rem;
        color: var(--neon-cyan);
    }

    .card-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .title-main {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-default-color);
        letter-spacing: 1px;
    }

    .title-sub {
        font-size: 0.85rem;
        color: var(--text-light-color);
        opacity: 0.8;
    }

    .card-data {
        margin-bottom: 16px;
    }

    .data-value {
        font-size: 3rem;
        font-weight: 800;
        line-height: 1;
        margin-bottom: 4px;
        letter-spacing: -1px;
    }

    .data-unit {
        font-size: 0.9rem;
        color: var(--text-light-color);
        opacity: 0.8;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
    }

    .footer-trend {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--neon-green);
        font-weight: 500;
    }

    .trend-icon {
        font-size: 1.1rem;
    }

    .footer-info {
        font-size: 0.8rem;
        color: var(--text-light-color);
        opacity: 0.7;
    }
}
</style>