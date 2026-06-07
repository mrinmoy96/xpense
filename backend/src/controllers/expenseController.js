const Expense = require('../models/Expense');

// ── GET /api/expenses ─────────────────────────────────────────────────────
exports.getExpenses = async (req, res, next) => {
  try {
    const {
      search, category, startDate, endDate,
      sortBy = 'date', order = 'desc',
      page = 1, limit = 20,
    } = req.query;

    // Build MongoDB filter
    const filter = { user: req.user._id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { note : { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    // Build sort
    const SORT_FIELDS = { date: 'date', amount: 'amount', title: 'title' };
    const sortField   = SORT_FIELDS[sortBy] || 'date';
    const sortOrder   = order === 'asc' ? 1 : -1;

    const skip  = (Number(page) - 1) * Number(limit);
    const lim   = Math.min(Number(limit), 100); // cap at 100

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(lim)
        .lean(),
      Expense.countDocuments(filter),
    ]);

    res.json({
      success: true,
      expenses,
      total,
      page   : Number(page),
      pages  : Math.ceil(total / lim),
      limit  : lim,
    });
  } catch (err) { next(err); }
};

// ── GET /api/expenses/:id ─────────────────────────────────────────────────
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    res.json({ success: true, expense });
  } catch (err) { next(err); }
};

// ── POST /api/expenses ────────────────────────────────────────────────────
exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note, tags } = req.body;
    const expense = await Expense.create({
      user: req.user._id, title, amount, category, date, note, tags,
    });
    res.status(201).json({ success: true, expense });
  } catch (err) { next(err); }
};

// ── PUT /api/expenses/:id ─────────────────────────────────────────────────
exports.updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note, tags } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount, category, date, note, tags },
      { new: true, runValidators: true }
    );
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    res.json({ success: true, expense });
  } catch (err) { next(err); }
};

// ── DELETE /api/expenses/:id ──────────────────────────────────────────────
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err) { next(err); }
};

// ── DELETE /api/expenses/bulk ─────────────────────────────────────────────
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ success: false, message: 'Provide an array of expense IDs.' });

    const result = await Expense.deleteMany({ _id: { $in: ids }, user: req.user._id });
    res.json({ success: true, message: `${result.deletedCount} expense(s) deleted.` });
  } catch (err) { next(err); }
};

// ── GET /api/expenses/export/csv ──────────────────────────────────────────
exports.exportCSV = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 }).lean();

    const header = 'Title,Amount,Category,Date,Note\n';
    const rows   = expenses.map(e =>
      [
        `"${e.title.replace(/"/g, '""')}"`,
        e.amount,
        e.category,
        new Date(e.date).toISOString().slice(0, 10),
        `"${(e.note || '').replace(/"/g, '""')}"`,
      ].join(',')
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="xpense-export.csv"');
    res.send(header + rows);
  } catch (err) { next(err); }
};
