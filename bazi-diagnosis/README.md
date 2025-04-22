# 八字诊断助手 API 文档

## 基础信息
- 基础URL: `http://localhost:3000`
- 所有请求和响应均使用 JSON 格式
- 所有请求需要在 header 中包含 `Content-Type: application/json`

## API 端点

### 1. 用户认证

#### 登录
- **POST** `/api/login`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "access_token": "string",
    "token_type": "bearer"
  }
  ```

#### 注册
- **POST** `/api/register`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
  }
  ```

### 2. 八字诊断

#### 创建诊断
- **POST** `/api/diagnosis/create`
- **请求体**:
  ```json
  {
    "birth_date": "YYYY-MM-DD HH:mm:ss",
    "gender": "male/female",
    "name": "string"
  }
  ```

#### 获取诊断列表
- **GET** `/api/diagnosis/list`
- **查询参数**:
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认10）

#### 获取诊断详情
- **GET** `/api/diagnosis/{diagnosis_id}`

#### 更新诊断
- **PUT** `/api/diagnosis/{diagnosis_id}`
- **请求体**:
  ```json
  {
    "birth_date": "YYYY-MM-DD HH:mm:ss",
    "gender": "male/female",
    "name": "string"
  }
  ```

#### 删除诊断
- **DELETE** `/api/diagnosis/{diagnosis_id}`

### 3. 诊断结果

#### 获取诊断结果
- **GET** `/api/diagnosis/{diagnosis_id}/result`

#### 更新诊断结果
- **PUT** `/api/diagnosis/{diagnosis_id}/result`
- **请求体**:
  ```json
  {
    "result": "string",
    "analysis": "string"
  }
  ```

### 4. 系统配置

#### 获取系统配置
- **GET** `/api/config`

#### 更新系统配置
- **PUT** `/api/config`
- **请求体**:
  ```json
  {
    "key": "string",
    "value": "string"
  }
  ```

## 错误响应
所有API在发生错误时会返回以下格式的响应：
```json
{
  "detail": "错误信息描述"
}
```

常见HTTP状态码：
- 200: 请求成功
- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误
