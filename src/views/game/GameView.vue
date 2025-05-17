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
          :mood="dogMood"
          :speech-text="speechText"
        />
        <div v-if="gameStore.gameState.encouragement" class="encouragement">
          {{ gameStore.gameState.encouragement }}
        </div>
        <button class="speak-button" @click="speakTargetLetter">
          <svg t="1747404403817" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1530" width="48" height="48"><path d="M393.707231 292.571429L343.13933 487.619048l46.955908 234.779541-97.523809-45.149912-66.82187-108.359788-21.671958-86.687831 66.82187-113.777778z" fill="#C0EAFF" p-id="1531"></path><path d="M451.499118 509.291005a104.747795 61.40388 90 1 0 122.80776 0 104.747795 61.40388 90 1 0-122.80776 0Z" fill="#C0EAFF" p-id="1532"></path><path d="M426.215168 781.996473c-3.611993 0-7.223986-1.805996-10.835979-3.611993l-117.389771-86.687831c-36.119929-23.477954-65.015873-57.791887-83.075838-99.329806-10.835979-25.283951-16.253968-52.373898-16.253968-81.269841s5.417989-55.985891 16.253968-81.269842c16.253968-41.537919 45.149912-74.045855 83.075838-97.523809l110.165785-77.657848c9.029982-5.417989 19.865961-3.611993 25.28395 3.611993 5.417989 9.029982 3.611993 19.865961-3.611993 25.28395L319.661376 361.199295c-32.507937 19.865961-55.985891 48.761905-70.433863 81.269841-9.029982 21.671958-14.447972 45.149912-14.447972 68.627866 0 23.477954 3.611993 45.149912 12.641976 66.821869 14.447972 34.313933 37.925926 63.209877 68.627866 83.075838l117.38977 86.687831c7.223986 5.417989 9.029982 18.059965 3.611993 25.28395 0 5.417989-5.417989 9.029982-10.835978 9.029983z" fill="#1F87DD" p-id="1533"></path><path d="M523.738977 830.758377c-108.359788 0-193.241623-140.867725-193.241623-317.855379S415.379189 193.241623 523.738977 193.241623c25.283951 0 50.567901 7.223986 74.045855 23.477954 9.029982 5.417989 10.835979 16.253968 5.41799 25.28395s-16.253968 10.835979-25.283951 5.41799c-18.059965-10.835979-34.313933-18.059965-54.179894-18.059965-84.881834 0-157.121693 130.031746-157.121693 281.73545S438.857143 794.638448 523.738977 794.638448s157.121693-130.031746 157.121693-281.73545c0-74.045855-16.253968-146.285714-46.955908-198.659612-5.417989-9.029982-1.805996-19.865961 7.223986-25.28395 9.029982-5.417989 19.865961-1.805996 25.28395 7.223986 32.507937 59.597884 50.567901 135.449735 50.567902 216.719576C718.786596 689.890653 633.904762 830.758377 523.738977 830.758377z" fill="#1F87DD" p-id="1534"></path><path d="M523.738977 646.546737c-48.761905 0-86.687831-59.597884-86.687831-133.643739S474.977072 379.259259 523.738977 379.259259s86.687831 59.597884 86.687831 133.643739-37.925926 133.643739-86.687831 133.643739z m0-232.973545c-23.477954 0-50.567901 39.731922-50.567901 97.52381s27.089947 97.52381 50.567901 97.523809 50.567901-39.731922 50.567901-97.523809-27.089947-97.52381-50.567901-97.52381z" fill="#1F87DD" p-id="1535"></path><path d="M523.738977 413.573192h-1.805996l-92.105821-10.835979c-9.029982-1.805996-16.253968-10.835979-16.253968-19.865961 1.805996-9.029982 10.835979-16.253968 19.865961-16.253968l92.105821 10.835979c9.029982 1.805996 16.253968 10.835979 16.253968 19.865961 0 9.029982-9.029982 16.253968-18.059965 16.253968zM372.035273 662.800705c-9.029982 0-16.253968-7.223986-18.059964-16.253968-1.805996-9.029982 5.417989-18.059965 16.253968-19.865961l153.5097-16.253968c9.029982-1.805996 18.059965 5.417989 19.865961 16.253968 1.805996 9.029982-5.417989 18.059965-16.253968 19.865961l-153.5097 16.253968h-1.805997z" fill="#1F87DD" p-id="1536"></path><path d="M763.936508 364.811287c-5.417989 0-9.029982-1.805996-12.641975-5.417989-7.223986-7.223986-7.223986-18.059965 0-25.283951l25.28395-25.28395c7.223986-7.223986 18.059965-7.223986 25.283951 0s7.223986 18.059965 0 25.28395L776.578483 359.393298c-3.611993 3.611993-9.029982 5.417989-12.641975 5.417989zM771.160494 720.592593c-5.417989 0-9.029982-1.805996-12.641975-5.41799l-25.283951-25.28395c-7.223986-7.223986-7.223986-18.059965 0-25.283951s18.059965-7.223986 25.283951 0l25.28395 25.283951c7.223986 7.223986 7.223986 18.059965 0 25.28395-3.611993 3.611993-7.223986 5.417989-12.641975 5.41799zM819.922399 529.156966h-54.179895c-10.835979 0-18.059965-7.223986-18.059964-18.059964s7.223986-18.059965 18.059964-18.059965h54.179895c10.835979 0 18.059965 7.223986 18.059964 18.059965s-9.029982 18.059965-18.059964 18.059964z" fill="#1F87DD" p-id="1537"></path></svg>
        </button>
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
          :max-time="Number(gameStore.gameState.maxCountdownTime)"
        />
        
        <div class="game-controls">
          <button class="control-button pause-button" @click="togglePause">
            {{ gameStore.gameState.isPaused ? '继续' : '暂停' }}
          </button>
          
          <button class="control-button back-button" @click="confirmExit">
            返回
          </button>
        </div>
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
        :shape="letter.shape"
        @click="handleLetterClick(letter)"
      />
    </div>
    
    <!-- 游戏开始提示 -->
    <div class="game-start-overlay" v-if="!gameStarted">
      <div class="start-panel">
        <h2>准备好了吗?</h2>
        <p>点击下面的按钮开始游戏!</p>
        <button class="btn start-button" @click="startGame">开始游戏</button>
        <button class="btn btn-secondary back-button" @click="exitGame">返回主菜单</button>
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
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">得分:</span>
            <span class="stat-value">{{ gameStore.gameState.score }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">游戏时间:</span>
            <span class="stat-value">{{ formattedGameTime }}</span>
          </div>
        </div>
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
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">得分:</span>
            <span class="stat-value">{{ gameStore.gameState.score }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">游戏时间:</span>
            <span class="stat-value">{{ formattedGameTime }}</span>
          </div>
        </div>
        <div class="result-buttons">
          <button class="btn" @click="restartGame">再玩一次</button>
          <button class="btn btn-secondary" @click="exitGame">返回主菜单</button>
        </div>
      </div>
    </div>
    
    <!-- 确认退出弹窗 -->
    <div class="game-result-overlay" v-if="showExitConfirm">
      <div class="result-panel confirm">
        <h2>确定要退出游戏吗?</h2>
        <p>当前游戏进度将不会保存</p>
        <div class="result-buttons">
          <button class="btn" @click="cancelExit">继续游戏</button>
          <button class="btn btn-secondary" @click="exitGame">退出游戏</button>
        </div>
      </div>
    </div>
    
    <!-- 音量警告组件 -->
    <VolumeWarning 
      :show="showVolumeWarning" 
      @close="showVolumeWarning = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'
import LetterBiscuit from '../../components/game/LetterBiscuit.vue'
import DogCharacter from '../../components/game/DogCharacter.vue'
import CountdownBar from '../../components/ui/CountdownBar.vue'
import VolumeWarning from '../../components/ui/VolumeWarning.vue'

// 全局音频管理器 - 跟踪所有活跃的音频实例
const activeAudios = ref([])

const router = useRouter()
const gameStore = useGameStore()

// 游戏状态
const gameStarted = ref(false)
const showWinPanel = ref(false)
const showLosePanel = ref(false)
const showExitConfirm = ref(false)
const dogMood = ref('neutral')
const speechText = ref('')
const lastFrameTime = ref(0)

// 计算属性
const isWin = computed(() => gameStore.isWin)
const isGameOver = computed(() => gameStore.isGameOver)
const formattedGameTime = computed(() => {
  const totalSeconds = gameStore.gameState.totalGameTime
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
})

// 声明新的状态变量
const lowVolumeDetected = ref(false)
const showVolumeWarning = ref(false)

// 生命周期钩子
onMounted(() => {
  // 初始化游戏配置
  gameStore.initConfig()
  
  // 重置状态确保每次进入游戏页面时都显示开始界面
  gameStarted.value = false
  showWinPanel.value = false
  showLosePanel.value = false
  showExitConfirm.value = false
  
  // 重置游戏状态
  gameStore.resetGameState()
  
  // 启动游戏循环
  requestAnimationFrame(gameLoop)
  
  // 自动进入全屏模式
  requestFullscreen()
  
  // 检测音量
  checkSystemVolume()
})

onBeforeUnmount(() => {
  // 清理
  cancelAnimationFrame(gameLoopId)
  
  // 停止所有声音
  cancelSpeechAndAudio()
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

// 请求全屏
function requestFullscreen() {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen()
  }
}

// 检测系统音量 - 使用无声测试音频，不请求麦克风权限
function checkSystemVolume() {
  try {
    // 尝试播放一个测试音频（静音）来检测系统是否允许播放声音
    const testAudio = new Audio()
    testAudio.volume = 0 // 静音播放
    
    // 添加音频状态监听器
    testAudio.addEventListener('playing', () => {
      // 播放成功，检查系统是否允许播放声音
      console.log('音频测试成功，系统允许播放声音')
      // 播放后立即停止
      testAudio.pause()
      testAudio.currentTime = 0
    })
    
    testAudio.addEventListener('error', (e) => {
      console.warn('音频测试失败:', e)
      lowVolumeDetected.value = true
      showVolumeWarning.value = true
      speechText.value = "请确保音量已打开，否则你可能听不到字母哦！"
      dogMood.value = "worried"
      setTimeout(() => {
        showVolumeWarning.value = false
        speechText.value = ""
        dogMood.value = "neutral"
      }, 5000)
    })
    
    // 尝试播放
    const playPromise = testAudio.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        if (error.name === 'NotAllowedError') {
          // 系统静音或禁止自动播放
          lowVolumeDetected.value = true
          showVolumeWarning.value = true
          speechText.value = "请确保音量已打开，否则你可能听不到字母哦！"
          dogMood.value = "worried"
          setTimeout(() => {
            showVolumeWarning.value = false
            speechText.value = ""
            dogMood.value = "neutral"
          }, 5000)
        }
      })
    }
  } catch (e) {
    console.error('音量检测失败:', e)
    // 在测试失败的情况下，仍然提示用户
    lowVolumeDetected.value = true
    showVolumeWarning.value = true
  }
}

