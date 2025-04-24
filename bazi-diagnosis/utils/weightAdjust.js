//动态权重调节
class WeightAdjuster {
  constructor(initialWeights) {
    this.weights = initialWeights;
  }

  adjust(word, factor) {
    if (this.weights[word]) {
      this.weights[word] *= factor;
    }
  }

  getWeights() {
    return this.weights;
  }
}

module.exports = WeightAdjuster;