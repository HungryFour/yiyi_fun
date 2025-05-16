import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

// 游戏配置常量
const CONFIG = {
  // 字母设置
  letters: {
    fontSize: 48,
    fontFamily: "'Baloo 2', cursive",
    colors: {
      normal: '#2A2D34',
      correct: '#6BCB77',
      incorrect: '#FF6B6B'
    }
  },
  
  // 游戏机制
  gameplay: {
    countdown: 10000, // 默认倒计时10秒（毫秒）
    difficultyLevels: [
      { name: '简单', distractors: 0, caseSensitive: false },
      { name: '中等', distractors: 2, caseSensitive: false },
      { name: '困难', distractors: 4, caseSensitive: true }
    ],
    winScore: 10,    // 胜利所需分数
    loseScore: 5     // 失败错误次数
  },
  
  // 本地存储键名
  storage: {
    playerName: 'yiyi_player_name',
    playerAvatar: 'yiyi_player_avatar',
    gameSettings: 'yiyi_game_settings',
    playerHistory: 'yiyi_player_history' // 新增玩家历史记录存储键
  },
  
  // 默认设置
  defaultSettings: {
    distractorCount: 2,         // 干扰字母数量
    caseSensitive: false,       // 是否区分大小写
    countdownTime: 10000,       // 倒计时时间(毫秒)
    showTargetHint: true,       // 是否显示目标字母提示(底色)
    winScore: 10,               // 胜利所需分数
    loseScore: 5                // 失败错误次数
  },
  
  // 鼓励短语
  encouragements: [
    '真棒！',
    '太厉害了！',
    '继续加油！',
    '你好聪明！',
    '完美！',
    '就是这样！'
  ]
}

// 创建字母数组（大写和小写）
const createAlphabet = () => {
  const uppercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const lowercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
  return { uppercase, lowercase }
}

