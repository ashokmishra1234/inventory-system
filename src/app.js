const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const logRoutes = require('./routes/logRoutes');
const apiRoutes = require('./routes/apiRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all for Vercel deployment debugging
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Inventory Management API is running' });
});

// Master Router
const router = express.Router();
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/logs', logRoutes);
router.use('/payment', paymentRoutes);
router.use('/api', apiRoutes); // This was already named apiRoutes, maybe rename to miscRoutes? Or keep.  
// Note: apiRoutes likely contains /upload or similar. 

// Mount routes for both Localhost (root) and Vercel (/api prefix)
app.use('/api', router); // For Vercel: /api/auth/login -> Matches
app.use('/', router);    // For Localhost: /auth/login -> Matches

// Error Handling
app.use(errorHandler);

module.exports = app;
