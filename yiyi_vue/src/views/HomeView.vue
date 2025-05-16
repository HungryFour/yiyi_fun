<template>
  <div class="home-view">
    <div class="home-content">
      <div class="logo-container">
        <img src="../assets/images/logo.png" alt="YiYi Fun" class="logo">
      </div>
      
      <h1 class="title">一一学字母</h1>
      
      <div class="character-container">
        <img src="../assets/images/character1.png" alt="主角" class="character bounce">
      </div>
      
      <div class="player-form" v-if="!playerName">
        <input 
          type="text" 
          v-model="nameInput" 
          placeholder="请输入你的名字" 
          class="name-input"
          maxlength="10"
        >
        
        <div class="avatar-selector">
          <p class="avatar-title">选择一个头像：</p>
          <div class="avatars">
            <div 
              v-for="(avatar, index) in avatars" 
              :key="index"
              :class="['avatar-option', { 'selected': selectedAvatar === avatar }]"
              @click="selectedAvatar = avatar"
            >
              <img :src="avatar" alt="头像选项" class="avatar-img">
            </div>
          </div>
        </div>
        
        <button 
          class="btn start-btn"
          :disabled="!nameInput.trim() || !selectedAvatar" 
          @click="savePlayerInfo"
        >
          开始冒险
        </button>
      </div>
      
      <div class="menu-buttons" v-else>
        <button class="btn play-btn" @click="startGame">开始游戏</button>
        <button class="btn settings-btn" @click="goToSettings">游戏设置</button>
        <button class="btn change-player-btn" @click="changePlayer">切换玩家</button>
      </div>
      
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

const nameInput = ref('');
const selectedAvatar = ref('');
const avatars = [
  '../assets/images/avatar1.png',
  '../assets/images/avatar2.png',
  '../assets/images/avatar3.png',
  '../assets/images/avatar4.png',
];

// 从store获取玩家名称
const playerName = computed(() => gameStore.playerName);

onMounted(() => {
  // 初始化游戏配置
  gameStore.initGameConfig();
  
  // 如果已有玩家信息，设置默认值
  if (playerName.value) {
    nameInput.value = playerName.value;
    selectedAvatar.value = gameStore.playerAvatar || avatars[0];
  }
});

// 保存玩家信息
const savePlayerInfo = () => {
  if (nameInput.value.trim() && selectedAvatar.value) {
    gameStore.savePlayerInfo(nameInput.value.trim(), selectedAvatar.value);
  }
};

// 开始游戏
const startGame = () => {
  router.push('/game');
};

// 前往设置页面
const goToSettings = () => {
  router.push('/settings');
};

// 切换玩家
const changePlayer = () => {
  gameStore.savePlayerInfo('', '');
  nameInput.value = '';
  selectedAvatar.value = '';
};
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #bbdefb, #90caf9);
  overflow: hidden;
  position: relative;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 150px;
  height: auto;
}

.title {
  font-size: 3rem;
  color: #FF8A65;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  font-weight: 700;
  transform: rotate(-3deg);
}

.character-container {
  margin-bottom: 30px;
}

.character {
  width: 150px;
  height: auto;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.player-form {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.name-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1.1rem;
  border: 2px solid #90CAF9;
  border-radius: 10px;
  margin-bottom: 15px;
  outline: none;
  transition: border 0.3s;
}

.name-input:focus {
  border-color: #FF8A65;
}

.avatar-selector {
  margin-bottom: 20px;
}

.avatar-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #5D4037;
}

.avatars {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.avatar-option {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #FF8A65;
  box-shadow: 0 0 10px rgba(255, 138, 101, 0.6);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
}

.btn {
  font-size: 1.3rem;
  padding: 15px 20px;
}

.play-btn {
  background-color: #FF8A65;
}

.settings-btn {
  background-color: #64B5F6;
}

.change-player-btn {
  background-color: #7986CB;
}

.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.cloud {
  position: absolute;
  background: url('../assets/images/cloud.png') no-repeat;
  background-size: contain;
  opacity: 0.8;
}

.cloud-1 {
  width: 200px;
  height: 100px;
  top: 10%;
  left: -100px;
  animation: cloud-move-1 35s linear infinite;
}

.cloud-2 {
  width: 150px;
  height: 75px;
  top: 30%;
  left: -150px;
  animation: cloud-move-2 45s linear infinite;
}

.cloud-3 {
  width: 250px;
  height: 125px;
  top: 60%;
  left: -200px;
  animation: cloud-move-3 55s linear infinite;
}

@keyframes cloud-move-1 {
  0% { left: -200px; }
  100% { left: 100%; }
}

@keyframes cloud-move-2 {
  0% { left: -150px; }
  100% { left: 100%; }
}

@keyframes cloud-move-3 {
  0% { left: -250px; }
  100% { left: 100%; }
}
</style> 