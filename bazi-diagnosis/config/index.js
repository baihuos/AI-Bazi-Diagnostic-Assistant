/**
 * @file config/index.js
 * @description 全局配置文件
 */

module.exports = {
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    rateLimit: {
        maxRequests: 3,
        ttl: 24 * 60 * 60, // 1天
        cleanupInterval: 6 * 60 * 60 * 1000 // 6小时
    },
    payment: {
        apiUrl: process.env.PAYMENT_API_URL || 'https://api.payment-service.com/initiate',
        apiKey: process.env.PAYMENT_API_KEY || 'your-payment-api-key',
        amount: 9.99,
        currency: 'USD'
    }
};