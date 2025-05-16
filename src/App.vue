<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 横屏提示 -->
    <div class="rotate-device">
      <div class="rotate-icon">↻</div>
      <div class="rotate-text">请旋转设备至横屏模式</div>
      <div class="rotate-desc">获得更好的游戏体验</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()

onMounted(() => {
  // 初始化游戏配置
  gameStore.initConfig()
  
  // 预加载音效
  preloadSounds()
})

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

.rotate-device {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rotate-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: rotate 2s infinite linear;
}

.rotate-text {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.rotate-desc {
  font-size: 1.3rem;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 