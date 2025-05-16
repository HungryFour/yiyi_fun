<template>
  <div 
    class="letter-biscuit"
    :class="{ 'is-target': isTarget && showHint }"
    :style="style"
    @click="handleClick"
  >
    <div class="biscuit-inner">
      <span class="letter">{{ letter }}</span>
    </div>
    <div class="biscuit-shadow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  letter: {
    type: String,
    required: true
  },
  isTarget: {
    type: Boolean,
    default: false
  },
  showHint: {
    type: Boolean,
    default: false
  },
  posX: {
    type: Number,
    required: true
  },
  posY: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['click'])

// 计算样式
const style = computed(() => {
  // 考虑元素本身大小的一半进行居中显示
  return {
    left: `calc(${props.posX * 100}% - 45px)`,
    top: `calc(${props.posY * 100}% - 45px)`
  }
})

// 点击处理
const handleClick = () => {
  // 播放点击动画
  const element = document.querySelector('.letter-biscuit')
  
  gsap.to(element, {
    scale: 1.2,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  })
  
  emit('click')
}
</script>

<style scoped>
.letter-biscuit {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #FFE0B2;
  border: 5px solid #FFCC80;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: all 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 6; /* 提高z-index高于导航栏 */

  /* 饼干纹理 */
  background-image: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.2) 2px,
    transparent 3px
  ), radial-gradient(
    circle at 70% 40%,
    rgba(255, 255, 255, 0.2) 2px,
    transparent 3px
  ), radial-gradient(
    circle at 40% 70%,
    rgba(255, 255, 255, 0.2) 2px,
    transparent 3px
  ), radial-gradient(
    circle at 20% 20%,
    rgba(0, 0, 0, 0.05) 2px,
    transparent 3px
  ), radial-gradient(
    circle at 60% 80%,
    rgba(0, 0, 0, 0.05) 2px,
    transparent 3px
  );
}

.biscuit-inner {
  width: 80%;
  height: 80%;
  background-color: #FFE0B2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.1);
  border: 3px solid #FFCC80;
  overflow: hidden;
  z-index: 1;
}

.biscuit-inner:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 50%);
  pointer-events: none;
}

.biscuit-shadow {
  position: absolute;
  bottom: -5px;
  left: 5%;
  width: 90%;
  height: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  z-index: -1;
}

.letter {
  font-size: 36px;
  font-weight: bold;
  color: #5D4037;
}

.letter-biscuit:hover {
  transform: scale(1.1);
}

.letter-biscuit:active {
  transform: scale(0.95);
}

/* 目标字母提示样式 */
.letter-biscuit.is-target .biscuit-inner {
  background-color: #FFD54F;
  border-color: #FFB300;
  box-shadow: 0 0 15px #FFD54F;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .letter-biscuit {
    width: 70px;
    height: 70px;
  }
  
  .letter {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .letter-biscuit {
    width: 60px;
    height: 60px;
  }
  
  .letter {
    font-size: 24px;
  }
}
</style> 