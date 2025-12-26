/**
 * 用户服务
 * 用户相关 API
 */

import type { ApiResponse, LoginParams, LoginResponse, UserInfo } from '../types';
import request from '../request';

/** 用户登录 */
export function login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
  return request.post('/auth/login', params);
}

/** 获取用户信息 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return request.get('/user/info');
}

/** 用户登出 */
export function logout(): Promise<ApiResponse<null>> {
  return request.post('/auth/logout');
}

