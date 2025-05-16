/**
 * 字母对象类
 * 处理字母的显示和交互
 */
class Letter extends Phaser.GameObjects.Container {
    /**
     * 创建字母对象
     * @param {Phaser.Scene} scene - 场景引用
     * @param {number} x - 字母X坐标
     * @param {number} y - 字母Y坐标
     * @param {string} char - 字母字符
     * @param {boolean} isTarget - 是否为目标字母
     */
    constructor(scene, x, y, char, isTarget = false) {
        super(scene, x, y);
        
        this.char = char;
        this.isTarget = isTarget;
        this.isCollected = false;
        
        // 创建字母背景
        this.bg = scene.add.circle(0, 0, CONFIG.letters.fontSize * 0.8, 0xffffff, 0.8);
        this.add(this.bg);

        // 创建字母文本
        this.text = scene.add.text(0, 0, char, {
            fontFamily: CONFIG.letters.fontFamily,
            fontSize: CONFIG.letters.fontSize,
            color: CONFIG.letters.colors.normal,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.text);
        
        // 添加到场景中
        scene.add.existing(this);
        
        // 启用点击交互
        this.setSize(CONFIG.letters.fontSize * 2, CONFIG.letters.fontSize * 2);
        this.setInteractive({ useHandCursor: true });
        
        // 添加悬停效果
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        
        // 添加初始动画
        this.showAnimation();
    }
    
    /**
     * 鼠标悬停效果
     */
    onPointerOver() {
        if (this.isCollected) return;
        
        this.scene.tweens.add({
            targets: this,
            scale: 1.1,
            duration: 100
        });
    }
    
    /**
     * 鼠标移出效果
     */
    onPointerOut() {
        if (this.isCollected) return;
        
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 100
        });
    }
    
    /**
     * 显示字母的入场动画
     */
    showAnimation() {
        // 设置初始状态
        this.setScale(0);
        this.alpha = 0;
        
        // 创建显示动画
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.Out'
        });
    }
    
    /**
     * 标记为正确并播放动画
     */
    markAsCorrect() {
        // 修改字母颜色为正确色
        this.text.setColor(CONFIG.letters.colors.correct);
        
        // 播放正确动画
        this.scene.tweens.add({
            targets: this,
            scale: 1.5,
            alpha: 0,
            y: this.y - 50,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.isCollected = true;
                this.visible = false;
            }
        });
    }
    
    /**
     * 标记为错误并播放动画
     */
    markAsIncorrect() {
        // 修改字母颜色为错误色
        this.text.setColor(CONFIG.letters.colors.incorrect);
        
        // 播放错误动画
        this.scene.tweens.add({
            targets: this,
            angle: { from: -5, to: 5 },
            duration: 100,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                // 恢复原色
                this.text.setColor(CONFIG.letters.colors.normal);
                this.setAngle(0);
            }
        });
    }
    
    /**
     * 获取字母字符
     * @returns {string} 字母字符
     */
    getChar() {
        return this.char;
    }
    
    /**
     * 检查是否为目标字母
     * @returns {boolean} 是否为目标字母
     */
    isTargetLetter() {
        return this.isTarget;
    }
    
    /**
     * 检查是否已被收集
     * @returns {boolean} 是否已被收集
     */
    isCollectedLetter() {
        return this.isCollected;
    }
    
    /**
     * 设置为目标字母
     * @param {boolean} isTarget - 是否为目标字母
     */
    setAsTarget(isTarget) {
        this.isTarget = isTarget;
        
        if (isTarget) {
            // 可以添加一些视觉提示，表明这是目标字母
            this.bg.setFillStyle(0xffffcc, 0.8);
        } else {
            this.bg.setFillStyle(0xffffff, 0.8);
        }
    }
    
    /**
     * 销毁字母对象
     */
    destroy() {
        this.removeAllListeners();
        super.destroy();
    }
}
