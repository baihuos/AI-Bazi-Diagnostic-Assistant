# 八字诊断系统后端 API 文档

## 项目简介
本项目是一个基于 Node.js 和 Express 框架开发的八字诊断系统后端服务。提供用户认证、八字诊断、支付等功能的 RESTful API 接口。

## 技术栈
- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- Winston (日志系统)

## 环境要求
- Node.js >= 14.0.0
- MySQL >= 8.0
- npm >= 6.0.0

## 安装和运行
1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 文件为 `.env`，并配置相应的环境变量：
```bash
cp .env.example .env
```

4. 启动服务
```bash
npm start
```

## API 文档

### 1. 认证相关接口
### 注册
- **接口**：`POST /api/auth/register`
{
  
}

#### 1.1 用户登录
- **接口**：`POST /api/auth/login`
- **描述**：用户登录接口，支持用户名密码登录或手机号登录
- **请求参数**：
  ```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "openid": "wx123456789"
    }
}
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "user1",
        "phone": "1378****691",
        "balance": 0.00,
        "created_at": "2025-04-07 16:00:00",
        "updated_at": "2025-04-07 16:00:00"
      }
    }
  }
  ```
- **错误响应**：
  ```json
  {
    "code": 400,
    "message": "用户名或密码错误",
    "data": null
  }
  ```
  ```json
  {
    "code": 400,
    "message": "验证码错误或已过期",
    "data": null
  }
  ```

#### 1.2 发送手机验证码
- **接口**：`POST /api/auth/send-code`
- **描述**：发送手机验证码
- **请求参数**：
  ```json
  {
    "phone": "string"  // 手机号
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "验证码发送成功",
    "data": {
      "expireTime": 300  // 验证码有效期（秒）
    }
  }
  ```
- **错误响应**：
  ```json
  {
    "code": 400,
    "message": "手机号格式错误",
    "data": null
  }
  ```
  ```json
  {
    "code": 429,
    "message": "发送太频繁，请稍后再试",
    "data": null
  }
  ```

### 2. 八字诊断接口

#### 2.1 八字诊断
- **接口**：`POST /api/bazi/diagnose`
- **描述**：根据用户输入的生辰八字进行诊断
- **请求头**：
  ```
  Authorization: Bearer <token>
  ```
- **请求参数**：
  ```json
  {
    "year": "string",
    "month": "string",
    "day": "string",
    "hour": "string",
    "gender": "string"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "诊断成功",
    "data": {
      "analysis": "详细的八字分析结果",
      "recommendations": ["建议1", "建议2"]
    }
  }
  ```

### 3. 支付相关接口

#### 3.1 创建订单
- **接口**：`POST /api/payment/create-order`
- **描述**：创建支付订单
- **请求头**：
  ```
  Authorization: Bearer <token>
  ```
- **请求参数**：
  ```json
  {
    "amount": "number",
    "productId": "string",
    "productName": "string"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "订单创建成功",
    "data": {
      "orderId": "string",
      "paymentUrl": "string"
    }
  }
  ```

#### 3.2 支付回调
- **接口**：`POST /api/payment/callback`
- **描述**：支付结果回调接口
- **请求参数**：根据支付渠道的回调参数格式
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "支付回调处理成功"
  }
  ```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或token过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项
1. 所有需要认证的接口都需要在请求头中携带 token
2. token 格式为：`Bearer <token>`
3. 请求参数的验证规则请参考具体接口说明

## 联系方式
如有问题请联系系统管理员或提交 Issue。 