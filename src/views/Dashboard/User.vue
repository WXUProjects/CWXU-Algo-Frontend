<template>
    <div class="dashboardContent">
        <div class="section">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-user" />
                    </span>
                    <span class="title-text">用户管理</span>
                </div>
                <div class="header-tabs">
                    <span class="tab" @click="refresh">刷新</span>
                </div>
            </div>
            <div class="content">
                <table style="margin-bottom: 10px;">
                    <thead>
                        <tr>
                            <th style="width: 50px;">ID</th>
                            <th style="width: 50px;">组ID</th>
                            <th>头像</th>
                            <th style="width: 100px;">用户名</th>
                            <th style="width: 100px;">姓名</th>
                            <th style="width: 200px;">最后提交日期</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tr v-for="item in data?.list">
                        <td>{{ item.userId }}</td>
                        <td>{{ item.groupId }}</td>
                        <td>
                            <div class="avatar" v-if="item.avatar">
                                <img :src="item.avatar || '/images/defaultAvatar.png'" alt="">
                            </div>
                            <template v-else>
                                默认头像
                            </template>
                        </td>
                        <td>{{ item.username }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ formatDate(item.lastSubmit) }}</td>
                        <td>
                            <div class="actions">
                                <button class="btn btn-primary">编辑</button>
                                <button class="btn btn-primary"
                                    @click="router.push(`/profile?id=${item.userId}`)">个人资料</button>
                                <button class="btn btn-danger">删除</button>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="pageNavigation" v-if="data">
                    <div class="group">
                        <div class="pageButtons" v-if="data.currentPage != 1">
                            <button @click="getData(data.currentPage - 1)">上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button v-for="value in pages" :key="value"
                                :class="value === data.currentPage ? 'active' : ''"
                                @click="value === data.currentPage ? null : getData(value)">{{ value }}</button>
                        </div>
                        <div class="pageButtons" v-if="data.currentPage != data.totalPage">
                            <button @click="getData(data.currentPage + 1)">下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageInput">
                            <button @click="getData(jumppage)">跳转</button>
                            <input type="number" min="1" :max="data.totalPage" v-model="jumppage">
                        </div>
                        <div class="pageSum">共 {{ data.totalPage }} 页</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import API from '@/utils/api';
import Toast from '@/utils/toast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Response {
    list: User[];
    total: number;
    totalPage: number;
    currentPage: number;
}

interface User {
    avatar: string;
    groupId: number;
    lastSubmit: string;
    name: string;
    userId: number;
    username: string;
}

const data = ref<Response>({
    list: [],
    total: 0,
    totalPage: 0,
    currentPage: 1
});

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

const getData = async (page: number) => {
    const response = await API.user.profile.list(page);
    Toast.stdResponse(response, false);

    if (response.success) {
        jumppage.value = page;
        data.value = response.data;
        data.value.currentPage = page;
        data.value.totalPage = Math.ceil(data.value.total / 5);
    }
};

const formatDate = (date: string) => {
    return new Date(Number(date) * 1000).toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};
const refresh = () => {
    getData(data.value?.currentPage || 1);
};

onMounted(() => {
    getData(1);
});
</script>


<style scoped>
@import '@/assets/css/navagation.css';

.dashboardContent {
    height: 100%;
    border-top: 1px solid var(--divider-color);
    color: var(--text-default-color);

    .section {
        border-radius: 6px;

        >.header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 10px;
            border-bottom: 1px solid var(--divider-color);
        }

        >.content {
            padding: 10px;
            overflow: auto;

            &::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: var(--divider-color);
                border-radius: 5px;
            }
        }

        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: var(--text-lg);
            font-weight: 600;
        }

        .header-tabs {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: 12px;

            .tab {
                padding: 6px 12px;
                border-radius: 6px;
                background-color: var(--section-background-color);
                color: var(--text-light-color);
                font-size: var(--text-base);
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;

                &:hover {
                    color: var(--text-default-color);
                    background-color: var(--divider-color);
                }

                &.active {
                    background-color: var(--neon-cyan);
                    color: var(--background-color-1);
                    font-weight: 500;
                }
            }
        }

        .title-icon {
            font-size: var(--text-lg);
        }

        .title-text {
            color: var(--text-default-color);
        }

        .header-actions {
            display: flex;
            gap: 16px;
        }
    }

    .avatar {
        width: 50px;
        height: 50px;
        overflow: hidden;

        >img {
            width: 100%;
            height: 100%;
            -webkit-user-drag: none;
        }
    }

    .actions {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
    }

    .btn {
        font-size: var(--text-sm);
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        color: var(--text-default-color);
        background-color: var(--background-color-1);

        transition: all 0.2s ease;
    }

    .btn-primary:hover {
        background-color: var(--background-color-2);
    }

    .btn-danger:hover {
        background-color: #f00;
        color: #fff;
    }
}
</style>