/**
 * 路由定义（手动路由模式）
 */

import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: 'about',
    name: 'about',
    component: () => import('@/pages/about/index.vue'),
    meta: {
      title: '关于',
    },
  },
]
