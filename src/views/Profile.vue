<template>
    <BaseLayout>
        <Confirm ref="confirmRef" :message="'确定要退出登录吗？'" @confirm="logout" />
        <div class="container">
            <div class="top">
                <div class="left">
                    <div class="background">
                        <div class="flow-emoji">
                            {{ '💯🏅🎯'.repeat(5) }}<br>
                            {{ '🏅🎯💯'.repeat(5) }}<br>
                            {{ '🎯💯🏅'.repeat(5) }}<br>
                            {{ '💯🏅🎯'.repeat(5) }}<br>
                            {{ '🏅🎯💯'.repeat(5) }}<br>
                            {{ '🎯💯🏅'.repeat(5) }}<br>
                        </div>
                    </div>
                    <div class="avatar">
                        <img :src="user.avatar ? user.avatar : '/images/defaultAvatar.png'" alt="" srcset="">
                    </div>
                    <div class="info">
                        <div class="name">
                            <div class="name">{{ user.name || "萌新" }}</div>
                            <div class="username">{{ user.username || "noob" }}</div>
                        </div>
                        <div class="details" v-if="user">
                            <div class="item">
                                <div class="name">AtCoder</div>
                                <div class="link"
                                    :class="!(!user.links.AtCoder && jwtUserInfo?.userId != user.userId) ? 'go' : ''">
                                    <div v-if="!user.links.AtCoder && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.AtCoder && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=AtCoder">去绑定</router-link>
                                    <a v-else-if="user.links.AtCoder" target="_blank" :href="user.links.AtCoder">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">牛客</div>
                                <div class="link"
                                    :class="!(!user.links.NowCoder && jwtUserInfo?.userId != user.userId) ? 'go' : ''">
                                    <div v-if="!user.links.NowCoder && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.NowCoder && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=NowCoder">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.NowCoder">主页</a>
                                </div>
                            </div>
                            <!-- <div class="item">
                                <div class="name">力扣</div>
                                <div class="link" :class="!(!user.links.AtCoder && jwtUserInfo?.userId != user.userId)?'go':''">
                                    <div v-if="!user.links.LeetCode && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LeetCode && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LeetCode">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LeetCode">主页</a>
                                </div>
                            </div> -->
                            <div class="item">
                                <div class="name">洛谷</div>
                                <div class="link"
                                    :class="!(!user.links.LuoGu && jwtUserInfo?.userId != user.userId) ? 'go' : ''">
                                    <div v-if="!user.links.LuoGu && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LuoGu && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LuoGu">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LuoGu">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">CodeForces</div>
                                <div class="link"
                                    :class="!(!user.links.CodeForces && jwtUserInfo?.userId != user.userId) ? 'go' : ''">
                                    <div v-if="!user.links.CodeForces && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link
                                        v-else-if="!user.links.CodeForces && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=CodeForces">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.CodeForces">主页</a>
                                </div>
                            </div>
                        </div>
                        <div class="moblie-details">
                            <a class="item" v-if="user.links.NowCoder" target="_blank"
                                :href="user.links.NowCoder">牛客</a>
                            <a class="item" v-if="user.links.AtCoder" target="_blank"
                                :href="user.links.AtCoder">AtCoder</a>
                            <a class="item" v-if="user.links.CodeForces" target="_blank"
                                :href="user.links.CodeForces">CodeForces</a>
                            <a class="item" v-if="user.links.LuoGu" target="_blank" :href="user.links.LuoGu">洛谷</a>
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
                                <span class="title-text">数据</span>
                            </div>
                            <div class="header-tabs">
                                <span class="tab" @click="currentData = 0"
                                    :class="currentData === 0 ? 'active' : ''">提交</span>
                                <span class="tab" @click="currentData = 1"
                                    :class="currentData === 1 ? 'active' : ''">AC</span>
                            </div>
                        </div>
                        <div class="content">
                            <div v-if="currentData === 0" class="statisticItems">
                                <div class="statisticItem" v-for="item in data.submit">
                                    <div class="title">{{ item.title }}</div>
                                    <div class="barContainer">
                                        <div class="bar"
                                            :style="'width:' + ((item.value / (item.value + item.ave)) * 100) + '%'">
                                        </div>
                                        <div class="ave"
                                            :style="'left:' + ((item.ave / (item.value + item.ave)) * 100) + '%'">平均值:{{
                                                item.ave.toFixed(2) }}</div>
                                        <div class="cursor"
                                            :style="'left:' + ((item.ave / (item.value + item.ave)) * 100) + '%'"></div>
                                    </div>
                                    <div class="value">{{ item.value.toString().includes('.') ?
                                        item.value.toFixed(2) : item.value }}</div>
                                    <div class="grow" :class="getGrowClass(item.grow)">{{ item.grow ? item.grow > 0 ?
                                        '+' + item.grow : item.grow : '' }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="statisticItems">
                                <div class="statisticItem" v-for="item in data.ac">
                                    <div class="title">{{ item.title }}</div>
                                    <div class="barContainer">
                                        <div class="bar"
                                            :style="'width:' + ((item.value / (item.value + item.ave)) * 100) + '%'">
                                        </div>
                                        <div class="ave"
                                            :style="'left:' + ((item.ave / (item.value + item.ave)) * 100) + '%'">平均值:{{
                                                item.ave.toFixed(2) }}</div>
                                        <div class="cursor"
                                            :style="'left:' + ((item.ave / (item.value + item.ave)) * 100) + '%'"></div>
                                    </div>
                                    <div class="value">{{ item.value.toString().includes('.') ?
                                        item.value.toFixed(2) : item.value }}</div>
                                    <div class="grow" :class="getGrowClass(item.grow)">{{ item.grow ? item.grow > 0 ?
                                        '+' + item.grow : item.grow : '' }}
                                    </div>
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
                                <span class="title-text">热力图</span>
                            </div>
                            <div class="header-tabs">
                                <span class="tab" @click="currentCalendar = 0"
                                    :class="currentCalendar === 0 ? 'active' : ''">提交热力图</span>
                                <span class="tab" @click="currentCalendar = 1"
                                    :class="currentCalendar === 1 ? 'active' : ''">AC热力图</span>
                            </div>
                        </div>
                        <div class="content">
                            <Calendar :data="submitData" style="width: 100%;" v-if="currentCalendar === 0"
                                :year="dynamicYear" @changeYear="handleYearChange"></Calendar>
                            <Calendar :data="acData" style="width: 100%;" v-else :year="dynamicYear"
                                @changeYear="handleYearChange"></Calendar>
                        </div>
                    </div>
                    <!-- <div class="section">
                        <div class="header">
                            <div class="header-title">
                                <span class="title-icon">
                                    <font-awesome-icon icon="fa-solid fa-trophy" />
                                </span>
                                <span class="title-text">排行</span>
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
                    </div> -->
                    <div class="section">
                        <div class="header">
                            <div class="header-title">
                                <span class="title-icon">
                                    <font-awesome-icon icon="fa-solid fa-chart-line" />
                                </span>
                                <span class="title-text">近期动态</span>
                            </div>
                            <div class="header-tabs">
                                <span class="tab"
                                    @click="router.push(`/allActivities?id=${user.userId}`)">查看所有动态</span>
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
                    <div class="moblie-actions" v-if="jwtUserInfo?.userId == user.userId">
                        <button class="btn def" @click="updateLog()">更新OJ数据</button>
                        <button class="btn def" @click="router.push('/changeprofile')">编辑个人资料</button>
                        <button class="btn dan" @click="showLogoutConfirm">退出登录</button>
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
import { useRoute, useRouter } from 'vue-router';
import JWT from '../utils/jwt';
import Confirm from '@/components/confirm.vue'
import { useUserStore } from '@/stores/user';
import API from '@/utils/api';
import type { CoreStatisticPeriodData, CoreSubmitLogGetByIdData } from '@/utils/api';
import Toast from '@/utils/toast';
import type { User } from '@/utils/type';
import Link from '@/utils/link';
import Bot from '@/utils/bot';

Bot.tip.addOjTip();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentCalendar = ref(0);
const currentData = ref(0)

const jwtUserInfo = JWT.getUserInfo();

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

// 增加占位数据，保证刷新时页面变化小
const activities = ref<ActivityItem[]>([
    {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    }, {
        title: "-",
        status: "",
        link: "",
        time: ""
    },
])

const getSubmitInfo = async () => {
    const response = await API.core.submitLog.getById(user.value.userId, -1, 10);
    Toast.stdResponse(response, false);

    if (response.success) {
        activities.value = [];
        response.data.data.forEach((item: CoreSubmitLogGetByIdData) => {
            const platform = item.platform;
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
                title: `在 ${platform} 使用 ${lang} 解决 ${problem || contest}：`,
                status: status,
                link: Link.getSubmitLink(platform, contest, item.submitId),
                time: time,
            });
        });
    }
}

