//混合模型训练
class HybridModel {
    constructor(tfidfWeights, psychWeights) {
      this.tfidfWeights = tfidfWeights;
      this.psychWeights = psychWeights;
    }
  
    train(alpha = 0.5) {
      return this.tfidfWeights.map(doc => {
        return Object.keys(doc).reduce((acc, word) => {
          const tfidf = doc[word] || 0;
          const psych = this.psychWeights[word] || 0;
          acc[word] = alpha * tfidf + (1 - alpha) * psych;
          return acc;
        }, {});
      });
    }
  }
  
  module.exports = HybridModel;