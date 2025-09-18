// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const productsGrid = document.getElementById('products-grid');
const loadingScreen = document.getElementById('loading');
const toast = document.getElementById('toast');

// API Base URL
const API_BASE = '';

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);

    // Load initial content
    loadProducts();
    loadStats();
    addSearchFunctionality();
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Products Functions
async function loadProducts() {
    try {
        showToast('Loading products...', 'info');

        const response = await fetch(`${API_BASE}/api/products`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            displayProducts(data.data);
            showToast(`Loaded ${data.count} products successfully!`, 'success');

            // Load categories for filter
            loadCategories();
        } else {
            throw new Error('No products found');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displayError('Failed to load products. Please try again later.');
        showToast('Failed to load products', 'error');
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/api/categories`);
        const data = await response.json();

        if (data.success) {
            displayCategoryFilters(data.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function displayCategoryFilters(categories) {
    const productsSection = document.getElementById('products');
    let filterContainer = document.querySelector('.category-filters');

    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.className = 'category-filters';
        filterContainer.innerHTML = `
            <h3>Filter by Category:</h3>
            <div class="filter-buttons">
                <button class="filter-btn active" onclick="filterProducts('all')">All Products</button>
            </div>
        `;

        const productsGrid = document.getElementById('products-grid');
        productsSection.insertBefore(filterContainer, productsGrid);
    }

    const filterButtons = filterContainer.querySelector('.filter-buttons');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = `${category.name} (${category.count})`;
        button.onclick = () => filterProducts(category.name);
        filterButtons.appendChild(button);
    });
}

async function filterProducts(category) {
    try {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        let url = `${API_BASE}/api/products`;
        if (category !== 'all') {
            url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            displayProducts(data.data);
            showToast(`Showing ${data.count} products`, 'info');
        }
    } catch (error) {
        console.error('Error filtering products:', error);
        showToast('Error filtering products', 'error');
    }
}

function displayProducts(products) {
    const productsHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}')">
                ${product.inStock ? '' : '<div class="out-of-stock">Out of Stock</div>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price}</div>
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;

    // Add entrance animations
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function displayError(message) {
    productsGrid.innerHTML = `
        <div class="loading-products">
            <i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>
            <p style="color: #e74c3c;">${message}</p>
            <button class="btn btn-primary" onclick="loadProducts()" style="margin-top: 20px;">
                <i class="fas fa-redo"></i>
                Try Again
            </button>
        </div>
    `;
}

async function viewProduct(productId) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${productId}`);
        const data = await response.json();

        if (data.success) {
            const product = data.data;
            showProductModal(product);
        } else {
            showToast('Product not found', 'error');
        }
    } catch (error) {
        console.error('Error loading product details:', error);
        showToast('Error loading product details', 'error');
    }
}

function showProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeProductModal()">&times;</span>
            <div class="modal-product">
                <div class="modal-image" style="background-image: url('${product.image}')"></div>
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p class="modal-category">${product.category}</p>
                    <p class="modal-description">${product.description}</p>
                    <div class="modal-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>${product.rating}/5 (${product.reviews} reviews)</span>
                    </div>
                    <div class="modal-price">$${product.price}</div>
                    <div class="modal-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </div>
                    <button class="btn btn-primary" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Notify When Available'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Search functionality
async function searchProducts(query) {
    if (!query.trim()) {
        loadProducts();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&type=products`);
        const data = await response.json();

        if (data.success) {
            displayProducts(data.data);
            showToast(`Found ${data.count} results for "${query}"`, 'info');
        }
    } catch (error) {
        console.error('Error searching products:', error);
        showToast('Error searching products', 'error');
    }
}

// Add search input to the page
function addSearchFunctionality() {
    const productsSection = document.getElementById('products');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" id="product-search" placeholder="Search products..." maxlength="100">
            <button type="button" onclick="clearSearch()" class="clear-search" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    const productsGrid = document.getElementById('products-grid');
    productsSection.insertBefore(searchContainer, productsGrid);

    // Add search functionality
    const searchInput = document.getElementById('product-search');
    const clearBtn = searchContainer.querySelector('.clear-search');

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value;
        if (query.length > 0) {
            clearBtn.style.display = 'block';
            searchProducts(query);
        } else {
            clearBtn.style.display = 'none';
            loadProducts();
        }
    }, 300));
}

function clearSearch() {
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.querySelector('.clear-search');
    searchInput.value = '';
    clearBtn.style.display = 'none';
    loadProducts();
}

// Load API statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const data = await response.json();

        if (data.success) {
            displayStats(data.data);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayStats(stats) {
    const aboutSection = document.getElementById('about');
    let statsContainer = aboutSection.querySelector('.stats-container');

    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        aboutSection.appendChild(statsContainer);
    }

    statsContainer.innerHTML = `
        <h3>Our Store Statistics</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <i class="fas fa-box"></i>
                <span class="stat-number">${stats.totalProducts}</span>
                <span class="stat-label">Total Products</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-check-circle"></i>
                <span class="stat-number">${stats.inStockProducts}</span>
                <span class="stat-label">In Stock</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-dollar-sign"></i>
                <span class="stat-number">$${stats.averagePrice}</span>
                <span class="stat-label">Average Price</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-tags"></i>
                <span class="stat-number">${stats.categories}</span>
                <span class="stat-label">Categories</span>
            </div>
        </div>
    `;
}

// Contact Form Functions
function initializeContactForm() {
    contactForm.addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    // Add loading state to button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message, 'success');
            contactForm.reset();

            // Add success animation
            contactForm.style.transform = 'scale(0.98)';
            setTimeout(() => {
                contactForm.style.transform = 'scale(1)';
            }, 200);
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        showToast(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.about, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');

    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
    toastMessage.textContent = message;

    // Remove existing type classes and add new one
    toast.className = `toast ${type}`;

    // Show toast
    toast.classList.add('show');

    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// API Health Check
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE}/api`);
        const data = await response.json();
        console.log('✅ API Status:', data.message);
        return true;
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        return false;
    }
}

// Initialize API check
checkAPIStatus();

// Keyboard Navigation
document.addEventListener('keydown', (event) => {
    // ESC key closes mobile menu
    if (event.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization
window.addEventListener('load', () => {
    // Remove any remaining loading states
    document.body.classList.add('loaded');

    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.viewProduct = viewProduct;
window.loadProducts = loadProducts;
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.clearSearch = clearSearch;
window.closeProductModal = closeProductModal;