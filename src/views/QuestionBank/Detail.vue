<template>
    <BaseLayout>
        <div class="container" style="position: relative;">
            <LoadingOverlay :show="loading" />
            <div class="top-bar">
                <button class="btn def" @click="router.push('/question-bank')">← 返回题库</button>
            </div>
            <div v-if="problem" class="detail">
                <div class="meta">
                    <h1>{{ problem.title || problem.externalId }}</h1>
                    <div class="chips">
                        <span class="chip">{{ problem.platform }}</span>
                        <span class="chip">{{ problem.externalId }}</span>
                        <span class="chip" v-if="problem.difficulty">{{ problem.difficulty }}</span>
                        <span class="chip">{{ problem.status }}</span>
                        <span class="chip" v-if="problem.problemType">{{ problem.problemType }}</span>
                    </div>
                    <div class="tags">
                        <span class="tag" v-for="t in problem.tags || []" :key="t">{{ t }}</span>
                    </div>
                    <a v-if="problem.url" :href="problem.url" target="_blank" class="ext">原站题面 ↗</a>
                </div>

                <div class="section">
                    <div class="section-title">题面</div>
                    <div class="content-md" v-if="problem.contentMd">{{ problem.contentMd }}</div>
                    <div class="empty" v-else-if="problem.status === 'PENDING' || problem.status === 'FETCHING'">
                        题面爬取中，请稍后刷新…
                    </div>
                    <div class="empty" v-else-if="problem.status === 'SKIPPED'">
                        该平台（如 LeetCode）暂不支持爬取题面
                    </div>
                    <div class="empty" v-else>
                        暂无题面{{ problem.errorMsg ? '：' + problem.errorMsg : '' }}
                    </div>
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
                                    <router-link :to="`/profile?id=${s.userId}`">#{{ s.userId }}</router-link>
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
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const problem = ref<ProblemInfo | null>(null);
const subs = ref<any[]>([]);

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
.content-md { white-space: pre-wrap; line-height: 1.6; font-family: inherit; font-size: 0.95rem; }
.sol { border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; margin-bottom: 8px; }
.sol-name { font-weight: 600; }
.sol-meta { font-size: 0.85rem; opacity: 0.7; margin: 4px 0; }
.sol-brief { font-size: 0.9rem; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-bottom: 1px solid var(--divider-color); text-align: left; }
.empty { opacity: 0.7; padding: 12px 0; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
</style>
