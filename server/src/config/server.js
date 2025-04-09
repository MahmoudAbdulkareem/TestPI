const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const profileRoutes = require('../routes/profileRoute');
const generateRoutes = require('../routes/generateRoute');
const bodyParser = require('body-parser');
const cors = require("cors");
const upload = require('../middlewares/uploadImage');
require('dotenv').config();
const tranRoutes = require('../routes/tranRoute');
const revenueRoute = require('../routes/revenueRoute'); // Import the revenue route
const mongoose = require('mongoose');
const dbConfig = require('./db');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const expenseRoutes = require('../routes/expenseRoutes');
const smsRoutes = require('../routes/smsRoute'); // Adjust the path if needed
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // generate
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
// Routes
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/export', generateRoutes);
app.use('/api/transactions', tranRoutes); 
app.use('/api/revenue', revenueRoute); 
app.use('/api/expenses', expenseRoutes);
app.use('/api/sms', smsRoutes);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
