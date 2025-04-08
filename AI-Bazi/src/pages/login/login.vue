<template>
  <div class="login">
    <!-- #ifdef MP-WEIXIN -->
    <div class="login-container"></div>
    <!-- #endif -->
    <div class="container">
        <h1>简单未来，指引现在</h1>
        <div class="login-box">
            <div class="input-group">
                <input type="text" placeholder="请输入手机号码" />
            </div>
            <div class="input-group">
                <input type="text" placeholder="请输入验证码" />
                <a href="#" class="get-code">获取验证码</a>
            </div>
            <button class="login-btn">立即登录</button>
        </div>
        <div class="register-link">
            <p>已有账号？<a href="#">去登录</a></p>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.login-container{
    width: 100%;
    height: 100vh;
    background: url('/src/static/bg/stars-background.png') no-repeat center center fixed; /* 假设有星星背景图 */
    background-size: cover;
}
.container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
}

.login-box {
    width: 80%;
}


.container {
    text-align: center;
}

h1 {
    font-size: 24px;
    margin-bottom: 30px;
}

.login-box {
    background: rgba(0, 0, 0, 0.8);
    padding: 40px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.input-group {
    margin-bottom: 20px;
    position: relative;
}

input {
    width: 100%;
    padding: 10px;
    background: #333;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
}

input::placeholder {
    color: #aaa;
}

.get-code {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #1e90ff;
    text-decoration: none;
    font-size: 12px;
}

.login-btn {
    width: 100%;
    padding: 10px;
    background: linear-gradient(to right, #1e90ff, #9b59b6);
    border: none;
    border-radius:20px;
}
    </style>