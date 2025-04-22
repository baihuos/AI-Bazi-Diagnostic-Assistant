// 引入日志
const logger = require('../config/logger');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const axios = require('axios'); // 用于调用支付接口
// 简单内存存储（实际项目中建议使用 Redis）
const requestCounts = {};

// 限制每日 3 次免费 API 调用
const rateLimiter = (req, res, next) => {
    const userId = req.auth ? req.auth.id : 'anonymous';
    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}:${today}`;

    if (!requestCounts[key]) {
        requestCounts[key] = 0;
    }

    requestCounts[key] += 1;

    if (requestCounts[key] > 3) {
        logger.warn(`用户 ${userId} 超过每日免费调用限制`);
        return res.status(429).json({ error: '超过每日免费调用限制（3次），请升级套餐' });
    }

    next();
};

module.exports = rateLimiter;