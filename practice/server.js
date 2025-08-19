const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory users storage (temporary)
let users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        createdAt: new Date().toISOString()
    }
];

// Currently logged in users (session simulation)
let loggedInUsers = [];

// Validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
};

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
    const errors = [];

    // Validation
    if (!validateName(firstName)) {
        errors.push({ field: 'firstName', message: 'First name must be at least 2 characters and contain only letters' });
    }

    if (!validateName(lastName)) {
        errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters and contain only letters' });
    }

    if (!validateEmail(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!validatePassword(password)) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    if (!validatePhone(phone)) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        errors.push({ field: 'email', message: 'User with this email already exists' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password,
        phone: phone || null,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Auto login after registration
    loggedInUsers.push({
        userId: newUser.id,
        email: newUser.email,
        loginTime: new Date().toISOString()
    });

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: userResponse
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const errors = [];

    // Validation
    if (!validateEmail(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
            errors: [{ field: 'general', message: 'Invalid email or password' }]
        });
    }

    // Check if already logged in
    const alreadyLoggedIn = loggedInUsers.find(u => u.userId === user.id);
    if (!alreadyLoggedIn) {
        loggedInUsers.push({
            userId: user.id,
            email: user.email,
            loginTime: new Date().toISOString()
        });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
        success: true,
        message: 'Login successful',
        user: userResponse
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    const { email } = req.body;
    
    loggedInUsers = loggedInUsers.filter(u => u.email !== email);
    
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

// Check if user is logged in
app.post('/api/check-auth', (req, res) => {
    const { email } = req.body;
    
    const loggedInUser = loggedInUsers.find(u => u.email === email);
    const user = users.find(u => u.email === email);
    
    if (loggedInUser && user) {
        const { password: _, ...userResponse } = user;
        res.json({
            success: true,
            isLoggedIn: true,
            user: userResponse
        });
    } else {
        res.json({
            success: true,
            isLoggedIn: false
        });
    }
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    res.json({
        success: true,
        users: usersWithoutPasswords,
        loggedInUsers: loggedInUsers
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 SIMPLE AUTH SERVER RUNNING');
    console.log('='.repeat(50));
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🏠 Home: http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`📝 Register: http://localhost:${PORT}/register.html`);
    console.log('='.repeat(50));
    console.log('📋 Available endpoints:');
    console.log('   POST /api/register   - User registration');
    console.log('   POST /api/login      - User login');
    console.log('   POST /api/logout     - User logout');
    console.log('   POST /api/check-auth - Check authentication');
    console.log('   GET  /api/users      - Get all users (testing)');
    console.log('='.repeat(50));
});