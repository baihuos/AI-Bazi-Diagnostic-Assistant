//敏感词模型
const db = require('../config/database');

class SensitiveWords {
  static async create(word, level = 1) {
    const [result] = await db.query(
      'INSERT INTO sensitive_words (word, level) VALUES (?, ?)',
      [word, level]
    );
    return { id: result.insertId, word, level };
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM sensitive_words');
    return rows;
  }
}

module.exports = SensitiveWords;