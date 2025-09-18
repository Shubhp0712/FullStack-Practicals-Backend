const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to validate numbers
function isValidNumber(num) {
    return !isNaN(num) && num !== '' && num !== null && num !== undefined;
}

// Helper function to perform calculations
function calculate(num1, num2, operation) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    switch (operation) {
        case 'add':
            return n1 + n2;
        case 'subtract':
            return n1 - n2;
        case 'multiply':
            return n1 * n2;
        case 'divide':
            if (n2 === 0) {
                throw new Error('Cannot divide by zero!');
            }
            return n1 / n2;
        default:
            throw new Error('Invalid operation');
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('calculator', { 
        result: null, 
        error: null, 
        num1: '', 
        num2: '', 
        operation: '',
        history: []
    });
});

// Test route for CSS
app.get('/test-css', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CSS Test</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>CSS Test Page</h1>
            <p>If you see colorful styling, CSS is working!</p>
        </body>
        </html>
    `);
});

app.post('/calculate', (req, res) => {
    const { num1, num2, operation } = req.body;
    let result = null;
    let error = null;
    let history = req.session?.history || [];

    try {
        // Validate inputs
        if (!num1 || !num2) {
            throw new Error('Please enter both numbers!');
        }

        if (!isValidNumber(num1) || !isValidNumber(num2)) {
            throw new Error('Please enter valid numbers only!');
        }

        if (!operation) {
            throw new Error('Please select an operation!');
        }

        // Perform calculation
        result = calculate(num1, num2, operation);
        
        // Round result to 2 decimal places if it's a decimal
        if (result % 1 !== 0) {
            result = Math.round(result * 100) / 100;
        }

        // Add to history (keep last 5 calculations)
        const calculation = {
            num1: parseFloat(num1),
            num2: parseFloat(num2),
            operation,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        history.unshift(calculation);
        if (history.length > 5) {
            history = history.slice(0, 5);
        }

    } catch (err) {
        error = err.message;
    }

    res.render('calculator', { 
        result, 
        error, 
        num1: num1 || '', 
        num2: num2 || '', 
        operation: operation || '',
        history
    });
});

// Clear history route
app.post('/clear-history', (req, res) => {
    res.render('calculator', { 
        result: null, 
        error: null, 
        num1: '', 
        num2: '', 
        operation: '',
        history: []
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('calculator', { 
        result: null, 
        error: 'Something went wrong! Please try again.', 
        num1: '', 
        num2: '', 
        operation: '',
        history: []
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
            <h1 style="color: #ff6b6b;">404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style="color: #4ecdc4; text-decoration: none;">Go back to Calculator</a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`🧮 Kids Calculator is running on http://localhost:${PORT}`);
    console.log(`📚 Ready to help kids learn math!`);
});
