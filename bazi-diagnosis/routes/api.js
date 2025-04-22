const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AncientText = require('../models/ancientText');
const PsychDict = require('../models/psychDict');
const SensitiveWords = require('../models/sensitiveWords');
const BaziResult = require('../models/baziResult');
const TFIDF = require('../utils/tfidf');
const HybridModel = require('../utils/hybridModel');
const SensitiveFilter = require('../utils/filter');
const WeightAdjuster = require('../utils/weightAdjust');
const PromptTemplate = require('../utils/prompt');
const { randomCode, sendCode } = require("../utils/getMessage");
const router = express.Router();

// 八字分析接口
router.post('/bazi-analyze', async (req, res) => {
  const { bazi } = req.body; // 用户输入的八字，如“甲子乙丑丙寅丁卯”

  try {
    // (1) 获取古籍数据
    const ancientTexts = await AncientText.getAll();
    const documents = ancientTexts.map(text => text.content);

    // (2) TF-IDF 特征提取
    const tfidf = new TFIDF(documents);
    const tfidfWeights = tfidf.computeTFIDF();

    // (3) 获取心理学词库权重
    const psychWords = await PsychDict.getAll();
    const psychWeights = psychWords.reduce((acc, { word, weight }) => {
      acc[word] = weight;
      return acc;
    }, {});

    // (4) 混合模型训练
    const model = new HybridModel(tfidfWeights, psychWeights);
    const hybridResults = model.train(0.6); // alpha 可调

    // (5) 结果验证（简单示例：假设预期结果为心理学权重）
    const expected = psychWords.map(w => ({ [w.word]: w.weight }));
    const accuracy = hybridResults.reduce((acc, res, i) => {
      const sim = cosineSimilarity(res, expected[i] || {});
      return acc + sim;
    }, 0) / hybridResults.length;

    // (6) Prompt 模板生成分析文本
    const template = new PromptTemplate(
      '根据八字 {bazi}，结合古籍分析，你的性格特征为 {trait}，情感倾向为 {emotion}。'
    );
    const analysisText = template.generate({
      bazi,
      trait: Object.keys(hybridResults[0])[0] || '坚韧', // 示例特征
      emotion: Object.keys(psychWeights)[0] || '平和'   // 示例情感
    });

    // (7) 敏感词过滤
    const filter = new SensitiveFilter();
    await filter.loadFromDB(db);
    const filteredText = filter.filter(analysisText);

    // (8) 动态权重调节（假设用户反馈“情感”权重过低）
    const adjuster = new WeightAdjuster(psychWeights);
    adjuster.adjust('平和', 1.2); // 提高权重
    await PsychDict.updateWeight('平和', adjuster.getWeights()['平和']);

    // (9) 保存结果
    const result = await BaziResult.create(bazi, filteredText);

    res.json({
      analysis: filteredText,
      modelAccuracy: accuracy,
      resultId: result.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '分析失败' });
  }
});

// 余弦相似度计算（用于结果验证）
function cosineSimilarity(vec1, vec2) {
  const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dot = 0, norm1 = 0, norm2 = 0;
  for (let key of keys) {
    const v1 = vec1[key] || 0;
    const v2 = vec2[key] || 0;
    dot += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  }
  return dot / (Math.sqrt(norm1) * Math.sqrt(norm2)) || 0;
}

router.post("/codeLogin", (req, res) => {
  let phone = req.body.phone
  let yzmcode = randomCode(4);
  sendCode(phone, yzmcode, function (success) {
      if (success) {
          res.send({
              code: 200,
              msg: '短信验证码发送成功',
              data: yzmcode,
          })

      } else {
          res.send("短信验证码发送失败");
      }
  })
})

// 用户注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // 验证输入
      if (!username || !password) {
          return res.status(400).json({ message: '请填写用户名和密码' });
      }

      // 检查用户名是否已存在
      const [existingUsers] = await pool.query(
          'SELECT * FROM user_login WHERE username = ?',
          [username]
      );
      if (existingUsers.length > 0) {
          return res.status(400).json({ message: '用户名已存在' });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 插入用户
      await pool.query(
          'INSERT INTO user_login (username, password) VALUES (?, ?)',
          [username, hashedPassword]
      );

      res.status(201).json({ message: '注册成功' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      // 验证输入
      if (!username || !password) {
          return res.status(400).json({ message: '请填写用户名和密码' });
      }
      // 检查用户是否存在
      const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length === 0) {
          return res.status(400).json({ message: '用户不存在' });
      }
      const user = users[0];
      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: '密码错误' });
      }
      // 生成 JWT
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });
      res.json({
        code: 200,
        message: '登录成功',
        data: {
            token,
            userInfo: { id: user.id, username: user.username }
        }
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: '服务器错误' });
  }
});
router.get('/example', (req, res) => {
  res.json({
      message: 'API调用成功',
      rateLimitInfo: res.locals.rateLimitInfo
  });
});
module.exports = router;

