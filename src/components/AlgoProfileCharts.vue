<template>
    <div class="algo-profile" style="position: relative;">
        <LoadingOverlay :show="loading" />
        <div class="header">
            <div class="header-title">
                <span class="title-icon"><font-awesome-icon icon="fa-solid fa-chart-pie" /></span>
                <span class="title-text">算法画像</span>
            </div>
            <div class="total" v-if="totalAc">AC 题数 {{ totalAc }}</div>
        </div>
        <div class="charts" v-if="hasData">
            <div class="chart-box">
                <VChart class="chart" :option="radarOption" autoresize />
            </div>
            <div class="chart-box">
                <VChart class="chart" :option="platformOption" autoresize />
            </div>
            <div class="chart-box">
                <VChart class="chart" :option="diffOption" autoresize />
            </div>
        </div>
        <div v-else class="empty">暂无算法画像数据（需提交沉淀并完成 AI 打标）</div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import API from '@/utils/api';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { RadarChart, PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, RadarComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, RadarChart, PieChart, TooltipComponent, LegendComponent, RadarComponent]);

const props = defineProps<{ userId: number }>();
const loading = ref(false);
const radar = ref<{ tag: string; score: number; acCount: number }[]>([]);
const platforms = ref<{ name: string; count: number }[]>([]);
const difficulties = ref<{ name: string; count: number }[]>([]);
const totalAc = ref(0);

const hasData = computed(() => radar.value.length + platforms.value.length + difficulties.value.length > 0);

const radarOption = computed(() => {
    const indicators = radar.value.map(r => ({ name: r.tag, max: 100 }));
    const values = radar.value.map(r => r.score);
    if (!indicators.length) {
        return { title: { text: '雷达', left: 'center', textStyle: { fontSize: 12 } } };
    }
    return {
        tooltip: {},
        radar: { indicator: indicators, radius: '60%' },
        series: [{ type: 'radar', data: [{ value: values, name: '掌握度' }] }],
    };
});

const platformOption = computed(() => ({
    tooltip: { trigger: 'item' },
    title: { text: '平台分布', left: 'center', textStyle: { fontSize: 12 } },
    series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        data: platforms.value.map(p => ({ name: p.name, value: p.count })),
    }],
}));

const diffOption = computed(() => ({
    tooltip: { trigger: 'item' },
    title: { text: '难度分布', left: 'center', textStyle: { fontSize: 12 } },
    series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        data: difficulties.value.map(p => ({ name: p.name, value: p.count })),
    }],
}));

const load = async () => {
    if (!props.userId || props.userId <= 0) return;
    loading.value = true;
    const res = await API.core.problem.userProfile(props.userId);
    if (res.success) {
        radar.value = res.data.radar || [];
        platforms.value = res.data.platforms || [];
        difficulties.value = res.data.difficulties || [];
        totalAc.value = res.data.totalAc || 0;
    }
    loading.value = false;
};

onMounted(load);
watch(() => props.userId, load);
</script>

<style scoped>
.algo-profile { width: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.header-title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.total { font-size: 0.85rem; opacity: 0.75; }
.charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; }
.chart-box { height: 240px; border: 1px solid var(--divider-color); border-radius: 8px; }
.chart { width: 100%; height: 100%; }
.empty { opacity: 0.7; padding: 16px 0; text-align: center; }
</style>
