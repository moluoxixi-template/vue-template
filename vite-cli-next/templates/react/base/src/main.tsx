/**
 * 应用入口文件
 * 初始化 React 应用并挂载到 DOM
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// 导入样式文件
import '@/assets/styles/main.scss'
import '@/assets/fonts/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
