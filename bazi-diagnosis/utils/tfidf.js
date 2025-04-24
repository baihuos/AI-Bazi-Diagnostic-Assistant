//TF-IDF计算
const math = require('mathjs');

class TFIDF {
  constructor(documents) {
    this.documents = documents;
  }

  computeTF(doc) {
    const words = doc.split(/\s+/);
    const wordCount = new Map();
    words.forEach(word => wordCount.set(word, (wordCount.get(word) || 0) + 1));
    return [...wordCount].reduce((acc, [word, count]) => {
      acc[word] = count / words.length;
      return acc;
    }, {});
  }

  computeIDF() {
    const totalDocs = this.documents.length;
    const docFreq = new Map();
    this.documents.forEach(doc => {
      new Set(doc.split(/\s+/)).forEach(word => {
        docFreq.set(word, (docFreq.get(word) || 0) + 1);
      });
    });
    return [...docFreq].reduce((acc, [word, count]) => {
      acc[word] = Math.log(totalDocs / (count + 1));
      return acc;
    }, {});
  }

  computeTFIDF() {
    const tf = this.documents.map(doc => this.computeTF(doc));
    const idf = this.computeIDF();
    return tf.map(docTF => {
      return Object.keys(docTF).reduce((acc, word) => {
        acc[word] = docTF[word] * (idf[word] || 0);
        return acc;
      }, {});
    });
  }
}

module.exports = TFIDF;