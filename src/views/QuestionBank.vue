<template>
    <BaseLayout>
        <div class="container">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-book" />
                    </span>
                    <span class="title-text">题库</span>
                </div>
                <div class="header-actions">
                    <button class="btn def" @click="sort = sort === 'latest_desc' ? 'latest_asc' : 'latest_desc'; load()">
                        最近提交 {{ sort === 'latest_desc' ? '↓' : '↑' }}
                    </button>
                    <button class="btn def" @click="showFilter = !showFilter">筛选</button>
                </div>
            </div>

            <div class="filter" v-if="showFilter">
                <div class="filter-row">
                    <span class="label">平台</span>
                    <label v-for="p in platforms" :key="p" class="chk">
                        <input type="checkbox" :value="p" v-model="selectedPlatforms" /> {{ p }}
                    </label>
                </div>
                <div class="filter-row">
                    <span class="label">标签</span>
                    <input class="tag-input" v-model="tagInput" placeholder="逗号分隔，如 动态规划,图论" />
                </div>
                <div class="filter-row" v-if="userStore.isLogin">
                    <span class="label">状态</span>
                    <label class="chk"><input type="radio" value="" v-model="userStatus" /> 全部</label>
                    <label class="chk"><input type="radio" value="AC" v-model="userStatus" /> 已通过</label>
                    <label class="chk"><input type="radio" value="TRIED" v-model="userStatus" /> 尝试过</label>
                    <label class="chk"><input type="radio" value="NONE" v-model="userStatus" /> 未做</label>
                </div>
                <div class="filter-row">
                    <button class="btn def" @click="page = 1; load()">应用</button>
                </div>
            </div>

            <div class="table-wrap" style="position: relative;">
                <LoadingOverlay :show="loading" />
                <table>
                    <thead>
                        <tr>
                            <th>题目</th>
                            <th style="width: 110px;">平台</th>
                            <th style="width: 80px;">难度</th>
                            <th>标签</th>
                            <th style="width: 90px;">我的状态</th>
                            <th style="width: 160px;">最近提交</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id" @click="goDetail(item.id)" class="row">
                            <td>
                                <div class="title">{{ item.title || item.externalId }}</div>
                                <div class="sub">{{ item.externalId }}</div>
                            </td>
                            <td>{{ item.platform }}</td>
                            <td>
                                <span class="diff" :class="(item.difficulty || '').toLowerCase()">{{ item.difficulty || '-' }}</span>
                            </td>
                            <td>
                                <span v-for="t in (item.tags || []).slice(0, 4)" :key="t" class="tag">{{ t }}</span>
                            </td>
                            <td>{{ formatUserStatus(item.userStatus) }}</td>
                            <td>{{ formatTime(item.lastSubmittedAt) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!loading && list.length === 0" class="empty">暂无题目</div>
                <div class="pager">
                    <button class="btn def" :disabled="page <= 1" @click="page--; load()">上一页</button>
                    <span>{{ page }} / {{ totalPages }}</span>
                    <button class="btn def" :disabled="page >= totalPages" @click="page++; load()">下一页</button>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import API, { type ProblemInfo } from '@/utils/api';
import Toast from '@/utils/toast';
import { useUserStore } from '@/stores/user';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import JWT from '@/utils/jwt';

const router = useRouter();
const userStore = useUserStore();

const platforms = ['CodeForces', 'AtCoder', 'LuoGu', 'NowCoder', 'QOJ', 'LeetCode'];
const selectedPlatforms = ref<string[]>([]);
const tagInput = ref('');
const userStatus = ref('');
const sort = ref('latest_desc');
const showFilter = ref(false);
const loading = ref(false);
const list = ref<ProblemInfo[]>([]);
const page = ref(1);
const pageSize = 20;
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

const formatTime = (ts: number) => {
    if (!ts) return '-';
    return new Date(ts * 1000).toLocaleString('sv-SE', { hour12: false });
};

const formatUserStatus = (s?: string) => {
    switch ((s || '').toUpperCase()) {
        case 'AC': return '已通过';
        case 'TRIED': return '尝试过';
        case 'NONE': return '未做';
        default: return s || '-';
    }
};

const goDetail = (id: number) => router.push(`/question-bank/detail/${id}`);

const load = async () => {
    loading.value = true;
    const uid = JWT.getUserInfo()?.userId;
    const res = await API.core.problem.list({
        page: page.value,
        pageSize,
        sort: sort.value,
        platforms: selectedPlatforms.value.join(','),
        tags: tagInput.value,
        userStatus: userStatus.value || undefined,
        userId: uid,
    });
    Toast.stdResponse(res, false);
    if (res.success) {
        list.value = res.data.data;
        total.value = res.data.total;
        page.value = res.data.page;
    }
    loading.value = false;
};

onMounted(load);
</script>

<style scoped>
.container { width: 100%; padding: 12px; box-sizing: border-box; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.header-title { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; font-weight: 600; }
.header-actions { display: flex; gap: 8px; }
.filter { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.filter-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 8px; }
.label { min-width: 48px; opacity: 0.8; }
.chk { display: flex; align-items: center; gap: 4px; font-size: 0.9rem; }
.tag-input { flex: 1; min-width: 200px; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; }
.table-wrap { overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 8px; border-bottom: 1px solid var(--divider-color); text-align: left; vertical-align: top; }
th { opacity: 0.75; font-weight: 500; }
.row { cursor: pointer; }
.row:hover { background: color-mix(in srgb, var(--primary-color, #4f8cff) 8%, transparent); }
.title { font-weight: 500; }
.sub { font-size: 0.8rem; opacity: 0.6; margin-top: 2px; }
.tag { display: inline-block; margin: 2px 4px 2px 0; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; background: color-mix(in srgb, var(--primary-color, #4f8cff) 15%, transparent); }
.diff { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
.diff.easy { background: #2ecc7133; }
.diff.medium { background: #f1c40f33; }
.diff.hard { background: #e74c3c33; }
.pager { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 16px; }
.empty { text-align: center; padding: 40px; opacity: 0.7; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn.def:hover:not(:disabled) { border-color: var(--primary-color, #4f8cff); }
</style>
