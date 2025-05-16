<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <div class="rotate-device">
      <div>请旋转设备至横屏模式</div>
      <div style="font-size: 48px; margin: 20px;">↻</div>
      <div>获得更好的游戏体验</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';

const gameStore = useGameStore();

onMounted(() => {
  // 初始化游戏配置
  gameStore.initGameConfig();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app {
  width: 100%;
  height: 100%;
}
</style> 