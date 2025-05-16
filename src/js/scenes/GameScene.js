/**
 * 游戏主场景
 * 实现字母学习的核心玩法
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // 游戏元素
        this.character = null;
        this.letters = [];
        this.targetLetter = null;
        
        // 游戏状态
        this.currentRound = 0;
        this.score = 0;
        this.gameActive = false;
        
        // UI元素
        this.scoreText = null;
        this.targetText = null;
        this.countdownBar = null;
        this.messageText = null;
        
        // 倒计时相关
        this.countdownTimer = null;
        this.countdownTime = 0;
        this.maxCountdownTime = 0;
        
        // 音频
        this.letterSounds = {};
        
        // 玩家信息
        this.playerName = '';
    }
    
    create() {
        // 加载游戏设置
        this.loadGameSettings();
        
        // 创建背景
        this.createBackground();
        
        // 创建UI
        this.createUI();
        
        // 创建角色
        this.createCharacter();
        
        // 开始游戏
        this.startGame();
    }
    
    /**
     * 加载游戏设置
     */
    loadGameSettings() {
        // 获取玩家信息
        this.playerName = this.registry.get('playerName') || '';
        const playerAvatar = this.registry.get('playerAvatar');
        this.playerAvatar = playerAvatar;
        
        // 获取游戏设置
        const gameSettings = this.registry.get('gameSettings') || CONFIG.defaultSettings;
        this.distractorCount = gameSettings.distractorCount;
        this.caseSensitive = gameSettings.caseSensitive;
        this.maxCountdownTime = gameSettings.countdownTime;
        this.countdownTime = this.maxCountdownTime;
    }
    
    /**
     * 创建背景
     */
    createBackground() {
        // 设置背景颜色
        this.cameras.main.setBackgroundColor('#e8f5e9');
        
        // 添加一些装饰元素
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(20, CONFIG.width - 20);
            const y = Phaser.Math.Between(100, CONFIG.height - 100);
            const size = Phaser.Math.Between(5, 15);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.3);
            
            this.add.circle(x, y, size, 0xffffff, alpha);
        }
    }
    
    /**
     * 创建UI元素
     */
    createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 创建顶部面板背景
        const topPanelHeight = height * 0.13;
        this.add.rectangle(0, 0, width, topPanelHeight, 0x4CAF50, 0.8)
            .setOrigin(0, 0);
        
        // 创建目标字母提示
        this.targetText = this.add.text(width / 2, topPanelHeight / 2, '', {
            fontFamily: CONFIG.letters.fontFamily,
            fontSize: Math.min(width * 0.05, 32),
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 创建得分显示
        this.scoreText = this.add.text(20, topPanelHeight / 2, '得分: 0', {
            fontFamily: CONFIG.letters.fontFamily,
            fontSize: Math.min(width * 0.04, 24),
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);
        
        // 创建倒计时条
        this.createCountdownBar(width, topPanelHeight);
        
        // 创建消息文本（用于显示鼓励信息）
        this.messageText = this.add.text(width / 2, topPanelHeight + 40, '', {
            fontFamily: CONFIG.letters.fontFamily,
            fontSize: Math.min(width * 0.045, 28),
            color: '#4CAF50',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.messageText.setVisible(false);
        
        // 创建暂停按钮
        const pauseBtn = this.add.rectangle(width - 70, topPanelHeight / 2, 80, 40, 0x333333, 0.8)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
            
        this.add.text(width - 70, topPanelHeight / 2, '暂停', {
            fontFamily: CONFIG.letters.fontFamily,
            fontSize: Math.min(width * 0.03, 18),
            color: '#ffffff'
        }).setOrigin(0.5);
        
        pauseBtn.on('pointerdown', () => {
            this.pauseGame();
        });
        
        pauseBtn.on('pointerover', () => {
            pauseBtn.setFillStyle(0x222222);
        });
        
        pauseBtn.on('pointerout', () => {
            pauseBtn.setFillStyle(0x333333);
        });
    }
    
    /**
     * 创建倒计时条
     */
    createCountdownBar(width, topPanelHeight) {
        const barWidth = width * 0.18;
        const barHeight = 15;
        const barX = width - 20 - barWidth;
        const barY = topPanelHeight / 2;
        
        // 背景条
        this.add.rectangle(barX, barY, barWidth, barHeight, 0x333333, 0.8)
            .setOrigin(0, 0.5);
            
        // 倒计时条
        this.countdownBar = this.add.rectangle(barX, barY, barWidth, barHeight - 2, 0xffffff, 1)
            .setOrigin(0, 0.5);
        
        // 保存最大宽度供更新时使用
        this.countdownMaxWidth = barWidth;
    }
    
    /**
     * 创建角色
     */
    createCharacter() {
        // 创建角色在中央位置
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
        
        // 使用玩家头像创建角色
        this.character = new Character(this, x, y, this.playerAvatar);
        
        // 重置角色到初始大小
        this.character.reset();
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        this.currentRound = 0;
        this.score = 0;
        this.updateScore(0);
        
        // 显示欢迎消息
        if (this.playerName) {
            this.showMessage(`${this.playerName}，准备好了吗？`, 2000);
        } else {
            this.showMessage('准备好了吗？', 2000);
        }
        
        // 延迟一段时间后开始第一轮
        this.time.delayedCall(2000, () => {
            this.startNewRound();
        });
    }
    
    /**
     * 开始新的一轮
     */
    startNewRound() {
        // 清理上一轮的字母
        this.clearLetters();
        
        // 增加轮次
        this.currentRound++;
        
        // 重置倒计时
        this.resetCountdown();
        
        // 生成新的字母
        this.generateLetters();
        
        // 选择目标字母
        this.selectTargetLetter();
        
        // 显示目标字母提示
        this.updateTargetText();
        
        // 播放目标字母音效
        this.playTargetLetterSound();
        
        // 设置游戏为活跃状态
        this.gameActive = true;
    }
    
    /**
     * 清理字母
     */
    clearLetters() {
        // 销毁当前所有字母
        for (let letter of this.letters) {
            if (letter) {
                letter.destroy();
            }
        }
        
        // 重置字母数组
        this.letters = [];
        this.targetLetter = null;
    }
    
    /**
     * 生成字母
     */
    generateLetters() {
        // 确定要生成的字母数量
        const totalLetters = CONFIG.letters.count.min + this.distractorCount;
        const letterCount = Phaser.Math.Clamp(
            totalLetters, 
            CONFIG.letters.count.min, 
            CONFIG.letters.count.max
        );
        
        // 用于字母位置的安全区域
        const safeAreaPadding = 100;
        const safeAreaTop = 150; // 避开顶部UI
        
        // 确定用哪些字母
        let availableLetters;
        if (this.caseSensitive) {
            // 区分大小写，使用全部大小写字母
            availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        } else {
            // 不区分大小写，仅使用大写字母
            availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        
        // 随机选择字母并确保不重复
        const selectedLetters = [];
        while (selectedLetters.length < letterCount) {
            const index = Phaser.Math.Between(0, availableLetters.length - 1);
            const letter = availableLetters[index];
            
            // 如果已经选择了这个字母，继续下一轮
            if (selectedLetters.includes(letter)) {
                continue;
            }
            
            selectedLetters.push(letter);
        }
        
        // 创建字母对象
        for (let i = 0; i < letterCount; i++) {
            // 计算随机位置，避免字母重叠
            let x, y, isOverlapping;
            let attempts = 0;
            const maxAttempts = 20;
            
            do {
                isOverlapping = false;
                x = Phaser.Math.Between(safeAreaPadding, CONFIG.width - safeAreaPadding);
                y = Phaser.Math.Between(safeAreaTop, CONFIG.height - safeAreaPadding);
                
                // 检查是否与已创建的字母重叠
                for (let j = 0; j < this.letters.length; j++) {
                    const otherLetter = this.letters[j];
                    const distance = Phaser.Math.Distance.Between(x, y, otherLetter.x, otherLetter.y);
                    
                    // 如果距离小于安全距离，认为重叠
                    if (distance < CONFIG.letters.fontSize * 2) {
                        isOverlapping = true;
                        break;
                    }
                }
                
                attempts++;
            } while (isOverlapping && attempts < maxAttempts);
            
            // 创建字母对象
            const letter = new Letter(this, x, y, selectedLetters[i]);
            
            // 添加点击事件
            letter.on('pointerdown', () => {
                this.onLetterClick(letter);
            });
            
            // 添加到字母数组
            this.letters.push(letter);
        }
    }
    
    /**
     * 选择目标字母
     */
    selectTargetLetter() {
        // 随机选择一个字母作为目标
        const index = Phaser.Math.Between(0, this.letters.length - 1);
        this.targetLetter = this.letters[index];
        this.targetLetter.setAsTarget(true);
    }
    
    /**
     * 更新目标字母提示
     */
    updateTargetText() {
        if (this.targetLetter) {
            this.targetText.setText(`请找出字母: ${this.targetLetter.getChar()}`);
        } else {
            this.targetText.setText('');
        }
    }
    
    /**
     * 播放目标字母音效
     */
    playTargetLetterSound() {
        if (this.targetLetter) {
            const letter = this.targetLetter.getChar().toLowerCase();
            const soundKey = `letter-${letter}`;
            
            if (this.sound.get(soundKey)) {
                this.sound.play(soundKey);
            }
        }
    }
    
    /**
     * 点击字母的处理
     * @param {Letter} letter - 被点击的字母对象
     */
    onLetterClick(letter) {
        // 如果游戏不活跃，忽略点击
        if (!this.gameActive) return;
        
        // 检查是否为目标字母
        if (letter === this.targetLetter) {
            // 正确：播放正确音效
            this.sound.play('correct');
            
            // 标记字母为正确
            letter.markAsCorrect();
            
            // 增加得分
            this.updateScore(this.score + 1);
            
            // 显示随机鼓励消息
            this.showRandomEncouragement();
            
            // 移动角色到字母位置
            this.character.moveTo(letter.x, letter.y, () => {
                // 角色变大
                this.character.grow();
                
                // 延迟一段时间后开始下一轮
                this.time.delayedCall(1000, () => {
                    this.startNewRound();
                });
            });
            
            // 暂停游戏状态，防止点击其他字母
            this.gameActive = false;
            
            // 停止倒计时
            if (this.countdownTimer) {
                this.countdownTimer.remove();
            }
            
        } else {
            // 错误：播放错误音效
            this.sound.play('incorrect');
            
            // 标记字母为错误
            letter.markAsIncorrect();
            
            // 角色变小
            this.character.shrink();
            
            // 显示错误提示
            this.showMessage('啊哦，选错了...', 1000);
        }
    }
    
    /**
     * 更新得分
     * @param {number} newScore - 新得分
     */
    updateScore(newScore) {
        this.score = newScore;
        this.scoreText.setText(`得分: ${this.score}`);
    }
    
    /**
     * 重置倒计时
     */
    resetCountdown() {
        // 停止现有的倒计时
        if (this.countdownTimer) {
            this.countdownTimer.remove();
        }
        
        // 重置倒计时时间
        this.countdownTime = this.maxCountdownTime;
        
        // 更新倒计时条宽度
        if (this.countdownBar) {
            this.countdownBar.width = 150;
        }
        
        // 启动倒计时
        this.countdownTimer = this.time.addEvent({
            delay: 100, // 每100毫秒更新一次
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
    }
    
    /**
     * 更新倒计时
     */
    updateCountdown() {
        // 减少倒计时时间
        this.countdownTime -= 100;
        
        // 更新倒计时条
        if (this.countdownBar) {
            const progress = this.countdownTime / this.maxCountdownTime;
            this.countdownBar.width = this.countdownMaxWidth * progress;
            
            // 根据剩余时间改变颜色
            if (progress < 0.3) {
                this.countdownBar.fillColor = 0xff0000; // 红色
            } else if (progress < 0.6) {
                this.countdownBar.fillColor = 0xffff00; // 黄色
            } else {
                this.countdownBar.fillColor = 0x00ff00; // 绿色
            }
        }
        
        // 检查是否倒计时结束
        if (this.countdownTime <= 0) {
            // 停止倒计时
            this.countdownTimer.remove();
            
            // 播放倒计时结束音效
            this.sound.play('countdown');
            
            // 处理倒计时结束
            this.onCountdownEnd();
        }
    }
    
    /**
     * 倒计时结束处理
     */
    onCountdownEnd() {
        // 游戏不再活跃
        this.gameActive = false;
        
        // 角色变小（饿了）
        this.character.shrink();
        
        // 显示提示消息
        this.showMessage('时间到了，快一点哦！', 1500);
        
        // 高亮显示正确字母
        if (this.targetLetter && !this.targetLetter.isCollectedLetter()) {
            this.targetLetter.bg.setFillStyle(0xffff00, 0.8);
            
            // 再次播放目标字母音效
            this.playTargetLetterSound();
        }
        
        // 延迟一段时间后开始新的一轮
        this.time.delayedCall(2000, () => {
            this.startNewRound();
        });
    }
    
    /**
     * 显示消息
     * @param {string} message - 要显示的消息文本
     * @param {number} duration - 显示持续时间（毫秒）
     */
    showMessage(message, duration = 2000) {
        // 设置消息文本
        this.messageText.setText(message);
        this.messageText.setVisible(true);
        
        // 创建消息动画
        this.tweens.add({
            targets: this.messageText,
            scale: { from: 0.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 200,
            ease: 'Back.Out',
            onComplete: () => {
                // 延迟后隐藏消息
                this.time.delayedCall(duration, () => {
                    this.tweens.add({
                        targets: this.messageText,
                        alpha: 0,
                        y: this.messageText.y - 30,
                        duration: 300,
                        onComplete: () => {
                            this.messageText.setVisible(false);
                            this.messageText.setPosition(CONFIG.width / 2, 120);
                            this.messageText.setScale(1);
                        }
                    });
                });
            }
        });
    }
    
    /**
     * 显示随机鼓励消息
     */
    showRandomEncouragement() {
        // 鼓励消息模板
        const messages = [
            '真棒！',
            '做得好！',
            '太厉害了！',
            '继续加油！',
            '你真聪明！'
        ];
        
        // 带有玩家名字的鼓励消息模板
        const personalizedMessages = [
            `${this.playerName}真棒！`,
            `${this.playerName}做得好！`,
            `${this.playerName}太厉害了！`,
            `${this.playerName}找得真快！`,
            `${this.playerName}真是个小天才！`
        ];
        
        // 根据是否有玩家名字选择消息
        let messagePool;
        if (this.playerName) {
            messagePool = personalizedMessages;
        } else {
            messagePool = messages;
        }
        
        // 随机选择一条消息
        const index = Phaser.Math.Between(0, messagePool.length - 1);
        const message = messagePool[index];
        
        // 显示消息
        this.showMessage(message, 1500);
    }
    
    /**
     * 暂停游戏
     */
    pauseGame() {
        // 如果游戏已经暂停或者不活跃，不执行操作
        if (!this.gameActive) return;
        
        // 暂停游戏状态
        this.gameActive = false;
        
        // 暂停倒计时
        if (this.countdownTimer) {
            this.countdownTimer.paused = true;
        }
        
        // 创建暂停面板
        this.createPausePanel();
    }
    
    /**
     * 创建暂停面板
     */
    createPausePanel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const panelWidth = Math.min(400, width * 0.8);
        const panelHeight = Math.min(300, height * 0.6);
        
        // 添加半透明背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive(); // 防止点击穿透
            
        // 添加面板背景
        const panel = this.add.rectangle(width / 2, height / 2, panelWidth, panelHeight, 0xffffff, 0.9)
            .setStrokeStyle(4, 0x333333);
            
        // 添加暂停标题
        const title = this.add.text(width / 2, height / 2 - panelHeight * 0.3, '游戏暂停', {
            fontFamily: 'Arial',
            fontSize: Math.min(width * 0.06, 32),
            color: '#000000'
        }).setOrigin(0.5);
        
        // 按钮尺寸
        const buttonWidth = panelWidth * 0.7;
        const buttonHeight = 50;
        const buttonSpacing = 70;
        
        // 创建继续按钮
        const resumeButton = this.add.rectangle(width / 2, height / 2, buttonWidth, buttonHeight, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
            
        const resumeText = this.add.text(width / 2, height / 2, '继续游戏', {
            fontFamily: 'Arial',
            fontSize: Math.min(width * 0.04, 20),
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 创建返回主菜单按钮
        const menuButton = this.add.rectangle(width / 2, height / 2 + buttonSpacing, buttonWidth, buttonHeight, 0x4CAF50)
            .setInteractive({ useHandCursor: true });
            
        const menuText = this.add.text(width / 2, height / 2 + buttonSpacing, '返回主菜单', {
            fontFamily: 'Arial',
            fontSize: Math.min(width * 0.04, 20),
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 按钮悬停效果
        [resumeButton, menuButton].forEach(btn => {
            btn.on('pointerover', () => {
                btn.setFillStyle(0x3d9c40);
            });
            
            btn.on('pointerout', () => {
                btn.setFillStyle(0x4CAF50);
            });
        });
        
        // 添加按钮事件
        resumeButton.on('pointerdown', () => {
            this.sound.play('button-click');
            
            // 移除暂停面板
            overlay.destroy();
            panel.destroy();
            title.destroy();
            resumeButton.destroy();
            resumeText.destroy();
            menuButton.destroy();
            menuText.destroy();
            
            // 恢复游戏
            this.resumeGame();
        });
        
        menuButton.on('pointerdown', () => {
            this.sound.play('button-click');
            
            // 返回主菜单
            this.scene.start('MainMenuScene');
        });
    }
    
    /**
     * 恢复游戏
     */
    resumeGame() {
        // 恢复游戏状态
        this.gameActive = true;
        
        // 恢复倒计时
        if (this.countdownTimer) {
            this.countdownTimer.paused = false;
        }
    }
    
    /**
     * 更新函数，每帧调用
     * @param {number} time - 当前时间
     * @param {number} delta - 上一帧到这一帧的时间差
     */
    update(time, delta) {
        // 游戏主循环逻辑（如果需要）
    }
}
