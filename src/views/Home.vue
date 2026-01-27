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
            <span class="title-text">数据统计 STATISTICS</span>
          </div>
          <div class="header-actions">
            <span class="action-refresh">⟳ refresh</span>
            <span class="action-export">⬇ export</span>
          </div>
        </div>

        <div class="stats-grid">
          <!-- 生涯统计 -->
          <div class="stat-card glass-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-trophy" class="card-icon" />
              <div class="card-title">
                <div class="title-main">CAREER</div>
                <div class="title-sub">生涯统计</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">1,145</div>
              <div class="data-unit">AC Total</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend">
                <span class="trend-icon">↗</span>
                <span class="trend-value">+12.5%</span>
              </div>
              <div class="footer-info">since last month</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 今日统计 -->
          <div class="stat-card glass-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-sun" class="card-icon" />
              <div class="card-title">
                <div class="title-main">DAILY</div>
                <div class="title-sub">今日统计</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">14</div>
              <div class="data-unit">Today's AC</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend">
                <span class="trend-icon">↗</span>
                <span class="trend-value">+3</span>
              </div>
              <div class="footer-info">vs yesterday</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 本周统计 -->
          <div class="stat-card glass-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-crosshairs" class="card-icon" />
              <div class="card-title">
                <div class="title-main">WEEKLY</div>
                <div class="title-sub">本周统计</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">191</div>
              <div class="data-unit">This Week</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend">
                <span class="trend-icon">↗</span>
                <span class="trend-value">+24.7%</span>
              </div>
              <div class="footer-info">vs last week</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <!-- 年度统计 -->
          <div class="stat-card glass-card">
            <div class="card-header">
              <font-awesome-icon icon="fa-solid fa-globe" class="card-icon" />
              <div class="card-title">
                <div class="title-main">YEARLY</div>
                <div class="title-sub">年度统计</div>
              </div>
            </div>
            <div class="card-data">
              <div class="data-value">981</div>
              <div class="data-unit">Year 2025</div>
            </div>
            <div class="card-footer">
              <div class="footer-trend">
                <span class="trend-icon">↗</span>
                <span class="trend-value">+156%</span>
              </div>
              <div class="footer-info">vs last year</div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>

      <!-- 热力图和排行榜区域 -->
      <div class="dashboard-grid">
        <!-- 左侧：热力图 -->
        <div class="grid-left">
          <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-calendar-days" />
                </span>
                <span class="title-text">热力图 Heatmap</span>
              </div>
              <div class="header-tabs">
                <span class="tab" :class="currentCalendar === 0 ? 'active' : ''"
                  @click="currentCalendar = 0">提交热力图</span>
                <span class="tab" :class="currentCalendar === 1 ? 'active' : ''"
                  @click="currentCalendar = 1">AC热力图</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <!-- 提交 -->
              <Calendar v-if="currentCalendar === 0" :data="submitData"></Calendar>
              <!-- AC -->
              <Calendar v-if="currentCalendar === 1" :data="ACData"></Calendar>
            </div>
          </div>
        </div>

        <!-- 右侧：排行榜 -->
        <div class="grid-right">
          <div class="section-secondary">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-trophy" />
                </span>
                <span class="title-text">排行榜 RANKS</span>
              </div>
              <div class="header-tabs">
                <span class="tab" :class="currentRank === 0 ? 'active' : ''" @click="currentRank = 0">CAREER</span>
                <span class="tab" :class="currentRank === 1 ? 'active' : ''" @click="currentRank = 1">MONTHLY</span>
                <span class="tab" :class="currentRank === 2 ? 'active' : ''" @click="currentRank = 2">WEEKLY</span>
              </div>
            </div>

            <div class="section-secondary-container">
              <!-- 总榜 -->
              <div v-if="currentRank === 0">
                <Rank :data="rankData"></Rank>
              </div>

              <!-- 月榜 -->
              <div v-else-if="currentRank === 1">
                <Rank :data="rankData"></Rank>
              </div>

              <!-- 周榜 -->
              <div v-else-if="currentRank === 2">
                <Rank :data="rankData"></Rank>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue';
