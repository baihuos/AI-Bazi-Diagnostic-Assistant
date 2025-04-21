//心理学词库模型
const db = require('../config/database');

class PsychDict {
  static async create(word, weight = 1.0, category = null) {
    const [result] = await db.query(
      'INSERT INTO psych_dict (word, weight, category) VALUES (?, ?, ?)',
      [word, weight, category]
    );
    return { id: result.insertId, word, weight, category };
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM psych_dict');
    return rows;
  }

  static async updateWeight(word, weight) {
    const [result] = await db.query(
      'UPDATE psych_dict SET weight = ? WHERE word = ?',
      [weight, word]
    );
    return result.affectedRows > 0;
  }
}

module.exports = PsychDict;