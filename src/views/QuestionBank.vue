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
                    <button class="btn def" @click="toggleSort">
                        最近提交 {{ sort === 'latest_desc' ? '↓' : '↑' }}
                    </button>
                    <button class="btn def" @click="showFilter = !showFilter">
                        {{ showFilter ? '收起筛选' : '展开筛选' }}
                        <span v-if="activeFilterCount" class="badge">{{ activeFilterCount }}</span>
                    </button>
                </div>
            </div>

            <div class="filter" v-show="showFilter">
                <div class="filter-row">
                    <span class="label">搜索</span>
                    <input
                        class="tag-input"
                        v-model="keyword"
                        placeholder="标题 / 题号，输入即搜"
                        @input="onFilterChange"
                    />
                </div>
                <div class="filter-row">
                    <span class="label">平台</span>
                    <button
                        v-for="p in platforms"
                        :key="p"
                        type="button"
                        class="chip-btn"
                        :class="{ on: selectedPlatforms.includes(p) }"
                        @click="togglePlatform(p)"
                    >{{ p }}</button>
                </div>
                <div class="filter-row">
                    <span class="label">难度</span>
                    <button
                        v-for="d in difficulties"
                        :key="d || 'all'"
                        type="button"
                        class="chip-btn"
                        :class="{ on: difficulty === d }"
                        @click="setDifficulty(d)"
                    >{{ d || '全部' }}</button>
                </div>
                <div class="filter-row">
                    <span class="label">标签</span>
                    <div class="tag-area">
                        <button
                            v-for="t in commonTags"
                            :key="t"
                            type="button"
                            class="chip-btn sm"
                            :class="{ on: selectedTags.includes(t) }"
                            @click="toggleTag(t)"
                        >{{ t }}</button>
                        <input
                            class="tag-input inline"
                            v-model="tagDraft"
                            placeholder="自定义标签回车添加"
                            @keydown.enter.prevent="addCustomTag"
                        />
                    </div>
                </div>
                <div class="filter-row" v-if="userStore.isLogin">
                    <span class="label">状态</span>
                    <button
                        v-for="s in statusOptions"
                        :key="s.value || 'all'"
                        type="button"
                        class="chip-btn"
                        :class="{ on: userStatus === s.value }"
                        @click="setUserStatus(s.value)"
                    >{{ s.label }}</button>
                </div>
                <div class="filter-row active-row" v-if="activeFilterCount">
                    <span class="label">已选</span>
                    <div class="active-chips">
                        <span class="active-chip" v-if="keyword.trim()">
                            搜索: {{ keyword.trim() }}
                            <button type="button" @click="keyword = ''; onFilterChange()">×</button>
                        </span>
                        <span class="active-chip" v-for="p in selectedPlatforms" :key="'p'+p">
                            {{ p }}
                            <button type="button" @click="togglePlatform(p)">×</button>
                        </span>
                        <span class="active-chip" v-if="difficulty">
                            {{ difficulty }}
                            <button type="button" @click="setDifficulty('')">×</button>
                        </span>
                        <span class="active-chip" v-for="t in selectedTags" :key="'t'+t">
                            {{ t }}
                            <button type="button" @click="toggleTag(t)">×</button>
                        </span>
                        <span class="active-chip" v-if="userStatus">
                            {{ formatUserStatus(userStatus) }}
                            <button type="button" @click="setUserStatus('')">×</button>
                        </span>
                        <button type="button" class="btn def sm" @click="clearFilters">清除全部</button>
                    </div>
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
                            <td @click.stop>
                                <span
                                    v-for="t in (item.tags || []).slice(0, 4)"
                                    :key="t"
                                    class="tag clickable"
                                    @click="filterByTag(t)"
                                >{{ t }}</span>
                            </td>
                            <td>{{ formatUserStatus(item.userStatus) }}</td>
                            <td>{{ formatTime(item.lastSubmittedAt) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!loading && list.length === 0" class="empty">暂无题目</div>

                <div class="pageNavigation" v-if="totalPages > 0">
                    <div class="group">
                        <div class="pageButtons">
                            <button :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button
                                v-for="p in pageNumbers"
                                :key="String(p)"
                                :class="{ active: p === page, ellipsis: p === '...' }"
                                :disabled="p === '...'"
                                @click="p !== '...' && goPage(Number(p))"
                            >{{ p }}</button>
                        </div>
                        <div class="pageButtons">
                            <button :disabled="page >= totalPages" @click="goPage(page + 1)">下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageInput">
                            <button @click="jumpTo">跳转</button>
                            <input type="number" min="1" :max="totalPages" v-model.number="jumpPage" @keyup.enter="jumpTo">
                        </div>
                        <div class="pageSum">共 {{ totalPages }} 页 · {{ total }} 题</div>
                    </div>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import JWT from '@/utils/jwt';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const platforms = ['CodeForces', 'AtCoder', 'LuoGu', 'NowCoder', 'QOJ', 'LeetCode'];
const difficulties = ['', '简单', '中等', '困难'];
const commonTags = [
    '动态规划', '图论', '贪心', '二分', '数据结构',
    '数学', '字符串', '搜索', '最短路', '树',
    '并查集', '线段树', '数论', '组合', '构造',
];
const statusOptions = [
    { value: '', label: '全部' },
    { value: 'AC', label: '已通过' },
    { value: 'TRIED', label: '尝试过' },
    { value: 'NONE', label: '未做' },
];

const selectedPlatforms = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const tagDraft = ref('');
const keyword = ref('');
const difficulty = ref('');
const userStatus = ref('');
const sort = ref('latest_desc');
const showFilter = ref(true);
const loading = ref(false);
const list = ref<ProblemInfo[]>([]);
const page = ref(1);
const pageSize = 20;
const total = ref(0);
const jumpPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

const activeFilterCount = computed(() => {
    let n = 0;
    if (keyword.value.trim()) n++;
    n += selectedPlatforms.value.length;
    if (difficulty.value) n++;
    n += selectedTags.value.length;
    if (userStatus.value) n++;
    return n;
});

const pageNumbers = computed(() => {
    const totalP = totalPages.value;
    const cur = page.value;
    if (totalP <= 9) {
        return Array.from({ length: totalP }, (_, i) => i + 1) as (number | string)[];
    }
    const set = new Set<number>();
    set.add(1);
    set.add(totalP);
    for (let i = cur - 2; i <= cur + 2; i++) {
        if (i >= 1 && i <= totalP) set.add(i);
    }
    const sorted = Array.from(set).sort((a, b) => a - b);
    const out: (number | string)[] = [];
    for (let i = 0; i < sorted.length; i++) {
        const curN = sorted[i]!;
        if (i > 0) {
            const prevN = sorted[i - 1]!;
            if (curN - prevN > 1) out.push('...');
        }
        out.push(curN);
    }
    return out;
});

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

let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let suppressQueryWatch = false;

const syncQuery = () => {
    const q: Record<string, string> = {};
    if (page.value > 1) q.page = String(page.value);
    if (sort.value !== 'latest_desc') q.sort = sort.value;
    if (selectedPlatforms.value.length) q.platforms = selectedPlatforms.value.join(',');
    if (selectedTags.value.length) q.tags = selectedTags.value.join(',');
    if (userStatus.value) q.userStatus = userStatus.value;
    if (keyword.value.trim()) q.keyword = keyword.value.trim();
    if (difficulty.value) q.difficulty = difficulty.value;
    suppressQueryWatch = true;
    router.replace({ path: '/question-bank', query: q }).finally(() => {
        // 下一 tick 再放开，避免 replace 触发重复 load
        setTimeout(() => { suppressQueryWatch = false; }, 0);
    });
};

const readQuery = () => {
    const q = route.query;
    const p = Number(q.page);
    page.value = p > 0 ? p : 1;
    jumpPage.value = page.value;
    sort.value = typeof q.sort === 'string' && q.sort ? q.sort : 'latest_desc';
    selectedPlatforms.value = typeof q.platforms === 'string' && q.platforms
        ? q.platforms.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    selectedTags.value = typeof q.tags === 'string' && q.tags
        ? q.tags.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    tagDraft.value = '';
    keyword.value = typeof q.keyword === 'string' ? q.keyword : '';
    difficulty.value = typeof q.difficulty === 'string' ? q.difficulty : '';
    userStatus.value = typeof q.userStatus === 'string' ? q.userStatus : '';
};

const load = async () => {
    loading.value = true;
    const uid = JWT.getUserInfo()?.userId;
    const res = await API.core.problem.list({
        page: page.value,
        pageSize,
        sort: sort.value,
        platforms: selectedPlatforms.value.join(','),
        tags: selectedTags.value.join(','),
        userStatus: userStatus.value || undefined,
        userId: uid,
        keyword: keyword.value.trim() || undefined,
        difficulty: difficulty.value || undefined,
    });
    Toast.stdResponse(res, false);
    if (res.success) {
        list.value = res.data.data;
        total.value = res.data.total;
        if (page.value > totalPages.value) {
            page.value = totalPages.value;
            jumpPage.value = page.value;
            syncQuery();
            loading.value = false;
            if (total.value > 0) await load();
            return;
        }
        jumpPage.value = page.value;
    }
    loading.value = false;
};

const applyAndLoad = (resetPage = true) => {
    if (resetPage) page.value = 1;
    syncQuery();
    load();
};

const onFilterChange = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyAndLoad(true), 320);
};

