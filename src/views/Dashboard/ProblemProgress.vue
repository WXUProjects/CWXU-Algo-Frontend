<template>
    <div class="dashboardContent">
        <div class="page-header">
            <h2>题库识别进度</h2>
            <div class="header-actions" v-if="userStore.isAdmin">
                <button class="btn btn-primary" @click="doBackfill" :disabled="backfilling">
                    {{ backfilling ? '回填中...' : '触发历史回填' }}
                </button>
            </div>
        </div>

        <div style="position: relative;">
            <LoadingOverlay :show="loading" />
            <div class="stats-grid">
                <div class="stat-card" v-for="it in items" :key="it.status">
                    <div class="card-header">
                        <div class="card-title">
                            <div class="title-main">{{ it.status }}</div>
                        </div>
                    </div>
                    <div class="card-data">
                        <div class="data-value">{{ it.count }}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="card-header">
                        <div class="card-title">
                            <div class="title-main">TOTAL</div>
                        </div>
                    </div>
                    <div class="card-data">
                        <div class="data-value">{{ total }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>最近失败</h3>
            <table v-if="failed.length">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>平台</th>
                        <th>题号</th>
                        <th>标题</th>
                        <th>错误</th>
                        <th>时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in failed" :key="f.id">
                        <td>
                            <router-link :to="`/question-bank/detail/${f.id}`">{{ f.id }}</router-link>
                        </td>
                        <td>{{ f.platform }}</td>
                        <td>{{ f.externalId }}</td>
                        <td>{{ f.title }}</td>
                        <td class="err">{{ f.errorMsg }}</td>
                        <td>{{ formatTime(f.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">暂无失败记录</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import API from '@/utils/api';
import Toast from '@/utils/toast';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(true);
const backfilling = ref(false);
const items = ref<{ status: string; count: number }[]>([]);
const failed = ref<any[]>([]);
const total = ref(0);

const formatTime = (ts: number) => {
    if (!ts) return '-';
    return new Date(Number(ts) * 1000).toLocaleString('sv-SE', { hour12: false });
};

const load = async () => {
    loading.value = true;
    const res = await API.core.problem.progress();
    Toast.stdResponse(res, false);
    if (res.success) {
        items.value = res.data.items || [];
        failed.value = res.data.recentFailed || [];
        total.value = res.data.total || 0;
    }
    loading.value = false;
};

const doBackfill = async () => {
    if (backfilling.value) return;
    backfilling.value = true;
    try {
        const res = await API.core.problem.backfill(500);
        Toast.stdResponse(res);
        if (res.success) await load();
    } finally {
        backfilling.value = false;
    }
};

onMounted(load);
</script>

<style scoped>
.dashboardContent { padding: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.stat-card { border: 1px solid var(--divider-color); border-radius: 10px; padding: 14px; }
.title-main { font-size: 0.85rem; opacity: 0.75; }
.data-value { font-size: 1.6rem; font-weight: 700; margin-top: 8px; }
.section h3 { margin: 0 0 10px; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { padding: 8px; border-bottom: 1px solid var(--divider-color); text-align: left; vertical-align: top; }
.err { max-width: 280px; word-break: break-all; opacity: 0.85; }
.empty { opacity: 0.7; padding: 16px 0; }
.btn { padding: 8px 14px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
.btn-primary { border-color: var(--primary-color, #4f8cff); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
