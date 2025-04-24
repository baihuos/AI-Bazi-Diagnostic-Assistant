<template>
    <div class="signin-container">
        <view class="custom-nav">
            <view class="status-bar"></view>
            <view class="nav-content">
                <view class="back-btn" @click="handleBack">
                    <text class="back-icon">←</text>
                </view>
                <text class="nav-title">每日签到</text>
            </view>
        </view>

        <view class="signin-content">
            <!-- 签到日历 -->
            <view class="calendar">
                <view class="calendar-header">
                    <text class="month">{{ currentMonth }}</text>
                    <text class="days-count">已连续签到 {{ continuousDays }} 天</text>
                </view>
                <view class="calendar-grid">
                    <view class="weekday-row">
                        <text v-for="day in weekDays" :key="day">{{ day }}</text>
                    </view>
                    <view class="days-grid">
                        <view v-for="(day, index) in days" :key="index" 
                              :class="['day-cell', { 'signed': day.signed, 'today': day.isToday }]">
                            <text>{{ day.date }}</text>
                            <text v-if="day.signed" class="signed-icon">✓</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 签到奖励 -->
            <view class="rewards">
                <view class="rewards-title">
                    <text>签到奖励</text>
                    <text class="subtitle">连续签到可获得更多奖励</text>
                </view>
                <view class="rewards-list">
                    <view v-for="(reward, index) in rewards" :key="index" 
                          :class="['reward-item', { 'claimed': reward.claimed }]">
                        <view class="reward-info">
                            <text class="days">第{{ reward.days }}天</text>
                            <text class="points">+{{ reward.points }}积分</text>
                        </view>
                        <view class="reward-status">
                            <text v-if="reward.claimed">已领取</text>
                            <text v-else>未领取</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 签到按钮 -->
            <view class="signin-btn" @click="handleSignIn" :class="{ 'disabled': isSignedToday }">
                <text>{{ isSignedToday ? '今日已签到' : '立即签到' }}</text>
            </view>
        </view>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

// 星期几
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 当前日期信息
const currentDate = ref(new Date())
const currentMonth = ref('')
const currentYear = ref('')

// 签到数据
const signInData = ref({
    lastSignIn: null,  // 上次签到日期
    continuousDays: 0, // 连续签到天数
    totalPoints: 0,    // 总积分
    signedDates: []    // 已签到日期列表
})

// 日历数据
const days = ref([])

// 奖励数据
const rewards = ref([
    { days: 1, points: 10, claimed: false },
    { days: 2, points: 20, claimed: false },
    { days: 3, points: 30, claimed: false },
    { days: 4, points: 40, claimed: false },
    { days: 5, points: 50, claimed: false },
    { days: 6, points: 60, claimed: false },
    { days: 7, points: 100, claimed: false },
])

// 计算属性：是否今天已签到
const isSignedToday = computed(() => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    return signInData.value.signedDates.includes(todayStr)
})

// 计算属性：连续签到天数
const continuousDays = computed(() => signInData.value.continuousDays)

// 初始化日历数据
const initCalendar = () => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    currentYear.value = year
    currentMonth.value = `${year}年${month + 1}月`
    
    // 获取当月第一天是星期几
    const firstDay = new Date(year, month, 1).getDay()
    // 获取当月天数
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // 生成日历数据
    const calendarDays = []
    // 补充上月剩余日期
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push({ date: '', signed: false, isToday: false })
    }
    // 添加当月日期
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === currentDate.value.getDate()
        const dateStr = `${year}-${month + 1}-${i}`
        const signed = signInData.value.signedDates.includes(dateStr)
        
        calendarDays.push({
            date: i,
            signed,
            isToday
        })
    }
    
    days.value = calendarDays
}

