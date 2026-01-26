<template>
    <BaseLayout>
        <div class="editProfile">
            <div class="avatar">
                <img :src="formData?.avatar ? formData.avatar : '/images/defaultAvatar.png'" alt=""></img>
            </div>
            <div class="info">
                <div class="title">修改个人资料</div>
                <div class="desc">修改个人资料需要重新登录后生效</div>
                <div class="item">
                    <label>姓名</label>
                    <input type="text" placeholder="Name" v-model="formData.name">
                </div>
                <div class="item">
                    <label>邮箱</label>
                    <input type="text" placeholder="Email" v-model="formData.email">
                </div>
                <div class="actions">
                    <button @click="handleConfirm" :disabled="wait">确认</button>
                    <button @click="handleCancel">返回</button>
                </div>
                <div class="tip" :style="operationTip.type === 'success' ? 'color: green' : 'color: red'">{{
                    operationTip.message }}</div>
            </div>
        </div>
        <div class="addOj">
            <div class="info">
                <div class="title">绑定OJ账号</div>
                <div class="desc">
                    目前仅支持以下平台绑定：AtCoder, 牛客。<br>
                    <!-- 目前仅支持以下平台绑定：AtCoder, LuoGu, NowCoder, CodeForce, LeetCode。<br> -->
                    如何填写用户名？<br>
                    AtCoder:填写用户名，例如您的主页是https://atcoder.jp/users/AoralsFout，那么你就填AoralsFout<br>
                    <!-- LuoGu: 填写您的用户id，例如您的主页是https://www.luogu.com.cn/user/1884901，那么你就填1884901<br> -->
                    牛客: 填写您的用户id，例如您的主页是https://ac.nowcoder.com/acm/contest/profile/978880410，那么你就填978880410<br>
                    <!-- CodeForce: 填写您的用户名，例如您的主页是https://codeforces.com/profile/AoralsFout，那么你就填AoralsFout<br> -->
                    <!-- LeetCode: 填写您的用户id，例如您的主页是https://leetcode.cn/u/musing-i2hodesdmx/，那么你就填musing-i2hodesdmx -->
                </div>
                <div class="item">
                    <label>选择平台</label>
                    <div class="select">
                        <div class="selected">{{ ojData.platform }}</div>
                        <div class="options">
                            <div class="option" @click="ojData.platform = 'AtCoder'">AtCoder</div>
                            <!-- <div class="option" @click="ojData.platform = 'LuoGu'">LuoGu</div> -->
                            <div class="option" @click="ojData.platform = 'NowCoder'">牛客</div>
                            <!-- <div class="option" @click="ojData.platform = 'CodeForce'">CodeForce</div> -->
                            <!-- <div class="option" @click="ojData.platform = 'LeetCode'">LeetCode</div> -->
                        </div>
                    </div>
                </div>
                <div class="item">
                    <label>用户名</label>
                    <input type="text" placeholder="请输入用户名" v-model="ojData.username">
                </div>
                <div class="actions">
                    <button @click="handleOjConfirm" :disabled="wait">确认</button>
                </div>
                <div class="tip" :style="operationTip.type === 'success' ? 'color: green' : 'color: red'">{{
                    operationTip.message }}</div>
            </div>
        </div>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue';
import axios from 'axios';
import JWT from '@/utils/jwt';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Vaildate from '@/utils/vaildate';

const router = useRouter();
const route = useRoute();

const userId = JWT.getUserInfo()?.userId;
const oj = route.query.oj;

const formData = ref({
    userId: userId,
    name: "",
    email: "",
    avatar: ""
})

const ojData = ref({
    userId: userId,
    platform: "",
    username: ""
})

switch (oj) {
    case "AtCoder":
        ojData.value.platform = "AtCoder"
        break;
    // case "luogu":
    //     ojData.value.platform = "LuoGu"
    //     break;
    case "NowCoder":
        ojData.value.platform = "NowCoder"
        break;
    // case "CodeForces":
    //     ojData.value.platform = "CodeForce"
    //     break;
    // case "LeetCode":
    //     ojData.value.platform = "LeetCode"
    //     break;
    default:
        ojData.value.platform = "AtCoder"
}

