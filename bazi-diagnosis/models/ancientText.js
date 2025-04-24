//古籍数据模型
const db = require('../config/database');

class AncientText {
  static async create(title, content, features = {}) {
    const [result] = await db.query(
      'INSERT INTO ancient_texts (title, content, features) VALUES (?, ?, ?)',
      [title, content, JSON.stringify(features)]
    );
    return { id: result.insertId, title, content, features };
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM ancient_texts');
    return rows;
  }
}

module.exports = AncientText;