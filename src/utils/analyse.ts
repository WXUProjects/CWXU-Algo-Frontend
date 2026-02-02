import type { CoreStatisticPeriodData } from "./api";
import Random from "./random";

export default class Analyse {
    static period = (data: CoreStatisticPeriodData) => {
        const analyse: string[] = [];
        const { ac, submit } = data;

        // 今日数据
        const todaySubmit = submit.today;
        const todayAc = ac.today;
        const todayAcRate = todaySubmit > 0 ? todayAc / todaySubmit : 0;

        // 本周数据
        const weekAc = ac.thisWeek;
        const weekSubmit = submit.thisWeek;
        const weekAcRate = weekSubmit > 0 ? weekAc / weekSubmit : 0;
        const lastWeekAc = ac.lastWeek;
        const weekTrend = weekAc - lastWeekAc;

        // 本月数据
        const monthAc = ac.thisMonth;
        const monthSubmit = submit.thisMonth;
        const monthAcRate = monthSubmit > 0 ? monthAc / monthSubmit : 0;
        const lastMonthAc = ac.lastMonth;
        const monthTrend = monthAc - lastMonthAc;

        // 今年数据
        const yearAc = ac.thisYear;
        const lastYearAc = ac.lastYear;
        const yearTrend = lastYearAc > 0 ? ((yearAc - lastYearAc) / lastYearAc) * 100 : 0;

        // 总量数据
        const totalAc = ac.total;
        const totalSubmit = submit.total;
        const overallAcRate = totalSubmit > 0 ? totalAc / totalSubmit : 0;

        // 今日表现分析
        if (todaySubmit > 0) {
            // AC率分析
            if (todaySubmit >= 10) {
                if (todayAcRate > 0.8) {
                    analyse.push(Random.choice([
                        "今日 AC 率超过80%，解题精准度极高！",
                        "今日 AC 率超过80%，势如破竹！",
                        "今日 AC 率超过80%，闪耀全场！"
                    ]));
                } else if (todayAcRate > 0.6) {
                    analyse.push(Random.choice([
                        "今日 AC 率良好，继续保持！",
                        "今日 AC 率不错，稳中有进！"
                    ]));
                } else if (todayAcRate < 0.3) {
                    analyse.push(Random.choice([
                        "今日遇到一些挑战，坚持就是胜利！",
                        "难题是进步的机会，尝试分析错误原因",
                        "今日 AC 率偏低，是否需要调整解题策略？",
                        "今日 AC 率较低，是否遇到了难题？可以与同学们一起进行交流"
                    ]));
                }
            }

            // 提交量分析
            if (todaySubmit >= 30) {
                analyse.push(Random.choice([
                    "今日提交量很高，学习热情满满！",
                    "高强度训练，进步看得见！"
                ]));
            } else if (todaySubmit >= 10) {
                analyse.push("今日保持了良好的练习节奏");
            } else if (todaySubmit >= 5) {
                analyse.push("每日坚持，终将长成参天大树");
            }
        } else {
            analyse.push(Random.choice([
                "今天还没开始练习，现在就开始吧！<a href='https://www.nowcoder.com/problem/tracker#/daily'>为您推荐</a>",
                "每天进步一点点，今天就从一道题开始。<a href='https://www.nowcoder.com/problem/tracker#/daily'>为您推荐</a>"
            ]));
        }

        // 本周分析
        const week = new Date().getDay();
        if (weekSubmit > 0 && (week >= 5 || week === 0)) {
            // 与上周对比
            if (weekTrend > 5) {
                analyse.push(`本周 AC 数比上周多 ${weekTrend} 题，进步显著！`);
            } else if (weekTrend < -3) {
                analyse.push(`本周活跃度有所下降，记得保持练习节奏哦`);
            }

            // 本周AC率分析
            if (weekSubmit >= 20) {
                if (weekAcRate > 0.7) {
                    analyse.push("本周解题准确率很高，继续保持！");
                } else if (weekAcRate < 0.4) {
                    analyse.push("本周遇到较多挑战，建议复盘错题，总结规律");
                }
            }
        }

        // 月度分析
        const day = new Date().getDate();
        if (monthSubmit > 0 && day >= 20) {
            // 月度进步情况
            if (monthTrend > 20) {
                analyse.push(`本月 AC 数比上月大幅增加 ${monthTrend} 题，太棒了！`);
            } else if (monthTrend > 10) {
                analyse.push(`本月保持稳定进步，比上月多 AC ${monthTrend} 题`);
            }
        }

        // 年度分析
        const month = new Date().getMonth() + 1;
        if (yearAc > 0 && lastYearAc > 0 && month >= 10) {
            if (yearTrend > 50) {
                analyse.push(`今年比去年进步 ${yearTrend.toFixed(0)}%，成长飞速！`);
            } else if (yearTrend > 20) {
                analyse.push(`今年保持稳定成长，比去年进步 ${yearTrend.toFixed(0)}%`);
            }
        }

        // 里程碑祝贺
        if (totalAc >= 1000 && totalAc <= 1050) {
            analyse.push("恭喜达成千题成就！这是坚持的最好证明");
        } else if (totalAc >= 500 && totalAc <= 550) {
            analyse.push("已突破500题大关，距离高手更进一步！");
        } else if (totalAc >= 100 && totalAc <= 150) {
            analyse.push("百题成就达成，恭喜入门算法！");
        }

        return analyse
    }
}