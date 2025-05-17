<template>
  <div 
    class="letter-biscuit"
    :class="[
      { 'is-target': isTarget && showHint },
      `shape-${actualShape}`
    ]"
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
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
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
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'star', 'heart', 'mixed'].includes(value)
  }
})

const emit = defineEmits(['click'])
const isMobile = ref(window.innerWidth <= 768)
const isPortrait = ref(window.innerHeight > window.innerWidth)
const biscuitSize = ref(isMobile.value ? (window.innerWidth <= 480 ? 60 : 70) : 90)
const gameAreaRef = ref(null)

// 确定实际使用的形状
const actualShape = computed(() => {
  return props.shape || 'circle'
})

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // 获取游戏区域元素
  setTimeout(() => {
    gameAreaRef.value = document.querySelector('.game-area')
  }, 100)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  isPortrait.value = window.innerHeight > window.innerWidth
  biscuitSize.value = isMobile.value ? (window.innerWidth <= 480 ? 60 : 70) : 90
  
  // 更新游戏区域引用
  gameAreaRef.value = document.querySelector('.game-area')
}

// 计算样式
const style = computed(() => {
  const halfSize = biscuitSize.value / 2
  
  // 确保字母不超出游戏区域边界
  // 添加边距防止字母靠得太近边缘
  const margin = biscuitSize.value / 2
  
  if (isPortrait.value) {
    // 获取游戏区域的尺寸（竖屏模式）
    let gameAreaWidth = window.innerWidth - 20 // 默认值
    let gameAreaHeight = window.innerHeight * 0.6 // 默认值
    
    // 如果能获取到游戏区域的真实尺寸，则使用真实尺寸
    if (gameAreaRef.value) {
      gameAreaWidth = gameAreaRef.value.clientWidth
      gameAreaHeight = gameAreaRef.value.clientHeight
    }
    
    // 计算可用区域（考虑边距）
    const availableWidth = gameAreaWidth - biscuitSize.value - margin
    const availableHeight = gameAreaHeight - biscuitSize.value - margin
    
    // 计算位置，确保不超出边界
    let x = margin + props.posX * availableWidth
    let y = margin + props.posY * availableHeight
    
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -50%)'
    }
  } else {
    // 横屏模式
    // 获取游戏区域的尺寸
    let gameAreaWidth = window.innerWidth // 默认值
    let gameAreaHeight = window.innerHeight - 150 // 默认值，减去大约的头部高度
    
    // 如果能获取到游戏区域的真实尺寸，则使用真实尺寸
    if (gameAreaRef.value) {
      gameAreaWidth = gameAreaRef.value.clientWidth
      gameAreaHeight = gameAreaRef.value.clientHeight
    }
    
    // 计算可用区域（考虑边距）
    const availableWidth = gameAreaWidth - biscuitSize.value - margin
    const availableHeight = gameAreaHeight - biscuitSize.value - margin
    
    // 计算位置，确保不超出边界
    let x = margin + props.posX * availableWidth
    let y = margin + props.posY * availableHeight
    
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`
    }
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition: all 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 6; /* 提高z-index高于导航栏 */
}

/* 圆形饼干 */
.letter-biscuit.shape-circle {
  border-radius: 50%;
  background-color: #FFE0B2;
  border: 5px solid #FFCC80;
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

/* 星形饼干 */
.letter-biscuit.shape-star {
  background-color: #EA9518;
  border: none;
  width: 90px;
  height: 90px;
  position: relative;
  transform: scale(0.9);
  box-shadow: none;
}

.letter-biscuit.shape-star {
  /* 使用SVG path数据 - 五角星路径 */
  mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg t='1747410376426' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='17047' width='48' height='48'%3E%3Cpath d='M559.826357 38.096844l114.290533 234.930541c6.349474 19.048422 25.397896 31.74737 44.446319 31.74737l247.629488 38.096844c50.795792 6.349474 69.844215 69.844215 31.74737 107.941059L820.154794 634.947406c-12.698948 12.698948-19.048422 31.74737-19.048422 57.145267l44.446318 260.328436c6.349474 50.795792-44.446318 88.892637-82.543163 63.494741l-222.231592-120.640008c-19.048422-6.349474-38.096844-6.349474-57.145266 0L261.401076 1015.91585c-44.446318 25.397896-95.242111-12.698948-82.543162-63.494741l44.446318-260.328436c6.349474-19.048422 0-38.096844-19.048422-57.145267L20.121062 444.463184c-38.096844-31.74737-19.048422-95.242111 31.74737-101.591585l247.629489-38.096844c19.048422 0 38.096844-12.698948 44.446318-31.74737L458.234772 38.096844c19.048422-50.795792 82.543163-50.795792 101.591585 0z m0 0' fill='%23EA9518' p-id='17048'%3E%3C/path%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

/* 心形饼干 */
.letter-biscuit.shape-heart {
  background-color: #FF8FA6;
  border: none;
  width: 90px;
  height: 90px;
  position: relative;
  transform: scale(0.9);
  box-shadow: none;
}

.letter-biscuit.shape-heart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  clip-path: path('M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z');
}

.letter-biscuit.shape-heart {
  /* 使用SVG path数据 - 材料设计图标的心形路径 */
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'/%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.biscuit-inner {
  width: 80%;
  height: 80%;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
    position: absolute;
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

/* 竖屏特殊样式，确保字母饼干在游戏区域内 */
@media (orientation: portrait) {
  .letter-biscuit {
    position: absolute;
    margin: 0;
    z-index: 7;
  }
}
</style>