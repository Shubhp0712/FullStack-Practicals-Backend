// Authentication Module
import { auth, googleProvider } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for authentication state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.handleAuthStateChange(user);
        });

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Google login buttons
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const googleRegisterBtn = document.getElementById('googleRegisterBtn');

        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleAuth());
        }

        if (googleRegisterBtn) {
            googleRegisterBtn.addEventListener('click', () => this.handleGoogleAuth());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            this.showLoading('Signing in...');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.showToast('Welcome back!', 'success');
            console.log('User signed in:', userCredential.user);
        } catch (error) {
            console.error('Login error:', error);
            this.handleAuthError(error);
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            this.showLoading('Creating account...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            this.showToast('Account created successfully!', 'success');
            console.log('User registered:', userCredential.user);
        } catch (error) {
            console.error('Registration error:', error);
            this.handleAuthError(error);
        } finally {
            this.hideLoading();
        }
    }

    async handleGoogleAuth() {
        try {
            this.showLoading('Connecting with Google...');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            this.showToast(`Welcome ${user.displayName}!`, 'success');
            console.log('Google sign-in successful:', user);
        } catch (error) {
            console.error('Google sign-in error:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                this.showToast('Sign-in cancelled', 'info');
            } else {
                this.handleAuthError(error);
            }
        } finally {
            this.hideLoading();
        }
    }

    async handleLogout() {
        try {
            this.showLoading('Signing out...');
            await signOut(auth);
            this.showToast('Goodbye!', 'success');
            console.log('User signed out');
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('Error signing out', 'error');
        } finally {
            this.hideLoading();
        }
    }

    handleAuthStateChange(user) {
        const authContainer = document.getElementById('auth-container');
        const chatContainer = document.getElementById('chat-container');
        const loadingScreen = document.getElementById('loading');

        if (user) {
            // User is signed in
            console.log('User authenticated:', user);

            // Update UI with user info
            this.updateUserUI(user);

            // Show chat interface
            authContainer.classList.add('hidden');
            chatContainer.classList.remove('hidden');
            loadingScreen.classList.add('hidden');

            // Initialize chat functionality
            if (window.chatManager) {
                window.chatManager.init(user);
            }
        } else {
            // User is signed out
            console.log('User not authenticated');

            // Show auth interface
            chatContainer.classList.add('hidden');
            authContainer.classList.remove('hidden');
            loadingScreen.classList.add('hidden');
        }
    }

    updateUserUI(user) {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) {
            userName.textContent = user.displayName || user.email.split('@')[0];
        }

        if (userAvatar) {
            userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=667eea&color=fff`;
            userAvatar.alt = user.displayName || 'User Avatar';
        }
    }

    handleAuthError(error) {
        let message = 'An error occurred';

        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password';
                break;
            case 'auth/email-already-in-use':
                message = 'Email is already registered';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address';
                break;
            case 'auth/too-many-requests':
                message = 'Too many attempts. Please try again later';
                break;
            case 'auth/network-request-failed':
                message = 'Network error. Please check your connection';
                break;
            default:
                message = error.message || 'Authentication failed';
        }

        this.showToast(message, 'error');
    }

    showLoading(message = 'Loading...') {
        const loadingScreen = document.getElementById('loading');
        const loadingText = loadingScreen.querySelector('p');

        if (loadingText) {
            loadingText.textContent = message;
        }

        loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading');
        loadingScreen.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            default: return 'fas fa-info-circle';
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Export for global access
window.authManager = authManager;

export default authManager;