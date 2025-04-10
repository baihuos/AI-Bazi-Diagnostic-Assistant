const express = require('express');
const router = express.Router();
const baziController = require('../controllers/baziController');
const { authMiddleware } = require('../middleware/auth');
const { baziValidationRules: baziRules, createRecordValidationRules, validate } = require('../middleware/validator');

console.log('baziController.createRecord:', baziController.createRecord);

router.post('/diagnose', authMiddleware, baziRules(), validate, baziController.diagnose);
router.get('/records', authMiddleware, baziController.getRecords);
router.post('/records', authMiddleware, createRecordValidationRules(), validate, baziController.createRecord);

module.exports = router;