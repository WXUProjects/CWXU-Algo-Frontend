/**
 * 常用类型
*/

export type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForces";

export type Links = {
    [Key in platform]: string;
}

export interface User {
    avatar: string;
    email: string;
    groupId: string;
    name: string;
    spiders: Spider[];
    links: Links;
    userId: number;
    username: string;
    [property: string]: any;
}

export interface Spider {
    platform: platform;
    username: string;
    [property: string]: any;
}

export interface Anno {
    id: number;
    content: string;
    type: string;
    isclosed: boolean;
    [property: string]: any;
}