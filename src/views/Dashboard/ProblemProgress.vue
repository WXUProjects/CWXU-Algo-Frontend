<template>
    <div class="dashboardContent">
        <div class="page-header">
            <h2>题库识别进度</h2>
            <div class="header-actions" v-if="userStore.isAdmin">
                <button class="btn danger" @click="doStop" :disabled="busy">紧急停止</button>
                <button class="btn" @click="doResume" :disabled="busy">恢复流水线</button>
                <button class="btn" @click="doReset" :disabled="busy">全部重置</button>
                <button class="btn btn-primary" @click="doBackfill" :disabled="busy">
                    {{ acting === 'backfill' ? '回填中...' : '历史回填（全量入队）' }}
                </button>
                <button class="btn" @click="load" :disabled="busy">刷新</button>
            </div>
        </div>

        <div class="banner" :class="paused ? 'paused' : 'running'">
            流水线状态：{{ paused ? '已暂停（紧急停止）' : '运行中' }}
            <span class="hint">不合适就点紧急停止，会暂停消费并清空 MQ</span>
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
            <h3>MQ 队列</h3>
            <div class="queue-grid" v-if="queues.length">
                <div class="queue-card" v-for="q in queues" :key="q.name">
                    <div class="q-name">{{ q.name }}</div>
                    <div class="q-row"><span>积压</span><b>{{ q.messages }}</b></div>
                    <div class="q-row"><span>消费者</span><b>{{ q.consumers }}</b></div>
                    <div class="q-row"><span>并发</span><b>{{ q.concurrency }}</b></div>
                </div>
            </div>
            <div v-else class="empty">暂无队列信息</div>
        </div>

        <div class="section">
            <h3>正在处理</h3>
            <table v-if="activeJobs.length">
                <thead>
                    <tr>
                        <th>阶段</th>
                        <th>ID</th>
                        <th>平台</th>
                        <th>题号</th>
                        <th>标题</th>
                        <th>开始时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="j in activeJobs" :key="j.stage + '-' + j.problemId">
                        <td><span class="stage" :class="j.stage">{{ j.stage }}</span></td>
                        <td>
                            <router-link :to="`/question-bank/detail/${j.problemId}`">{{ j.problemId }}</router-link>
                        </td>
                        <td>{{ j.platform }}</td>
                        <td>{{ j.externalId }}</td>
                        <td>{{ j.title || '-' }}</td>
                        <td>{{ formatTime(j.startedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">当前没有正在处理的任务</div>
        </div>

        <div class="section">
            <h3>DB 中 FETCHING / TAGGING</h3>
            <table v-if="inProgress.length">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>平台</th>
                        <th>题号</th>
                        <th>标题</th>
                        <th>状态</th>
                        <th>更新时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in inProgress" :key="'ip-'+f.id">
                        <td>
                            <router-link :to="`/question-bank/detail/${f.id}`">{{ f.id }}</router-link>
                        </td>
                        <td>{{ f.platform }}</td>
                        <td>{{ f.externalId }}</td>
                        <td>{{ f.title }}</td>
                        <td>{{ f.status || f.errorMsg || '-' }}</td>
                        <td>{{ formatTime(f.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">无进行中记录</div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(true);
const acting = ref('');
const busy = computed(() => acting.value !== '');
const items = ref<{ status: string; count: number }[]>([]);
const failed = ref<any[]>([]);
const inProgress = ref<any[]>([]);
const activeJobs = ref<any[]>([]);
const queues = ref<any[]>([]);
const total = ref(0);
const paused = ref(false);
let timer: number | undefined;

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
        paused.value = !!res.data.paused;
        activeJobs.value = res.data.activeJobs || [];
        queues.value = res.data.queues || [];
        inProgress.value = res.data.inProgress || [];
    }
    loading.value = false;
};

const doBackfill = async () => {
    if (acting.value) return;
    acting.value = 'backfill';
    try {
        const res = await API.core.problem.backfill(0);
        Toast.stdResponse(res);
        if (res.success) await load();
    } finally {
        acting.value = '';
    }
};

const doStop = async () => {
    if (acting.value) return;
    if (!confirm('紧急停止：暂停消费并清空 MQ 队列？')) return;
    acting.value = 'stop';
    try {
        const res = await API.core.problem.emergencyStop();
        Toast.stdResponse(res);
        await load();
    } finally {
        acting.value = '';
    }
};

const doResume = async () => {
    if (acting.value) return;
    acting.value = 'resume';
    try {
        const res = await API.core.problem.resume();
        Toast.stdResponse(res);
        await load();
    } finally {
        acting.value = '';
    }
};

const doReset = async () => {
    if (acting.value) return;
    if (!confirm('全部重置：清空队列，非 COMPLETED 重置为 PENDING 并重新入队？')) return;
    acting.value = 'reset';
    try {
        const res = await API.core.problem.resetAll(true);
        Toast.stdResponse(res);
        await load();
    } finally {
        acting.value = '';
    }
};

onMounted(() => {
    load();
    timer = window.setInterval(load, 5000);
});
onUnmounted(() => {
    if (timer) window.clearInterval(timer);
});
</script>

<style scoped>
.dashboardContent { padding: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.header-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.banner { padding: 10px 12px; border-radius: 8px; margin-bottom: 14px; font-weight: 600; }
.banner.running { background: color-mix(in srgb, #2ecc71 18%, transparent); }
.banner.paused { background: color-mix(in srgb, #e74c3c 22%, transparent); }
.banner .hint { font-weight: 400; opacity: 0.8; margin-left: 10px; font-size: 0.85rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.stat-card { border: 1px solid var(--divider-color); border-radius: 10px; padding: 14px; }
.title-main { font-size: 0.85rem; opacity: 0.75; }
.data-value { font-size: 1.6rem; font-weight: 700; margin-top: 8px; }
.section { margin-bottom: 22px; }
.section h3 { margin: 0 0 10px; }
.queue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.queue-card { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; }
.q-name { font-weight: 700; margin-bottom: 8px; }
.q-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin: 4px 0; opacity: 0.9; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { padding: 8px; border-bottom: 1px solid var(--divider-color); text-align: left; vertical-align: top; }
.err { max-width: 280px; word-break: break-all; opacity: 0.85; }
.empty { opacity: 0.7; padding: 16px 0; }
.stage { padding: 2px 8px; border-radius: 999px; font-size: 0.8rem; }
.stage.fetch { background: #3498db33; }
.stage.analyze { background: #9b59b633; }
.btn { padding: 8px 14px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
.btn-primary { border-color: var(--primary-color, #4f8cff); }
.btn.danger { border-color: #e74c3c; color: #e74c3c; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
