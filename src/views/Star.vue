<template>
    <BaseLayout>
        <div class="container">
            <div class="pages">
                <table class="item-table">
                    <tr>
                        <td>标题</td>
                        <td>链接</td>
                        <td>标签</td>
                        <td>难度</td>
                        <td>备注</td>
                        <td>操作</td>
                    </tr>
                    <tr v-for="item in data.data">
                        <td>{{ item.title }}</td>
                        <td><a :href="item.link">{{ item.link }}</a></td>
                        <td>
                            <div v-for="tag in item.tags">{{ tag }}</div>
                        </td>
                        <td>
                            {{ item.difficulty }}
                        </td>
                        <td>
                            {{ item.remark }}
                        </td>
                        <td>
                            <button>删除</button>
                        </td>
                    </tr>
                </table>
                <div class="pageNavigation">
                    <div class="group">
                        <div class="pageButtons">
                            <button>上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button v-for="value in pages" :key="value"
                                :class="{ active: value === data.currentPage }">{{
                                    value }}</button>
                        </div>
                        <div class="pageButtons">
                            <button>下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageInput">
                            <label>跳转：</label>
                            <input type="number" min="1" :max="data.totalPage" :value="data.currentPage"
                                autocomplete="none">
                        </div>
                        <div class="pageSum">共 {{ data.totalPage }} 页</div>
                    </div>
                </div>
            </div>
            <div class="filter">
                <div class="title">筛选选项</div>
                <div class="items">
                    <div class="item">
                        <div class="title">排序</div>
                        <div class="select">
                            <div class="selected">按添加时间</div>
                            <div class="options">
                                <div class="option">按添加时间</div>
                                <div class="option">按难度</div>
                            </div>
                        </div>
                        <div class="switch">
                            <div class="option active">降序</div>
                            <div class="option">升序</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">标签</div>
                        <div class="chose">
                            <input type="checkbox">二分</input>
                            <input type="checkbox">枚举</input>
                            <input type="checkbox">链表</input>
                            <input type="checkbox">字符串</input>
                            <input type="checkbox">高精度</input>
                            <input type="checkbox">贪心</input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { ref, computed } from 'vue';

const data = ref({
    currentPage: 1,
    totalPage: 10,
    data: [
        {
            "title": "例题1",
            "difficulty": "1.5",
            "tags": [
                "贪心",
                "字符串"
            ],
            "link": "https://www.example.com/1",
            "remark": "这是备注",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题2",
            "difficulty": "2",
            "tags": [
                "动态规划"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "created_time": "1970-01-01 00:00:00"
        }
    ]
})

const pages = computed(() => {
    const currentPage = data.value.currentPage;
    const totalPage = data.value.totalPage;
    if (totalPage <= 3) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPage - 1) return [totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 1, currentPage, currentPage + 1];
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.pages {
    flex: 1;
}

.filter {}

.filter .title{}

.filter .items{}

.filter .item{}

.item-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
}

.item-table th,
.item-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

.item-table th {
    background-color: var(--background-color-1);
}

.item-table tr:nth-child(even) {
    background-color: var(--background-color-2);
}

.pageNavigation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1.2rem;
    color: var(--text-default-color);
    gap: 10px;
}

.group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
}

.pageInput input {
    width: 50px;
    font-size: 1.2rem;
    text-align: center;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    padding: 5px 10px;
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
    width: max-content;
    font-size: 1.2rem;
    text-align: center;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    padding: 5px 10px;
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

@media (max-width:860px) {
    .pageNavigation {
        flex-direction: column;
    }

    .pageNavigation {
        width: 100%;
        font-size: 1.2rem;
        color: var(--text-default-color);
        gap: 10px;
    }
}
</style>