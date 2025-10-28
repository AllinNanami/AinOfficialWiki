// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import CopyrightModal from './components/CopyrightModal.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 在布局底部插入版权声明模态框组件
      'layout-bottom': () => h(CopyrightModal)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 添加液态玻璃效果的鼠标跟随光晕
    if (typeof window !== 'undefined') {
      // 初始化光晕效果
      const initGlassEffect = () => {
        const isHomePage = router.route.path === '/'
        
        if (isHomePage) {
          setTimeout(() => {
            const homeElement = document.querySelector('.VPHome') as HTMLElement
            if (homeElement && !homeElement.querySelector('.glass-spotlight')) {
              // 创建光晕元素
              const spotlight = document.createElement('div')
              spotlight.className = 'glass-spotlight'
              homeElement.appendChild(spotlight)
              
              // 鼠标移动事件
              const handleMouseMove = (e: Event) => {
                const mouseEvent = e as MouseEvent
                spotlight.style.left = mouseEvent.clientX + 'px'
                spotlight.style.top = mouseEvent.clientY + 'px'
                spotlight.style.opacity = '1'
              }
              
              const handleMouseLeave = () => {
                spotlight.style.opacity = '0'
              }
              
              homeElement.addEventListener('mousemove', handleMouseMove as EventListener)
              homeElement.addEventListener('mouseleave', handleMouseLeave as EventListener)
            }
          }, 100)
        }
      }
      
      // 路由变化时重新初始化
      router.onAfterRouteChange = initGlassEffect
      
      // 初次加载
      initGlassEffect()
    }
  }
} satisfies Theme
