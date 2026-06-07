const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining','Transport','Shopping','Entertainment',
  'Health','Utilities','Travel','Education','Housing','Other',
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'User', required: true, index: true,
    },
    title: {
      type: String, required: [true, 'Title is required'],
      trim: true, maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number, required: [true, 'Amount is required'],
      min : [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String, required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    date: {
      type: Date, required: [true, 'Date is required'], default: Date.now,
    },
    note: {
      type: String, trim: true, maxlength: [500, 'Note cannot exceed 500 characters'], default: '',
    },
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  {
    timestamps: true,
    toJSON   : { virtuals: true },
    toObject : { virtuals: true },
  }
);

// ── Compound indexes for fast user-scoped queries ─────────────────────────
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, amount: -1 });
// Text index for full-text search
expenseSchema.index({ title: 'text', note: 'text' });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
