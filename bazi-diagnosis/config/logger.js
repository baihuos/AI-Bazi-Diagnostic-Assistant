// 日志配置
// 引入 winston
const winston = require('winston');

// 创建日志记录器
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // 错误日志
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // 综合日志
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// 如果是开发环境，添加控制台输出
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;