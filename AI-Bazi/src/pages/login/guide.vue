<template>
  <view class="guide-container">
    <!-- 顶部进度条 -->
    <view class="progress-bar">
      <view 
        v-for="(item, index) in 3" 
        :key="index"
        class="progress-dot"
        :class="{ active: currentStep >= index }"
      ></view>
    </view>

    <!-- 引导内容区域 -->
    <swiper 
      class="guide-swiper" 
      :current="currentStep"
      @change="handleSwiperChange"
      :indicator-dots="false"
    >
      <!-- 第一页：八字分析 -->
      <swiper-item>
        <view class="guide-page">
          <image src="@/static/imges/1.png" class="guide-image" mode="aspectFit" />
          <view class="guide-content">
            <text class="guide-title">精准八字分析</text>
            <text class="guide-desc">基于传统命理学，结合AI技术，为您提供专业的八字分析服务</text>
          </view>
        </view>
      </swiper-item>

      <!-- 第二页：运势预测 -->
      <swiper-item>
        <view class="guide-page">
          <image src="@/static/imges/2.png" class="guide-image" mode="aspectFit" />
          <view class="guide-content">
            <text class="guide-title">运势预测</text>
            <text class="guide-desc">智能分析您的运势走向，提前预知人生机遇与挑战</text>
          </view>
        </view>
      </swiper-item>

      <!-- 第三页：姻缘配对 -->
      <swiper-item>
        <view class="guide-page">
          <image src="@/static/imges/2.png" class="guide-image" mode="aspectFit" />
          <view class="guide-content">
            <text class="guide-title">姻缘配对</text>
            <text class="guide-desc">科学的八字配对系统，助您找到最适合的姻缘</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 底部按钮区域 -->
    <view class="bottom-area">
      <view class="button-group" v-if="currentStep < 2">
        <button class="skip-btn" @click="handleSkip">跳过</button>
        <button class="next-btn" @click="handleNext">下一步</button>
      </view>
      <button class="start-btn" v-else @click="handleStart">立即体验</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(0)

const handleSwiperChange = (e: any) => {
  currentStep.value = e.detail.current
}

const handleNext = () => {
  if (currentStep.value < 2) {
    currentStep.value++
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
  setNotFirstTime()
  uni.switchTab({
    url: '/pages/index/index'
  })
}

const handleStart = () => {
  setNotFirstTime()
  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss" scoped>
.guide-container {
  min-height: 100vh;
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: column;

  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    padding: 40rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;

    .progress-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;

      &.active {
        background-color: #8b5cf6;
        transform: scale(1.2);
      }
    }
  }

  .guide-swiper {
    flex: 1;
    height: calc(100vh - 200rpx);
  }

  .guide-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;

    .guide-image {
      width: 600rpx;
      height: 600rpx;
      margin-bottom: 60rpx;
    }

    .guide-content {
      text-align: center;

      .guide-title {
        display: block;
        color: #fff;
        font-size: 48rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
      }

      .guide-desc {
        display: block;
        color: rgba(255, 255, 255, 0.8);
        font-size: 32rpx;
        line-height: 1.5;
      }
    }
  }

  .bottom-area {
    padding: 40rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .button-group {
      display: flex;
      justify-content: space-between;
      gap: 20rpx;

      .skip-btn {
        flex: 1;
        background-color: transparent;
        color: rgba(255, 255, 255, 0.6);
        font-size: 32rpx;
        padding: 20rpx 0;
        border: 2rpx solid rgba(255, 255, 255, 0.2);
        border-radius: 50rpx;
      }

      .next-btn {
        flex: 1;
        background: linear-gradient(45deg, #8b5cf6, #6366f1);
        color: #fff;
        font-size: 32rpx;
        padding: 20rpx 0;
        border-radius: 50rpx;
        border: none;
      }
    }

    .start-btn {
      width: 100%;
      background: linear-gradient(45deg, #8b5cf6, #6366f1);
      color: #fff;
      font-size: 32rpx;
      padding: 20rpx 0;
      border-radius: 50rpx;
      border: none;
    }
  }
}
</style> 