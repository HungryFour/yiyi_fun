import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

// 游戏配置常量
const CONFIG = {
  // 游戏基础设置
  backgroundColor: '#FFF3E0',
  
  // 字母设置
  letters: {
    fontSize: 48,
    fontFamily: 'Nunito, sans-serif',
    colors: {
      normal: '#5D4037',
      correct: '#81C784',
      incorrect: '#E57373'
    },
    count: {
      min: 3,
      max: 8
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
  
  // 存储键名
  storage: {
    playerName: 'yiyi_player_name',
    playerAvatar: 'yiyi_player_avatar',
    gameSettings: 'yiyi_game_settings'
  },
  
  // 默认设置
  defaultSettings: {
    distractorCount: 2,         // 干扰字母数量
    caseSensitive: false,       // 是否区分大小写
    countdownTime: 10000,       // 倒计时时间(毫秒)
    showTargetHint: true,       // 是否显示目标字母提示
    winScore: 10,               // 胜利所需分数
    loseScore: 5                // 失败错误次数
  },
  
  // 游戏素材
  assets: {
    backgroundImages: ['bg1.png', 'bg2.png', 'bg3.png'],
    characterImages: ['character1.png', 'character2.png', 'character3.png'],
    sounds: {
      correct: 'correct.mp3',
      incorrect: 'incorrect.mp3',
      win: 'win.mp3',
      lose: 'lose.mp3'
    }
  }
}

export const useGameStore = defineStore('game', () => {
  // 玩家信息
  const playerName = ref('')
  const playerAvatar = ref('')
  
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
    maxCountdownTime: 0
  })
  
  // 初始化游戏配置
  const initGameConfig = () => {
    // 从本地存储加载玩家信息
    const storedName = localStorage.getItem(CONFIG.storage.playerName)
    if (storedName) {
      playerName.value = storedName
    }
    
    const storedAvatar = localStorage.getItem(CONFIG.storage.playerAvatar)
    if (storedAvatar) {
      playerAvatar.value = storedAvatar
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
  const savePlayerInfo = (name, avatar) => {
    playerName.value = name
    playerAvatar.value = avatar
    
    localStorage.setItem(CONFIG.storage.playerName, name)
    localStorage.setItem(CONFIG.storage.playerAvatar, avatar)
  }
  
  // 保存游戏设置
  const saveGameSettings = () => {
    localStorage.setItem(CONFIG.storage.gameSettings, JSON.stringify(settings))
  }
  
  // 重置游戏状态
  const resetGameState = () => {
    gameState.isPlaying = false
    gameState.isPaused = false
    gameState.score = 0
    gameState.errors = 0
    gameState.currentRound = 0
    gameState.targetLetter = null
    gameState.letters = []
    gameState.countdownTime = settings.countdownTime
    gameState.maxCountdownTime = settings.countdownTime
  }
  
  // 更新分数
  const updateScore = (value) => {
    gameState.score = value
  }
  
  // 更新错误
  const updateErrors = (value) => {
    gameState.errors = value
  }
  
  // 获取游戏配置常量
  const getConfig = () => {
    return CONFIG
  }

  return {
    // 状态
    playerName,
    playerAvatar,
    settings,
    gameState,
    
    // 动作
    initGameConfig,
    savePlayerInfo,
    saveGameSettings,
    resetGameState,
    updateScore,
    updateErrors,
    getConfig
  }
}) 