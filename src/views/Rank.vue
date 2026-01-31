<template>
    <BaseLayout>
        <div>
            <div class="sections">
                <div class="section" v-if="currentSection" v-for="item in sections"
                    :class="currentSection.id === item.id ? 'active' : ''" @click="currentSection = item">
                    <div class="title">
                        <div class="zh">{{ item.title }}</div>
                    </div>
                </div>
            </div>
            <RankPlus v-if="currentSection" :api="currentSection.api" :title="currentSection?.title" class="rank" />
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseLayout from '@/components/BaseLayout.vue';
import RankPlus from '@/components/RankPlus.vue';

// 把api直接扔给组件，打算以后内部自己调用，完成榜单的分页查询。

const sections = ref([
    {
        id: 1,
        title: 'AC总榜',
        api: '',
    },
    {
        id: 2,
        title: 'AC年榜',
        api: '',
    },
    {
        id: 3,
        title: 'AC月榜',
        api: '',
    },
    {
        id: 4,
        title: 'AC周榜',
        api: '',
    },
    {
        id: 5,
        title: 'AC日榜',
        api: '',
    }
])

const currentSection = ref(sections.value[0]);
</script>

<style scoped>
.sections {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
}

.section {
    display: flex;
    position: relative;
    align-items: center;
    height: 50px;
    border: 1px solid var(--divider-color);
    border-bottom: none;
    border-right: none;
    text-wrap: nowrap;

    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

.section:last-child {
    border-right: 1px solid var(--divider-color);
}

a.section {
    color: inherit;
    text-decoration: none;
}

.section.active {
    background-color: var(--section-background-color);
}

.section:hover {
    background-color: var(--section-background-color);
}

.section::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 0%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;

    transition: width 0.2s ease-in-out;
}

.section.active::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5px;
    background-color: var(--section-active-color);
    margin-right: 10px;
}

.section.active .section-icon {
    color: var(--section-active-color);
}

.section.active .title {
    color: var(--text-default-color);
}

.section-icon {
    font-size: var(--text-base);
    width: var(--text-base);
    height: var(--text-base);
    margin-left: 20px;
    color: var(--section-default-color);

    transition: color 0.2s ease-in-out;
}

.section .title {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin: 0 10px 0 10px;
    font-size: var(--text-base);
    color: var(--text-light-color);

    transition: all 0.2s ease-in-out;
}

.rank {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid var(--divider-color);
}
</style>