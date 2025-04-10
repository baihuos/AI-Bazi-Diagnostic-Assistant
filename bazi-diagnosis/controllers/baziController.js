const axios = require('axios');
const BaziAnalysis = require('../models/baziAnalysisModel');
const { calculateBazi } = require('../utils/baziEngine');
const logger = require('../config/logger');

const diagnose = async (req, res) => {
    const userId = req.auth.id;
    const { birthDate } = req.body;

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

        logger.info(`八字诊断成功，userId: ${userId}, 记录ID: ${analysisId}`);
        res.json({
            code: 200,
            message: "八字诊断成功",
            data: {
                analysisId,
                dayMaster,
                tenGods: { elements, conflicts },
                aiComment
            }
        });
    } catch (error) {
        logger.error(`八字诊断失败，userId: ${userId}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: "八字诊断失败，请重试",
            data: null
        });
    }
};

const getRecords = async (req, res) => {
    const userId = req.auth.id;

    try {
        const records = await BaziAnalysis.findByUserId(userId);
        logger.info(`获取八字记录列表成功，userId: ${userId}`);
        res.json({
            code: 200,
            message: "获取八字记录列表成功",
            data: records
        });
    } catch (error) {
        logger.error(`获取八字记录列表失败，userId: ${userId}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: "获取八字记录列表失败，请重试",
            data: null
        });
    }
};

const createRecord = async (req, res) => {
    const userId = req.auth.id;
    const { birthDate, dayMaster, elements, conflicts, aiComment } = req.body;

    try {
        if (!birthDate || !dayMaster || !elements || !conflicts || !aiComment) {
            return res.status(400).json({
                code: 400,
                message: "缺少必要字段（birthDate, dayMaster, elements, conflicts, aiComment）",
                data: null
            });
        }

        // 验证 elements 和 conflicts 是对象
        if (typeof elements !== 'object' || elements === null || Array.isArray(elements)) {
            return res.status(400).json({
                code: 400,
                message: "elements 必须为对象",
                data: null
            });
        }
        if (typeof conflicts !== 'object' || conflicts === null || Array.isArray(conflicts)) {
            return res.status(400).json({
                code: 400,
                message: "conflicts 必须为对象",
                data: null
            });
        }

        const analysisId = await BaziAnalysis.create({
            userId,
            birthDate,
            dayMaster,
            elements,
            conflicts,
            aiComment
        });

        logger.info(`手动创建八字记录成功，userId: ${userId}, 记录ID: ${analysisId}`);
        res.json({
            code: 200,
            message: "手动创建八字记录成功",
            data: { analysisId }
        });
    } catch (error) {
        logger.error(`手动创建八字记录失败，userId: ${userId}, 错误: ${error.message}`);
        res.status(500).json({
            code: 500,
            message: "手动创建八字记录失败，请重试",
            data: null
        });
    }
};

module.exports = { diagnose, getRecords, createRecord };