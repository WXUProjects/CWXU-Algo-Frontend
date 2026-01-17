<template>
    <BaseLayout>
        <div class="container">
            <div class="pages">
                <div class="actions">
                    <button class="btn def" @click="router.push('/problem/upload')">上传题目</button>
                </div>
                <table class="item-table">
                    <thead>
                        <tr>
                            <th>标题</th>
                            <th>链接</th>
                            <th>类型</th>
                            <th>难度</th>
                            <th>备注</th>
                            <th>上传者</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tr v-for="item in data.data">
                        <td>{{ item.title }}</td>
                        <td><a :href="item.link">点击跳转</a></td>
                        <td>
                            <span v-for="tag in item.tags" class="tag">{{ tag }}</span>
                        </td>
                        <td>
                            <span class="diff" :style="'background-color:' + colorReflect(Number(item.difficulty))">{{
                                item.difficulty
                            }}</span>
                        </td>
                        <td>
                            {{ item.remark }}
                        </td>
                        <td>{{ item.uploader }}</td>
                        <td>
                            <button class="btn del">删除</button>
                            <button class="btn def">收藏</button>
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
                <div class="filter-title">筛选选项</div>
                <div class="filter-items">
                    <div class="filter-item">
                        <div class="filter-item-title">类型</div>
                        <div class="filter-checkbox-group">
                            <label class="filter-checkbox">
                                <input type="checkbox">
                                <span class="filter-checkbox-label">二分</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox">
                                <span class="filter-checkbox-label">枚举</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox">
                                <span class="filter-checkbox-label">链表</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox">
                                <span class="filter-checkbox-label">字符串</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox">
                                <span class="filter-checkbox-label">高精度</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox" checked="true">
                                <span class="filter-checkbox-label">贪心</span>
                            </label>
                        </div>
                    </div>
                    <div class="filter-item">
                        <div class="filter-item-title">排序</div>
                        <div class="filter-sort-container">
                            <div class="filter-select">
                                <div class="filter-selected">按添加时间</div>
                                <div class="filter-options">
                                    <div class="filter-option">按添加时间</div>
                                    <div class="filter-option">按难度</div>
                                </div>
                            </div>
                            <div class="filter-switch">
                                <div class="filter-switch-option active">降序</div>
                                <div class="filter-switch-option">升序</div>
                            </div>
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button class="filter-apply-btn">应用筛选</button>
                        <button class="filter-reset-btn">重置</button>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const data = ref({
    currentPage: 1,
    totalPage: 10,
    data: [
        {
            "title": "例题1",
            "difficulty": "1",
            "tags": [
                "贪心",
                "字符串"
            ],
            "link": "https://www.example.com/1",
            "remark": "这是备注",
            "uploader": "user1",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题2",
            "difficulty": "1.5",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "admin",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "2",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "2.5",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "3",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "3.5",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "4",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "4.5",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
            "created_time": "1970-01-01 00:00:00"
        },
        {
            "title": "例题3",
            "difficulty": "5",
            "tags": [
                "贪心"
            ],
            "link": "https://www.example.com/2",
            "remark": "这是备注",
            "uploader": "user2",
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

const colorReflect = (diff: number) => {
    const range = [
        "#E8F5E9",
        "#C8E6C9",
        "#A5D6A7",
        "#81C784",
        "#66BB6A",
        "#4CAF50",
        "#FFCC80",
        "#FF9800",
        "#D32F2F",
    ]
    return range[diff * 2 - 2];
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 30px;
    padding: 20px;
}

.pages {
    flex: 1;
    min-width: 0;
}

.pages .actions {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row-reverse;
}

.filter {
    width: 400px;
    border-radius: 12px;
    border: 1px solid var(--divider-color);
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    height: fit-content;
    position: sticky;
    top: 20px;
}

.filter-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-default-color);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color);
}

.filter-items {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.filter-item-title {
    font-size: 1rem;
    font-weight: bold;
    color: var(--text-default-color);
    display: flex;
    align-items: center;
}

.filter-item-title::before {
    content: "•";
    margin-right: 8px;
    font-size: 1.5rem;
}

.filter-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-checkbox:hover {
    border-color: var(--neon-cyan);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-checkbox input[type="checkbox"] {
    display: none;
}

.filter-checkbox input[type="checkbox"]:checked+.filter-checkbox-label {
    background-color: var(--neon-cyan);
    color: var(--text-reverse-color);
}

.filter-checkbox-label {
    font-size: 0.95rem;
    transition: all 0.2s ease;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    background-color: var(--background-color-2);
}

.filter-sort-container {
    display: flex;
    align-items: center;
    gap: 16px;
}

.filter-select {
    position: relative;
    flex: 1;
}

.filter-selected {
    padding: 10px 16px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background-color: var(--background-color-2);
    color: var(--text-default-color);
    font-size: 0.95rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.filter-selected::after {
    content: "▼";
    font-size: 0.8rem;
    margin-left: 8px;
}

.filter-selected:hover {
    border-color: var(--neon-cyan);
}

.filter-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--background-color-1);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    margin-top: 4px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-select:hover .filter-options {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.filter-option {
    padding: 10px 16px;
    color: var(--text-default-color);
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.filter-option:hover {
    background-color: var(--background-color-2);
}

.filter-option:first-child {
    border-radius: 8px 8px 0 0;
}

.filter-option:last-child {
    border-radius: 0 0 8px 8px;
}

.filter-switch {
    display: flex;
    background-color: var(--background-color-2);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--divider-color);
}

.filter-switch-option {
    padding: 10px 16px;
    font-size: 0.95rem;
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
    text-align: center;
}

.filter-switch-option.active {
    background-color: var(--neon-cyan);
    color: white;
    font-weight: 500;
}

.filter-switch-option:not(.active):hover {
    background-color: var(--background-color-2);
    color: var(--text-default-color);
}

.filter-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    padding-top: 20px;
    border-top: 1px solid var(--divider-color);
}

.filter-apply-btn {
    flex: 1;
    padding: 12px;
    background-color: var(--neon-cyan);
    color: var(--text-reverse-color);
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-apply-btn:hover {
    background-color: var(--neon-cyan);
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.filter-reset-btn {
    flex: 1;
    padding: 12px;
    background-color: var(--background-color-2);
    color: var(--text-secondary-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-reset-btn:hover {
    background-color: var(--background-color-2);
    color: var(--text-default-color);
    border-color: var(--text-secondary-color);
}

.tag {
    text-wrap: nowrap;
    margin: 0 5px;
    background-color: #18ccff99;
    padding: 1px 2px;
    border-radius: 5px;
}

.diff {
    padding: 1px 2px;
    border-radius: 5px;
}

.btn {
    margin: 0 5px;
    padding: 3px 6px;
    background-color: var(--background-color-2);
    color: var(--text-secondary-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.btn.del:hover {
    background-color: #f44336;
    color: white;
    border-color: #f44336;
}

.btn.def:hover {
    background-color: var(--neon-cyan);
    color: white;
    border-color: var(--neon-cyan);
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
    margin-top: 30px;
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

.pageButtons button.active {
    background-color: var(--neon-cyan);
    color: white;
    border-color: var(--neon-cyan);
}

.pageSum {
    font-size: 1.2rem;
    color: var(--text-default-color);
}

@media (max-width: 1500px) {
    .container {
        flex-direction: column;
    }

    .filter {
        width: calc(100% - 48px);
        position: static;
        order: -1;
    }

    .filter-sort-container {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-select {
        width: 100%;
    }

    .filter-switch {
        width: 100%;
        justify-content: center;
    }

    .filter-switch-option {
        flex: 1;
    }
}

@media (max-width: 860px) {
    .pageNavigation {
        flex-direction: column;
    }

    .pageNavigation {
        width: 100%;
        font-size: 1.2rem;
        color: var(--text-default-color);
        gap: 10px;
    }

    .container {
        padding: 10px;
    }

    .filter {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .filter-checkbox-group {
        justify-content: center;
    }

    .filter-checkbox {
        flex: 1;
        min-width: calc(50% - 10px);
        justify-content: center;
    }

    .filter-actions {
        flex-direction: column;
    }
}
</style>