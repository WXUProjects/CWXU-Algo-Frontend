<template>
    <div class="rankContainer">
        <div class="title" v-if="props.title">{{ props.title }}</div>
        <div class="rankList">
            <div v-for="(item, index) in props.data.data" :key="index" class="rankItem itemHover"
                @click="router.push(`/profile?id=${item.userId}`)">
                <div class="rank">#{{ item.rank }}</div>
                <div class="avatar">
                    <img :src="item.avatar" alt="用户头像">
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="score">{{ item.score }} AC</div>
                <div class="change up" v-if="props.showChange && item.change > 0">⬆</div>
                <div class="change down" v-else-if="props.showChange && item.change < 0">⬇</div>
                <div class="change" v-else-if="props.showChange">-</div>
            </div>
            <div class="title" v-if="props.isJoined">我的排名 My-Rank</div>
            <div class="rankItem" v-if="props.isJoined">
                <div class="rank">#{{ props.data.userRank }}</div>
                <div class="name">{{ props.data.userName }}</div>
                <div class="score">{{ props.data.userScore }} {{ props.data.scoreUnit }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const props = defineProps({
    data: {
        type: Object as PropType<{
            "data": Array<{
                "userId": number,
                "avatar": string,
                "name": string,
                "rank": number,
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
    },
    isJoined: {
        type: Boolean,
        default: false
    },
    showChange: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.rankContainer {
    width: calc(100% - 40px);
    padding: 20px;

    .title {
        width: 100%;
        padding: 8px 0px;
        font-size: var(--text-lg);
        color: var(--text-default-color);
    }

    >.rankList {
        width: 100%;

        >.rankItem {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 4px;
            font-size: var(--text-base);
            color: var(--text-default-color);
            border-bottom: 1px solid var(--border-color);

            transition: transform 0.3s ease;

            &.itemHover:hover {
                cursor: pointer;
                background-color: var(--background-color-2);
                transform: translateX(10px);
            }

            >.rank {
                width: 80px;
            }

            >.avatar {
                width: 50px;
                height: 50px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            >.name {
                margin-left: 10px;
                flex-grow: 1;
            }

            >.change {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20px;

                &.up {
                    color: #f00;
                }

                &.down {
                    color: #0f0;
                }
            }
        }
    }
}

@media (max-width:1000px) {
    .rankContainer {
        width: 100%;
        padding: 0;
    }
}
</style>