// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  isRecurring: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  source: { type: String },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
