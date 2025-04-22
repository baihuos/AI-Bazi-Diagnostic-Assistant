import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {} as UserInfo
  }),

  actions: {
    setToken(token: string) {
      this.token = token
      uni.setStorageSync('token', token)
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      uni.setStorageSync('userInfo', userInfo)
    },

    logout() {
      this.token = ''
      this.userInfo = {} as UserInfo
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({ url: '/pages/index/index' })
    },

    // 初始化从存储中加载用户状态
    loadFromStorage() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (token) {
        this.token = token
        this.userInfo = userInfo || {}
      }
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token
  }
})