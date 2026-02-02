/**
 * 集成API请求，通过类似API.user.auth.login(request)的方法进行API请求
 * 统一响应结构(stdResponse)，简化错误处理
*/

import axios from 'axios'
import JWT from '../utils/jwt'
import Validate from '../utils/validate';
import { useUserStore } from '@/stores/user'
import { hashPassword } from '@/utils/hash'
import Link from './link';
import type { User as UserProfileGetByIdResponse, platform } from './type'

export interface stdResponse<T = any> {
    message: string;
    success: boolean;
    data: T;
    [property: string]: any;
}

export interface UserAuthRegisterRequest {
    email: string;
    groupId: string;
    name: string;
    password: string;
    passwordConfirm: string;
    username: string;
    [property: string]: any;
}

export interface UserAuthRegisterResponse {
    message: string;
    success: boolean;
    [property: string]: any;
}

export interface UserAuthLoginRequest {
    password: string;
    username: string;
    [property: string]: any;
}

export interface UserAuthLoginResponse {
    jwtToken: string;
    message: string;
    success: boolean;
    [property: string]: any;
}

export interface UserProfileUpdateRequest {
    avatar: string;
    email: string;
    name: string;
    userId: number;
    [property: string]: any;
}

export interface UserProfileUpdateResponse {
    code: string;
    message: string;
    [property: string]: any;
}

export interface UserProfileListResponse {
    list: List[];
    total: number;
    totalPage: number;
    currentPage: number;
    [property: string]: any;
}

export interface List {
    avatar: string;
    groupId: number;
    lastSubmit: string;
    name: string;
    userId: number;
    username: string;
    [property: string]: any;
}

export interface CoreSubmitLogGetByIdResponse {
    data: CoreSubmitLogGetByIdData[];
    [property: string]: any;
}

export interface CoreSubmitLogGetByIdData {
    contest: string;
    id: number;
    lang: string;
    platform: platform;
    problem: string;
    status: string;
    submitId: string;
    time: string;
    userId: string;
    [property: string]: any;
}

export interface CodeSpiderSetRequest {
    platform: platform;
    userId: number;
    username: string;
    [property: string]: any;
}

export interface CodeSpiderSetResponse {
    code: number;
    message: string;
    [property: string]: any;
}

export interface CodeSpiderUpdateResponse {
    code: string;
    message: string;
    [property: string]: any;
}

export interface CoreStatisticHeatmapRequest {
    endDate: string;
    isAc: boolean;
    startDate: string;
    userId?: number;
    [property: string]: any;
}

export interface CoreStatisticHeatmapResponse {
    code: string;
    data: Datum[];
    [property: string]: any;
}

export interface Datum {
    count: number;
    date: string;
    [property: string]: any;
}

export interface CoreStatisticPeriodResponse {
    code: string;
    data: CoreStatisticPeriodData;
    [property: string]: any;
}

export interface CoreStatisticPeriodData {
    ac: CoreStatisticPeriodItem;
    submit: CoreStatisticPeriodItem;
    [property: string]: any;
}

export interface CoreStatisticPeriodItem {
    lastMonth: number;
    lastWeek: number;
    lastYear: number;
    thisMonth: number;
    thisWeek: number;
    thisYear: number;
    today: number;
    total: number;
    [property: string]: any;
}

export interface UserProfileMoveGroupRequest {
    userId: number;
    groupId: number;
}

export interface UserProfileMoveGroupResponse {
    code: string;
    message: string;
}

export interface UserGroupListResponse {
    list: Group[];
    total: number;
    totalPage: number;
    currentPage: number;
    [property: string]: any;
}

export interface Group {
    describe: string;
    id: number;
    name: string;
    users: UserGroupUser[];
    [property: string]: any;
}

export interface UserGroupCreateRequest {
    name: string;
    describe: string;
}

export interface UserGroupCreateResponse {
    id: number;
    message: string;
}

export interface UserGroupDeleteResponse {
    success: boolean;
}

