<template>
    <div class="dashboardContent">
        <div class="layout">
            <!-- 左侧：组列表 -->
            <section class="panel groups-panel">
                <div class="panel-header">
                    <div class="title">
                        <font-awesome-icon icon="fa-solid fa-people-group" />
                        <span>组管理</span>
                    </div>
                    <div class="actions">
                        <button class="btn" @click="loadGroups(1)" :disabled="groupsLoading">刷新</button>
                        <button class="btn btn-primary" @click="openCreateModal">创建组</button>
                    </div>
                </div>

                <div class="panel-body" style="position: relative;">
                    <LoadingOverlay :show="groupsLoading" />
                    <div v-if="!groupsLoading && groups.length === 0" class="empty">暂无分组</div>
                    <div
                        v-for="g in groups"
                        :key="g.id"
                        class="group-item"
                        :class="{ active: selectedGroupId === g.id }"
                        @click="selectGroup(g.id)"
                    >
                        <div class="group-main">
                            <div class="group-name">{{ g.name || `组#${g.id}` }}</div>
                            <div class="group-desc">{{ g.describe || '无描述' }}</div>
                        </div>
                        <div class="group-meta">#{{ g.id }}</div>
                        <div class="group-ops" @click.stop>
                            <button class="btn btn-sm" @click="openEditModal(g)">编辑</button>
                            <button class="btn btn-sm btn-danger" @click="openDeleteGroupModal(g)">删除</button>
                        </div>
                    </div>
                </div>

                <div class="panel-footer pageNavigation" v-if="totalPage > 1">
                    <div class="group">
                        <div class="pageButtons" v-if="currentPage > 1">
                            <button @click="loadGroups(currentPage - 1)">上一页</button>
                        </div>
                        <div class="pageButtons">
                            <button
                                v-for="p in pageList"
                                :key="p"
                                :class="{ active: p === currentPage }"
                                @click="p === currentPage ? null : loadGroups(p)"
                            >{{ p }}</button>
                        </div>
                        <div class="pageButtons" v-if="currentPage < totalPage">
                            <button @click="loadGroups(currentPage + 1)">下一页</button>
                        </div>
                    </div>
                    <div class="group">
                        <div class="pageSum">共 {{ total }} 组 / {{ totalPage }} 页</div>
                    </div>
                </div>
            </section>

            <!-- 右侧：成员管理 -->
            <section class="panel members-panel">
                <div class="panel-header">
                    <div class="title">
                        <font-awesome-icon icon="fa-solid fa-user-group" />
                        <span v-if="selectedGroup">#{{ selectedGroup.id }} {{ selectedGroup.name }} · 成员</span>
                        <span v-else>选择左侧分组查看成员</span>
                    </div>
                    <div class="actions" v-if="selectedGroup">
                        <button class="btn" @click="loadMembers" :disabled="membersLoading">刷新</button>
                        <button class="btn btn-primary" @click="showAddMember = !showAddMember">
                            {{ showAddMember ? '收起添加' : '添加成员' }}
                        </button>
                    </div>
                </div>

                <div class="panel-body" style="position: relative;">
                    <div v-if="!selectedGroup" class="empty">从左侧点选一个组开始管理</div>
                    <template v-else>
                        <LoadingOverlay :show="membersLoading" />

                        <div class="add-box" v-if="showAddMember">
                            <input
                                type="text"
                                v-model="searchName"
                                @input="onSearchInput"
                                placeholder="输入姓名搜索用户"
                            />
                            <div class="search-list" v-if="searchResults.length">
                                <div class="search-item" v-for="u in searchResults" :key="u.userId">
                                    <span>{{ u.name }} <small>#{{ u.userId }}</small></span>
                                    <button
                                        class="btn btn-sm btn-primary"
                                        :disabled="isInGroup(u.userId) || addingUserId === u.userId"
                                        @click="addMember(u.userId)"
                                    >
                                        {{ isInGroup(u.userId) ? '已在组内' : (addingUserId === u.userId ? '添加中...' : '添加') }}
                                    </button>
                                </div>
                            </div>
                            <div class="hint" v-else-if="searchName.trim()">未找到匹配用户</div>
                        </div>

                        <table v-if="members.length">
                            <thead>
                                <tr>
                                    <th style="width: 70px;">ID</th>
                                    <th style="width: 140px;">姓名</th>
                                    <th>最后提交</th>
                                    <th style="width: 200px;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="m in members" :key="m.userId">
                                    <td>{{ m.userId }}</td>
                                    <td>{{ m.name }}</td>
                                    <td>{{ formatDate(m.lastSubmit) }}</td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="btn btn-sm" @click="router.push(`/profile?id=${m.userId}`)">资料</button>
                                            <button
                                                v-if="selectedGroup.id !== 0"
                                                class="btn btn-sm btn-danger"
                                                :disabled="removingUserId === m.userId"
                                                @click="removeMember(m.userId)"
                                            >
                                                {{ removingUserId === m.userId ? '移出中...' : '移出' }}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="empty" v-else-if="!membersLoading">该组暂无成员</div>
                    </template>
                </div>
            </section>
        </div>

        <!-- 创建组 -->
        <div class="modal-overlay" v-if="showCreateModal" @click="closeCreateModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <span>创建组</span>
                    <button class="modal-close" @click="closeCreateModal">&times;</button>
                </div>
                <div class="modal-body form">
                    <label>组名称</label>
                    <input v-model="createForm.name" placeholder="例如：2024 集训队" />
                    <label>组描述</label>
                    <input v-model="createForm.describe" placeholder="可选" />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="createGroup" :disabled="createLoading">
                        {{ createLoading ? '创建中...' : '创建' }}
                    </button>
                    <button class="btn" @click="closeCreateModal" :disabled="createLoading">取消</button>
                </div>
            </div>
        </div>

        <!-- 编辑组 -->
        <div class="modal-overlay" v-if="showEditModal" @click="closeEditModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <span>编辑组 #{{ editForm.id }}</span>
                    <button class="modal-close" @click="closeEditModal">&times;</button>
                </div>
                <div class="modal-body form">
                    <label>组名称</label>
                    <input v-model="editForm.name" placeholder="组名称" />
                    <label>组描述</label>
                    <input v-model="editForm.describe" placeholder="组描述" />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="updateGroup" :disabled="editLoading">
                        {{ editLoading ? '保存中...' : '保存' }}
                    </button>
                    <button class="btn" @click="closeEditModal" :disabled="editLoading">取消</button>
                </div>
            </div>
        </div>

        <!-- 删除组 -->
        <div class="modal-overlay" v-if="showDeleteModal" @click="closeDeleteModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <span>删除组</span>
                    <button class="modal-close" @click="closeDeleteModal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>确定删除组 <strong>{{ deletingGroup?.name }}</strong>（#{{ deletingGroup?.id }}）？</p>
                    <p class="muted">组内成员会被移出到未分组。</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="confirmDeleteGroup" :disabled="deleteLoading">
                        {{ deleteLoading ? '删除中...' : '确认删除' }}
                    </button>
                    <button class="btn" @click="closeDeleteModal" :disabled="deleteLoading">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import API from '@/utils/api'
