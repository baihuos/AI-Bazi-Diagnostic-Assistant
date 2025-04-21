<template>
  <view class="start-page">
    <view class="content">
      <!-- 背景装饰 -->
      <view class="bg-decoration">
        <view class="circle circle-1"></view>
        <view class="circle circle-2"></view>
        <view class="circle circle-3"></view>
      </view>

      <!-- 主标题 -->
      <view class="title-container">
        <text class="main-title">八字福运馆</text>
        <text class="sub-title">AI智能命理分析</text>
      </view>

      <!-- 特色功能展示 -->
      <view class="features">吧
        <view class="feature-item">
          <text class="feature-icon">🔮</text>
          <text class="feature-text">精准八字分析</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🎯</text>
          <text class="feature-text">运势预测</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💫</text>
          <text class="feature-text">姻缘配对</text>
        </view>
      </view>

      <!-- 跳过按钮 -->
      <view class="skip-button" @click="handleSkip">
        跳过 ({{ countdown }}s)
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const countdown = ref(5)

// 检查是否是第一次使用
const checkFirstTime = () => {
  try {
    const isFirstTime = uni.getStorageSync('isFirstTime')
    return isFirstTime === '' || isFirstTime === null || isFirstTime === undefined
  } catch (e) {
    return true
  }
}

// 设置非第一次使用标记
const setNotFirstTime = () => {
  try {
    uni.setStorageSync('isFirstTime', 'false')
  } catch (e) {
    console.error('设置存储失败', e)
  }
}

const handleSkip = () => {
  if (checkFirstTime()) {
    setNotFirstTime()
    uni.navigateTo({
      url: '/pages/login/guide'
    })
  } else {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      if (checkFirstTime()) {
        setNotFirstTime()
        uni.navigateTo({
          url: '/pages/login/guide'
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.start-page {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  .content {
    position: relative;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40rpx;
  }

  .bg-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;

      &.circle-1 {
        width: 400rpx;
        height: 400rpx;
        background: linear-gradient(45deg, #8b5cf6, #6366f1);
        top: -100rpx;
        right: -100rpx;
      }

      &.circle-2 {
        width: 300rpx;
        height: 300rpx;
        background: linear-gradient(45deg, #ec4899, #8b5cf6);
        bottom: 100rpx;
        left: -50rpx;
      }

      &.circle-3 {
        width: 200rpx;
        height: 200rpx;
        background: linear-gradient(45deg, #6366f1, #ec4899);
        top: 50%;
        right: 10%;
      }
    }
  }

  .title-container {
    text-align: center;
    margin-bottom: 60rpx;
    z-index: 2;

    .main-title {
      display: block;
      color: #fff;
      font-size: 48rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      animation: fadeInDown 1s ease-out;
    }

    .sub-title {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      font-size: 32rpx;
      animation: fadeInUp 1s ease-out;
    }
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    margin-bottom: 60rpx;
    z-index: 2;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      animation: fadeIn 0.5s ease-out forwards;
      opacity: 0;

      &:nth-child(1) {
        animation-delay: 0.3s;
      }

      &:nth-child(2) {
        animation-delay: 0.6s;
      }

      &:nth-child(3) {
        animation-delay: 0.9s;
      }

      .feature-icon {
        font-size: 40rpx;
      }

      .feature-text {
        color: #fff;
        font-size: 32rpx;
      }
    }
  }

  .skip-button {
    position: fixed;
    top: 40rpx;
    right: 40rpx;
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
    z-index: 2;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>