import Calendar from '@/components/Calendar.vue';
import Rank from '@/components/Rank.vue';
import axios from 'axios';
import JWT from '@/utils/jwt';

interface HeatmapData {
  date: string;
  count: number;
}

const submitData = ref<HeatmapData[]>([])
const ACData = ref<HeatmapData[]>([])

const getHeatmapData = async () => {
  const user = JWT.getUserInfo();
  if (!user) return;

  interface HeatmapResponse {
    code: string;
    data: HeatmapData[];
    [property: string]: any;
  }

  try {
    const response = await axios.get<HeatmapResponse>("/api/core/statistic/heatmap", {
      params: {
        userId: user.userId,
        startDate: "2024-01-01",
        endDate: new Date().toLocaleString('sv-SE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
        isAc: false
      }
    })
    if (response.status === 200) {
      submitData.value = response.data.data.filter(item => item.count > 0);
      console.log(submitData.value);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await axios.get<HeatmapResponse>("/api/core/statistic/heatmap", {
      params: {
        userId: user.userId,
        startDate: "2024-01-01",
        endDate: new Date().toLocaleString('sv-SE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
        isAc: true
      }
    })
    if (response.status === 200) {
      ACData.value = response.data.data.filter(item => item.count > 0);
      console.log(ACData.value);
    }
  } catch (error) {
    console.error(error);
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
})
</script>

<style scoped>
.terminal-home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  color: var(--text-default-color);
}

/* 欢迎消息样式 */
.welcome-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.prompt {
  color: var(--terminal-prompt);
  font-weight: bold;
}

.command {
  color: var(--neon-cyan);
  font-weight: 500;
}

.args {
  color: var(--text-light-color);
  font-size: 0.9rem;
}

.message-output {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 24px;
}

.output-line {
  color: var(--terminal-output);
  font-size: 0.95rem;
  line-height: 1.4;
}

.status-online {
  color: var(--neon-green);
  font-weight: 500;
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
  border-bottom: 1px solid var(--divider-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
}

.title-icon {
  font-size: 1.3rem;
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
  font-size: 0.9rem;
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
  color: var(--neon-green);
  background-color: var(--section-background-color);
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.stat-card {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
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
  font-size: 2rem;
  color: var(--neon-cyan);
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-main {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-default-color);
  letter-spacing: 1px;
}

.title-sub {
  font-size: 0.85rem;
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
  font-size: 0.9rem;
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
  color: var(--neon-green);
  font-weight: 500;
}

.trend-icon {
  font-size: 1.1rem;
}

.footer-info {
  font-size: 0.8rem;
  color: var(--text-light-color);
  opacity: 0.7;
}

/* 仪表板网格布局 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
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
  min-width: 0;
  width: 100%;
}

/* 排行榜区域 */
.section-secondary {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--divider-color);
  border-radius: 6px;
  overflow: auto;
}

.header-tabs {
  display: flex;
  gap: 12px;
}

.tab {
  padding: 6px 12px;
  border-radius: 6px;
  background-color: var(--section-background-color);
  color: var(--text-light-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-default-color);
  background-color: var(--divider-color);
}

.tab.active {
  background-color: var(--neon-cyan);
  color: var(--background-color-1);
  font-weight: 500;
}

.section-secondary-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 16px;
  width: calc(100% - 20px);
  overflow: auto;
}

/* 响应式设计 */

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
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
  .header-title {
    font-size: 1rem;
  }

  .header-tabs {
    flex-wrap: wrap;
  }

  .tab {
    font-size: 0.8rem;
    padding: 4px 8px;
  }

  .ranking-card {
    height: 220px;
  }

  .card-icon {
    font-size: 1.5rem;
  }

  .title-main {
    font-size: 1rem;
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
