/**
 * 根组件
 * 作为应用的入口组件，使用文件系统路由
 */

import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import Layout from '@/layouts'
import { routes } from './router'

function App() {
  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>
        {useRoutes(routes)}
      </Suspense>
    </Layout>
  )
}

export default App
