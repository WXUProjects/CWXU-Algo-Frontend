<template>
    <div class="dashboardContent">
        <div class="section">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-people-group" />
                    </span>
                    <span class="title-text">组管理</span>
                </div>
                <div class="header-tabs">
                    <span class="tab" @click="showAddGroup = !showAddGroup">{{ showAddGroup ? "关闭" : "创建组" }}</span>
                    <span class="tab" @click="getGroupData(groupData.currentPage)">刷新</span>
                </div>
            </div>
            <div class="content">
                <div class="content-input"
                    :style="showAddGroup ? 'max-height:200px;opacity: 1' : 'max-height:0;opacity: 0;pointer-events: none;'">
                    <div class="inputs">
                        <label>组名称</label>
                        <input type="text" v-model="createFrom.name" placeholder="请输入组名称">
                    </div>
                    <div class="inputs">
                        <label>组描述</label>
                        <input type="text" v-model="createFrom.describe" placeholder="请输入组描述">
                    </div>
                    <div class="actions">
                        <button class="btn btn-default" @click="createGroup()">确定</button>
                        <button class="btn btn-danger" @click="showAddGroup = false">取消</button>
                    </div>
                </div>
                <table style="z-index: 1;">
                    <thead>
                        <tr>
                            <th style="width: 50px;">组ID</th>
                            <th style="width: 200px;">组名称</th>
                            <th style="width: 200px;">描述</th>
                            <th>成员数</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tr v-for="(item, index) in groupData?.list">
                        <td>{{ item.id }}</td>
                        <td v-if="!item.edit">{{ item.name }}</td>
                        <td v-else>
                            <input type="text" class="tdInput" v-model="updateForm.name">
                        </td>
                        <td v-if="!item.edit">{{ item.describe }}</td>
                        <td v-else>
                            <input type="text" class="tdInput" v-model="updateForm.describe">
                        </td>
                        <td>{{ item.users.length }}</td>
                        <td>
                            <div class="actions">
                                <button class="btn btn-default" @click="getUsersData(Number(item.id))">管理组成员</button>
                                <button class="btn btn-danger" @click="deleteGroup(item.id)">删除组</button>
                                <button class="btn btn-default"
                                    @click="item.edit ? item.edit = false : editItem(index)">{{
                                        item.edit ? "取消编辑" : "编辑组信息" }}</button>
                                <button class="btn btn-primary" v-show="item.edit" @click="update()">确认</button>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="pageNavigation" v-if="groupData">
                    <div class="group">
                        <div class="pageButtons" v-if="groupData.currentPage != 1">
                            <button @click="getGroupData(groupData.currentPage - 1)">上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button v-for="value in groupPages" :key="value"
                                :class="value === groupData.currentPage ? 'active' : ''"
                                @click="value === groupData.currentPage ? null : getGroupData(value)">{{ value
                                }}</button>
                        </div>
                        <div class="pageButtons" v-if="groupData.currentPage != groupData.totalPage">
                            <button @click="getGroupData(groupData.currentPage + 1)">下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageInput">
                            <button @click="getGroupData(groupJumpPage)">跳转</button>
                            <input type="number" min="1" :max="groupData.totalPage" v-model="groupJumpPage">
                        </div>
                        <div class="pageSum">共 {{ groupData.totalPage }} 页</div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div class="section" v-show="usersData.id != -1">
                <div class="header">
                    <div class="header-title">
                        <span class="title-icon">
                            <font-awesome-icon icon="fa-solid fa-people-group" />
                        </span>
                        <span class="title-text">#{{ usersData?.id }} {{ usersData?.name }} 成员管理</span>
                    </div>
                    <div class="header-tabs">
                        <span class="tab" @click="usersData.id = -1; showAddUser = false">退出组管理</span>
                        <span class="tab" @click="showAddUser = !showAddUser">{{ showAddUser ? "取消添加成员" : "添加成员"
                        }}</span>
                        <span class="tab" @click="getUsersData(usersData.id)" v-if="usersData">刷新</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content-input"
                        :style="showAddUser ? 'max-height: 180px;opacity:1' : 'max-height:0px;opacity:0;pointer-events: none;'">
                        <div>我想换成搜索框直接搜用户姓名选择，输入id有点反人类</div>
                        <div class="inputs">
                            <label>用户id</label>
                            <input type="text" placeholder="请输入你要添加用户的id" v-model="userIdInput"
                                @input="handleUserIdInput">
                        </div>
                        <div class="inputs">
                            <label>确认姓名</label>
                            <input type="text" v-model="userNameInput" style="cursor:not-allowed;" disabled="true"
                                placeholder="自动获取姓名，请您确认">
                        </div>
                        <div class="actions">
                            <button class="btn btn-default" @click="move(Number(userIdInput), usersData.id)">确定</button>
                            <button class="btn btn-danger" @click="cancelAddUser">取消</button>
                        </div>
                    </div>
                    <table style="margin-bottom: 10px;" v-if="usersData.users.length > 0">
                        <thead>
                            <tr>
                                <th style="width: 50px;">ID</th>
                                <th style="width: 100px;">姓名</th>
                                <th>最后提交日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tr v-for="item in usersData?.users">
                            <td>{{ item.userId }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ formatDate(item.lastSubmit) }}</td>
                            <td>
                                <div class="actions">
                                    <button class="btn btn-default">编辑</button>
                                    <button class="btn btn-default"
                                        @click="router.push(`/profile?id=${item.userId}`)">个人资料</button>
                                    <button class="btn btn-danger" v-if="usersData?.id != 0"
                                        @click="remove(item.userId)">移出组</button>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div style="margin: 0 auto;font-size: var(--text-base);" v-else>暂无数据</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import API from '@/utils/api';
