// 引入用户模型、日志和 JWT
const User = require('../models/userModel');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios'); // 引入 axios

// 用户注册
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 检查用户名是否已存在
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: "用户名已存在",
                data: null
            });
        }

        // 创建新用户
        const userId = await User.create({ username, password });

        // 获取新用户信息
        const user = await User.findById(userId);

        // 脱敏处理
        const safeUser = {
            id: user.id,
            username: user.username,
            phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null,
            balance: user.balance,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        logger.info(`用户注册成功，username: ${username}`);
        res.json({
            code: 200,
            message: "注册成功",
            data: safeUser
        });
    } catch (error) {
        logger.error(`用户注册失败，username: ${username}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: "注册失败，请重试",
            data: null
        });
    }
};

// 账号密码登录
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 查找用户
        const user = await User.findByUsername(username);
        console.log(user,1);
        if (!user) {
            return res.status(400).json({
                code: 400,
                message: "用户名或密码错误",
                data: null
            });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                code: 400,
                message: "用户名或密码错误",
                data: null
            });
        }

        // 生成 JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d' // 有效期 1 天
        });

        // 脱敏处理
        const safeUser = {
            id: user.id,
            username: user.username,
            phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null,
            balance: user.balance,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        logger.info(`用户登录成功，username: ${username}`);
        res.json({
            code: 200,
            message: "登录成功",
            data: {
                token,
                user: safeUser
            }
        });
    } catch (error) {
        logger.error(`登录失败，username: ${username}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: "登录失败，请重试",
            data: null
        });
    }
};

// 微信登录
exports.wxLogin = async (req, res) => {
    const { code } = req.body; // 前端传递 code 而不是 openid

    try {
        // 获取微信用户信息
        const wxUserInfo = await getWxUserInfo(code);
        const { openid } = wxUserInfo;

        // 查找用户
        let user = await User.findByOpenid(openid);
        if (!user) {
            // 如果用户不存在，创建新用户
            const userId = await User.create({
                openid,
                username: '微信用户'
            });
            user = await User.findById(userId);
        }

        // 生成 JWT
        const token = jwt.sign({ id: user.id, openid: user.openid }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // 脱敏处理
        const safeUser = {
            id: user.id,
            openid: user.openid,
            username: user.username,
            phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null,
            balance: user.balance,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        logger.info(`微信用户登录成功，openid: ${openid}`);
        res.json({
            code: 200,
            message: "登录成功",
            data: {
                token,
                user: safeUser
            }
        });
    } catch (error) {
        logger.error(`微信登录失败，错误: ${error.message}`);
        res.status(400).json({
            code: 400,
            message: "微信授权失败",
            data: null
        });
    }
};

// 微信绑定手机号
exports.bindPhone = async (req, res) => {
    const { encryptedData, iv, code } = req.body;
    const { id } = req.user; // 从 JWT 中获取用户信息

    try {
        // 解密手机号
        const phoneInfo = await decryptWxData(encryptedData, iv, code);
        const { phoneNumber } = phoneInfo;

        // 更新用户手机号
        await User.updatePhone(id, phoneNumber);

        logger.info(`用户绑定手机号成功，userId: ${id}`);
        res.json({
            code: 200,
            message: "绑定成功",
            data: {
                phone: phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
        });
    } catch (error) {
        logger.error(`绑定手机号失败，userId: ${id}, 错误: ${error.message}`);
        res.status(400).json({
            code: 400,
            message: "手机号绑定失败",
            data: null
        });
    }
};

// 获取微信用户信息
async function getWxUserInfo(code) {
    // TODO: 实现微信登录，调用微信接口获取用户信息
    // 这里需要调用微信官方接口
    // 返回示例：{ openid: 'xxx', ... }
}

// 解密微信数据
async function decryptWxData(encryptedData, iv, code) {
    // TODO: 实现微信数据解密
    // 这里需要使用微信官方提供的解密方法
    // 返回示例：{ phoneNumber: 'xxx', ... }
}