// 开始游戏
function startGame() {
  playSound('click')
  
  // 重置游戏状态
  gameStore.resetGameState()
  
  // 开始游戏
  gameStarted.value = true
  gameStore.gameState.isPlaying = true
  
  // 开始第一轮
  gameStore.startNewRound()
  
  // 检查是否能够播放声音
  if (lowVolumeDetected.value) {
    // 系统静音或音量太低，显示提示
    showVolumeWarning.value = true
    speechText.value = "请确保音量已打开，否则你可能听不到字母发音哦！"
    dogMood.value = "worried"
    setTimeout(() => {
      showVolumeWarning.value = false
      speechText.value = ""
      dogMood.value = "neutral"
    }, 5000)
  } else {
    // 再次检测音量
    checkSystemVolume()
  }
}

// 重新开始游戏
function restartGame() {
  showWinPanel.value = false
  showLosePanel.value = false
  showExitConfirm.value = false
  playSound('click')
  startGame()
}

// 取消退出
function cancelExit() {
  showExitConfirm.value = false
  gameStore.resumeGame()
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

// 确认退出
function confirmExit() {
  // 如果游戏已经结束或未开始，直接退出
  if (!gameStarted.value || showWinPanel.value || showLosePanel.value) {
    cancelSpeechAndAudio()
    exitGame()
  } else {
    // 正在游戏中，显示确认弹窗
    showExitConfirm.value = true
    gameStore.pauseGame()
  }
}

// 退出游戏
function exitGame() {
  playSound('click')
  cancelSpeechAndAudio()
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
  
  // 1秒后重置表情
  setTimeout(() => {
    dogMood.value = 'neutral'
  }, 1000)
}

// 投喂动画
function feedLetter(letter) {
  // 这里使用动画库实现投喂动画
  // 简化起见，这里不实现完整动画，在实际项目中可以使用GSAP
}

// 朗读目标字母
function speakTargetLetter() {
  if (gameStore.gameState.targetLetter) {
    // 先停止之前的所有语音，但使用setTimeout延迟执行，避免冲突
    setTimeout(() => {
      cancelSpeechAndAudio()
      
      // 再使用setTimeout延迟播放新语音
      setTimeout(() => {
        gameStore.speakLetter(gameStore.gameState.targetLetter)
      }, 50)
    }, 5)
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
    // 标记当前正在处理音频，避免快速点击导致的冲突
    const processingPlay = true
    
    // 创建音频元素前先取消之前的所有音频
    // 但使用短暂延迟，避免音频操作的时序问题
    setTimeout(() => {
      try {
        // 创建音频元素
        const audio = new Audio(`/sounds/${sound}.mp3`)
        
        // 添加自定义标记，表示此音频正在准备播放
        audio._pendingPlay = true
        
        // 添加到活跃音频列表
        activeAudios.value.push(audio)
        
        // 当音频播放结束时，从列表中移除
        audio.onended = () => {
          const index = activeAudios.value.indexOf(audio)
          if (index !== -1) {
            activeAudios.value.splice(index, 1)
          }
          audio._pendingPlay = false
        }
        
        // 设置音量
        audio.volume = 1.0
        
        // 给浏览器一点时间准备
        setTimeout(() => {
          // 使用Promise包装播放并添加错误处理
          const playPromise = audio.play()
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // 成功播放后，移除pending标记
              audio._pendingPlay = false
            }).catch(err => {
              console.error('无法播放音效', err)
              // 如果播放失败，也从列表中移除
              const index = activeAudios.value.indexOf(audio)
              if (index !== -1) {
                activeAudios.value.splice(index, 1)
              }
              audio._pendingPlay = false
            })
          } else {
            // 如果没有返回promise，也要清除pending标记
            audio._pendingPlay = false
          }
        }, 20)
      } catch (e) {
        console.error('创建音频元素失败:', e)
      }
    }, 10)
  } catch (e) {
    console.error('音效播放错误:', e)
  }
}

