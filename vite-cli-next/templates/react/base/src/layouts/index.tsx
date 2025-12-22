/**
 * 布局组件
 * 根据系统配置动态加载不同的布局
 */

import type { LayoutProps } from './types'

function Layout({ children }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: '#fff', padding: '16px' }}>
        {/* 导航栏 */}
      </header>
      <main style={{ padding: '24px' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
