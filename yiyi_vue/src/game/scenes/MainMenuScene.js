import Phaser from 'phaser';

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    // 获取游戏配置
    const gameStore = this.game.store;
    
    // 创建背景
    this.createBackground();
    
    // 创建标题
    this.createTitle();
    
    // 创建角色
    this.createCharacter();
    
    // 创建菜单按钮
    this.createMenuButtons();
    
    // 播放背景音乐
    this.playBackgroundMusic();
  }
  
  createBackground() {
    // 渐变背景
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 创建渐变背景
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x88c9ff, 0x88c9ff, 0x6ebef7, 0x6ebef7, 1);
    bg.fillRect(0, 0, width, height);
    
    // 添加云朵
    this.addClouds();
    
    // 添加底部草地
    this.createGrass();
  }
  
  addClouds() {
    // 添加多个云朵
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(50, this.cameras.main.height / 2);
      const cloud = this.add.image(x, y, 'cloud');
      cloud.setAlpha(0.7);
      cloud.setScale(Phaser.Math.FloatBetween(0.5, 1.2));
      
      // 云朵动画
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(100, 200),
        duration: Phaser.Math.Between(15000, 30000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
  
  createGrass() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 绿色草地
    const grass = this.add.graphics();
    grass.fillStyle(0x7ed957, 1);
    grass.fillRect(0, height - 100, width, 100);
    
    // 添加花朵和草
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = height - Phaser.Math.Between(80, 100);
      const size = Phaser.Math.Between(5, 15);
      const color = Phaser.Utils.Array.GetRandom([0xffff00, 0xff6699, 0xffffff]);
      
      const flower = this.add.circle(x, y, size, color);
      
      // 花朵摇摆动画
      this.tweens.add({
        targets: flower,
        angle: { from: -5, to: 5 },
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
  
  createTitle() {
    const width = this.cameras.main.width;
    
    // 标题文字
    const title = this.add.text(width / 2, 120, '一一学字母', {
      fontFamily: 'Arial',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#FF8A65',
      stroke: '#ffffff',
      strokeThickness: 6,
      shadow: { color: '#000000', blur: 10, offsetX: 2, offsetY: 2, fill: true }
    });
    title.setOrigin(0.5);
    
    // 添加标题动画
    this.tweens.add({
      targets: title,
      scale: { from: 0.9, to: 1.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  createCharacter() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 添加角色
    const character = this.add.image(width / 2, height / 2, 'character1');
    character.setScale(0.8);
    
    // 角色跳跃动画
    this.tweens.add({
      targets: character,
      y: character.y - 30,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  createMenuButtons() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 按钮样式
    const buttonStyle = {
      fontFamily: 'Arial',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    };
    
    // 开始游戏按钮
    const startButton = this.add.text(width / 2, height - 200, '开始游戏', buttonStyle)
      .setOrigin(0.5)
      .setPadding(20)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startButton.setScale(1.1))
      .on('pointerout', () => startButton.setScale(1));
    
    // 添加按钮背景
    const startBg = this.add.graphics();
    startBg.fillStyle(0xFF8A65, 1);
    startBg.fillRoundedRect(
      startButton.x - startButton.width / 2 - 20,
      startButton.y - startButton.height / 2 - 10,
      startButton.width + 40,
      startButton.height + 20,
      15
    );
    startBg.setInteractive(
      new Phaser.Geom.Rectangle(
        startButton.x - startButton.width / 2 - 20,
        startButton.y - startButton.height / 2 - 10,
        startButton.width + 40,
        startButton.height + 20
      ),
      Phaser.Geom.Rectangle.Contains
    )
    .on('pointerdown', () => this.startGame())
    .on('pointerover', () => startButton.setScale(1.1))
    .on('pointerout', () => startButton.setScale(1));
    
    // 确保按钮在背景上方
    this.children.bringToTop(startButton);
  }
  
  playBackgroundMusic() {
    // 播放背景音乐
    if (!this.sound.get('bgm')) {
      const music = this.sound.add('bgm', {
        volume: 0.5,
        loop: true
      });
      music.play();
    }
  }
  
  startGame() {
    // 播放点击音效
    this.sound.play('click');
    
    // 切换到游戏场景
    this.scene.start('GameScene');
  }
}

export default MainMenuScene; 