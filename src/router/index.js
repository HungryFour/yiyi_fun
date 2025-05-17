import { createRouter, createWebHistory } from 'vue-router'

// 全局音频管理函数
const stopAllAudio = () => {
  // 停止语音合成
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  
  // 获取所有音频元素并停止它们
  try {
    // 使用setTimeout延迟执行暂停操作，避免与潜在的播放操作冲突
    setTimeout(() => {
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {
          // 忽略可能的错误
        }
      });
    }, 5);
  } catch (e) {
    console.error('停止音频失败:', e);
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/HomeView.vue')
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../views/game/GameView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫 - 确保在切换页面时停止所有音频并处理全屏
router.beforeEach((to, from, next) => {
  // 调用全局音频停止函数
  stopAllAudio();
  
  // 如果从游戏页面返回首页，退出全屏
  if (from.name === 'game' && to.name === 'home') {
    exitFullscreen();
  }
  
  // 继续导航
  next()
})

// 退出全屏函数
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

export default router 