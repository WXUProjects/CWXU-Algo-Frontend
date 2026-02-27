<template>
    <BaseLayout>
        <template #header>
            比赛 Contest
        </template>
        <div>
            <div class="contestInfo">
                <div class="platform">{{ info.platform || "加载中" }}</div>
                <div class="title">{{ info.contestName || "加载中" }}</div>
                <div class="time">{{ info.time || "1970/1/1 00:00:00" }}</div>
                <div class="actions">
                    <div class="btn def" :class="loading ? 'dis' : ''" @click="toContest(info.contestUrl)">跳转到比赛主页</div>
                </div>
            </div>
            <Rank :data="rankData" title="比赛排行榜" :is-joined="false"></Rank>
            <div class="pageNavigation" v-if="data">
                <div class="group">
                    <div class="pageButtons" v-if="data.currentPage != 1">
                        <button @click="getRankData(data.currentPage - 1)">上一页</button>
                    </div>
                    <div class="pageButtons">
                        <button v-for="value in pages" :key="value" :class="value === data.currentPage ? 'active' : ''"
                            @click="value === data.currentPage ? null : getRankData(value)">{{ value
                            }}</button>
                    </div>
                    <div class="pageButtons" v-if="data.currentPage != data.totalPage">
                        <button @click="getRankData(data.currentPage + 1)">下一页</button>
                    </div>
                </div>
                <div class="group">
                    <div class="pageInput">
                        <button @click="getRankData(jumppage)">跳转</button>
                        <input type="number" min="1" :max="data.totalPage" v-model="jumppage">
                    </div>
                    <div class="pageSum">共 {{ data.totalPage }} 页</div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import Rank from '@/components/Rank.vue'
import API from '@/utils/api'
import Toast from '@/utils/toast'
import type { platform } from '@/utils/type'

// 从url获取id参数
const router = useRouter()
const route = useRoute()
const id = route.params.id

// 加载状态，用于加载时禁用按键
const loading = ref(false);

if (!id) {
    router.back();
}

const info = ref<{
    id: number;
    platform: platform;
    contestId: string;
    contestName: string;
    contestUrl: string;
    totalCount: number;
    time: string;
}>({
    id: 0,
    platform: 'NowCoder',
    contestId: '',
    contestName: '',
    contestUrl: '',
    totalCount: 0,
    time: ""
})

const data = ref<{
    list: rankDataItem[],
    total: number,
    totalPage: number,
    currentPage: number,
}>({
    list: [],
    total: 1,
    totalPage: 1,
    currentPage: 0
})

const jumppage = ref(1);

const pages = computed(() => {
    if (!data.value) return [];
    const currentPage = data.value.currentPage;
    const totalPage = data.value.totalPage;
    if (totalPage <= 3) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPage - 1) return [totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 1, currentPage, currentPage + 1];
})

const getRankData = async (page: number) => {
    if (!id) {
        router.back();
        return;
    }

    if (page > data.value.totalPage || page < 1 || page === data.value.currentPage) {
        return;
    }

    loading.value = true;

    const limit = 10
    const offset = (page - 1) * limit

    const response = await API.core.contest.ranking({
        contestId: id.toString(),
        limit,
        offset,
    })
    Toast.stdResponse(response, false)

    if (response.success) {
        const data = [];
        for (const item of response.data.data) {
            // const user = await API.user.profile.getById(item.userId);
            // Toast.stdResponse(user, false);
            data.push({
                userId: item.userId,
                avatar: item.avatar || '/images/defaultAvatar.png',
                name: item.name,
                rank: item.rank,
                score: item.acCount,
                change: 0
            })
        }
        rankData.value.data = data;

        info.value = response.data.contest;
    }

    loading.value = false;
}

interface rankDataItem {
    userId: number,
    avatar: string,
    name: string,
    rank: number,
    score: number,
    change: number
}

const rankData = ref<{
    data: rankDataItem[],
    scoreUnit: string,
    userRank: number,
    userName: string,
    userScore: number,
    totalPage: number
}>({
    "data": [],
    "scoreUnit": "AC",
    "userRank": 4,
    "userName": '赵六',
    "userScore": 9,
    "totalPage": 1
})

const toContest = (url: string) => {
    if (!loading.value) {
        window.open(url);
    }
}

onMounted(() => {
    getRankData(1);
})
</script>

<style scoped>
@import '@/assets/css/navagation.css';

.contestInfo {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: calc(100%-40px);
    padding: 20px;

    >.platform {
        color: var(--text-light-color);
        font-size: var(--text-sm);
    }

    >.title {
        color: var(--text-default-color);
        font-size: var(--text-2xl);
        font-weight: bold;
    }

    >.time {
        color: var(--text-light-color);
        font-size: var(--text-sm);
    }

    >.actions {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 5px;
    }
}

.btn {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: var(--background-color-2);
    color: var(--text-secondary-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--text-sm);
    transition: all 0.2s ease;
    -webkit-user-select: none;
    user-select: none;

    &.dan:hover {
        background-color: #f44336;
        color: white;
        border-color: #f44336;
    }

    &.def:hover {
        background-color: var(--neon-cyan);
        color: black;
        border-color: var(--neon-cyan);
    }

    &.dis{
        cursor: not-allowed;
    }
}
</style>