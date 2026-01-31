<template>
    <BaseLayout>
        <template #header>
            比赛 Competition
        </template>
        <div>
            <div class="title">比赛信息</div>
            <div>id = {{ id }}</div>
        </div>
        <div>
            <Rank :data="rankData" title="比赛排行榜"></Rank>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import Rank from '@/components/Rank.vue'

// 从url获取id参数
const router = useRouter()
const id = router.currentRoute.value.params.id


const rankData = ref({
    "data": [
        { name: "张三", score: 10, change: 0 },
        { name: "李四", score: 10, change: 0 },
        { name: "王五", score: 10, change: 0 },
        { name: "赵六", score: 9, change: 0 },
        { name: "钱七", score: 9, change: 0 },
        { name: "孙八", score: 9, change: 0 },
        { name: "周九", score: 7, change: 0 },
        { name: "吴十", score: 6, change: 0 },
        { name: "郑十一", score: 2, change: 0 },
        { name: "王十二", score: 1, change: 0 }
    ],
    "scoreUnit": "AC",
    "userRank": 4,
    "userName": '赵六',
    "userScore": 9,
    "totalPage": 1
})
</script>

<style scoped>

.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}
</style>