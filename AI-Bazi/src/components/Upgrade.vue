<template>
  <div class="upgrade-container">
    <div class="ad-message">
      看完广告视频再问1个问题
    </div>
    <div class="button-group">
      <button class="upgrade-btn video-btn">
        <span class="btn-text">看视频</span>
      </button>
      <button class="upgrade-btn invite-btn">
        <span class="btn-text">邀请好友</span>
      </button>
      <button class="upgrade-btn unlimited-btn">
        <span class="btn-text">无限</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Upgrade',
  data() {
    return {}
  }
}
</script>

<style scoped>
.upgrade-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.ad-message {
  font-size: 16px;
  color: #333;
  text-align: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
}

.upgrade-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-btn {
  background-color: #4CAF50;
  color: white;
}

.invite-btn {
  background-color: #2196F3;
  color: white;
}

.unlimited-btn {
  background-color: #FF9800;
  color: white;
}

.upgrade-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.upgrade-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 16px;
}
</style>
