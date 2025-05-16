import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 创建加载界面
    this.createLoadingBar();
    
    // 加载游戏资源
    this.loadAssets();
    
    // 监听加载完成事件
    this.load.on('complete', () => {
      this.scene.start('MainMenuScene');
    });
  }
  
  createLoadingBar() {
    // 背景
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 加载文字
    const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    // 进度条背景
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    // 进度条
    const progressBar = this.add.graphics();
    
    // 进度更新事件
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
  }
  
  loadAssets() {
    // 加载图像资源
    this.loadImages();
    
    // 加载音频资源
    this.loadAudio();
    
    // 加载字体
    this.loadFonts();
  }
  
  loadImages() {
    // 背景图片
    this.load.image('bg1', 'assets/images/backgrounds/bg1.png');
    this.load.image('bg2', 'assets/images/backgrounds/bg2.png');
    this.load.image('bg3', 'assets/images/backgrounds/bg3.png');
    
    // 角色图片
    this.load.image('character1', 'assets/images/characters/character1.png');
    this.load.image('character2', 'assets/images/characters/character2.png');
    this.load.image('character3', 'assets/images/characters/character3.png');
    
    // 头像
    this.load.image('avatar1', 'assets/images/avatars/avatar1.png');
    this.load.image('avatar2', 'assets/images/avatars/avatar2.png');
    this.load.image('avatar3', 'assets/images/avatars/avatar3.png');
    this.load.image('avatar4', 'assets/images/avatars/avatar4.png');
    
    // UI元素
    this.load.image('logo', 'assets/images/ui/logo.png');
    this.load.image('button', 'assets/images/ui/button.png');
    this.load.image('panel', 'assets/images/ui/panel.png');
    this.load.image('cloud', 'assets/images/ui/cloud.png');
  }
  
  loadAudio() {
    // 音效
    this.load.audio('correct', 'assets/sounds/correct.mp3');
    this.load.audio('incorrect', 'assets/sounds/incorrect.mp3');
    this.load.audio('win', 'assets/sounds/win.mp3');
    this.load.audio('lose', 'assets/sounds/lose.mp3');
    this.load.audio('click', 'assets/sounds/click.mp3');
    
    // 背景音乐
    this.load.audio('bgm', 'assets/sounds/bgm.mp3');
  }
  
  loadFonts() {
    // 字体通过CSS加载，这里可以预加载字体文件
    // this.load.bitmapFont...
  }
}

export default BootScene; 