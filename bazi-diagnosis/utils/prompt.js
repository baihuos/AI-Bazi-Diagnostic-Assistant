//Prompt模板工程
class PromptTemplate {
    constructor(template) {
      this.template = template;
    }
  
    generate(data) {
      return this.template.replace(/{(\w+)}/g, (_, key) => data[key] || '');
    }
  }
  
  module.exports = PromptTemplate;