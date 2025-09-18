// Main Application JavaScript

// Global utility functions
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    emojiPicker.classList.toggle('hidden');
}

function sendMessage() {
    if (window.chatManager) {
        window.chatManager.sendMessage();
    }
}

function clearChat() {
    if (window.chatManager) {
        window.chatManager.clearChat();
    }
}

function attachFile() {
    window.authManager.showToast('File attachment feature coming soon!', 'info');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    console.log('SocialChat application initialized');

    // Add click outside handlers
    document.addEventListener('click', function (e) {
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiBtn = document.getElementById('emojiBtn');

        if (emojiPicker && !emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
            emojiPicker.classList.add('hidden');
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            document.getElementById('emojiPicker').classList.add('hidden');
        }

        // Ctrl/Cmd + Enter to send message
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add animation classes after page load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Re-focus message input when page becomes visible
        const messageInput = document.getElementById('messageInput');
        if (messageInput && !document.getElementById('chat-container').classList.contains('hidden')) {
            setTimeout(() => messageInput.focus(), 100);
        }
    }
});

// Handle online/offline status
window.addEventListener('online', function () {
    window.authManager.showToast('Back online!', 'success');
});

window.addEventListener('offline', function () {
    window.authManager.showToast('You are offline', 'warning');
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // We'll add service worker later if needed
        console.log('Service Worker support detected');
    });
}

// Global error handler
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
    if (window.authManager) {
        window.authManager.showToast('An unexpected error occurred', 'error');
    }
});

// Prevent form submission on Enter in auth forms
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('input[type="email"], input[type="password"], input[type="text"]')) {
        const form = e.target.closest('form');
        if (form && !e.target.matches('#messageInput')) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

console.log('App.js loaded successfully');