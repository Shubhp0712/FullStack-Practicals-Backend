const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3015;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'library-portal-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        secure: false
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mock user database
const users = [
    { id: 1, username: 'alice', password: 'password123', name: 'Alice Johnson', email: 'alice@library.com', memberSince: '2023-01-15' },
    { id: 2, username: 'bob', password: 'secure456', name: 'Bob Smith', email: 'bob@library.com', memberSince: '2023-03-22' },
    { id: 3, username: 'carol', password: 'mypass789', name: 'Carol Williams', email: 'carol@library.com', memberSince: '2023-06-10' },
    { id: 4, username: 'admin', password: 'admin123', name: 'Library Administrator', email: 'admin@library.com', memberSince: '2022-12-01' }
];

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login?error=Please log in to access this page');
    }
};

// Routes

// Home route
app.get('/', (req, res) => {
    res.render('index', {
        title: 'City Library Portal',
        user: req.session.user || null,
        currentTime: new Date().toLocaleString()
    });
});

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }

    res.render('login', {
        title: 'Login - City Library Portal',
        error: req.query.error || null,
        message: req.query.message || null
    });
});

// Login POST
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login', {
            title: 'Login - City Library Portal',
            error: 'Please enter both username and password',
            message: null
        });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            memberSince: user.memberSince,
            loginTime: new Date().toISOString(),
            loginTimeFormatted: new Date().toLocaleString(),
            sessionId: req.sessionID
        };

        console.log(`✅ User logged in: ${user.name} at ${req.session.user.loginTimeFormatted}`);
        res.redirect('/profile');
    } else {
        res.render('login', {
            title: 'Login - City Library Portal',
            error: 'Invalid username or password. Please try again.',
            message: null
        });
    }
});

// Profile page
app.get('/profile', requireAuth, (req, res) => {
    const sessionDuration = Date.now() - new Date(req.session.user.loginTime).getTime();
    const durationMinutes = Math.floor(sessionDuration / (1000 * 60));
    const durationSeconds = Math.floor((sessionDuration % (1000 * 60)) / 1000);

    res.render('profile', {
        title: 'Profile - City Library Portal',
        user: req.session.user,
        sessionDuration: `${durationMinutes}m ${durationSeconds}s`,
        currentTime: new Date().toLocaleString(),
        sessionInfo: {
            sessionId: req.sessionID,
            maxAge: req.session.cookie.maxAge,
            expiresAt: new Date(Date.now() + req.session.cookie.maxAge).toLocaleString()
        }
    });
});

// Logout
app.get('/logout', (req, res) => {
    const userName = req.session.user ? req.session.user.name : 'Unknown user';

    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error destroying session:', err);
            return res.redirect('/profile?error=Logout failed');
        }

        console.log(`🚪 User logged out: ${userName} at ${new Date().toLocaleString()}`);
        res.clearCookie('connect.sid');
        res.redirect('/login?message=Successfully logged out');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n📚 ===== CITY LIBRARY PORTAL ===== 📚`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Click here to open: http://localhost:${PORT}`);
    console.log(`\n📋 Available Routes:`);
    console.log(`   🏠 Home:      http://localhost:${PORT}/`);
    console.log(`   🔐 Login:     http://localhost:${PORT}/login`);
    console.log(`   👤 Profile:   http://localhost:${PORT}/profile`);
    console.log(`   🚪 Logout:    http://localhost:${PORT}/logout`);
    console.log(`\n👥 Test Accounts:`);
    console.log(`   Username: alice    | Password: password123`);
    console.log(`   Username: bob      | Password: secure456`);
    console.log(`   Username: carol    | Password: mypass789`);
    console.log(`   Username: admin    | Password: admin123`);
    console.log(`\n🔑 Session Features:`);
    console.log(`   ✅ Session creation on login`);
    console.log(`   ✅ Login time tracking`);
    console.log(`   ✅ Session duration display`);
    console.log(`   ✅ Secure session destruction`);
    console.log(`   ✅ Authentication middleware`);
    console.log(`\n================================\n`);
});

module.exports = app;