<template>
    <BaseLayout>
        <div class="section">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-chart-line" />
                    </span>
                    <span class="title-text">{{ name }} 的所有动态 All-Activities</span>
                </div>
            </div>
            <div class="content">
                <div v-if="activities.length != 0" class="activities">
                    <div class="activity" v-for="(activity, index) in activities" :key="index">
                        <div class="title">
                            <span>{{ activity.title }}</span>
                            <a :href="activity.link" target="_blank">{{ activity.status }}</a>
                        </div>
                        <div class="time">{{ activity.time }}</div>
                    </div>
                </div>
                <div v-else>暂无近期动态</div>

                <!-- 触发加载更多的观察点 -->
                <div ref="loadMoreRef" class="load-more-trigger"></div>
                <!-- 加载状态提示 -->
                <div v-if="loading" class="loading">加载中...</div>
                <div v-if="noMoreData && !loading" class="no-more">没有更多数据了</div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue';
import axios from 'axios';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const userId = route.query.id;
const name = route.query.name;

interface Response {
    data: Datum[];
    [property: string]: any;
}

interface Datum {
    contest: string;
    id: number;
    lang: string;
    platform: platform;
    problem: string;
    status: string;
    submitId: string;
    time: string;
    userId: string;
    [property: string]: any;
}

interface ActivityItem {
    title: string;
    status: string;
    link: string;
    time: string;
    timeRaw: string;
}

const activities = ref<ActivityItem[]>([]);
const loading = ref(false);
const noMoreData = ref(false);
const observer = ref<IntersectionObserver | null>(null);
const loadMoreRef = ref<HTMLElement | null>(null);
const cursor = ref<number>(-1);

type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForce";

const getSubmitLink = (platform: platform, contest: string, submitId: string) => {
    switch (platform) {
        case "AtCoder":
            return `https://atcoder.jp/contests/${contest}/submissions/${submitId}`;
        case "NowCoder":
            return `https://ac.nowcoder.com/acm/contest/view-submission?submissionId=${submitId}`;
        case "LuoGu":
            return `https://www.luogu.com.cn/record/${submitId}`;
        case "CodeForce":
            return `https://codeforces.com/contest/${contest}/submission/${submitId}`;
        default:
            return "";
    }
}

const getNewSubmit = async (currentCursor: number) => {
    // console.log(`准备获取数据：loading:${loading.value}, noMoreData:${noMoreData.value}`);
    if (loading.value || noMoreData.value) return;
    loading.value = true;
    // console.log("获取数据中");
    try {
        const response = await axios.get<Response>('/api/core/submit-log/get-by-id', {
            params: {
                userId: userId,
                limit: 50,
                cursor: currentCursor
            }
        });

        if (response.status === 200 && response.data.data.length > 0) {
            const newActivities: ActivityItem[] = [];

            response.data.data.forEach(item => {
                const platform = item.platform;
                const lang = item.lang;
                const contest = item.contest;
                const problem = item.problem;
                const status = item.status;
                const time = new Date(Number(item.time) * 1000).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                newActivities.push({
                    title: `在 ${platform} 使用 ${lang} 解决 ${problem || contest}：`,
                    status: status,
                    link: getSubmitLink(platform, contest, item.submitId),
                    time: time,
                    timeRaw: item.time
                });
            });

            // 添加新数据
            activities.value = [...activities.value, ...newActivities];

            if (response.data.data.length > 0) {
                // 更新游标为最后一条数据的时间戳
                const lastItem: Datum | undefined = response.data.data[response.data.data.length - 1];
                if (lastItem) {
                    // console.log(`时间戳更新：${cursor.value} -> ${lastItem.time}`);

                    cursor.value = Number(lastItem.time);
                }
            }

        } else {
            // 没有更多数据
            noMoreData.value = true;
        }
    } catch (error: any) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// 初始化 Intersection Observer
const initIntersectionObserver = () => {
    // console.log("初始化观察者");

    if (!loadMoreRef.value) {
        // console.log("loadMoreRef不存在");
        return;
    };

    observer.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // console.log("观察者回调执行", entry.isIntersecting, loading.value, noMoreData.value);
            if (entry.isIntersecting && !loading.value && !noMoreData.value) {
                // console.log("观察者被触发");

                // 当触发元素进入视口且不在加载状态时，加载更多数据
                getNewSubmit(cursor.value);
            }
        });
    }, {
        root: null, // 使用视口作为根
        rootMargin: '100px', // 提前100px触发加载
        threshold: 0.1 // 当10%的元素可见时触发
    });

    nextTick(() => {
        if (loadMoreRef.value) {
            observer.value!.observe(loadMoreRef.value);
        }
    });
};

// 清理观察器
const cleanupObserver = () => {
    if (observer.value) {
        observer.value.disconnect();
        observer.value = null;
    }
};

onMounted(() => {
    // 首次加载数据
    getNewSubmit(cursor.value);

    // 初始化滚动监听
    nextTick(() => {
        initIntersectionObserver();
    });
});

// 组件卸载时清理观察器
onUnmounted(() => {
    cleanupObserver();
});
</script>

<style scoped>
.section {
    border: 1px solid var(--divider-color);
    border-radius: 6px;

    >.header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 10px;
        border-bottom: 1px solid var(--divider-color);
    }

    >.content {
        padding: 10px;
    }

    .header-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .header-tabs {
        display: flex;
        gap: 12px;

        .tab {
            padding: 6px 12px;
            border-radius: 6px;
            background-color: var(--section-background-color);
            color: var(--text-light-color);
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                color: var(--text-default-color);
                background-color: var(--divider-color);
            }

            &.active {
                background-color: var(--neon-cyan);
                color: var(--background-color-1);
                font-weight: 500;
            }
        }
    }

    .title-icon {
        font-size: 1.3rem;
    }

    .title-text {
        color: var(--text-default-color);
    }

    .header-actions {
        display: flex;
        gap: 16px;
    }
}

.activities {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .activity {
        position: relative;
        width: calc(100% - 20px);
        padding-left: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        >.time {
            font-size: 0.8rem;
            color: var(--text-light-color);
        }

        &::before {
            content: '';
            position: absolute;
            height: calc(100% + 10px);
            width: 3px;
            top: -5px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &:first-child::before {
            content: '';
            position: absolute;
            height: calc(100% + 15px);
            top: -10px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &:last-child::before {
            content: '';
            position: absolute;
            height: calc(100% + 15px);
            bottom: -10px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &::after {
            content: '';
            position: absolute;
            width: 5px;
            height: 5px;
            left: 6px;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid var(--neon-cyan);

            box-shadow: 0 0 5px var(--neon-cyan);
        }
    }
}

.load-more-trigger {
    height: 20px;
    margin: 10px 0;
}

.loading,
.no-more {
    text-align: center;
    padding: 10px;
    color: var(--text-light-color);
    font-size: 0.9rem;
}

.no-more {
    color: var(--text-light-color);
    font-style: italic;
}
</style>