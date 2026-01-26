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
                                <div class="name">NowCoder</div>
                                <div class="link">
                                    <div v-if="!user.links.NowCoder && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.NowCoder && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=NowCoder">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.NowCoder">主页</a>
                                </div>
                            </div>
                            <!-- <div class="item">
                                <div class="name">LeetCode</div>
                                <div class="link">
                                    <div v-if="!user.links.LeetCode && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LeetCode && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LeetCode">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LeetCode">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">LuoGu</div>
                                <div class="link">
                                    <div v-if="!user.links.LuoGu && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.LuoGu && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=LuoGu">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.LuoGu">主页</a>
                                </div>
                            </div>
                            <div class="item">
                                <div class="name">CodeForce</div>
                                <div class="link">
                                    <div v-if="!user.links.CodeForce && jwtUserInfo?.userId != user.userId">未绑定</div>
                                    <router-link v-else-if="!user.links.CodeForce && jwtUserInfo?.userId == user.userId"
                                        to="/changeProfile?oj=CodeForce">去绑定</router-link>
                                    <a v-else target="_blank" :href="user.links.CodeForce">主页</a>
                                </div>
                            </div> -->
                        </div>
                    </div>
                    <div class="actions" v-if="jwtUserInfo?.userId == user.userId">
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
                                <span class="title-text">AC热力图 AC-ACTIVITY</span>
                            </div>
                        </div>
                        <div class="content">
                            <Calendar :data="data" :title="''" style="width: 100%;"></Calendar>
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

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

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

type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForce";

interface Spider {
    platform: platform;
    username: string;
    [property: string]: any;
}

interface Links {
    AtCoder: string;
    NowCoder: string;
    LuoGu: string;
    CodeForce: string;
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
        CodeForce: "",
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

// 获取链接
const getLink = (platform: platform, username: string) => {
    switch (platform) {
        case "AtCoder":
            return "https://atcoder.jp/users/" + username;
        case "NowCoder":
            return "https://ac.nowcoder.com/acm/contest/profile/" + username;
        case "LeetCode":
            return "https://leetcode.cn/u/" + username;
        case "LuoGu":
            return "https://www.luogu.com.cn/user/" + username;
        case "CodeForce":
            return "https://codeforces.com/profile/" + username;
    };
}

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
        }
    } catch (error: any) {
        loading.value.info = error.response.data.message;
    }
}

// 获取用户信息
const getUserInfo = async () => {
    try {
        const response = await axios.get<User>("/api/user/profile/get-by-id", {
            params: {
                userId: user.value.userId,
            }
        })
        if (response.status === 200) {
            loading.value.statue = false;
            user.value = response.data;
            user.value.links = {
                AtCoder: "",
                NowCoder: "",
                LuoGu: "",
                CodeForce: "",
                LeetCode: ""
            };
            response.data.spiders.forEach((item: Spider) => {
                user.value.links[item.platform] = getLink(item.platform, item.username);
            });
        }
    } catch (error: any) {
        loading.value.info = error.response.data.message;
    }

    getSubmitInfo();
}

