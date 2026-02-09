<template>
    <BaseLayout>
        <div class="section">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-chart-line" />
                    </span>
                    <span class="title-text">{{ title }}所有动态</span>
                </div>
                <div class="header-tabs">
                    <span class="tab" @click="router.push(`/allActivities`)" v-if="userId != -1">查看大家的动态</span>
                    <span class="tab" @click="router.push(`/allActivities?id=${JWT.getUserInfo()?.userId}`)"
                        v-else>查看我的动态</span>
                </div>
            </div>
            <div class="content">
                <div v-if="activities.length != 0" class="activities">
                    <div class="activity" v-for="(activity, index) in activities" :key="index">
                        <div class="title">
                            <!-- <img :src="activity.avatar ? activity.avatar : '/images/defaultAvatar.png'"
                                @click="router.push('profile?id=' + activity.userId)" class="avatar"> -->
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
import Link from '@/utils/link';
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import API from '@/utils/api';
import Toast from '@/utils/toast';
import type { CoreSubmitLogGetByIdData } from '@/utils/api';
import { useRouter } from 'vue-router';
import JWT from '@/utils/jwt';

const route = useRoute();
const router = useRouter();

const userId = ref<number>(-1);
const title = ref('');

watch(() => route.query.id, async () => {
    await getParams();

    activities.value = [];
    loading.value = false;
    noMoreData.value = false;
    cursor.value = -1;
})

const getParams = async () => {
    userId.value = Number(route.query.id) ? Number(route.query.id) : -1;
    if (userId.value === -1) {
        title.value = "";
    } else {
        const response = await API.user.profile.getById(userId.value);
        Toast.stdResponse(response, false);
        if (response.success) {
            title.value = response.data.name + "的";
        } else {
            title.value = '';
        }
    }
}

// 使用用户列表存储用户信息
interface User {
    userId: number;
    name: string;
    avatar: string;
}
const users = ref<User[]>([]);


interface ActivityItem {
    title: string;
    status: string;
    link: string;
    time: string;
    timeRaw: string;
    avatar: string;
    userId: number;
}

const activities = ref<ActivityItem[]>([]);
const loading = ref(false);
const noMoreData = ref(false);
const observer = ref<IntersectionObserver | null>(null);
const loadMoreRef = ref<HTMLElement | null>(null);
const cursor = ref<number>(-1);

const getNewSubmit = async (currentCursor: number) => {
    // console.log(`准备获取数据：loading:${loading.value}, noMoreData:${noMoreData.value}`);
    if (loading.value || noMoreData.value) return;
    loading.value = true;
    // console.log("获取数据中");

    const response = await API.core.submitLog.getById(userId.value, currentCursor);
    Toast.stdResponse(response, false);


    if (response.success && response.data.data.length > 0) {
        const newActivities: ActivityItem[] = [];

        // 内部使用了 await，所以这里不能使用 forEach
        // 使用forEach会因为users更新不及时造成大量重复网络请求
        for (const item of response.data.data) {
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

            const user = await getUserInfo(item.userId);

            newActivities.push({
                title: `${user.name} 在 ${platform} 使用 ${lang} 解决 ${problem || contest}：`,
                status: status,
                link: Link.getSubmitLink(platform, contest, item.submitId),
                time: time,
                timeRaw: item.time,
                avatar: user.avatar,
                userId: item.userId
            });
        };

        // 添加新数据
        activities.value = [...activities.value, ...newActivities];

        if (response.data.data.length > 0) {
            // 更新游标为最后一条数据的时间戳
            const lastItem: CoreSubmitLogGetByIdData | undefined = response.data.data[response.data.data.length - 1];
            if (lastItem) {
                // console.log(`时间戳更新：${cursor.value} -> ${lastItem.time}`);

                cursor.value = Number(lastItem.time);
            }
        }
    } else {
        // 没有更多数据
        noMoreData.value = true;
    }

    loading.value = false;
}

const getUserInfo = async (userId: number) => {
    const user = users.value.find(item => item.userId === userId)
    if (user) {
        return user;
    } else {
        const response = await API.user.profile.getById(userId);
        Toast.stdResponse(response, false);

        const user = {
            userId: 0,
            name: "",
            avatar: ""
        };

        if (response.success) {
            user.userId = response.data.userId
            user.name = response.data.name
            user.avatar = response.data.avatar
            users.value.push(user);
        }
        return user;
    }
}

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
    getParams();

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
        font-size: var(--text-lg);
        font-weight: 600;
    }

    .header-tabs {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 12px;

        .tab {
            padding: 6px 12px;
            border-radius: 6px;
            background-color: var(--section-background-color);
            color: var(--text-light-color);
            font-size: var(--text-base);
            white-space: nowrap;
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
        font-size: var(--text-base);
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

        >.title {
            display: flex;
            align-items: center;
            width: 80%;
            font-size: var(--text-sm);

            >.avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 10px;
                cursor: pointer;
            }
        }

        >.time {
            display: flex;
            justify-content: flex-end;
            width: 20%;
            font-size: var(--text-xs);
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
    font-size: var(--text-sm);
}

.no-more {
    color: var(--text-light-color);
    font-style: italic;
}
</style>