<template>
    <div class="rankContainer">
        <div class="title" v-if="props.title">{{ props.title }}</div>
        <div class="rankList">
            <div v-for="(item, index) in rankData.data" :key="index" class="rankItem itemHover">
                <div class="rank">#{{ index + 1 }}</div>
                <div class="name">{{ item.name }}</div>
                <div class="score">{{ item.score }} AC</div>
                <div class="change up" v-if="item.change > 0">⬆</div>
                <div class="change down" v-else-if="item.change < 0">⬇</div>
                <div class="change" v-else>-</div>
            </div>
        </div>
        <div class="pageNavigation">
            <div class="group">
                <div class="pageButtons">
                    <button>上一页</button>
                </div>
                <div class="pageButtons">
                    <button v-for="value in pages" :key="value" :class="{ active: value === rankData.currentPage }">{{
                        value }}</button>
                </div>
                <div class="pageButtons">
                    <button>下一页</button>
                </div>
            </div>
            <div class="group">
                <div class="pageInput">
                    <label>跳转：</label>
                    <input type="number" min="1" :max="rankData.totalPage" :value="rankData.currentPage"
                        autocomplete="none">
                </div>
                <div class="pageSum">共 {{ rankData.totalPage }} 页</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    api: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    }
})

const rankData = ref({
    "data": [
        { name: "张三", score: 1400, change: 1 },
        { name: "李四", score: 1300, change: -1 },
        { name: "王五", score: 1200, change: 0 },
        { name: "赵六", score: 1145, change: 0 },
        { name: "钱七", score: 1000, change: 0 },
        { name: "孙八", score: 900, change: 1 },
        { name: "周九", score: 400, change: -1 },
        { name: "吴十", score: 300, change: -1 },
        { name: "郑十一", score: 200, change: 0 },
        { name: "王十二", score: 100, change: 0 }
    ],
    "scoreUnit": "AC",
    "currentPage": 1,
    "totalPage": 10
})

const pages = computed(() => {
    const currentPage = rankData.value.currentPage;
    const totalPage = rankData.value.totalPage;
    if (totalPage <= 3) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPage - 1) return [totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 1, currentPage, currentPage + 1];
})
</script>

<style scoped>
@import '@/assets/css/navagation.css';

.rankContainer>.title {
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
    padding: 4px 0px;
    font-size: var(--text-base);
    color: var(--text-default-color);
    border-bottom: 1px solid var(--border-color);

    transition: transform 0.3s ease;
}

.rankItem.itemHover:hover {
    transform: translateX(10px);
}

.rank {
    width: 80px;
}

.change {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
}

.change.up {
    color: #f00;
}

.change.down {
    color: #0f0;
}

.name {
    flex-grow: 1;
}
</style>