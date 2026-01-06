<template>
    <div class="rankContainer">
        <div class="title">{{ props.title }}</div>
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
            <div class="pageInput">
                <label>页面大小：</label>
                <input type="number" value="10" min="5" max="100" autocomplete="none">
            </div>
            <div class="pageButtons">
                <button>上一页</button>
            </div>
            <div class="pageButtons">
                <button v-for="value in pages" :key="value" :class="{ active: value === rankData.currentPage }">{{
                    value}}</button>
            </div>
            <div class="pageButtons">
                <button>下一页</button>
            </div>
            <div class="pageInput">
                <label>跳转：</label>
                <input type="number" min="1" :max="rankData.totalPage" :value="rankData.currentPage"
                    autocomplete="none">
            </div>
            <div class="pageSum">共 {{ rankData.totalPage }} 页</div>
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
    if (totalPage <= 5) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPage - 2) return [totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
})

console.log(pages.value);

</script>

<style>
.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}

.rankList {
    width: 100%;
}

.rankItem {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 1.2rem;
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

.pageNavigation {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 1.2rem;
    gap: 10px;
    color: var(--text-default-color);
}

.pageInput input {
    width: 50px;
    font-size: 1.2rem;
    text-align: center;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    background-color: var(--background-color-1);
    color: var(--text-default-color);
    outline: none;
    transition: border-color 0.3s ease;
}

.pageInput input:focus {
    border-color: var(--input-active-color)
}

.pageButtons {
    display: flex;
    gap: 10px;
}

.pageButtons button {
    font-size: 1.2rem;
    text-align: center;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    background-color: var(--background-color-1);
    color: var(--text-default-color);
    outline: none;
    transition: border-color 0.3s ease;
}

.pageButtons button:hover {
    border-color: var(--input-active-color)
}

.pageSum {
    font-size: 1.2rem;
    color: var(--text-default-color);
}
</style>