import Toast from '@/utils/toast'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import type { UserGroupGetResponse, UserProfileGetByNameList } from '@/utils/api'

interface GroupItem {
    id: number
    name: string
    describe: string
}

const router = useRouter()
const PAGE_SIZE = 20

const groups = ref<GroupItem[]>([])
const groupsLoading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const totalPage = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const pageList = computed(() => {
    const cur = currentPage.value
    const tp = totalPage.value
    if (tp <= 5) return Array.from({ length: tp }, (_, i) => i + 1)
    if (cur <= 3) return [1, 2, 3, 4, 5]
    if (cur >= tp - 2) return [tp - 4, tp - 3, tp - 2, tp - 1, tp]
    return [cur - 2, cur - 1, cur, cur + 1, cur + 2]
})

const selectedGroupId = ref<number | null>(null)
const selectedGroup = computed(() => groups.value.find(g => g.id === selectedGroupId.value) || null)
const members = ref<UserGroupGetResponse['users']>([])
const membersLoading = ref(false)

const showAddMember = ref(false)
const searchName = ref('')
const searchResults = ref<UserProfileGetByNameList[]>([])
const addingUserId = ref<number | null>(null)
const removingUserId = ref<number | null>(null)
let searchTimer: number | null = null

const showCreateModal = ref(false)
const createLoading = ref(false)
const createForm = ref({ name: '', describe: '' })

