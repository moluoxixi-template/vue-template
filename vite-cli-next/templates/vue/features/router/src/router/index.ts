import type { App } from 'vue'
import type { RouteRecordRaw, Router, RouterHistory } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { routes } from './routes'

interface RouterConfig {
  historyMode?: 'hash' | 'history'
  qiankunName?: string
}

function getRouter(config: RouterConfig): Router {
  const { historyMode = 'history', qiankunName } = config

  let history: RouterHistory
  if (historyMode === 'hash') {
    history = qiankunName
      ? createWebHashHistory(`/${qiankunName}/`)
      : createWebHashHistory()
  }
  else {
    history = qiankunName
      ? createWebHistory(`/${qiankunName}/`)
      : createWebHistory()
  }

  const router = createRouter({
    history,
    routes: routes as RouteRecordRaw[],
  })

  return router
}

export default getRouter

export function setupRouter(app: App, config: RouterConfig = {}): Router {
  const router = getRouter(config)
  app.use(router)
  return router
}

