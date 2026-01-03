<template>
  <div class="view-container">
    <div class="view-header">
        <div class="title">注册 Register</div>
    </div>
    <div class="view-content">
        <div class="register-box">
            <div class="register-title">注册</div>
            <div class="register-form">
                <div class="form-item">
                    <label for="username">用户名</label>
                    <input type="text" id="username" placeholder="请输入用户名">
                </div>
                <div class="form-item">
                    <label for="password">密码</label>
                    <input type="password" id="password" placeholder="请输入密码">
                </div>
                <div class="form-actions">
                    <div class="to-register">已有账号？<router-link to="/login">立即登录</router-link></div>
                    <button class="register-btn">注册</button>
                </div>
            </div>
            <div class="register-tip" :style="operationTip.type === 'success' ? 'color: green' : 'color: red'">{{ operationTip.message }}</div>
        </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/Footer.vue'

// 操作提示信息接口
interface OperationTip {
    type: "success" | "error",
    message: string
}

// 操作提示信息
const operationTip: OperationTip = {
    type: 'error',
    message: '密码错误'
}
</script>

<style scoped>
.register-box {
    width: 400px;
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
    background-color: var(--background-color-1);
    border-radius: 2px;
}

.form-item input:focus{
    border: 1px solid var(--input-active-color);
}

.form-actions{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.form-actions a{
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

.register-tip{
    padding: 0 20px 20px 20px;
}
</style>

<style>
@import url('@/assets/css/view.css');
</style>