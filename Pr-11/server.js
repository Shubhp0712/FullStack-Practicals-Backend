const express = require('express');

const app = express();
const PORT = 3000;

// Home route - Dashboard page
app.get('/home', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dashboard</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: black;
                }
            
                h1 {
                    font-size: 3rem;
                    margin: 0;
                }
                p {
                    font-size: 1.2rem;
                    margin-top: 10px;
                    opacity: 0.9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Dashboard</h1>
                <p>Your project template is ready!</p>
            </div>
        </body>
        </html>
    `);
});

// Root route - redirect to home
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Dashboard available at: http://localhost:${PORT}/home`);
    console.log(`📋 Project template ready for team onboarding!`);
});