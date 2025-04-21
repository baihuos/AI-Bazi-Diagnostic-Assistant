const express = require('express');
const axios = require('axios');
const router = express.Router();
const { calculateBazi } = require('../utils/baziEngine');
const BaziAnalysis = require('../models/baziAnalysisModel');
const logger = require('../config/logger');
const { authMiddleware } = require('../middleware/auth');
const { baziSimulateValidationRules, validate } = require('../middleware/validator');
require('dotenv').config();

router.get('/', (req, res) => {
    res.json({ message: '欢迎使用 AI 八字诊断助手 API' });
});

router.post('/bazi-simulate', authMiddleware, baziSimulateValidationRules(), validate, async (req, res) => {
    const { birthDate } = req.body;
    const userId = req.auth.id;

    try {
        const baziResult = calculateBazi(birthDate);
        const { dayMaster, elements, conflicts } = baziResult;

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

        const analysisId = await BaziAnalysis.create({
            userId,
            birthDate,
            dayMaster,
            elements,
            conflicts,
            aiComment
        });

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