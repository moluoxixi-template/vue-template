/**
 * 路由配置（手动路由模式）
 */

import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layouts'
import { routes } from './routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes,
  },
])
