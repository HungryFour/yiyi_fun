/**
 * 游戏角色类
 * 负责处理角色的移动、大小变化等功能
 */
class Character extends Phaser.GameObjects.Container {
    /**
     * 创建角色
     * @param {Phaser.Scene} scene - 场景引用
     * @param {number} x - 初始X坐标
     * @param {number} y - 初始Y坐标
     * @param {string|null} avatarData - 角色头像的Base64数据（可选）
     */
    constructor(scene, x, y, avatarData = null) {
        super(scene, x, y);
        
        this.scene = scene;
        this.initialX = x;
        this.initialY = y;
        
        // 创建角色身体部分
        this.body = scene.add.circle(0, 0, CONFIG.character.defaultSize / 2, 0xffdde1);
        this.add(this.body);

        // 创建角色头像或默认面部
        if (avatarData) {
            this.createAvatarFromData(avatarData);
        } else {
            this.createDefaultFace();
        }

        // 添加到场景中
        scene.add.existing(this);
        
        // 如果启用了物理引擎，添加物理特性
        if (scene.physics && scene.physics.world) {
            scene.physics.world.enable(this);
            this.body.setCircle(CONFIG.character.defaultSize / 2);
        }
        
        // 设置当前大小
        this.currentSize = CONFIG.character.defaultSize;
        
        // 是否正在移动的标志
        this.isMoving = false;
        
        // 创建移动补间动画
        this.moveTween = null;
    }

    /**
     * 从Base64数据创建头像
     * @param {string} avatarData - Base64格式的图片数据
     */
    createAvatarFromData(avatarData) {
        // 如果场景中不存在这个纹理，先加载它
        const key = 'player-avatar';
        if (!this.scene.textures.exists(key)) {
            this.scene.textures.addBase64(key, avatarData);
        }

        // 创建头像精灵，并调整到合适大小
        const size = CONFIG.character.defaultSize * 0.8;
        this.face = this.scene.add.image(0, 0, key)
            .setDisplaySize(size, size)
            .setCircle();
            
        // 添加到容器
        this.add(this.face);
    }

    /**
     * 创建默认面部表情
     */
    createDefaultFace() {
        // 创建简单的笑脸
        const graphics = this.scene.add.graphics();
        const size = CONFIG.character.defaultSize;
        
        // 眼睛
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(-size * 0.15, -size * 0.1, size * 0.08);
        graphics.fillCircle(size * 0.15, -size * 0.1, size * 0.08);
        
        // 嘴巴（笑脸）
        graphics.lineStyle(3, 0x000000, 1);
        graphics.beginPath();
        graphics.arc(0, size * 0.1, size * 0.2, 0, Math.PI, false);
        graphics.strokePath();
        
        // 将图形转换为纹理
        const faceKey = 'default-face';
        if (!this.scene.textures.exists(faceKey)) {
            graphics.generateTexture(faceKey, size, size);
        }
        graphics.destroy();
        
        // 使用生成的纹理创建精灵
        this.face = this.scene.add.image(0, 0, faceKey);
        this.add(this.face);
    }

    /**
     * 移动角色到指定位置
     * @param {number} x - 目标X坐标
     * @param {number} y - 目标Y坐标
     * @param {Function} onComplete - 移动完成后的回调函数
     */
    moveTo(x, y, onComplete = null) {
        // 如果正在移动，先停止当前移动
        if (this.isMoving && this.moveTween) {
            this.moveTween.stop();
        }
        
        // 计算移动距离和时间
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        const duration = distance / CONFIG.character.moveSpeed * 1000; // 转换为毫秒
        
        // 创建移动补间动画
        this.isMoving = true;
        this.moveTween = this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: duration,
            ease: 'Power2',
            onComplete: () => {
                this.isMoving = false;
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * 增大角色尺寸
     * @returns {boolean} 是否成功改变大小
     */
    grow() {
        const newSize = this.currentSize * CONFIG.character.growFactor;
        
        if (newSize <= CONFIG.character.maxSize) {
            this.changeSize(newSize);
            return true;
        }
        
        return false;
    }

    /**
     * 减小角色尺寸
     * @returns {boolean} 是否成功改变大小
     */
    shrink() {
        const newSize = this.currentSize * CONFIG.character.shrinkFactor;
        
        if (newSize >= CONFIG.character.minSize) {
            this.changeSize(newSize);
            return true;
        }
        
        return false;
    }

    /**
     * 改变角色尺寸
     * @param {number} newSize - 新的尺寸大小
     */
    changeSize(newSize) {
        // 保存当前大小
        this.currentSize = newSize;
        
        // 创建尺寸变化的补间动画
        this.scene.tweens.add({
            targets: this,
            scale: newSize / CONFIG.character.defaultSize,
            duration: 300,
            ease: 'Bounce.Out'
        });
    }

    /**
     * 重置角色到初始状态
     */
    reset() {
        // 停止当前移动
        if (this.isMoving && this.moveTween) {
            this.moveTween.stop();
        }
        
        // 重置位置
        this.x = this.initialX;
        this.y = this.initialY;
        
        // 重置尺寸
        this.changeSize(CONFIG.character.defaultSize);
        
        // 重置状态
        this.isMoving = false;
    }
}
