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
          <Terminal>
            <template #header>calendar.heatmap</template>
            <Calendar :data="data" :title="'AC热力图 AC-ACTIVITY'"></Calendar>
          </Terminal>
        </div>

        <!-- 右侧：排行榜 -->
        <div class="grid-right">
          <div class="rankings-section">
            <div class="section-header">
              <div class="header-title">
                <span class="title-icon">
                  <font-awesome-icon icon="fa-solid fa-trophy"/>
                </span>
                <span class="title-text">排行榜 RANKS</span>
              </div>
              <div class="header-tabs">
                <span class="tab" :class="currentRank === 0 ? 'active' : ''" @click="currentRank = 0">CAREER</span>
                <span class="tab" :class="currentRank === 1 ? 'active' : ''" @click="currentRank = 1">MONTHLY</span>
                <span class="tab" :class="currentRank === 2 ? 'active' : ''" @click="currentRank = 2">WEEKLY</span>
              </div>
            </div>

            <div class="rankings-container">
              <!-- 总榜 -->
              <Terminal v-if="currentRank === 0">
                <template #header>rank.career</template>
                <Rank :data="rankData" :title="'CAREER RANKING'"></Rank>
              </Terminal>

              <!-- 月榜 -->
              <Terminal v-else-if="currentRank === 1">
                <template #header>rank.monthly</template>
                <Rank :data="rankData" :title="'MONTHLY RANKING'"></Rank>
              </Terminal>

              <!-- 周榜 -->
              <Terminal v-else-if="currentRank === 2">
                <template #header>rank.weekly</template>
                <Rank :data="rankData" :title="'WEEKLY RANKING'"></Rank>
              </Terminal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue';
import Calendar from '@/components/Calendar.vue';
import Rank from '@/components/Rank.vue';
import Terminal from '@/components/Terminal.vue';

