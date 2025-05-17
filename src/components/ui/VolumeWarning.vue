<template>
  <transition name="fade">
    <div class="volume-warning" v-if="show">
      <div class="warning-icon">🔊</div>
      <div class="warning-text">
        <slot>音量太小或已静音，可能听不到字母发音！</slot>
      </div>
      <button class="warning-close" @click="$emit('close')">×</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.volume-warning {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 0, 0.9);
  color: #333;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  max-width: 80%;
  z-index: 9999;
}

.warning-icon {
  font-size: 24px;
  margin-right: 10px;
  animation: pulse 2s infinite;
}

.warning-text {
  font-weight: bold;
  flex: 1;
}

.warning-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  padding: 0 0 0 10px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style> 