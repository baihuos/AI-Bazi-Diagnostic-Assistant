//存储八字分析结果
const db = require('../config/database');

class BaziResult {
  static async create(baziInput, analysisText) {
    const [result] = await db.query(
      'INSERT INTO bazi_results (bazi_input, analysis_text) VALUES (?, ?)',
      [baziInput, analysisText]
    );
    return { id: result.insertId, baziInput, analysisText };
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM bazi_results WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = BaziResult;