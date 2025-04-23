/**
 * @file utils/errors.js
 * @description 自定义错误类
 */

/**
 * 速率限制错误
 */
class RateLimitError extends Error {
    constructor(code, data) {
        super('Rate limit exceeded');
        this.name = 'RateLimitError';
        this.code = code;
        this.data = data;
    }
}

/**
 * 服务器内部错误
 */
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
        this.code = 'INTERNAL_SERVER_ERROR';
    }
}

module.exports = { RateLimitError, InternalServerError };