const data = ref([
  {
    "date": "2021-01-01",
    "count": 3
  },
  {
    "date": "2022-01-01",
    "count": 3
  },
  {
    "date": "2023-01-01",
    "count": 3
  },
  {
    "date": "2024-01-01",
    "count": 3
  },
  {
    "date": "2025-01-01",
    "count": 3
  },
  {
    "date": "2025-01-02",
    "count": 47
  },
  {
    "date": "2025-01-03",
    "count": 19
  },
  {
    "date": "2025-01-04",
    "count": 38
  },
  {
    "date": "2025-01-05",
    "count": 35
  },
  {
    "date": "2025-01-06",
    "count": 45
  },
  {
    "date": "2025-01-07",
    "count": 3
  },
  {
    "date": "2025-01-08",
    "count": 15
  },
  {
    "date": "2025-01-09",
    "count": 43
  },
  {
    "date": "2025-01-10",
    "count": 46
  },
  {
    "date": "2025-01-11",
    "count": 9
  },
  {
    "date": "2025-01-12",
    "count": 47
  },
  {
    "date": "2025-01-13",
    "count": 13
  },
  {
    "date": "2025-01-14",
    "count": 23
  },
  {
    "date": "2025-01-15",
    "count": 42
  },
  {
    "date": "2025-01-16",
    "count": 37
  },
  {
    "date": "2025-01-17",
    "count": 29
  },
  {
    "date": "2025-01-18",
    "count": 9
  },
  {
    "date": "2025-01-19",
    "count": 16
  },
  {
    "date": "2025-01-20",
    "count": 35
  },
  {
    "date": "2025-01-21",
    "count": 36
  },
  {
    "date": "2025-01-22",
    "count": 9
  },
  {
    "date": "2025-01-23",
    "count": 20
  },
  {
    "date": "2025-01-24",
    "count": 30
  },
  {
    "date": "2025-01-25",
    "count": 42
  },
  {
    "date": "2025-01-26",
    "count": 23
  },
  {
    "date": "2025-01-27",
    "count": 3
  },
  {
    "date": "2025-01-28",
    "count": 43
  },
  {
    "date": "2025-01-29",
    "count": 32
  },
  {
    "date": "2025-01-30",
    "count": 42
  },
  {
    "date": "2025-01-31",
    "count": 46
  },
  {
    "date": "2025-02-01",
    "count": 6
  },
  {
    "date": "2025-02-02",
    "count": 23
  },
  {
    "date": "2025-02-03",
    "count": 40
  },
  {
    "date": "2025-02-04",
    "count": 23
  },
  {
    "date": "2025-02-05",
    "count": 2
  },
  {
    "date": "2025-02-06",
    "count": 13
  },
  {
    "date": "2025-02-07",
    "count": 6
  },
  {
    "date": "2025-02-08",
    "count": 16
  },
  {
    "date": "2025-02-09",
    "count": 0
  },
  {
    "date": "2025-02-10",
    "count": 5
  },
  {
    "date": "2025-02-11",
    "count": 24
  },
  {
    "date": "2025-02-12",
    "count": 16
  },
  {
    "date": "2025-02-13",
    "count": 21
  },
  {
    "date": "2025-02-14",
    "count": 46
  },
  {
    "date": "2025-02-15",
    "count": 34
  },
  {
    "date": "2025-02-16",
    "count": 35
  },
  {
    "date": "2025-02-17",
    "count": 20
  },
  {
    "date": "2025-02-18",
    "count": 28
  },
  {
    "date": "2025-02-19",
    "count": 39
  },
  {
    "date": "2025-02-20",
    "count": 36
  },
  {
    "date": "2025-02-21",
    "count": 15
  },
  {
    "date": "2025-02-22",
    "count": 6
  },
  {
    "date": "2025-02-23",
    "count": 24
  },
  {
    "date": "2025-02-24",
    "count": 24
  },
  {
    "date": "2025-02-25",
    "count": 29
  },
  {
    "date": "2025-02-26",
    "count": 13
  },
  {
    "date": "2025-02-27",
    "count": 3
  },
  {
    "date": "2025-02-28",
    "count": 15
  },
  {
    "date": "2025-03-01",
    "count": 6
  },
  {
    "date": "2025-03-02",
    "count": 0
  },
  {
    "date": "2025-03-03",
    "count": 34
  },
  {
    "date": "2025-03-04",
    "count": 45
  },
  {
    "date": "2025-03-05",
    "count": 17
  },
  {
    "date": "2025-03-06",
    "count": 45
  },
  {
    "date": "2025-03-07",
    "count": 19
  },
  {
    "date": "2025-03-08",
    "count": 37
  },
  {
    "date": "2025-03-09",
    "count": 45
  },
  {
    "date": "2025-03-10",
    "count": 6
  },
  {
    "date": "2025-03-11",
    "count": 12
  },
  {
    "date": "2025-03-12",
    "count": 34
  },
  {
    "date": "2025-03-13",
    "count": 22
  },
  {
    "date": "2025-03-14",
    "count": 39
  },
  {
    "date": "2025-03-15",
    "count": 44
  },
  {
    "date": "2025-03-16",
    "count": 42
  },
  {
    "date": "2025-03-17",
    "count": 45
  },
  {
    "date": "2025-03-18",
    "count": 34
  },
  {
    "date": "2025-03-19",
    "count": 1
  },
  {
    "date": "2025-03-20",
    "count": 31
  },
  {
    "date": "2025-03-21",
    "count": 7
  },
  {
    "date": "2025-03-22",
    "count": 39
  },
  {
    "date": "2025-03-23",
    "count": 13
  },
  {
    "date": "2025-03-24",
    "count": 47
  },
  {
    "date": "2025-03-25",
    "count": 3
  },
  {
    "date": "2025-03-26",
    "count": 39
  },
  {
    "date": "2025-03-27",
    "count": 4
  },
  {
    "date": "2025-03-28",
    "count": 4
  },
  {
    "date": "2025-03-29",
    "count": 26
  },
  {
    "date": "2025-03-30",
    "count": 18
  },
  {
    "date": "2025-03-31",
    "count": 36
  },
  {
    "date": "2025-04-01",
    "count": 37
  },
  {
    "date": "2025-04-02",
    "count": 35
  },
  {
    "date": "2025-04-03",
    "count": 40
  },
  {
    "date": "2025-04-04",
    "count": 15
  },
  {
    "date": "2025-04-05",
    "count": 33
  },
  {
    "date": "2025-04-06",
    "count": 14
  },
  {
    "date": "2025-04-07",
    "count": 9
  },
  {
    "date": "2025-04-08",
    "count": 29
  },
  {
    "date": "2025-04-09",
    "count": 25
  },
  {
    "date": "2025-04-10",
    "count": 34
  },
  {
    "date": "2025-04-11",
    "count": 44
  },
  {
    "date": "2025-04-12",
    "count": 41
  },
  {
    "date": "2025-04-13",
    "count": 35
  },
  {
    "date": "2025-04-14",
    "count": 37
  },
  {
    "date": "2025-04-15",
    "count": 29
  },
  {
    "date": "2025-04-16",
    "count": 24
  },
  {
    "date": "2025-04-17",
    "count": 44
  },
  {
    "date": "2025-04-18",
    "count": 31
  },
  {
    "date": "2025-04-19",
    "count": 26
  },
  {
    "date": "2025-04-20",
    "count": 47
  },
  {
    "date": "2025-04-21",
    "count": 28
  },
  {
    "date": "2025-04-22",
    "count": 0
  },
  {
    "date": "2025-04-23",
    "count": 47
  },
  {
    "date": "2025-04-24",
    "count": 21
  },
  {
    "date": "2025-04-25",
    "count": 13
  },
  {
    "date": "2025-04-26",
    "count": 46
  },
  {
    "date": "2025-04-27",
    "count": 1
  },
  {
    "date": "2025-04-28",
    "count": 35
  },
  {
    "date": "2025-04-29",
    "count": 28
  },
  {
    "date": "2025-04-30",
    "count": 42
  },
  {
    "date": "2025-05-01",
    "count": 32
  },
  {
    "date": "2025-05-02",
    "count": 20
  },
  {
    "date": "2025-05-03",
    "count": 50
  },
  {
    "date": "2025-05-04",
    "count": 36
  },
  {
    "date": "2025-05-05",
    "count": 22
  },
  {
    "date": "2025-05-06",
    "count": 50
  },
  {
    "date": "2025-05-07",
    "count": 28
  },
  {
    "date": "2025-05-08",
    "count": 8
  },
  {
    "date": "2025-05-09",
    "count": 17
  },
  {
    "date": "2025-05-10",
    "count": 2
  },
  {
    "date": "2025-05-11",
    "count": 45
  },
  {
    "date": "2025-05-12",
    "count": 15
  },
  {
    "date": "2025-05-13",
    "count": 20
  },
  {
    "date": "2025-05-14",
    "count": 9
  },
  {
    "date": "2025-05-15",
    "count": 43
  },
  {
    "date": "2025-05-16",
    "count": 43
  },
  {
    "date": "2025-05-17",
    "count": 23
  },
  {
    "date": "2025-05-18",
    "count": 27
  },
  {
    "date": "2025-05-19",
    "count": 9
  },
  {
    "date": "2025-05-20",
    "count": 22
  },
  {
    "date": "2025-05-21",
    "count": 48
  },
  {
    "date": "2025-05-22",
    "count": 14
  },
  {
    "date": "2025-05-23",
    "count": 22
  },
  {
    "date": "2025-05-24",
    "count": 24
  },
  {
    "date": "2025-05-25",
    "count": 46
  },
  {
    "date": "2025-05-26",
    "count": 13
  },
  {
    "date": "2025-05-27",
    "count": 9
  },
  {
    "date": "2025-05-28",
    "count": 9
  },
  {
    "date": "2025-05-29",
    "count": 29
  },
  {
    "date": "2025-05-30",
    "count": 9
  },
  {
    "date": "2025-05-31",
    "count": 38
  },
  {
    "date": "2025-06-01",
    "count": 1
  },
  {
    "date": "2025-06-02",
    "count": 43
  },
  {
    "date": "2025-06-03",
    "count": 1
  },
  {
    "date": "2025-06-04",
    "count": 9
  },
  {
    "date": "2025-06-05",
    "count": 5
  },
  {
    "date": "2025-06-06",
    "count": 8
  },
  {
    "date": "2025-06-07",
    "count": 2
  },
  {
    "date": "2025-06-08",
    "count": 15
  },
  {
    "date": "2025-06-09",
    "count": 15
  },
  {
    "date": "2025-06-10",
    "count": 46
  },
  {
    "date": "2025-06-11",
    "count": 21
  },
  {
    "date": "2025-06-12",
    "count": 10
  },
  {
    "date": "2025-06-13",
    "count": 23
  },
  {
    "date": "2025-06-14",
    "count": 0
  },
  {
    "date": "2025-06-15",
    "count": 21
  },
  {
    "date": "2025-06-16",
    "count": 49
  },
  {
    "date": "2025-06-17",
    "count": 0
  },
  {
    "date": "2025-06-18",
    "count": 45
  },
  {
    "date": "2025-06-19",
    "count": 31
  },
  {
    "date": "2025-06-20",
    "count": 7
  },
  {
    "date": "2025-06-21",
    "count": 34
  },
  {
    "date": "2025-06-22",
    "count": 5
  },
  {
    "date": "2025-06-23",
    "count": 17
  },
  {
    "date": "2025-06-24",
    "count": 10
  },
  {
    "date": "2025-06-25",
    "count": 11
  },
  {
    "date": "2025-06-26",
    "count": 38
  },
  {
    "date": "2025-06-27",
    "count": 10
  },
  {
    "date": "2025-06-28",
    "count": 44
  },
  {
    "date": "2025-06-29",
    "count": 38
  },
  {
    "date": "2025-06-30",
    "count": 38
  },
  {
    "date": "2025-07-01",
    "count": 1
  },
  {
    "date": "2025-07-02",
    "count": 35
  },
  {
    "date": "2025-07-03",
    "count": 11
  },
  {
    "date": "2025-07-04",
    "count": 24
  },
  {
    "date": "2025-07-05",
    "count": 19
  },
  {
    "date": "2025-07-06",
    "count": 36
  },
  {
    "date": "2025-07-07",
    "count": 1
  },
  {
    "date": "2025-07-08",
    "count": 12
  },
  {
    "date": "2025-07-09",
    "count": 27
  },
  {
    "date": "2025-07-10",
    "count": 42
  },
  {
    "date": "2025-07-11",
    "count": 10
  },
  {
    "date": "2025-07-12",
    "count": 45
  },
  {
    "date": "2025-07-13",
    "count": 22
  },
  {
    "date": "2025-07-14",
    "count": 40
  },
  {
    "date": "2025-07-15",
    "count": 37
  },
  {
    "date": "2025-07-16",
    "count": 36
  },
  {
    "date": "2025-07-17",
    "count": 50
  },
  {
    "date": "2025-07-18",
    "count": 49
  },
  {
    "date": "2025-07-19",
    "count": 41
  },
  {
    "date": "2025-07-20",
    "count": 35
  },
  {
    "date": "2025-07-21",
    "count": 32
  },
  {
    "date": "2025-07-22",
    "count": 47
  },
  {
    "date": "2025-07-23",
    "count": 42
  },
  {
    "date": "2025-07-24",
    "count": 3
  },
  {
    "date": "2025-07-25",
    "count": 44
  },
  {
    "date": "2025-07-26",
    "count": 6
  },
  {
    "date": "2025-07-27",
    "count": 50
  },
  {
    "date": "2025-07-28",
    "count": 33
  },
  {
    "date": "2025-07-29",
    "count": 2
  },
  {
    "date": "2025-07-30",
    "count": 12
  },
  {
    "date": "2025-07-31",
    "count": 17
  },
  {
    "date": "2025-08-01",
    "count": 7
  },
  {
    "date": "2025-08-02",
    "count": 25
  },
  {
    "date": "2025-08-03",
    "count": 9
  },
  {
    "date": "2025-08-04",
    "count": 23
  },
  {
    "date": "2025-08-05",
    "count": 21
  },
  {
    "date": "2025-08-06",
    "count": 49
  },
  {
    "date": "2025-08-07",
    "count": 24
  },
  {
    "date": "2025-08-08",
    "count": 18
  },
  {
    "date": "2025-08-09",
    "count": 15
  },
  {
    "date": "2025-08-10",
    "count": 17
  },
  {
    "date": "2025-08-11",
    "count": 1
  },
  {
    "date": "2025-08-12",
    "count": 0
  },
  {
    "date": "2025-08-13",
    "count": 19
  },
  {
    "date": "2025-08-14",
    "count": 38
  },
  {
    "date": "2025-08-15",
    "count": 26
  },
  {
    "date": "2025-08-16",
    "count": 2
  },
  {
    "date": "2025-08-17",
    "count": 2
  },
  {
    "date": "2025-08-18",
    "count": 9
  },
  {
    "date": "2025-08-19",
    "count": 5
  },
  {
    "date": "2025-08-20",
    "count": 35
  },
  {
    "date": "2025-08-21",
    "count": 40
  },
  {
    "date": "2025-08-22",
    "count": 42
  },
  {
    "date": "2025-08-23",
    "count": 47
  },
  {
    "date": "2025-08-24",
    "count": 15
  },
  {
    "date": "2025-08-25",
    "count": 44
  },
  {
    "date": "2025-08-26",
    "count": 39
  },
  {
    "date": "2025-08-27",
    "count": 27
  },
  {
    "date": "2025-08-28",
    "count": 27
  },
  {
    "date": "2025-08-29",
    "count": 9
  },
  {
    "date": "2025-08-30",
    "count": 33
  },
  {
    "date": "2025-08-31",
    "count": 50
  },
  {
    "date": "2025-09-01",
    "count": 22
  },
  {
    "date": "2025-09-02",
    "count": 50
  },
  {
    "date": "2025-09-03",
    "count": 35
  },
  {
    "date": "2025-09-04",
    "count": 31
  },
  {
    "date": "2025-09-05",
    "count": 7
  },
  {
    "date": "2025-09-06",
    "count": 23
  },
  {
    "date": "2025-09-07",
    "count": 26
  },
  {
    "date": "2025-09-08",
    "count": 5
  },
  {
    "date": "2025-09-09",
    "count": 11
  },
  {
    "date": "2025-09-10",
    "count": 20
  },
  {
    "date": "2025-09-11",
    "count": 1
  },
  {
    "date": "2025-09-12",
    "count": 50
  },
  {
    "date": "2025-09-13",
    "count": 38
  },
  {
    "date": "2025-09-14",
    "count": 36
  },
  {
    "date": "2025-09-15",
    "count": 5
  },
  {
    "date": "2025-09-16",
    "count": 34
  },
  {
    "date": "2025-09-17",
    "count": 50
  },
  {
    "date": "2025-09-18",
    "count": 0
  },
  {
    "date": "2025-09-19",
    "count": 31
  },
  {
    "date": "2025-09-20",
    "count": 11
  },
  {
    "date": "2025-09-21",
    "count": 22
  },
  {
    "date": "2025-09-22",
    "count": 45
  },
  {
    "date": "2025-09-23",
    "count": 34
  },
  {
    "date": "2025-09-24",
    "count": 16
  },
  {
    "date": "2025-09-25",
    "count": 34
  },
  {
    "date": "2025-09-26",
    "count": 47
  },
  {
    "date": "2025-09-27",
    "count": 31
  },
  {
    "date": "2025-09-28",
    "count": 47
  },
  {
    "date": "2025-09-29",
    "count": 32
  },
  {
    "date": "2025-09-30",
    "count": 1
  },
  {
    "date": "2025-10-01",
    "count": 42
  },
  {
    "date": "2025-10-02",
    "count": 34
  },
  {
    "date": "2025-10-03",
    "count": 39
  },
  {
    "date": "2025-10-04",
    "count": 12
  },
  {
    "date": "2025-10-05",
    "count": 42
  },
  {
    "date": "2025-10-06",
    "count": 9
  },
  {
    "date": "2025-10-07",
    "count": 16
  },
  {
    "date": "2025-10-08",
    "count": 20
  },
  {
    "date": "2025-10-09",
    "count": 43
  },
  {
    "date": "2025-10-10",
    "count": 5
  },
  {
    "date": "2025-10-11",
    "count": 10
  },
  {
    "date": "2025-10-12",
    "count": 4
  },
  {
    "date": "2025-10-13",
    "count": 30
  },
  {
    "date": "2025-10-14",
    "count": 15
  },
  {
    "date": "2025-10-15",
    "count": 42
  },
  {
    "date": "2025-10-16",
    "count": 9
  },
  {
    "date": "2025-10-17",
    "count": 37
  },
  {
    "date": "2025-10-18",
    "count": 28
  },
  {
    "date": "2025-10-19",
    "count": 37
  },
  {
    "date": "2025-10-20",
    "count": 0
  },
  {
    "date": "2025-10-21",
    "count": 36
  },
  {
    "date": "2025-10-22",
    "count": 39
  },
  {
    "date": "2025-10-23",
    "count": 42
  },
  {
    "date": "2025-10-24",
    "count": 16
  },
  {
    "date": "2025-10-25",
    "count": 11
  },
  {
    "date": "2025-10-26",
    "count": 5
  },
  {
    "date": "2025-10-27",
    "count": 8
  },
  {
    "date": "2025-10-28",
    "count": 23
  },
  {
    "date": "2025-10-29",
    "count": 33
  },
  {
    "date": "2025-10-30",
    "count": 25
  },
  {
    "date": "2025-10-31",
    "count": 14
  },
  {
    "date": "2025-11-01",
    "count": 39
  },
  {
    "date": "2025-11-02",
    "count": 44
  },
  {
    "date": "2025-11-03",
    "count": 21
  },
  {
    "date": "2025-11-04",
    "count": 3
  },
  {
    "date": "2025-11-05",
    "count": 2
  },
  {
    "date": "2025-11-06",
    "count": 48
  },
  {
    "date": "2025-11-07",
    "count": 28
  },
  {
    "date": "2025-11-08",
    "count": 4
  },
  {
    "date": "2025-11-09",
    "count": 24
  },
  {
    "date": "2025-11-10",
    "count": 12
  },
  {
    "date": "2025-11-11",
    "count": 44
  },
  {
    "date": "2025-11-12",
    "count": 3
  },
  {
    "date": "2025-11-13",
    "count": 25
  },
  {
    "date": "2025-11-14",
    "count": 1
  },
  {
    "date": "2025-11-15",
    "count": 45
  },
  {
    "date": "2025-11-16",
    "count": 49
  },
  {
    "date": "2025-11-17",
    "count": 33
  },
  {
    "date": "2025-11-18",
    "count": 41
  },
  {
    "date": "2025-11-19",
    "count": 0
  },
  {
    "date": "2025-11-20",
    "count": 2
  },
  {
    "date": "2025-11-21",
    "count": 9
  },
  {
    "date": "2025-11-22",
    "count": 25
  },
  {
    "date": "2025-11-23",
    "count": 40
  },
  {
    "date": "2025-11-24",
    "count": 31
  },
  {
    "date": "2025-11-25",
    "count": 25
  },
  {
    "date": "2025-11-26",
    "count": 3
  },
  {
    "date": "2025-11-27",
    "count": 6
  },
  {
    "date": "2025-11-28",
    "count": 25
  },
  {
    "date": "2025-11-29",
    "count": 40
  },
  {
    "date": "2025-11-30",
    "count": 28
  },
  {
    "date": "2025-12-01",
    "count": 15
  },
  {
    "date": "2025-12-02",
    "count": 27
  },
  {
    "date": "2025-12-03",
    "count": 10
  },
  {
    "date": "2025-12-04",
    "count": 25
  },
  {
    "date": "2025-12-05",
    "count": 10
  },
  {
    "date": "2025-12-06",
    "count": 20
  },
  {
    "date": "2025-12-07",
    "count": 9
  },
  {
    "date": "2025-12-08",
    "count": 5
  },
  {
    "date": "2025-12-09",
    "count": 17
  },
  {
    "date": "2025-12-10",
    "count": 47
  },
  {
    "date": "2025-12-11",
    "count": 15
  },
  {
    "date": "2025-12-12",
    "count": 23
  },
  {
    "date": "2025-12-13",
    "count": 37
  },
  {
    "date": "2025-12-14",
    "count": 15
  },
  {
    "date": "2025-12-15",
    "count": 42
  },
  {
    "date": "2025-12-16",
    "count": 33
  },
  {
    "date": "2025-12-17",
    "count": 8
  },
  {
    "date": "2025-12-18",
    "count": 10
  },
  {
    "date": "2025-12-19",
    "count": 14
  },
  {
    "date": "2025-12-20",
    "count": 40
  },
  {
    "date": "2025-12-21",
    "count": 35
  },
  {
    "date": "2025-12-22",
    "count": 28
  },
  {
    "date": "2025-12-23",
    "count": 13
  },
  {
    "date": "2025-12-24",
    "count": 33
  },
  {
    "date": "2025-12-25",
    "count": 48
  },
  {
    "date": "2025-12-26",
    "count": 25
  },
  {
    "date": "2025-12-27",
    "count": 46
  },
  {
    "date": "2025-12-28",
    "count": 23
  },
  {
    "date": "2025-12-29",
    "count": 7
  },
  {
    "date": "2025-12-30",
    "count": 11
  },
  {
    "date": "2025-12-31",
    "count": 12
  },
  {
    "date": "2026-01-01",
    "count": 9
  },
  {
    "date": "2026-01-02",
    "count": 25
  },
  {
    "date": "2026-01-03",
    "count": 15
  },
  {
    "date": "2026-01-04",
    "count": 10
  },
  {
    "date": "2026-01-05",
    "count": 48
  },
  {
    "date": "2026-01-06",
    "count": 2
  },
  {
    "date": "2026-01-07",
    "count": 12
  },
  {
    "date": "2026-01-08",
    "count": 42
  },
  {
    "date": "2026-01-09",
    "count": 19
  },
  {
    "date": "2026-01-10",
    "count": 33
  },
  {
    "date": "2026-01-11",
    "count": 0
  },
  {
    "date": "2026-01-12",
    "count": 9
  },
  {
    "date": "2026-01-13",
    "count": 9
  },
  {
    "date": "2026-01-14",
    "count": 27
  },
  {
    "date": "2026-01-15",
    "count": 12
  },
  {
    "date": "2026-01-16",
    "count": 33
  },
  {
    "date": "2026-01-17",
    "count": 18
  },
  {
    "date": "2026-01-18",
    "count": 47
  },
  {
    "date": "2026-01-19",
    "count": 21
  },
  {
    "date": "2026-01-20",
    "count": 40
  },
  {
    "date": "2026-01-21",
    "count": 1
  },
  {
    "date": "2026-01-22",
    "count": 32
  },
  {
    "date": "2026-01-23",
    "count": 47
  },
  {
    "date": "2026-01-24",
    "count": 35
  },
  {
    "date": "2026-01-25",
    "count": 17
  },
  {
    "date": "2026-01-26",
    "count": 1
  },
  {
    "date": "2026-01-27",
    "count": 35
  },
  {
    "date": "2026-01-28",
    "count": 32
  },
  {
    "date": "2026-01-29",
    "count": 24
  },
  {
    "date": "2026-01-30",
    "count": 22
  },
  {
    "date": "2026-01-31",
    "count": 20
  },
  {
    "date": "2026-02-01",
    "count": 7
  },
  {
    "date": "2026-02-02",
    "count": 50
  },
  {
    "date": "2026-02-03",
    "count": 22
  },
  {
    "date": "2026-02-04",
    "count": 36
  },
  {
    "date": "2026-02-05",
    "count": 35
  },
  {
    "date": "2026-02-06",
    "count": 7
  },
  {
    "date": "2026-02-07",
    "count": 28
  },
  {
    "date": "2026-02-08",
    "count": 37
  },
  {
    "date": "2026-02-09",
    "count": 28
  },
  {
    "date": "2026-02-10",
    "count": 33
  },
  {
    "date": "2026-02-11",
    "count": 34
  },
  {
    "date": "2026-02-12",
    "count": 21
  },
  {
    "date": "2026-02-13",
    "count": 48
  },
  {
    "date": "2026-02-14",
    "count": 5
  },
  {
    "date": "2026-02-15",
    "count": 2
  },
  {
    "date": "2026-02-16",
    "count": 36
  },
  {
    "date": "2026-02-17",
    "count": 39
  },
  {
    "date": "2026-02-18",
    "count": 22
  },
  {
    "date": "2026-02-19",
    "count": 17
  },
  {
    "date": "2026-02-20",
    "count": 22
  },
  {
    "date": "2026-02-21",
    "count": 6
  },
  {
    "date": "2026-02-22",
    "count": 3
  },
  {
    "date": "2026-02-23",
    "count": 35
  },
  {
    "date": "2026-02-24",
    "count": 28
  },
  {
    "date": "2026-02-25",
    "count": 9
  },
  {
    "date": "2026-02-26",
    "count": 42
  },
  {
    "date": "2026-02-27",
    "count": 18
  },
  {
    "date": "2026-02-28",
    "count": 31
  },
  {
    "date": "2026-03-01",
    "count": 0
  },
  {
    "date": "2026-03-02",
    "count": 14
  },
  {
    "date": "2026-03-03",
    "count": 38
  },
  {
    "date": "2026-03-04",
    "count": 38
  },
  {
    "date": "2026-03-05",
    "count": 10
  },
  {
    "date": "2026-03-06",
    "count": 43
  },
  {
    "date": "2026-03-07",
    "count": 3
  },
  {
    "date": "2026-03-08",
    "count": 32
  },
  {
    "date": "2026-03-09",
    "count": 30
  },
  {
    "date": "2026-03-10",
    "count": 11
  },
  {
    "date": "2026-03-11",
    "count": 47
  },
  {
    "date": "2026-03-12",
    "count": 50
  },
  {
    "date": "2026-03-13",
    "count": 30
  },
  {
    "date": "2026-03-14",
    "count": 45
  },
  {
    "date": "2026-03-15",
    "count": 26
  },
  {
    "date": "2026-03-16",
    "count": 23
  },
  {
    "date": "2026-03-17",
    "count": 48
  },
  {
    "date": "2026-03-18",
    "count": 34
  },
  {
    "date": "2026-03-19",
    "count": 25
  },
  {
    "date": "2026-03-20",
    "count": 12
  },
  {
    "date": "2026-03-21",
    "count": 39
  },
  {
    "date": "2026-03-22",
    "count": 49
  },
  {
    "date": "2026-03-23",
    "count": 50
  },
  {
    "date": "2026-03-24",
    "count": 8
  },
  {
    "date": "2026-03-25",
    "count": 16
  },
  {
    "date": "2026-03-26",
    "count": 2
  },
  {
    "date": "2026-03-27",
    "count": 0
  },
  {
    "date": "2026-03-28",
    "count": 20
  },
  {
    "date": "2026-03-29",
    "count": 28
  },
  {
    "date": "2026-03-30",
    "count": 2
  },
  {
    "date": "2026-03-31",
    "count": 40
  },
  {
    "date": "2026-04-01",
    "count": 16
  },
  {
    "date": "2026-04-02",
    "count": 27
  },
  {
    "date": "2026-04-03",
    "count": 50
  },
  {
    "date": "2026-04-04",
    "count": 12
  },
  {
    "date": "2026-04-05",
    "count": 41
  },
  {
    "date": "2026-04-06",
    "count": 46
  },
  {
    "date": "2026-04-07",
    "count": 10
  },
  {
    "date": "2026-04-08",
    "count": 10
  },
  {
    "date": "2026-04-09",
    "count": 22
  },
  {
    "date": "2026-04-10",
    "count": 22
  },
  {
    "date": "2026-04-11",
    "count": 5
  },
  {
    "date": "2026-04-12",
    "count": 14
  },
  {
    "date": "2026-04-13",
    "count": 27
  },
  {
    "date": "2026-04-14",
    "count": 21
  },
  {
    "date": "2026-04-15",
    "count": 5
  },
  {
    "date": "2026-04-16",
    "count": 16
  },
  {
    "date": "2026-04-17",
    "count": 29
  },
  {
    "date": "2026-04-18",
    "count": 10
  },
  {
    "date": "2026-04-19",
    "count": 41
  },
  {
    "date": "2026-04-20",
    "count": 22
  },
  {
    "date": "2026-04-21",
    "count": 3
  },
  {
    "date": "2026-04-22",
    "count": 35
  },
  {
    "date": "2026-04-23",
    "count": 24
  },
  {
    "date": "2026-04-24",
    "count": 17
  },
  {
    "date": "2026-04-25",
    "count": 38
  },
  {
    "date": "2026-04-26",
    "count": 7
  },
  {
    "date": "2026-04-27",
    "count": 50
  },
  {
    "date": "2026-04-28",
    "count": 43
  },
  {
    "date": "2026-04-29",
    "count": 34
  },
  {
    "date": "2026-04-30",
    "count": 28
  },
  {
    "date": "2026-05-01",
    "count": 16
  },
  {
    "date": "2026-05-02",
    "count": 29
  },
  {
    "date": "2026-05-03",
    "count": 30
  },
  {
    "date": "2026-05-04",
    "count": 2
  },
  {
    "date": "2026-05-05",
    "count": 22
  },
  {
    "date": "2026-05-06",
    "count": 23
  },
  {
    "date": "2026-05-07",
    "count": 37
  },
  {
    "date": "2026-05-08",
    "count": 50
  },
  {
    "date": "2026-05-09",
    "count": 37
  },
  {
    "date": "2026-05-10",
    "count": 44
  },
  {
    "date": "2026-05-11",
    "count": 14
  },
  {
    "date": "2026-05-12",
    "count": 7
  },
  {
    "date": "2026-05-13",
    "count": 16
  },
  {
    "date": "2026-05-14",
    "count": 12
  },
  {
    "date": "2026-05-15",
    "count": 27
  },
  {
    "date": "2026-05-16",
    "count": 22
  },
  {
    "date": "2026-05-17",
    "count": 35
  },
  {
    "date": "2026-05-18",
    "count": 12
  },
  {
    "date": "2026-05-19",
    "count": 41
  },
  {
    "date": "2026-05-20",
    "count": 24
  },
  {
    "date": "2026-05-21",
    "count": 1
  },
  {
    "date": "2026-05-22",
    "count": 8
  },
  {
    "date": "2026-05-23",
    "count": 48
  },
  {
    "date": "2026-05-24",
    "count": 3
  },
  {
    "date": "2026-05-25",
    "count": 20
  },
  {
    "date": "2026-05-26",
    "count": 22
  },
  {
    "date": "2026-05-27",
    "count": 23
  },
  {
    "date": "2026-05-28",
    "count": 6
  },
  {
    "date": "2026-05-29",
    "count": 12
  },
  {
    "date": "2026-05-30",
    "count": 24
  },
  {
    "date": "2026-05-31",
    "count": 5
  },
  {
    "date": "2026-06-01",
    "count": 0
  },
  {
    "date": "2026-06-02",
    "count": 42
  },
  {
    "date": "2026-06-03",
    "count": 21
  },
  {
    "date": "2026-06-04",
    "count": 16
  },
  {
    "date": "2026-06-05",
    "count": 30
  },
  {
    "date": "2026-06-06",
    "count": 30
  },
  {
    "date": "2026-06-07",
    "count": 40
  },
  {
    "date": "2026-06-08",
    "count": 20
  },
  {
    "date": "2026-06-09",
    "count": 40
  },
  {
    "date": "2026-06-10",
    "count": 9
  },
  {
    "date": "2026-06-11",
    "count": 50
  },
  {
    "date": "2026-06-12",
    "count": 21
  },
  {
    "date": "2026-06-13",
    "count": 35
  },
  {
    "date": "2026-06-14",
    "count": 2
  },
  {
    "date": "2026-06-15",
    "count": 48
  },
  {
    "date": "2026-06-16",
    "count": 29
  },
  {
    "date": "2026-06-17",
    "count": 46
  },
  {
    "date": "2026-06-18",
    "count": 8
  },
  {
    "date": "2026-06-19",
    "count": 25
  },
  {
    "date": "2026-06-20",
    "count": 21
  },
  {
    "date": "2026-06-21",
    "count": 1
  },
  {
    "date": "2026-06-22",
    "count": 27
  },
  {
    "date": "2026-06-23",
    "count": 43
  },
  {
    "date": "2026-06-24",
    "count": 29
  },
  {
    "date": "2026-06-25",
    "count": 13
  },
  {
    "date": "2026-06-26",
    "count": 5
  },
  {
    "date": "2026-06-27",
    "count": 4
  },
  {
    "date": "2026-06-28",
    "count": 38
  },
  {
    "date": "2026-06-29",
    "count": 24
  },
  {
    "date": "2026-06-30",
    "count": 42
  },
  {
    "date": "2026-07-01",
    "count": 9
  },
  {
    "date": "2026-07-02",
    "count": 39
  },
  {
    "date": "2026-07-03",
    "count": 42
  },
  {
    "date": "2026-07-04",
    "count": 26
  },
  {
    "date": "2026-07-05",
    "count": 17
  },
  {
    "date": "2026-07-06",
    "count": 36
  },
  {
    "date": "2026-07-07",
    "count": 20
  },
  {
    "date": "2026-07-08",
    "count": 44
  },
  {
    "date": "2026-07-09",
    "count": 10
  },
  {
    "date": "2026-07-10",
    "count": 3
  },
  {
    "date": "2026-07-11",
    "count": 17
  },
  {
    "date": "2026-07-12",
    "count": 33
  },
  {
    "date": "2026-07-13",
    "count": 5
  },
  {
    "date": "2026-07-14",
    "count": 50
  },
  {
    "date": "2026-07-15",
    "count": 33
  },
  {
    "date": "2026-07-16",
    "count": 46
  },
  {
    "date": "2026-07-17",
    "count": 17
  },
  {
    "date": "2026-07-18",
    "count": 16
  },
  {
    "date": "2026-07-19",
    "count": 17
  },
  {
    "date": "2026-07-20",
    "count": 19
  },
  {
    "date": "2026-07-21",
    "count": 10
  },
  {
    "date": "2026-07-22",
    "count": 29
  },
  {
    "date": "2026-07-23",
    "count": 36
  },
  {
    "date": "2026-07-24",
    "count": 8
  },
  {
    "date": "2026-07-25",
    "count": 33
  },
  {
    "date": "2026-07-26",
    "count": 36
  },
  {
    "date": "2026-07-27",
    "count": 22
  },
  {
    "date": "2026-07-28",
    "count": 49
  },
  {
    "date": "2026-07-29",
    "count": 7
  },
  {
    "date": "2026-07-30",
    "count": 13
  },
  {
    "date": "2026-07-31",
    "count": 38
  },
  {
    "date": "2026-08-01",
    "count": 9
  },
  {
    "date": "2026-08-02",
    "count": 0
  },
  {
    "date": "2026-08-03",
    "count": 47
  },
  {
    "date": "2026-08-04",
    "count": 29
  },
  {
    "date": "2026-08-05",
    "count": 18
  },
  {
    "date": "2026-08-06",
    "count": 2
  },
  {
    "date": "2026-08-07",
    "count": 33
  },
  {
    "date": "2026-08-08",
    "count": 10
  },
  {
    "date": "2026-08-09",
    "count": 0
  },
  {
    "date": "2026-08-10",
    "count": 50
  },
  {
    "date": "2026-08-11",
    "count": 21
  },
  {
    "date": "2026-08-12",
    "count": 40
  },
  {
    "date": "2026-08-13",
    "count": 20
  },
  {
    "date": "2026-08-14",
    "count": 3
  },
  {
    "date": "2026-08-15",
    "count": 8
  },
  {
    "date": "2026-08-16",
    "count": 47
  },
  {
    "date": "2026-08-17",
    "count": 12
  },
  {
    "date": "2026-08-18",
    "count": 18
  },
  {
    "date": "2026-08-19",
    "count": 8
  },
  {
    "date": "2026-08-20",
    "count": 24
  },
  {
    "date": "2026-08-21",
    "count": 26
  },
  {
    "date": "2026-08-22",
    "count": 0
  },
  {
    "date": "2026-08-23",
    "count": 0
  },
  {
    "date": "2026-08-24",
    "count": 21
  },
  {
    "date": "2026-08-25",
    "count": 17
  },
  {
    "date": "2026-08-26",
    "count": 6
  },
  {
    "date": "2026-08-27",
    "count": 35
  },
  {
    "date": "2026-08-28",
    "count": 10
  },
  {
    "date": "2026-08-29",
    "count": 35
  },
  {
    "date": "2026-08-30",
    "count": 7
  },
  {
    "date": "2026-08-31",
    "count": 35
  },
  {
    "date": "2026-09-01",
    "count": 19
  },
  {
    "date": "2026-09-02",
    "count": 48
  },
  {
    "date": "2026-09-03",
    "count": 29
  },
  {
    "date": "2026-09-04",
    "count": 7
  },
  {
    "date": "2026-09-05",
    "count": 37
  },
  {
    "date": "2026-09-06",
    "count": 13
  },
  {
    "date": "2026-09-07",
    "count": 8
  },
  {
    "date": "2026-09-08",
    "count": 46
  },
  {
    "date": "2026-09-09",
    "count": 40
  },
  {
    "date": "2026-09-10",
    "count": 2
  },
  {
    "date": "2026-09-11",
    "count": 44
  },
  {
    "date": "2026-09-12",
    "count": 30
  },
  {
    "date": "2026-09-13",
    "count": 38
  },
  {
    "date": "2026-09-14",
    "count": 34
  },
  {
    "date": "2026-09-15",
    "count": 44
  },
  {
    "date": "2026-09-16",
    "count": 26
  },
  {
    "date": "2026-09-17",
    "count": 4
  },
  {
    "date": "2026-09-18",
    "count": 36
  },
  {
    "date": "2026-09-19",
    "count": 39
  },
  {
    "date": "2026-09-20",
    "count": 0
  },
  {
    "date": "2026-09-21",
    "count": 46
  },
  {
    "date": "2026-09-22",
    "count": 1
  },
  {
    "date": "2026-09-23",
    "count": 36
  },
  {
    "date": "2026-09-24",
    "count": 35
  },
  {
    "date": "2026-09-25",
    "count": 33
  },
  {
    "date": "2026-09-26",
    "count": 16
  },
  {
    "date": "2026-09-27",
    "count": 44
  },
  {
    "date": "2026-09-28",
    "count": 22
  },
  {
    "date": "2026-09-29",
    "count": 35
  },
  {
    "date": "2026-09-30",
    "count": 49
  },
  {
    "date": "2026-10-01",
    "count": 38
  },
  {
    "date": "2026-10-02",
    "count": 30
  },
  {
    "date": "2026-10-03",
    "count": 47
  },
  {
    "date": "2026-10-04",
    "count": 47
  },
  {
    "date": "2026-10-05",
    "count": 33
  },
  {
    "date": "2026-10-06",
    "count": 23
  },
  {
    "date": "2026-10-07",
    "count": 11
  },
  {
    "date": "2026-10-08",
    "count": 41
  },
  {
    "date": "2026-10-09",
    "count": 41
  },
  {
    "date": "2026-10-10",
    "count": 24
  },
  {
    "date": "2026-10-11",
    "count": 15
  },
  {
    "date": "2026-10-12",
    "count": 12
  },
  {
    "date": "2026-10-13",
    "count": 50
  },
  {
    "date": "2026-10-14",
    "count": 26
  },
  {
    "date": "2026-10-15",
    "count": 2
  },
  {
    "date": "2026-10-16",
    "count": 23
  },
  {
    "date": "2026-10-17",
    "count": 0
  },
  {
    "date": "2026-10-18",
    "count": 14
  },
  {
    "date": "2026-10-19",
    "count": 32
  },
  {
    "date": "2026-10-20",
    "count": 19
  },
  {
    "date": "2026-10-21",
    "count": 49
  },
  {
    "date": "2026-10-22",
    "count": 42
  },
  {
    "date": "2026-10-23",
    "count": 29
  },
  {
    "date": "2026-10-24",
    "count": 6
  },
  {
    "date": "2026-10-25",
    "count": 41
  },
  {
    "date": "2026-10-26",
    "count": 29
  },
  {
    "date": "2026-10-27",
    "count": 23
  },
  {
    "date": "2026-10-28",
    "count": 19
  },
  {
    "date": "2026-10-29",
    "count": 29
  },
  {
    "date": "2026-10-30",
    "count": 42
  },
  {
    "date": "2026-10-31",
    "count": 40
  },
  {
    "date": "2026-11-01",
    "count": 50
  },
  {
    "date": "2026-11-02",
    "count": 18
  },
  {
    "date": "2026-11-03",
    "count": 46
  },
  {
    "date": "2026-11-04",
    "count": 44
  },
  {
    "date": "2026-11-05",
    "count": 11
  },
  {
    "date": "2026-11-06",
    "count": 40
  },
  {
    "date": "2026-11-07",
    "count": 10
  },
  {
    "date": "2026-11-08",
    "count": 3
  },
  {
    "date": "2026-11-09",
    "count": 50
  },
  {
    "date": "2026-11-10",
    "count": 26
  },
  {
    "date": "2026-11-11",
    "count": 28
  },
  {
    "date": "2026-11-12",
    "count": 7
  },
  {
    "date": "2026-11-13",
    "count": 41
  },
  {
    "date": "2026-11-14",
    "count": 10
  },
  {
    "date": "2026-11-15",
    "count": 17
  },
  {
    "date": "2026-11-16",
    "count": 19
  },
  {
    "date": "2026-11-17",
    "count": 6
  },
  {
    "date": "2026-11-18",
    "count": 21
  },
  {
    "date": "2026-11-19",
    "count": 25
  },
  {
    "date": "2026-11-20",
    "count": 47
  },
  {
    "date": "2026-11-21",
    "count": 22
  },
  {
    "date": "2026-11-22",
    "count": 31
  },
  {
    "date": "2026-11-23",
    "count": 50
  },
  {
    "date": "2026-11-24",
    "count": 25
  },
  {
    "date": "2026-11-25",
    "count": 39
  },
  {
    "date": "2026-11-26",
    "count": 7
  },
  {
    "date": "2026-11-27",
    "count": 7
  },
  {
    "date": "2026-11-28",
    "count": 34
  },
  {
    "date": "2026-11-29",
    "count": 49
  },
  {
    "date": "2026-11-30",
    "count": 5
  },
  {
    "date": "2026-12-01",
    "count": 45
  },
  {
    "date": "2026-12-02",
    "count": 9
  },
  {
    "date": "2026-12-03",
    "count": 38
  },
  {
    "date": "2026-12-04",
    "count": 22
  },
  {
    "date": "2026-12-05",
    "count": 46
  },
  {
    "date": "2026-12-06",
    "count": 19
  },
  {
    "date": "2026-12-07",
    "count": 43
  },
  {
    "date": "2026-12-08",
    "count": 40
  },
  {
    "date": "2026-12-09",
    "count": 35
  },
  {
    "date": "2026-12-10",
    "count": 6
  },
  {
    "date": "2026-12-11",
    "count": 38
  },
  {
    "date": "2026-12-12",
    "count": 1
  },
  {
    "date": "2026-12-13",
    "count": 14
  },
  {
    "date": "2026-12-14",
    "count": 43
  },
  {
    "date": "2026-12-15",
    "count": 41
  },
  {
    "date": "2026-12-16",
    "count": 3
  },
  {
    "date": "2026-12-17",
    "count": 35
  },
  {
    "date": "2026-12-18",
    "count": 8
  },
  {
    "date": "2026-12-19",
    "count": 29
  },
  {
    "date": "2026-12-20",
    "count": 22
  },
  {
    "date": "2026-12-21",
    "count": 30
  },
  {
    "date": "2026-12-22",
    "count": 20
  },
  {
    "date": "2026-12-23",
    "count": 6
  },
  {
    "date": "2026-12-24",
    "count": 24
  },
  {
    "date": "2026-12-25",
    "count": 41
  },
  {
    "date": "2026-12-26",
    "count": 12
  },
  {
    "date": "2026-12-27",
    "count": 20
  },
  {
    "date": "2026-12-28",
    "count": 1
  },
  {
    "date": "2026-12-29",
    "count": 32
  },
  {
    "date": "2026-12-30",
    "count": 40
  },
  {
    "date": "2026-12-31",
    "count": 22
  }
])

const rankData = ref({
  "data": [
    { name: "张三", score: 1400, change: 1 },
    { name: "李四", score: 1300, change: -1 },
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

// 初始检查
checkTheme()
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
  padding: 12px 0;
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
  grid-template-columns: 1fr 1fr;
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
  gap: 16px;
}

/* 排行榜区域 */
.rankings-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.rankings-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
