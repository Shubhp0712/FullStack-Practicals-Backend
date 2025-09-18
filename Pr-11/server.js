const express = require('express');
const path = require('path');
const app = express();
const port = 3011;

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`🚀 SocialChat Server`);
    console.log(`📱 Running on http://localhost:${port}`);
    console.log(`⏰ Started at ${new Date().toLocaleString()}`);
    console.log('-------------------------------------------');
    console.log('📋 Features:');
    console.log('   ✅ Firebase Authentication');
    console.log('   ✅ Google OAuth Login');
    console.log('   ✅ Real-time Chat');
    console.log('   ✅ Multiple Chat Rooms');
    console.log('   ✅ Online Users List');
    console.log('   ✅ Emoji Picker');
    console.log('   ✅ Typing Indicators');
    console.log('   ✅ Modern UI Design');
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