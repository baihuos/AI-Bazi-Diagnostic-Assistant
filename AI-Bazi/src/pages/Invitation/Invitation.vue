<template>
    <div class="lnvitation">
        <view class="custom-nav">
            <view class="status-bar"></view>
            <view class="nav-content">
                <view class="back-btn" @click="handleBack">
                    <text class="back-icon">←</text>
                </view>
                <text class="nav-title">邀请朋友</text>
            </view>
        </view>
        <view>
            获得奖励高达100
        </view>
        <view class="lnv">
            <view class="earn">

                <span></span>
                <span>赚取询问次数</span>
                <span></span>
            </view>
            <view>
                <view class="container">
                    <view class="task">
                        <view class="reward">
                            <view
                                style="height: 47px;border-bottom: 2px dashed white;position: relative;display: flex;justify-content: center;align-items: center;">
                                <view class="circle-decoration1">
                                    <view class="star2"></view>
                                    <view class="star22"></view>
                                </view>
                            </view>
                            <view style="font-size: 14px;color: white;">
                                +10
                            </view>
                        </view>
                        <view class="reward">
                            <view
                                style="height: 47px;border-bottom: 2px dashed white;position: relative;display: flex;justify-content: center;align-items: center;">
                                <view class="circle-decoration1">
                                    <view class="star2"></view>
                                    <view class="star22"></view>
                                </view>
                            </view>
                            <view style="font-size: 14px;color: white;">+30</view>
                        </view>
                        <view class="reward">
                            <view
                                style="height: 47px;border-bottom: 2px dashed white;position: relative;display: flex;justify-content: center;align-items: center;">
                                <view class="circle-decoration1">
                                    <view class="star2"></view>
                                    <view class="star22"></view>
                                </view>
                            </view>
                            <view style="font-size: 14px;color: white;">+60</view>
                        </view>
                    </view>
                    <view class="circles">
                        <view class="circle active">
                            <span style="font-size: 25px;">+</span>
                        </view>
                        <view class="bian">

                        </view>
                        <view class="circle active">
                            <span style="font-size: 25px;">+</span>
                        </view>
                        <view class="bian">

                        </view>
                        <view class="circle active">
                            <span style="font-size: 25px;">+</span>
                        </view>
                    </view>
                    <view
                        style="display: flex;justify-content: space-between;width: 100%;padding: 0px 30px;box-sizing: border-box;margin-top: 5px;color: #81d4bc;font-size: 14px;">
                        <view>第一</view>
                        <view>第二</view>
                        <view>第三</view>
                    </view>
                </view>
            </view>
            <view class="lnv_button">
                <span>邀请朋友</span>
                <view class="circle-decoration">
                    <view class="star"></view>
                    <view class="star1"></view>
                </view>
            </view>

            <view style="text-align: center;font-size: 13px;margin-top: 10px;">
                *只需将邀请链接分享给您的朋友并让他们打开应用即可，您会得到奖励
            </view>
        </view>
        <view class="lnv1">
            <view class="earn">
                <span></span>
                <span>邀请通过</span>
                <span></span>
            </view>
            <view style="display: flex;">
                <view style="margin-right: 15px;">
                    <view
                        style="background-color: #2ddd9b;border-radius: 50%;width: 18px;height: 18px;text-align: center;color: white;line-height: 18px;font-size: 15px;">
                        1
                    </view>
                    <view style="width: 1.5px; height: 52px;background-color: #2ddd9b;margin-left: 8px;margin: 4px 8px;">

                    </view>
                    <view
                        style="background-color: #2ddd9b;border-radius: 50%;width: 18px;height: 18px;text-align: center;color: white;line-height: 18px;font-size: 15px;">
                        2
                    </view>
                </view>
                <view>
                    <view>链接</view>
                    <view style="margin: 9px 0px;display: flex;justify-content: space-between;align-items: center;width: 280px;color: white;">
                        <view style="font-size: 14px;">
                            <P>chatai/join/</P>
                            <p>dO89BSjEReabfmmVIgvp_N</p>
                        </view>
                        <view class="copy-button" bindtap="copyLink">复制</view>
                    </view>
                    <view>
                        分享给
                    </view>
                    <view style="font-size: 12px;display: flex;justify-content: space-between;flex-wrap: wrap;color:white">
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                        <view>WhatsApp</view>
                    </view>
                </view>
            </view>

            <!-- <view class="">
                <view class="link-section">
                    <text>链接</text>
                    <view class="copy-button" bindtap="copyLink">复制</view>
                </view>
                <view class="share-section">
                    <text>分享给</text>

                </view>
            </view> -->

        </view>

    </div>
