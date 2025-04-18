class SensitiveFilter {
  constructor() {
    this.sensitiveWords = new Set();
  }

  async loadFromDB(db) {
    const [rows] = await db.query('SELECT word FROM sensitive_words');
    rows.forEach(row => this.sensitiveWords.add(row.word));
  }

  filter(text) {
    let filtered = text;
    this.sensitiveWords.forEach(word => {
      filtered = filtered.replace(new RegExp(word, 'gi'), '***');
    });
    return filtered;
  }
}

module.exports = SensitiveFilter;