// 获取用户信息
const getUserInfo = async () => {
    const response = await API.user.profile.getById(user.value.userId);

    if (response.success) {
        user.value = response.data;
    }

    Toast.stdResponse(response, false);

    getSubmitInfo();
    getHeatmapData();
    getData();
}

interface HeatmapData {
    date: string;
    count: number;
}

const submitData = ref<HeatmapData[]>([])
const acData = ref<HeatmapData[]>([])

const dynamicYear = ref<number>(new Date().getFullYear())

const handleYearChange = (year: number) => {
    dynamicYear.value = year
}

const padZero = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
}

const getHeatmapData = async () => {
    const dateObj = new Date();
    const date = dateObj.getFullYear() + padZero(dateObj.getMonth() + 1) + padZero(dateObj.getDate());

    const response1 = await API.core.statistic.heatmap({
        userId: user.value.userId,
        startDate: "20230101",
        endDate: date,
        isAc: false
    })
    Toast.stdResponse(response1, false);

    if (response1.success) {
        submitData.value = response1.data.data.filter(item => item.count > 0);
    }

    const response2 = await API.core.statistic.heatmap({
        userId: user.value.userId,
        startDate: "20230101",
        endDate: date,
        isAc: true
    })
    Toast.stdResponse(response2, false);

    if (response2.success) {
        acData.value = response2.data.data.filter(item => item.count > 0);
    }
}

