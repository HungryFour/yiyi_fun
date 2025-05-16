<template>
  <div class="countdown-container">
    <div class="countdown-label">时间</div>
    <div class="countdown-bar">
      <div 
        class="countdown-progress"
        :style="{ width: `${percentage}%` }"
        :class="{ 'warning': percentage <= 30 }"
      ></div>
    </div>
    <div class="countdown-value">{{ formatTime(currentTime) }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentTime: {
    type: Number,
    required: true
  },
  maxTime: {
    type: Number,
    required: true
  }
})

// 计算百分比
const percentage = computed(() => {
  return (props.currentTime / props.maxTime) * 100
})

// 格式化时间
function formatTime(ms) {
  const seconds = Math.ceil(ms / 1000)
  return `${seconds}秒`
}
</script>

<style scoped>
.countdown-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.countdown-label {
  font-weight: bold;
  color: var(--text-color);
  font-size: 1rem;
}

.countdown-bar {
  height: 16px;
  width: 150px;
  background-color: #E0E0E0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  position: relative;
}

.countdown-progress {
  height: 100%;
  background-color: var(--secondary-color);
  border-radius: 8px;
  transition: width 0.3s linear;
  background-image: linear-gradient(45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  animation: countdown-stripes 1s linear infinite;
}

.countdown-progress.warning {
  background-color: var(--warning-color);
}

.countdown-value {
  font-weight: bold;
  min-width: 50px;
  text-align: center;
  color: var(--text-color);
}

@keyframes countdown-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}
</style> 