const showEditModal = ref(false)
const editLoading = ref(false)
const editForm = ref({ id: 0, name: '', describe: '' })

const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const deletingGroup = ref<GroupItem | null>(null)

const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(Number(date) * 1000).toLocaleString('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    })
}

const isInGroup = (userId: number) => members.value.some(m => m.userId === userId)

const loadGroups = async (page = 1) => {
    groupsLoading.value = true
    const resp = await API.user.group.list(page, PAGE_SIZE)
    Toast.stdResponse(resp, false)
    if (resp.success) {
        currentPage.value = page
        total.value = resp.data.total || 0
        groups.value = (resp.data.list || []).map((g: any) => ({
            id: Number(g.id),
            name: g.name || '',
            describe: g.describe || ''
        }))
        // 当前选中组不在本页时，不强制切换
        if (selectedGroupId.value != null && !groups.value.some(g => g.id === selectedGroupId.value)) {
            // keep selection but members still available from last load
        }
    }
    groupsLoading.value = false
}

const selectGroup = async (id: number) => {
    selectedGroupId.value = id
    showAddMember.value = false
    searchName.value = ''
    searchResults.value = []
    await loadMembers()
}

const loadMembers = async () => {
    if (selectedGroupId.value == null) return
    membersLoading.value = true
    const resp = await API.user.group.get(selectedGroupId.value)
    Toast.stdResponse(resp, false)
    if (resp.success) {
        members.value = resp.data.users || []
        // 同步右侧标题信息
        const idx = groups.value.findIndex(g => g.id === selectedGroupId.value)
        if (idx >= 0) {
            groups.value[idx] = {
                id: Number(resp.data.id),
                name: resp.data.name || '',
                describe: resp.data.describe || ''
            }
        }
    }
    membersLoading.value = false
}

const openCreateModal = () => {
    createForm.value = { name: '', describe: '' }
    showCreateModal.value = true
}
const closeCreateModal = () => {
    if (createLoading.value) return
    showCreateModal.value = false
}
const createGroup = async () => {
    if (!createForm.value.name.trim()) {
        Toast.error('组名称不能为空')
        return
    }
    createLoading.value = true
    const resp = await API.user.group.create({
        name: createForm.value.name.trim(),
        describe: createForm.value.describe.trim()
    })
    Toast.stdResponse(resp)
    createLoading.value = false
    if (resp.success) {
        showCreateModal.value = false
        await loadGroups(1)
        if (resp.data?.id) {
            await selectGroup(Number(resp.data.id))
        }
    }
}

const openEditModal = (g: GroupItem) => {
    editForm.value = { id: g.id, name: g.name, describe: g.describe }
    showEditModal.value = true
}
const closeEditModal = () => {
    if (editLoading.value) return
    showEditModal.value = false
}
const updateGroup = async () => {
    if (!editForm.value.name.trim()) {
        Toast.error('组名称不能为空')
        return
    }
    editLoading.value = true
    const resp = await API.user.group.update({
        id: editForm.value.id,
        name: editForm.value.name.trim(),
        describe: editForm.value.describe.trim()
    })
    Toast.stdResponse(resp)
    editLoading.value = false
    if (resp.success) {
        showEditModal.value = false
        await loadGroups(currentPage.value)
    }
}

const openDeleteGroupModal = (g: GroupItem) => {
    deletingGroup.value = g
    showDeleteModal.value = true
}
const closeDeleteModal = () => {
    if (deleteLoading.value) return
    showDeleteModal.value = false
    deletingGroup.value = null
}
const confirmDeleteGroup = async () => {
    if (!deletingGroup.value) return
    deleteLoading.value = true
    const resp = await API.user.group.delete(deletingGroup.value.id)
    Toast.stdResponse(resp)
    deleteLoading.value = false
    if (resp.success) {
        if (selectedGroupId.value === deletingGroup.value.id) {
            selectedGroupId.value = null
            members.value = []
        }
        showDeleteModal.value = false
        deletingGroup.value = null
        await loadGroups(currentPage.value)
    }
}

