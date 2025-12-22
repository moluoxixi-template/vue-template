/**
 * 路由定义（手动路由模式）
 */

import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const Home = lazy(() => import('@/pages/home'))
const About = lazy(() => import('@/pages/about'))

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: 'about',
    element: <About />,
  },
]
