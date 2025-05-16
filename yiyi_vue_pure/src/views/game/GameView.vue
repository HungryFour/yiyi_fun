<template>
  <div class="game-view">
    <!-- 游戏背景 -->
    <div class="game-background">
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
      </div>
      <div class="sun"></div>
      <div class="grass"></div>
    </div>
    
    <!-- 游戏头部信息栏 -->
    <div class="game-header">
      <div class="left-section">
        <!-- 小狗角色 -->
        <dog-character
          :name="gameStore.playerName"
          :mood="dogMood"
          :speech-text="speechText"
        />
      </div>
      
      <div class="center-section">
        <div class="target-letter-container" v-if="gameStore.gameState.targetLetter">
          <div class="target-letter-label">请点击:</div>
          <div class="target-letter">{{ gameStore.gameState.targetLetter }}</div>
          <button class="speak-button" @click="speakTargetLetter">
            🔊
          </button>
        </div>
        
        <div v-if="gameStore.gameState.encouragement" class="encouragement">
          {{ gameStore.gameState.encouragement }}
        </div>
      </div>
      
      <div class="right-section">
        <div class="score-container">
          <div class="score-item">
            <span class="score-label">得分：</span>
            <span class="score-value">{{ gameStore.gameState.score }}</span>
          </div>
          <div class="score-item">
            <span class="score-label">错误：</span>
            <span class="score-value error">{{ gameStore.gameState.errors }}</span>
          </div>
        </div>
        
        <!-- 倒计时条 -->
        <countdown-bar
          :current-time="gameStore.gameState.countdownTime"
          :max-time="gameStore.gameState.maxCountdownTime"
        />
        
        <button class="pause-button" @click="togglePause">
          {{ gameStore.gameState.isPaused ? '继续' : '暂停' }}
        </button>
      </div>
    </div>
    
    <!-- 游戏区域 -->
    <div class="game-area">
      <!-- 字母饼干 -->
      <letter-biscuit
        v-for="letter in gameStore.gameState.letters"
        :key="letter.id"
        :letter="letter.value"
        :is-target="letter.isTarget"
        :show-hint="gameStore.settings.showTargetHint"
        :pos-x="letter.x"
        :pos-y="letter.y"
        @click="handleLetterClick(letter)"
      />
    </div>
    
    <!-- 游戏开始提示 -->
    <div class="game-start-overlay" v-if="!gameStarted">
      <div class="start-panel">
        <h2>准备好了吗?</h2>
        <p>点击下面的按钮开始游戏!</p>
        <button class="btn start-button" @click="startGame">开始游戏</button>
      </div>
    </div>
    
    <!-- 游戏暂停遮罩 -->
    <div class="game-pause-overlay" v-if="gameStore.gameState.isPaused && gameStarted">
      <div class="pause-panel">
        <h2>游戏暂停</h2>
        <div class="pause-buttons">
          <button class="btn" @click="togglePause">继续游戏</button>
          <button class="btn btn-secondary" @click="exitGame">退出游戏</button>
        </div>
      </div>
    </div>
    
    <!-- 游戏胜利弹窗 -->
    <div class="game-result-overlay" v-if="showWinPanel">
      <div class="result-panel win">
        <div class="result-icon">🏆</div>
        <h2>恭喜你赢了!</h2>
        <p>{{ gameStore.playerName ? `${gameStore.playerName}，` : '' }}你真棒!</p>
        <p>得分: {{ gameStore.gameState.score }}</p>
        <div class="result-buttons">
          <button class="btn" @click="restartGame">再玩一次</button>
          <button class="btn btn-secondary" @click="exitGame">返回主菜单</button>
        </div>
      </div>
    </div>
    
    <!-- 游戏失败弹窗 -->
    <div class="game-result-overlay" v-if="showLosePanel">
      <div class="result-panel lose">
        <div class="result-icon">😢</div>
        <h2>游戏结束</h2>
        <p>别灰心，再试一次吧!</p>
        <p>得分: {{ gameStore.gameState.score }}</p>
        <div class="result-buttons">
          <button class="btn" @click="restartGame">再玩一次</button>
          <button class="btn btn-secondary" @click="exitGame">返回主菜单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'
