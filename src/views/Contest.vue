<template>
    <BaseLayout>
        <div class="contestContainer">
            <div class="section">
                <div class="header">
                    <div class="header-title">
                        <span class="title-icon">
                            <font-awesome-icon icon="fa-solid fa-chart-line" />
                        </span>
                        <span class="title-text" v-if="userMode">{{ user.name }}参加的比赛</span>
                        <span class="title-text" v-else>所有比赛</span>
                    </div>
                    <div class="header-tabs">
                        <span class="tab" v-if="!userMode && isLogin"
                            @click="router.push(`/contest?id=${userStore.info?.userId}`)">查看我参加的比赛</span><span
                            class="tab" v-if="userMode"
                            @click="router.push(`/contest`)">查看所有比赛</span>
                    </div>
                </div>
                <div class="content">
                    <div class="contestList" v-if="!loading">
                        <div class="contestItem" v-for="contest in data.list">
                            <div class="info" @click="router.push({ path: '/contest/' + contest.id })">
                                <div class="platform">{{ contest.platform }}</div>
                                <div class="title">{{ contest.contestName }}</div>
                                <div class="time">{{ contest.time }}</div>
                            </div>
                            <div class="actions">
                                <div class="btn def" @click="toContest(contest.contestUrl)">跳转到比赛主页</div>
                                <div class="btn def" @click="router.push({ path: '/contest/' + contest.id })">
                                    查看比赛信息</div>
                            </div>
                        </div>
                        <div class="pageNavigation" v-if="data">
                            <div class="group">
                                <div class="pageButtons" v-if="data.currentPage != 1">
                                    <button @click="getContestList(data.currentPage - 1)">上一页</button>
                                </div>
                                <div class="pageButtons">
                                    <button v-for="value in pages" :key="value"
                                        :class="value === data.currentPage ? 'active' : ''"
                                        @click="value === data.currentPage ? null : getContestList(value)">{{ value
                                        }}</button>
                                </div>
                                <div class="pageButtons" v-if="data.currentPage != data.totalPage">
                                    <button @click="getContestList(data.currentPage + 1)">下一页</button>
                                </div>
                            </div>
                            <div class="group">
                                <div class="pageInput">
                                    <button @click="getContestList(jumppage)">跳转</button>
                                    <input type="number" min="1" :max="data.totalPage" v-model="jumppage">
                                </div>
                                <div class="pageSum">共 {{ data.totalPage }} 页</div>
                            </div>
                        </div>
                    </div>
                    <div class="listLoading" v-else>加载中，请稍候。</div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue'
import type { CoreContestListData } from '@/utils/api';
import API from '@/utils/api';
import Toast from '@/utils/toast';
import { useRoute, useRouter } from 'vue-router';
import type { User } from '@/utils/type';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute()
const userStore = useUserStore();
const id = ref(route.query.id);
const isLogin = userStore.isLogin;
const userMode = ref(false);
const user = ref<User>({
    avatar: '',
    email: '',
    groupId: '',
    name: '',
    spiders: [],
    links: {
        AtCoder: '',
        NowCoder: '',
        LeetCode: '',
        LuoGu: '',
        CodeForces: ''
    },
    userId: -1,
    username: ''
})

const data = ref<{
    list: CoreContestListData[],
    total: number,
    totalPage: number,
    currentPage: number,
}>({
    list: [],
    total: 1,
    totalPage: 1,
    currentPage: 0
})

const loading = ref(true);

const getUser = async () => {
    const response = await API.user.profile.getById(Number(id.value))
    Toast.stdResponse(response, false);

    if (response.success) {
        user.value = response.data;
    }
}

