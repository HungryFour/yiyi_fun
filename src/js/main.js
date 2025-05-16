/**
 * 游戏主入口
 */
window.addEventListener('load', function() {
    // 游戏配置
    const gameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: CONFIG.backgroundColor,
        parent: 'game-container',
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth,
            height: window.innerHeight
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        dom: {
            createContainer: true
        },
        scene: [
            BootScene,
            MainMenuScene,
            GameScene,
            SettingsScene
        ]
    };

    // 创建游戏实例
    const game = new Phaser.Game(gameConfig);
    
    // 监听窗口大小变化，自动调整游戏大小
    window.addEventListener('resize', function() {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });
});
