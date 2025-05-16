/**
 * 游戏配置
 */
const CONFIG = {
    // 游戏基础设置
    width: 800,
    height: 600,
    backgroundColor: '#a8e6cf',
    
    // 字母设置
    letters: {
        fontSize: 48,
        fontFamily: 'Arial',
        colors: {
            normal: '#333333',
            correct: '#4CAF50',
            incorrect: '#F44336'
        },
        count: {
            min: 3,
            max: 8
        }
    },
    
    // 角色设置
    character: {
        defaultSize: 80,
        growFactor: 1.2,
        shrinkFactor: 0.8,
        minSize: 40,
        maxSize: 150,
        moveSpeed: 200
    },
    
    // 游戏机制
    gameplay: {
        countdown: 10000, // 默认倒计时10秒（毫秒）
        difficultyLevels: [
            { name: '简单', distractors: 0, caseSensitive: false },
            { name: '中等', distractors: 2, caseSensitive: false },
            { name: '困难', distractors: 4, caseSensitive: true }
        ]
    },
    
    // 存储键名
    storage: {
        playerName: 'yiyi_player_name',
        playerAvatar: 'yiyi_player_avatar',
        gameSettings: 'yiyi_game_settings'
    },
    
    // 默认设置
    defaultSettings: {
        distractorCount: 2,
        caseSensitive: false,
        countdownTime: 10000 // 10秒
    }
};
