<template>
  <BaseLayout>
    <div class="terminal-home">
      <!-- 数据统计卡片 -->
      <div class="data-section">
        <div class="section-header">
          <div class="header-title">
            <span class="title-icon">
              <font-awesome-icon icon="fa-solid fa-chart-line" />
            </span>
            <span class="title-text">{{ isLogin ? '' : '全站' }}数据统计</span>
          </div>
          <!-- <div class="header-actions">
            <span class="action-refresh">⟳ 刷新</span>
            <span class="action-export">⬇ 导出</span>
          </div> -->
          <div class="header-tabs">
            <span class="tab" :class="mode === 'ac' ? 'active' : ''" @click="mode = 'ac'">AC数据</span>
            <span class="tab" :class="mode === 'submit' ? 'active' : ''" @click="mode = 'submit'">提交数据</span>
          </div>
        </div>

        <div class="stats-grid">
          <Stars class="stars" />
          <!-- 生涯统计 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-trophy" class="card-icon" />
              <div class="card-title">
                <div class="title-main">CAREER</div>
                <div class="title-sub">生涯{{ mode.toUpperCase() }}</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ currentPeriodData.total }}</div>
              <div class="data-unit">{{ mode.toUpperCase() }} Total</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- AC率 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-globe" class="card-icon" />
              <div class="card-title">
                <div class="title-main">Percentage</div>
                <div class="title-sub">AC率</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ (periodData.ac.total / periodData.submit.total * 100).toFixed(2) }}%</div>
              <div class="data-unit">AC Percentage</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 今日统计 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-sun" class="card-icon" />
              <div class="card-title">
                <div class="title-main">DAILY</div>
                <div class="title-sub">今日{{ mode.toUpperCase() }}</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ currentPeriodData.today }}</div>
              <div class="data-unit">Today's {{ mode.toUpperCase() }}</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 年度统计 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-globe" class="card-icon" />
              <div class="card-title">
                <div class="title-main">YEARLY</div>
                <div class="title-sub">年度{{ mode.toUpperCase() }}</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ currentPeriodData.thisYear }}</div>
              <div class="data-unit">Year {{ new Date().getFullYear() }}'s {{ mode.toUpperCase() }}</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend" :class="getTrendClass(currentPeriodData.thisYear, currentPeriodData.lastYear)">
                <span class="trend-icon">{{ getTrend(currentPeriodData.thisYear, currentPeriodData.lastYear) }}</span>
                <span class="trend-value">{{ getTrendValue(currentPeriodData.thisYear, currentPeriodData.lastYear)
                  }}</span>
              </div>
              <div class="footer-info">VS last year</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 本月统计 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-sun" class="card-icon" />
              <div class="card-title">
                <div class="title-main">MONTHLY</div>
                <div class="title-sub">本月{{ mode.toUpperCase() }}</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ currentPeriodData.thisMonth }}</div>
              <div class="data-unit">This Month's {{ mode.toUpperCase() }}</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend"
                :class="getTrendClass(currentPeriodData.thisMonth, currentPeriodData.lastMonth)">
                <span class="trend-icon">{{ getTrend(currentPeriodData.thisMonth, currentPeriodData.lastMonth) }}</span>
                <span class="trend-value">{{ getTrendValue(currentPeriodData.thisMonth, currentPeriodData.lastMonth)
                  }}</span>
              </div>
              <div class="footer-info">VS last month</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 本周统计 -->
          <div class="stat-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-crosshairs" class="card-icon" />
              <div class="card-title">
                <div class="title-main">WEEKLY</div>
                <div class="title-sub">本周{{ mode.toUpperCase() }}</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">{{ currentPeriodData.thisWeek }}</div>
              <div class="data-unit">This Week's {{ mode.toUpperCase() }}</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend" :class="getTrendClass(currentPeriodData.thisWeek, currentPeriodData.lastWeek)">
                <span class="trend-icon">{{ getTrend(currentPeriodData.thisWeek, currentPeriodData.lastWeek) }}</span>
                <span class="trend-value">{{ getTrendValue(currentPeriodData.thisWeek, currentPeriodData.lastWeek)
                  }}</span>
              </div>
              <div class="footer-info">VS last week</div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="grid-left">
          <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-calendar-days" />
                </span>
                <span class="title-text">热力图</span>
              </div>
              <div class="header-tabs">
                <span class="tab" :class="currentCalendar === 0 ? 'active' : ''"
                  @click="currentCalendar = 0">提交热力图</span>
                <span class="tab" :class="currentCalendar === 1 ? 'active' : ''"
                  @click="currentCalendar = 1">AC热力图</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <Calendar v-if="currentCalendar === 0" :data="submitData" :year="dynamicYear"
                @changeYear="handleYearChange"></Calendar>
              <Calendar v-if="currentCalendar === 1" :data="acData" :year="dynamicYear" @changeYear="handleYearChange">
              </Calendar>
            </div>
          </div>
          <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-star" />
                </span>
                <span class="title-text">快捷入口</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <div class="enterCardGrid">
                <a class="card" href="https://ac.nowcoder.com/" target="_blank">
                  <div class="icon">
                    <img src="/images/ac.nowcoder.webp" alt="">
                  </div>
                  <div class="info">
                    <div class="title">牛客竞赛</div>
                    <div class="desc">专业的编程算法训练平台</div>
                  </div>
                </a>
                <a class="card" href="https://www.nowcoder.com/problem/tracker#/daily" target="_blank">
                  <div class="icon">
                    <img src="/images/www.nowcoder.webp" alt="">
                  </div>
                  <div class="info">
                    <div class="title">牛客tracker</div>
                    <div class="desc">牛客tracker</div>
                  </div>
                </a>
                <a class="card" href="https://www.luogu.com.cn/" target="_blank">
                  <div class="icon">
                    <img src="https://fecdn.luogu.com.cn/columba/static.325908fec383795b.logo-single-color.svg" alt="">
                  </div>
                  <div class="info">
                    <div class="title">洛谷</div>
                    <div class="desc">计算机科学教育新生态</div>
                  </div>
                </a>
                <a class="card" href="https://atcoder.jp/home" target="_blank">
                  <div class="icon">
                    <img src="https://img.atcoder.jp/assets/logo.png" alt="">
                  </div>
                  <div class="info">
                    <div class="title">AtCoder</div>
                    <div class="desc">AtCoder is a programming contest site for anyone from beginners to experts</div>
                  </div>
                </a>
                <a class="card" href="https://codeforces.com/" target="_blank">
                  <div class="icon">
                    <img src="https://codeforces.com/codeforces.org/s/52348/android-icon-192x192.png" alt="">
                  </div>
                  <div class="info">
                    <div class="title">CodeForces</div>
                    <div class="desc">全球最大算法平台</div>
                  </div>
                </a>
                <a class="card" href="https://leetcode.cn/" target="_blank">
                  <div class="icon">
                    <img
                      src="https://assets.leetcode.cn/aliyun-lc-upload/uploaded_files/2021/03/73c9f099-abbe-4d94-853f-f8abffd459cd/leetcode.png"
                      alt="">
                  </div>
                  <div class="info">
                    <div class="title">力扣</div>
                    <div class="desc">全球极客挚爱的技术成长平台</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-right">
          <!-- <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-trophy" />
                </span>
                <span class="title-text">排行榜</span>
              </div>
              <div class="header-tabs">
                <span class="tab" :class="currentRank === 0 ? 'active' : ''" @click="currentRank = 0">CAREER</span>
                <span class="tab" :class="currentRank === 1 ? 'active' : ''" @click="currentRank = 1">MONTHLY</span>
                <span class="tab" :class="currentRank === 2 ? 'active' : ''" @click="currentRank = 2">WEEKLY</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <div v-if="currentRank === 0">
                <Rank :data="rankData"></Rank>
              </div>
              <div v-else-if="currentRank === 1">
                <Rank :data="rankData"></Rank>
              </div>

              <div v-else-if="currentRank === 2">
                <Rank :data="rankData"></Rank>
              </div>
            </div>
          </div> -->
          <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-trophy" />
                </span>
                <span class="title-text">AI总结</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <div v-for="item in aiSummary" class="analyseItem"> {{ item }}</div>
              <div class="aiTip">内容由AI生成，请仔细甄别。</div>
              <!-- <div v-for="item in analyse" v-html="item" class="analyseItem"></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue';
