<template>
  <div class="settings-view">
    <div class="settings-container">
      <div class="header">
        <h1 class="title">游戏设置</h1>
        <button class="back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          返回
        </button>
      </div>

      <div class="settings-form">
        <div class="form-group">
          <label class="setting-label">难度级别</label>
          <div class="difficulty-buttons">
            <button 
              v-for="level in difficultyLevels" 
              :key="level.name"
              :class="['difficulty-btn', { active: settings.distractorCount === level.distractors && settings.caseSensitive === level.caseSensitive }]"
              @click="setDifficulty(level)"
            >
              {{ level.name }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="setting-label">倒计时时间：{{ settings.countdownTime / 1000 }}秒</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="settings.countdownTime" 
              min="3000" 
              max="20000" 
              step="1000" 
              class="slider"
            >
            <div class="slider-values">
              <span>3秒</span>
              <span>20秒</span>
            </div>
          </div>
        </div>
        
        <div class="form-group checkbox-group">
          <div class="checkbox-container">
            <input 
              type="checkbox" 
              id="showTargetHint" 
              v-model="settings.showTargetHint"
            >
            <label for="showTargetHint">显示目标字母提示</label>
          </div>
        </div>
        
        <div class="form-group">
          <label class="setting-label">胜利所需分数：{{ settings.winScore }}</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="settings.winScore" 
              min="5" 
              max="20" 
              step="1" 
              class="slider"
            >
            <div class="slider-values">
              <span>5分</span>
              <span>20分</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="setting-label">失败错误次数：{{ settings.loseScore }}</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="settings.loseScore" 
              min="3" 
              max="10" 
              step="1" 
              class="slider"
            >
            <div class="slider-values">
              <span>3次</span>
              <span>10次</span>
            </div>
          </div>
        </div>
        
        <button class="btn save-btn" @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

// 难度级别
const difficultyLevels = gameStore.getConfig().gameplay.difficultyLevels;

// 响应式复制设置对象，避免直接修改store中的值
const settings = reactive({
  distractorCount: gameStore.settings.distractorCount,
  caseSensitive: gameStore.settings.caseSensitive,
  countdownTime: gameStore.settings.countdownTime,
  showTargetHint: gameStore.settings.showTargetHint,
  winScore: gameStore.settings.winScore,
  loseScore: gameStore.settings.loseScore
});

onMounted(() => {
  // 确保配置已初始化
  gameStore.initGameConfig();
});

// 设置难度
const setDifficulty = (level) => {
  settings.distractorCount = level.distractors;
  settings.caseSensitive = level.caseSensitive;
};

// 保存设置
const saveSettings = () => {
  // 更新store中的设置
  Object.assign(gameStore.settings, settings);
  
  // 保存到本地存储
  gameStore.saveGameSettings();
  
  // 提示保存成功
  alert('设置已保存！');
  
  // 返回上一页
  goBack();
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.settings-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #fff3e0, #ffe0b2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.settings-container {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 600px;
  animation: fade-in 0.4s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: rgba(255, 138, 101, 0.1);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.setting-label {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--text-color);
  font-weight: 600;
}

.difficulty-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.difficulty-btn {
  background-color: #e0e0e0;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-btn:hover {
  background-color: #d0d0d0;
}

.difficulty-btn.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 138, 101, 0.4);
}

.slider-container {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  outline: none;
  border-radius: 5px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: var(--primary-color);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.slider-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.checkbox-group {
  margin: 15px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-container input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-container label {
  font-size: 1.1rem;
  color: var(--text-color);
  cursor: pointer;
}

.save-btn {
  margin-top: 20px;
  background-color: var(--success-color);
  border: none;
  color: white;
  padding: 15px 0;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.save-btn:hover {
  background-color: #66bb6a;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.save-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 