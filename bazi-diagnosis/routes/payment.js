// 引入 Express、控制器和验证中间件
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { paymentValidationRules, validate } = require('../middleware/validator');

// 创建订单接口
router.post('/create-order', paymentValidationRules(), validate, paymentController.createOrder);

// 支付回调接口
router.post('/callback', paymentController.paymentCallback);

module.exports = router;