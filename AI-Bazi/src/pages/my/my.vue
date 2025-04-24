<template>
  <view class="my-container">
    <!-- 用户信息区域 -->
    <view class="user-info">
      <template v-if="isLoggedIn">
        <image src="@/static/imges/1.png" class="user-img" />
        <view class="user-text">
          <text class="user-id">188****5728</text>
        </view>
      </template>
      <template v-else>
        <view class="login-btn" @click="handleLogin">
          <text>请先登录</text>
        </view>
      </template>
    </view>

    <!-- 功能按钮区域 -->
    <view class="function-area">
      <view class="open-account">
        <view class="open-left">
          <text>开通会员享专属</text>
        </view>
        <button class="open-btn">立即开通</button>
      </view>

      <!-- 功能列表 -->
      <view class="menu-list">
        <view class="menu-item" @click="handleOrderRecords">
          <view class="menu-left">
            <text>订单记录</text>
          </view>
        </view>
        <view class="menu-item">
          <view class="menu-left">
            <text>用户关注</text>
          </view>
        </view>
        <view class="menu-item">
          <view class="menu-left">
            <text>用户协议</text>
          </view>
        </view>
        <view class="menu-item">
          <view class="menu-left">
            <text>隐私政策</text>
          </view>
        </view>
        <view class="menu-item">
          <view class="menu-left">
            <text>检查更新</text>
          </view>
          <text class="version">1.0</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="handleInviteFriends">
          <view class="menu-left">
            <text>邀请朋友</text>
          </view>
        </view>
        <view class="menu-item" @click="handleSignIn">
          <view class="menu-left">
            <text>每日签到</text>
          </view>
        </view>
      </view>

      <view class="logout-btn" v-if="isLoggedIn" @click="handleLogout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// 登录状态
const isLoggedIn = ref(false)

// 可以在这里添加需要的响应式数据和方法
const userId = ref('188****5728')

// 检查登录状态
onMounted(() => {
    const loginState = uni.getStorageSync('isLoggedIn')
    isLoggedIn.value = !!loginState
})

// 处理登录点击
const handleLogin = () => {
    uni.navigateTo({
        url: '/pages/login/login'
    })
}

// 处理退出登录
const handleLogout = () => {
    isLoggedIn.value = false
    uni.removeStorageSync('isLoggedIn')
    // 实现退出登录逻辑
    console.log('退出登录')
}

// 处理邀请朋友点击
const handleInviteFriends = () => {
    uni.navigateTo({
        url: '/pages/Invitation/Invitation'
    })
}

// 处理订单记录点击
const handleOrderRecords = () => {
    uni.navigateTo({
        url: '/pages/ActivityLogs/ActivityLogs'
    })
}

// 处理每日签到点击
const handleSignIn = () => {
    uni.navigateTo({
        url: '/pages/signin/signin'
    })
}
</script>

<style lang="scss" scoped>
.my-container {
  min-height: 100vh;
  background-color: #000;
  padding: 30rpx;

  .user-info {
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 30rpx;

    .user-img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-text {
      .user-id {
        color: #fff;
        font-size: 32rpx;
      }
    }

    .login-btn {
      background-color: #8b5cf6;
      color: #fff;
      font-size: 32rpx;
      padding: 20rpx 40rpx;
      border-radius: 16rpx;
      text-align: center;
    }
  }

  .function-area {
    .open-account {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      background-color: #1c1c1e;
      border-radius: 16rpx;
      margin-bottom: 20rpx;

      .open-left {
        display: flex;
        align-items: center;
        color: #fff;
        
        .icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
        }
      }

      .open-btn {
        background-color: #8b5cf6;
        color: #fff;
        font-size: 28rpx;
        padding: 10rpx 30rpx;
        border-radius: 30rpx;
        border: none;
      }
    }

    .menu-list {
      background-color: #1c1c1e;
      border-radius: 16rpx;
      margin-bottom: 30rpx;

      .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1px solid #2c2c2e;

        &:last-child {
          border-bottom: none;
        }

        .menu-left {
          display: flex;
          align-items: center;
          
          .icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
          }

          text {
            color: #fff;
            font-size: 28rpx;
          }
        }

        .version {
          color: #666;
          font-size: 24rpx;
          margin-right: 10rpx;
        }

        .arrow {
          color: #666;
          font-size: 24rpx;
        }
      }
    }

    .logout-btn {
      text-align: center;
      padding: 30rpx;
      background-color: #1c1c1e;
      border-radius: 16rpx;
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>