<template>
    <view>
        <div class="input-bz-container">
            <!-- 顶部导航栏 -->
            <div class="top-bar">
                <div class="left-section">
                    <button class="nav-button" @click="handleBack">
                        <i class="nav-icon">←</i>
                    </button>
                </div>
                <div class="center-section">
                    <div class="remaining-count">
                        剩余次数: {{ remainingCount }}
                        <button class="add-count-button" @click="handleAddCount">
                            <span class="add-icon">+</span>
                        </button>
                    </div>
                </div>
                <div class="right-section">
                    <button class="nav-button">
                        <i class="nav-icon">⟳</i>
                    </button>
                    <button class="nav-button" @click="showMoreOptions = true">
                        <i class="nav-icon">⋯</i>
                    </button>
                </div>
            </div>
            <!--广告区-->
            <view>
                <Upgrade />
            </view>

            <!--更多功能-->
            <div v-if="showMoreOptions" class="more-options-modal" @click="closeMoreOptions">
                <div class="modal-content" @click.stop>
                    <div class="modal-options">
                        <button class="option-button" @click="handleVoiceSpeed">
                            <i class="option-icon">🔊</i>
                            <span>语音速度</span>
                        </button>
                        <button class="option-button" @click="handleShare">
                            <i class="option-icon">📤</i>
                            <span>分享</span>
                        </button>
                        <button class="option-button delete" @click="handleDelete">
                            <i class="option-icon">🗑️</i>
                            <span>删除</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 合并提示词和对话区域 -->
            <div class="content-area">
                <!-- 提示词区域 -->
                <div class="suggestions-section">
                    <div class="suggestions-card">
                        <div class="card-header">
                            至真至诚，感而遂通，心无旁骛，卦象自明
                        </div>
                        <div class="suggestions">
                            <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item"
                                @click="handleSuggestionClick(suggestion)">
                                {{ suggestion }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 对话区域 -->
                <div class="messages-area">
                    <div v-for="(message, index) in messages" :key="index" class="message">
                        <div class="message-content">
                            {{ message }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 输入框区域 -->
            <div class="input-area" :class="{ 'keyboard-active': isKeyboardVisible }">
                <div class="input-wrapper">
                    <input ref="inputRef" v-model="currentInput" class="main-input" type="text" placeholder="请输入生辰八字或运势？"
                        readonly @click="showKeyboard" @keydown="handleKeyDown" />
                    <button class="submit-button" @click="handleSubmit">
                        <span class="submit-icon">↑</span>
                    </button>
                </div>
            </div>

            <!-- 键盘弹出层 -->
            <div v-if="isKeyboardVisible" class="keyboard-overlay" @click="hideKeyboard">
                <div class="keyboard-section" @click.stop>
                    <div class="keyboard-content">
                        <div class="keyboard-row">
                            <button class="key-button" v-for="key in firstRow" :key="key" @click="handleKeyPress(key)">
                                {{ key }}
                            </button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key-button" v-for="key in secondRow" :key="key" @click="handleKeyPress(key)">
                                {{ key }}
                            </button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key-button shift-key" @click="handleKeyPress('shift')">⇧</button>
                            <button class="key-button" v-for="key in thirdRow" :key="key" @click="handleKeyPress(key)">
                                {{ key }}
                            </button>
                            <button class="key-button backspace-key" @click="handleKeyPress('backspace')">⌫</button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key-button number-key" @click="handleKeyPress('123')">123</button>
                            <button class="key-button emoji-key" @click="handleKeyPress('emoji')">😊</button>
                            <button class="key-button space-key" @click="handleKeyPress('space')">space</button>
                            <button class="key-button voice-key">
                                🎤
                            </button>
                            <button class="key-button go-key" @click="handleSubmit">Go</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </view>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Upgrade from '@/components/Upgrade.vue'

export default defineComponent({
    name: 'InputBz',
    setup() {
        const remainingCount = ref(1)
        const currentInput = ref('')
        const isShift = ref(false)
        const isKeyboardVisible = ref(false)
        const showMoreOptions = ref(false)
        const inputRef = ref<HTMLInputElement | null>(null)
        const messages = ref<string[]>([])
        const isRecording = ref(false)
        const recorderManager = uni.getRecorderManager()

        const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
        const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
        const thirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

        const suggestions = [
            '我最近的财运怎么样？',
            '今年能找到工作吗？',
            '这段关系会不会有结果',
        ]

    

        const stopRecording = () => {
            if (isRecording.value) {
                isRecording.value = false
                recorderManager.stop()
            }
        }

        const showKeyboard = () => {
            isKeyboardVisible.value = true
            if (inputRef.value) {
                inputRef.value.focus()
            }
        }

        const hideKeyboard = () => {
            isKeyboardVisible.value = false
        }

        const handleBack = () => {
            console.log('Back button clicked')
        }

        const handleSuggestionClick = (suggestion: string) => {
            currentInput.value = suggestion
            showKeyboard()
        }

        const handleKeyPress = (key: string) => {
            switch (key) {
                case 'backspace':
                    currentInput.value = currentInput.value.slice(0, -1)
                    break
                case 'space':
                    currentInput.value += ' '
                    break
                case 'shift':
                    isShift.value = !isShift.value
                    break
                case '123':
                case 'emoji':
                    console.log(`${key} clicked`)
                    break
                default:
                    currentInput.value += isShift.value ? key.toUpperCase() : key
                    break
            }
        }

        const handleSubmit = () => {
            if (currentInput.value.trim() && remainingCount.value > 0) {
                messages.value.push(currentInput.value.trim())
                currentInput.value = ''
                hideKeyboard()
                remainingCount.value -= 1
            } else if (remainingCount.value <= 0) {
                uni.showToast({
                    title: '剩余次数不足，请添加次数',
                    icon: 'none',
                    duration: 2000
                })
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSubmit()
            }
        }

        const handleAddCount = () => {
            console.log('Add count clicked')
        }

        const closeMoreOptions = () => {
            showMoreOptions.value = false
        }

        const handleVoiceSpeed = () => {
            console.log('Voice speed clicked')
        }

        const handleShare = () => {
            console.log('Share clicked')
        }

        const handleDelete = () => {
            console.log('Delete clicked')
        }

        return {
            remainingCount,
            currentInput,
            suggestions,
            firstRow,
            secondRow,
            thirdRow,
            isKeyboardVisible,
            showMoreOptions,
            inputRef,
            messages,
            isRecording,
            handleBack,
            handleSuggestionClick,
            handleKeyPress,
            handleSubmit,
            handleKeyDown,
            showKeyboard,
            hideKeyboard,
            handleAddCount,
            closeMoreOptions,
            handleVoiceSpeed,
            handleShare,
            handleDelete,
            stopRecording
        }
    }
})
</script>

<style scoped>
.input-bz-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #000;
    color: #fff;
    position: relative;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #000;
    height: 44px;
}

.left-section,
.right-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.nav-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.nav-icon {
    font-size: 18px;
    line-height: 1;
}

.center-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
}

