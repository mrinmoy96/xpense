const mongoose = require('mongoose');
const Expense  = require('../models/Expense');

// ── GET /api/dashboard/summary ────────────────────────────────────────────
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(),     1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(),     0, 23, 59, 59, 999);
    const startOf6Months   = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalAgg,
      thisMonthAgg,
      lastMonthAgg,
      categoryAgg,
      recentExpenses,
      monthlyTrend,
      topExpenses,
    ] = await Promise.all([

      // All-time total + count
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // This month
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfThisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // Last month
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // Breakdown by category (all-time)
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $project: { _id: 0, category: '$_id', total: 1, count: 1 } },
      ]),

      // 5 most recent transactions
      Expense.find({ user: userId })
        .sort({ date: -1 })
        .limit(5)
        .lean(),

      // Monthly totals — last 6 months
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOf6Months } } },
        {
          $group: {
            _id  : { year: { $year: '$date' }, month: { $month: '$date' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id  : 0,
            month: {
              $concat: [
                { $toString: '$_id.year' }, '-',
                { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
              ],
            },
            total: 1,
            count: 1,
          },
        },
      ]),

      // Top 5 largest individual expenses
      Expense.find({ user: userId })
        .sort({ amount: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalSpent        = totalAgg[0]?.total      || 0;
    const totalTransactions = totalAgg[0]?.count      || 0;
    const monthlySpent      = thisMonthAgg[0]?.total  || 0;
    const monthlyCount      = thisMonthAgg[0]?.count  || 0;
    const lastMonthSpent    = lastMonthAgg[0]?.total  || 0;
    const avgPerTransaction = totalTransactions ? Math.round(totalSpent / totalTransactions) : 0;

    const monthChange = lastMonthSpent
      ? Math.round(((monthlySpent - lastMonthSpent) / lastMonthSpent) * 1000) / 10
      : null;

    res.json({
      success: true,
      summary: {
        totalSpent,
        totalTransactions,
        monthlySpent,
        monthlyTransactions : monthlyCount,
        lastMonthSpent,
        monthChange,
        avgPerTransaction,
        categoryBreakdown   : categoryAgg,
        recentExpenses,
        monthlyTrend,
        topExpenses,
      },
    });
  } catch (err) { next(err); }
};
