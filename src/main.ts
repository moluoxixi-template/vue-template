import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { ElDialog, ElDrawer } from 'element-plus'

import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { createApp } from 'vue'
import directives from '@/directives'
import i18n from '@/locales'
import { store } from '@/stores'
import { useSystemStore } from '@/stores/modules/system'
import { useUserStore } from '@/stores/modules/user'
import { modifyComponents } from '@/utils'
import { initSentry } from '@/utils/sentry'
import App from './App.vue'
import getRouter from './router'

import '@/assets/styles/main.scss'
// 放入main.css中qiankun会使用cssSheet解析，部分css变量会丢失
import '@/assets/styles/element/index.scss'
import 'vxe-table/lib/style.css'
import '@/assets/fonts/index.css'

let app: any

/**
 * @param container 主应用下发的props中的container,也就是子应用的根节点
 * 将子应用appendBody的元素,挂载到子应用根元素身上
 */
function proxy(container: HTMLElement) {
  if ((document.body.appendChild as any).__isProxy__)
    return
  const revocable = Proxy.revocable(document.body.appendChild, {
    apply(target, thisArg, [node]) {
      if (container) {
        container.appendChild(node)
      }
      else {
        target.call(thisArg, node)
      }
    },
  })
  if (revocable.proxy) {
    document.body.appendChild = revocable.proxy
  }
  ;(document.body.appendChild as any).__isProxy__ = true

  const removecable = Proxy.revocable(document.body.removeChild, {
    apply(target, thisArg, [node]) {
      if (container) {
        container.removeChild(node)
      }
      else {
        target.call(thisArg, node)
      }
    },
  })
  if (removecable.proxy) {
    document.body.removeChild = removecable.proxy
  }
  ;(document.body.removeChild as any).__isProxy__ = true
}

function themeManager(props: QiankunProps) {
  const systemStore = useSystemStore()
  try {
    if (props.fn.getTheme) {
      const themeColor = props.fn.getTheme()
      if (themeColor) {
        systemStore.setTheme(themeColor)
      }
    }
    props.onGlobalStateChange((state: any) => {
      // 更换主题
      if (state.action === 'changeTheme') {
        systemStore.setTheme(state.color)
      }
    })
  }
  catch {
  }
}

async function render(props: QiankunProps) {
  const { container } = props
  proxy(container as HTMLElement)
  app = createApp(App)
  // 注册指令
  directives(app)

  // 修改Element的appendToBody默认行为
  modifyComponents(app, [ElDrawer, ElDialog], (attrs) => {
    const appendToBody = (attrs['append-to-body'] ?? false) !== false
    return {
      ...attrs,
      appendTo: appendToBody ? container || '#app' : 'body',
    }
  })

  const userStore = useUserStore()
  try {
    await userStore.userLogin()
  }
  catch (e) {
    console.log(e)
  }

  const router = getRouter(props)

  // 初始化 Sentry（生产环境标准配置）
  initSentry(app, router)

  app.use(store)
  app.use(i18n)
  // 测试主题变更
  // const systemStore = useSystemStore()
  // systemStore.setTheme('red');
  app.use(router)
  app.config.warnHandler = () => null

  if (container) {
    const root = container.querySelector('#app')
    app.mount(root)
  }
  else {
    app.mount('#app')
  }
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({}).then()
}
else {
  renderWithQiankun({
    async mount(props: QiankunProps) {
      await render(props)
      themeManager(props)
    },
    bootstrap() {
    },
    unmount() {
      app?.unmount()
      app = null
    },
    update() {
    },
  })
}
