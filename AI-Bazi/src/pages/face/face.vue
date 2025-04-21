<template>
  <view class="face-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="left-icon" @click="handleBack">
        <text class="iconfont">←</text>
      </view>
      <text class="title">人脸识别</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <text class="subtitle">请将脸部对准取景框</text>
      
      <!-- 摄像头预览区域 -->
      <view class="camera-box">
        <view class="scan-frame">
          <view class="corner top-left"></view>
          <view class="corner top-right"></view>
          <view class="corner bottom-left"></view>
          <view class="corner bottom-right"></view>
          <view class="scan-line"></view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips">
        <view class="tip-item">
          <text class="tip-icon">📸</text>
          <text class="tip-text">请保持面部在取景框内</text>
        </view>
        <view class="tip-item">
          <text class="tip-icon">🌞</text>
          <text class="tip-text">确保光线充足</text>
        </view>
        <view class="tip-item">
          <text class="tip-icon">👤</text>
          <text class="tip-text">请勿佩戴墨镜等遮挡物</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-button">
      <button class="scan-btn" @click="startScan">开始识别</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleBack = () => {
  uni.navigateBack()
}

const startScan = () => {
  uni.showToast({
    title: '开始识别',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.face-container {
  min-height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  position: relative;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  position: relative;

  .left-icon {
    position: absolute;
    left: 30rpx;
    color: #fff;
    font-size: 40rpx;
  }

  .title {
    flex: 1;
    text-align: center;
    color: #fff;
    font-size: 36rpx;
    font-weight: 500;
  }
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30rpx;

  .subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 28rpx;
    margin: 20rpx 0 40rpx;
  }

  .camera-box {
    width: 100%;
    height: 600rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .scan-frame {
      width: 500rpx;
      height: 500rpx;
      position: relative;
      border-radius: 20rpx;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.3);

      .corner {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border: 6rpx solid #8b5cf6;

        &.top-left {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        &.top-right {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        &.bottom-left {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        &.bottom-right {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }
      }

      .scan-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 4rpx;
        background: linear-gradient(to right, transparent, #8b5cf6, transparent);
        animation: scan 2s linear infinite;
      }
    }
  }

  .tips {
    width: 100%;
    padding: 40rpx 0;

    .tip-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .tip-icon {
        margin-right: 20rpx;
        font-size: 32rpx;
      }

      .tip-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 28rpx;
      }
    }
  }
}

.bottom-button {
  padding: 40rpx 30rpx;
  
  .scan-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(45deg, #8b5cf6, #6366f1);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}
</style> 