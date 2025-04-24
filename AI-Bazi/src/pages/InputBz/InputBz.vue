<template>
  <view class="container">
    <view class="header">
      <view class="title">AI八字诊断助手</view>
      <view class="subtitle">请输入您的八字信息</view>
    </view>

    <view class="input-section">
      <view class="input-group">
        <view class="input-item">
          <text class="label">年柱</text>
          <input 
            class="input" 
            v-model="year" 
            placeholder="请输入年柱" 
            placeholder-class="placeholder"
          />
        </view>
        <view class="input-item">
          <text class="label">月柱</text>
          <input 
            class="input" 
            v-model="month" 
            placeholder="请输入月柱" 
            placeholder-class="placeholder"
          />
        </view>
        <view class="input-item">
          <text class="label">日柱</text>
          <input 
            class="input" 
            v-model="day" 
            placeholder="请输入日柱" 
            placeholder-class="placeholder"
          />
        </view>
        <view class="input-item">
          <text class="label">时柱</text>
          <input 
            class="input" 
            v-model="hour" 
            placeholder="请输入时柱" 
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <view class="button-group">
        <button class="submit-btn" @click="handleSubmit">开始诊断</button>
        <button class="clear-btn" @click="handleClear">清空</button>
      </view>
    </view>

    <!-- 广告区域 -->
    <Upgrade v-if="showAdModal" />

    <!-- 诊断结果区域 -->
    <view class="result-section" v-if="diagnosisResult">
      <view class="result-header">
        <text class="result-title">诊断结果</text>
        <button class="copy-btn" @click="handleCopy">复制结果</button>
      </view>
      <view class="result-content">
        <text>{{ diagnosisResult }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showAdModal = ref(false)
const remainingTimes = ref(0)

// 处理观看广告
const handleWatchAd = () => {
  // 创建激励视频广告
  const videoAd = uni.createRewardedVideoAd({
    adUnitId: 'adunit-xxxxxxxxxxxxxxxx' // 替换为你的广告单元ID
  })

  // 监听广告加载
  videoAd.onLoad(() => {
    console.log('广告加载成功')
  })

  // 监听广告错误
  videoAd.onError(err => {
    console.error('广告加载失败', err)
    uni.showToast({
      title: '广告加载失败',
      icon: 'none'
    })
  })

  // 显示广告
  videoAd.show().catch(err => {
    // 广告显示失败，重新加载
    videoAd.load().then(() => {
      videoAd.show()
    }).catch(err => {
      console.error('广告显示失败', err)
      uni.showToast({
        title: '广告显示失败',
        icon: 'none'
      })
    })
  })

  // 监听广告关闭
  videoAd.onClose(res => {
    if (res && res.isEnded) {
      // 正常播放结束，发放奖励
      remainingTimes.value += 1
      showAdModal.value = false
      uni.showToast({
        title: '获得1次提问机会',
        icon: 'success'
      })
    } else {
      // 播放中途退出，不发放奖励
      uni.showToast({
        title: '未完成观看，无法获得奖励',
        icon: 'none'
      })
    }
  })
}

// 处理邀请好友
const handleInvite = () => {
  // 获取小程序分享参数
  uni.share({
    provider: "weixin",
    scene: "WXSceneSession",
    type: 0,
    title: 'AI八字诊断助手',
    summary: '快来体验智能八字诊断！',
    imageUrl: '/static/share-img.png',
    success: function (res) {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      })
      // 分享成功后可以给予奖励
      remainingTimes.value += 1
      showAdModal.value = false
    },
    fail: function (err) {
      uni.showToast({
        title: '分享失败',
        icon: 'none'
      })
    }
  })
}

// 处理升级会员
const handleUpgrade = () => {
  uni.navigateTo({
    url: '/pages/member/member'
  })
}

// 检查剩余次数
const checkRemainingTimes = () => {
  // 这里应该从后端获取实际剩余次数
  remainingTimes.value = 0 // 测试用，设置为0
  if (remainingTimes.value === 0) {
    showAdModal.value = true
  }
}

onMounted(() => {
  checkRemainingTimes()
})
</script> 