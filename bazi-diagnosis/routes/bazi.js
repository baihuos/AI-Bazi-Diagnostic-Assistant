// 引入 Express、控制器和验证中间件
const express = require('express');
const router = express.Router();
const baziController = require('../controllers/baziController');
const { baziValidationRules, validate } = require('../middleware/validator');

// 八字诊断接口
router.post('/diagnose', baziValidationRules(), validate, baziController.diagnoseBazi);

module.exports = router;