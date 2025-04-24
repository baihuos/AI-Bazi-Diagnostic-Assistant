# 八字诊断助手 API 文档

## 基础信息
- 基础URL: `http://localhost:3000`
- 所有请求和响应均使用 JSON 格式
- 所有请求需要在 header 中包含 `Content-Type: application/json`

## API 端点

### 1. 用户认证

#### 登录
- **POST** `/api/auth/login`
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
测试账号：
username:admin password:pwd123
username:杨帆 passwird:123456pwer
#### 注册
- **POST** `/api/auth/register`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
  }
  ```

### 2. 八字诊断相关接口

#### 八字诊断接囗(调用 DeepSeek API生成分析)
- **POST** `/api/bazi/diagnose`
- **请求体**:
Header: Authorization:Bearer <token>
Body:{"birthDate":"1990-01-01T12:00:00Z","gender":"1"}
预期:200，{“code":20日，"message":"八字诊断成功”，"data": {...}}
错误场景:
缺少性别:Body:{"birthDate":"1990-01-01T12:00:00Z"}
预期:400，{"code":400，"message":"性别必须为0(女)或1(男)"，"data": nu11}
未授权:无 Header
预期:401，{"code":401，"message":"未授权，请登录"，"data":nu11}
#### 获取用户的八字分析记录列表
- **GET** `/api/bazi/records`
-正常场景:
- 请求：GET http://localhost:3000/api/bazi/records
  - Header: Authorization: Bearer <token>
  - 预期：200, {"code": 200, "message": "获取八字记录列表成功", "data": [...]}
- 错误场景：
  - 未授权：无 Header
    - 预期：401, {"code": 401, "message": "未授权，请登录", "data": null}
  - 元记录：新用户
    - 预期：200, {"code": 200, "message": "获取八字记录列表成功", "data": []}
#### 创建八字记录，存储到数据库中
- **POST** `/api/bazi/records`
- 正常版：
  - 请求：POST http://localhost:3000/api/bazi/records
  - Header: Authorization: Bearer <token>
  - Body: {"birthDate": "1995-05-15T08:00:00Z", "dayMaster": "乙", "elements": {"金": 1, "木": 2, "水": 1, "火": 0, "土": 1}, "conflicts": {"金": 0, "木": 1, "水": 0, "火": 0, "土": 0}, "aiComment": "顺应记录"}
  - 预期：200, {"code": 200, "message": "添加八字记录成功", "data": {"analysisID": "<id>"}}

- 错误版：
  - 缺少字段：Body 去掉 aiComment
    - 预期：400, {"code": 400, "message": "AI评述必填", "data": null}
  - 元素格式：Body 中 elements 改为字符串 "invalid"
    - 预期：400, {"code": 400, "message": "elements 必须为对象", "data": null}


GET/:默认路由，通常用于测试服务器是否正常运行。

POsT /bazi-simulate
执行八字模拟分析，生成分析结果







<!-- #### 获取诊断详情
- **GET** `POST /api/bazi/diagnose`

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
``` --> -->

常见HTTP状态码：
- 200: 请求成功
- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误
