const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Basic middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for demonstration
const mockProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 299.99,
        category: "Electronics",
        description: "Premium quality wireless headphones with noise cancellation",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        inStock: true,
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 449.99,
        category: "Electronics",
        description: "Advanced smartwatch with health monitoring and GPS",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        inStock: true,
        rating: 4.7,
        reviews: 89
    },
    {
        id: 3,
        name: "Laptop Stand Adjustable",
        price: 79.99,
        category: "Accessories",
        description: "Ergonomic aluminum laptop stand for better posture",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        inStock: true,
        rating: 4.3,
        reviews: 45
    },
    {
        id: 4,
        name: "Wireless Charging Pad",
        price: 39.99,
        category: "Electronics",
        description: "Fast wireless charging pad compatible with all Qi devices",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
        inStock: false,
        rating: 4.2,
        reviews: 67
    },
    {
        id: 5,
        name: "USB-C Hub Multi-Port",
        price: 89.99,
        category: "Accessories",
        description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots",
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400",
        inStock: true,
        rating: 4.6,
        reviews: 156
    },
    {
        id: 6,
        name: "Mechanical Keyboard RGB",
        price: 159.99,
        category: "Electronics",
        description: "Gaming mechanical keyboard with RGB backlighting",
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
        inStock: true,
        rating: 4.8,
        reviews: 203
    }
];

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "user" }
];

// API Routes

// Root route - serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Info route
app.get('/api', (req, res) => {
    res.json({
        message: 'TechStore API v1.0',
        status: 'success',
        endpoints: [
            'GET /api/products - Get all products',
            'GET /api/products/:id - Get product by ID',
            'POST /api/products - Create new product',
            'PUT /api/products/:id - Update product',
            'DELETE /api/products/:id - Delete product',
            'GET /api/users - Get all users',
            'GET /api/categories - Get product categories',
            'GET /api/stats - Get API statistics'
        ]
    });
});

// Products API Routes
app.get('/api/products', (req, res) => {
    const { category, inStock, limit } = req.query;
    let filteredProducts = [...mockProducts];

    // Filter by category
    if (category) {
        filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Filter by stock status
    if (inStock !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
            product.inStock === (inStock === 'true')
        );
    }

    // Limit results
    if (limit) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mockProducts.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.json({
        success: true,
        data: product
    });
});

app.post('/api/products', (req, res) => {
    const { name, price, category, description, image } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({
            success: false,
            message: 'Name, price, and category are required'
        });
    }

    const newProduct = {
        id: Math.max(...mockProducts.map(p => p.id)) + 1,
        name,
        price: parseFloat(price),
        category,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        inStock: true,
        rating: 0,
        reviews: 0
    };

    mockProducts.push(newProduct);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
    });
});

app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = mockProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    const updatedProduct = {
        ...mockProducts[productIndex],
        ...req.body,
        id: productId // Prevent ID from being changed
    };

    mockProducts[productIndex] = updatedProduct;

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
    });
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = mockProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    res.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
    });
});

// Users API Routes
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// Categories API Route
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(mockProducts.map(product => product.category))];

    res.json({
        success: true,
        count: categories.length,
        data: categories.map(category => ({
            name: category,
            count: mockProducts.filter(p => p.category === category).length
        }))
    });
});

// Statistics API Route
app.get('/api/stats', (req, res) => {
    const totalProducts = mockProducts.length;
    const inStockProducts = mockProducts.filter(p => p.inStock).length;
    const averagePrice = mockProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const totalUsers = users.length;

    res.json({
        success: true,
        data: {
            totalProducts,
            inStockProducts,
            outOfStockProducts: totalProducts - inStockProducts,
            averagePrice: Math.round(averagePrice * 100) / 100,
            totalUsers,
            categories: [...new Set(mockProducts.map(p => p.category))].length
        }
    });
});

// Search API Route
app.get('/api/search', (req, res) => {
    const { q, type = 'products' } = req.query;

    if (!q) {
        return res.status(400).json({
            success: false,
            message: 'Search query is required'
        });
    }

    let results = [];

    if (type === 'products' || type === 'all') {
        const productResults = mockProducts.filter(product =>
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.description.toLowerCase().includes(q.toLowerCase()) ||
            product.category.toLowerCase().includes(q.toLowerCase())
        );
        results = [...results, ...productResults.map(p => ({ ...p, type: 'product' }))];
    }

    if (type === 'users' || type === 'all') {
        const userResults = users.filter(user =>
            user.name.toLowerCase().includes(q.toLowerCase()) ||
            user.email.toLowerCase().includes(q.toLowerCase())
        );
        results = [...results, ...userResults.map(u => ({ ...u, type: 'user' }))];
    }

    res.json({
        success: true,
        query: q,
        count: results.length,
        data: results
    });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // In a real application, you would save this to a database
    console.log('Contact form submission:', { name, email, message });

    res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
    });
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`📊 Try: http://localhost:${PORT}/api/products`);
});

module.exports = app;