const getContestList = async (page: number) => {
    if (page > data.value.totalPage || page < 1 || page === data.value.currentPage) {
        return
    }

    loading.value = true;

    const limit = 10;
    const offset = (page - 1) * limit;
    const userId = userMode.value ? Number(id.value) : -1;

    const response = await API.core.contest.list({ limit, offset, userId });
    Toast.stdResponse(response, false);

    if (response.success) {
        data.value.list = response.data.data;
        data.value.total = response.data.total;
        data.value.totalPage = Math.ceil(data.value.total / limit);
        data.value.currentPage = page;
    }
    loading.value = false;
}

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

const toContest = (url: string) => {
    window.open(url);
}

watch(() => route.query.id, async () => {
    userMode.value = false;
    loading.value = false;
    user.value = {
        avatar: '',
        email: '',
        groupId: '',
        name: '',
        spiders: [],
        links: {
            AtCoder: '',
            NowCoder: '',
            LeetCode: '',
            LuoGu: '',
            CodeForces: ''
        },
        userId: -1,
        username: ''
    };
    data.value = {
        list: [],
        total: 1,
        totalPage: 1,
        currentPage: 0
    };
    jumppage.value = 1;
    id.value = route.query.id;

    if (id.value) {
        userMode.value = true;
    }
    getContestList(1);
    if (userMode.value) {
        getUser();
    }
})

onMounted(() => {
    if (id.value) {
        userMode.value = true;
    }
    getContestList(1);
    if (userMode.value) {
        getUser();
    }
})
</script>

<style scoped>
@import '@/assets/css/navagation.css';

.contestContainer {
    width: calc(100% - 20px);
    padding: 20px;

    >.section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 6px;

        >.header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 10px;
            border-radius: 12px;
            background: var(--background-header);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }

        >.content {
            background-color: var(--background-color-content);
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
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
            gap: 12px;

            .tab {
                padding: 6px 12px;
                border-radius: 6px;
                color: var(--text-light-color);
                font-size: var(--text-base);
                cursor: pointer;
                transition: all 0.2s ease;
                -webkit-user-select: none;
                user-select: none;

                &:hover {
                    color: var(--text-default-color);
                    background-color: oklch(from var(--background-color-2) 1 c h / 0.1);
                }

                &.active {
                    background-color: var(--neon-cyan);
                    color: var(--text-reverse-color);
                    font-weight: 500;
                }
            }
        }

        .title-icon {
            font-size: var(--text-base);
        }

        .title-text {
            color: var(--text-default-color);
        }

        .header-actions {
            display: flex;
            gap: 16px;
        }
    }
}

.contestList {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;

    >.contestItem {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-radius: 8px;

        perspective: 1000px;

        >.info {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            cursor: pointer;

            >.platform {
                color: var(--text-light-color);
                font-size: var(--text-sm);
            }

            >.title {
                color: var(--text-default-color);
                font-size: var(--text-lg);
                font-weight: bold;
            }

            >.time {
                color: var(--text-light-color);
                font-size: var(--text-sm);
            }
        }

        >.actions {
            z-index: 1;
            position: relative;
            display: flex;
            flex-direction: row;
            gap: 5px;
        }

        &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            top: -1px;
            left: -1px;
            border-radius: 8px;
            border: 1px solid var(--neon-cyan);
            pointer-events: none;

            transition: all 0.2s ease;
            transform-origin: 10% center;
            transform-style: preserve-3d;

            opacity: 0;
            transform: scale(0.99) rotateY(5deg);
        }

        &:hover::after {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
        }
    }
}

.btn {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: var(--background-color-2);
    color: var(--text-secondary-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--text-sm);
    transition: all 0.2s ease;
    -webkit-user-select: none;
    user-select: none;

    &.dan:hover {
        background-color: #f44336;
        color: white;
        border-color: #f44336;
    }

    &.def:hover {
        background-color: var(--neon-cyan);
        color: black;
        border-color: var(--neon-cyan);
    }
}

@media (max-width:1000px) {
    .contestContainer {
        width: 100%;
        padding: 0;
    }
}

@media (max-width:500px) {
    .contestList {
        >.contestItem {
            >.actions {
                gap: 10px;
                flex-direction: column;
            }
        }
    }
}
</style>