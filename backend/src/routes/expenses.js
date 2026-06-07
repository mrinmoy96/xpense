const express   = require('express');
const { body }  = require('express-validator');
const ctrl      = require('../controllers/expenseController');
const { protect }  = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
router.use(protect);  // all routes below require auth

const expenseRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category')
    .isIn(['Food & Dining','Transport','Shopping','Entertainment','Health','Utilities','Travel','Education','Housing','Other'])
    .withMessage('Invalid category'),
  body('date').isISO8601().withMessage('A valid date is required'),
];

// Specific routes BEFORE /:id
router.get   ('/export/csv',  ctrl.exportCSV);
router.delete('/bulk',        ctrl.bulkDelete);

router.get   ('/',            ctrl.getExpenses);
router.get   ('/:id',         ctrl.getExpense);
router.post  ('/',   expenseRules, validate, ctrl.createExpense);
router.put   ('/:id',expenseRules, validate, ctrl.updateExpense);
router.delete('/:id',              ctrl.deleteExpense);

module.exports = router;
