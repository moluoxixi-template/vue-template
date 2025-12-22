/**
 * 路由配置（文件系统路由模式）
 * 使用 vite-plugin-pages 自动生成路由
 */

import { cloneDeep } from 'lodash-es'
import { assign, isEmpty } from 'radash'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

/**
 * 路由配置
 */
const Routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('./layout.vue'),
    children: routes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

/**
 * 获取路由实例
 * @param props qiankun props（可选）
 * @returns 路由实例
 */
function getRouter(props: { data?: { activeRule?: string } } = {}) {
  let base: string
  const routes = cloneDeep(Routes)

  // qiankun 微前端模式
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    const { activeRule } = props.data
    base = activeRule
  }
  else {
    base = import.meta.env.VITE_APP_CODE || ''
  }

  const router = createRouter({
    history: createWebHistory(base),
    routes,
  })

  // 路由守卫
  router.beforeEach((_, from, next) => {
    if (isEmpty(history.state.current)) {
      assign(history.state, { current: from.fullPath })
    }
    next()
  })

  return router
}

export default getRouter
