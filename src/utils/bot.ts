/**
 * 为用户简单分析数据，提出建议。
*/

import JWT from "./jwt";
import Toast from "./toast";
import Ramdom from "./random";
import { useBotLogStore } from "@/stores/bot-log";
import type { JwtPayload } from "@/utils/jwt";
import API from "./api";
import { useUserStore } from "@/stores/user";
import type { User } from "./type";

const say = (message: string) => {
    const botLogStore = useBotLogStore();
    if (message !== "") {
        Toast.info("ALGO-BOT:" + message)
        botLogStore.push(message);
    }
    return message;
}

const randomSay = (data: string[]) => {
    const message = data[Math.floor(Math.random() * data.length)] as string;
    return say(message);
}

class Bot {
    static analyse = {
        period: () => { }
    }
    static getHitokoto = () => {
        const data = [
            "锲而舍之，朽木不折；锲而不舍，金石可镂。",
            "日日行，不怕千万里；常常做，不怕千万事。",
            "绳锯木断，水滴石穿。",
            "自信是向成功迈出的第一步",
            "千里之行，始于足下。",
            "Stay hungry, stay foolish.",
            "路漫漫其修远兮，吾将上下而求索。",
            "Just do it!",
            "努力是成功的阶梯。",
            "The best way to predict the future is to create it."
        ]
        return randomSay(data);
    }
    static tip = {
        timeTip: () => {
            if (JWT.isValid()) {
                let data: string[] = [];
                const time = new Date().getHours();
                if (time >= 0 && time < 6) {
                    data = [
                        "熬夜刷题不是个好想法",
                        "记得休息",
                        "好孩子不要熬夜哦~",
                    ]
                } else if (time >= 6 && time < 8) {
                    data = [
                        "今天要努力刷绿墙ヾ(*´∀ ˋ*)ﾉ",
                        "今天要努力刷题ヾ(*´∀ ˋ*)ﾉ",
                        "捏了捏你的脸并说：该加训了",
                        "孩子们，该加训了",
                        "迎接新的一天......",
                    ]
                } else if (time >= 14 && time < 20) {
                    data = [
                        "捏了捏你的脸并说：该加训了",
                        "孩子们，该加训了"
                    ]
                }
                return data.length > 0 ? randomSay(data) : "";
            } else {
                return "";
            }
        },
        addOjTip: () => {
            const userStore = useUserStore()
            if (userStore.isLogin) {
                const user = userStore.info as User

                if (user && user.spiders.length === 0) {
                    return say("绑定OJ平台后才可以查看您的数据哦")
                }
                return "";
            }
            return "";
        },
        loginTip: () => {
            if (!JWT.isValid()) {
                return say("登录后可以查看您自己的数据哦")
            } else {
                return "";
            }
        },
    }
}

export default Bot;