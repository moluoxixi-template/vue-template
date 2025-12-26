/**
 * 示例服务
 * 示例 API 接口
 */

import type { ApiResponse, ListResponse, PaginationParams } from '../types';
import request from '../request';

/** 示例数据类型 */
export interface ExampleItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

/** 获取示例列表 */
export function getExampleList(params: PaginationParams): Promise<ListResponse<ExampleItem>> {
  return request.get('/example/list', { params });
}

/** 获取示例详情 */
export function getExampleDetail(id: string): Promise<ApiResponse<ExampleItem>> {
  return request.get(`/example/${id}`);
}

/** 创建示例 */
export function createExample(data: Omit<ExampleItem, 'id' | 'createdAt'>): Promise<ApiResponse<ExampleItem>> {
  return request.post('/example', data);
}

/** 更新示例 */
export function updateExample(id: string, data: Partial<ExampleItem>): Promise<ApiResponse<ExampleItem>> {
  return request.put(`/example/${id}`, data);
}

/** 删除示例 */
export function deleteExample(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/example/${id}`);
}

