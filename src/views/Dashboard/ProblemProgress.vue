<template>
    <div class="dashboardContent">
        <div class="page-header">
            <h2>题库识别进度</h2>
            <div class="header-actions" v-if="userStore.isAdmin">
                <button class="btn" :class="analyzePaused ? '' : 'danger'" @click="doToggleAnalyze" :disabled="busy">
                    {{ analyzePaused ? '恢复 AI 分析' : '暂停 AI 分析' }}
                </button>
                <button class="btn" :class="fetchPaused ? '' : 'danger'" @click="doToggleFetch" :disabled="busy">
                    {{ fetchPaused ? '恢复题面爬取' : '暂停题面爬取' }}
                </button>
                <button class="btn" @click="doReset" :disabled="busy">重置 AI 分析</button>
                <button class="btn btn-primary" @click="doBackfill" :disabled="busy">
                    {{ acting === 'backfill' ? '回填中...' : '历史回填（近6月）' }}
                </button>
                <button class="btn btn-primary" @click="doRetryFailed" :disabled="busy">
                    {{ acting === 'retry' ? '重试中...' : '重试错误队列' }}
                </button>
                <button class="btn" @click="load" :disabled="busy">刷新</button>
            </div>
        </div>

        <div class="banner" :class="(analyzePaused || fetchPaused) ? 'paused' : 'running'">
            AI：{{ analyzePaused ? '已暂停' : '运行中' }} · 题面爬取：{{ fetchPaused ? '已暂停' : '运行中' }}
            <span class="hint">暂停会清空对应 MQ 队列；出错会自动重入队；待分析/永久失败仅统计近 6 个月，爬取与已完成全量</span>
        </div>

        <div style="position: relative;">
            <LoadingOverlay :show="loading" />
            <div class="stats-grid">
                <div class="stat-card" v-for="it in items" :key="it.status">
                    <div class="card-header">
                        <div class="card-title">
                            <div class="title-main">{{ statusLabel(it.status) }}</div>
                        </div>
                    </div>
                    <div class="card-data">
                        <div class="data-value">{{ it.count }}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="card-header">
                        <div class="card-title">
                            <div class="title-main">合计</div>
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
                        <td><span class="stage" :class="j.stage">{{ stageLabel(j.stage) }}</span></td>
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
            <h3>DB 中爬取中 / 待分析</h3>
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
                        <td>{{ statusLabel(f.status) || f.errorMsg || '-' }}</td>
                        <td>{{ formatTime(f.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">无进行中记录</div>
        </div>

        <div class="section">
            <h3>最近失败（可重试）</h3>
            <table v-if="failed.length">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>平台</th>
                        <th>题号</th>
                        <th>标题</th>
                        <th>爬取次数</th>
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
                        <td>{{ f.fetchAttempts ?? 0 }}/3</td>
                        <td class="err">{{ f.errorMsg }}</td>
                        <td>{{ formatTime(f.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">暂无失败记录</div>
        </div>

        <div class="section">
            <h3>永久失败</h3>
            <table v-if="failedPerm.length">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>平台</th>
                        <th>题号</th>
                        <th>标题</th>
                        <th>爬取次数</th>
                        <th>错误</th>
                        <th>时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in failedPerm" :key="'perm-'+f.id">
                        <td>
                            <router-link :to="`/question-bank/detail/${f.id}`">{{ f.id }}</router-link>
                        </td>
                        <td>{{ f.platform }}</td>
                        <td>{{ f.externalId }}</td>
                        <td>{{ f.title }}</td>
                        <td>{{ f.fetchAttempts ?? 0 }}</td>
                        <td class="err">{{ f.errorMsg }}</td>
                        <td>{{ formatTime(f.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty">暂无永久失败记录</div>
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
const failedPerm = ref<any[]>([]);
const inProgress = ref<any[]>([]);
const activeJobs = ref<any[]>([]);
const queues = ref<any[]>([]);
const total = ref(0);
const analyzePaused = ref(false);
const fetchPaused = ref(false);
let timer: number | undefined;

const statusLabelMap: Record<string, string> = {
    PENDING: '待爬取',
    FETCHING: '爬取中',
    TAGGING: '待分析(近6月)',
    COMPLETED: '已完成',
    FAILED: '失败(可重试·近6月)',
    FAILED_PERM: '永久失败(近6月)',
    SKIPPED: '已跳过(近6月)',
};

const statusLabel = (s?: string) => {
    if (!s) return '';
    return statusLabelMap[s] || s;
};

const stageLabel = (s?: string) => {
    if (s === 'fetch') return '爬取';
    if (s === 'analyze') return '分析';
    return s || '-';
};

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
        failedPerm.value = res.data.recentFailedPerm || [];
        total.value = res.data.total || 0;
        analyzePaused.value = !!(res.data.analyzePaused ?? res.data.paused);
        fetchPaused.value = !!res.data.fetchPaused;
        activeJobs.value = res.data.activeJobs || [];
        queues.value = res.data.queues || [];
        inProgress.value = res.data.inProgress || [];
    }
    loading.value = false;
};

const doBackfill = async () => {
    if (acting.value) return;
    if (!confirm('历史回填：仅近 6 个月；已识别跳过；有题面直接进 AI，无题面进爬取？')) return;
    acting.value = 'backfill';
    try {
        const res = await API.core.problem.backfill(0);
        Toast.stdResponse(res);
        if (res.success) await load();
    } finally {
        acting.value = '';
    }
};

const doRetryFailed = async () => {
    if (acting.value) return;
    if (!confirm('重试错误队列：仅重入 FAILED（可重试），排除 FAILED_PERM 黑名单？')) return;
    acting.value = 'retry';
    try {
        const res = await API.core.problem.retryFailed(0);
        Toast.stdResponse(res);
        if (res.success) await load();
    } finally {
        acting.value = '';
    }
};

const doToggleAnalyze = async () => {
    if (acting.value) return;
    const nextPause = !analyzePaused.value;
    if (nextPause && !confirm('暂停 AI 分析并清空 problem_analyze 队列？')) return;
    acting.value = 'toggle-analyze';
    try {
        const res = await API.core.problem.toggleAnalyze(nextPause);
        Toast.stdResponse(res);
        await load();
    } finally {
        acting.value = '';
    }
};

const doToggleFetch = async () => {
    if (acting.value) return;
    const nextPause = !fetchPaused.value;
    if (nextPause && !confirm('暂停题面爬取并清空 problem_fetch 队列？')) return;
    acting.value = 'toggle-fetch';
    try {
        const res = await API.core.problem.toggleFetch(nextPause);
        Toast.stdResponse(res);
        await load();
    } finally {
        acting.value = '';
    }
};

const doReset = async () => {
    if (acting.value) return;
    if (!confirm('重置 AI 分析：清除标签/难度/解法，保留题面，并重新入队 AI？')) return;
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