interface Unit {
    title: string;
    value: number;
    ave: number;
    grow?: number;
}

interface Data {
    ac: {
        today: Unit,
        thisWeek: Unit,
        thisMonth: Unit,
        thisYear: Unit,
        total: Unit,
        percentage: Unit
    },
    submit: {
        today: Unit,
        thisWeek: Unit,
        thisMonth: Unit,
        thisYear: Unit,
        total: Unit,
        percentage: Unit
    }
}

const data = ref<Data>({
    ac: {
        today: {
            title: "今日AC",
            value: 0,
            ave: 0,
            grow: undefined
        },
        thisWeek: {
            title: "本周AC",
            value: 0,
            ave: 0,
            grow: 0
        },
        thisMonth: {
            title: "本月AC",
            value: 0,
            ave: 0,
            grow: 0
        },
        thisYear: {
            title: "今年AC",
            value: 0,
            ave: 0,
            grow: 0
        },
        total: {
            title: "总AC",
            value: 0,
            ave: 0,
            grow: undefined
        },
        percentage: {
            title: "AC率",
            value: 0,
            ave: 0,
            grow: undefined
        }
    },
    submit: {
        today: {
            title: "今日提交",
            value: 0,
            ave: 0,
            grow: undefined
        },
        thisWeek: {
            title: "本周提交",
            value: 0,
            ave: 0,
            grow: 0
        },
        thisMonth: {
            title: "本月提交",
            value: 0,
            ave: 0,
            grow: 0
        },
        thisYear: {
            title: "今年提交",
            value: 0,
            ave: 0,
            grow: 0
        },
        total: {
            title: "总提交",
            value: 0,
            ave: 0,
            grow: undefined
        },
        percentage: {
            title: "AC率",
            value: 0,
            ave: 0,
            grow: undefined
        }
    },
})

const getGrowClass = (grow: number | undefined) => {
    if (grow) {
        if (grow === 0) {
            return "equal";
        } else if (grow > 0) {
            return "up";
        } else if (grow < 0) {
            return "down";
        }
    }
}