import Toast from '@/utils/toast';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { UserGroupListResponse, UserGroupGetResponse } from '@/utils/api';

const router = useRouter();

const showAddGroup = ref(false);
const showAddUser = ref(false);

const groupData = ref<UserGroupListResponse>({
    list: [],
    total: 0,
    totalPage: 0,
    currentPage: 1,
});

const editItem = (index: number) => {
    groupData.value.list.forEach(element => {
        element.edit = false;
    });
    if (groupData.value.list[index]) {
        updateForm.value.name = groupData.value.list[index].name;
        updateForm.value.id = groupData.value.list[index].id;
        updateForm.value.describe = groupData.value.list[index].describe;
        groupData.value.list[index].edit = true;
    }
}

const groupJumpPage = ref(1);

const groupPages = computed(() => {
    if (!groupData.value) return [];
    const currentPage = groupData.value.currentPage;
    const totalPage = groupData.value.totalPage;
    if (totalPage <= 3) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPage - 1) return [totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 1, currentPage, currentPage + 1];
})

const getGroupData = async (page: number) => {
    const response = await API.user.group.list(page);
    Toast.stdResponse(response, false);

    if (response.success) {
        groupJumpPage.value = page;
        groupData.value = response.data;
        groupData.value.currentPage = page;
        groupData.value.totalPage = Math.ceil(groupData.value.total / 5);
    }
};

const usersData = ref<UserGroupGetResponse>({
    id: -1,
    name: '',
    describe: '',
    users: []
});

const getUsersData = async (groupId: number) => {
    const response = await API.user.group.get(groupId);
    Toast.stdResponse(response, false);

    if (response.success) {
        usersData.value = response.data;
    }
};

