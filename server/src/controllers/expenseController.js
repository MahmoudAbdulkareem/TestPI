const Expense = require('../models/expenses');

exports.getTopExpenses = async (req, res) => {
  try {
    const topExpenses = await Expense.find()
      .sort({ amount: -1 }) 
      .limit(5);

    res.status(200).json({ success: true, data: topExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
