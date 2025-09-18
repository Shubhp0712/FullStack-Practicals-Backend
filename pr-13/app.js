const express = require('express');
const path = require('path');
const app = express();
const port = 3013;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).render('form', {
    error: 'Something went wrong! Please try again.',
    title: 'Professional Income Calculator',
    year: new Date().getFullYear()
  });
});

// Route to render the form
app.get('/', (req, res) => {
  try {
    res.render('form', {
      error: null,
      title: 'Professional Income Calculator',
      year: new Date().getFullYear()
    });
  } catch (error) {
    console.error('Error rendering form:', error);
    res.status(500).send('Error loading the form');
  }
});

// Route to handle form submission and show result
app.post('/submit', (req, res) => {
  try {
    const { income1, income2, taxRate } = req.body;

    // Validate input
    if (!income1 || !income2 || !taxRate) {
      return res.render('form', {
        error: 'Please provide all required values (both income sources and tax rate)',
        title: 'Professional Income Calculator',
        year: new Date().getFullYear()
      });
    }

    const parsedIncome1 = parseFloat(income1);
    const parsedIncome2 = parseFloat(income2);
    const parsedTaxRate = parseFloat(taxRate);

    // Check if values are valid numbers
    if (isNaN(parsedIncome1) || isNaN(parsedIncome2) || isNaN(parsedTaxRate)) {
      return res.render('form', {
        error: 'Please enter valid numeric values for all fields',
        title: 'Professional Income Calculator',
        year: new Date().getFullYear()
      });
    }

    // Check for negative values
    if (parsedIncome1 < 0 || parsedIncome2 < 0) {
      return res.render('form', {
        error: 'Income values cannot be negative',
        title: 'Professional Income Calculator',
        year: new Date().getFullYear()
      });
    }

    // Check tax rate range
    if (parsedTaxRate < 0 || parsedTaxRate > 100) {
      return res.render('form', {
        error: 'Tax rate must be between 0% and 100%',
        title: 'Professional Income Calculator',
        year: new Date().getFullYear()
      });
    }

    // Calculate gross income
    const grossIncome = parsedIncome1 + parsedIncome2;

    // Calculate tax amount
    const taxAmount = (grossIncome * parsedTaxRate) / 100;

    // Calculate net income after tax
    const netIncome = grossIncome - taxAmount;

    // Additional calculations for insights
    const data = {
      income1: parsedIncome1,
      income2: parsedIncome2,
      taxRate: parsedTaxRate,
      grossIncome: grossIncome,
      taxAmount: taxAmount,
      netIncome: netIncome,
      totalIncome: grossIncome, // Keep for backward compatibility
      monthlyGross: grossIncome / 12,
      monthlyNet: netIncome / 12,
      weeklyGross: grossIncome / 52,
      weeklyNet: netIncome / 52,
      primaryPercentage: (parsedIncome1 / grossIncome) * 100,
      secondaryPercentage: (parsedIncome2 / grossIncome) * 100,
      effectiveTaxRate: (taxAmount / grossIncome) * 100,
      calculatedAt: new Date().toLocaleString()
    };

    res.render('result', data);
  } catch (error) {
    console.error('Error in calculation:', error);
    res.render('form', {
      error: 'An error occurred during calculation. Please try again.',
      title: 'Professional Income Calculator',
      year: new Date().getFullYear()
    });
  }
});

// API endpoint for AJAX calculations
app.post('/api/calculate', (req, res) => {
  try {
    const { income1, income2 } = req.body;

    const parsedIncome1 = parseFloat(income1);
    const parsedIncome2 = parseFloat(income2);

    if (isNaN(parsedIncome1) || isNaN(parsedIncome2)) {
      return res.status(400).json({
        error: 'Invalid numeric values provided'
      });
    }

    if (parsedIncome1 < 0 || parsedIncome2 < 0) {
      return res.status(400).json({
        error: 'Income values cannot be negative'
      });
    }

    const totalIncome = parsedIncome1 + parsedIncome2;

    res.json({
      success: true,
      data: {
        income1: parsedIncome1,
        income2: parsedIncome2,
        totalIncome: totalIncome,
        monthlyAverage: totalIncome / 12,
        weeklyAverage: totalIncome / 52,
        primaryPercentage: (parsedIncome1 / totalIncome) * 100,
        secondaryPercentage: (parsedIncome2 / totalIncome) * 100
      }
    });
  } catch (error) {
    console.error('API calculation error:', error);
    res.status(500).json({
      error: 'Server error during calculation'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('form', {
    error: 'Page not found. Please use the form below.',
    title: 'Professional Income Calculator',
    year: new Date().getFullYear()
  });
});

// Start server with error handling
app.listen(port, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 Professional Income Calculator Server`);
  console.log(`📊 Running on http://localhost:${port}`);
  console.log(`⏰ Started at ${new Date().toLocaleString()}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`🎨 EJS templates from: ${path.join(__dirname, 'views')}`);
  console.log('-------------------------------------------');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});