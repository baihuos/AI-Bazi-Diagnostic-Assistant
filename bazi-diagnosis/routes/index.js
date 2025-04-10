const express = require('express');
const axios = require('axios');
const router = express.Router();
const { calculateBazi } = require('../utils/baziEngine');
const BaziAnalysis = require('../models/baziAnalysisModel');
const logger = require('../config/logger');
const { authMiddleware } = require('../middleware/auth');
require('dotenv').config();

// 默认路由
router.get('/', (req, res) => {
    res.json({ message: '欢迎使用 AI 八字诊断助手 API' });
});

// 八字模拟分析路由（需要认证）
router.post('/bazi-simulate', authMiddleware, async (req, res) => {
    const { birthDate } = req.body;
    const userId = req.auth.id; // 从 JWT 获取用户 ID

    try {
        // 验证输入
        if (!birthDate) {
            return res.status(400).json({
                code: 400,
                message: '出生日期不能为空',
                data: null
            });
        }

        // 使用 baziEngine 计算八字基础数据
        const baziResult = calculateBazi(birthDate);
        const { dayMaster, elements, conflicts } = baziResult;

        // 调用 DeepSeek API 生成分析评论
        const prompt = `
            根据以下八字数据生成分析评论：
            - 日主: ${dayMaster}
            - 五行分布: ${JSON.stringify(elements)}
            - 五行冲突: ${JSON.stringify(conflicts)}
            请提供一段简短的命理分析，突出五行特点和建议。
        `;

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY 未配置');
        }

        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一个专业的八字命理分析专家。' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiComment = response.data.choices[0].message.content || 'AI分析暂时不可用';

        // 存储分析结果到数据库
        const analysisId = await BaziAnalysis.create({
            userId,
            birthDate,
            dayMaster,
            elements,
            conflicts,
            aiComment
        });

        // 返回结果
        logger.info(`八字模拟分析成功，userId: ${userId}, birthDate: ${birthDate}`);
        res.json({
            code: 200,
            message: '八字模拟分析成功',
            data: {
                analysisId,
                dayMaster,
                tenGods: { elements, conflicts },
                aiComment
            }
        });
    } catch (error) {
        logger.error(`八字模拟分析失败，userId: ${userId}, birthDate: ${birthDate}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: '八字模拟分析失败，请重试',
            data: null
        });
    }
});

module.exports = router;