export const useGameStore = defineStore('game', () => {
  // 玩家信息
  const playerName = ref('')
  const playerAvatar = ref('')
  const playerHistory = ref([]) // 新增玩家历史记录
  
  // 游戏设置
  const settings = reactive({
    distractorCount: CONFIG.defaultSettings.distractorCount,
    caseSensitive: CONFIG.defaultSettings.caseSensitive,
    countdownTime: CONFIG.defaultSettings.countdownTime,
    showTargetHint: CONFIG.defaultSettings.showTargetHint,
    winScore: CONFIG.defaultSettings.winScore,
    loseScore: CONFIG.defaultSettings.loseScore
  })
  
  // 游戏状态
  const gameState = reactive({
    isPlaying: false,
    isPaused: false,
    score: 0,
    errors: 0,
    currentRound: 0,
    targetLetter: null,
    letters: [],
    countdownTime: 0,
    maxCountdownTime: 0,
    encouragement: '',
    alphabet: createAlphabet()
  })
  
  // 计算属性
  const isWin = computed(() => gameState.score >= settings.winScore)
  const isGameOver = computed(() => gameState.errors >= settings.loseScore)
  
  // 初始化游戏配置
  function initConfig() {
    // 从本地存储加载玩家信息
    const storedName = localStorage.getItem(CONFIG.storage.playerName)
    if (storedName) {
      playerName.value = storedName
    }
    
    const storedAvatar = localStorage.getItem(CONFIG.storage.playerAvatar)
    if (storedAvatar) {
      playerAvatar.value = storedAvatar
    }
    
    // 从本地存储加载玩家历史记录
    const storedHistory = localStorage.getItem(CONFIG.storage.playerHistory)
    if (storedHistory) {
      try {
        playerHistory.value = JSON.parse(storedHistory)
      } catch (e) {
        console.error('无法解析玩家历史记录:', e)
        playerHistory.value = []
      }
    }
    
    // 从本地存储加载游戏设置
    const storedSettings = localStorage.getItem(CONFIG.storage.gameSettings)
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings)
        Object.assign(settings, parsedSettings)
      } catch (e) {
        console.error('无法解析游戏设置:', e)
      }
    }
  }
  
  // 保存玩家信息
  function savePlayerInfo(name, avatar) {
    playerName.value = name
    playerAvatar.value = avatar
    
    // 保存到本地存储
    localStorage.setItem(CONFIG.storage.playerName, name)
    localStorage.setItem(CONFIG.storage.playerAvatar, avatar)
    
    // 如果有玩家名字，且不在历史记录中，则添加到历史记录
    if (name && !playerHistory.value.includes(name)) {
      playerHistory.value.push(name)
      // 最多保存10个历史记录
      if (playerHistory.value.length > 10) {
        playerHistory.value = playerHistory.value.slice(-10)
      }
      // 保存历史记录到本地存储
      savePlayerHistory()
    }
  }
  
  // 保存玩家历史记录
  function savePlayerHistory() {
    localStorage.setItem(CONFIG.storage.playerHistory, JSON.stringify(playerHistory.value))
  }
  
  // 保存游戏设置
  function saveGameSettings() {
    localStorage.setItem(CONFIG.storage.gameSettings, JSON.stringify(settings))
  }
  
  // 重置游戏状态
  function resetGameState() {
    gameState.isPlaying = true
    gameState.isPaused = false
    gameState.score = 0
    gameState.errors = 0
    gameState.currentRound = 0
    gameState.targetLetter = null
    gameState.letters = []
    gameState.countdownTime = settings.countdownTime
    gameState.maxCountdownTime = settings.countdownTime
    gameState.encouragement = ''
  }
  
  // 开始新一轮
  function startNewRound() {
    gameState.currentRound++
    generateLetters()
    startCountdown()
  }
  
  // 生成字母
  function generateLetters() {
    // 清空当前字母
    gameState.letters = []
    
    // 决定这轮使用大写还是小写字母
    const useUppercase = Math.random() > 0.5
    const letterPool = useUppercase ? [...gameState.alphabet.uppercase] : [...gameState.alphabet.lowercase]
    
    // 随机选择一个目标字母
    const randomIndex = Math.floor(Math.random() * letterPool.length)
    const targetLetter = letterPool[randomIndex]
    gameState.targetLetter = targetLetter
    
    // 从字母池中移除已选的目标字母
    letterPool.splice(randomIndex, 1)
    
    // 添加目标字母到游戏字母数组
    gameState.letters.push({
      id: 'target-' + Date.now(),
      value: targetLetter,
      isTarget: true,
      x: 0,
      y: 0
    })
    
    // 添加干扰字母
    for (let i = 0; i < settings.distractorCount; i++) {
      if (letterPool.length > 0) {
        const distractorIndex = Math.floor(Math.random() * letterPool.length)
        const distractorLetter = letterPool[distractorIndex]
        
        gameState.letters.push({
          id: 'distractor-' + i + '-' + Date.now(),
          value: distractorLetter,
          isTarget: false,
          x: 0,
          y: 0
        })
        
        // 从字母池中移除已选的干扰字母
        letterPool.splice(distractorIndex, 1)
      }
    }
    
    // 随机打乱字母顺序
    gameState.letters = gameState.letters.sort(() => Math.random() - 0.5)
    
    // 随机分配位置（实际位置会在组件中使用）
    gameState.letters.forEach(letter => {
      letter.x = Math.random()
      letter.y = Math.random()
    })
  }
  
  // 开始倒计时
  function startCountdown() {
    gameState.countdownTime = settings.countdownTime
  }
  
  // 更新倒计时
  function updateCountdown(delta) {
    if (gameState.isPlaying && !gameState.isPaused && gameState.countdownTime > 0) {
      gameState.countdownTime = Math.max(0, gameState.countdownTime - delta)
      
      // 倒计时结束
      if (gameState.countdownTime <= 0) {
        onCountdownEnd()
      }
    }
  }
  
  // 倒计时结束
  function onCountdownEnd() {
    // 增加错误计数
    gameState.errors++
    
    // 显示失败提示
    playSound('wrong')
    
    // 检查游戏是否结束
    if (gameState.errors >= settings.loseScore) {
      gameState.isPlaying = false
    } else {
      // 开始新一轮
      startNewRound()
    }
  }
  
  // 检查字母选择
  function checkLetter(letter) {
    if (!gameState.isPlaying || gameState.isPaused) return
    
    const isCorrect = settings.caseSensitive 
      ? letter.value === gameState.targetLetter
      : letter.value.toLowerCase() === gameState.targetLetter.toLowerCase()
    
    if (isCorrect) {
      // 正确答案处理
      gameState.score++
      playSound('correct')
      showRandomEncouragement()
      
      // 检查是否赢得游戏
      if (gameState.score >= settings.winScore) {
        gameState.isPlaying = false
        playSound('win')
      } else {
        // 开始新一轮
        startNewRound()
      }
    } else {
      // 错误答案处理
      gameState.errors++
      playSound('wrong')
      
      // 检查游戏是否结束
      if (gameState.errors >= settings.loseScore) {
        gameState.isPlaying = false
        playSound('lose')
      }
    }
  }
  
  // 显示随机鼓励短语
  function showRandomEncouragement() {
    const randomIndex = Math.floor(Math.random() * CONFIG.encouragements.length)
    gameState.encouragement = playerName.value ? 
      `${playerName.value}，${CONFIG.encouragements[randomIndex]}` : 
      CONFIG.encouragements[randomIndex]
    
    // 3秒后清除鼓励信息
    setTimeout(() => {
      if (gameState.encouragement) {
        gameState.encouragement = ''
      }
    }, 3000)
  }
  
  // 播放音效
  function playSound(soundName) {
    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`)
      audio.play()
    } catch (e) {
      console.error('无法播放音效:', e)
    }
  }
  
  // 语音播报字母
  function speakLetter(letter) {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter)
        utterance.lang = 'en-US'
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    } catch (e) {
      console.error('语音播报失败:', e)
    }
  }
  
  // 暂停游戏
  function pauseGame() {
    gameState.isPaused = true
  }
  
  // 继续游戏
  function resumeGame() {
    gameState.isPaused = false
  }
  
  // 获取玩家历史记录
  function getPlayerHistory() {
    return playerHistory.value
  }

  return {
    // 状态
    playerName,
    playerAvatar,
    playerHistory,
    settings,
    gameState,
    isWin,
    isGameOver,
    CONFIG,
    
    // 方法
    initConfig,
    savePlayerInfo,
    saveGameSettings,
    resetGameState,
    startNewRound,
    updateCountdown,
    checkLetter,
    pauseGame,
    resumeGame,
    speakLetter,
    getPlayerHistory,
    savePlayerHistory
  }
})