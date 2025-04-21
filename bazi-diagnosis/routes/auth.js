// 引入 Express、控制器和验证中间件
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidationRules,registerValidationRules, validate } = require('../middleware/validator');

// 用户注册
router.post('/register', registerValidationRules(), validate, authController.register);
// 账号密码登录
router.post('/login', loginValidationRules(), validate, authController.login);

// 微信登录
router.post('/wx-login', loginValidationRules(), validate, authController.wxLogin);

// 微信绑定手机号
router.post('/bind-phone', authController.bindPhone);

module.exports = router;