const getData = async () => {
    const userId = user.value.userId

    const userResponse = await API.core.statistic.period(userId);
    const globalResponse = await API.core.statistic.period(-1);
    const userCountResponse = await API.user.profile.list(1);

    Toast.stdResponse(userResponse, false);
    Toast.stdResponse(globalResponse, false);
    Toast.stdResponse(userCountResponse, false);

    if (userResponse.success && globalResponse.success && userCountResponse.success) {
        const userData: CoreStatisticPeriodData = userResponse.data.data;
        const globalData: CoreStatisticPeriodData = globalResponse.data.data;
        const userCount: number = userCountResponse.data.total;
        data.value = {
            ac: {
                today: {
                    title: "今日AC",
                    value: Number(userData.ac.today),
                    ave: globalData.ac.today / userCount,
                    grow: undefined
                },
                thisWeek: {
                    title: "本周AC",
                    value: Number(userData.ac.thisWeek),
                    ave: globalData.ac.thisWeek / userCount,
                    grow: userData.ac.thisWeek - userData.ac.lastWeek
                },
                thisMonth: {
                    title: "本月AC",
                    value: Number(userData.ac.thisMonth),
                    ave: globalData.ac.thisMonth / userCount,
                    grow: userData.ac.thisMonth - userData.ac.lastMonth
                },
                thisYear: {
                    title: "今年AC",
                    value: Number(userData.ac.thisYear),
                    ave: globalData.ac.thisYear / userCount,
                    grow: userData.ac.thisYear - userData.ac.lastYear
                },
                total: {
                    title: "总AC ",
                    value: Number(userData.ac.total),
                    ave: globalData.ac.total / userCount,
                    grow: undefined
                },
                percentage: {
                    title: "AC率 ",
                    value: userData.ac.total / userData.submit.total * 100,
                    ave: globalData.ac.total / globalData.submit.total * 100,
                    grow: undefined
                }
            },
            submit: {
                today: {
                    title: "今日提交",
                    value: Number(userData.submit.today),
                    ave: globalData.submit.today / userCount,
                    grow: undefined
                },
                thisWeek: {
                    title: "本周提交",
                    value: Number(userData.submit.thisWeek),
                    ave: globalData.submit.thisWeek / userCount,
                    grow: userData.submit.thisWeek - userData.submit.lastWeek
                },
                thisMonth: {
                    title: "本月提交",
                    value: Number(userData.submit.thisMonth),
                    ave: globalData.submit.thisMonth / userCount,
                    grow: userData.submit.thisMonth - userData.submit.lastMonth
                },
                thisYear: {
                    title: "今年提交",
                    value: Number(userData.submit.thisYear),
                    ave: globalData.submit.thisYear / userCount,
                    grow: userData.submit.thisYear - userData.submit.lastYear
                },
                total: {
                    title: "总提交",
                    value: Number(userData.submit.total),
                    ave: globalData.submit.total / userCount,
                    grow: undefined
                },
                percentage: {
                    title: "AC率",
                    value: userData.ac.total / userData.submit.total * 100,
                    ave: globalData.ac.total / globalData.submit.total * 100,
                    grow: undefined
                }
            }
        }
    }
}

const updateLog = async () => {
    const response = await API.core.spider.update(user.value.userId);
    Toast.stdResponse(response);
}

const showLogoutConfirm = () => {
    confirmRef.value?.show()
}

const logout = async () => {
    JWT.clearToken()
    userStore.syncStatus()

    // 跳转到登录页面
    router.push('/login')
}