import Calendar from '@/components/Calendar.vue';
// import Rank from '@/components/Rank.vue';
import JWT from '@/utils/jwt';
import API, { type CoreStatisticHeatmapRequest, type CoreStatisticPeriodData, type CoreStatisticPeriodItem } from '@/utils/api';
import Toast from '@/utils/toast';
import Analyse from '@/utils/analyse';
import { useUserStore } from '@/stores/user';
import Stars from '@/components/Stars.vue';

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)

interface HeatmapData {
  date: string;
  count: number;
}

const analyse = ref<string[]>([])
const aiSummary = ref<string[]>([])

const submitData = ref<HeatmapData[]>([])
const acData = ref<HeatmapData[]>([])

const dynamicYear = ref<number>(new Date().getFullYear())

const handleYearChange = (year: number) => {
  dynamicYear.value = year
}
const padZero = (num: number): string => {
  return num < 10 ? '0' + num : num.toString();
}

const getHeatmapData = async () => {
  const dateObj = new Date();
  const date = dateObj.getFullYear() + padZero(dateObj.getMonth() + 1) + padZero(dateObj.getDate());

  let request: CoreStatisticHeatmapRequest = {
    startDate: "20230101",
    endDate: date,
    isAc: false
  }

  if (isLogin.value) {
    request.userId = JWT.getUserInfo()!.userId
  }

  const response1 = await API.core.statistic.heatmap(request)
  Toast.stdResponse(response1, false);

  if (response1.success) {
    submitData.value = response1.data.data.filter(item => item.count > 0);
  }

  request.isAc = true

  const response2 = await API.core.statistic.heatmap(request)
  Toast.stdResponse(response2, false);

  if (response2.success) {
    acData.value = response2.data.data.filter(item => item.count > 0);
  }
}

