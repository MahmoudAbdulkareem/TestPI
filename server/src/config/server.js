const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const bodyParser = require('body-parser');
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
