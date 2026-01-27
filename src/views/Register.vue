<template>
    <BaseLayout>
        <div class="register-box">
            <div class="register-title">注册</div>
            <div class="register-form">
                <div class="form-item">
                    <label>账号</label>
                    <input type="text" v-model="formData.username" placeholder="请输入账号">
                </div>
                <div class="form-item">
                    <label>密码</label>
                    <input type="password" v-model="formData.password" placeholder="请输入密码">
                </div>
                <div class="form-item">
                    <label>请再次输入密码</label>
                    <input type="password" v-model="formData.passwordConfirm" placeholder="请确认密码">
                </div>
                <div class="form-item">
                    <label>姓名</label>
                    <input type="text" v-model="formData.name" placeholder="请输入您的姓名">
                </div>
                <div class="form-item">
                    <label>邮箱</label>
                    <input type="text" v-model="formData.email" placeholder="请输入邮箱">
                </div>
                <div class="form-actions">
                    <div class="to-register">已有账号？<router-link to="/login">立即登录</router-link></div>
                    <button class="register-btn" @click="handleRegister()" :disabled="wait">注册</button>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import { hashPassword } from '@/utils/hash'
import type { UserAuthRegisterRequest as FormData} from '@/utils/api'
import Toast from '@/utils/toast'
import API from '@/utils/api'

const router = useRouter()

// 如果wait为true，则禁用按钮
const wait = ref<boolean>(false)

const formData = ref<FormData>({
    email: '',
    groupId: '1',
    username: '',
    password: '',
    passwordConfirm: '',
    name: ''
})

// 处理注册
const handleRegister = async () => {
    wait.value = true;

    const hashedFormData = {
        ...formData.value,
        password: hashPassword(formData.value.password)
    }

    const response = await API.user.auth.register(hashedFormData);
    Toast.stdResponse(response);

    if (response.success) {
        setTimeout(() => {
            router.push('/login')
        }, 1000)
    }

    wait.value = false;
}
</script>

<style scoped>
.register-box {
    width: 350px;
    margin: 0 auto;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    color: var(--text-default-color);
}

.register-title {
    font-size: 24px;
    padding: 20px;
    border-bottom: 1px solid var(--divider-color);
}

.register-form {
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
    border-radius: 2px;
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

.register-btn {
    width: 100px;
    height: 40px;
    color: var(--text-default-color);
    border: 1px solid var(--divider-color);
    background-color: var(--background-color-1);
    border-radius: 5px;
    cursor: pointer;
}

.register-btn:hover {
    background-color: var(--background-color-2);
}

.register-btn:disabled {
    background-color: var(--background-color-1);
    cursor: not-allowed;
}

.register-btn:disabled:hover {
    background-color: var(--background-color-1);
}
</style>
