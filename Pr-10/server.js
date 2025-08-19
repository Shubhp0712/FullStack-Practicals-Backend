const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Route to display log file content
app.get('/', (req, res) => {
    const logFilePath = path.join(__dirname, 'logs', 'serverlog.txt');

    // Check if file exists
    if (!fs.existsSync(logFilePath)) {
        return res.status(404).send(`
            <h1>❌ Error</h1>
            <p>Log file not found: ${logFilePath}</p>
        `);
    }

    try {
        // Read file content
        const logContent = fs.readFileSync(logFilePath, 'utf8');

        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Server Log Viewer</title>
        <style>
            body { 
                font-family: 'Courier New', monospace; 
                background: #f5f5f5; 
                margin: 20px; 
                line-height: 1.6;
            }
            // ... more CSS
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📋 Server Log Viewer</h1>
            <p><strong>File:</strong> logs/serverlog.txt</p>
            <p><strong>Size:</strong> ${fs.statSync(logFilePath).size} bytes</p>
            <p><strong>Last Modified:</strong> ${fs.statSync(logFilePath).mtime}</p>
            <hr>
            <div class="log-content">${formatLogContent(logContent)}</div>
        </div>
    </body>
    </html>
`);

    } catch (error) {
        res.status(500).send(`
            <h1>❌ Server Error</h1>
            <p>Cannot read log file: ${error.message}</p>
        `);
    }
});
app.get('/raw', (req, res) => {
    const logFilePath = path.join(__dirname, 'logs', 'serverlog.txt');

    if (!fs.existsSync(logFilePath)) {
        return res.status(404).send('Log file not found');
    }

    try {
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        res.type('text/plain').send(logContent);
    } catch (error) {
        res.status(500).send('Error reading log file: ' + error.message);
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Log Viewer running on http://localhost:${PORT}`);
    console.log(`📁 Reading logs from: ${path.join(__dirname, 'logs', 'serverlog.txt')}`);
    console.log(`🔍 Raw logs available at: http://localhost:${PORT}/raw`);
});