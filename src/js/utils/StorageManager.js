/**
 * 存储管理工具
 * 用于管理游戏中的本地存储数据
 */
class StorageManager {
    /**
     * 保存数据到本地存储
     * @param {string} key - 存储键名
     * @param {any} data - 要存储的数据
     */
    static saveData(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    /**
     * 从本地存储读取数据
     * @param {string} key - 存储键名
     * @param {any} defaultValue - 如果未找到数据时的默认值
     * @returns {any} 存储的数据或默认值
     */
    static loadData(key, defaultValue = null) {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return defaultValue;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }

    /**
     * 从本地存储中删除数据
     * @param {string} key - 要删除的存储键名
     */
    static removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }

    /**
     * 清除所有本地存储数据
     */
    static clearAllData() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清除所有数据失败:', error);
            return false;
        }
    }

    /**
     * 保存玩家名称
     * @param {string} name - 玩家名称
     */
    static savePlayerName(name) {
        return this.saveData(CONFIG.storage.playerName, name);
    }

    /**
     * 获取玩家名称
     * @returns {string} 玩家名称或空字符串
     */
    static getPlayerName() {
        return this.loadData(CONFIG.storage.playerName, '');
    }

    /**
     * 保存玩家头像（Base64编码的图片数据）
     * @param {string} avatarData - 头像图片的Base64数据
     */
    static savePlayerAvatar(avatarData) {
        return this.saveData(CONFIG.storage.playerAvatar, avatarData);
    }

    /**
     * 获取玩家头像
     * @returns {string|null} 头像的Base64数据或null
     */
    static getPlayerAvatar() {
        return this.loadData(CONFIG.storage.playerAvatar, null);
    }

    /**
     * 保存游戏设置
     * @param {Object} settings - 游戏设置对象
     */
    static saveGameSettings(settings) {
        return this.saveData(CONFIG.storage.gameSettings, settings);
    }

    /**
     * 获取游戏设置
     * @returns {Object} 游戏设置对象或默认设置
     */
    static getGameSettings() {
        return this.loadData(CONFIG.storage.gameSettings, CONFIG.defaultSettings);
    }
}
