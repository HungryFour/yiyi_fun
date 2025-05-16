/**
 * 游戏启动场景
 * 负责加载游戏资源并初始化游戏
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 显示加载进度条
        this.createLoadingBar();
        
        // 加载基础音效
        this.loadSounds();
        
        // 加载基础图像
        this.loadImages();
        
        // 加载玩家数据
        this.loadPlayerData();
    }

    /**
     * 创建加载进度条
     */
    createLoadingBar() {
        const width = 400;
        const height = 30;
        
        // 进度条背景
        this.add.rectangle(
            CONFIG.width / 2,
            CONFIG.height / 2,
            width,
            height,
            0x333333
        );
        
        // 进度条
        const progressBar = this.add.rectangle(
            CONFIG.width / 2 - width / 2,
            CONFIG.height / 2,
            0,
            height - 4,
            0x00ff00
        ).setOrigin(0, 0.5);
        
        // 加载文本
        const loadingText = this.add.text(
            CONFIG.width / 2,
            CONFIG.height / 2 - 50,
            '加载中...',
            {
                fontFamily: CONFIG.letters.fontFamily,
                fontSize: 24,
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // 进度显示
        const percentText = this.add.text(
            CONFIG.width / 2,
            CONFIG.height / 2 + 50,
            '0%',
            {
                fontFamily: CONFIG.letters.fontFamily,
                fontSize: 20,
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // 监听加载进度事件
        this.load.on('progress', (value) => {
            // 更新进度条宽度
            progressBar.width = (width - 4) * value;
            
            // 更新进度文本
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            // 加载完成后处理
            loadingText.setText('加载完成!');
            percentText.setText('100%');
            
            // 延迟一小段时间后切换到主菜单场景
            this.time.delayedCall(500, () => {
                this.scene.start('MainMenuScene');
            });
        });
    }

    /**
     * 加载游戏音效
     */
    loadSounds() {
        // 临时占位音效，后续可替换为实际音效
        this.load.audio('correct', 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3');
        this.load.audio('incorrect', 'https://assets.mixkit.co/active_storage/sfx/254/254-preview.mp3');
        this.load.audio('countdown', 'https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3');
        this.load.audio('button-click', 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
        
        // 加载英文字母发音（临时使用示例链接，实际需替换为正确资源）
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < alphabet.length; i++) {
            const letter = alphabet[i];
            // 这里使用临时占位链接，实际项目中需替换为真实的字母发音音效
            this.load.audio(`letter-${letter.toLowerCase()}`, 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3');
        }
    }

    /**
     * 加载游戏图像
     */
    loadImages() {
        // 加载小狗图片
        this.load.image('dog-image', 'src/assets/images/dog.png');
        
        // 创建临时字母图片（后续可以替换为设计好的字母图片）
        this.generateLetterImages();
        
        // 创建UI元素
        this.generateUIElements();
    }

    /**
     * 生成临时字母图片
     */
    generateLetterImages() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        // 创建一个临时的绘图对象
        const graphics = this.add.graphics();
        
        // 为每个字母生成一个简单的圆形背景图
        for (let i = 0; i < alphabet.length; i++) {
            const letter = alphabet[i];
            const textureKey = `letter-${letter}`;
            
            // 设置画布
            graphics.clear();
            
            // 绘制背景圆
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(64, 64, 60);
            
            // 绘制边框
            graphics.lineStyle(4, 0x000000, 1);
            graphics.strokeCircle(64, 64, 60);
            
            // 生成纹理
            if (!this.textures.exists(textureKey)) {
                graphics.generateTexture(textureKey, 128, 128);
            }
        }
        
        // 销毁临时图形对象
        graphics.destroy();
    }

    /**
     * 生成UI元素
     */
    generateUIElements() {
        const graphics = this.add.graphics();
        
        // 生成按钮背景
        graphics.clear();
        graphics.fillStyle(0x4CAF50, 1);
        graphics.fillRoundedRect(0, 0, 200, 60, 15);
        graphics.generateTexture('button-bg', 200, 60);
        
        // 生成面板背景
        graphics.clear();
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillRoundedRect(0, 0, 400, 300, 20);
        graphics.lineStyle(4, 0x333333, 1);
        graphics.strokeRoundedRect(0, 0, 400, 300, 20);
        graphics.generateTexture('panel-bg', 400, 300);

        // 销毁临时图形对象
        graphics.destroy();
    }

    /**
     * 加载玩家数据
     */
    loadPlayerData() {
        try {
            // 从本地存储加载玩家数据
            const playerName = StorageManager.getPlayerName();
            const playerAvatar = StorageManager.getPlayerAvatar();
            const gameSettings = StorageManager.getGameSettings();
            
            console.log('加载玩家数据:', { playerName, gameSettings });
            
            // 保存到全局游戏数据中
            this.registry.set('playerName', playerName);
            this.registry.set('playerAvatar', playerAvatar);
            this.registry.set('gameSettings', gameSettings);
            
            // 确保设置了默认值
            if (!this.registry.get('gameSettings')) {
                this.registry.set('gameSettings', CONFIG.defaultSettings);
            }
        } catch (error) {
            console.error('加载玩家数据出错:', error);
            // 确保有默认设置
            this.registry.set('gameSettings', CONFIG.defaultSettings);
        }
    }

    create() {
        console.log('BootScene: 资源加载完成');
        console.log('玩家名称:', this.registry.get('playerName'));
        console.log('游戏设置:', this.registry.get('gameSettings'));
    }
}
