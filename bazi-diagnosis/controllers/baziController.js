// 引入用户档案模型和日志
const UserProfile = require('../models/userProfileModel');
const logger = require('../config/logger');


// 处理八字诊断请求
exports.diagnoseBazi = async (req, res) => {
    const userId = req.auth.id; // 从 JWT 中获取用户 ID
    const { name, gender, birthDate } = req.body;

    try {
        // 保存用户档案
        await UserProfile.create(userId, name, gender, birthDate);

        // 简单模拟八字诊断结果（实际项目中需要调用八字解析引擎）
        const baziResult = {
            dayMaster: '甲',
            elements: { 金: 1.2, 木: 0.8, 水: 0.5, 火: 0.3, 土: 0.7 },
            comment: '你的八字显示木元素较强，适合从事创意行业。'
        };

        logger.info(`八字诊断成功，用户ID: ${userId}`);
        res.json({ result: baziResult });
    } catch (error) {
        logger.error(`八字诊断失败，用户ID: ${userId}, 错误: ${error.message}`);
        res.status(500).json({ error: '诊断失败，请重试' });
    }
};