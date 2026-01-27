import axios from 'axios'
import JWT from '../utils/jwt'
import Vaildate from '../utils/vaildate'
import { useUserStore } from '@/stores/user'
import { hashPassword } from '@/utils/hash'
import Profile from '@/views/Profile.vue';
import Link from './link';
import type { P } from 'vue-router/dist/router-CWoNjPRp.mjs';
import Toast from './toast';

export interface stdResponse {
    message: string;
    success: boolean;
    data: any;
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

export interface UserProfileGetByIdResponse {
    avatar: string;
    email: string;
    groupId: string;
    name: string;
    spiders: Spider[];
    links: Links;
    userId: string;
    username: string;
    [property: string]: any;
}

export type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForces";

export interface Spider {
    platform: platform;
    username: string;
    [property: string]: any;
}

export interface Links {
    AtCoder: string;
    NowCoder: string;
    LuoGu: string;
    CodeForces: string;
    LeetCode: string;
}

export interface UserProfileUpdateRequest {
    avatar: string;
    email: string;
    name: string;
    userId: string;
    [property: string]: any;
}

export interface UserProfileUpdateResponse {
    code: string;
    message: string;
    [property: string]: any;
}

const userStore = useUserStore()

export default class API {
    static user = {
        auth: {
            login: async (request: UserAuthLoginRequest): Promise<stdResponse> => {
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
                    const response = await axios.post<UserAuthRegisterResponse>('/api/user/auth/login', request);
                    stdRes.message = response.data.message || "登录成功";
                    if (response.data.success) {
                        stdRes.success = true;
                        JWT.setNewToken(response.data.jwtToken);
                        userStore.setLoginStatus(true);
                    }
                    return stdRes;
                } catch (error) {
                    stdRes.message = "登录失败";
                    return stdRes;
                }
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

                try {
                    const response = await axios.post<UserAuthRegisterResponse>('/api/user/auth/register', request);
                    stdRes.message = response.data.message || "注册成功";
                    if (response.data.success) {
                        stdRes.success = true;
                    }
                    return stdRes;
                } catch (error) {
                    stdRes.message = "注册失败";
                    return stdRes;
                }
            }
        },
        profile: {
            getById: async (id: string): Promise<stdResponse> => {
                const stdRes: stdResponse = {
                    message: "",
                    success: false,
                    data: null
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
                            NowCoder: "",
                            LuoGu: "",
                            CodeForces: "",
                            LeetCode: ""
                        }
                        response.data.spiders.forEach((item: Spider) => {
                            response.data.links[item.platform] = Link.getPlatformHomeLink(item.platform, item.username);
                        });
                        stdRes.success = true;
                        stdRes.data = response.data;
                    }
                    return stdRes;
                } catch (error) {
                    stdRes.message = "获取用户信息失败";
                    return stdRes;
                }
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
                    const response = await axios.post<UserProfileGetByIdResponse>("/v1/user/profile/update", request, {
                        headers: {
                            Authorization: `Bearer ${JWT.token}`
                        }
                    });
                    stdRes.message = response.data.message || "获取用户信息成功";
                    if (response.status === 200) {
                        stdRes.success = true;
                        stdRes.data = response.data;
                    }
                    return stdRes;
                } catch (error) {
                    stdRes.message = "获取用户信息失败";
                    return stdRes;
                }
            }
        }
    }
}