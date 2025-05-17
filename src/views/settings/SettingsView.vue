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
          <h2 class="setting-title">游戏难度</h2>
          
          <!-- 字母顺序设置 -->
          <div class="setting-section">
            <h3 class="subsetting-title">字母顺序</h3>
            <label class="toggle-container">
              <input 
                type="checkbox" 
                v-model="settings.useAlphabeticalOrder"
                class="toggle-input"
              />
              <div class="toggle-slider"></div>
              <span class="toggle-label">按字母顺序显示</span>
            </label>
            <p class="setting-description">开启后，字母将按顺序出现，而不是随机出现</p>
          </div>
          
          <!-- 大小写设置 -->
          <div class="setting-section">
            <h3 class="subsetting-title">大小写设置</h3>
            <label class="toggle-container">
              <input 
                type="checkbox" 
                v-model="settings.caseSensitive"
                class="toggle-input"
              />
              <div class="toggle-slider"></div>
              <span class="toggle-label">区分大小写</span>
            </label>
            <p class="setting-description">开启后，需要准确匹配字母的大小写</p>
          </div>
          
          <!-- 干扰字母数量设置 -->
          <div class="setting-section">
            <h3 class="subsetting-title">干扰字母数量</h3>
            <div class="slider-container">
              <input 
                type="range" 
                v-model.number="settings.distractorCount" 
                min="0" 
                max="16" 
                step="1" 
                class="slider"
              />
              <div class="slider-labels">
                <span>0个</span>
                <span>当前选择：{{ settings.distractorCount }} 个</span>
                <span>16个</span>
              </div>
            </div>
            <p class="setting-description">设置每轮游戏中出现的干扰字母数量</p>
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
              max="120000" 
              step="1000" 
              class="slider"
            />
            <div class="slider-labels">
              <span>3秒</span>
              <span>{{ parseInt(settings.countdownTime ) / 1000 }}秒</span>
              <span>120秒</span>
            </div>
          </div>
        </div>
        
        <!-- 音量设置 -->
        <div class="setting-group">
          <h2 class="setting-title">音量设置</h2>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="settings.volume" 
              min="0" 
              max="1" 
              step="0.01" 
              class="slider"
            />
            <div class="slider-labels">
              <span>静音</span>
              <span>{{ Math.round(settings.volume * 100) }}%</span>
              <span>最大</span>
            </div>
          </div>
          <p class="setting-description">调整游戏音效和语音提示的音量</p>
          <button class="test-sound-button" @click="testVolume">测试音量</button>
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
          
          <div class="setting-section">
            <h3 class="subsetting-title">饼干形状</h3>
            <div class="shape-options">
              <div 
                v-for="shape in shapeOptions" 
                :key="shape.value"
                class="shape-option" 
                :class="{ active: settings.biscuitShape === shape.value }"
                @click="settings.biscuitShape = shape.value"
              >
                <div class="shape-preview" :class="`preview-${shape.value}`"></div>
                <span class="shape-name">{{ shape.label }}</span>
              </div>
            </div>
          </div>
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
  distractorCount: Number(gameStore.settings.distractorCount),
  caseSensitive: gameStore.settings.caseSensitive,
  countdownTime: parseInt(gameStore.settings.countdownTime),
  showTargetHint: gameStore.settings.showTargetHint,
  winScore: gameStore.settings.winScore,
  loseScore: gameStore.settings.loseScore,
  biscuitShape: gameStore.settings.biscuitShape,
  useAlphabeticalOrder: gameStore.settings.useAlphabeticalOrder,
  volume: gameStore.settings.volume
})

// 饼干形状选项
const shapeOptions = [
  { value: 'circle', label: '圆形' },
  { value: 'star', label: '五角星' },
  { value: 'heart', label: '爱心' },
  { value: 'mixed', label: '混合' }
]

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
  if (settings.winScore < 100) {
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
    // 使用当前设置的音量
    audio.volume = settings.volume
    audio.play().catch(err => console.error('无法播放音效', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
}

// 测试音量
function testVolume() {
  playSound('A')
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
  position: relative;
  min-height: 100vh; /* 确保至少占满视口高度 */
  box-sizing: border-box; /* 确保padding不增加元素尺寸 */
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
  margin: 40px auto;
  box-sizing: border-box;
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
  padding-bottom: 20px; /* 内容底部增加间距 */
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

/* 饼干形状设置 */
.setting-section {
  margin-top: 20px;
}

.subsetting-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.shape-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.shape-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  width: 80px;
}

.shape-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.shape-option.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}

.shape-preview {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #FFE0B2;
  border: 3px solid #FFCC80;
}

.preview-star {
  width: 100%;
  height: 100%;
  background-color: #EA9518;
  position: relative;
  /* 使用SVG遮罩 */
  mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.preview-heart {
  width: 100%;
  height: 100%;
  background-color: #EC87C0;
  position: relative;
  transform: scale(0.9);
  /* 使用SVG遮罩 */
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M689.11 121.72c-70.21 0-133.67 28.85-179.2 75.32-45.53-46.48-108.99-75.32-179.2-75.32-138.56 0-250.89 112.32-250.89 250.87 0 286.73 430.08 537.6 430.08 537.6S940 659.33 940 372.6c0-138.55-112.32-250.88-250.89-250.88z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M689.11 121.72c-70.21 0-133.67 28.85-179.2 75.32-45.53-46.48-108.99-75.32-179.2-75.32-138.56 0-250.89 112.32-250.89 250.87 0 286.73 430.08 537.6 430.08 537.6S940 659.33 940 372.6c0-138.55-112.32-250.88-250.89-250.88z'/%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.preview-heart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
}

.preview-mixed {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.preview-mixed::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #FFE0B2;
  border: 2px solid #FFCC80;
}

.preview-mixed::after {
  content: '';
  width: 20px;
  height: 20px;
  background-color: #EA9518;
  mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.shape-name {
  font-size: 0.9rem;
  text-align: center;
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
  background-color: var(--primary-dark);
  transform: translateY(-3px);
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

/* 添加大屏幕适配样式 */
@media (min-height: 900px) {
  .settings-container {
    margin: 80px auto;
    max-height: 85vh;
    overflow-y: auto;
  }
  
  .settings-content {
    gap: 40px; /* 大屏幕下增加各设置组之间的间距 */
  }
  
  .setting-group {
    padding: 25px; /* 大屏幕下增加内边距 */
  }
}

/* 超大屏幕适配 */
@media (min-height: 1200px) {
  .settings-container {
    margin: 100px auto;
    max-width: 900px;
    padding: 40px;
  }
  
  .title {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  
  .setting-group {
    padding: 30px;
  }
  
  .setting-title {
    font-size: 1.8rem;
  }
  
  .save-button {
    padding: 18px;
    font-size: 1.5rem;
    margin-top: 30px;
  }
}

.setting-description {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  margin-bottom: 15px;
}

.setting-section {
  margin-bottom: 25px;
  padding: 15px;
  background-color: white;
  border-radius: var(--border-radius-sm);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.subsetting-title:before {
  content: '•';
  color: var(--primary-color);
  margin-right: 10px;
  font-size: 1.5rem;
}

.test-sound-button {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
  align-self: center;
}

.test-sound-button:hover {
  background-color: var(--secondary-dark);
  transform: translateY(-2px);
}
</style>