import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import SettingsScene from './scenes/SettingsScene';

class PhaserGame {
  constructor(containerId, store) {
    this.containerId = containerId;
    this.store = store;
    this.game = null;
  }

  init() {
    const gameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: this.store.getConfig().backgroundColor,
      parent: this.containerId,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
    this.game = new Phaser.Game(gameConfig);
    
    // 将store注入到游戏中，以便场景可以访问
    this.game.store = this.store;
    
    // 监听窗口大小变化，自动调整游戏大小
    window.addEventListener('resize', () => {
      if (this.game) {
        this.game.scale.resize(window.innerWidth, window.innerHeight);
      }
    });

    return this.game;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}

export default PhaserGame; 