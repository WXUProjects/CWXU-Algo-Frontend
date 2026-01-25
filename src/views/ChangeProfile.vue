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
                    <button @click="handleCancel">取消</button>
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
import { useRouter } from 'vue-router';
import Vaildate from '@/utils/vaildate';
const router = useRouter();

const userId = JWT.getUserInfo()?.userId;

const formData = ref({
    userId: userId,
    name: "",
    email: "",
    avatar: ""
})

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

onMounted(() => {
    getUserInfo();
})
</script>
<style scoped>
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