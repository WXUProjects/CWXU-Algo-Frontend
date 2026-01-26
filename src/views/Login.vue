<template>
    <BaseLayout>
        <div class="login-box">
            <div class="login-title">登录</div>
            <div class="login-form">
                <div class="form-item">
                    <label>账号</label>
                    <input type="text" v-model="formData.username" placeholder="请输入账号">
                </div>
                <div class="form-item">
                    <label>密码</label>
                    <input type="password" v-model="formData.password" placeholder="请输入密码">
                </div>
                <div class="form-actions">
                    <div class="to-register">没有账号？<router-link to="/register">立即注册</router-link></div>
                    <button class="login-btn" @click="handleLogin()" :disabled="wait">登录</button>
                </div>
            </div>
            <div class="login-tip" :style="operationTip.type === 'success' ? 'color: green' : 'color: red'">{{
                operationTip.message }}</div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BaseLayout from '@/components/BaseLayout.vue'
import JWT from '@/utils/jwt'
import { hashPassword } from '@/utils/hash'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

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

// 提交数据
interface FormData {
    username: string,
    password: string
}

const formData = ref<FormData>({
    username: '',
    password: ''
})

// 返回数据
interface ResponseData {
    success: boolean,
    message: string,
    jwtToken: string
}

// 处理登录
const handleLogin = async () => {
    wait.value = true

    const hashedFormData = {
        ...formData.value,
        password: hashPassword(formData.value.password)
    }

    try {
        const response = await axios.post<ResponseData>('/api/user/auth/login', hashedFormData)
        if (response.data.success) {
            operationTip.value.type = 'success'
            operationTip.value.message = response.data.message
            
            userStore.setLoginStatus(true)

            JWT.setNewToken(response.data.jwtToken)

            const redirectPath = route.query.redirect as string || '/'
            setTimeout(() => {
                router.push(redirectPath)
            }, 1000)
        } else {
            operationTip.value.type = 'error'
            operationTip.value.message = response.data.message
        }
    } catch (error) {
        operationTip.value.type = 'error'
        operationTip.value.message = '网络错误，请稍后重试'
    }
    wait.value = false
}
</script>

<style scoped>
.login-box {
    width: 350px;
    margin: 0 auto;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    color: var(--text-default-color);
}

.login-title {
    font-size: 24px;
    padding: 20px;
    border-bottom: 1px solid var(--divider-color);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.form-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.form-item input {
    outline: none;
    color: var(--text-default-color);
    border: 1px solid var(--divider-color);
    /* 如果用户使用自动填充，会显示input:-internal-autofill-selected伪元素，
    默认白色背景样式，在深色模式下极其不美观，该伪元素又无法自定义，故使用内阴影填充覆盖。
    另外该伪元素文字样式为黑色，深色模式下观察困难，暂无解决方案（你奶奶滴）。  */
    box-shadow: 0 0 0px 100px var(--background-color-1) inset;
    padding: 10px 20px;
    background-color: var(--background-color-1);
    border-radius: 6px;
}

.form-item input:focus {
    border: 1px solid var(--input-active-color);
}

.form-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.form-actions a {
    color: var(--text-link-color);
}

.login-btn {
    width: 100px;
    height: 40px;
    color: var(--text-default-color);
    border: 1px solid var(--divider-color);
    background-color: var(--background-color-1);
    border-radius: 5px;
    cursor: pointer;
}

.login-btn:hover {
    background-color: var(--background-color-2);
}

.login-btn:disabled {
    background-color: var(--background-color-1);
    cursor: not-allowed;
}

.login-btn:disabled:hover {
    background-color: var(--background-color-1);
}

.login-tip {
    padding: 0 20px 20px 20px;
}
</style>