export interface UserGroupUpdateRequest {
    id: number;
    name: string;
    describe: string;
}

export interface UserGroupUpdateResponse {
    success: boolean;
}

export interface UserGroupGetResponse {
    describe: string;
    id: number;
    name: string;
    users: UserGroupUser[];
    [property: string]: any;
}

export interface UserGroupUser {
    avatar: string;
    groupId: number;
    lastSubmit: string;
    name: string;
    userId: number;
    username: string;
    [property: string]: any;
}

export interface UserProfileGetByNameResponse {
    list: UserProfileGetByNameList[];
    [property: string]: any;
}

export interface UserProfileGetByNameList {
    name: string;
    userId: number;
    [property: string]: any;
}

export default class API {
    static user = {
        auth: {
            login: async (request: UserAuthLoginRequest): Promise<stdResponse> => {
                // 直接处理登录，不返回data字段
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }
                if (JWT.isValid()) {
                    stdRes.message = "用户已登录";
                    return stdRes;
                }
                try {
                    const response = await axios.post<UserAuthLoginResponse>('/api/user/auth/login', request);
                    if (response.data.success) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "登录成功";
                        JWT.setNewToken(response.data.jwtToken);
                        const userStore = useUserStore()
                        userStore.syncStatus()
                    } else {
                        stdRes.message = response.data.message || "登录失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "登录失败";
                }
                return stdRes;
            },
            register: async (request: UserAuthRegisterRequest): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }

                if (JWT.isValid()) {
                    stdRes.message = "用户已登录";
                    return stdRes;
                }

                if (!Validate.checkEmali(request.email)) {
                    stdRes.message = "请输入有效邮箱";
                    return stdRes;
                }

                if (request.email === '' || request.username === '' || request.password === '' || request.name === '' || request.passwordConfirm === '') {
                    stdRes.message = "请输入有效用户名";
                    return stdRes;
                }

                if (request.password !== request.passwordConfirm) {
                    stdRes.message = "密码不一致";
                    return stdRes;
                }

                request.password = hashPassword(request.password);

