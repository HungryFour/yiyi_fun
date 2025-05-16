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
        // 设置背景颜色 - 使用更柔和的颜色
        this.cameras.main.setBackgroundColor(0xc7f9cc);
        
        // 添加背景面板 - 调整大小和圆角
        const panelWidth = Math.min(700, this.cameras.main.width - 60);
        const panelHeight = Math.min(580, this.cameras.main.height - 60);
        
        // 创建背景面板
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            panelWidth,
            panelHeight,
            0xffffff,
            0.9
        ).setStrokeStyle(2, 0x4CAF50, 0.5);
    }
    
    /**
     * 创建标题
     */
    createTitle() {
        // 更大更现代的标题样式
        this.add.text(
            this.cameras.main.width / 2,
            70,
            '游戏设置',
            {
                fontFamily: 'Arial',
                fontSize: 36,
                fontStyle: 'bold',
                color: '#333333'
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
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 计算左边距和顶部边距
        const leftMargin = width * 0.15;
        const startY = 130;
        
        // 增加元素垂直间距
        const spacing = Math.min(65, height * 0.11);
        
        // 创建表单容器
        this.formContainer = this.add.container(0, 0);
        
        // 名字输入区域
        this.addFormLabel(leftMargin, startY, '小朋友的名字');
        
        // 名字输入框背景
        const nameInputBg = this.add.rectangle(leftMargin + 160, startY + 35, 280, 44, 0xf0f0f0)
            .setOrigin(0, 0.5)
            .setStrokeStyle(2, 0x4CAF50, 0.5);
        this.formContainer.add(nameInputBg);
        
        // 名字文本显示
        this.nameText = this.add.text(leftMargin + 170, startY + 35, playerName || '点击输入名字', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: playerName ? '#333333' : '#999999'
        }).setOrigin(0, 0.5);
        this.formContainer.add(this.nameText);
        
        // 名字输入交互区
        const nameInput = this.add.rectangle(leftMargin + 160, startY + 35, 280, 44, 0xffffff, 0)
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });
            
        nameInput.on('pointerdown', () => {
            const name = prompt('请输入小朋友的名字:', playerName);
            if (name !== null) {
                this.nameText.setText(name || '点击输入名字');
                this.nameText.setColor(name ? '#333333' : '#999999');
            }
        });
        this.formContainer.add(nameInput);
        
        // 干扰字母数量区域
        this.addFormLabel(leftMargin, startY + spacing, '干扰字母数量');
        
        // 创建干扰字母选择器
        this.distractorSelector = this.createNumberSelector(
            leftMargin + 160,
            startY + spacing + 35,
            settings.distractorCount,
            0,
            6,
            (value) => { this.distractorCount = value; }
        );
        
        // 区分大小写区域
        this.addFormLabel(leftMargin, startY + spacing * 2, '区分大小写字母');
        
        // 创建区分大小写复选框
        this.caseSensitiveCheckbox = this.createCheckbox(
            leftMargin + 160,
            startY + spacing * 2 + 35,
            settings.caseSensitive,
            (checked) => { this.caseSensitive = checked; }
        );
        
        // 显示字母提示区域
        this.addFormLabel(leftMargin, startY + spacing * 3, '显示字母底色提示');
        
        // 创建显示提示复选框
        this.showHintCheckbox = this.createCheckbox(
            leftMargin + 160,
            startY + spacing * 3 + 35,
            settings.showTargetHint !== false,
            (checked) => { this.showTargetHint = checked; }
        );
        
        // 倒计时区域
        this.addFormLabel(leftMargin, startY + spacing * 4, '倒计时时间');
        
        // 创建倒计时选择器
        this.countdownSelector = this.createNumberSelector(
            leftMargin + 160,
            startY + spacing * 4 + 35,
            settings.countdownTime / 1000,
            5,
            20,
            (value) => { this.countdownTime = value * 1000; },
            '秒'
        );
        
        // 胜利分数区域
        this.addFormLabel(leftMargin, startY + spacing * 5, '胜利分数');
        
        // 创建胜利分数选择器
        this.winScoreSelector = this.createNumberSelector(
            leftMargin + 160,
            startY + spacing * 5 + 35,
            settings.winScore || CONFIG.gameplay.winScore,
            5,
            30,
            (value) => { this.winScore = value; },
            '分'
        );
        
        // 失败次数区域
        this.addFormLabel(leftMargin, startY + spacing * 6, '失败次数');
        
        // 创建失败次数选择器
        this.loseScoreSelector = this.createNumberSelector(
            leftMargin + 160,
            startY + spacing * 6 + 35,
            settings.loseScore || CONFIG.gameplay.loseScore,
            3,
            15,
            (value) => { this.loseScore = value; },
            '次'
        );
        
        // 初始化当前值
        this.distractorCount = settings.distractorCount;
        this.caseSensitive = settings.caseSensitive;
        this.showTargetHint = settings.showTargetHint !== false;
        this.countdownTime = settings.countdownTime;
        this.winScore = settings.winScore || CONFIG.gameplay.winScore;
        this.loseScore = settings.loseScore || CONFIG.gameplay.loseScore;
        
        // 创建保存按钮
        const saveButtonY = startY + spacing * 7;
        
        // 创建保存按钮背景
        const saveButton = this.add.rectangle(
            width / 2, 
            saveButtonY, 
            180, 50, 
            0x4CAF50
        ).setInteractive({ useHandCursor: true });
        
        // 保存按钮文本
        const saveText = this.add.text(
            width / 2, 
            saveButtonY, 
            '保存设置', 
            {
                fontFamily: 'Arial',
                fontSize: 22,
                fontWeight: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // 保存按钮事件
        saveButton.on('pointerdown', () => {
            if (this.sound.get('button-click')) {
                this.sound.play('button-click');
            }
            this.saveSettings();
        });
        
        // 按钮悬停效果
        saveButton.on('pointerover', () => {
            saveButton.setFillStyle(0x3d9c40);
        });
        
        saveButton.on('pointerout', () => {
            saveButton.setFillStyle(0x4CAF50);
        });
        
        // 添加到表单容器
        this.formContainer.add([saveButton, saveText]);
    }
    
    /**
     * 添加表单标签
     */
    addFormLabel(x, y, text) {
        const label = this.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333333'
        });
        
        this.formContainer.add(label);
        return label;
    }
    
    /**
     * 创建复选框
     */
    createCheckbox(x, y, isChecked, onChange) {
        // 创建复选框背景
        const checkboxBg = this.add.rectangle(x, y, 32, 32, 0xffffff)
            .setOrigin(0, 0.5)
            .setStrokeStyle(2, 0x4CAF50);
            
        // 创建勾选标记
        const checkmark = this.add.text(x + 16, y, '✓', {
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#4CAF50'
        }).setOrigin(0.5);
        
        // 设置初始状态
        checkmark.setVisible(isChecked);
        let checked = isChecked;
        
        // 创建交互区域
        const hitArea = this.add.rectangle(x, y, 32, 32, 0xffffff, 0)
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });
            
        hitArea.on('pointerdown', () => {
            checked = !checked;
            checkmark.setVisible(checked);
            
            if (onChange) onChange(checked);
            
            if (this.sound.get('button-click')) {
                this.sound.play('button-click');
            }
        });
        
        // 添加到表单容器
        this.formContainer.add([checkboxBg, checkmark, hitArea]);
        
        return { background: checkboxBg, checkmark, hitArea, checked };
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
        // 创建背景框
        const background = this.add.rectangle(x, y, 160, 42, 0xf0f0f0)
            .setOrigin(0, 0.5)
            .setStrokeStyle(2, 0x4CAF50, 0.5);
        
        // 减少按钮
        const decreaseBtn = this.add.circle(x + 20, y, 18, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        const decreaseText = this.add.text(x + 20, y, '-', {
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 当前值显示
        const valueText = this.add.text(x + 80, y, defaultValue + (suffix || ''), {
            fontFamily: 'Arial',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 增加按钮
        const increaseBtn = this.add.circle(x + 140, y, 18, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        const increaseText = this.add.text(x + 140, y, '+', {
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
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
                if (this.sound.get('button-click')) {
                    this.sound.play('button-click');
                }
            }
        });
        
        increaseBtn.on('pointerdown', () => {
            if (currentValue < max) {
                currentValue++;
                valueText.setText(currentValue + (suffix || ''));
                if (onChange) onChange(currentValue);
                if (this.sound.get('button-click')) {
                    this.sound.play('button-click');
                }
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
        
        // 添加到表单容器
        this.formContainer.add([background, decreaseBtn, decreaseText, valueText, increaseBtn, increaseText]);
        
        return { background, decreaseBtn, increaseBtn, valueText, currentValue };
    }
    
    /**
     * 保存设置
     */
    saveSettings() {
        // 获取当前表单值
        const playerName = this.nameText.text.trim();
        
        // 保存玩家名称
        if (playerName.length > 0 && playerName !== '点击输入名字') {
            this.registry.set('playerName', playerName);
            StorageManager.savePlayerName(playerName);
        }
        
        // 保存游戏设置
        const gameSettings = {
            distractorCount: this.distractorCount,
            caseSensitive: this.caseSensitive,
            countdownTime: this.countdownTime,
            showTargetHint: this.showTargetHint,
            winScore: this.winScore,
            loseScore: this.loseScore
        };
        
        this.registry.set('gameSettings', gameSettings);
        StorageManager.saveGameSettings(gameSettings);
        
        // 播放保存音效
        if (this.sound.get('button-click')) {
            this.sound.play('button-click');
        }
        
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
        // 创建返回按钮
        const backButton = this.add.rectangle(70, 60, 80, 46, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(70, 60, '返回', {
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 按钮点击事件
        backButton.on('pointerdown', () => {
            if (this.sound.get('button-click')) {
                this.sound.play('button-click');
            }
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
