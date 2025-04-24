<template>
  <div class="login">
    <image
      class="bg-image"
      lazy-load
      src="@/static/bg/bazi_logo.png"
      mode="aspectFill"
    ></image>
    <div class="login-content">
      <!-- H5端账号密码登录 -->
      <!-- #ifdef H5 -->
      <div class="login-form">
        <div class="input-group">
          <input
            type="text"
            v-model="form.username"
            placeholder="请输入用户名"
          />
        </div>
        <div class="input-group">
          <input type="text" v-model="form.password" placeholder="请输入密码" />
        </div>
        <button class="login-btn" @click="accountLogin">登 录</button>
        <div class="register-link">
          <text>还没有账号？</text>
          <text class="register-btn" @click="goRegister">立即注册</text>
        </div>
      </div>
      <!-- #endif -->

      <!-- 小程序端手机号登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <div class="login-form">
        <div class="input-group">
          <input type="text" v-model="phonelist.phone" placeholder="请输入手机号码" />
        </div>
        <div class="input-group code-group">
          <input type="text" v-model="code" placeholder="请输入验证码" />
          <text class="code-btn" @click="getCode" :disabled="countdown > 0"> {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}</text>
        </div>
        <button class="login-btn" @click="phoneLogin">登 录</button>
      </div>
      <!-- #endif -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref , computed} from "vue";
import { authApi } from "@/api/auth";
import { useUserStore } from "@/stores/user";
import type { PasswordLoginParams,SmsCodeParams } from "@/types/auth";
const form = ref<PasswordLoginParams>({
  username: "",
  password: "",
});
const phonelist = ref<SmsCodeParams>({
  phone: "", 
})
const code = ref("");
const userStore = useUserStore();
const countdown = ref(0)
const isValidPhone = computed(() =>
  /^1[3-9]\d{9}$/.test(phonelist.value.phone)
)


// 获取验证码
const getCode = async() => {
  if (!isValidPhone.value) {
    uni.showToast({ title: "请输入手机号", icon: "none" });
    return;
  }
  // TODO: 获取验证码逻辑
  try {
    await authApi.sendSmsCode(phonelist.value);
    uni.showToast({ title: "验证码发送成功" });
    countdown.value = 60
   const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && timer) {
        clearInterval(timer)
        countdown.value = 0
      }
    }, 1000)
  } catch (error) {
    console.error(error);
    uni.showToast({ title: "验证码发送失败", icon: "none" });
  } 
};

// 账号密码登录
const accountLogin = async () => {
  if (!form.value.username || !form.value.password) {
    uni.showToast({ title: "请填写完整信息", icon: "none" });
    return;
  }
  // TODO: 账号密码登录逻辑
  try {
    uni.showLoading({ title: "登录中" });
    const result = await authApi.loginWithPassword(form.value);
    userStore.setToken(result.token);
    userStore.setUserInfo(result.userInfo);
    uni.showToast({ title: "登录成功" });
    uni.switchTab({
      url: "/pages/index/index",
    });
  } catch (error) {
    console.log(error);
    uni.showToast({ title: "登录失败,用户名或密码错误", icon: "none" });
  } finally {
    uni.hideLoading();
  }
};

// 手机号登录
const phoneLogin = () => {
  if (!phonelist.value.phone || !code.value) {
    uni.showToast({ title: "请填写完整信息", icon: "none" });
    return;
  }
  // TODO: 手机号登录逻辑
  uni.switchTab({
    url: "/pages/index/index",
  });
};

// 跳转注册
const goRegister = () => {
  uni.navigateTo({
    url: "/pages/login/register",
  });
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  position: relative;
  background-color: #0a1922;
}

.bg-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.login-content {
  position: relative;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 90%;
  max-width: 360px;
  padding: 30px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.input-group {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.code-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0 15px;
  color: #ffffff;
  font-size: 16px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.code-btn {
  padding: 6px 12px;
  color: #ffffff;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.login-btn {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  color: #0a1922;
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.register-btn {
  color: #ffffff;
  margin-left: 8px;
}

/* 小程序特殊适配 */
/* #ifdef MP-WEIXIN */
.login-form {
  margin-top: 40px;
}
/* #endif */
</style>
