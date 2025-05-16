<template>
  <div class="home-view">
    <div class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>
    
    <div class="sun"></div>
    
    <div class="home-content">
      <div class="logo-container">
        <h1 class="logo">一一学字母</h1>
      </div>
      
      <div class="character-container" v-if="playerName">
        <div class="character">
          <img src="/src/assets/images/normal.png" alt="小狗头像" class="avatar">
        </div>
        <div class="welcome">你好，{{ playerName }}!</div>
      </div>
      
      <div class="player-form" v-if="!playerName">
        <div class="form-title">告诉我你的名字</div>
        
        <input 
          type="text" 
          v-model="nameInput" 
          placeholder="请输入名字" 
          class="name-input"
          maxlength="10"
        >
        
        <div class="form-buttons">
          <button 
            class="btn" 
            :disabled="!nameInput.trim()"
            @click="savePlayer"
          >
            开始冒险
          </button>
          
          <button 
            v-if="previousName"
            class="btn btn-secondary" 
            @click="returnToPlayer"
          >
            返回
          </button>
        </div>
        
        <!-- 历史玩家列表 -->
        <div class="player-history" v-if="playerHistory.length > 0">
          <div class="history-title">选择历史玩家：</div>
          <div class="history-list">
            <button 
              v-for="(name, index) in playerHistory" 
              :key="index" 
              class="history-item"
              @click="selectHistoryPlayer(name)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="menu-buttons" v-else>
        <button class="btn" @click="startGame">
          <span class="btn-icon">🎮</span>
          开始游戏
        </button>
        
        <button class="btn btn-secondary" @click="goToSettings">
          <span class="btn-icon">⚙️</span>
          游戏设置
        </button>
        
        <button class="btn btn-accent" @click="changePlayer">
          <span class="btn-icon">👤</span>
          切换玩家
        </button>
      </div>
      
      <div class="grass"></div>
      
      <div class="flowers">
        <div class="flower flower-1"></div>
        <div class="flower flower-2"></div>
        <div class="flower flower-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

// 玩家信息
const nameInput = ref('')
const playerName = computed(() => gameStore.playerName)
const previousName = ref('') // 保存之前的玩家名称
const playerHistory = computed(() => gameStore.playerHistory)

onMounted(() => {
  // 初始化游戏配置
  gameStore.initConfig()
  
  // 如果已有玩家名字，则设置表单默认值
  if (playerName.value) {
    nameInput.value = playerName.value
  }
  
  // 播放点击音效（静音）
  try {
    const audio = new Audio()
    audio.volume = 0
    audio.play().catch(() => {}) // 初始化音频上下文
  } catch (e) {
    console.error('音频初始化错误:', e)
  }
})

// 保存玩家信息
function savePlayer() {
  if (nameInput.value.trim()) {
    try {
      const audio = new Audio()
      audio.play().catch(err => console.log('音效播放错误', err))
    } catch (e) {
      console.error('音效播放错误:', e)
    }
    
    // 保存玩家信息，不使用头像
    gameStore.savePlayerInfo(nameInput.value.trim(), '')
  }
}

