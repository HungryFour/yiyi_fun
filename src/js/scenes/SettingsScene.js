/**
 * 设置场景
 * 用于设置玩家信息和游戏难度
 */
class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
        
        // 保存是否从主菜单跳转来的标志
        this.fromMainMenu = false;
        
        // DOM元素
        this.formContainer = null;
    }
    
    init(data) {
        // 获取是否从主菜单跳转的标志
        this.fromMainMenu = data.fromMainMenu || false;
    }

    create() {
        // 添加背景
        this.createBackground();
        
        // 添加标题
        this.createTitle();
        
        // 创建设置表单
        this.createSettingsForm();
        
        // 创建返回按钮
        this.createBackButton();
    }
    
    /**
     * 创建背景
     */
    createBackground() {
        // 设置背景颜色
        this.cameras.main.setBackgroundColor(0xa8e6cf);
        
        // 添加背景面板
        const panelWidth = Math.min(800, this.cameras.main.width - 40);
        const panelHeight = Math.min(600, this.cameras.main.height - 40);
        
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            panelWidth,
            panelHeight,
            0xffffff,
            0.9
        ).setStrokeStyle(4, 0x333333);
    }
    
    /**
     * 创建标题
     */
    createTitle() {
        this.add.text(
            this.cameras.main.width / 2,
            60,
            '游戏设置',
            {
                fontFamily: 'Arial',
                fontSize: 40,
                fontStyle: 'bold',
                color: '#000000'
            }
        ).setOrigin(0.5);
    }
    
    /**
     * 创建设置表单
     */
    createSettingsForm() {
        // 获取当前设置
        const playerName = this.registry.get('playerName') || '';
        const gameSettings = this.registry.get('gameSettings') || CONFIG.defaultSettings;
        
        // 移除现有表单（如果存在）
        if (this.formContainer) {
            this.formContainer.destroy();
        }
        
        // 创建原生表单界面，不使用DOM
        this.createNativeForm(playerName, gameSettings);
    }
    
    /**
     * 创建原生表单界面
     */
    createNativeForm(playerName, settings) {
        const centerX = this.cameras.main.width / 2;
        const height = this.cameras.main.height;
        const startY = Math.min(120, height * 0.15);
        
        // 计算动态间距，基于屏幕高度
        const spacing = Math.min(70, height * 0.12);
        
        // 名字输入区域
        this.add.text(centerX - 150, startY, '小朋友的名字:', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        });
        
        // 名字输入框背景
        const nameInputBg = this.add.rectangle(centerX, startY + 35, 300, 40, 0xffffff)
            .setStrokeStyle(2, 0x999999);
        
        // 名字文本显示
        this.nameText = this.add.text(centerX - 140, startY + 25, playerName, {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        });
        
        // 名字输入交互区
        this.nameInput = this.add.rectangle(centerX, startY + 35, 300, 40, 0xffffff, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                const name = prompt('请输入小朋友的名字:', playerName);
                if (name !== null) {
                    this.nameText.setText(name);
                }
            });
        
        // 干扰字母数量区域
        this.add.text(centerX - 150, startY + spacing, '干扰字母数量:', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        });
        
        // 创建干扰字母选择器
        this.createNumberSelector(
            centerX + 70, 
            startY + spacing + 10, 
            settings.distractorCount, 
            0, 
            6, 
            (value) => { this.distractorCount = value; }
        );
        
        // 区分大小写区域
        const caseCheck = this.add.rectangle(centerX - 130, startY + spacing*2, 24, 24, 0xffffff)
            .setStrokeStyle(2, 0x999999);
        
        if (settings.caseSensitive) {
            this.caseMark = this.add.text(centerX - 135, startY + spacing*2 - 12, '✓', {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#4CAF50',
                fontStyle: 'bold'
            });
        } else {
            this.caseMark = this.add.text(centerX - 135, startY + spacing*2 - 12, '', {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#4CAF50',
                fontStyle: 'bold'
            });
        }
        
        this.caseSensitive = settings.caseSensitive;
        
        // 区分大小写标签
        this.add.text(centerX - 90, startY + spacing*2 - 12, '区分大小写字母', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        });
        
        // 区分大小写交互区域
        const caseCheckHitArea = this.add.rectangle(centerX - 10, startY + spacing*2, 200, 30, 0xffffff, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.caseSensitive = !this.caseSensitive;
                this.caseMark.setText(this.caseSensitive ? '✓' : '');
            });
        
        // 倒计时区域
        this.add.text(centerX - 150, startY + spacing*3, '倒计时时间:', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        });
        
        // 创建倒计时选择器
        this.createNumberSelector(
            centerX + 70, 
            startY + spacing*3 + 10, 
            settings.countdownTime / 1000, 
            5, 
            20, 
            (value) => { this.countdownTime = value * 1000; },
            '秒'
        );
        
        // 初始化当前值
        this.distractorCount = settings.distractorCount;
        this.countdownTime = settings.countdownTime;
        
        // 确保保存按钮位置不超出视口
        const bottomPadding = 30;
        const buttonY = Math.min(startY + spacing*4, height - bottomPadding - 25);
        
        // 创建保存按钮
        const saveButton = this.add.rectangle(centerX, buttonY, 200, 50, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        const saveText = this.add.text(centerX, buttonY, '保存设置', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 保存按钮事件
        saveButton.on('pointerdown', () => {
            this.sound.play('button-click');
            this.saveSettings();
        });
        
        // 按钮悬停效果
        saveButton.on('pointerover', () => {
            saveButton.setFillStyle(0x3d9c40);
        });
        
        saveButton.on('pointerout', () => {
            saveButton.setFillStyle(0x4CAF50);
        });
    }
    
    /**
     * 创建数字选择器
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} defaultValue - 默认值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {Function} onChange - 值改变时的回调
     * @param {string} suffix - 后缀文本
     */
    createNumberSelector(x, y, defaultValue, min, max, onChange, suffix = '') {
        // 减少按钮
        const decreaseBtn = this.add.circle(x - 50, y, 20, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(x - 50, y, '-', {
            fontFamily: 'Arial',
            fontSize: 30,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 当前值显示
        const valueText = this.add.text(x, y, defaultValue + (suffix || ''), {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#000000'
        }).setOrigin(0.5);
        
        // 增加按钮
        const increaseBtn = this.add.circle(x + 50, y, 20, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(x + 50, y, '+', {
            fontFamily: 'Arial',
            fontSize: 30,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 当前值
        let currentValue = defaultValue;
        
        // 设置事件
        decreaseBtn.on('pointerdown', () => {
            if (currentValue > min) {
                currentValue--;
                valueText.setText(currentValue + (suffix || ''));
                if (onChange) onChange(currentValue);
                this.sound.play('button-click');
            }
        });
        
        increaseBtn.on('pointerdown', () => {
            if (currentValue < max) {
                currentValue++;
                valueText.setText(currentValue + (suffix || ''));
                if (onChange) onChange(currentValue);
                this.sound.play('button-click');
            }
        });
        
        // 按钮悬停效果
        const buttons = [decreaseBtn, increaseBtn];
        buttons.forEach(btn => {
            btn.on('pointerover', () => {
                btn.setFillStyle(0x3d9c40);
            });
            
            btn.on('pointerout', () => {
                btn.setFillStyle(0x4CAF50);
            });
        });
        
        return { decreaseBtn, increaseBtn, valueText, currentValue };
    }
    
    /**
     * 保存设置
     */
    saveSettings() {
        // 获取当前表单值
        const playerName = this.nameText.text.trim();
        
        // 保存玩家名称
        if (playerName.length > 0) {
            this.registry.set('playerName', playerName);
            StorageManager.savePlayerName(playerName);
        }
        
        // 保存游戏设置
        const gameSettings = {
            distractorCount: this.distractorCount,
            caseSensitive: this.caseSensitive,
            countdownTime: this.countdownTime
        };
        
        this.registry.set('gameSettings', gameSettings);
        StorageManager.saveGameSettings(gameSettings);
        
        // 播放保存音效
        this.sound.play('button-click');
        
        // 如果是从主菜单进入的，保存后进入游戏
        if (this.fromMainMenu) {
            this.scene.start('GameScene');
        } else {
            // 否则返回主菜单
            this.scene.start('MainMenuScene');
        }
    }
    
    /**
     * 创建返回按钮
     */
    createBackButton() {
        const backButton = this.add.rectangle(60, 60, 100, 50, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(60, 60, '返回', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton.on('pointerdown', () => {
            this.sound.play('button-click');
            this.scene.start('MainMenuScene');
        });
        
        // 按钮悬停效果
        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x3d9c40);
        });
        
        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x4CAF50);
        });
    }
}
