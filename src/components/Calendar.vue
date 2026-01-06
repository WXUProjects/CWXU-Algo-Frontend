<template>
    <div class="ACCalendar">
        <div class="title">{{ props.title }}</div>
        <div class="content">
            <div class="calendar">
                <div class="dayAxis">
                    <div class="dayLable">Mon</div>
                    <div class="dayLable">Wed</div>
                    <div class="dayLable">Fri</div>
                </div>
                <div class="dayBlocks">
                    <div class="monthAxis">
                        <div class="monthLable">Jan</div>
                        <div class="monthLable">Feb</div>
                        <div class="monthLable">Mar</div>
                        <div class="monthLable">Apr</div>
                        <div class="monthLable">May</div>
                        <div class="monthLable">Jun</div>
                        <div class="monthLable">Jul</div>
                        <div class="monthLable">Aug</div>
                        <div class="monthLable">Sep</div>
                        <div class="monthLable">Oct</div>
                        <div class="monthLable">Nov</div>
                        <div class="monthLable">Dec</div>
                    </div>
                    <div class="dayBlockReserve" v-for="i in mod(fristDay - 1, 7)"></div>
                    <div class="dayBlock" v-for="day in yearDays">
                        <div class="colorBlock" :style="'background-color:' + getBlockColor(day)"></div>
                    </div>
                </div>
            </div>
            <div class="yearSelector">
                <div class="section" @click="changeYear(value)" :class="value === selectedYear ? 'selected' : ''"
                    v-for="value in yearArray">{{ value }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * AC热力图
 * 我的想法是直接仿照Github做个差不多一样的
 * 列表示星期
 * 实现方法是获取一整年第一天是星期几，在第一列对于位置开始绘制方格
*/

// 定义props接收父组件传入的数据
const props = defineProps({
  data: {
    type: Array as () => Array<{ date: string; count: number }>,
    default: () => []
  },
  title:{
    type: String,
    default: ''
  }
})

// 默认选中年是今年
const selectedYear = ref<number>(new Date().getFullYear());

// 计算选中年共多少天
const yearDays = computed(() => {
    if ((selectedYear.value % 4 === 0 && selectedYear.value % 100 !== 0) || selectedYear.value % 400 === 0) {
        return 366;
    } else {
        return 365;
    }
})

// 计算data包含的年份
const yearArray = computed(() => {
    // 如果没有数据则认为是今年
    if (props.data.length === 0) return [new Date().getFullYear()]
    const years = new Set<number>()
    props.data.forEach(item => {
        years.add(new Date(item.date).getFullYear())
    })
    return Array.from(years).reverse()
})

// 每年第一天星期几（1,2,3,4,5,6,0）
const fristDay = computed(() => new Date(selectedYear.value, 0, 2).getDay());

// 扩展 % 运算符，增加负数支持，处理星期循环
const mod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
}

// 日期补零
const padZero = (num: number) => {
    return num < 10 ? '0' + num : num.toString()
}

// 根据天数获取颜色
const getBlockColor = (day: number) => {
    // 查找当天数据
    const dateObj = new Date(selectedYear.value, 0, day)
    const date = `${dateObj.getFullYear()}-${padZero(dateObj.getMonth() + 1)}-${padZero(dateObj.getDate())}`
    const count = props.data.find(item => item.date === date)?.count || 0

    // 颜色梯度
    if (count === 0) {
        return 'rgba(0, 200, 0, 0)'
    } else if (count < 10) {
        return 'rgba(0, 200, 0, 0.1)'
    } else if (count < 20) {
        return 'rgba(0, 200, 0, 0.3)'
    } else if (count < 30) {
        return 'rgba(0, 200, 0, 0.5)'
    } else if (count < 40) {
        return 'rgba(0, 200, 0, 0.7)'
    } else if (count < 50) {
        return 'rgba(0, 200, 0, 0.9)'
    } else {
        return 'rgba(0, 200, 0, 1)'
    }
}

// 用户点击更改年份
const changeYear = (year: number) => {
    selectedYear.value = year
}
</script>

<style>
.ACCalendar {
    user-select: none;
}

.ACCalendar .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.5rem;
    color: var(--text-default-color);
}

.ACCalendar .content {
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 5px;
}

.calendar {
    position: relative;
    padding: 0 0 0 40px;
}

.monthAxis {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 634px;
    height: 20px;
    top: 0px;
    left: 0px;
}

.monthLable {
    width: 30px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 1rem;
    color: var(--text-default-color);
}

.dayAxis {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 40px;
    height: calc(100% - 32px);
    top: 20px;
    left: 0;
}

.dayLable {
    width: 30px;
    height: 10px;
    line-height: 10px;
    text-align: center;
    font-size: 1rem;
    color: var(--text-default-color);
}

.dayBlocks {
    position: relative;
    padding-top: 20px;
    /* 格子宽度*7+格子间距*6 */
    height: calc((10px * 7) + (2px * 6) + 12px);
    overflow-x: scroll;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    gap: 2px;
}

.dayBlocks::-webkit-scrollbar {
    height: 10px;
}

.dayBlocks::-webkit-scrollbar-thumb {
    background-color: var(--divider-color);
    border-radius: 5px;
}

.dayBlocks::-webkit-scrollbar-track {
    background-color: var(--background-color);
}

.dayBlockReserve {
    width: 10px;
    height: 10px;
    border-radius: 2px;
}

.dayBlock {
    position: relative;
    width: 10px;
    height: 10px;
    background-color: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
}

.colorBlock {
    width: 100%;
    height: 100%;
}

.yearSelector {
    height: calc((10px * 7) + (2px * 6) + 20px);
    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    padding: 0 5px;
    gap: 5px;
    overflow: auto;
}

.yearSelector::-webkit-scrollbar {
    height: 10px;
    width: 5px;
}

.yearSelector::-webkit-scrollbar-thumb {
    background-color: var(--divider-color);
    border-radius: 2px;
}

.yearSelector::-webkit-scrollbar-track {
    background-color: var(--background-color);
}

.yearSelector .section {
    width: 80px;
    line-height: 30px;
    text-align: center;
    font-size: 1.2rem;
    color: var(--text-default-color);
    border-radius: 10px;
    border: 1px solid var(--divider-color);
}

.yearSelector .section.selected {
    background-color: var(--divider-color);
}

@media (max-width:900px) {
    .ACCalendar .content {
        flex-direction: column;
    }

    .yearSelector {
        width: 100%;
        height: auto;
        flex-direction: row;
    }
}
</style>