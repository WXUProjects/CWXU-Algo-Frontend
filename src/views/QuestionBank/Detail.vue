<template>
    <BaseLayout>
        <div class="container" style="position: relative;">
            <LoadingOverlay :show="loading" />
            <div class="top-bar">
                <button class="btn def" @click="goBack">← 返回题库</button>
            </div>
            <div v-if="problem" class="detail">
                <div class="meta">
                    <h1>{{ problem.title || problem.externalId }}</h1>
                    <div class="chips">
                        <span class="chip">{{ problem.platform }}</span>
                        <span class="chip">{{ problem.externalId }}</span>
                        <span class="chip" v-if="problem.difficulty">{{ problem.difficulty }}</span>
                        <span class="chip" v-if="problem.problemType">{{ problem.problemType }}</span>
                    </div>
                    <div class="tags">
                        <span class="tag" v-for="t in problem.tags || []" :key="t">{{ t }}</span>
                    </div>
                    <a v-if="problem.url" :href="problem.url" target="_blank" class="ext">原站题面 ↗</a>
                </div>

                <div class="section">
                    <div class="section-title">题面</div>
                    <div class="content-md markdown-body" v-if="problem.contentMd" v-html="renderedMd"></div>
                    <div class="empty" v-else>题面准备中，请稍后刷新</div>
                </div>

                <div class="section" v-if="problem.solutions?.length">
                    <div class="section-title">推荐解法</div>
                    <div class="sol" v-for="(s, i) in problem.solutions" :key="i">
                        <div class="sol-name">{{ s.name }}</div>
                        <div class="sol-meta">时间 {{ s.timeComplexity || '-' }} · 空间 {{ s.spaceComplexity || '-' }}</div>
                        <div class="sol-brief">{{ s.briefExplanation }}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">提交历史</div>
                    <table v-if="subs.length">
                        <thead>
                            <tr>
                                <th>用户</th>
                                <th>语言</th>
                                <th>结果</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="s in subs" :key="s.id">
                                <td>
                                    <router-link :to="`/profile?id=${s.userId}`">{{ s.userName || ('#' + s.userId) }}</router-link>
                                </td>
                                <td>{{ s.lang }}</td>
                                <td>{{ s.status }}</td>
                                <td>{{ formatTime(s.time) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="empty">暂无提交记录</div>
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
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { renderMarkdown } from '@/utils/markdown';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const problem = ref<ProblemInfo | null>(null);
const subs = ref<any[]>([]);

const renderedMd = computed(() => renderMarkdown(problem.value?.contentMd || ''));

const formatTime = (ts: number) => {
    if (!ts) return '-';
    return new Date(Number(ts) * 1000).toLocaleString('sv-SE', { hour12: false });
};

const load = async () => {
    loading.value = true;
    const id = Number(route.params.id);
    const res = await API.core.problem.get(id);
    Toast.stdResponse(res, false);
    if (res.success) problem.value = res.data;
    const subRes = await API.core.problem.submissions(id, 1, 50);
    if (subRes.success) subs.value = subRes.data.data || [];
    loading.value = false;
};

// 返回题库时尽量带上列表 query（若 history 里有）
const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/question-bank');
};

onMounted(load);
watch(() => route.params.id, load);
</script>

<style scoped>
.container { width: 100%; padding: 12px; box-sizing: border-box; max-width: 960px; }
.top-bar { margin-bottom: 12px; }
h1 { margin: 0 0 10px; font-size: 1.4rem; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.chip { padding: 2px 10px; border-radius: 999px; border: 1px solid var(--divider-color); font-size: 0.85rem; }
.tags { margin-bottom: 8px; }
.tag { display: inline-block; margin: 2px 4px 2px 0; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; background: color-mix(in srgb, var(--primary-color, #4f8cff) 15%, transparent); }
.ext { font-size: 0.9rem; }
.section { margin-top: 20px; border-top: 1px solid var(--divider-color); padding-top: 14px; }
.section-title { font-weight: 600; margin-bottom: 10px; }
.content-md { line-height: 1.7; font-size: 0.95rem; overflow-wrap: anywhere; }
.content-md :deep(h1),
.content-md :deep(h2),
.content-md :deep(h3),
.content-md :deep(h4) {
    margin: 1.1em 0 0.5em;
    font-weight: 650;
    line-height: 1.3;
}
.content-md :deep(h1) { font-size: 1.25rem; }
.content-md :deep(h2) { font-size: 1.12rem; }
.content-md :deep(h3) { font-size: 1.02rem; }
.content-md :deep(p) { margin: 0.55em 0; }
.content-md :deep(ul),
.content-md :deep(ol) { margin: 0.5em 0; padding-left: 1.4em; }
.content-md :deep(li) { margin: 0.25em 0; }
.content-md :deep(blockquote) {
    margin: 0.8em 0;
    padding: 0.4em 0.9em;
    border-left: 3px solid var(--divider-color);
    opacity: 0.92;
}
.content-md :deep(code) {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.88em;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: color-mix(in srgb, var(--divider-color) 45%, transparent);
}
.content-md :deep(pre) {
    margin: 0.8em 0;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    overflow: auto;
    background: color-mix(in srgb, var(--divider-color) 25%, transparent);
}
.content-md :deep(pre code) {
    padding: 0;
    background: transparent;
    font-size: 0.86rem;
}
.content-md :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8em 0;
}
.content-md :deep(th),
.content-md :deep(td) {
    border: 1px solid var(--divider-color);
    padding: 6px 8px;
    text-align: left;
}
.content-md :deep(a) { color: var(--neon-cyan, #4f8cff); }
.content-md :deep(hr) {
    border: none;
    border-top: 1px solid var(--divider-color);
    margin: 1em 0;
}
.content-md :deep(img) { max-width: 100%; height: auto; }
.content-md :deep(.katex) { font-size: 1.05em; }
.content-md :deep(.katex-display) {
    margin: 0.8em 0;
    overflow-x: auto;
    overflow-y: hidden;
}
.content-md :deep(.math-fallback) {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.88em;
    opacity: 0.9;
}
.sol { border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; margin-bottom: 8px; }
.sol-name { font-weight: 600; }
.sol-meta { font-size: 0.85rem; opacity: 0.7; margin: 4px 0; }
.sol-brief { font-size: 0.9rem; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-bottom: 1px solid var(--divider-color); text-align: left; }
.empty { opacity: 0.7; padding: 12px 0; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
</style>