                try {
                    const response = await axios.post<UserAuthRegisterResponse>('/api/user/auth/register', request);
                    if (response.data.success) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "注册成功";
                    } else {
                        stdRes.message = response.data.message || "注册失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "注册失败";
                }
                return stdRes;
            }
        },
        profile: {
            getById: async (id: number): Promise<stdResponse<UserProfileGetByIdResponse>> => {
                const stdRes: stdResponse<UserProfileGetByIdResponse> = {
                    message: "",
                    success: false,
                    data: {
                        avatar: "",
                        email: "",
                        groupId: "",
                        name: "",
                        spiders: [],
                        links: {
                            AtCoder: "",
                            CodeForces: "",
                            NowCoder: "",
                            LuoGu: "",
                            LeetCode: "",
                        },
                        userId: 0,
                        username: ""
                    }
                }
                try {
                    const response = await axios.get<UserProfileGetByIdResponse>("/api/user/profile/get-by-id", {
                        params: {
                            userId: id,
                        }
                    });
                    stdRes.message = response.data.message || "获取用户信息成功";
                    if (response.status === 200) {
                        response.data.links = {
                            AtCoder: "",
                            CodeForces: "",
                            NowCoder: "",
                            LuoGu: "",
                            LeetCode: "",
                        }
                        response.data.spiders.forEach(spider => {
                            response.data.links[spider.platform] = Link.getPlatformHomeLink(spider.platform, spider.username);
                        });
                        stdRes.success = true;
                        stdRes.data = response.data;
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取用户信息失败";
                }
                return stdRes;
            },
            getByName: async (name: string): Promise<stdResponse<UserProfileGetByNameResponse>> => {
                const stdRes: stdResponse<UserProfileGetByNameResponse> = {
                    message: "",
                    success: false,
                    data: {
                        list: []
                    }
                }
                try {
                    const response = await axios.get<UserProfileGetByNameResponse>("/api/user/profile/get-by-name", {
                        params: {
                            name,
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取用户信息成功";
                        stdRes.data = response.data;
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取用户信息失败";
                }
                return stdRes;
            },
            update: async (request: UserProfileUpdateRequest): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }

                if (!JWT.isValid()) {
                    stdRes.message = "用户未登录";
                    return stdRes;
                }

                if (!Validate.checkEmali(request.email)) {
                    stdRes.message = "请输入有效邮箱";
                    return stdRes;
                }

                // 不检查头像，空表示移除头像
                if (request.email === '' || request.name === '') {
                    stdRes.message = "输入不能为空";
                    return stdRes;
                }

                request.password = hashPassword(request.password);

                try {
                    const response = await axios.post<UserProfileGetByIdResponse>("/api/user/profile/update", request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        const userStore = useUserStore();
                        userStore.syncStatus();
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取用户信息成功";
                        stdRes.data = response.data;
                    } else {
                        stdRes.message = response.data.message || "获取用户信息失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取用户信息失败";
                }

                return stdRes;
            },
            list: async (page: number): Promise<stdResponse<UserProfileListResponse>> => {
                const stdRes: stdResponse<UserProfileListResponse> = {
                    message: "",
                    success: false,
                    data: {
                        total: 0,
                        totalPage: 0,
                        currentPage: page,
                        list: []
                    }
                }
                try {
                    const response = await axios.get<UserProfileListResponse>('/api/user/profile/list', {
                        params: {
                            pageNum: page,
                            pageSize: 5
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取用户列表成功";
                        stdRes.data = response.data;
                        stdRes.data.currentPage = page
                    } else {
                        stdRes.message = response.data.message || "获取用户列表失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取用户列表失败";
                }
                return stdRes;
            },
            moveGroup: async (request: UserProfileMoveGroupRequest): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }
                try {
                    const response = await axios.post<UserProfileMoveGroupResponse>('/api/user/profile/move-group', request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "移动用户组成功";
                    } else {
                        stdRes.message = response.data.message || "移动用户组失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "移动用户组失败";
                }
                return stdRes;
            }
        },
        group: {
            list: async (page: number): Promise<stdResponse<UserGroupListResponse>> => {
                const stdRes: stdResponse<UserGroupListResponse> = {
                    message: "",
                    success: false,
                    data: {
                        list: [],
                        total: 0,
                        totalPage: 0,
                        currentPage: page
                    }
                }
                try {
                    const response = await axios.get<UserGroupListResponse>('/api/user/group/list', {
                        params: {
                            pageNum: page,
                            pageSize: 5
                        },
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取分组列表成功";
                        stdRes.data = response.data;
                        stdRes.data.currentPage = page
                    } else {
                        stdRes.message = response.data.message || "获取分组列表失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取分组列表失败";
                }
                return stdRes;
            },
            create: async (request: UserGroupCreateRequest): Promise<stdResponse<UserGroupCreateResponse>> => {
                const stdRes: stdResponse<UserGroupCreateResponse> = {
                    message: "",
                    success: false,
                    data: {
                        id: 0,
                        message: ""
                    }
                }
                try {
                    const response = await axios.post<UserGroupCreateResponse>('/api/user/group/create', request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "创建分组成功";
                        stdRes.data = response.data;
                    } else {
                        stdRes.message = response.data.message || "创建分组失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "创建分组失败";
                }
                return stdRes;
            },
            delete: async (id: number): Promise<stdResponse<UserGroupDeleteResponse>> => {
                const stdRes: stdResponse<UserGroupDeleteResponse> = {
                    message: "",
                    success: false,
                    data: {
                        success: false,
                    }
                }
                try {
                    const response = await axios.post<UserGroupDeleteResponse>(`/api/user/group/delete`, { id }, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.data.success) {
                        stdRes.success = true;
                        stdRes.message = "删除分组成功";
                        stdRes.data = response.data;
                    } else {
                        stdRes.message = "删除分组失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "删除分组失败";
                }
                return stdRes;
            },
            update: async (request: UserGroupUpdateRequest): Promise<stdResponse<UserGroupUpdateResponse>> => {
                const stdRes: stdResponse<UserGroupUpdateResponse> = {
                    message: "",
                    success: false,
                    data: {
                        success: false,
                    }
                }
                try {
                    const response = await axios.post<UserGroupUpdateResponse>(`/api/user/group/update`, request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = "更新分组成功";
                        stdRes.data = response.data;
                    } else {
                        stdRes.message = "更新分组失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "更新分组失败";
                }
                return stdRes;
            },
            get: async (id: number): Promise<stdResponse<UserGroupGetResponse>> => {
                const stdRes: stdResponse<UserGroupGetResponse> = {
                    message: "",
                    success: false,
                    data: {
                        id: 0,
                        name: "",
                        describe: "",
                        users: []
                    }
                }
                try {
                    const response = await axios.get<UserGroupGetResponse>(`/api/user/group/get`, {
                        params: {
                            id
                        },
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = "获取分组成功";
                        stdRes.data = response.data;
                    } else {
                        stdRes.message = "获取分组失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取分组失败";
                }
                return stdRes;
            },
        }
    }

    static core = {
        submitLog: {
            getById: async (id: string, cursor: number, limit: number = 50): Promise<stdResponse<CoreSubmitLogGetByIdResponse>> => {
                const stdRes: stdResponse<CoreSubmitLogGetByIdResponse> = {
                    message: "",
                    success: false,
                    data: {
                        data: []
                    }
                }
                try {
                    const response = await axios.get<CoreSubmitLogGetByIdResponse>('/api/core/submit-log/get-by-id', {
                        params: {
                            userId: id,
                            limit: limit,
                            cursor: cursor
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取用户提交记录成功";
                        stdRes.data.data = response.data.data;
                    } else {
                        stdRes.message = response.data.message || "获取用户提交记录失败";
                    }
                    return stdRes;
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取用户提交记录失败";
                    return stdRes;
                }
            }
        },
        spider: {
            set: async (request: CodeSpiderSetRequest): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }

                if (!JWT.isValid()) {
                    stdRes.message = "用户未登录";
                    return stdRes;
                }

                if(request.username === ""){
                    stdRes.message = "用户名不能为空";
                    return stdRes;
                }

                try {
                    const response = await axios.post<CodeSpiderSetResponse>('/api/core/spider/set', request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "绑定 OJ 账号成功";
                    } else {
                        stdRes.message = response.data.message || "绑定 OJ 账号失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "绑定 OJ 账号失败";
                }

                return stdRes;
            },
            update: async (userId: number): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
                }

                if (!JWT.isValid()) {
                    stdRes.message = "用户未登录";
                    return stdRes;
                }

                try {
                    const response = await axios.post<CodeSpiderUpdateResponse>('/api/core/spider/update',
                        {
                            userId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${JWT.token}`
                            }
                        });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "更新数据成功";
                    } else {
                        stdRes.message = response.data.message || "更新数据失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "更新数据失败";
                }

                return stdRes;
            }
        },
        statistic: {
            heatmap: async (request: CoreStatisticHeatmapRequest): Promise<stdResponse<CoreStatisticHeatmapResponse>> => {
                const stdRes: stdResponse<CoreStatisticHeatmapResponse> = {
                    message: "",
                    success: false,
                    data: {
                        code: "",
                        data: []
                    }
                }

                try {
                    const response = await axios.get<CoreStatisticHeatmapResponse>('/api/core/statistic/heatmap', {
                        params: request
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取热力图成功";
                        stdRes.data.data = response.data.data;
                    } else {
                        stdRes.message = response.data.message || "获取热力图失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取热力图失败";
                }

                return stdRes;
            },
            period: async (userId: number): Promise<stdResponse<CoreStatisticPeriodResponse>> => {
                const stdRes: stdResponse<CoreStatisticPeriodResponse> = {
                    message: "",
                    success: false,
                    data: {
                        code: "",
                        data: {
                            ac: {
                                lastMonth: 0,
                                lastWeek: 0,
                                lastYear: 0,
                                thisMonth: 0,
                                thisWeek: 0,
                                thisYear: 0,
                                today: 0,
                                total: 0
                            },
                            submit: {
                                lastMonth: 0,
                                lastWeek: 0,
                                lastYear: 0,
                                thisMonth: 0,
                                thisWeek: 0,
                                thisYear: 0,
                                today: 0,
                                total: 0
                            }
                        }
                    }
                }
                try {
                    const response = await axios.get<CoreStatisticPeriodResponse>('/api/core/statistic/period', {
                        params: {
                            userId
                        }
                    });
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.message = response.data.message || "获取统计数据成功";
                        stdRes.data = response.data
                    } else {
                        stdRes.message = response.data.message || "获取统计数据失败";
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "获取统计数据失败";
                }
                return stdRes;
            }
        }
    }
}

// 示例
// 层级结构与接口文档保持一致，方便调用
/**
 * 接口示例
 * parent
 *    child
 *        function-name: POST http://api.example.com/v1/parent/child/function-name
 *            Authorization: 需要
 *            Request:{
 *                 paramA: number 必选
 *                 paramB: string 必选
 *            }
 *            Response:{
 *                 success: boolean
 *                 message: string
 *                 data: {
 *                     resultA: number
 *                     resultB: string
 *                 }
 *            }
*/

// 定义数据类型

// 请求数据类型
interface ParentChildFunctionNameRequest {
    paramA: number;
    paramB: string;
}


// 响应数据类型
interface ParentChildFunctionNameReponse {
    success: boolean;
    message: string;
    data: {
        resultA: number;
        resultB: string;
    };
}

// 标准响应中数据的类型
interface ParentChildFunctionNameData {
    resultA: number;
    resultB: string;
}

// 实际应当export该类
// 这里为了演示没有export
class APIExample {
    static parent = {
        child: {
            // 参数可以是一个请求对象或者单独类型的多个参数
            // functionName: async (paramA:number, paramB:string): Promise<stdResponse<ParentChildFunctionNameData>> => {
            // 如果api不响应数据，返回类型的stdResponse不需要泛型
            // functionName: async (paramA:number, paramB:string): Promise<stdResponse> => {
            functionName: async (request: ParentChildFunctionNameRequest): Promise<stdResponse<ParentChildFunctionNameData>> => {
                // 第一步：定义默认响应
                const stdRes: stdResponse<ParentChildFunctionNameData> = {
                    message: "",
                    success: false,
                    // 如果不响应数据，则返回空对象
                    // data: {}
                    data: {
                        resultA: 0,
                        resultB: ""
                    }
                }
                // 第二步：数据校验(如果需要)
                if (request.paramB === "") {
                    stdRes.message = "参数B不能为空";
                    return stdRes;
                }
                // 第三步：trycatch
                try {
                    const response = await axios.post<ParentChildFunctionNameReponse>('/api/parent/child/function-name', request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}` // 如果需要认证
                        }
                    })
                    // 由于后端没有标准响应模板，所以这里需要自行判断
                    // 如果响应不包含成功提示，使用response.status判断成功
                    // if (response.status === 200) {
                    //     // 处理响应数据
                    //     stdRes.data = response.data.data
                    //
                    //     // 设置成功状态
                    //     stdRes.success = true;
                    //     stdRes.message = response.data.message || "成功信息"
                    // } else {
                    //     stdRes.success = false;
                    //     stdRes.message = response.data.message || "失败信息"
                    // }
                    // 否则使用响应成功提示判断
                    if (response.data.success) {
                        // 处理响应数据
                        stdRes.data = response.data.data

                        // 设置成功状态
                        stdRes.success = true;
                        stdRes.message = response.data.message || "成功信息"
                    } else {
                        stdRes.success = false;
                        stdRes.message = response.data.message || "失败信息"
                    }
                } catch (error: any) {
                    console.error(error);
                    stdRes.message = "失败信息"
                }
                // 最后一步，返回标准响应
                return stdRes;
            }
        }
    }
}