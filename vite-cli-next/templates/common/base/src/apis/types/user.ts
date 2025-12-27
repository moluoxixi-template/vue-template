/**
 * 用户类型定义
 */

/** 用户信息 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
}

/** 登录参数 */
export interface LoginParams {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

