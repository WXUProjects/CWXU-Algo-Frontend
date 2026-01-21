<template>
    <BaseLayout>
        <div class="box">
            <div class="title">上传题目</div>
            <div class="form">
                <div class="form-item">
                    <label>标题</label>
                    <input type="text" v-model="formData.title" placeholder="请输入标题">
                </div>
                <div class="form-item">
                    <label>题目类型</label>
                </div>
                <div class="form-item-tags">
                    <div class="tags">
                        <div class="tag" v-for="(tag, index) in tags" :key="index">
                            <div class="tag-name">{{ tag }}</div>
                            <div class="tag-del" @click="removeTag(index)">X</div>
                        </div>
                    </div>
                    <input type="text" placeholder="请输入题目类型,空格或回车添加" v-model="tagInput" @keydown.space="addTag"
                        @keydown.enter.prevent="addTag" @keydown.backspace="delTag">
                </div>
                <div class="form-item">
                    <label>题目链接</label>
                    <input type="text" v-model="formData.link" placeholder="请输入题目链接">
                </div>
                <div class="form-item">
                    <label>难度(1~5 步长0.5)</label>
                    <input type="number" v-model="formData.difficulty" min="1" max="5" step="0.5">
                </div>
                <div class="form-item">
                    <label>备注(可选)</label>
                    <textarea v-model="formData.remark" placeholder="请输入备注"></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn" @click="submit" :disabled="!isFormValid">提交</button>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue';
import { ref, computed } from 'vue';

interface FormData {
    title: string,
    link: string,
    types: string[],
    difficulty: number,
    remark: string,
}

const formData = ref<FormData>({
    title: '',
    link: '',
    types: [],
    difficulty: 1,
    remark: '',
})

const tags = ref<string[]>(["二分"])
const tagInput = ref('');

// 表单验证
const isFormValid = computed(() => {
    return formData.value.title.trim() !== '' &&
        formData.value.link.trim() !== '' &&
        tags.value.length > 0;
});

// 添加标签
const addTag = () => {
    const tag = tagInput.value.trim();
    if (tag) {
        // 检查是否已存在相同的标签
        if (!tags.value.includes(tag) && tags.value.length <= 3) {
            tags.value.push(tag);
        }
        tagInput.value = '';
    }
}

const delTag = () => {
    const tag = tagInput.value.trim();
    if (!tag) {
        tags.value.pop();
    }
}

// 删除标签
const removeTag = (index: number) => {
    tags.value.splice(index, 1);
}

// 提交表单
const submit = () => {
    formData.value.types = [...tags.value];

    console.log('提交数据:', formData.value);
}
</script>

<style scoped>
.box {
    width: 500px;
    margin: 0 auto;
    border: 1px solid var(--divider-color);
    border-radius: 5px;
    color: var(--text-default-color);
}

.title {
    font-size: 24px;
    padding: 20px;
    border-bottom: 1px solid var(--divider-color);
}

.form {
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

.form-item-tags {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    color: var(--text-default-color);
    border: 1px solid var(--divider-color);
    box-shadow: 0 0 0px 100px var(--background-color-1) inset;
    padding: 5px 10px;
    background-color: var(--background-color-1);
    border-radius: 6px;
}

.form-item-tags input {
    background-color: var(--background-color-1);
    color: var(--text-default-color);
    width: calc(100% - 40px);
    border: none;
    outline: none;
}

.tags {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;
}

.tag {
    display: flex;
    flex-direction: row;
    gap: 5px;
    border: 1px solid var(--divider-color);
    padding: 2px 4px;
    border-radius: 6px;
    cursor: pointer;
}

.tag:hover {
    border-color: var(--neon-cyan);
}

.tag-name {
    text-wrap: nowrap;
}

.form-item textarea,
.form-item input {
    width: auto;
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

.form-item textarea:focus,
.form-item input:focus {
    border: 1px solid var(--input-active-color);
}

.form-item textarea {
    resize: vertical;
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

.btn {
    width: 100px;
    height: 40px;
    color: var(--text-default-color);
    border: 1px solid var(--divider-color);
    background-color: var(--background-color-1);
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: var(--background-color-2);
}

.btn:disabled {
    background-color: var(--background-color-1);
    cursor: not-allowed;
}

.btn:disabled:hover {
    background-color: var(--background-color-1);
}

.tip {
    padding: 0 20px 20px 20px;
}
</style>
