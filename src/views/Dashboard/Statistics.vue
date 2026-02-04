<template>
    <div class="dashboardContent">
        <h2>数据统计</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">用户数量</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ userCount }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">组数量</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ groupCount }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">总AC</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.ac.total }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">总提交</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.submit.total }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">今年AC</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.ac.thisYear }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend" :class="getTrendClass(periodData.ac.thisYear, periodData.ac.lastYear)">
                        <span class="trend-icon">{{ getTrend(periodData.ac.thisYear, periodData.ac.lastYear)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.ac.thisYear, periodData.ac.lastYear) }}</span>
                    </div>
                    <div class="footer-info">对比去年</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">今年提交</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.submit.thisYear }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend"
                        :class="getTrendClass(periodData.submit.thisYear, periodData.submit.lastYear)">
                        <span class="trend-icon">{{ getTrend(periodData.submit.thisYear, periodData.submit.lastYear)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.submit.thisYear, periodData.submit.lastYear) }}</span>
                    </div>
                    <div class="footer-info">对比去年</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">本月AC</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.ac.thisMonth }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend" :class="getTrendClass(periodData.ac.thisMonth, periodData.ac.lastMonth)">
                        <span class="trend-icon">{{ getTrend(periodData.ac.thisMonth, periodData.ac.lastMonth)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.ac.thisMonth, periodData.ac.lastMonth) }}</span>
                    </div>
                    <div class="footer-info">对比上月</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">本月提交</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.submit.thisMonth }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend"
                        :class="getTrendClass(periodData.submit.thisMonth, periodData.submit.lastMonth)">
                        <span class="trend-icon">{{ getTrend(periodData.submit.thisMonth, periodData.submit.lastMonth)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.submit.thisMonth, periodData.submit.lastMonth) }}</span>
                    </div>
                    <div class="footer-info">对比上月</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">本周AC</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.ac.thisWeek }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend" :class="getTrendClass(periodData.ac.thisWeek, periodData.ac.lastWeek)">
                        <span class="trend-icon">{{ getTrend(periodData.ac.thisWeek, periodData.ac.lastWeek)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.ac.thisWeek, periodData.ac.lastWeek) }}</span>
                    </div>
                    <div class="footer-info">对比上周</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">本周提交</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.submit.thisWeek }}</div>
                </div>
                <div class="card-footer">
                    <div class="footer-trend"
                        :class="getTrendClass(periodData.submit.thisWeek, periodData.submit.lastWeek)">
                        <span class="trend-icon">{{ getTrend(periodData.submit.thisWeek, periodData.submit.lastWeek)
                            }}</span>
                        <span class="trend-value">{{
                            getTrendValue(periodData.submit.thisWeek, periodData.submit.lastWeek) }}</span>
                    </div>
                    <div class="footer-info">对比上周</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">今日AC</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.ac.today }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
            <div class="stat-card">
                <div class="card-header">
                    <div class="card-title">
                        <div class="title-main">今日提交</div>
                    </div>
                </div>
                <div class="card-data">
                    <div class="data-value">{{ periodData.submit.today }}</div>
                </div>
                <!-- <div class="card-footer">
                    <div class="footer-trend">
                        <span class="trend-icon">-</span>
                        <span class="trend-value"></span>
                    </div>
                    <div class="footer-info">since yesterday</div>
                </div> -->
            </div>
        </div>
        <h2>提交趋势</h2>
        <div class="chart-container">
            <v-chart class="chart" :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script setup lang="ts">
import API, { type CoreStatisticPeriodData, type Datum as DailyData } from '@/utils/api';
import Toast from '@/utils/toast';
import { computed, onMounted, ref } from 'vue';

// 导入 ECharts 相关
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
    TooltipComponent,
    ToolboxComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

// 注册 ECharts 模块
use([
    CanvasRenderer,
    LineChart,
    TooltipComponent,
    ToolboxComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
]);

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
    const response = await API.user.profile.list(1);
    Toast.stdResponse(response, false);

    if (response.success) {
        userCount.value = response.data.total;
    }
}

const periodData = ref<CoreStatisticPeriodData>({
    ac: {
        lastMonth: 0,
        lastWeek: 0,
        lastYear: 0,
        thisMonth: 0,
        thisWeek: 0,
        thisYear: 0,
        today: 0,
        total: 0
    },
    submit: {
        lastMonth: 0,
        lastWeek: 0,
        lastYear: 0,
        thisMonth: 0,
        thisWeek: 0,
        thisYear: 0,
        today: 0,
        total: 0
    }
})

const getPeriodData = async () => {
    const response = await API.core.statistic.period(-1);
    Toast.stdResponse(response, false);

    periodData.value = response.data.data
}

