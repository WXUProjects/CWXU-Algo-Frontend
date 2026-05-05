<template>
    <div class="dashboardContent">
        <div class="section">
            <div class="header">
                <div class="header-title">
                    <span class="title-icon">
                        <font-awesome-icon icon="fa-solid fa-user" />
                    </span>
                    <span class="title-text">用户管理</span>
                </div>
                <div class="header-tabs">
                    <span class="tab" @click="refresh">刷新</span>
                </div>
            </div>
            <div class="content">
                <div style="position: relative;">
                    <LoadingOverlay :show="loading" />
                    <table style="margin-bottom: 10px;">
                        <thead>
                            <tr>
                                <th style="width: 60px;">头像</th>
                                <th style="width: 120px;">用户名</th>
                                <th style="width: 120px;">姓名</th>
                                <th style="width: 120px;">角色</th>
                                <th style="width: 240px;">最后提交日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data?.list" style="cursor: pointer;">
                                <td @click="router.push(`/profile?id=${item.userId}`)">
                                    <div class="avatar">
                                        <img :src="item.avatar || '/images/defaultAvatar.png'" alt="">
                                    </div>
                                </td>
                                <td @click="router.push(`/profile?id=${item.userId}`)">{{ item.username }}</td>
                                <td @click="router.push(`/profile?id=${item.userId}`)">{{ item.name }}</td>
                                <td @click="router.push(`/profile?id=${item.userId}`)">{{ getRoleName(item.roleId) }}</td>
                                <td @click="router.push(`/profile?id=${item.userId}`)">{{ formatDate(item.lastSubmit) }}</td>
                                <td>
                                    <div class="actions" @click.stop>
                                        <button class="btn btn-primary" @click="openEditModal(item)">{{ userStore.isAdmin ? '改角色' : '改分组' }}</button>
                                        <button class="btn btn-primary"
                                            @click="router.push(`/profile?id=${item.userId}`)">个人资料</button>
                                        <button v-if="userStore.isAdmin" class="btn btn-danger">删除</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pageNavigation" v-if="data">
                    <div class="group">
                        <div class="pageButtons" v-if="data.currentPage != 1">
                            <button @click="getData(data.currentPage - 1)">上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button v-for="value in pages" :key="value"
                                :class="value === data.currentPage ? 'active' : ''"
                                @click="value === data.currentPage ? null : getData(value)">{{ value }}</button>
                        </div>
                        <div class="pageButtons" v-if="data.currentPage != data.totalPage">
                            <button @click="getData(data.currentPage + 1)">下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageInput">
                            <button @click="getData(jumppage)">跳转</button>
                            <input type="number" min="1" :max="data.totalPage" v-model="jumppage">
                        </div>
                        <div class="pageSum">共 {{ data.totalPage }} 页</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 角色选择弹窗 -->
    <div class="modal-overlay" v-if="showRoleModal" @click="closeRoleModal">
        <div class="modal" @click.stop>
            <div class="modal-header">
                <span>设置用户角色</span>
                <button class="modal-close" @click="closeRoleModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-user">
                    <span class="label">用户：</span>
                    <span>{{ selectedUser?.name }} ({{ selectedUser?.username }})</span>
                </div>
                <div class="modal-role">
                    <span class="label">角色：</span>
                    <div class="role-options">
                        <div v-for="role in roles" :key="role.roleId" class="role-option"
                            :class="{ active: selectedRoleId === role.roleId }" @click="selectedRoleId = role.roleId">
                            {{ role.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" @click="handleRoleConfirm" :disabled="roleLoading">确认</button>
                <button class="btn" @click="closeRoleModal">取消</button>
            </div>
        </div>
    </div>

    <!-- 分组选择弹窗 -->
    <div class="modal-overlay" v-if="showGroupModal" @click="closeGroupModal">
        <div class="modal" @click.stop>
            <div class="modal-header">
                <span>更改用户分组</span>
                <button class="modal-close" @click="closeGroupModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-user">
                    <span class="label">用户：</span>
                    <span>{{ selectedUser?.name }} ({{ selectedUser?.username }})</span>
                </div>
                <div class="modal-role">
                    <span class="label">分组：</span>
                    <div class="role-options">
                        <div v-for="group in groups" :key="group.id" class="role-option"
                            :class="{ active: selectedGroupId === group.id }" @click="selectedGroupId = group.id">
                            {{ group.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" @click="handleGroupConfirm" :disabled="groupLoading">确认</button>
                <button class="btn" @click="closeGroupModal">取消</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import API from '@/utils/api';
import Toast from '@/utils/toast';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { UserRole } from '@/utils/api';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(true);

interface Response {
    list: User[];
    total: number;
    totalPage: number;
    currentPage: number;
}

interface User {
    avatar: string;
    groupId: number;
    lastSubmit: string;
    name: string;
    roleId?: number;
    userId: number;
    username: string;
}

const data = ref<Response>({
    list: [],
    total: 0,
    totalPage: 0,
    currentPage: 1
});

const jumppage = ref(1);

// 角色相关
const roles = ref<UserRole[]>([]);
const showRoleModal = ref(false);
const selectedUser = ref<User | null>(null);
const selectedRoleId = ref<number>(0);
const roleLoading = ref(false);

// 分组相关
const groups = ref<{ id: number; name: string }[]>([]);
const showGroupModal = ref(false);
const selectedGroupId = ref<number>(0);
const groupLoading = ref(false);

const pages = computed(() => {
    if (!data.value) return [];
    const currentPage = data.value.currentPage;
    const totalPage = data.value.totalPage;
    if (totalPage <= 3) return Array.from({ length: totalPage }, (_, i) => i + 1);
    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPage - 1) return [totalPage - 2, totalPage - 1, totalPage];
    return [currentPage - 1, currentPage, currentPage + 1];
})

const getData = async (page: number) => {
    loading.value = true;
    const response = await API.user.profile.list(page);
    Toast.stdResponse(response, false);

    if (response.success) {
        jumppage.value = page;
        data.value = response.data;
        data.value.currentPage = page;
        data.value.totalPage = Math.ceil(data.value.total / 5);
    }
    loading.value = false;
};

const getRoleName = (roleId: number | undefined) => {
    if (roleId === undefined) return '未知';
    const role = roles.value.find(r => r.roleId === roleId);
    return role?.name || `角色${roleId}`;
};

const loadRoles = async () => {
    const response = await API.user.role.list();
    if (response.success) {
        roles.value = response.data.roles;
    }
};

const openEditModal = async (user: User) => {
    selectedUser.value = user;
    if (userStore.isAdmin) {
        // 获取完整用户信息（包含 roleId）
        const resp = await API.user.profile.getById(user.userId);
        if (resp.success && resp.data.roleId !== undefined) {
            selectedRoleId.value = resp.data.roleId;
        }
        showRoleModal.value = true;
    } else {
        // 教练：获取分组列表 + 当前用户分组
        selectedGroupId.value = user.groupId;
        await loadGroups();
        showGroupModal.value = true;
    }
};

const loadGroups = async () => {
    const resp = await API.user.group.list(1);
    if (resp.success) {
        groups.value = resp.data.list.map((g: any) => ({ id: g.id, name: g.name }));
    }
};

const closeRoleModal = () => {
    showRoleModal.value = false;
    selectedUser.value = null;
    selectedRoleId.value = 0;
};

const handleRoleConfirm = async () => {
    if (!selectedUser.value) return;
    roleLoading.value = true;
    const response = await API.user.role.setUserRole({
        userId: selectedUser.value.userId,
        roleId: selectedRoleId.value
    });
    Toast.stdResponse(response);
    roleLoading.value = false;
    if (response.success) {
        closeRoleModal();
        refresh();
    }
};

const closeGroupModal = () => {
    showGroupModal.value = false;
    selectedUser.value = null;
    selectedGroupId.value = 0;
};

const handleGroupConfirm = async () => {
    if (!selectedUser.value) return;
    groupLoading.value = true;
    const response = await API.user.profile.moveGroup({
        userId: selectedUser.value.userId,
        groupId: selectedGroupId.value
    });
    Toast.stdResponse(response);
    groupLoading.value = false;
    if (response.success) {
        closeGroupModal();
        refresh();
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
const refresh = () => {
    getData(data.value?.currentPage || 1);
};

onMounted(() => {
    getData(1);
    loadRoles();
});
</script>


<style scoped>
@import '@/assets/css/navagation.css';

.dashboardContent {
    height: 100%;
    border-top: 1px solid var(--divider-color);
    color: var(--text-default-color);

    .section {
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
                white-space: nowrap;
                cursor: pointer;
                transition: background-color 0.2s ease, color 0.2s ease;
                -webkit-user-select: none;
                user-select: none;

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
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 6px;

        >img {
            width: 100%;
            height: 100%;
            -webkit-user-drag: none;
        }
    }

    .actions {
        display: flex;
        gap: 8px;
    }

    .btn {
        font-size: var(--text-sm);
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        color: var(--text-default-color);
        background-color: var(--background-color-1);
        transition: background-color 0.2s ease;
        cursor: pointer;
    }

    .btn-primary:hover {
        background-color: var(--background-color-2);
    }

    .btn-danger:hover {
        background-color: #f00;
        color: #fff;
    }
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: var(--background-color-1);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    width: 400px;
    max-width: 90vw;

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color);
        font-size: var(--text-base);
        font-weight: 600;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-light-color);
        padding: 0;
        line-height: 1;

        &:hover {
            color: var(--text-default-color);
        }
    }

    .modal-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .modal-user {
            font-size: var(--text-base);
        }

        .label {
            color: var(--text-light-color);
        }

        .role-options {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 8px;
        }

        .role-option {
            padding: 8px 16px;
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            cursor: pointer;
            font-size: var(--text-sm);
            transition: all 0.2s;
            background-color: var(--background-color-1);
            color: var(--text-default-color);

            &:hover {
                background-color: var(--background-color-2);
            }

            &.active {
                background-color: var(--neon-cyan);
                color: var(--background-color-1);
                border-color: var(--neon-cyan);
            }
        }
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px;
        border-top: 1px solid var(--divider-color);
    }
}
</style>