const togglePlatform = (p: string) => {
    const i = selectedPlatforms.value.indexOf(p);
    if (i >= 0) selectedPlatforms.value.splice(i, 1);
    else selectedPlatforms.value.push(p);
    applyAndLoad(true);
};

const setDifficulty = (d: string) => {
    difficulty.value = d;
    applyAndLoad(true);
};

const setUserStatus = (s: string) => {
    userStatus.value = s;
    applyAndLoad(true);
};

const toggleTag = (t: string) => {
    const i = selectedTags.value.indexOf(t);
    if (i >= 0) selectedTags.value.splice(i, 1);
    else selectedTags.value.push(t);
    applyAndLoad(true);
};

const addCustomTag = () => {
    const t = tagDraft.value.trim();
    if (!t) return;
    if (!selectedTags.value.includes(t)) selectedTags.value.push(t);
    tagDraft.value = '';
    applyAndLoad(true);
};

const filterByTag = (t: string) => {
    showFilter.value = true;
    if (!selectedTags.value.includes(t)) selectedTags.value.push(t);
    applyAndLoad(true);
};

const clearFilters = () => {
    keyword.value = '';
    selectedPlatforms.value = [];
    selectedTags.value = [];
    difficulty.value = '';
    userStatus.value = '';
    tagDraft.value = '';
    applyAndLoad(true);
};

const goPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages.value);
    if (next === page.value) return;
    page.value = next;
    jumpPage.value = next;
    syncQuery();
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const jumpTo = () => {
    const p = Number(jumpPage.value);
    if (!p || p < 1) return;
    goPage(p);
};

const toggleSort = () => {
    sort.value = sort.value === 'latest_desc' ? 'latest_asc' : 'latest_desc';
    applyAndLoad(true);
};

const goDetail = (id: number) => {
    router.push(`/question-bank/detail/${id}`);
};

onMounted(() => {
    readQuery();
    load();
});

onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
});

watch(() => route.query, () => {
    if (route.path !== '/question-bank') return;
    if (suppressQueryWatch) return;
    readQuery();
    load();
});
</script>

<style scoped>
.container { width: 100%; padding: 12px; box-sizing: border-box; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; flex-wrap: wrap; }
.header-title { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; font-weight: 600; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.filter { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.filter-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 10px; }
.filter-row:last-child { margin-bottom: 0; }
.label { min-width: 40px; opacity: 0.8; font-size: 0.9rem; }
.tag-area { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; align-items: center; }
.tag-input {
    flex: 1;
    min-width: 200px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
}
.tag-input.inline { flex: 0 1 160px; min-width: 120px; }
.chip-btn {
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 0.85rem;
}
.chip-btn.sm { padding: 3px 8px; font-size: 0.8rem; }
.chip-btn.on {
    border-color: var(--primary-color, #4f8cff);
    background: color-mix(in srgb, var(--primary-color, #4f8cff) 18%, transparent);
    font-weight: 600;
}
.chip-btn:hover { border-color: var(--primary-color, #4f8cff); }
.active-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; flex: 1; }
.active-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--primary-color, #4f8cff) 15%, transparent);
}
.active-chip button {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 0 2px;
    opacity: 0.75;
    font-size: 0.95rem;
    line-height: 1;
}
.badge {
    display: inline-block;
    margin-left: 4px;
    min-width: 18px;
    padding: 0 5px;
    border-radius: 999px;
    font-size: 0.75rem;
    background: var(--primary-color, #4f8cff);
    color: #fff;
}
.table-wrap { overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 8px; border-bottom: 1px solid var(--divider-color); text-align: left; vertical-align: top; }
th { opacity: 0.75; font-weight: 500; }
.row { cursor: pointer; }
.row:hover { background: color-mix(in srgb, var(--primary-color, #4f8cff) 8%, transparent); }
.title { font-weight: 500; }
.sub { font-size: 0.8rem; opacity: 0.6; margin-top: 2px; }
.tag {
    display: inline-block;
    margin: 2px 4px 2px 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.75rem;
    background: color-mix(in srgb, var(--primary-color, #4f8cff) 15%, transparent);
}
.tag.clickable { cursor: pointer; }
.tag.clickable:hover { outline: 1px solid var(--primary-color, #4f8cff); }
.diff { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
.diff.easy, .diff.简单 { background: #2ecc7133; }
.diff.medium, .diff.中等 { background: #f1c40f33; }
.diff.hard, .diff.困难 { background: #e74c3c33; }
.empty { text-align: center; padding: 40px; opacity: 0.7; }
.btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
    cursor: pointer;
}
.btn.sm { padding: 4px 10px; font-size: 0.85rem; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn.def:hover:not(:disabled) { border-color: var(--primary-color, #4f8cff); }

.pageNavigation {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    padding: 8px 0;
}
.pageNavigation .group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}
.pageButtons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.pageButtons button {
    min-width: 36px;
    height: 34px;
    padding: 0 10px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 0.9rem;
}
.pageButtons button:hover:not(:disabled):not(.ellipsis) {
    border-color: var(--primary-color, #4f8cff);
}
.pageButtons button.active {
    background: color-mix(in srgb, var(--primary-color, #4f8cff) 22%, transparent);
    border-color: var(--primary-color, #4f8cff);
    font-weight: 600;
}
.pageButtons button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.pageButtons button.ellipsis {
    border: none;
    min-width: 20px;
    cursor: default;
    opacity: 0.6;
}
.pageInput {
    display: flex;
    align-items: center;
    gap: 6px;
}
.pageInput input {
    width: 64px;
    height: 32px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
}
.pageInput button {
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: inherit;
    cursor: pointer;
}
.pageSum {
    font-size: 0.85rem;
    opacity: 0.75;
}
</style>