// 选择历史玩家
function selectHistoryPlayer(name) {
  try {
    const audio = new Audio()
    audio.play().catch(err => console.log('音效播放错误', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
  
  nameInput.value = name
  gameStore.savePlayerInfo(name, '')
}

// 开始游戏
function startGame() {
  try {
    const audio = new Audio()
    audio.play().catch(err => console.log('音效播放错误', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
  router.push('/game')
}

// 前往设置页面
function goToSettings() {
  try {
    const audio = new Audio()
    audio.play().catch(err => console.log('音效播放错误', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
  router.push('/settings')
}

// 切换玩家
function changePlayer() {
  try {
    const audio = new Audio()
    audio.play().catch(err => console.log('音效播放错误', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
  // 保存当前玩家名称
  previousName.value = gameStore.playerName
  // 清空玩家信息
  gameStore.savePlayerInfo('', '')
  nameInput.value = ''
}

// 返回之前的玩家
function returnToPlayer() {
  try {
    const audio = new Audio()
    audio.play().catch(err => console.log('音效播放错误', err))
  } catch (e) {
    console.error('音效播放错误:', e)
  }
  
  if (previousName.value) {
    gameStore.savePlayerInfo(previousName.value, '')
    previousName.value = ''
  }
}
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #64B5F6, #90CAF9);
  position: relative;
  overflow: hidden;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 2;
}

/* Logo */
.logo-container {
  margin-bottom: 30px;
}

.logo {
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 3px 3px 0 rgba(255,255,255,0.7), -3px -3px 0 rgba(0,0,0,0.1);
  transform: rotate(-3deg);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: rotate(-3deg) translateY(0); }
  50% { transform: rotate(-3deg) translateY(-10px); }
}

/* 角色区域 */
.character-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.character {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  position: relative;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

.welcome {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-color);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

/* 玩家表单 */
.player-form {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
  border: 5px solid var(--accent-color);
  position: relative;
}

.player-form:before {
  content: '';
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  background: var(--primary-color);
  border-radius: var(--border-radius-lg);
  z-index: -1;
  transform: rotate(-2deg);
}

.form-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: bold;
}

.name-input {
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
  border: 3px solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  margin-bottom: 20px;
  outline: none;
  transition: border 0.3s;
  font-family: 'Baloo 2', cursive;
}

.name-input:focus {
  border-color: var(--accent-color);
}

/* 表单按钮组 */
.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

/* 玩家历史记录 */
.player-history {
  margin-top: 20px;
  border-top: 2px dashed var(--secondary-color);
  padding-top: 15px;
}

.history-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-color);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item {
  padding: 8px 12px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.history-item:hover {
  background-color: var(--primary-color);
  transform: translateY(-2px);
}

/* 菜单按钮 */
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  position: relative;
  z-index: 3;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.5rem;
  padding: 15px 20px;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
  position: relative;
}

.btn-icon {
  font-size: 1.8rem;
}

/* 装饰元素 */
.sun {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #FFEB3B 30%, rgba(255, 235, 59, 0) 70%);
  border-radius: 50%;
  animation: sunshine 10s infinite linear;
}

@keyframes sunshine {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 80px;
  left: 10%;
  animation: cloud-move-1 40s linear infinite;
}

.cloud-2 {
  width: 150px;
  height: 50px;
  top: 150px;
  left: -200px;
  animation: cloud-move-2 60s linear infinite;
}

.cloud-3 {
  width: 80px;
  height: 30px;
  top: 50px;
  left: 70%;
  animation: cloud-move-3 50s linear infinite;
}

.cloud:before,
.cloud:after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud-1:before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
}

.cloud-1:after {
  width: 70px;
  height: 70px;
  top: -25px;
  left: 45px;
}

.cloud-2:before {
  width: 90px;
  height: 90px;
  top: -40px;
  left: 25px;
}

.cloud-2:after {
  width: 100px;
  height: 100px;
  top: -30px;
  left: 60px;
}

.cloud-3:before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud-3:after {
  width: 60px;
  height: 60px;
  top: -20px;
  left: 35px;
}

@keyframes cloud-move-1 {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes cloud-move-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes cloud-move-3 {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #81C784;
  z-index: 1;
}

.flowers {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  z-index: 2;
  display: flex;
  justify-content: space-around;
}

.flower {
  width: 30px;
  height: 60px;
  background-color: #4CAF50;
  position: relative;
}

.flower:before {
  content: '';
  position: absolute;
  top: -20px;
  left: -10px;
  width: 50px;
  height: 20px;
  background-color: var(--primary-color);
  border-radius: 50%;
  animation: flower-sway 3s ease-in-out infinite alternate;
}

.flower-1:before { background-color: #FF6B6B; }
.flower-2:before { background-color: #FFEB3B; }
.flower-3:before { background-color: #E040FB; }

@keyframes flower-sway {
  0% { transform: rotate(-10deg); }
  100% { transform: rotate(10deg); }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .logo {
    font-size: 3rem;
  }
  
  .player-form {
    max-width: 90%;
  }
  
  .menu-buttons {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 2.5rem;
  }
  
  .welcome {
    font-size: 1.5rem;
  }
  
  .btn {
    font-size: 1.3rem;
    padding: 12px 16px;
  }
  
  .history-item {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
}
</style> 