</template>
  
<script lang="ts" setup>
// 处理返回按钮点击
const handleBack = () => {
    uni.navigateBack();
};
</script>
  
<style scoped>
.lnvitation {
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

/* 状态栏占位 */
.status-bar {
    height: var(--status-bar-height);
}

/* 导航栏内容 */
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

.earn {
    width: 140px;
    background-color: #8b5cf6;
    margin: auto;
    text-align: center;
    line-height: 30px;
    height: 30px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    color: white;
}

.lnv {
    border: 5px solid #2c2c2e;
    padding: 0px 20px 20px 20px;
    border-radius: 16rpx;
    height: 330px;
    background-color: #1c1c1e;
    margin-bottom: 20rpx;
}

.lnv1 {
    border: 5px solid #2c2c2e;
    padding: 0px 20px 20px 20px;
    border-radius: 16rpx;
    height: 300px;
    background-color: #1c1c1e;
}

.lnv_button {
    position: relative;
    background-color: #8b5cf6;
    border-radius: 30px;
    width: 200px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    margin: auto;
    color: white;
    margin-top: 10px;
}

.circle-decoration {
    position: absolute;
    width: 70rpx;
    height: 70rpx;
    background: linear-gradient(145deg, #5f5b94, #1c1b28);
    border-radius: 50%;
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    right: -1px;
    top: -10px;
}

.circle-decoration1 {
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    background: linear-gradient(145deg, #5f5b94, #1c1b28);
    border-radius: 50%;
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.star2 {
    position: absolute;
    width: 25rpx;
    height: 25rpx;
    background-color: #ffffff;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    filter: blur(2rpx);
    box-shadow: 0 0 8rpx 2rpx rgba(255, 255, 255, 0.8);
    left: 5px;
    top: 5px;
}

.star22 {
    position: absolute;
    width: 10rpx;
    height: 10rpx;
    background-color: #ffffff;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    filter: blur(2rpx);
    box-shadow: 0 0 8rpx 2rpx rgba(255, 255, 255, 0.8);
    top: 3px;
    right: 5px;
}

.star {
    position: absolute;
    width: 35rpx;
    height: 35rpx;
    background-color: #ffffff;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    filter: blur(2rpx);
    box-shadow: 0 0 8rpx 2rpx rgba(255, 255, 255, 0.8);
    left: 5px;
    top: 7px;
}

.star1 {
    position: absolute;
    width: 20rpx;
    height: 20rpx;
    background-color: #ffffff;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    filter: blur(2rpx);
    box-shadow: 0 0 8rpx 2rpx rgba(255, 255, 255, 0.8);
    top: 2px;
    right: 7px;
}

.copy-button {
    width: 50px;
    border-radius: 20px;
    font-size: 13px;
    box-sizing: border-box;
    border: 1px solid #8b5cf6;
    text-align: center;
    line-height: 23px;
    color: #8b5cf6;
}

.container {
    background-color: #2c2c2e;
    padding: 10px;
    border-radius: 16rpx;
}

.link-section {
    margin-bottom: 20px;
}

.share-section {
    margin-top: 20px;
}

.task {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 20px;
}

.task-item {
    background-color: #f9a825;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    color: white;
    font-size: 18px;
}

.circles {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
}

.circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #2c2c2e;
    color: #fff;
}

.active {
    border: 2px dashed #8b5cf6;
}

.bian {
    border: 2px solid #2c2c2e;
    width: 45px;
}

.reward {
    background-color: #8b5cf6;
    height: 70px;
    width: 60px;
    text-align: center;
    border-radius: 16rpx;
}
</style>