import LetterBiscuit from '../../components/game/LetterBiscuit.vue'
import DogCharacter from '../../components/game/DogCharacter.vue'
import CountdownBar from '../../components/ui/CountdownBar.vue'

const router = useRouter()
const gameStore = useGameStore()

// 游戏状态
const gameStarted = ref(false)
const showWinPanel = ref(false)
const showLosePanel = ref(false)
const dogMood = ref('neutral')
const speechText = ref('')
const lastFrameTime = ref(0)

// 计算属性
const isWin = computed(() => gameStore.isWin)
const isGameOver = computed(() => gameStore.isGameOver)

// 生命周期钩子
onMounted(() => {
  // 初始化游戏配置
  gameStore.initConfig()
  
  // 启动游戏循环
  requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  // 清理
  cancelAnimationFrame(gameLoopId)
})

// 游戏循环
let gameLoopId
function gameLoop(timestamp) {
  // 计算时间增量（毫秒）
  const deltaTime = timestamp - lastFrameTime.value
  lastFrameTime.value = timestamp
  
  // 更新倒计时
  if (gameStarted.value && !gameStore.gameState.isPaused) {
    gameStore.updateCountdown(deltaTime)
  }
  
  // 检查游戏状态
  checkGameStatus()
  
  // 继续游戏循环
  gameLoopId = requestAnimationFrame(gameLoop)
}

// 检查游戏状态
function checkGameStatus() {
  if (isWin.value && !showWinPanel.value) {
    showGameWin()
  } else if (isGameOver.value && !showLosePanel.value) {
    showGameOver()
  }
}

// 开始游戏
function startGame() {
  playSound('click')
  
  // 重置游戏状态
  gameStore.resetGameState()
  
  // 开始游戏
  gameStarted.value = true
  showWinPanel.value = false
  showLosePanel.value = false
  
  // 开始第一轮
  gameStore.startNewRound()
  
  // 设置初始语音
  if (gameStore.playerName) {
    setSpeechText(`${gameStore.playerName}，准备好了吗？`)
  } else {
    setSpeechText('准备好了吗？')
  }
  
  // 自动朗读首个字母
  setTimeout(() => {
    speakTargetLetter()
  }, 1000)
}

// 重新开始游戏
function restartGame() {
  playSound('click')
  startGame()
}

// 暂停/继续游戏
function togglePause() {
  playSound('click')
  
  if (gameStore.gameState.isPaused) {
    gameStore.resumeGame()
  } else {
    gameStore.pauseGame()
  }
}

// 退出游戏
function exitGame() {
  playSound('click')
  router.push('/')
}

// 处理字母点击
function handleLetterClick(letter) {
  if (!gameStarted.value || gameStore.gameState.isPaused) return
  
  // 检查是否正确
  const isCorrect = gameStore.settings.caseSensitive
    ? letter.value === gameStore.gameState.targetLetter
    : letter.value.toLowerCase() === gameStore.gameState.targetLetter.toLowerCase()
  
  if (isCorrect) {
    // 正确答案处理
    dogMood.value = 'happy'
    
    // 投喂动画
    feedLetter(letter)
    
    // 检查字母
    gameStore.checkLetter(letter)
  } else {
    // 错误答案处理
    dogMood.value = 'sad'
    
    // 检查字母
    gameStore.checkLetter(letter)
  }
  
  // 3秒后重置表情
  setTimeout(() => {
    dogMood.value = 'neutral'
  }, 3000)
}

// 投喂动画
function feedLetter(letter) {
  // 这里使用动画库实现投喂动画
  // 简化起见，这里不实现完整动画，在实际项目中可以使用GSAP
}

// 朗读目标字母
function speakTargetLetter() {
  if (gameStore.gameState.targetLetter) {
    gameStore.speakLetter(gameStore.gameState.targetLetter)
  }
}

