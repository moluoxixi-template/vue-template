/**
 * 布局组件
 * 根据系统配置动态加载不同的布局
 */

import type { LayoutProps } from './types'
import { Layout as AntLayout } from 'antd'

const { Header, Content } = AntLayout

function Layout({ children }: LayoutProps) {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        {/* 导航栏 */}
      </Header>
      <Content style={{ padding: '24px' }}>
        {children}
      </Content>
    </AntLayout>
  )
}

export default Layout
