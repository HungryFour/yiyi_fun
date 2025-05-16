<template>
  <div class="game-view">
    <div id="game-container" class="game-container"></div>
    
    <!-- 暂停面板 -->
    <div class="pause-panel" v-if="isPaused">
      <div class="pause-content">
        <h2 class="pause-title">游戏暂停</h2>
        
        <div class="pause-buttons">
          <button class="btn resume-btn" @click="resumeGame">继续游戏</button>
          <button class="btn settings-btn" @click="goToSettings">游戏设置</button>
          <button class="btn exit-btn" @click="exitGame">退出游戏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import PhaserGame from '../game/PhaserGame';

const router = useRouter();
const gameStore = useGameStore();

const phaserGame = ref(null);
const isPaused = computed(() => gameStore.gameState.isPaused);

// 监听来自Phaser的暂停/继续事件
const onGamePaused = () => {
  gameStore.gameState.isPaused = true;
};

const onGameResumed = () => {
  gameStore.gameState.isPaused = false;
};

onMounted(() => {
  // 初始化Phaser游戏
  phaserGame.value = new PhaserGame('game-container', gameStore);
  phaserGame.value.init();
  
  // 添加全局事件监听器
  window.addEventListener('game-paused', onGamePaused);
  window.addEventListener('game-resumed', onGameResumed);
});

onBeforeUnmount(() => {
  // 清理Phaser游戏实例
  if (phaserGame.value) {
    phaserGame.value.destroy();
  }
  
  // 移除全局事件监听器
  window.removeEventListener('game-paused', onGamePaused);
  window.removeEventListener('game-resumed', onGameResumed);
});

// 继续游戏
const resumeGame = () => {
  // 发送消息到Phaser场景
  const event = new CustomEvent('resume-game');
  window.dispatchEvent(event);
};

// 前往设置页面
const goToSettings = () => {
  router.push('/settings');
};

// 退出游戏
const exitGame = () => {
  router.push('/');
};
</script>

<style scoped>
.game-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.pause-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.pause-content {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 400px;
  animation: slide-in 0.4s ease-out;
}

@keyframes slide-in {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.pause-title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 30px;
}

.pause-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn {
  font-size: 1.2rem;
  padding: 12px 0;
  width: 100%;
}

.resume-btn {
  background-color: var(--success-color);
}

.settings-btn {
  background-color: var(--secondary-color);
}

.exit-btn {
  background-color: var(--error-color);
}
</style> 