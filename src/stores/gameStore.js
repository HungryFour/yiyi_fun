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
    distractorCount: 4,         // 干扰字母数量
    caseSensitive: false,       // 是否区分大小写
    countdownTime: 10000,       // 倒计时时间(毫秒)
    showTargetHint: true,       // 是否显示目标字母提示(底色)
    winScore: 10,               // 胜利所需分数
    loseScore: 5,               // 失败错误次数
    biscuitShape: 'circle',     // 饼干形状：'circle', 'star', 'heart', 'mixed'
    useAlphabeticalOrder: false, // 是否按字母顺序
    volume: 0.8                 // 游戏音量，范围0-1，默认80%
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

// 根据设置获取字母的形状
const getShapeForLetter = (shapeSetting) => {
  const shapes = ['circle', 'star', 'heart']
  
  if (shapeSetting === 'mixed') {
    // 随机选择一种形状
    return shapes[Math.floor(Math.random() * shapes.length)]
  }
  
  // 返回指定形状
  return shapeSetting
}

// 全局存储当前播放的字母音频
let currentLetterAudio = null

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
    loseScore: CONFIG.defaultSettings.loseScore,
    biscuitShape: CONFIG.defaultSettings.biscuitShape,
    useAlphabeticalOrder: CONFIG.defaultSettings.useAlphabeticalOrder,
    volume: CONFIG.defaultSettings.volume
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
    alphabet: createAlphabet(),
    currentLetterIndex: 0, // 添加字母索引追踪
    gameStartTime: 0, // 游戏开始时间
    totalGameTime: 0 // 游戏总时间（秒）
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
    gameState.currentLetterIndex = 0 // 重置字母索引
    gameState.gameStartTime = Date.now() // 记录游戏开始时间
    gameState.totalGameTime = 0
  }
  
  // 开始新一轮
  function startNewRound() {
    gameState.currentRound++
    generateLetters()
    startCountdown()
    
    // 自动播放当前目标字母的语音 - 增加延迟
    setTimeout(() => {
      if (gameState.targetLetter && gameState.isPlaying) {
        speakLetter(gameState.targetLetter)
      }
    }, 300) // 增加延迟到300ms，确保游戏状态已完全更新
  }
  
  // 生成字母
  function generateLetters() {
    // 清空当前字母
    gameState.letters = []
    
    // 确保distractorCount是数字
    const distractorCount = parseInt(settings.distractorCount, 10)
    
    // 决定这轮使用大写还是小写字母
    const useUppercase = Math.random() > 0.5
    const fullAlphabet = useUppercase ? [...gameState.alphabet.uppercase] : [...gameState.alphabet.lowercase]
    
    // 按字母顺序模式
    if (settings.useAlphabeticalOrder) {
      // 获取当前应该使用的目标字母
      const targetLetter = fullAlphabet[gameState.currentLetterIndex]
      gameState.targetLetter = targetLetter
      
      // 更新字母索引，循环26个字母
      gameState.currentLetterIndex = (gameState.currentLetterIndex + 1) % 26
      
      // 创建字母数组，包括目标字母和随机干扰字母
      let letterPool = [...fullAlphabet]
      // 从字母池中移除目标字母
      letterPool.splice(letterPool.indexOf(targetLetter), 1)
      // 随机打乱剩余字母
      letterPool = letterPool.sort(() => Math.random() - 0.5)
      
      // 添加目标字母
      gameState.letters.push({
        id: 'target-' + Date.now(),
        value: targetLetter,
        isTarget: true,
        x: 0,
        y: 0,
        shape: getShapeForLetter(settings.biscuitShape)
      })
      
      // 添加干扰字母
      for (let i = 0; i < distractorCount && i < letterPool.length; i++) {
        gameState.letters.push({
          id: 'distractor-' + i + '-' + Date.now(),
          value: letterPool[i],
          isTarget: false,
          x: 0,
          y: 0,
          shape: getShapeForLetter(settings.biscuitShape)
        })
      }
      
      // 随机打乱所有字母的顺序
      gameState.letters = gameState.letters.sort(() => Math.random() - 0.5)
    } else {
      // 随机模式
      // 随机选择一个目标字母
      const randomIndex = Math.floor(Math.random() * fullAlphabet.length)
      const targetLetter = fullAlphabet[randomIndex]
      gameState.targetLetter = targetLetter
      
      // 创建字母池，移除目标字母
      let letterPool = [...fullAlphabet]
      letterPool.splice(randomIndex, 1)
      
      // 添加目标字母到游戏字母数组
      gameState.letters.push({
        id: 'target-' + Date.now(),
        value: targetLetter,
        isTarget: true,
        x: 0,
        y: 0,
        shape: getShapeForLetter(settings.biscuitShape)
      })
      
      // 添加干扰字母
      for (let i = 0; i < distractorCount && letterPool.length > 0; i++) {
        const distractorIndex = Math.floor(Math.random() * letterPool.length)
        const distractorLetter = letterPool[distractorIndex]
        
        gameState.letters.push({
          id: 'distractor-' + i + '-' + Date.now(),
          value: distractorLetter,
          isTarget: false,
          x: 0,
          y: 0,
          shape: getShapeForLetter(settings.biscuitShape)
        })
        
        // 从字母池中移除已选的干扰字母
        letterPool.splice(distractorIndex, 1)
      }
      
      // 随机打乱字母顺序
      gameState.letters = gameState.letters.sort(() => Math.random() - 0.5)
    }
    
    // 计算位置，避免重叠
    const positions = []
    // 动态计算网格大小，根据字母数量调整
    const totalLetters = gameState.letters.length
    
    // 计算放置点的数量和分布
    const gridDimension = Math.ceil(Math.sqrt(totalLetters * 4)) // 创建比需要的点更多的网格点
    const cellSize = 1 / gridDimension
    const possiblePositions = []
    
    // 创建均匀分布的网格点
    for (let i = 0; i < gridDimension; i++) {
      for (let j = 0; j < gridDimension; j++) {
        // 添加一些随机偏移，使分布不那么规则
        const offsetX = (Math.random() - 0.5) * cellSize * 0.5
        const offsetY = (Math.random() - 0.5) * cellSize * 0.5
        possiblePositions.push({
          x: cellSize * (i + 0.5) + offsetX,
          y: cellSize * (j + 0.5) + offsetY
        })
      }
    }
    
    // 随机打乱可能位置的顺序
    possiblePositions.sort(() => Math.random() - 0.5)
    
    // 分配位置给字母
    gameState.letters.forEach(letter => {
      let bestPosition = null
      let minDistance = 0
      
      // 从可能位置中找出与现有位置距离最远的点
      for (const pos of possiblePositions) {
        // 计算与现有位置的最小距离
        let minDistToExisting = Infinity
        for (const existingPos of positions) {
          const dist = Math.sqrt(
            Math.pow(pos.x - existingPos.x, 2) + 
            Math.pow(pos.y - existingPos.y, 2)
          )
          minDistToExisting = Math.min(minDistToExisting, dist)
        }
        
        // 如果这是第一个点或者找到了更好的点
        if (positions.length === 0 || minDistToExisting > minDistance) {
          minDistance = minDistToExisting
          bestPosition = pos
        }
      }
      
      // 如果找到了位置
      if (bestPosition) {
        // 从可能位置列表中移除
        const index = possiblePositions.indexOf(bestPosition)
        if (index > -1) {
          possiblePositions.splice(index, 1)
        }
        
        // 保存到字母和位置列表
        positions.push(bestPosition)
        letter.x = bestPosition.x
        letter.y = bestPosition.y
      } else {
        // 万一出错，使用随机位置
        letter.x = 0.1 + Math.random() * 0.8
        letter.y = 0.1 + Math.random() * 0.8
      }
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
  
  // 计算游戏总时间（秒）
  function calculateGameTime() {
    const gameEndTime = Date.now()
    const totalTimeInSeconds = Math.floor((gameEndTime - gameState.gameStartTime) / 1000)
    gameState.totalGameTime = totalTimeInSeconds
    return totalTimeInSeconds
  }
  
  // 获取格式化的游戏时间 (分:秒)
  function getFormattedGameTime() {
    const totalSeconds = gameState.totalGameTime
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
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
        // 计算游戏时间
        calculateGameTime()
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
        // 计算游戏时间
        calculateGameTime()
        playSound('lose')
      } else {
        // 错误后也开始新一轮
        startNewRound()
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
      // 设置音量
      audio.volume = settings.volume
      audio.play()
    } catch (e) {
      console.error('无法播放音效:', e)
    }
  }
  
  // 语音播报字母
  function speakLetter(letter) {
    try {
      // 首先取消所有正在播放的语音合成
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      
      // 停止之前正在播放的字母音频
      if (currentLetterAudio) {
        try {
          const oldAudio = currentLetterAudio
          currentLetterAudio = null // 先清空引用，防止冲突
          
          // 用setTimeout包装pause操作，避免与新的播放操作冲突
          setTimeout(() => {
            try {
              oldAudio.pause()
              oldAudio.currentTime = 0
            } catch (e) {
              // 忽略可能的错误
            }
          }, 5)
        } catch (e) {
          console.error('停止之前音频失败:', e)
        }
      }
      
      // 稍微延迟创建新音频，确保之前的音频处理完成
      setTimeout(() => {
        try {
          // 根据大小写设置和字母大小写选择对应的音频文件
          let audioFile
          if (settings.caseSensitive) {
            // 区分大小写时，使用对应的音频文件
            if (letter === letter.toUpperCase()) {
              // 大写字母
              audioFile = `cap_${letter}.mp3`
            } else {
              // 小写字母
              audioFile = `low_${letter.toUpperCase()}.mp3`
            }
          } else {
            // 不区分大小写时，统一使用普通音频文件
            audioFile = `${letter.toUpperCase()}.mp3`
          }
          
          // 播放音频
          const audio = new Audio(`/sounds/${audioFile}`)
          
          // 存储当前播放的音频引用
          currentLetterAudio = audio
          
          // 监听播放结束事件，清除引用
          audio.onended = () => {
            if (currentLetterAudio === audio) {
              currentLetterAudio = null
            }
          }
          
          // 播放前设置音量和其他属性
          audio.volume = settings.volume
          
          // 使用promise包装播放操作，并添加适当的错误处理
          const playPromise = audio.play()
          
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.error('无法播放字母音频:', err)
              if (currentLetterAudio === audio) {
                currentLetterAudio = null
              }
            })
          }
        } catch (e) {
          console.error('创建音频元素失败:', e)
        }
      }, 50) // 50ms延迟，确保先前的音频操作完成
    } catch (e) {
      console.error('语音播报失败:', e)
    }
  }
  
  // 停止所有语音
  function stopAllSpeech() {
    // 停止语音合成
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    
    // 停止当前播放的字母音频
    if (currentLetterAudio) {
      try {
        const oldAudio = currentLetterAudio
        currentLetterAudio = null // 先清空引用
        
        // 延迟执行暂停操作
        setTimeout(() => {
          try {
            oldAudio.pause()
            oldAudio.currentTime = 0
          } catch (e) {
            // 忽略可能的错误
          }
        }, 5)
      } catch (e) {
        console.error('停止字母音频失败:', e)
      }
    }
  }
  
  // 暂停游戏
  function pauseGame() {
    gameState.isPaused = true
    // 暂停时停止语音
    stopAllSpeech()
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
    stopAllSpeech,
    getFormattedGameTime, // 导出获取游戏时间的方法
    getPlayerHistory,
    savePlayerHistory
  }
})