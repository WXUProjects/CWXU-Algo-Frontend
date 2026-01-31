import axios from 'axios'
import JWT from '../utils/jwt'
import Vaildate from '../utils/vaildate'
import { useUserStore } from '@/stores/user'
import { hashPassword } from '@/utils/hash'
import Link from './link';
import type { User as UserProfileGetByIdResponse, Spider, platform } from './type'

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
    groupId: string;
    lastSubmit: string;
    name: string;
    userId: string;
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

const userStore = useUserStore()

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
                        userStore.setLoginStatus(true);
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

                if (!Vaildate.checkEmali(request.email)) {
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

                if (!Vaildate.checkEmali(request.email)) {
                    stdRes.message = "请输入有效邮箱";
                    return stdRes;
                }

                if (request.email === '' || request.name === '' || request.avatar === '') {
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
            }
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
                        stdRes.data.data = response.data.data.filter((item: Datum) => item.count > 0);
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