const data = ref([
    {
        "date": "2021-01-01",
        "count": 3
    },
    {
        "date": "2022-01-01",
        "count": 3
    },
    {
        "date": "2023-01-01",
        "count": 3
    },
    {
        "date": "2024-01-01",
        "count": 3
    },
    {
        "date": "2025-01-01",
        "count": 3
    },
    {
        "date": "2025-01-02",
        "count": 47
    },
    {
        "date": "2025-01-03",
        "count": 19
    },
    {
        "date": "2025-01-04",
        "count": 38
    },
    {
        "date": "2025-01-05",
        "count": 35
    },
    {
        "date": "2025-01-06",
        "count": 45
    },
    {
        "date": "2025-01-07",
        "count": 3
    },
    {
        "date": "2025-01-08",
        "count": 15
    },
    {
        "date": "2025-01-09",
        "count": 43
    },
    {
        "date": "2025-01-10",
        "count": 46
    },
    {
        "date": "2025-01-11",
        "count": 9
    },
    {
        "date": "2025-01-12",
        "count": 47
    },
    {
        "date": "2025-01-13",
        "count": 13
    },
    {
        "date": "2025-01-14",
        "count": 23
    },
    {
        "date": "2025-01-15",
        "count": 42
    },
    {
        "date": "2025-01-16",
        "count": 37
    },
    {
        "date": "2025-01-17",
        "count": 29
    },
    {
        "date": "2025-01-18",
        "count": 9
    },
    {
        "date": "2025-01-19",
        "count": 16
    },
    {
        "date": "2025-01-20",
        "count": 35
    },
    {
        "date": "2025-01-21",
        "count": 36
    },
    {
        "date": "2025-01-22",
        "count": 9
    },
    {
        "date": "2025-01-23",
        "count": 20
    },
    {
        "date": "2025-01-24",
        "count": 30
    },
    {
        "date": "2025-01-25",
        "count": 42
    },
    {
        "date": "2025-01-26",
        "count": 23
    },
    {
        "date": "2025-01-27",
        "count": 3
    },
    {
        "date": "2025-01-28",
        "count": 43
    },
    {
        "date": "2025-01-29",
        "count": 32
    },
    {
        "date": "2025-01-30",
        "count": 42
    },
    {
        "date": "2025-01-31",
        "count": 46
    },
    {
        "date": "2025-02-01",
        "count": 6
    },
    {
        "date": "2025-02-02",
        "count": 23
    },
    {
        "date": "2025-02-03",
        "count": 40
    },
    {
        "date": "2025-02-04",
        "count": 23
    },
    {
        "date": "2025-02-05",
        "count": 2
    },
    {
        "date": "2025-02-06",
        "count": 13
    },
    {
        "date": "2025-02-07",
        "count": 6
    },
    {
        "date": "2025-02-08",
        "count": 16
    },
    {
        "date": "2025-02-09",
        "count": 0
    },
    {
        "date": "2025-02-10",
        "count": 5
    },
    {
        "date": "2025-02-11",
        "count": 24
    },
    {
        "date": "2025-02-12",
        "count": 16
    },
    {
        "date": "2025-02-13",
        "count": 21
    },
    {
        "date": "2025-02-14",
        "count": 46
    },
    {
        "date": "2025-02-15",
        "count": 34
    },
    {
        "date": "2025-02-16",
        "count": 35
    },
    {
        "date": "2025-02-17",
        "count": 20
    },
    {
        "date": "2025-02-18",
        "count": 28
    },
    {
        "date": "2025-02-19",
        "count": 39
    },
    {
        "date": "2025-02-20",
        "count": 36
    },
    {
        "date": "2025-02-21",
        "count": 15
    },
    {
        "date": "2025-02-22",
        "count": 6
    },
    {
        "date": "2025-02-23",
        "count": 24
    },
    {
        "date": "2025-02-24",
        "count": 24
    },
    {
        "date": "2025-02-25",
        "count": 29
    },
    {
        "date": "2025-02-26",
        "count": 13
    },
    {
        "date": "2025-02-27",
        "count": 3
    },
    {
        "date": "2025-02-28",
        "count": 15
    },
    {
        "date": "2025-03-01",
        "count": 6
    },
    {
        "date": "2025-03-02",
        "count": 0
    },
    {
        "date": "2025-03-03",
        "count": 34
    },
    {
        "date": "2025-03-04",
        "count": 45
    },
    {
        "date": "2025-03-05",
        "count": 17
    },
    {
        "date": "2025-03-06",
        "count": 45
    },
    {
        "date": "2025-03-07",
        "count": 19
    },
    {
        "date": "2025-03-08",
        "count": 37
    },
    {
        "date": "2025-03-09",
        "count": 45
    },
    {
        "date": "2025-03-10",
        "count": 6
    },
    {
        "date": "2025-03-11",
        "count": 12
    },
    {
        "date": "2025-03-12",
        "count": 34
    },
    {
        "date": "2025-03-13",
        "count": 22
    },
    {
        "date": "2025-03-14",
        "count": 39
    },
    {
        "date": "2025-03-15",
        "count": 44
    },
    {
        "date": "2025-03-16",
        "count": 42
    },
    {
        "date": "2025-03-17",
        "count": 45
    },
    {
        "date": "2025-03-18",
        "count": 34
    },
    {
        "date": "2025-03-19",
        "count": 1
    },
    {
        "date": "2025-03-20",
        "count": 31
    },
    {
        "date": "2025-03-21",
        "count": 7
    },
    {
        "date": "2025-03-22",
        "count": 39
    },
    {
        "date": "2025-03-23",
        "count": 13
    },
    {
        "date": "2025-03-24",
        "count": 47
    },
    {
        "date": "2025-03-25",
        "count": 3
    },
    {
        "date": "2025-03-26",
        "count": 39
    },
    {
        "date": "2025-03-27",
        "count": 4
    },
    {
        "date": "2025-03-28",
        "count": 4
    },
    {
        "date": "2025-03-29",
        "count": 26
    },
    {
        "date": "2025-03-30",
        "count": 18
    },
    {
        "date": "2025-03-31",
        "count": 36
    },
    {
        "date": "2025-04-01",
        "count": 37
    },
    {
        "date": "2025-04-02",
        "count": 35
    },
    {
        "date": "2025-04-03",
        "count": 40
    },
    {
        "date": "2025-04-04",
        "count": 15
    },
    {
        "date": "2025-04-05",
        "count": 33
    },
    {
        "date": "2025-04-06",
        "count": 14
    },
    {
        "date": "2025-04-07",
        "count": 9
    },
    {
        "date": "2025-04-08",
        "count": 29
    },
    {
        "date": "2025-04-09",
        "count": 25
    },
    {
        "date": "2025-04-10",
        "count": 34
    },
    {
        "date": "2025-04-11",
        "count": 44
    },
    {
        "date": "2025-04-12",
        "count": 41
    },
    {
        "date": "2025-04-13",
        "count": 35
    },
    {
        "date": "2025-04-14",
        "count": 37
    },
    {
        "date": "2025-04-15",
        "count": 29
    },
    {
        "date": "2025-04-16",
        "count": 24
    },
    {
        "date": "2025-04-17",
        "count": 44
    },
    {
        "date": "2025-04-18",
        "count": 31
    },
    {
        "date": "2025-04-19",
        "count": 26
    },
    {
        "date": "2025-04-20",
        "count": 47
    },
    {
        "date": "2025-04-21",
        "count": 28
    },
    {
        "date": "2025-04-22",
        "count": 0
    },
    {
        "date": "2025-04-23",
        "count": 47
    },
    {
        "date": "2025-04-24",
        "count": 21
    },
    {
        "date": "2025-04-25",
        "count": 13
    },
    {
        "date": "2025-04-26",
        "count": 46
    },
    {
        "date": "2025-04-27",
        "count": 1
    },
    {
        "date": "2025-04-28",
        "count": 35
    },
    {
        "date": "2025-04-29",
        "count": 28
    },
    {
        "date": "2025-04-30",
        "count": 42
    },
    {
        "date": "2025-05-01",
        "count": 32
    },
    {
        "date": "2025-05-02",
        "count": 20
    },
    {
        "date": "2025-05-03",
        "count": 50
    },
    {
        "date": "2025-05-04",
        "count": 36
    },
    {
        "date": "2025-05-05",
        "count": 22
    },
    {
        "date": "2025-05-06",
        "count": 50
    },
    {
        "date": "2025-05-07",
        "count": 28
    },
    {
        "date": "2025-05-08",
        "count": 8
    },
    {
        "date": "2025-05-09",
        "count": 17
    },
    {
        "date": "2025-05-10",
        "count": 2
    },
    {
        "date": "2025-05-11",
        "count": 45
    },
    {
        "date": "2025-05-12",
        "count": 15
    },
    {
        "date": "2025-05-13",
        "count": 20
    },
    {
        "date": "2025-05-14",
        "count": 9
    },
    {
        "date": "2025-05-15",
        "count": 43
    },
    {
        "date": "2025-05-16",
        "count": 43
    },
    {
        "date": "2025-05-17",
        "count": 23
    },
    {
        "date": "2025-05-18",
        "count": 27
    },
    {
        "date": "2025-05-19",
        "count": 9
    },
    {
        "date": "2025-05-20",
        "count": 22
    },
    {
        "date": "2025-05-21",
        "count": 48
    },
    {
        "date": "2025-05-22",
        "count": 14
    },
    {
        "date": "2025-05-23",
        "count": 22
    },
    {
        "date": "2025-05-24",
        "count": 24
    },
    {
        "date": "2025-05-25",
        "count": 46
    },
    {
        "date": "2025-05-26",
        "count": 13
    },
    {
        "date": "2025-05-27",
        "count": 9
    },
    {
        "date": "2025-05-28",
        "count": 9
    },
    {
        "date": "2025-05-29",
        "count": 29
    },
    {
        "date": "2025-05-30",
        "count": 9
    },
    {
        "date": "2025-05-31",
        "count": 38
    },
    {
        "date": "2025-06-01",
        "count": 1
    },
    {
        "date": "2025-06-02",
        "count": 43
    },
    {
        "date": "2025-06-03",
        "count": 1
    },
    {
        "date": "2025-06-04",
        "count": 9
    },
    {
        "date": "2025-06-05",
        "count": 5
    },
    {
        "date": "2025-06-06",
        "count": 8
    },
    {
        "date": "2025-06-07",
        "count": 2
    },
    {
        "date": "2025-06-08",
        "count": 15
    },
    {
        "date": "2025-06-09",
        "count": 15
    },
    {
        "date": "2025-06-10",
        "count": 46
    },
    {
        "date": "2025-06-11",
        "count": 21
    },
    {
        "date": "2025-06-12",
        "count": 10
    },
    {
        "date": "2025-06-13",
        "count": 23
    },
    {
        "date": "2025-06-14",
        "count": 0
    },
    {
        "date": "2025-06-15",
        "count": 21
    },
    {
        "date": "2025-06-16",
        "count": 49
    },
    {
        "date": "2025-06-17",
        "count": 0
    },
    {
        "date": "2025-06-18",
        "count": 45
    },
    {
        "date": "2025-06-19",
        "count": 31
    },
    {
        "date": "2025-06-20",
        "count": 7
    },
    {
        "date": "2025-06-21",
        "count": 34
    },
    {
        "date": "2025-06-22",
        "count": 5
    },
    {
        "date": "2025-06-23",
        "count": 17
    },
    {
        "date": "2025-06-24",
        "count": 10
    },
    {
        "date": "2025-06-25",
        "count": 11
    },
    {
        "date": "2025-06-26",
        "count": 38
    },
    {
        "date": "2025-06-27",
        "count": 10
    },
    {
        "date": "2025-06-28",
        "count": 44
    },
    {
        "date": "2025-06-29",
        "count": 38
    },
    {
        "date": "2025-06-30",
        "count": 38
    },
    {
        "date": "2025-07-01",
        "count": 1
    },
    {
        "date": "2025-07-02",
        "count": 35
    },
    {
        "date": "2025-07-03",
        "count": 11
    },
    {
        "date": "2025-07-04",
        "count": 24
    },
    {
        "date": "2025-07-05",
        "count": 19
    },
    {
        "date": "2025-07-06",
        "count": 36
    },
    {
        "date": "2025-07-07",
        "count": 1
    },
    {
        "date": "2025-07-08",
        "count": 12
    },
    {
        "date": "2025-07-09",
        "count": 27
    },
    {
        "date": "2025-07-10",
        "count": 42
    },
    {
        "date": "2025-07-11",
        "count": 10
    },
    {
        "date": "2025-07-12",
        "count": 45
    },
    {
        "date": "2025-07-13",
        "count": 22
    },
    {
        "date": "2025-07-14",
        "count": 40
    },
    {
        "date": "2025-07-15",
        "count": 37
    },
    {
        "date": "2025-07-16",
        "count": 36
    },
    {
        "date": "2025-07-17",
        "count": 50
    },
    {
        "date": "2025-07-18",
        "count": 49
    },
    {
        "date": "2025-07-19",
        "count": 41
    },
    {
        "date": "2025-07-20",
        "count": 35
    },
    {
        "date": "2025-07-21",
        "count": 32
    },
    {
        "date": "2025-07-22",
        "count": 47
    },
    {
        "date": "2025-07-23",
        "count": 42
    },
    {
        "date": "2025-07-24",
        "count": 3
    },
    {
        "date": "2025-07-25",
        "count": 44
    },
    {
        "date": "2025-07-26",
        "count": 6
    },
    {
        "date": "2025-07-27",
        "count": 50
    },
    {
        "date": "2025-07-28",
        "count": 33
    },
    {
        "date": "2025-07-29",
        "count": 2
    },
    {
        "date": "2025-07-30",
        "count": 12
    },
    {
        "date": "2025-07-31",
        "count": 17
    },
    {
        "date": "2025-08-01",
        "count": 7
    },
    {
        "date": "2025-08-02",
        "count": 25
    },
    {
        "date": "2025-08-03",
        "count": 9
    },
    {
        "date": "2025-08-04",
        "count": 23
    },
    {
        "date": "2025-08-05",
        "count": 21
    },
    {
        "date": "2025-08-06",
        "count": 49
    },
    {
        "date": "2025-08-07",
        "count": 24
    },
    {
        "date": "2025-08-08",
        "count": 18
    },
    {
        "date": "2025-08-09",
        "count": 15
    },
    {
        "date": "2025-08-10",
        "count": 17
    },
    {
        "date": "2025-08-11",
        "count": 1
    },
    {
        "date": "2025-08-12",
        "count": 0
    },
    {
        "date": "2025-08-13",
        "count": 19
    },
    {
        "date": "2025-08-14",
        "count": 38
    },
    {
        "date": "2025-08-15",
        "count": 26
    },
    {
        "date": "2025-08-16",
        "count": 2
    },
    {
        "date": "2025-08-17",
        "count": 2
    },
    {
        "date": "2025-08-18",
        "count": 9
    },
    {
        "date": "2025-08-19",
        "count": 5
    },
    {
        "date": "2025-08-20",
        "count": 35
    },
    {
        "date": "2025-08-21",
        "count": 40
    },
    {
        "date": "2025-08-22",
        "count": 42
    },
    {
        "date": "2025-08-23",
        "count": 47
    },
    {
        "date": "2025-08-24",
        "count": 15
    },
    {
        "date": "2025-08-25",
        "count": 44
    },
    {
        "date": "2025-08-26",
        "count": 39
    },
    {
        "date": "2025-08-27",
        "count": 27
    },
    {
        "date": "2025-08-28",
        "count": 27
    },
    {
        "date": "2025-08-29",
        "count": 9
    },
    {
        "date": "2025-08-30",
        "count": 33
    },
    {
        "date": "2025-08-31",
        "count": 50
    },
    {
        "date": "2025-09-01",
        "count": 22
    },
    {
        "date": "2025-09-02",
        "count": 50
    },
    {
        "date": "2025-09-03",
        "count": 35
    },
    {
        "date": "2025-09-04",
        "count": 31
    },
    {
        "date": "2025-09-05",
        "count": 7
    },
    {
        "date": "2025-09-06",
        "count": 23
    },
    {
        "date": "2025-09-07",
        "count": 26
    },
    {
        "date": "2025-09-08",
        "count": 5
    },
    {
        "date": "2025-09-09",
        "count": 11
    },
    {
        "date": "2025-09-10",
        "count": 20
    },
    {
        "date": "2025-09-11",
        "count": 1
    },
    {
        "date": "2025-09-12",
        "count": 50
    },
    {
        "date": "2025-09-13",
        "count": 38
    },
    {
        "date": "2025-09-14",
        "count": 36
    },
    {
        "date": "2025-09-15",
        "count": 5
    },
    {
        "date": "2025-09-16",
        "count": 34
    },
    {
        "date": "2025-09-17",
        "count": 50
    },
    {
        "date": "2025-09-18",
        "count": 0
    },
    {
        "date": "2025-09-19",
        "count": 31
    },
    {
        "date": "2025-09-20",
        "count": 11
    },
    {
        "date": "2025-09-21",
        "count": 22
    },
    {
        "date": "2025-09-22",
        "count": 45
    },
    {
        "date": "2025-09-23",
        "count": 34
    },
    {
        "date": "2025-09-24",
        "count": 16
    },
    {
        "date": "2025-09-25",
        "count": 34
    },
    {
        "date": "2025-09-26",
        "count": 47
    },
    {
        "date": "2025-09-27",
        "count": 31
    },
    {
        "date": "2025-09-28",
        "count": 47
    },
    {
        "date": "2025-09-29",
        "count": 32
    },
    {
        "date": "2025-09-30",
        "count": 1
    },
    {
        "date": "2025-10-01",
        "count": 42
    },
    {
        "date": "2025-10-02",
        "count": 34
    },
    {
        "date": "2025-10-03",
        "count": 39
    },
    {
        "date": "2025-10-04",
        "count": 12
    },
    {
        "date": "2025-10-05",
        "count": 42
    },
    {
        "date": "2025-10-06",
        "count": 9
    },
    {
        "date": "2025-10-07",
        "count": 16
    },
    {
        "date": "2025-10-08",
        "count": 20
    },
    {
        "date": "2025-10-09",
        "count": 43
    },
    {
        "date": "2025-10-10",
        "count": 5
    },
    {
        "date": "2025-10-11",
        "count": 10
    },
    {
        "date": "2025-10-12",
        "count": 4
    },
    {
        "date": "2025-10-13",
        "count": 30
    },
    {
        "date": "2025-10-14",
        "count": 15
    },
    {
        "date": "2025-10-15",
        "count": 42
    },
    {
        "date": "2025-10-16",
        "count": 9
    },
    {
        "date": "2025-10-17",
        "count": 37
    },
    {
        "date": "2025-10-18",
        "count": 28
    },
    {
        "date": "2025-10-19",
        "count": 37
    },
    {
        "date": "2025-10-20",
        "count": 0
    },
    {
        "date": "2025-10-21",
        "count": 36
    },
    {
        "date": "2025-10-22",
        "count": 39
    },
    {
        "date": "2025-10-23",
        "count": 42
    },
    {
        "date": "2025-10-24",
        "count": 16
    },
    {
        "date": "2025-10-25",
        "count": 11
    },
    {
        "date": "2025-10-26",
        "count": 5
    },
    {
        "date": "2025-10-27",
        "count": 8
    },
    {
        "date": "2025-10-28",
        "count": 23
    },
    {
        "date": "2025-10-29",
        "count": 33
    },
    {
        "date": "2025-10-30",
        "count": 25
    },
    {
        "date": "2025-10-31",
        "count": 14
    },
    {
        "date": "2025-11-01",
        "count": 39
    },
    {
        "date": "2025-11-02",
        "count": 44
    },
    {
        "date": "2025-11-03",
        "count": 21
    },
    {
        "date": "2025-11-04",
        "count": 3
    },
    {
        "date": "2025-11-05",
        "count": 2
    },
    {
        "date": "2025-11-06",
        "count": 48
    },
    {
        "date": "2025-11-07",
        "count": 28
    },
    {
        "date": "2025-11-08",
        "count": 4
    },
    {
        "date": "2025-11-09",
        "count": 24
    },
    {
        "date": "2025-11-10",
        "count": 12
    },
    {
        "date": "2025-11-11",
        "count": 44
    },
    {
        "date": "2025-11-12",
        "count": 3
    },
    {
        "date": "2025-11-13",
        "count": 25
    },
    {
        "date": "2025-11-14",
        "count": 1
    },
    {
        "date": "2025-11-15",
        "count": 45
    },
    {
        "date": "2025-11-16",
        "count": 49
    },
    {
        "date": "2025-11-17",
        "count": 33
    },
    {
        "date": "2025-11-18",
        "count": 41
    },
    {
        "date": "2025-11-19",
        "count": 0
    },
    {
        "date": "2025-11-20",
        "count": 2
    },
    {
        "date": "2025-11-21",
        "count": 9
    },
    {
        "date": "2025-11-22",
        "count": 25
    },
    {
        "date": "2025-11-23",
        "count": 40
    },
    {
        "date": "2025-11-24",
        "count": 31
    },
    {
        "date": "2025-11-25",
        "count": 25
    },
    {
        "date": "2025-11-26",
        "count": 3
    },
    {
        "date": "2025-11-27",
        "count": 6
    },
    {
        "date": "2025-11-28",
        "count": 25
    },
    {
        "date": "2025-11-29",
        "count": 40
    },
    {
        "date": "2025-11-30",
        "count": 28
    },
    {
        "date": "2025-12-01",
        "count": 15
    },
    {
        "date": "2025-12-02",
        "count": 27
    },
    {
        "date": "2025-12-03",
        "count": 10
    },
    {
        "date": "2025-12-04",
        "count": 25
    },
    {
        "date": "2025-12-05",
        "count": 10
    },
    {
        "date": "2025-12-06",
        "count": 20
    },
    {
        "date": "2025-12-07",
        "count": 9
    },
    {
        "date": "2025-12-08",
        "count": 5
    },
    {
        "date": "2025-12-09",
        "count": 17
    },
    {
        "date": "2025-12-10",
        "count": 47
    },
    {
        "date": "2025-12-11",
        "count": 15
    },
    {
        "date": "2025-12-12",
        "count": 23
    },
    {
        "date": "2025-12-13",
        "count": 37
    },
    {
        "date": "2025-12-14",
        "count": 15
    },
    {
        "date": "2025-12-15",
        "count": 42
    },
    {
        "date": "2025-12-16",
        "count": 33
    },
    {
        "date": "2025-12-17",
        "count": 8
    },
    {
        "date": "2025-12-18",
        "count": 10
    },
    {
        "date": "2025-12-19",
        "count": 14
    },
    {
        "date": "2025-12-20",
        "count": 40
    },
    {
        "date": "2025-12-21",
        "count": 35
    },
    {
        "date": "2025-12-22",
        "count": 28
    },
    {
        "date": "2025-12-23",
        "count": 13
    },
    {
        "date": "2025-12-24",
        "count": 33
    },
    {
        "date": "2025-12-25",
        "count": 48
    },
    {
        "date": "2025-12-26",
        "count": 25
    },
    {
        "date": "2025-12-27",
        "count": 46
    },
    {
        "date": "2025-12-28",
        "count": 23
    },
    {
        "date": "2025-12-29",
        "count": 7
    },
    {
        "date": "2025-12-30",
        "count": 11
    },
    {
        "date": "2025-12-31",
        "count": 12
    },
    {
        "date": "2026-01-01",
        "count": 9
    },
    {
        "date": "2026-01-02",
        "count": 25
    },
    {
        "date": "2026-01-03",
        "count": 15
    },
    {
        "date": "2026-01-04",
        "count": 10
    },
    {
        "date": "2026-01-05",
        "count": 48
    },
    {
        "date": "2026-01-06",
        "count": 2
    },
    {
        "date": "2026-01-07",
        "count": 12
    },
    {
        "date": "2026-01-08",
        "count": 42
    },
    {
        "date": "2026-01-09",
        "count": 19
    },
    {
        "date": "2026-01-10",
        "count": 33
    },
    {
        "date": "2026-01-11",
        "count": 0
    },
    {
        "date": "2026-01-12",
        "count": 9
    },
    {
        "date": "2026-01-13",
        "count": 9
    },
    {
        "date": "2026-01-14",
        "count": 27
    },
    {
        "date": "2026-01-15",
        "count": 12
    },
    {
        "date": "2026-01-16",
        "count": 33
    },
    {
        "date": "2026-01-17",
        "count": 18
    },
    {
        "date": "2026-01-18",
        "count": 47
    },
    {
        "date": "2026-01-19",
        "count": 21
    },
    {
        "date": "2026-01-20",
        "count": 40
    },
    {
        "date": "2026-01-21",
        "count": 1
    },
    {
        "date": "2026-01-22",
        "count": 32
    },
    {
        "date": "2026-01-23",
        "count": 47
    },
    {
        "date": "2026-01-24",
        "count": 35
    },
    {
        "date": "2026-01-25",
        "count": 17
    },
    {
        "date": "2026-01-26",
        "count": 1
    },
    {
        "date": "2026-01-27",
        "count": 35
    },
    {
        "date": "2026-01-28",
        "count": 32
    },
    {
        "date": "2026-01-29",
        "count": 24
    },
    {
        "date": "2026-01-30",
        "count": 22
    },
    {
        "date": "2026-01-31",
        "count": 20
    },
    {
        "date": "2026-02-01",
        "count": 7
    },
    {
        "date": "2026-02-02",
        "count": 50
    },
    {
        "date": "2026-02-03",
        "count": 22
    },
    {
        "date": "2026-02-04",
        "count": 36
    },
    {
        "date": "2026-02-05",
        "count": 35
    },
    {
        "date": "2026-02-06",
        "count": 7
    },
    {
        "date": "2026-02-07",
        "count": 28
    },
    {
        "date": "2026-02-08",
        "count": 37
    },
    {
        "date": "2026-02-09",
        "count": 28
    },
    {
        "date": "2026-02-10",
        "count": 33
    },
    {
        "date": "2026-02-11",
        "count": 34
    },
    {
        "date": "2026-02-12",
        "count": 21
    },
    {
        "date": "2026-02-13",
        "count": 48
    },
    {
        "date": "2026-02-14",
        "count": 5
    },
    {
        "date": "2026-02-15",
        "count": 2
    },
    {
        "date": "2026-02-16",
        "count": 36
    },
    {
        "date": "2026-02-17",
        "count": 39
    },
    {
        "date": "2026-02-18",
        "count": 22
    },
    {
        "date": "2026-02-19",
        "count": 17
    },
    {
        "date": "2026-02-20",
        "count": 22
    },
    {
        "date": "2026-02-21",
        "count": 6
    },
    {
        "date": "2026-02-22",
        "count": 3
    },
    {
        "date": "2026-02-23",
        "count": 35
    },
    {
        "date": "2026-02-24",
        "count": 28
    },
    {
        "date": "2026-02-25",
        "count": 9
    },
    {
        "date": "2026-02-26",
        "count": 42
    },
    {
        "date": "2026-02-27",
        "count": 18
    },
    {
        "date": "2026-02-28",
        "count": 31
    },
    {
        "date": "2026-03-01",
        "count": 0
    },
    {
        "date": "2026-03-02",
        "count": 14
    },
    {
        "date": "2026-03-03",
        "count": 38
    },
    {
        "date": "2026-03-04",
        "count": 38
    },
    {
        "date": "2026-03-05",
        "count": 10
    },
    {
        "date": "2026-03-06",
        "count": 43
    },
    {
        "date": "2026-03-07",
        "count": 3
    },
    {
        "date": "2026-03-08",
        "count": 32
    },
    {
        "date": "2026-03-09",
        "count": 30
    },
    {
        "date": "2026-03-10",
        "count": 11
    },
    {
        "date": "2026-03-11",
        "count": 47
    },
    {
        "date": "2026-03-12",
        "count": 50
    },
    {
        "date": "2026-03-13",
        "count": 30
    },
    {
        "date": "2026-03-14",
        "count": 45
    },
    {
        "date": "2026-03-15",
        "count": 26
    },
    {
        "date": "2026-03-16",
        "count": 23
    },
    {
        "date": "2026-03-17",
        "count": 48
    },
    {
        "date": "2026-03-18",
        "count": 34
    },
    {
        "date": "2026-03-19",
        "count": 25
    },
    {
        "date": "2026-03-20",
        "count": 12
    },
    {
        "date": "2026-03-21",
        "count": 39
    },
    {
        "date": "2026-03-22",
        "count": 49
    },
    {
        "date": "2026-03-23",
        "count": 50
    },
    {
        "date": "2026-03-24",
        "count": 8
    },
    {
        "date": "2026-03-25",
        "count": 16
    },
    {
        "date": "2026-03-26",
        "count": 2
    },
    {
        "date": "2026-03-27",
        "count": 0
    },
    {
        "date": "2026-03-28",
        "count": 20
    },
    {
        "date": "2026-03-29",
        "count": 28
    },
    {
        "date": "2026-03-30",
        "count": 2
    },
    {
        "date": "2026-03-31",
        "count": 40
    },
    {
        "date": "2026-04-01",
        "count": 16
    },
    {
        "date": "2026-04-02",
        "count": 27
    },
    {
        "date": "2026-04-03",
        "count": 50
    },
    {
        "date": "2026-04-04",
        "count": 12
    },
    {
        "date": "2026-04-05",
        "count": 41
    },
    {
        "date": "2026-04-06",
        "count": 46
    },
    {
        "date": "2026-04-07",
        "count": 10
    },
    {
        "date": "2026-04-08",
        "count": 10
    },
    {
        "date": "2026-04-09",
        "count": 22
    },
    {
        "date": "2026-04-10",
        "count": 22
    },
    {
        "date": "2026-04-11",
        "count": 5
    },
    {
        "date": "2026-04-12",
        "count": 14
    },
    {
        "date": "2026-04-13",
        "count": 27
    },
    {
        "date": "2026-04-14",
        "count": 21
    },
    {
        "date": "2026-04-15",
        "count": 5
    },
    {
        "date": "2026-04-16",
        "count": 16
    },
    {
        "date": "2026-04-17",
        "count": 29
    },
    {
        "date": "2026-04-18",
        "count": 10
    },
    {
        "date": "2026-04-19",
        "count": 41
    },
    {
        "date": "2026-04-20",
        "count": 22
    },
    {
        "date": "2026-04-21",
        "count": 3
    },
    {
        "date": "2026-04-22",
        "count": 35
    },
    {
        "date": "2026-04-23",
        "count": 24
    },
    {
        "date": "2026-04-24",
        "count": 17
    },
    {
        "date": "2026-04-25",
        "count": 38
    },
    {
        "date": "2026-04-26",
        "count": 7
    },
    {
        "date": "2026-04-27",
        "count": 50
    },
    {
        "date": "2026-04-28",
        "count": 43
    },
    {
        "date": "2026-04-29",
        "count": 34
    },
    {
        "date": "2026-04-30",
        "count": 28
    },
    {
        "date": "2026-05-01",
        "count": 16
    },
    {
        "date": "2026-05-02",
        "count": 29
    },
    {
        "date": "2026-05-03",
        "count": 30
    },
    {
        "date": "2026-05-04",
        "count": 2
    },
    {
        "date": "2026-05-05",
        "count": 22
    },
    {
        "date": "2026-05-06",
        "count": 23
    },
    {
        "date": "2026-05-07",
        "count": 37
    },
    {
        "date": "2026-05-08",
        "count": 50
    },
    {
        "date": "2026-05-09",
        "count": 37
    },
    {
        "date": "2026-05-10",
        "count": 44
    },
    {
        "date": "2026-05-11",
        "count": 14
    },
    {
        "date": "2026-05-12",
        "count": 7
    },
    {
        "date": "2026-05-13",
        "count": 16
    },
    {
        "date": "2026-05-14",
        "count": 12
    },
    {
        "date": "2026-05-15",
        "count": 27
    },
    {
        "date": "2026-05-16",
        "count": 22
    },
    {
        "date": "2026-05-17",
        "count": 35
    },
    {
        "date": "2026-05-18",
        "count": 12
    },
    {
        "date": "2026-05-19",
        "count": 41
    },
    {
        "date": "2026-05-20",
        "count": 24
    },
    {
        "date": "2026-05-21",
        "count": 1
    },
    {
        "date": "2026-05-22",
        "count": 8
    },
    {
        "date": "2026-05-23",
        "count": 48
    },
    {
        "date": "2026-05-24",
        "count": 3
    },
    {
        "date": "2026-05-25",
        "count": 20
    },
    {
        "date": "2026-05-26",
        "count": 22
    },
    {
        "date": "2026-05-27",
        "count": 23
    },
    {
        "date": "2026-05-28",
        "count": 6
    },
    {
        "date": "2026-05-29",
        "count": 12
    },
    {
        "date": "2026-05-30",
        "count": 24
    },
    {
        "date": "2026-05-31",
        "count": 5
    },
    {
        "date": "2026-06-01",
        "count": 0
    },
    {
        "date": "2026-06-02",
        "count": 42
    },
    {
        "date": "2026-06-03",
        "count": 21
    },
    {
        "date": "2026-06-04",
        "count": 16
    },
    {
        "date": "2026-06-05",
        "count": 30
    },
    {
        "date": "2026-06-06",
        "count": 30
    },
    {
        "date": "2026-06-07",
        "count": 40
    },
    {
        "date": "2026-06-08",
        "count": 20
    },
    {
        "date": "2026-06-09",
        "count": 40
    },
    {
        "date": "2026-06-10",
        "count": 9
    },
    {
        "date": "2026-06-11",
        "count": 50
    },
    {
        "date": "2026-06-12",
        "count": 21
    },
    {
        "date": "2026-06-13",
        "count": 35
    },
    {
        "date": "2026-06-14",
        "count": 2
    },
    {
        "date": "2026-06-15",
        "count": 48
    },
    {
        "date": "2026-06-16",
        "count": 29
    },
    {
        "date": "2026-06-17",
        "count": 46
    },
    {
        "date": "2026-06-18",
        "count": 8
    },
    {
        "date": "2026-06-19",
        "count": 25
    },
    {
        "date": "2026-06-20",
        "count": 21
    },
    {
        "date": "2026-06-21",
        "count": 1
    },
    {
        "date": "2026-06-22",
        "count": 27
    },
    {
        "date": "2026-06-23",
        "count": 43
    },
    {
        "date": "2026-06-24",
        "count": 29
    },
    {
        "date": "2026-06-25",
        "count": 13
    },
    {
        "date": "2026-06-26",
        "count": 5
    },
    {
        "date": "2026-06-27",
        "count": 4
    },
    {
        "date": "2026-06-28",
        "count": 38
    },
    {
        "date": "2026-06-29",
        "count": 24
    },
    {
        "date": "2026-06-30",
        "count": 42
    },
    {
        "date": "2026-07-01",
        "count": 9
    },
    {
        "date": "2026-07-02",
        "count": 39
    },
    {
        "date": "2026-07-03",
        "count": 42
    },
    {
        "date": "2026-07-04",
        "count": 26
    },
    {
        "date": "2026-07-05",
        "count": 17
    },
    {
        "date": "2026-07-06",
        "count": 36
    },
    {
        "date": "2026-07-07",
        "count": 20
    },
    {
        "date": "2026-07-08",
        "count": 44
    },
    {
        "date": "2026-07-09",
        "count": 10
    },
    {
        "date": "2026-07-10",
        "count": 3
    },
    {
        "date": "2026-07-11",
        "count": 17
    },
    {
        "date": "2026-07-12",
        "count": 33
    },
    {
        "date": "2026-07-13",
        "count": 5
    },
    {
        "date": "2026-07-14",
        "count": 50
    },
    {
        "date": "2026-07-15",
        "count": 33
    },
    {
        "date": "2026-07-16",
        "count": 46
    },
    {
        "date": "2026-07-17",
        "count": 17
    },
    {
        "date": "2026-07-18",
        "count": 16
    },
    {
        "date": "2026-07-19",
        "count": 17
    },
    {
        "date": "2026-07-20",
        "count": 19
    },
    {
        "date": "2026-07-21",
        "count": 10
    },
    {
        "date": "2026-07-22",
        "count": 29
    },
    {
        "date": "2026-07-23",
        "count": 36
    },
    {
        "date": "2026-07-24",
        "count": 8
    },
    {
        "date": "2026-07-25",
        "count": 33
    },
    {
        "date": "2026-07-26",
        "count": 36
    },
    {
        "date": "2026-07-27",
        "count": 22
    },
    {
        "date": "2026-07-28",
        "count": 49
    },
    {
        "date": "2026-07-29",
        "count": 7
    },
    {
        "date": "2026-07-30",
        "count": 13
    },
    {
        "date": "2026-07-31",
        "count": 38
    },
    {
        "date": "2026-08-01",
        "count": 9
    },
    {
        "date": "2026-08-02",
        "count": 0
    },
    {
        "date": "2026-08-03",
        "count": 47
    },
    {
        "date": "2026-08-04",
        "count": 29
    },
    {
        "date": "2026-08-05",
        "count": 18
    },
    {
        "date": "2026-08-06",
        "count": 2
    },
    {
        "date": "2026-08-07",
        "count": 33
    },
    {
        "date": "2026-08-08",
        "count": 10
    },
    {
        "date": "2026-08-09",
        "count": 0
    },
    {
        "date": "2026-08-10",
        "count": 50
    },
    {
        "date": "2026-08-11",
        "count": 21
    },
    {
        "date": "2026-08-12",
        "count": 40
    },
    {
        "date": "2026-08-13",
        "count": 20
    },
    {
        "date": "2026-08-14",
        "count": 3
    },
    {
        "date": "2026-08-15",
        "count": 8
    },
    {
        "date": "2026-08-16",
        "count": 47
    },
    {
        "date": "2026-08-17",
        "count": 12
    },
    {
        "date": "2026-08-18",
        "count": 18
    },
    {
        "date": "2026-08-19",
        "count": 8
    },
    {
        "date": "2026-08-20",
        "count": 24
    },
    {
        "date": "2026-08-21",
        "count": 26
    },
    {
        "date": "2026-08-22",
        "count": 0
    },
    {
        "date": "2026-08-23",
        "count": 0
    },
    {
        "date": "2026-08-24",
        "count": 21
    },
    {
        "date": "2026-08-25",
        "count": 17
    },
    {
        "date": "2026-08-26",
        "count": 6
    },
    {
        "date": "2026-08-27",
        "count": 35
    },
    {
        "date": "2026-08-28",
        "count": 10
    },
    {
        "date": "2026-08-29",
        "count": 35
    },
    {
        "date": "2026-08-30",
        "count": 7
    },
    {
        "date": "2026-08-31",
        "count": 35
    },
    {
        "date": "2026-09-01",
        "count": 19
    },
    {
        "date": "2026-09-02",
        "count": 48
    },
    {
        "date": "2026-09-03",
        "count": 29
    },
    {
        "date": "2026-09-04",
        "count": 7
    },
    {
        "date": "2026-09-05",
        "count": 37
    },
    {
        "date": "2026-09-06",
        "count": 13
    },
    {
        "date": "2026-09-07",
        "count": 8
    },
    {
        "date": "2026-09-08",
        "count": 46
    },
    {
        "date": "2026-09-09",
        "count": 40
    },
    {
        "date": "2026-09-10",
        "count": 2
    },
    {
        "date": "2026-09-11",
        "count": 44
    },
    {
        "date": "2026-09-12",
        "count": 30
    },
    {
        "date": "2026-09-13",
        "count": 38
    },
    {
        "date": "2026-09-14",
        "count": 34
    },
    {
        "date": "2026-09-15",
        "count": 44
    },
    {
        "date": "2026-09-16",
        "count": 26
    },
    {
        "date": "2026-09-17",
        "count": 4
    },
    {
        "date": "2026-09-18",
        "count": 36
    },
    {
        "date": "2026-09-19",
        "count": 39
    },
    {
        "date": "2026-09-20",
        "count": 0
    },
    {
        "date": "2026-09-21",
        "count": 46
    },
    {
        "date": "2026-09-22",
        "count": 1
    },
    {
        "date": "2026-09-23",
        "count": 36
    },
    {
        "date": "2026-09-24",
        "count": 35
    },
    {
        "date": "2026-09-25",
        "count": 33
    },
    {
        "date": "2026-09-26",
        "count": 16
    },
    {
        "date": "2026-09-27",
        "count": 44
    },
    {
        "date": "2026-09-28",
        "count": 22
    },
    {
        "date": "2026-09-29",
        "count": 35
    },
    {
        "date": "2026-09-30",
        "count": 49
    },
    {
        "date": "2026-10-01",
        "count": 38
    },
    {
        "date": "2026-10-02",
        "count": 30
    },
    {
        "date": "2026-10-03",
        "count": 47
    },
    {
        "date": "2026-10-04",
        "count": 47
    },
    {
        "date": "2026-10-05",
        "count": 33
    },
    {
        "date": "2026-10-06",
        "count": 23
    },
    {
        "date": "2026-10-07",
        "count": 11
    },
    {
        "date": "2026-10-08",
        "count": 41
    },
    {
        "date": "2026-10-09",
        "count": 41
    },
    {
        "date": "2026-10-10",
        "count": 24
    },
    {
        "date": "2026-10-11",
        "count": 15
    },
    {
        "date": "2026-10-12",
        "count": 12
    },
    {
        "date": "2026-10-13",
        "count": 50
    },
    {
        "date": "2026-10-14",
        "count": 26
    },
    {
        "date": "2026-10-15",
        "count": 2
    },
    {
        "date": "2026-10-16",
        "count": 23
    },
    {
        "date": "2026-10-17",
        "count": 0
    },
    {
        "date": "2026-10-18",
        "count": 14
    },
    {
        "date": "2026-10-19",
        "count": 32
    },
    {
        "date": "2026-10-20",
        "count": 19
    },
    {
        "date": "2026-10-21",
        "count": 49
    },
    {
        "date": "2026-10-22",
        "count": 42
    },
    {
        "date": "2026-10-23",
        "count": 29
    },
    {
        "date": "2026-10-24",
        "count": 6
    },
    {
        "date": "2026-10-25",
        "count": 41
    },
    {
        "date": "2026-10-26",
        "count": 29
    },
    {
        "date": "2026-10-27",
        "count": 23
    },
    {
        "date": "2026-10-28",
        "count": 19
    },
    {
        "date": "2026-10-29",
        "count": 29
    },
    {
        "date": "2026-10-30",
        "count": 42
    },
    {
        "date": "2026-10-31",
        "count": 40
    },
    {
        "date": "2026-11-01",
        "count": 50
    },
    {
        "date": "2026-11-02",
        "count": 18
    },
    {
        "date": "2026-11-03",
        "count": 46
    },
    {
        "date": "2026-11-04",
        "count": 44
    },
    {
        "date": "2026-11-05",
        "count": 11
    },
    {
        "date": "2026-11-06",
        "count": 40
    },
    {
        "date": "2026-11-07",
        "count": 10
    },
    {
        "date": "2026-11-08",
        "count": 3
    },
    {
        "date": "2026-11-09",
        "count": 50
    },
    {
        "date": "2026-11-10",
        "count": 26
    },
    {
        "date": "2026-11-11",
        "count": 28
    },
    {
        "date": "2026-11-12",
        "count": 7
    },
    {
        "date": "2026-11-13",
        "count": 41
    },
    {
        "date": "2026-11-14",
        "count": 10
    },
    {
        "date": "2026-11-15",
        "count": 17
    },
    {
        "date": "2026-11-16",
        "count": 19
    },
    {
        "date": "2026-11-17",
        "count": 6
    },
    {
        "date": "2026-11-18",
        "count": 21
    },
    {
        "date": "2026-11-19",
        "count": 25
    },
    {
        "date": "2026-11-20",
        "count": 47
    },
    {
        "date": "2026-11-21",
        "count": 22
    },
    {
        "date": "2026-11-22",
        "count": 31
    },
    {
        "date": "2026-11-23",
        "count": 50
    },
    {
        "date": "2026-11-24",
        "count": 25
    },
    {
        "date": "2026-11-25",
        "count": 39
    },
    {
        "date": "2026-11-26",
        "count": 7
    },
    {
        "date": "2026-11-27",
        "count": 7
    },
    {
        "date": "2026-11-28",
        "count": 34
    },
    {
        "date": "2026-11-29",
        "count": 49
    },
    {
        "date": "2026-11-30",
        "count": 5
    },
    {
        "date": "2026-12-01",
        "count": 45
    },
    {
        "date": "2026-12-02",
        "count": 9
    },
    {
        "date": "2026-12-03",
        "count": 38
    },
    {
        "date": "2026-12-04",
        "count": 22
    },
    {
        "date": "2026-12-05",
        "count": 46
    },
    {
        "date": "2026-12-06",
        "count": 19
    },
    {
        "date": "2026-12-07",
        "count": 43
    },
    {
        "date": "2026-12-08",
        "count": 40
    },
    {
        "date": "2026-12-09",
        "count": 35
    },
    {
        "date": "2026-12-10",
        "count": 6
    },
    {
        "date": "2026-12-11",
        "count": 38
    },
    {
        "date": "2026-12-12",
        "count": 1
    },
    {
        "date": "2026-12-13",
        "count": 14
    },
    {
        "date": "2026-12-14",
        "count": 43
    },
    {
        "date": "2026-12-15",
        "count": 41
    },
    {
        "date": "2026-12-16",
        "count": 3
    },
    {
        "date": "2026-12-17",
        "count": 35
    },
    {
        "date": "2026-12-18",
        "count": 8
    },
    {
        "date": "2026-12-19",
        "count": 29
    },
    {
        "date": "2026-12-20",
        "count": 22
    },
    {
        "date": "2026-12-21",
        "count": 30
    },
    {
        "date": "2026-12-22",
        "count": 20
    },
    {
        "date": "2026-12-23",
        "count": 6
    },
    {
        "date": "2026-12-24",
        "count": 24
    },
    {
        "date": "2026-12-25",
        "count": 41
    },
    {
        "date": "2026-12-26",
        "count": 12
    },
    {
        "date": "2026-12-27",
        "count": 20
    },
    {
        "date": "2026-12-28",
        "count": 1
    },
    {
        "date": "2026-12-29",
        "count": 32
    },
    {
        "date": "2026-12-30",
        "count": 40
    },
    {
        "date": "2026-12-31",
        "count": 22
    }
])

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
            user.value.userId = JWT.getUserInfo()?.userId;
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