const rankData = ref({
  "data": [
    { name: "张三", score: 1400, change: 1 },
    { name: "李四", score: 1300, change: 1 },
    { name: "王五", score: 1200, change: 0 },
    { name: "赵六", score: 1145, change: 0 },
    { name: "钱七", score: 1000, change: 0 },
    { name: "孙八", score: 900, change: 1 },
    { name: "周九", score: 400, change: -1 },
    { name: "吴十", score: 300, change: -1 },
    { name: "郑十一", score: 200, change: 0 },
    { name: "王十二", score: 100, change: 0 }
  ],
  "scoreUnit": "AC",
  "userRank": 4,
  "userName": '赵六',
  "userScore": 1145,
  "totalPage": 1
})

const currentRank = ref(0)
const currentCalendar = ref(0)

const periodData = ref<CoreStatisticPeriodData>({
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
})

const mode = ref<'ac' | 'submit'>('ac')

const currentPeriodData = computed<CoreStatisticPeriodItem>(() => {
  return periodData.value[mode.value]
})

const getPeriodData = async () => {
  const userId = JWT.getUserInfo()?.userId || -1;
  const response = await API.core.statistic.period(userId);
  Toast.stdResponse(response, false);

  periodData.value = response.data.data
  analyse.value = Analyse.period(response.data.data)
}

const getAiSummary = async () =>{
  const userId = JWT.getUserInfo()?.userId
  if (!userId) {
    aiSummary.value = ["登录后查看AI总结"]
    return
  }
  const response = await API.agent.summary.recent(userId);
  Toast.stdResponse(response, false);
  aiSummary.value = response.data.msg;
}

/*
卧槽了惊天大无语，传的明明是数字却变成字符串了，逆天
*/
const getTrendClass = (curr: number, prev: number): string => {
  curr = Number(curr);
  prev = Number(prev);
  if (curr === prev) {
    return 'equal'
  } else if (curr > prev) {
    return 'up'
  } else {
    return 'down'
  }
}

const getTrendValue = (curr: number, prev: number): string => {
  curr = Number(curr);
  prev = Number(prev);
  // return (curr - prev >= 0 ? '+' : '') + ((curr - prev) / (prev === 0 ? 1 : prev) * 100).toFixed(2) + '%'
  return (curr - prev >= 0 ? '+' : '') + (curr - prev)
}

const getTrend = (curr: number, prev: number): string => {
  curr = Number(curr);
  prev = Number(prev);
  if (curr === prev) {
    return '-'
  } else if (curr > prev) {
    return '↗'
  } else {
    return '↘'
  }
}

// 获取当前主题
const getCurrentTheme = () => {
  const theme = localStorage.getItem('theme')
  return theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

const currentTheme = ref(getCurrentTheme())

// 监听主题变化
const checkTheme = () => {
  currentTheme.value = getCurrentTheme()
}

onMounted(() => {
  // 初始检查
  checkTheme()
  getHeatmapData()
  getPeriodData()
  getAiSummary()
})
</script>

<style scoped>
.terminal-home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--text-default-color);
  padding: 20px;
  width: calc(100% - 40px);
}

/* 数据统计区域 */
.data-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  border-radius: 12px;
  background: var(--background-header);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-lg);
  font-weight: 600;
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