.remaining-count {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

.add-count-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background-color: #6366f1;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s ease;
}

.add-count-button:hover {
    background-color: #4f46e5;
}

.add-icon {
    font-size: 14px;
    line-height: 1;
}

.right-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-bottom: 80px;
}

.suggestions-section {
    padding: 0;
    margin-bottom: 20px;
}

.suggestions-card {
    background-color: #1a1a1a;
    border-radius: 12px;
    padding: 20px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.card-header {
    color: #8b8bf4;
    background: linear-gradient(to right, #8b8bf4, #a5a6f6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 15px;
    text-align: center;
    margin-bottom: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    letter-spacing: 0.5px;
    padding: 0 10px;
}

.suggestions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.suggestion-item {
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: #fff;
}

.suggestion-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.messages-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
}

.message {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
}

.message-content {
    max-width: 80%;
    padding: 12px 16px;
    background-color: #6366f1;
    border-radius: 16px 16px 0 16px;
    color: white;
    font-size: 15px;
    line-height: 1.4;
    word-break: break-word;
}

.input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    padding: 8px 0;
    transition: transform 0.3s ease;
    z-index: 100;
}

.input-area.keyboard-active {
    transform: translateY(-260px);
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 16px;
    background-color: #1c1c1e;
    border-radius: 20px;
    padding: 2px;
}

.main-input {
    width: 100%;
    padding: 10px 40px 10px 16px;
    border-radius: 20px;
    font-size: 15px;
    background-color: transparent;
    color: #fff;
    border: none;
    outline: none;
}

.main-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.submit-button {
    position: absolute;
    right: 8px;
    background-color: #6366f1;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
}

.submit-icon {
    font-size: 14px;
    transform: translateY(-1px);
}

.keyboard-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
}

.keyboard-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #2c2c2e;
    padding-bottom: env(safe-area-inset-bottom, 0);
    z-index: 100;
}

.keyboard-content {
    padding: 8px 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.keyboard-row {
    display: flex;
    justify-content: center;
    margin-bottom: 6px;
    gap: 5px;
    padding: 0 2px;
}

.key-button {
    flex: 1;
    height: 42px;
    border: none;
    background-color: #2c2c2e;
    border-radius: 6px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
}

.key-button:active {
    background-color: #3c3c3e;
}

.shift-key,
.backspace-key {
    flex: 1.5;
    font-size: 20px;
}

.number-key,
.emoji-key,
.voice-key {
    flex: 0.8;
    font-size: 16px;
}

.space-key {
    flex: 2;
    font-size: 16px;
}

.go-key {
    flex: 0.8;
    background-color: #6366f1;
    font-size: 16px;
}

.more-options-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-top: 50px;
    padding-right: 10px;
}

.modal-content {
    width: 160px;
    background-color: #2c2c2e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-options {
    padding: 8px;
}

.option-button {
    width: 100%;
    padding: 8px;
    margin-bottom: 4px;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
}

.option-button:last-child {
    margin-bottom: 0;
}

.option-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.option-button.delete {
    color: #ff453a;
}

.option-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
}

.voice-key {
    position: relative;
    transition: all 0.3s ease;
}

.voice-key.recording {
    background-color: #6366f1;
}

.recording-indicator {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #ff453a;
    border-radius: 50%;
    right: 4px;
    top: 4px;
}

.recording-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
}

.recording-modal {
    background-color: #2c2c2e;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.recording-wave {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #6366f1;
    animation: pulse 1.5s ease-in-out infinite;
}

.recording-text {
    color: #fff;
    font-size: 16px;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
    }
    
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 16px rgba(99, 102, 241, 0);
    }
    
    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
}
</style>