// 停止所有语音和音频
function cancelSpeechAndAudio() {
  // 停止语音合成
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  
  // 使用临时数组存储当前活跃的音频，防止修改过程中出现问题
  const audiosToPause = [...activeAudios.value]
  // 清空活跃音频列表
  activeAudios.value = []
  
  // 延迟停止音频，避免与即将播放的音频冲突
  setTimeout(() => {
    // 停止所有活跃的音频元素
    audiosToPause.forEach(audio => {
      try {
        // 避免直接pause，先检查音频状态
        if (!audio.paused && !audio._pendingPlay) {
          audio.pause()
          audio.currentTime = 0
        }
      } catch (e) {
        console.error('停止音频失败:', e)
      }
    })
  }, 10)
  
  console.log('已停止所有声音')
}

// 原有的stopAllSounds方法改为调用新方法
function stopAllSounds() {
  cancelSpeechAndAudio()
}
</script>

<style scoped>
.game-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  height: auto;
  min-height: 120px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.left-section {
  position: relative;
}

.center-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 10px 0;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 8px 15px;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.pause-button {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary {
  margin-left: 10px;
}
.back-button {
  background-color: var(--accent-color);
  color: white;
}

.control-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
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
  position: absolute;
  right: 0;
  bottom: -5px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: all 0.2s;
}

