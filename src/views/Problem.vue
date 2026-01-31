<template>
    <BaseLayout>
        <div class="container">
            <div class="pages">
                <div class="tableActions">
                    <button class="btn def" @click="router.push('/problem/upload')">上传题目</button>
                    <button class="btn def" @click="closeFilter = false">筛选</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>标题</th>
                            <th style="width: 100px;">链接</th>
                            <th>类型</th>
                            <th style="width: 50px;">难度</th>
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
                            <div class="trActions">
                                <button class="btn del">删除</button>
                                <button class="btn def">收藏</button>
                            </div>
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
                            <button>跳转</button>
                            <input type="number" min="1" :max="data.totalPage" v-model="jumppage">
                        </div>
                        <div class="pageSum">共 {{ data.totalPage }} 页</div>
                    </div>
                </div>
            </div>
            <div class="filter" :class="closeFilter ? 'filterClosed' : ''">
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
                        <button class="filter-close-btn" @click="closeFilter = true">关闭</button>
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

const jumppage = ref(1)

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

const closeFilter = ref(true)
</script>

<style scoped>
@import '@/assets/css/navagation.css';
@import '@/assets/css/table.css';
</style>