// 处理签到
const handleSignIn = () => {
    if (isSignedToday.value) {
        uni.showToast({
            title: '今日已签到',
            icon: 'none'
        })
        return
    }

    const today = new Date()
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    
    // 检查是否是连续签到
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`
    
    if (signInData.value.signedDates.includes(yesterdayStr)) {
        signInData.value.continuousDays++
    } else {
        signInData.value.continuousDays = 1
    }
    
    // 更新签到数据
    signInData.value.signedDates.push(todayStr)
    signInData.value.lastSignIn = todayStr
    
    // 更新奖励状态
    const reward = rewards.value.find(r => r.days === signInData.value.continuousDays)
    if (reward) {
        reward.claimed = true
        signInData.value.totalPoints += reward.points
    }
    
    // 更新日历显示
    initCalendar()
    
    // 保存签到数据
    saveSignInData()
    
    // 显示签到成功提示
    uni.showToast({
        title: '签到成功',
        icon: 'success'
    })
}

// 保存签到数据到本地存储
const saveSignInData = () => {
    uni.setStorageSync('signInData', signInData.value)
}

// 从本地存储加载签到数据
const loadSignInData = () => {
    const savedData = uni.getStorageSync('signInData')
    if (savedData) {
        signInData.value = savedData
        // 更新奖励状态
        rewards.value.forEach(reward => {
            reward.claimed = reward.days <= signInData.value.continuousDays
        })
    }
}

// 处理返回按钮点击
const handleBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
        uni.navigateBack({
            delta: 1
        })
    } else {
        uni.switchTab({
            url: '/pages/my/my'
        })
    }
}

// 页面加载时初始化数据
onMounted(() => {
    loadSignInData()
    initCalendar()
})
</script>

<style scoped>
.signin-container {
    min-height: 100vh;
    background-color: #000;
    padding: 30rpx;
}

.custom-nav {
    background-color: #1c1c1e;
    width: 100%;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
}

.status-bar {
    height: var(--status-bar-height);
}

.nav-content {
    height: 84px;
    line-height: 84px;
    text-align: center;
    position: relative;
}

.back-btn {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-icon {
    font-size: 24px;
    color: #fff;
}

.nav-title {
    color: #fff;
    font-size: 32rpx;
}

.signin-content {
    padding: 20rpx;
}

.calendar {
    background-color: #1c1c1e;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.month {
    color: #fff;
    font-size: 32rpx;
}

.days-count {
    color: #8b5cf6;
    font-size: 28rpx;
}

.weekday-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;
    margin-bottom: 20rpx;
}

.weekday-row text {
    color: #666;
    font-size: 24rpx;
    text-align: center;
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;
}

.day-cell {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #2c2c2e;
    border-radius: 16rpx;
    position: relative;
}

.day-cell text {
    color: #fff;
    font-size: 28rpx;
}

.signed {
    background-color: #8b5cf6;
}

.today {
    border: 2px solid #8b5cf6;
}

.signed-icon {
    font-size: 24rpx;
    color: #fff;
}

.rewards {
    background-color: #1c1c1e;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}

.rewards-title {
    margin-bottom: 30rpx;
}

.rewards-title text {
    color: #fff;
    font-size: 32rpx;
    display: block;
}

.subtitle {
    color: #666;
    font-size: 24rpx;
    margin-top: 10rpx;
}

.rewards-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.reward-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background-color: #2c2c2e;
    border-radius: 16rpx;
}

.reward-info {
    display: flex;
    flex-direction: column;
}

.days {
    color: #fff;
    font-size: 28rpx;
}

.points {
    color: #8b5cf6;
    font-size: 24rpx;
    margin-top: 10rpx;
}

.reward-status {
    color: #666;
    font-size: 24rpx;
}

.claimed {
    opacity: 0.5;
}

.signin-btn {
    background-color: #8b5cf6;
    color: #fff;
    font-size: 32rpx;
    padding: 30rpx;
    border-radius: 16rpx;
    text-align: center;
    margin-top: 30rpx;
}

.signin-btn.disabled {
    background-color: #666;
    opacity: 0.5;
}
</style> 