/**
 * @file rateLimiter.js
 * @description API速率限制中间件，限制免费用户每日请求次数，显示剩余次数，超限时触发支付接口
 * @author [Your Name]
 */

const Redis = require('ioredis');
const axios = require('axios');
const logger = require('./config/logger');
const { RateLimitError, InternalServerError } = require('./utils/error');
const config = require('./config'); // 配置文件

// Redis客户端
const redis = new Redis(config.redis.url, {
    retryStrategy: (times) => Math.min(times * 50, 2000), // 重试策略
    maxRetriesPerRequest: 3
});

// 全局配置
const RATE_LIMIT_CONFIG = {
    maxRequests: parseInt(process.env.MAX_REQUESTS) || config.rateLimit.maxRequests || 3,
    ttl: parseInt(process.env.TTL) || config.rateLimit.ttl || 24 * 60 * 60, // 默认1天
    prefix: 'rate:'
};

/**
 * 初始化支付请求
 * @param {string} userId - 用户ID
 * @param {string} ip - 用户IP
 * @returns {Promise<{success: boolean, paymentUrl?: string, error?: string}>} 支付结果
 */
const initiatePayment = async (userId, ip) => {
    try {
        // 替换为实际支付服务（如Stripe、PayPal、支付宝）
        const response = await axios.post(
            config.payment.apiUrl,
            {
                userId,
                ip,
                amount: config.payment.amount,
                currency: config.payment.currency,
                description: 'API套餐升级'
            },
            {
                headers: {
                    Authorization: `Bearer ${config.payment.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );

        logger.info({ userId, paymentId: response.data.paymentId }, '支付请求发起成功');
        return {
            success: true,
            paymentUrl: response.data.paymentUrl
        };
    } catch (error) {
        logger.error({ userId, error: error.message }, '支付接口调用失败');
        return {
            success: false,
            error: 'PAYMENT_INIT_FAILED'
        };
    }
};

/**
 * 速率限制中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
const rateLimiter = async (req, res, next) => {
    try {
        // 用户标识（优先使用认证ID，匿名用户使用IP）
        const userId = req.auth?.id || `anonymous:${req.ip}`;
        if (!userId) {
            throw new InternalServerError('无效的用户标识');
        }

        const today = new Date().toUTCString().split(' ')[1].slice(0, 11); // 例如 "21 Apr 2025"
        const key = `${RATE_LIMIT_CONFIG.prefix}${userId}:${today}`;

        // Redis管道操作，减少网络往返
        const pipeline = redis.pipeline();
        pipeline.incr(key);
        pipeline.ttl(key);
        const [[, count], [, ttl]] = await pipeline.exec();

        // 为新键设置过期时间
        if (count === 1) {
            await redis.expire(key, RATE_LIMIT_CONFIG.ttl);
        }

        // 计算剩余请求次数
        const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - count);

        // 设置响应头部
        res.set({
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests,
            'X-RateLimit-Remaining': remaining,
            'X-RateLimit-Reset': ttl > 0 ? ttl : RATE_LIMIT_CONFIG.ttl
        });

        // 检查是否超限
        if (count > RATE_LIMIT_CONFIG.maxRequests) {
            logger.warn({ userId, count }, '用户超过每日免费调用限制');

            const paymentResponse = await initiatePayment(userId, req.ip);
            if (!paymentResponse.success) {
                throw new RateLimitError('RATE_LIMIT_EXCEEDED', {
                    remaining: 0,
                    paymentError: paymentResponse.error
                });
            }

            throw new RateLimitError('RATE_LIMIT_EXCEEDED', {
                remaining: 0,
                paymentUrl: paymentResponse.paymentUrl
            });
        }

        // 附加速率限制信息到响应
        res.locals.rateLimitInfo = {
            limit: RATE_LIMIT_CONFIG.maxRequests,
            remaining,
            reset: ttl > 0 ? ttl : RATE_LIMIT_CONFIG.ttl
        };

        next();
    } catch (error) {
        logger.error({ error: error.message, userId: req.auth?.id }, '速率限制器错误');
        if (error instanceof RateLimitError) {
            return res.status(429).json({
                code: error.code,
                message: '超过每日免费调用限制（' + RATE_LIMIT_CONFIG.maxRequests + '次）',
                data: error.data
            });
        }
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: '服务器内部错误'
        });
    }
};

/**
 * 定期清理旧的Redis键
 */
const startCleanupJob = () => {
    setInterval(async () => {
        try {
            const keys = await redis.keys(`${RATE_LIMIT_CONFIG.prefix}*`);
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
                .toUTCString()
                .split(' ')[1]
                .slice(0, 11);
            const pipeline = redis.pipeline();
            for (const key of keys) {
                if (key.includes(yesterday)) {
                    pipeline.del(key);
                }
            }
            await pipeline.exec();
            logger.info({ count: keys.length }, '清理旧速率限制键完成');
        } catch (error) {
            logger.error({ error: error.message }, '清理旧键失败');
        }
    }, config.rateLimit.cleanupInterval || 6 * 60 * 60 * 1000); // 默认6小时
};

// 启动清理任务
startCleanupJob();

module.exports = rateLimiter;