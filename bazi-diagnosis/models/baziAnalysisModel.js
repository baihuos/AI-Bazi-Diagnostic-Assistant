const pool = require('../config/database');
const logger = require('../config/logger');

const BaziAnalysis = {
    async create({ userId, birthDate, dayMaster, elements, conflicts, aiComment }) {
        try {
            const tenGods = { elements, conflicts };
            const mysqlDateTime = new Date(birthDate).toISOString().replace('T', ' ').replace('Z', '');
            const [result] = await pool.query(
                'INSERT INTO user_analysis (user_id, birth_datetime, day_master, ten_gods, ai_comment, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, mysqlDateTime, dayMaster, JSON.stringify(tenGods), aiComment, 'free']
            );
            logger.info(`创建八字分析记录成功，userId: ${userId}, 记录ID: ${result.insertId}`);
            return result.insertId;
        } catch (error) {
            logger.error(`创建八字分析记录失败，userId: ${userId}, 错误: ${error.message}`);
            throw error;
        }
    },

    async findByUserId(userId) {
        try {
            const [rows] = await pool.query('SELECT * FROM user_analysis WHERE user_id = ? ORDER BY created_at DESC', [userId]);
            return rows.map(row => {
                let tenGods;
                try {
                    tenGods = JSON.parse(row.ten_gods);
                } catch (parseError) {
                    logger.error(`解析 ten_gods 失败，userId: ${userId}, 数据: ${row.ten_gods}, 错误: ${parseError.message}`);
                    tenGods = { elements: {}, conflicts: {} }; // 默认值
                }
                return {
                    id: row.id,
                    userId: row.user_id,
                    birthDate: row.birth_datetime,
                    dayMaster: row.day_master,
                    tenGods,
                    aiComment: row.ai_comment,
                    paymentStatus: row.payment_status,
                    createdAt: row.created_at,
                };
            });
        } catch (error) {
            logger.error(`获取八字分析记录失败，userId: ${userId}, 错误: ${error.message}`);
            throw error;
        }
    }
};

module.exports = BaziAnalysis;