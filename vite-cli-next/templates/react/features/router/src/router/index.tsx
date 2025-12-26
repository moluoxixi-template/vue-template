import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { routes } from './routes'

interface RouterConfig {
  historyMode?: 'hash' | 'history'
  basename?: string
}

export function createRouter(config: RouterConfig = {}) {
  const { historyMode = 'history', basename } = config

  if (historyMode === 'hash') {
    return createHashRouter(routes, { basename })
  }

  return createBrowserRouter(routes, { basename })
}

export { routes }

