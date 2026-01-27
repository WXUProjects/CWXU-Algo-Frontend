<template>
    <BaseLayout>
        <Confirm ref="confirmRef" :message="'确定要退出登录吗？'" @confirm="logout" />
        <div class="loading" v-if="loading.statue">
            <div>{{ loading.info }}</div>
        </div>
        <div class="container" v-else>
            <div class="top">
                <div class="left">
                    <div class="avatar">
                        <img :src="user.avatar ? user.avatar : '/images/defaultAvatar.png'" alt="" srcset="">
                    </div>
                    <div class="info">
                        <div class="name">
                            <div class="name">{{ user.name }}</div>
                            <div class="username">{{ user.username }}</div>
                        </div>
                        <div class="details">
                            <div class="item">
                                <div class="name">AtCoder</div>
                                <div class="link">
                                    <div v-if="!user.links.AtCoder && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.AtCoder && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=AtCoder">去绑定</router-link>
                                    <a v-else-if="user.links.AtCoder" target="_blank" :href="user.links.AtCoder">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">牛客</div>
                                <div class="link">
                                    <div v-if="!user.links.NowCoder && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.NowCoder && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=NowCoder">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.NowCoder">主页</a>
                                </div>
                            </div>
                            <!-- <div class="item">
                                <div class="name">力扣</div>
                                <div class="link">
                                    <div v-if="!user.links.LeetCode && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LeetCode && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LeetCode">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LeetCode">主页</a>
                                </div>
                            </div> -->
                            <div class="item">
                                <div class="name">洛谷</div>
                                <div class="link">
                                    <div v-if="!user.links.LuoGu && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LuoGu && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LuoGu">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LuoGu">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">CodeForces</div>
                                <div class="link">
                                    <div v-if="!user.links.CodeForces && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link
                                        v-else-if="!user.links.CodeForces && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=CodeForces">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.CodeForces">主页</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="actions" v-if="jwtUserInfo?.userId == user.userId">
                        <button class="btn def" @click="updateLog()">更新OJ数据</button>
                        <button class="btn def" @click="router.push('/changeprofile')">编辑个人资料</button>
                        <button class="btn dan" @click="showLogoutConfirm">退出登录</button>
                    </div>
                </div>
                <div class="right">
                    <div class="section">
                        <div class="header">
                            <div class="header-title">
                                <span class="title-icon">
                                    <font-awesome-icon icon="fa-solid fa-chart-line" />
                                </span>
                                <span class="title-text">热力图 Heatmap</span>
                            </div>
                            <div class="header-tabs">
                                <span class="tab" @click="currentCalendar = 0"
                                    :class="currentCalendar === 0 ? 'active' : ''">提交热力图</span>
                                <span class="tab" @click="currentCalendar = 1"
                                    :class="currentCalendar === 1 ? 'active' : ''">AC热力图</span>
                            </div>
                        </div>
                        <div class="content">
                            <Calendar :data="submitData" style="width: 100%;" v-if="currentCalendar === 0"></Calendar>
                            <Calendar :data="acData" style="width: 100%;" v-else></Calendar>
                        </div>
                    </div>
                    <div class="section">
                        <div class="header">
                            <div class="header-title">
                                <span class="title-icon">
                                    <font-awesome-icon icon="fa-solid fa-trophy" />
                                </span>
                                <span class="title-text">排行 Rank</span>
                            </div>
                        </div>
                        <div class="content">
                            <div class="ranks">
                                <div class="rank">
                                    <div class="title">生涯</div>
                                    <div class="value">#1</div>
                                </div>
                                <div class="rank">
                                    <div class="title">本周排行</div>
                                    <div class="value">#1</div>
                                </div>
                                <div class="rank">
                                    <div class="title">本月排行</div>
                                    <div class="value">#1</div>
                                </div>
                                <div class="rank">
                                    <div class="title">年度排行</div>
                                    <div class="value">#1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <div class="header">
                            <div class="header-title">
                                <span class="title-icon">
                                    <font-awesome-icon icon="fa-solid fa-chart-line" />
                                </span>
                                <span class="title-text">近期动态 Recently-Activities</span>
                            </div>
                            <div class="header-tabs">
                                <span class="tab"
                                    @click="router.push(`/allActivities?id=${user.userId}&name=${user.name}`)">查看所有动态</span>
                            </div>
                        </div>
                        <div class="content">
                            <div v-if="activities.length != 0" class="activities">
                                <div class="activity" v-for="activity in activities">
                                    <div class="title">
                                        <span>{{ activity.title }}</span>
                                        <a :href="activity.link" target="_blank">{{ activity.status }}</a>
                                    </div>
                                    <div class="time">{{ activity.time }}</div>
                                </div>
                            </div>
                            <div v-else>暂无近期动态</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import Calendar from '@/components/Calendar.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import JWT from '../utils/jwt';