// 设置语音文字
function setSpeechText(text) {
  speechText.value = text
  
  // 3秒后自动清除
  setTimeout(() => {
    speechText.value = ''
  }, 3000)
}

// 显示游戏胜利
function showGameWin() {
  showWinPanel.value = true
  gameStore.gameState.isPlaying = false
  dogMood.value = 'happy'
  playSound('win')
}

// 显示游戏结束
function showGameOver() {
  showLosePanel.value = true
  gameStore.gameState.isPlaying = false
  dogMood.value = 'sad'
  playSound('lose')
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
.game-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 游戏背景 */
.game-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #64B5F6, #90CAF9);
  overflow: hidden;
  z-index: 0;
}

.sun {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #FFEB3B 30%, rgba(255, 235, 59, 0) 70%);
  border-radius: 50%;
  animation: sunshine 10s infinite linear;
}

.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

.cloud-1 {
  width: 150px;
  height: 50px;
  top: 80px;
  left: 10%;
  animation: cloud-move-1 90s linear infinite;
}

.cloud-2 {
  width: 200px;
  height: 60px;
  top: 150px;
  left: 60%;
  animation: cloud-move-2 110s linear infinite;
}

.cloud:before,
.cloud:after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud-1:before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 20px;
}

.cloud-1:after {
  width: 100px;
  height: 100px;
  top: -30px;
  left: 60px;
}

.cloud-2:before {
  width: 120px;
  height: 120px;
  top: -50px;
  left: 30px;
}

.cloud-2:after {
  width: 140px;
  height: 140px;
  top: -40px;
  left: 90px;
}

.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #81C784;
}

/* 游戏头部信息栏 */
.game-header {
  position: relative;
  width: 100%;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.left-section {
  display: flex;
  align-items: center;
  width: 180px;
}

.center-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 250px;
}

/* 目标字母显示 */
.target-letter-container {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.target-letter-label {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-right: 15px;
}

.target-letter {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  animation: pulse 2s infinite;
}

.speak-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0 0 0 15px;
  opacity: 0.7;
  transition: all 0.2s;
}

.speak-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.encouragement {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--success-color);
  animation: pop-in 0.5s;
  text-shadow: 1px 1px 0 white;
}

/* 得分区域 */
.score-container {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
}

.score-item {
  display: flex;
  align-items: center;
}

.score-label {
  font-size: 1rem;
  color: var(--text-color);
}

.score-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--success-color);
  min-width: 30px;
  text-align: center;
}

.score-value.error {
  color: var(--error-color);
}

/* 暂停按钮 */
.pause-button {
  background-color: var(--accent-color);
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 8px 15px;
  color: var(--text-color);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.pause-button:hover {
  background-color: var(--warning-color);
  transform: translateY(-2px);
}

/* 游戏区域 */
.game-area {
  position: relative;
  width: 100%;
  height: calc(100% - 120px);
  overflow: hidden;
  z-index: 1;
}

/* 游戏开始遮罩 */
.game-start-overlay {
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

.start-panel {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 30px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  animation: drop-in 0.5s;
}

.start-panel h2 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.start-panel p {
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: var(--text-color);
}

.start-button {
  font-size: 1.5rem;
  padding: 15px 30px;
}

/* 游戏暂停遮罩 */
.game-pause-overlay {
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

.pause-panel {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 30px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  animation: drop-in 0.5s;
}

.pause-panel h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 25px;
}

.pause-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 游戏结果遮罩 */
.game-result-overlay {
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

.result-panel {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 40px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  animation: zoom-in 0.5s;
}

.result-panel.win {
  border: 8px solid var(--success-color);
}

.result-panel.lose {
  border: 8px solid var(--error-color);
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.result-panel h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.result-panel p {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.result-panel p:last-of-type {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.result-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 动画 */
@keyframes sunshine {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes cloud-move-1 {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes cloud-move-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-100vw - 200px)); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes drop-in {
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes zoom-in {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style> 