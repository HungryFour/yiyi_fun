/**
 * 语音管理工具
 * 使用Web Speech API播放字母发音
 */
class SpeechManager {
    /**
     * 初始化语音合成
     */
    static init() {
        // 检查浏览器是否支持语音合成
        this.isSpeechSupported = 'speechSynthesis' in window;
        
        if (this.isSpeechSupported) {
            console.log('语音合成已可用');
            
            // 预加载声音，获取可用声音
            window.speechSynthesis.onvoiceschanged = () => {
                this.voices = window.speechSynthesis.getVoices();
                // 选择英文声音
                this.englishVoice = this.voices.find(voice => 
                    voice.lang.includes('en-') && voice.localService
                ) || this.voices[0];
            };
            
            // 首次调用，确保尽早加载声音
            this.voices = window.speechSynthesis.getVoices();
            
            if (this.voices.length > 0) {
                this.englishVoice = this.voices.find(voice => 
                    voice.lang.includes('en-') && voice.localService
                ) || this.voices[0];
            }
        } else {
            console.warn('此浏览器不支持语音合成');
        }
    }
    
    /**
     * 播放字母发音
     * @param {string} letter - 要发音的字母
     * @param {Function} onEnd - 播放结束后的回调函数
     */
    static speakLetter(letter, onEnd = null) {
        if (!this.isSpeechSupported) {
            console.warn('语音合成不可用，无法朗读字母');
            if (onEnd) onEnd();
            return;
        }
        
        // 取消当前正在播放的声音
        window.speechSynthesis.cancel();
        
        // 创建新的语音请求
        const utterance = new SpeechSynthesisUtterance(letter);
        
        // 设置语音参数
        utterance.lang = 'en-US';
        utterance.rate = 0.8;  // 速度略微放慢，更适合儿童学习
        utterance.pitch = 1.2; // 音调略高，更适合儿童听觉
        utterance.volume = 1.0;
        
        // 如果找到了合适的声音，使用它
        if (this.englishVoice) {
            utterance.voice = this.englishVoice;
        }
        
        // 设置播放结束回调
        if (onEnd) {
            utterance.onend = onEnd;
        }
        
        // 播放声音
        window.speechSynthesis.speak(utterance);
    }
    
    /**
     * 显示字母并播放发音
     * @param {string} letter - 要发音的字母
     * @param {Function} onEnd - 播放结束后的回调函数
     */
    static speakAndShowLetter(letter, onEnd = null) {
        console.log(`播放字母: ${letter}`);
        this.speakLetter(letter, onEnd);
    }
}

// 初始化语音管理器
SpeechManager.init(); 