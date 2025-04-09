const Transaction = require('../models/revenue');
const moment = require('moment');

// Fetch financial data based on period and category
const getFinancialOverview = async (req, res) => {
  const { period, category } = req.params;  // Adding category as a param for more flexibility
  const dateRange = getDateRange(period);
  
  if (!dateRange) {
    return res.status(400).send({ message: 'Invalid time period selected' });
  }

  try {
    // Modify the category filter to match the dynamic categories from the database
    const transactions = await Transaction.aggregate([
      {
        $match: { 
          date: { $gte: dateRange.start, $lte: dateRange.end },
          category: { $regex: new RegExp(category, 'i') },  // Use regex for flexible matching
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalAmount: { $sum: "$amount" },  // Sum amounts for the selected category
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedData = {
      labels: transactions.map(t => t._id),  // Dates
      revenue: transactions.map(t => t.totalAmount),  // Sum of revenue for each day
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching financial overview:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Helper function for date range based on period
const getDateRange = (period) => {
  switch (period) {
    case 'last7':
      return { start: moment().subtract(7, 'days').toDate(), end: moment().toDate() };
    case 'last30':
      return { start: moment().subtract(30, 'days').toDate(), end: moment().toDate() };
    case 'thisMonth':
      return { start: moment().startOf('month').toDate(), end: moment().endOf('month').toDate() };
    case 'lastMonth':
      return { start: moment().subtract(1, 'month').startOf('month').toDate(), end: moment().subtract(1, 'month').endOf('month').toDate() };
    default:
      return null;
  }
};

module.exports = { getFinancialOverview };
