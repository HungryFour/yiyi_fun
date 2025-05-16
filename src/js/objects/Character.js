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
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        
        this.scene = scene;
        this.initialX = x;
        this.initialY = y;
        
        // 加载小狗图像
        if (!scene.textures.exists('dog-image')) {
            scene.load.image('dog-image', 'src/assets/images/dog.png');
            scene.load.once('complete', () => {
                this.createDogCharacter();
            });
            scene.load.start();
        } else {
            this.createDogCharacter();
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
     * 创建小狗角色
     */
    createDogCharacter() {
        const size = CONFIG.character.defaultSize * 1.5; // 小狗图像稍大一些
        
        // 创建小狗图片
        this.dogImage = this.scene.add.image(0, 0, 'dog-image');
        this.dogImage.setDisplaySize(size, size);
        
        // 添加到容器
        this.add(this.dogImage);
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
