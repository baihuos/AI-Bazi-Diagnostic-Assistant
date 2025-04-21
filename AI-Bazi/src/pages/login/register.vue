<template>
  <div class="register">
    <image class="bg-image" lazy-load src="@/static/bg/bazi_logo.png" mode="aspectFill"></image>
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

.register-content {
  position: relative;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 40px;
}

.title {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
}

.form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  height: 44px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 0 15px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}


.register-btn {
  width: 100%;
  height: 44px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #ffffff;
  border-radius: 22px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.login-link {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.login-btn {
  color: #ffffff;
  font-weight: 500;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .register-content {
    padding: 15px;
  }
  
  .title {
    font-size: 20px;
  }
  
  input {
    font-size: 14px;
  }
  
  .login-link {
    font-size: 12px;
  }
}

/* 小程序特殊适配 */
/* #ifdef MP-WEIXIN */
.register-content {
  padding-top: 40px;
}
/* #endif */
</style>