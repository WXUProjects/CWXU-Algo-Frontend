export type platform = "AtCoder" | "NowCoder" | "LeetCode" | "LuoGu" | "CodeForces";

export default class Link{
    static getPlatformHomeLink = (platform: platform, username: string) => {
    switch (platform) {
        case "AtCoder":
            return "https://atcoder.jp/users/" + username;
        case "NowCoder":
            return "https://ac.nowcoder.com/acm/contest/profile/" + username;
        case "LeetCode":
            return "https://leetcode.cn/u/" + username;
        case "LuoGu":
            return "https://www.luogu.com.cn/user/" + username;
        case "CodeForces":
            return "https://CodeForces.com/profile/" + username;
    };
}
}