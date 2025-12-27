import Layout from '@/layouts/index'

export const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/about/index.vue'),
        meta: {
          title: '关于',
        },
      },
    ],
  },
]

