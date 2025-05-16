/**
 * 主菜单场景
 * 游戏主界面，包含开始游戏和设置按钮
 */
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // 添加背景
        this.createBackground();
        
        // 添加标题
        this.createTitle();
        
        // 添加菜单按钮
        this.createMenuButtons();
        
        // 添加角色预览
        this.createCharacterPreview();
        
        // 添加背景音乐（暂未实现）
    }
    
    /**
     * 创建背景
     */
    createBackground() {
        // 创建渐变背景
        const bgColors = [0xb3e0ff, 0xa8e6cf];
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;
        
        for (let i = 0; i < height; i += 2) {
            const ratio = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithRGB(
                bgColors[0], bgColors[1], 
                1, 
                ratio
            );
            
            this.add.rectangle(
                width / 2,
                i,
                width,
                2,
                color
            ).setOrigin(0.5, 0);
        }
        
        // 添加一些装饰元素
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(20, width - 20);
            const y = Phaser.Math.Between(20, height - 20);
            const size = Phaser.Math.Between(10, 30);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.3);
            
            this.add.circle(x, y, size, 0xffffff, alpha);
        }
    }
    
    /**
     * 创建标题
     */
    createTitle() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 添加游戏标题
        const titleText = this.add.text(
            width / 2,
            height * 0.2,
            'YiYi Fun',
            {
                fontFamily: 'Arial',
                fontSize: Math.min(width * 0.12, 80),
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8
            }
        ).setOrigin(0.5);
        
        // 添加标题动画
        this.tweens.add({
            targets: titleText,
            y: height * 0.2 - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 添加副标题
        this.add.text(
            width / 2,
            height * 0.2 + 60,
            '有趣的字母学习游戏',
            {
                fontFamily: 'Arial',
                fontSize: Math.min(width * 0.05, 30),
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
    }
    
    /**
     * 创建菜单按钮
     */
    createMenuButtons() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const buttonWidth = Math.min(width * 0.4, 200);
        const buttonHeight = Math.min(height * 0.1, 60);
        const buttonSpacing = height * 0.12;
        
        // 创建开始游戏按钮
        this.createButton(
            width / 2,
            height * 0.5,
            '开始游戏',
            buttonWidth, 
            buttonHeight,
            () => {
                this.checkPlayerData();
            }
        );
        
        // 创建设置按钮
        this.createButton(
            width / 2,
            height * 0.5 + buttonSpacing,
            '设置',
            buttonWidth,
            buttonHeight,
            () => {
                this.scene.start('SettingsScene');
            }
        );
    }
    
    /**
     * 创建按钮
     * @param {number} x - 按钮X坐标
     * @param {number} y - 按钮Y坐标
     * @param {string} text - 按钮文字
     * @param {number} width - 按钮宽度
     * @param {number} height - 按钮高度
     * @param {Function} callback - 点击回调
     */
    createButton(x, y, text, width, height, callback) {
        // 创建按钮背景
        const button = this.add.rectangle(x, y, width, height, 0x4CAF50, 1)
            .setInteractive({ useHandCursor: true });
        
        // 添加按钮文本
        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: Math.min(width * 0.15, 24),
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 添加按钮事件
        button.on('pointerdown', () => {
            // 播放按钮点击音效
            this.sound.play('button-click');
            
            // 缩小按钮
            this.tweens.add({
                targets: [button, buttonText],
                scale: 0.95,
                duration: 100
            });
        });
        
        button.on('pointerup', () => {
            // 恢复按钮大小
            this.tweens.add({
                targets: [button, buttonText],
                scale: 1,
                duration: 100,
                onComplete: () => {
                    // 执行回调
                    if (callback) callback();
                }
            });
        });
        
        button.on('pointerout', () => {
            // 恢复按钮大小
            this.tweens.add({
                targets: [button, buttonText],
                scale: 1,
                duration: 100
            });
        });
        
        // 按钮悬停效果
        button.on('pointerover', () => {
            button.setFillStyle(0x3d9c40);
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(0x4CAF50);
        });
        
        return { button, text: buttonText };
    }
    
    /**
     * 创建角色预览
     */
    createCharacterPreview() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const playerName = this.registry.get('playerName');
        const playerAvatar = this.registry.get('playerAvatar');
        
        if (playerName && playerName.length > 0) {
            // 如果已经有玩家名称，显示欢迎信息
            const welcomeText = `欢迎回来，${playerName}!`;
            this.add.text(
                width / 2,
                height * 0.85,
                welcomeText,
                {
                    fontFamily: 'Arial',
                    fontSize: Math.min(width * 0.04, 24),
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
            
            // 创建角色预览
            const characterX = width / 2;
            const characterY = height * 0.75;
            
            // 创建一个简单的角色预览
            const character = new Character(
                this,
                characterX,
                characterY,
                playerAvatar
            );
            character.setScale(0.8);
        }
    }
    
    /**
     * 检查玩家数据
     * 如果没有设置玩家信息，先跳转到设置页面
     */
    checkPlayerData() {
        const playerName = this.registry.get('playerName');
        
        if (!playerName || playerName.length === 0) {
            // 如果没有玩家名称，先进入设置页面
            this.scene.start('SettingsScene', { fromMainMenu: true });
        } else {
            // 已有玩家数据，直接开始游戏
            this.scene.start('GameScene');
        }
    }
}