.action-refresh,
.action-export {
  color: var(--text-light-color);
  font-size: var(--text-base);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-refresh:hover {
  color: var(--neon-cyan);
  background-color: var(--section-background-color);
}

.action-export:hover {
  color: var(--text-light-color);
  background-color: var(--section-background-color);
}

/* 统计卡片网格 */
.stats-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.stars{
  position: absolute;
  width: 100%;
  height: 100%;
}

.stat-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
  position: relative;
  padding: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

  transform-style: preserve-3d;
  transform-origin: center center;
}

.stat-card:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transform: perspective(1000px) translateY(-4px) scale(1.05) rotateX(8deg);
}

.stat-card:hover::after {
  transform: rotate(24deg) translateY(16%);
  opacity: 1;
}

.stat-card::after {
  content: "";
  position: absolute;
  top: -58%;
  left: -18%;
  width: 150%;
  height: 150%;
  background-image: linear-gradient(hsla(0, 0%, 100%, .0), hsla(0, 0%, 100%, .1) 48%, hsla(0, 0%, 100%, 0) 52%);
  transform: rotate(24deg);
  opacity: .5;
  transition: transform .5s ease, opacity .5s ease;
  pointer-events: none;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-cyber);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .card-glow {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.card-icon {
  font-size: var(--text-2xl);
  color: var(--neon-cyan);
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-main {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-default-color);
  letter-spacing: 1px;
}

.title-sub {
  font-size: var(--text-base);
  color: var(--text-light-color);
  opacity: 0.8;
}

.card-data {
  margin-bottom: 16px;
}

.data-value {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -1px;
}

.data-unit {
  font-size: var(--text-base);
  color: var(--text-light-color);
  opacity: 0.8;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--divider-color);
}

.footer-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  &.up {
    color: red;
  }

  &.down {
    color: green;
  }

  &.equal {
    color: var(--text-light-color);
  }
}

.trend-icon {
  font-size: var(--text-base);
}

.trend-value {
  font-size: var(--text-base);
}

.footer-info {
  font-size: var(--text-base);
  color: var(--text-light-color);
  opacity: 0.7;
}

/* 仪表板网格布局 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.grid-left,
.grid-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  width: 100%;
}

.section-secondary {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  /* border: 1px solid var(--divider-color); */
  /* border-radius: 6px; */
}

.header-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.tab {
  padding: 6px 12px;
  border-radius: 6px;
  color: var(--text-light-color);
  font-size: var(--text-base);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  background-color: oklch(from var(--background-color-2) 1 c h / 0.1);
  color: var(--text-default-color);
}

.tab.active {
  background-color: var(--neon-cyan);
  color: var(--text-reverse-color);
  font-weight: 500;
}

.section-secondary-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 16px;
  width: calc(100% - 20px);
  border-radius: 12px;
  background-color: var(--background-color-content);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.section-secondary-container::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.section-secondary-container::-webkit-scrollbar-thumb {
  background-color: var(--divider-color);
  border-radius: 5px;
}

.analyseItem {
  font-size: var(--text-base);
}

.aiTip{
  font-size: var(--text-xs);
  color: var(--text-light-color);
}

.enterCardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;

  >.card {
    background-color: var(--background-color-content);
    color: var(--text-default-color);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 8px;
    gap: 10px;
    transition: all 0.2s ease;
    border: 1px dashed var(--background-color-content);

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      border: 1px dashed var(--neon-cyan);
    }

    >.icon {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 10px;

      >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    >.info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 150px;

      >.title {
        font-size: var(--text-base);
      }

      >.desc {
        font-size: var(--text-xs);
        color: var(--text-light-color);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

/* 响应式设计 */

@media (max-width: 768px) {
  .terminal-home {
    width: calc(100% - 20px);
    padding: 10px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    gap: 12px;
  }

  .header-actions {
    align-self: flex-end;
  }

  .dashboard-grid {
    gap: 16px;
  }

  .ranking-card {
    height: 250px;
  }

  .data-value {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {

  .header-tabs {
    flex-wrap: wrap;
  }

  .tab {
    padding: 4px 8px;
  }

  .ranking-card {
    height: 220px;
  }

  .data-value {
    font-size: 2rem;
  }
}

/* 动画效果 */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* 自定义滚动条 */
.terminal-content::-webkit-scrollbar {
  width: 6px;
}

.terminal-content::-webkit-scrollbar-track {
  background-color: var(--background-color-2);
  border-radius: 3px;
}

.terminal-content::-webkit-scrollbar-thumb {
  background-color: var(--neon-cyan);
  border-radius: 3px;
  opacity: 0.5;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}
</style>
