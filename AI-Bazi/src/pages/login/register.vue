<template>
  <div class="register">
    <div class="particles">
      <div v-for="n in 100" :key="n" class="particle"></div>
    </div>
    
    <div class="register-content">
      <div class="header">
        <text class="title">注册账号</text>
      </div>
      
      <div class="form">
        <div class="input-group">
          <input type="text" v-model="form.username" placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <input type="text" v-model="form.password" placeholder="请输入密码" />
        </div>
      </div>

      <button class="register-btn" @click="handleRegister">注 册</button>
      
      <div class="login-link">
        <text>已有账号？</text>
        <text class="login-btn" @click="goLogin">返回登录</text>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import type {RegisterParams} from '@/types/auth'

const form = ref<RegisterParams>({
  username: '',
  password: ''
})

const userStore = useUserStore()



const handleRegister = async() => {
  if (!form.value.username || !form.value.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  // TODO: 实现注册逻辑
  try {
   uni.showLoading({ title:'注册中...'}) 
   const result = await authApi.register(form.value)
   userStore.setToken(result.token)
   userStore.setUserInfo(result.userInfo)
   uni.showToast({ title:'注册成功', icon:'none'})
   uni.switchTab({
    url: '/pages/login/login'
  }) //返回上一页
  } catch(error){
    console.error('注册失败',error)
  }finally{
    uni.hideLoading()
  }
}

const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}
</script>

<style scoped>
.register {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: #1a0933;
  overflow: hidden;
}

.register-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 340px;
  padding: 35px 25px;
  background: rgba(45, 12, 77, 0.8);
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.2);
  border: 1px solid rgba(147, 112, 219, 0.2);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  backdrop-filter: blur(10px);
}

.title {
  color: #f8d3ff;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 182, 255, 0.3);
}

.form {
  width: 85%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  width: 100%;
  position: relative;
}

input {
  width: 100%;
  height: 45px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(186, 85, 211, 0.3);
  color: #ffffff;
  font-size: 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  padding: 0 15px;
}

input:focus {
  border-color: rgba(186, 85, 211, 0.6);
  background: rgba(147, 112, 219, 0.1);
  box-shadow: 0 0 15px rgba(186, 85, 211, 0.2);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.register-btn {
  width: 85%;
  height: 45px;
  background: linear-gradient(45deg, #9932cc, #8b008b);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  margin-top: 30px;
}

.register-btn:active {
  transform: scale(0.98);
  background: linear-gradient(45deg, #8b008b, #9932cc);
}

.particle {
  background: rgba(186, 85, 211, 0.6);
  box-shadow: 0 0 6px rgba(186, 85, 211, 0.4);
}

.login-link {
  color: rgba(255, 255, 255, 0.7);
}

.login-btn {
  color: #da70d6;
  font-weight: 500;
  text-decoration: none;
}

/* 小程序特殊适配 */
/* #ifdef MP-WEIXIN */
.register-content {
  transform: translate(-50%, -45%);
}
/* #endif */
</style>