import Confirm from '@/components/confirm.vue'
import { useUserStore } from '@/stores/user';
import API from '@/utils/api';
import Toast from '@/utils/toast';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentCalendar = ref(0);

const loading = ref({
    statue: true,
    info: "加载中..."
});

const jwtUserInfo = JWT.getUserInfo();

interface User {
    avatar: string;
    email: string;
    groupId: string;
    name: string;
    spiders: Spider[];
    links: Links;
    userId: number;
    username: string;
    [property: string]: any;
}

type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForces";

interface Spider {
    platform: platform;
    username: string;
    [property: string]: any;
}

interface Links {
    AtCoder: string;
    NowCoder: string;
    LuoGu: string;
    CodeForces: string;
    LeetCode: string;
}

const user = ref<User>({
    avatar: "",
    email: "",
    groupId: "",
    name: "",
    spiders: [],
    links: {
        AtCoder: "",
        NowCoder: "",
        LuoGu: "",
        CodeForces: "",
        LeetCode: ""
    },
    userId: 0,
    username: ""
})

const confirmRef = ref()

interface ActivityItem {
    title: string;
    status: string;
    link: string;
    time: string;
}

const activities = ref<ActivityItem[]>([])


interface SubmitResponse {
    data: SubmitData[];
    [property: string]: any;
}

interface SubmitData {
    contest: string;
    id: number;
    lang: string;
    platform: platform
    problem: string;
    status: string;
    submitId: string;
    time: string;
    userId: string;
    [property: string]: any;
}

const getSubmitLink = (platform: platform, contest: string, submitId: string) => {
    switch (platform) {
        case "AtCoder":
            return `https://atcoder.jp/contests/${contest}/submissions/${submitId}`;
        case "NowCoder":
            return `https://ac.nowcoder.com/acm/contest/view-submission?submissionId=${submitId}`;
        case "LuoGu":
            return `https://www.luogu.com.cn/record/${submitId}`;
        case "CodeForces":
            return `https://CodeForces.com/contest/${contest}/submission/${submitId}`;
        default:
            return "";
    }
}

const getSubmitInfo = async () => {
    try {
        const response = await axios.get<SubmitResponse>("/api/core/submit-log/get-by-id", {
            params: {
                userId: user.value.userId,
                limit: 10,
                cursor: -1
            }
        })
        if (response.status === 200) {
            response.data.data.forEach(item => {
                const platfrom = item.platform;
                const lang = item.lang;
                const contest = item.contest;
                const problem = item.problem;
                const status = item.status;
                const time = new Date(Number(item.time) * 1000).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                activities.value.push({
                    title: `在 ${platfrom} 使用 ${lang} 解决 ${problem || contest}：`,
                    status: status,
                    link: getSubmitLink(platfrom, contest, item.submitId),
                    time: time
                });
            });
        } else {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message || '获取动态失败', type: 'error' }
            }));
        }
    } catch (error: any) {
        console.error(error);
        loading.value.info = error.response.data.message;
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: error.response.data.message || '获取动态失败', type: 'error' }
        }));
    }
}

// 获取用户信息
const getUserInfo = async () => {
    const response = await API.user.profile.getById(user.value.userId.toString());

    if (response.success) {
        user.value = response.data;
        loading.value.statue = false;
    } else {
        loading.value.info = response.message;
    }

    Toast.stdResponse(response, false);

    getSubmitInfo();
    getHeatmapData();
}

interface HeatmapData {
    date: string;
    count: number;
}

const submitData = ref<HeatmapData[]>([])
const acData = ref<HeatmapData[]>([])

const padZero = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
}

const getHeatmapData = async () => {
    interface HeatmapResponse {
        code: string;
        data: HeatmapData[];
        [property: string]: any;
    }

    try {
        const dateObj = new Date();
        const date = dateObj.getFullYear() + padZero(dateObj.getMonth() + 1) + padZero(dateObj.getDate());
        const response = await axios.get<HeatmapResponse>("/api/core/statistic/heatmap", {
            params: {
                userId: user.value.userId,
                startDate: "2023-01-01",
                endDate: date,
                isAc: false
            }
        })
        if (response.status === 200) {
            submitData.value = response.data.data.filter(item => item.count > 0);
        } else {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message || '请求热力图失败', type: 'error' }
            }));
        }
    } catch (error: any) {
        console.error(error);
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: error.response.data.message || '请求热力图失败', type: 'error' }
        }));
    }

    try {
        const dateObj = new Date();
        const date = dateObj.getFullYear() + padZero(dateObj.getMonth() + 1) + padZero(dateObj.getDate());
        const response = await axios.get<HeatmapResponse>("/api/core/statistic/heatmap", {
            params: {
                userId: user.value.userId,
                startDate: "2023-01-01",
                endDate: date,
                isAc: true
            }
        })
        if (response.status === 200) {
            acData.value = response.data.data.filter(item => item.count > 0);
        } else {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message || '请求热力图失败', type: 'error' }
            }));
        }
    } catch (error: any) {
        console.error(error);
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: error.response.data.message || '请求热力图失败', type: 'error' }
        }));
    }
}

