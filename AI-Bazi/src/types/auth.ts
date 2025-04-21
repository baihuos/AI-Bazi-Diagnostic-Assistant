// 用户信息
export interface UserInfo {
    id: number
    username: string
  }
  
  // 用户名密码登录参数
  export interface PasswordLoginParams {
    username: string
    password: string
  }
  
  // 手机号登录参数
  export interface SmsLoginParams {
    phone: string
    code: string
  }
  
  // 注册参数
  export interface RegisterParams {
    username: string
    password: string
  }
  
  // 发送验证码参数
  export interface SmsCodeParams {
    phone: string
  }
  
  // 登录响应数据
  export interface LoginResult {
    token: string
    userInfo: UserInfo
  }

  export interface CodeReasult {
   yzmcode:string 
  }