const formatDate = (date: string) => {
    return new Date(Number(date) * 1000).toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const move = async (userId: number, groupId: number) => {
    if (!userId || userId < 0) {
        Toast.error('请输入用户id');
        return;
    }
    cancelAddUser()
    const response = await API.user.profile.moveGroup({ userId, groupId });
    Toast.stdResponse(response);

    if (response.success && usersData.value) {
        getUsersData(usersData.value.id);
    }
};

const remove = async (userId: number) => {
    const response = await API.user.profile.moveGroup({ userId, groupId: 0 });
    Toast.stdResponse(response);

    if (response.success && usersData.value) {
        getUsersData(usersData.value.id);
    }
};

const updateForm = ref({
    id: -1,
    name: '',
    describe: ''
});

const update = async () => {
    if (updateForm.value.name === '' || updateForm.value.describe === '') {
        Toast.error('请填写完整的信息');
        return;
    }
    groupData.value.list.forEach(element => {
        element.edit = false;
    });
    const response = await API.user.group.update(updateForm.value);
    Toast.stdResponse(response);

    if (response.success) {
        getGroupData(groupData.value.currentPage)
    }
};

const createFrom = ref({
    name: '',
    describe: ''
});
const createGroup = async () => {
    if (createFrom.value.name === '' || createFrom.value.describe === '') {
        Toast.error('请填写完整的信息');
        return;
    }

    showAddGroup.value = false;

    const response = await API.user.group.create(createFrom.value);
    Toast.stdResponse(response);

    if (response.success) {
        getGroupData(groupData.value.currentPage);
    }
}

const deleteGroup = async (groupId: number) => {
    const response = await API.user.group.delete(groupId);
    Toast.stdResponse(response);

    if (response.success) {
        getGroupData(groupData.value.currentPage);
    }
}

const userIdInput = ref('');
const userNameInput = ref('');
let inputTimer: number | null = null; // 存储定时器ID

const getUserInfo = async (userId: number) => {
    const response = await API.user.profile.getById(userId);

    if (response.success) {
        userNameInput.value = response.data.name;
        return response.data.name;
    } else {
        userNameInput.value = "该用户不存在";
        return '';
    }
};

const handleUserIdInput = () => {
    if (inputTimer) {
        clearTimeout(inputTimer);
    }

    // 如果输入框为空，清空用户名显示
    if (!userIdInput.value.trim()) {
        userNameInput.value = '';
        return;
    }

    // 设置新的定时器
    inputTimer = setTimeout(async () => {
        const userId = Number(userIdInput.value);
        if (!isNaN(userId) && userId > 0) {
            await getUserInfo(userId);
        }
    }, 1000);
};

const cancelAddUser = () => {
    showAddUser.value = false;
    userIdInput.value = '';
    userNameInput.value = '';
    // 清除定时器
    if (inputTimer) {
        clearTimeout(inputTimer);
        inputTimer = null;
    }
};

onMounted(() => {
    getGroupData(1);
});

onUnmounted(() => {
    if (inputTimer) {
        clearTimeout(inputTimer);
    }
});
</script>


<style scoped>
@import '@/assets/css/navagation.css';

.fade-enter-active {
    transition: opacity 0.3s ease;
}

.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.dashboardContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    border: 1px solid var(--divider-color);
    color: var(--text-default-color);
    padding: 10px;

    .section {
        border: 1px solid var(--divider-color);
        border-radius: 6px;

        transition: opacity 0.2s ease;

        >.header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 10px;
            border-bottom: 1px solid var(--divider-color);
        }

        >.content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            overflow: auto;

            .content-input {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 10px;

                transition: all 0.2s ease;
            }

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
            flex-grow: 1;
            align-items: center;
            gap: 12px;
            font-size: var(--text-lg);
            font-weight: 600;
        }

        .header-tabs {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: 12px;

            .tab {
                padding: 6px 12px;
                border-radius: 6px;
                background-color: var(--section-background-color);
                color: var(--text-light-color);
                font-size: var(--text-base);
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
                white-space: nowrap;

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
            font-size: var(--text-lg);
        }

        .title-text {
            color: var(--text-default-color);
        }

        .header-actions {
            display: flex;
            gap: 16px;
        }
    }

    .avatar {
        width: 50px;
        height: 50px;
        overflow: hidden;

        >img {
            width: 100%;
            height: 100%;
            -webkit-user-drag: none;
        }
    }

    .actions {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
    }

    .btn {
        font-size: var(--text-sm);
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        color: var(--text-default-color);
        background-color: var(--background-color-1);

        transition: all 0.2s ease;
    }

    .btn-default:hover {
        background-color: var(--background-color-2);
    }

    .btn-primary:hover {
        background-color: var(--neon-cyan);
        color: var(--background-color-1);
    }

    .btn-danger:hover {
        background-color: #f00;
        color: #fff;
    }

    .inputs {
        display: flex;
        flex-grow: 0;
        flex-direction: row;
        align-items: center;
        gap: 10px;

        label {
            font-size: var(--text-base);
            width: 80px;
        }

        input {
            font-size: var(--text-base);
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
    }

    .tdInput {
        width: 150px;
        font-size: var(--text-base);
        letter-spacing: 3px;
        margin-left: -4px;
        margin-top: -2px;
        outline: none;
        color: var(--text-default-color);
        border: 1px solid var(--divider-color);
        box-shadow: 0 0 0px 100px var(--background-color-1) inset;
        padding: 5px;
        background-color: var(--background-color-1);
        border-radius: 6px;
    }

    .tdInput:focus {
        border: 1px solid var(--input-active-color);
    }
}
</style>