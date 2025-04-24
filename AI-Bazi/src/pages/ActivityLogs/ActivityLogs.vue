<template>
    <div class="activity">
        <view class="custom-nav">
            <view class="status-bar"></view>
            <view class="nav-content">
                <view class="back-btn" @click="handleBack">
                    <text class="back-icon">←</text>
                </view>
                <text class="nav-title">历史</text>
            </view>
            <!-- <div class="head">
            <div>历史</div>
            <div>清除</div>
        </div> -->
            <div class="tab">
                <div :class="{ active: activeTab === 'all' }" @click="setActiveTab('all')">全部</div>
                <div :class="{ active: activeTab === 'favorites' }" @click="setActiveTab('favorites')">收藏夹</div>
            </div>
        </view>
        <div class="main">
            <!-- 这里可以放置根据activeTab显示的内容 -->
            <div v-if="activeTab === 'all'">
                <!-- 显示全部内容 -->
                <div v-for="item in datalist" :key="item.id" class="chat-bubble">
                    <div class="chat-content">
                        {{ item.title }}
                    </div>
                </div>
            </div>
            <div v-if="activeTab === 'favorites'">
                <div v-for="item in datalist" :key="item.id" class="chat-bubble">
                    <div v-show="item.status" class="chat-content">
                        {{ item.title }}1111111111111111111111
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
// import "../../static/bg/stars-background.png"
import { reactive, ref } from 'vue';
const activeTab = ref<'all' | 'favorites'>('all');
const datalist = reactive([
    {
        id: 1,
        title: "我希望你扮演一个讲故事的人1",
        status: false
    },
    {
        id: 2,
        title: "我希望你扮演一个讲故事的人2",
        status: true
    },
    {
        id: 3,
        title: "我希望你扮演一个讲故事的人3",
        status: false
    },
    {
        id: 4,
        title: "我希望你扮演一个讲故事的人4",
        status: false
    },
    {
        id: 5,
        title: "我希望你扮演一个讲故事的人5",
        status: true
    }
])
const setActiveTab = (tab: 'all' | 'favorites') => {
    activeTab.value = tab;
};

// 处理返回按钮点击
const handleBack = () => {
    uni.navigateBack();
};
</script>

<style scoped>
.activity {
    width: 100%;
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

.tab {
    display: flex;
    justify-content: space-evenly;
    padding: 20rpx;
    border-bottom: 1px solid #2c2c2e;
}

.tab div {
    cursor: pointer;
    padding: 10rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
}

.tab .active {
    color: #8b5cf6;
    border-bottom: 2px solid #8b5cf6;
}

.main {
    background-color: #1c1c1e;
    padding: 20rpx;
    border-radius: 16rpx;
    margin-top: 20rpx;
}

.chat-bubble {
    margin-bottom: 20rpx;
    background-color: #2c2c2e;
    border-radius: 16rpx;
    padding: 20rpx;
}

.chat-content {
    color: #fff;
    font-size: 28rpx;
    line-height: 1.5;
}
</style>