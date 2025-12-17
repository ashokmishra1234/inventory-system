const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const logRoutes = require('./routes/logRoutes');
const apiRoutes = require('./routes/apiRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Inventory Management API is running' });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/logs', logRoutes);
app.use('/api', apiRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
