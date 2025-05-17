<template>
  <div class="dog-character-container">
    <div class="dog-character" :class="{ 'happy': isHappy, 'sad': isSad }">
      <img
        v-if="mood === 'happy'"
        src="/src/assets/images/success.png"
        alt="开心的小狗"
        class="dog-image"
      />
      <img
        v-else-if="mood === 'sad'"
        src="/src/assets/images/error.png"
        alt="难过的小狗"
        class="dog-image"
      />
      <img
        v-else
        src="/src/assets/images/normal.png"
        alt="普通的小狗"
        class="dog-image"
      />
    </div>
    <div class="speech-bubble" v-if="showSpeech">
      <span>{{ speechText }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  mood: {
    type: String,
    default: 'neutral', // 'neutral', 'happy', 'sad'
    validator: (value) => ['neutral', 'happy', 'sad'].includes(value)
  },
  speechText: {
    type: String,
    default: ''
  }
})

// 状态
const isHappy = ref(props.mood === 'happy')
const isSad = ref(props.mood === 'sad')
const showSpeech = ref(!!props.speechText)

// 监听心情变化
watch(() => props.mood, (newMood) => {
  isHappy.value = newMood === 'happy'
  isSad.value = newMood === 'sad'
  
  if (newMood === 'happy') {
    playHappyAnimation()
  } else if (newMood === 'sad') {
    playSadAnimation()
  }
})

// 监听语音文字变化
watch(() => props.speechText, (newSpeech) => {
  showSpeech.value = !!newSpeech
  
  if (newSpeech) {
    // 3秒后自动隐藏语音气泡
    setTimeout(() => {
      showSpeech.value = false
    }, 3000)
  }
})

// 高兴动画
function playHappyAnimation() {
  const dogCharacter = document.querySelector('.dog-character')
  
  gsap.to(dogCharacter, {
    rotation: 5,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  })
}

// 难过动画
function playSadAnimation() {
  const dogCharacter = document.querySelector('.dog-character')
  
  gsap.to(dogCharacter, {
    rotation: -5,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  })
}
</script>

<style scoped>
.dog-character-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.dog-character {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: bottom center;
}

.dog-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.8);
}

/* 语音气泡 */
.speech-bubble {
  position: absolute;
  bottom: -80px;
  width: 100%;
  text-align: center;
  background-color: white;
  padding: 10px 15px;
  border-radius: 20px;
  min-width: 100px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  animation: pop-in 0.3s;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  top: -8px;
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 名牌 */
.name-tag {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FF6B6B;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
}
</style> 