const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Basic middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Simple routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to our site</h1><p>Server is running successfully!</p>');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to our site', status: 'success' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;