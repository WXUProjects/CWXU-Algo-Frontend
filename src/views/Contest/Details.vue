<template>
    <BaseLayout>
        <template #header>
            比赛 Contest
        </template>
        <div>
            <div class="title">比赛信息</div>
            <div>id = {{ id }}</div>
            <div>需要以下接口：<br>1.查询用户排名，-1表示未参加<br>2.根据比赛id查询比赛信息<br></div>
        </div>
        <div>
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

// 从url获取id参数
const router = useRouter()
const route = useRoute()
const id = route.params.id

if (!id) {
    router.back();
}

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
            const user = await API.user.profile.getById(item.userId);
            Toast.stdResponse(user, false);
            data.push({
                userId: item.userId,
                avatar: user.data.avatar || '/images/defaultAvatar.png',
                name: user.data.name,
                rank: item.rank,
                score: item.acCount,
                change: 0
            })
        }
        rankData.value.data = data;

        console.log(rankData.value);

    }
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

onMounted(() => {
    getRankData(1);
})
</script>

<style scoped>
@import '@/assets/css/navagation.css';

.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}
</style>