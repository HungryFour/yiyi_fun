<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()

onMounted(() => {
  // 初始化游戏配置
  gameStore.initConfig()
  
  // 预加载音效
  preloadSounds()
  
  // 监听退出全屏事件
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  // 移除全屏事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
})

// 处理全屏状态改变
function handleFullscreenChange() {
  const isFullscreen = document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement ||
                      document.msFullscreenElement
  
  // 如果当前在游戏中且退出了全屏，可以自动重新请求全屏
  if (!isFullscreen && gameStore.gameState.isPlaying && !gameStore.gameState.isPaused) {
    // 可以选择自动重新进入全屏或者暂停游戏
    // 这里选择暂停游戏
    if (gameStore.gameState.isPlaying) {
      gameStore.pauseGame()
    }
  }
}

// 预加载音效
function preloadSounds() {
  const sounds = ['correct', 'wrong', 'click', 'win', 'lose']
  sounds.forEach(sound => {
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.preload = 'auto'
  })
}
</script>

<style>
.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 