const getUserInfo = async () => {
    try {
        const response = await axios.get("/api/user/profile/get-by-id", {
            params: {
                userId: userId,
            }
        })
        if (response.status === 200) {
            formData.value.name = response.data.name;
            formData.value.avatar = response.data.avatar;
            formData.value.email = response.data.email;
        }
    } catch (error) {
    }
}

// 如果wait为true，则禁用按钮
const wait = ref<boolean>(false)

// 操作提示信息
interface OperationTip {
    type: "success" | "error" | "none",
    message: string
}

const operationTip = ref<OperationTip>({
    type: 'none',
    message: ''
})
const handleCancel = () => {
    router.push('/profile')
}

const handleConfirm = async () => {
    wait.value = true
    if (!Vaildate.checkEmali(formData.value.email)) {
        operationTip.value.type = 'error'
        operationTip.value.message = '邮箱格式错误'
        wait.value = false
        return
    }
    try {
        const response = await axios.post('/api/user/profile/update', formData.value, {
            headers: {
                Authorization: `Bearer ${JWT.token}`
            }
        })
        if (response.status === 200) {
            operationTip.value.type = 'success'
            operationTip.value.message = response.data.message
        } else {
            operationTip.value.type = 'error'
            operationTip.value.message = response.data.message
        }
    } catch (error) {
        console.error(error);
        operationTip.value.type = 'error'
        operationTip.value.message = '网络错误，请稍后重试'
    }
    wait.value = false
}

const handleOjConfirm = async () => {
    wait.value = true
    try {
        const response = await axios.post('/api/core/spider/set', ojData.value, {
            headers: {
                Authorization: `Bearer ${JWT.token}`
            }
        })
        if (response.status === 200) {
            operationTip.value.type = 'success'
            operationTip.value.message = response.data.message
        } else {
            operationTip.value.type = 'error'
            operationTip.value.message = response.data.message
        }
    } catch (error) {
        console.error(error);
        operationTip.value.type = 'error'
        operationTip.value.message = '网络错误，请稍后重试'
    }
    wait.value = false
}

onMounted(() => {
    getUserInfo();
})
</script>
<style scoped>
.addOj,
.editProfile {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    gap: 20px;

    input {
        outline: none;
        color: var(--text-default-color);
        border: 1px solid var(--divider-color);
        box-shadow: 0 0 0px 100px var(--background-color-1) inset;
        padding: 10px 20px;
        background-color: var(--background-color-1);
        border-radius: 6px;
    }

    input:focus {
        border: 1px solid var(--input-active-color);
    }

    button {
        width: 100px;
        height: 40px;
        color: var(--text-default-color);
        border: 1px solid var(--divider-color);
        background-color: var(--background-color-1);
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: var(--background-color-2);
    }

    >.avatar {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            user-select: none;
            -webkit-user-drag: none;
        }
    }

    >.info {
        display: flex;
        flex-direction: column;
        gap: 10px;

        >.title {
            font-size: 20px;
            font-weight: bold;
        }

        >.item {
            display: flex;
            align-items: center;
            gap: 10px;

            >.select {
                user-select: none;
                position: relative;

                >.selected {
                    background-color: var(--background-color-1);
                    border-radius: 6px;
                    border: 1px solid var(--divider-color);
                    padding: 10px 20px;
                    cursor: pointer;
                }

                >.options {
                    background-color: var(--background-color-1);
                    border-radius: 6px;
                    border: 1px solid var(--divider-color);
                    position: absolute;
                    display: none;
                    z-index: 10;

                    &:hover {
                        display: block;
                    }

                    >.option {
                        padding: 10px 20px;
                        cursor: pointer;

                        &:hover {
                            background-color: var(--background-color-2);
                        }
                    }
                }

                >.selected:hover+.options {
                    display: block;
                }
            }
        }

        >.desc {
            font-size: 14px;
            color: var(--text-light-color);
        }

        >.actions {
            display: flex;
            flex-direction: row-reverse;
            gap: 10px;
        }
    }

    .tip {
        font-size: 14px;
        margin-top: 10px;
    }
}
</style>