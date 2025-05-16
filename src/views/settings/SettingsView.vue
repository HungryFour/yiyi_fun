<template>
  <div class="settings-view">
    <div class="settings-container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </button>
        <h1 class="title">游戏设置</h1>
      </div>
      
      <div class="settings-content">
        <!-- 难度设置 -->
        <div class="setting-group">
          <h2 class="setting-title">难度级别</h2>
          <div class="difficulty-buttons">
            <button 
              v-for="level in gameStore.CONFIG.gameplay.difficultyLevels"
              :key="level.name"
              :class="[
                'difficulty-button', 
                { 'active': isDifficultyActive(level) }
              ]"
              @click="setDifficulty(level)"
            >
              {{ level.name }}
            </button>
          </div>
          
          <div class="difficulty-info">
            <div class="info-item">
              <div class="info-icon">🔠</div>
              <div class="info-text">
                <div class="info-label">干扰字母数量:</div>
                <div class="info-value">{{ settings.distractorCount }}</div>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">Aa</div>
              <div class="info-text">
                <div class="info-label">区分大小写:</div>
                <div class="info-value">{{ settings.caseSensitive ? '是' : '否' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 倒计时设置 -->
        <div class="setting-group">
          <h2 class="setting-title">倒计时时间</h2>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="settings.countdownTime" 
              min="3000" 
              max="15000" 
              step="1000" 
              class="slider"
            />
            <div class="slider-labels">
              <span>3秒</span>
              <span>{{ settings.countdownTime / 1000 }}秒</span>
              <span>15秒</span>
            </div>
          </div>
        </div>
        
        <!-- 目标提示设置 -->
        <div class="setting-group">
          <h2 class="setting-title">游戏辅助</h2>
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.showTargetHint"
              class="toggle-input"
            />
            <div class="toggle-slider"></div>
            <span class="toggle-label">显示目标字母提示（底色）</span>
          </label>
        </div>
        
        <!-- 胜负条件设置 -->
        <div class="setting-group">
          <h2 class="setting-title">胜负条件</h2>
          <div class="win-lose-settings">
            <div class="setting-field">
              <label class="setting-label">胜利所需分数:</label>
              <div class="number-input">
                <button class="number-btn" @click="decrementWinScore">-</button>
                <span class="number-value">{{ settings.winScore }}</span>
                <button class="number-btn" @click="incrementWinScore">+</button>
              </div>
            </div>
            
            <div class="setting-field">
              <label class="setting-label">失败错误次数:</label>
              <div class="number-input">
                <button class="number-btn" @click="decrementLoseScore">-</button>
                <span class="number-value">{{ settings.loseScore }}</span>
                <button class="number-btn" @click="incrementLoseScore">+</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 保存设置 -->
        <button class="save-button" @click="saveSettings">
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

// 设置（创建副本避免直接修改store）
const settings = reactive({
  distractorCount: gameStore.settings.distractorCount,
  caseSensitive: gameStore.settings.caseSensitive,
  countdownTime: gameStore.settings.countdownTime,
  showTargetHint: gameStore.settings.showTargetHint,
  winScore: gameStore.settings.winScore,
  loseScore: gameStore.settings.loseScore
})

onMounted(() => {
  // 确保配置已初始化
  gameStore.initConfig()
})

// 检查当前难度是否激活
function isDifficultyActive(level) {
  return settings.distractorCount === level.distractors && 
         settings.caseSensitive === level.caseSensitive
}

// 设置难度
function setDifficulty(level) {
  playSound('click')
  settings.distractorCount = level.distractors
  settings.caseSensitive = level.caseSensitive
}

// 增减胜利分数
function incrementWinScore() {
  playSound('click')
  if (settings.winScore < 20) {
    settings.winScore++
  }
}

function decrementWinScore() {
  playSound('click')
  if (settings.winScore > 3) {
    settings.winScore--
  }
}

// 增减失败次数
function incrementLoseScore() {
  playSound('click')
  if (settings.loseScore < 10) {
    settings.loseScore++
  }
}

function decrementLoseScore() {
  playSound('click')
  if (settings.loseScore > 1) {
    settings.loseScore--
  }
}

// 保存设置
function saveSettings() {
  playSound('click')
  
  // 更新store中的设置
  Object.assign(gameStore.settings, settings)
  
  // 保存到本地存储
  gameStore.saveGameSettings()
  
  // 返回上一页
  goBack()
}

// 返回上一页
function goBack() {
  playSound('click')
  router.push('/')
}

// 播放音效
function playSound(sound) {
  try {
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.play().catch(err => console.error('无法播放音效', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
}
</script>

<style scoped>
.settings-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%);
  padding: 20px;
  overflow-y: auto;
}

.settings-container {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-lg);
  position: relative;
  animation: slide-in 0.5s ease;
  margin: 20px 0;
}

@keyframes slide-in {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.1rem;
  position: absolute;
  left: 0;
  z-index: 2;
}

.back-icon {
  font-size: 1.5rem;
  margin-right: 5px;
}

.back-button:hover {
  transform: translateX(-3px);
}

.title {
  font-size: 2.2rem;
  color: var(--primary-color);
  text-align: center;
  width: 100%;
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 设置组 */
.setting-group {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.setting-title {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  position: relative;
}

.setting-title:before {
  content: '✦';
  color: var(--primary-color);
  margin-right: 10px;
}

/* 难度按钮 */
.difficulty-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.difficulty-button {
  background-color: #E0E0E0;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  flex-grow: 1;
  transition: all 0.3s;
}

.difficulty-button:hover {
  background-color: #D0D0D0;
  transform: translateY(-3px);
}

.difficulty-button.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

/* 难度信息 */
.difficulty-info {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: var(--border-radius-sm);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-width: 180px;
}

.info-icon {
  width: 40px;
  height: 40px;
  background-color: #F5F5F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 1.3rem;
  color: var(--text-color);
}

.info-label {
  font-size: 0.9rem;
  color: #666;
}

.info-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-color);
}

/* 滑块 */
.slider-container {
  width: 100%;
  padding: 0 10px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #E0E0E0;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
}

/* 开关 */
.toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  background-color: #ccc;
  border-radius: 34px;
  margin-right: 15px;
  transition: .4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--success-color);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

.toggle-label {
  font-size: 1.1rem;
}

/* 胜负条件设置 */
.win-lose-settings {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.setting-field {
  flex-grow: 1;
  flex-basis: 200px;
  background-color: white;
  padding: 15px;
  border-radius: var(--border-radius-sm);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.setting-label {
  display: block;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: var(--text-color);
}

.number-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F5F5F5;
  border-radius: var(--border-radius-sm);
  padding: 8px;
}

.number-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.number-btn:hover {
  background-color: var(--primary-color);
  transform: scale(1.1);
}

.number-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
}

/* 保存按钮 */
.save-button {
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 15px;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(107, 203, 119, 0.3);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.save-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.save-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(107, 203, 119, 0.4);
}

.save-button:hover:before {
  transform: translateX(100%);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .settings-view {
    padding: 10px;
    align-items: flex-start;
  }
  
  .settings-container {
    padding: 20px;
    margin: 10px 0;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .back-text {
    display: none;
  }
  
  .back-icon {
    font-size: 1.8rem;
    margin-right: 0;
  }
  
  .setting-title {
    font-size: 1.3rem;
  }
  
  .difficulty-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .difficulty-button {
    padding: 10px;
  }
  
  .difficulty-info {
    flex-direction: column;
    align-items: center;
  }
  
  .info-item {
    width: 100%;
    justify-content: center;
  }
  
  .win-lose-settings {
    flex-direction: column;
    gap: 15px;
  }
  
  .toggle-container {
    flex-wrap: wrap;
  }
  
  .toggle-slider {
    margin-bottom: 10px;
  }
  
  .save-button {
    font-size: 1.2rem;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .settings-container {
    padding: 15px;
  }
  
  .setting-group {
    padding: 15px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .toggle-label {
    font-size: 1rem;
  }
  
  .setting-title:before {
    display: none;
  }
}
</style>