const updateLog = async () => {
    try {
        const response = await axios.post("/api/core/spider/update",
            {
                userId: jwtUserInfo?.userId
            },
            {
                headers: {
                    Authorization: `Bearer ${JWT.token}`
                }
            })
        if (response.status === 200) {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message, type: 'success' }
            }));
        } else {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message || '请求更新数据失败', type: 'error' }
            }));
        }
    } catch (error: any) {
        console.error(error);
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: error.response.data.message || '请求更新数据失败', type: 'error' }
        }));
    }
}

const showLogoutConfirm = () => {
    confirmRef.value?.show()
}

const logout = async () => {
    JWT.clearToken()
    userStore.setLoginStatus(false)

    // 跳转到登录页面
    router.push('/login')
}

onMounted(() => {
    if (route.query.id) {
        user.value.userId = Number(route.query.id);
    } else {
        if (!JWT.isValid()) {
            window.location.href = "/login";
        } else {
            user.value.userId = JWT.getUserInfo()?.userId || 0;
        }
    }
    getUserInfo()
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    >.top {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-around;

        >.left,
        >.right {
            display: flex;
            flex-direction: column;
        }

        >.left {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 300px;
            gap: 20px;

            >.avatar {
                position: relative;
                overflow: hidden;
                border-radius: 50%;
                width: 80%;
                aspect-ratio: 1;
                border: 1vw solid #fff;
                box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    box-shadow: inset 0 0 0 1vw #e5e5e5;
                }

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    user-select: none;
                    -webkit-user-drag: none;
                }

                &:hover {
                    transform: scale(1.05);
                }
            }

            >.info {
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;

                >.name {
                    width: 100%;
                    border-bottom: 1px solid var(--divider-color);

                    >.name {
                        font-size: 2rem;
                        font-weight: bold;
                    }

                    >.username {
                        font-size: 1.5rem;
                    }
                }

                >.details {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    >.item {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }
            }

            >.actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
        }

        >.right {
            /* margin: 0 auto;
            width: 100%; */
            max-width: 1200px;
            gap: 20px;
        }
    }

    >.bottom {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
}

.ranks {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;

    >.rank {
        position: relative;
        min-width: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        >.title {
            font-size: 1rem;
        }

        >.value {
            font-size: 1rem;
        }

        &::before {
            content: '';
            position: absolute;
            bottom: -5px;
            width: 100%;
            height: 5px;
            background-color: var(--neon-cyan);
        }
    }
}

.activities {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .activity {
        position: relative;
        width: calc(100% - 20px);
        padding-left: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        >.time {
            font-size: 0.8rem;
            color: var(--text-light-color);
        }

        &::before {
            content: '';
            position: absolute;
            height: calc(100% + 10px);
            width: 3px;
            top: -5px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &:first-child::before {
            content: '';
            position: absolute;
            height: calc(100% + 15px);
            width: 3px;
            top: -10px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &:last-child::before {
            content: '';
            position: absolute;
            height: calc(100% + 15px);
            width: 3px;
            bottom: -10px;
            left: 10px;
            background-color: var(--divider-color);
        }

        &::after {
            content: '';
            position: absolute;
            width: 5px;
            height: 5px;
            left: 6px;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid var(--neon-cyan);

            box-shadow: 0 0 5px var(--neon-cyan);
        }
    }
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
    user-select: none;

    &.dan:hover {
        background-color: #f44336;
        color: white;
        border-color: #f44336;
    }

    &.def:hover {
        background-color: var(--neon-cyan);
        color: white;
        border-color: var(--neon-cyan);
    }
}

.section {
    border: 1px solid var(--divider-color);
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
        font-size: 1.1rem;
        font-weight: 600;
    }

    .header-tabs {
        display: flex;
        gap: 12px;

        .tab {
            padding: 6px 12px;
            border-radius: 6px;
            background-color: var(--section-background-color);
            color: var(--text-light-color);
            font-size: 0.85rem;
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
        font-size: 1.3rem;
    }

    .title-text {
        color: var(--text-default-color);
    }

    .header-actions {
        display: flex;
        gap: 16px;
    }
}

@media (max-width:1400px) {
    .container>.top {
        width: 100%;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .container>.top>.left {
        width: 100%;
        flex-direction: row;

        >.avatar {
            width: 200px;
        }

        >.info {
            flex: 1;
        }

        >.actions {
            width: 150px;
        }
    }

    .container>.top>.right {
        width: 100%;
    }
}

@media (max-width:680px) {
    .container>.top>.left {
        width: auto;
        flex-direction: column;

        >.info {
            width: 100%;
        }
    }
}
</style>