.speak-button:hover {
  opacity: 1;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 鼓励信息 */
.encouragement {
  position: absolute;
  bottom: -40px;
  width: 100%;
  text-align: center;
  color: var(--accent-color);
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  animation: fadeInUp 0.3s;
}

.encouragement:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  top: -8px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 分数显示 */
.score-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: 10px 15px;
  margin-bottom: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.score-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-label {
  color: var(--text-color);
  font-weight: 500;
}

.score-value {
  font-weight: bold;
  color: var(--primary-color);
}

.score-value.error {
  color: var(--danger-color);
}

/* 游戏区域 */
.game-area {
  position: relative;
  flex-grow: 1;
  width: 100%;
  z-index: 5;
  padding-top: 20px; /* 确保与顶部导航栏有足够间距 */
  overflow: hidden; /* 防止字母溢出 */
}

/* 开始提示 */
.game-start-overlay,
.game-pause-overlay,
.game-result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  animation: fadeIn 0.3s;
}

.start-panel,
.pause-panel,
.result-panel {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 30px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.start-panel h2,
.pause-panel h2,
.result-panel h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 15px;
}

.start-panel p,
.result-panel p {
  color: var(--text-color);
  margin-bottom: 20px;
}

.start-button {
  font-size: 1.5rem;
  padding: 15px 30px;
  margin: 20px 0;
  width: 100%;
}

/* 胜利和失败面板 */
.result-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.result-panel.win {
  border: 5px solid var(--success-color);
}

.result-panel.lose {
  border: 5px solid var(--danger-color);
}

.result-panel.confirm {
  border: 5px solid var(--secondary-color);
}

.result-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.result-buttons .btn {
  flex: 1;
  padding: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 修改移动端的游戏头部样式 */
@media (max-width: 768px) {
  
  .start-button {
    margin-right: 20px;
  }
  /* 移动端游戏区域样式 */
  .game-area {
    padding-top: 5px;
    min-height: 300px; /* 确保游戏区域在竖屏模式下有足够高度 */
    height: 70vh; /* 增加游戏区域高度 */
    position: relative;
    border: 2px dashed rgba(0, 0, 0, 0.1); /* 游戏区域边界可视化 */
    margin: 0 5px;
    overflow: hidden;
  }
  
  /* 优化竖屏布局 */
  .game-view {
    height: auto;
    min-height: 100vh;
  }
  
  .game-background {
    position: fixed; /* 背景固定，确保在滚动时也能覆盖整个页面 */
  }
}

/* 小屏幕设备的额外游戏区域优化 */
@media (max-width: 480px) {
  .start-button {
    margin-right: 20px;
  }
  
  /* 竖屏下字母饼干布局优化 */
  .game-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    height: 75vh; /* 在更小屏幕上进一步增加游戏区域高度 */
  }
}
</style> 