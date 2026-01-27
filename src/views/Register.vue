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
import axios from 'axios'
import BaseLayout from '@/components/BaseLayout.vue'
import { hashPassword } from '@/utils/hash'

const router = useRouter()

// 如果wait为true，则禁用按钮
const wait = ref<boolean>(false)

// 表单数据
interface FormData {
    email: string,
    username: string,
    password: string,
    passwordConfirm: string,
    name: string
}

const formData = ref<FormData>({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    name: ''
})

// 返回数据
interface ResponseData {
    success: boolean,
    message: string
}

// 信息校验函数(校验并在前端显示操作提示信息)
const validate = (formData: FormData): boolean => {
    // 空值校验
    // 邮箱格式校验
    // 密码一致性校验

    if (formData.email === '' || formData.username === '' || formData.password === '' || formData.passwordConfirm === '' || formData.name === '') {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: '请填写完整信息', type: 'error' }
        }));
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: '邮箱格式错误', type: 'error' }
        }));
        return false;
    }

    if (formData.password !== formData.passwordConfirm) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: '两次输入密码不一致', type: 'error' }
        }));
        return false;
    }

    return true;
}

// 处理注册
const handleRegister = async () => {
    wait.value = true;
    if (!validate(formData.value)) return;

    const hashedFormData = {
        ...formData.value,
        password: hashPassword(formData.value.password)
    }

    try {
        const response = await axios.post<ResponseData>('/api/user/auth/register', hashedFormData);
        if (response.data.success) {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message, type: 'success' }
            }));
            setTimeout(() => {
                router.push('/login')
            }, 1000)
        } else {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: response.data.message || '注册失败', type: 'error' }
            }));
        }
    } catch (error) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: '网络错误，请稍后重试', type: 'error' }
        }));
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
