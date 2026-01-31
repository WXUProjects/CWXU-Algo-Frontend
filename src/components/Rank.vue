<template>
    <div class="rankContainer">
        <div class="title" v-if="props.title">{{ props.title }}</div>
        <div class="rankList">
            <div v-for="(item, index) in props.data.data" :key="index" class="rankItem itemHover">
                <div class="rank">#{{ index + 1 }}</div>
                <div class="name">{{ item.name }}</div>
                <div class="score">{{ item.score }} AC</div>
                <div class="change up" v-if="item.change > 0">⬆</div>
                <div class="change down" v-else-if="item.change < 0">⬇</div>
                <div class="change" v-else>-</div>
            </div>
            <div class="title">我的排名 My-Rank</div>
            <div class="rankItem">
                <div class="rank">#{{ props.data.userRank }}</div>
                <div class="name">{{ props.data.userName }}</div>
                <div class="score">{{ props.data.userScore }} {{ props.data.scoreUnit }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
const props = defineProps({
    data: {
        type: Object as PropType<{
            "data": Array<{
                "name": string,
                "score": number,
                "change": number
            }>,
            "scoreUnit": string,
            "userRank": number,
            "userName": string,
            "userScore": number,
            "totalPage": number
        }>,
        required: true
    },
    title: {
        type: String,
        default: ''
    }
})
</script>

<style>
.rankContainer .title {
    width: 100%;
    padding: 8px 0px;
    font-size: var(--text-lg);
    color: var(--text-default-color);
}

.rankList {
    width: 100%;
}

.rankItem {
    display: flex;
    align-items: center;
    padding: 8px 4px;
    font-size: var(--text-base);
    color: var(--text-default-color);
    border-bottom: 1px solid var(--border-color);

    transition: transform 0.3s ease;
}

.rankItem.itemHover:hover {
    cursor: pointer;
    background-color: var(--background-color-2);
    transform: translateX(10px);
}

.rank {
    width: 80px;
}

.change{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
}

.change.up{
    color: #f00;
}

.change.down{
    color: #0f0;
}

.name {
    flex-grow: 1;
}
</style>