onMounted(() => {
    // 该页面有登录路由守卫
    if (route.query.id) {
        user.value.userId = Number(route.query.id);
    } else {
        user.value.userId = JWT.getUserInfo()!.userId;
    }
    getUserInfo()
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px 0;
    gap: 20px;

    >.top {
        display: flex;
        flex-direction: row;
        align-items: center;
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


            >.background {
                display: none;
            }

            >.avatar {
                position: relative;
                overflow: hidden;
                border-radius: 50%;
                width: 80%;
                aspect-ratio: 1;
                border: 1rem solid var(--background-color-content);
                box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;

                /* &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    box-shadow: inset 0 0 0 1rem #e5e5e5;
                } */

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
                background: var(--background-color-content);
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                padding: 20px;
                gap: 20px;
                width: 100%;

                >.name {
                    width: 100%;
                    /* border-bottom: 1px solid var(--divider-color); */

                    >.name {
                        font-size: var(--text-2xl);
                        font-weight: bold;
                    }

                    >.username {
                        font-size: var(--text-xl);
                        color: var(--text-light-color);
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

                        >.link {
                            position: relative;
                            border-radius: 6px;
                            transition: padding 0.3s ease;

                            &.go {
                                background-color: var(--neon-cyan);
                                padding: 0 10px 0 20px;
                            }

                            &.go::before {
                                pointer-events: none;
                                content: '>';
                                position: absolute;
                                left: 10px;
                                color: var(--text-reverse-color);
                                transform: rotate(0deg);
                                transition: all 0.3s ease;
                            }

                            &.go:hover::before {
                                left: calc(100% - 20px);
                                transform: rotate(180deg);
                            }

                            &.go:hover {
                                padding: 0 20px 0 10px;
                            }

                            >a {
                                color: var(--text-reverse-color);
                                text-decoration: none;
                            }
                        }
                    }
                }

                >.moblie-details {
                    display: none;
                }
            }

            >.actions {
                display: flex;
                flex-direction: column;
                width: 100%;
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
            font-size: var(--text-base);
        }

        >.value {
            font-size: var(--text-base);
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

        >.title {
            width: 80%;
            font-size: var(--text-sm);
        }

        >.time {
            display: flex;
            justify-content: flex-end;
            width: 20%;
            font-size: var(--text-xs);
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
    font-size: var(--text-sm);
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

.moblie-actions {
    display: none;
}

.statisticItems {
    display: flex;
    flex-direction: column;
    gap: 10px;

    >.statisticItem {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;

        >.title {
            font-size: var(--text-base);
            width: 80px;
        }

        >.barContainer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-grow: 1;
            flex-direction: row;
            position: relative;
            background-color: var(--background-color-1);

            >.bar {
                width: 0%;
                position: relative;
                height: 10px;
                background-color: var(--neon-cyan);
                transition: all 1s ease-in-out;
            }

            >.ave {
                font-size: var(--text-xs);
                text-wrap: nowrap;
                position: absolute;
                z-index: 1;
                left: 50%;
                top: -100%;
                transform: translate(-50%, -50%);
                transition: all 1s ease-in-out;
            }

            >.cursor {
                position: absolute;
                z-index: 2;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 2px;
                height: 12px;
                background-color: red;
                transition: all 1s ease-in-out;
            }
        }

        >.value {
            font-size: var(--text-base);
            width: 50px;
        }

        >.grow {
            font-size: var(--text-base);
            width: 50px;

            &.up {
                color: red;
            }

            &.down {
                color: green;
            }

            &.equal {
                color: var(--text-light-color);
            }
        }
    }
}

@media (max-width:1600px) {
    .container {
        width: calc(100% - 40px);
        padding: 0 20px;
    }

    .container>.top {
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

@media (max-width:1000px) {
    .moblie-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .btn {
            width: 100%;
            font-size: var(--text-base);
        }
    }

    .container {
        width: 100%;
        padding: 0;

        >.top {
            >.left {
                position: relative;
                flex-direction: column;
                gap: 0;

                >.background {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 200px;
                    background-color: var(--background-color-2);
                    overflow: hidden;

                    >.flow-emoji {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform-origin: center center;
                        transform: translate(-50%, -50%) rotate(-10deg);
                        width: 100%;
                        font-size: 2rem;
                        text-wrap: nowrap;
                        letter-spacing: 10px;
                        line-height: 2;
                        user-select: none;
                    }
                }

                >.avatar {
                    position: absolute;
                    left: 20px;
                    top: 150px;
                    overflow: hidden;
                    border-radius: 50%;
                    width: 100px;
                    aspect-ratio: 1;
                    border: 10px solid var(--background-color-2);
                    box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        user-select: none;
                        -webkit-user-drag: none;
                    }
                }

                >.info {
                    background: none;
                    box-shadow: none;
                    padding: 75px 20px 0 20px;
                    width: calc(100% - 40px);

                    >.name {
                        border-bottom: none;

                        >.name {
                            font-size: 2rem;
                        }

                        >.username {
                            font-size: 1.2rem;
                        }
                    }

                    >.details {
                        display: none;
                    }

                    >.moblie-details {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        gap: 5px;

                        >.item {
                            flex-grow: 0;
                            width: auto;
                            color: var(--text-light-color);
                            text-decoration: none;
                            background-color: var(--background-color-2);
                            padding: 5px 10px;
                            border-radius: 10px;
                            font-size: var(--text-sm);
                        }
                    }
                }

                >.actions {
                    display: none;
                }
            }

            >.right {
                width: calc(100% - 40px);
                padding: 0 20px;
            }
        }
    }

    .section {
        border-left: none;
        border-right: none;
        border-bottom: none;

        >.header {
            border-bottom: none;
        }
    }
}

@media (max-width:600px) {
    .container {
        >.top {
            >.right {
                width: 100%;
                padding: 0;
            }
        }
    }
}
</style>