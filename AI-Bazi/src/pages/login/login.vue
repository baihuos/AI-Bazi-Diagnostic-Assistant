<template>
  <div class="login">
    <!-- 移除背景图 -->
    <div class="particles">
      <div v-for="n in 100" :key="n" class="particle"></div>
    </div>
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
  position: fixed;
  width: 100%;
  height: 100vh;
  background: #1a0933;
  overflow: hidden;
}

.login-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.login-form {
  width: 90%;
  max-width: 340px;
  padding: 35px 25px;
  background: rgba(45, 12, 77, 0.8);
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.2);
  border: 1px solid rgba(147, 112, 219, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 85%;
  margin-bottom: 20px;
}

.code-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  width: 100%;
  height: 45px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(186, 85, 211, 0.3);
  padding: 0 15px;
  color: #ffffff;
  font-size: 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: rgba(186, 85, 211, 0.6);
  background: rgba(147, 112, 219, 0.1);
  box-shadow: 0 0 15px rgba(186, 85, 211, 0.2);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.code-btn {
  padding: 8px 15px;
  color: #ffffff;
  font-size: 14px;
  background: linear-gradient(45deg, #9932cc, #8b008b);
  border-radius: 8px;
  white-space: nowrap;
}

.login-btn {
  width: 85%;
  height: 45px;
  background: linear-gradient(45deg, #9932cc, #8b008b);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 30px auto 0;
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: scale(0.98);
  background: linear-gradient(45deg, #8b008b, #9932cc);
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.register-btn {
  color: #da70d6;
  font-weight: 500;
  margin-left: 5px;
}

/* 添加粒子动画 */
.particles {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(186, 85, 211, 0.6);
  box-shadow: 0 0 6px rgba(186, 85, 211, 0.4);
  border-radius: 50%;
}
</style>
