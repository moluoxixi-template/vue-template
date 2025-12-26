/**
 * 通用类型定义
 * API 响应通用类型
 */

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 通用响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 列表响应 */
export interface ListResponse<T> extends ApiResponse<PaginationResponse<T>> {}