const onSearchInput = () => {
    if (searchTimer) clearTimeout(searchTimer)
    if (!searchName.value.trim()) {
        searchResults.value = []
        return
    }
    searchTimer = window.setTimeout(async () => {
        const resp = await API.user.profile.getByName(searchName.value.trim())
        Toast.stdResponse(resp, false)
        if (resp.success) {
            searchResults.value = resp.data.list || []
        }
    }, 350)
}

const addMember = async (userId: number) => {
    if (selectedGroupId.value == null) return
    addingUserId.value = userId
    const resp = await API.user.profile.moveGroup({ userId, groupId: selectedGroupId.value })
    Toast.stdResponse(resp)
    addingUserId.value = null
    if (resp.success) {
        await loadMembers()
    }
}

const removeMember = async (userId: number) => {
    if (selectedGroupId.value == null || selectedGroupId.value === 0) return
    removingUserId.value = userId
    const resp = await API.user.profile.moveGroup({ userId, groupId: 0 })
    Toast.stdResponse(resp)
    removingUserId.value = null
    if (resp.success) {
        await loadMembers()
    }
}

onMounted(() => {
    loadGroups(1)
})

onUnmounted(() => {
    if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/css/navagation.css';

.dashboardContent {
    height: 100%;
    border-top: 1px solid var(--divider-color);
    color: var(--text-default-color);
    padding: 10px;
}

.layout {
    display: grid;
    grid-template-columns: minmax(280px, 360px) 1fr;
    gap: 12px;
    height: 100%;
    min-height: 520px;
}

.panel {
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-bottom: 1px solid var(--divider-color);
}

.panel-header .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
}

.panel-header .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.panel-body {
    flex: 1;
    overflow: auto;
    padding: 10px;
}

.panel-footer {
    border-top: 1px solid var(--divider-color);
    padding: 8px 10px;
}

.group-item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px 10px;
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background .15s ease, border-color .15s ease;
}

.group-item:hover {
    background: var(--background-color-2, transparent);
}

.group-item.active {
    border-color: var(--neon-cyan, #3dd6c6);
    background: color-mix(in srgb, var(--neon-cyan, #3dd6c6) 10%, transparent);
}

.group-name {
    font-weight: 600;
}

.group-desc, .group-meta, .muted, .hint {
    font-size: var(--text-sm);
    opacity: .75;
}

.group-ops {
    grid-column: 1 / -1;
    display: flex;
    gap: 6px;
}

.btn, .btn-sm {
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--text-default-color);
    border-radius: 8px;
    cursor: pointer;
    padding: 6px 12px;
}

.btn-sm {
    padding: 4px 8px;
    font-size: var(--text-sm);
}

.btn:disabled, .btn-sm:disabled {
    opacity: .55;
    cursor: not-allowed;
}

.btn-primary:hover:not(:disabled),
.btn:hover:not(:disabled) {
    background: var(--background-color-2, rgba(127,127,127,.12));
}

.btn-danger:hover:not(:disabled) {
    background: #f00;
    color: #fff;
    border-color: #f00;
}

.empty {
    text-align: center;
    padding: 40px 10px;
    opacity: .7;
}

.add-box {
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.add-box input, .form input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--text-default-color);
}

.search-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--divider-color);
}

.search-item:last-child {
    border-bottom: none;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border-bottom: 1px solid var(--divider-color);
    padding: 8px 6px;
    text-align: left;
}

.row-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
}

.modal {
    width: min(420px, 100%);
    background: var(--background-color);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border-bottom: 1px solid var(--divider-color);
    font-weight: 700;
}

.modal-close {
    border: none;
    background: transparent;
    color: var(--text-default-color);
    font-size: 1.3rem;
    cursor: pointer;
}

.modal-body {
    padding: 14px;
    line-height: 1.6;
}

.modal-body.form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 14px 14px;
}

@media (max-width: 900px) {
    .layout {
        grid-template-columns: 1fr;
        height: auto;
    }
}
</style>
