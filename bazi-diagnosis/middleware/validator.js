const { body, validationResult } = require('express-validator');

// 登录验证规则
const loginValidationRules = () => [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
    body('code').optional().notEmpty().withMessage('微信登录 code 不能为空')
];

// 注册验证规则
const registerValidationRules = () => [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password')
        .notEmpty().withMessage('密码不能为空')
        .isLength({ min: 6 }).withMessage('密码长度至少为6位')
        .matches(/[A-Za-z]/).withMessage('密码必须包含字母')
        .matches(/\d/).withMessage('密码必须包含数字')
];

// 八字诊断验证规则
const baziValidationRules = () => [
    body('birthDate').notEmpty().withMessage('出生日期不能为空').isISO8601().withMessage('出生日期格式错误'),
    body('gender').isIn(['0', '1']).withMessage('性别必须为0（女）或1（男）')
];

// 支付验证规则
const paymentValidationRules = () => [
    body('orderNo').notEmpty().withMessage('订单号不能为空'),
    body('amount').isFloat({ min: 0 }).withMessage('金额必须为正数')
];

// 手动创建八字记录验证规则
const createRecordValidationRules = () => [
    body('birthDate').notEmpty().withMessage('出生日期不能为空').isISO8601().withMessage('出生日期格式错误'),
    body('dayMaster').notEmpty().withMessage('日主不能为空'),
    body('elements').isObject().withMessage('elements 必须为对象'),
    body('conflicts').isObject().withMessage('conflicts 必须为对象'),
    body('aiComment').notEmpty().withMessage('AI评论不能为空')
];

// 八字模拟验证规则
const baziSimulateValidationRules = () => [
    body('birthDate').notEmpty().withMessage('出生日期不能为空').isISO8601().withMessage('出生日期格式错误')
];

// 验证结果处理
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            message: errors.array()[0].msg,
            data: null
        });
    }
    next();
};

module.exports = { loginValidationRules, registerValidationRules, baziValidationRules, paymentValidationRules, createRecordValidationRules, baziSimulateValidationRules, validate };