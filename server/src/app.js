const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute');
const dbConfig = require('./config/db');
require('dotenv').config();
const generateRoutes = require('./routes/generateRoute'); 
const tranRoutes = require('./routes/tranRoute');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
dbConfig();

// Routes
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/export', generateRoutes);  // Register the routes
app.use('/api/transactions', tranRoutes); 

// Start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));