/*
卧槽了惊天大无语，传的明明是数字却变成字符串了，逆天
*/
const getTrendClass = (curr: number, prev: number): string => {
    curr = Number(curr);
    prev = Number(prev);
    if (curr === prev) {
        return 'equal'
    } else if (curr > prev) {
        return 'up'
    } else {
        return 'down'
    }
}

const getTrendValue = (curr: number, prev: number): string => {
    curr = Number(curr);
    prev = Number(prev);
    // return (curr - prev >= 0 ? '+' : '') + ((curr - prev) / (prev === 0 ? 1 : prev) * 100).toFixed(2) + '%'
    return (curr - prev >= 0 ? '+' : '') + (curr - prev)
}

const getTrend = (curr: number, prev: number): string => {
    curr = Number(curr);
    prev = Number(prev);
    if (curr === prev) {
        return '-'
    } else if (curr > prev) {
        return '↗'
    } else {
        return '↘'
    }
}

const groupCount = ref(0);

const getGroupCount = async () => {
    const response = await API.user.group.list(1);
    Toast.stdResponse(response, false);

    if (response.success) {
        groupCount.value = response.data.total;
    }
}

/*
DailyData:
{
    count: number;
    date: string; // YYYY-MM-DD
}
*/

const acDataDaily = ref<DailyData[]>([])
const submitDataDaily = ref<DailyData[]>([])

const padZero = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
}

const getDailyData = async () => {
    const dateObj = new Date();
    const date = dateObj.getFullYear() + padZero(dateObj.getMonth() + 1) + padZero(dateObj.getDate());
    const responseAc = await API.core.statistic.heatmap({
        startDate: '20230101',
        endDate: date,
        isAc: true,
    });
    const responseSubmit = await API.core.statistic.heatmap({
        startDate: '20230101',
        endDate: date,
        isAc: false,
    });
    Toast.stdResponse(responseAc, false);
    Toast.stdResponse(responseAc, false);
    if (responseAc.success && responseSubmit.success) {
        acDataDaily.value = responseAc.data.data;
        submitDataDaily.value = responseSubmit.data.data;
    }
}

// 计算最近30天的起始索引
const calculateDefaultRange = (dates: string[]) => {
    if (dates.length <= 30) {
        // 如果总数据少于等于30天，则显示全部数据
        return {
            startIndex: 0,
            endIndex: dates.length - 1
        };
    } else {
        // 否则显示最后30天的数据
        const endIndex = dates.length - 1;
        const startIndex = Math.max(0, endIndex - 29); // 30天包括最后一天
        return {
            startIndex,
            endIndex
        };
    }
};

const chartOption = computed(() => {
    // 按日期排序数据
    const sortedAcData = [...acDataDaily.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedSubmitData = [...submitDataDaily.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 提取日期和数值
    const dates = sortedAcData.map(item => item.date);
    const acValues = sortedAcData.map(item => item.count);
    const submitValues = sortedSubmitData.map(item => item.count);

    // 计算默认显示范围
    const { startIndex, endIndex } = calculateDefaultRange(dates);

    // 计算默认缩放比例
    const startPercent = (startIndex / dates.length) * 100;
    const endPercent = (endIndex / dates.length) * 100;

    return {
        darkmode: "auto",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['AC', '提交'],
            top: 0,
            left: 'left'
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLabel: {
                    formatter: function (value: string) {
                        // 格式化日期显示，只显示月份和日期
                        const date = new Date(value);
                        return `${date.getMonth() + 1}-${date.getDate()}`;
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: false
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: startPercent,
                end: endPercent
            },
            {
                start: startPercent,
                end: endPercent,
                handleSize: '110%',
            }
        ],
        series: [
            {
                name: 'AC',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: acValues,
                smooth: true,
                showSymbol: false,
            },
            {
                name: '提交',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: submitValues,
                smooth: true,
                showSymbol: false,
            }
        ]
    };
});

onMounted(() => {
    getUserCount();
    getPeriodData();
    getGroupCount();
    getDailyData()
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
        border: 1px solid var(--divider-color);
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
        font-weight: 500;

        &.up {
            color: red;
        }

        &.down {
            color: green;
        }

        &.equal {
            color: var(--text-light-color);
        }
    }

    .trend-icon {
        font-size: 1.1rem;
    }

    .footer-info {
        font-size: 0.8rem;
        color: var(--text-light-color);
        opacity: 0.7;
    }

    .chart-container {
        width: 100%;
        height: 500px;
        margin-top: 20px;
    }

    .chart {
        width: 100%;
        height: 100%;
    }
}
</style>