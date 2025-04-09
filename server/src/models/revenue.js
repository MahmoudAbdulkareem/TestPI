const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, enum: ['Fixed', 'Variable', 'Miscellaneous'], required: true },
  amount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
