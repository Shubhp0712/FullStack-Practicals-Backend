document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const alertContainer = document.getElementById('alert-container');

    // Get all input fields
    const inputFields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword')
    };

    // Check if user is already logged in
    checkExistingAuth();

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });

    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordField.setAttribute('type', type);
        
        const icon = toggleConfirmPasswordBtn.querySelector('i');
        icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });

    // Add event listeners for validation
    Object.keys(inputFields).forEach(fieldName => {
        const field = inputFields[fieldName];
        if (field) {
            // Show error on blur if field is empty
            field.addEventListener('blur', function() {
                if (!field.value.trim() && fieldName !== 'phone') {
                    showTooltipError(fieldName, 'Please fill in this field.');
                }
            });
            
            // Hide error on focus/input
            field.addEventListener('focus', function() {
                hideTooltipError(fieldName);
            });
            
            field.addEventListener('input', function() {
                hideTooltipError(fieldName);
            });
        }
    });

    // Form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous alerts
        clearAlerts();
        hideAllTooltips();
        
        // Get form data
        const formData = new FormData(registerForm);
        const registerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate required fields
        let hasErrors = false;
        
        if (!registerData.firstName.trim()) {
            showTooltipError('firstName', 'Please fill in this field.');
            hasErrors = true;
        }
        
        if (!registerData.lastName.trim()) {
            showTooltipError('lastName', 'Please fill in this field.');
            hasErrors = true;
        }
        
        if (!registerData.email.trim()) {
            showTooltipError('email', 'Please fill in this field.');
            hasErrors = true;
        }
        
        if (!registerData.password.trim()) {
            showTooltipError('password', 'Please fill in this field.');
            hasErrors = true;
        }
        
        if (!registerData.confirmPassword.trim()) {
            showTooltipError('confirmPassword', 'Please fill in this field.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Additional validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }

        if (registerData.password.length < 6) {
            showAlert('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            showAlert('Passwords do not match.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                showAlert('Registration successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('Network error. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function showTooltipError(fieldName, message) {
        const field = inputFields[fieldName];
        if (!field) return;

        const inputGroup = field.closest('.input-group');
        
        // Remove existing tooltip
        const existingTooltip = inputGroup.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.innerHTML = `<i class="material-icons">warning</i>${message}`;
        
        // Add to input group
        inputGroup.appendChild(tooltip);
        
        // Show with animation
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    function hideTooltipError(fieldName) {
        const field = inputFields[fieldName];
        if (!field) return;

        const inputGroup = field.closest('.input-group');
        const tooltip = inputGroup.querySelector('.error-tooltip');
        
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        }
    }

    function hideAllTooltips() {
        Object.keys(inputFields).forEach(fieldName => {
            hideTooltipError(fieldName);
        });
    }

    function setLoadingState(loading) {
        if (loading) {
            registerBtn.classList.add('loading');
            registerBtn.disabled = true;
        } else {
            registerBtn.classList.remove('loading');
            registerBtn.disabled = false;
        }
    }

    function showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type}">
                <i class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</i>
                ${message}
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
    }

    function clearAlerts() {
        alertContainer.innerHTML = '';
    }

    async function checkExistingAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                const response = await fetch('/api/check-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email })
                });

                const result = await response.json();
                if (result.success && result.isLoggedIn) {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('currentUser');
            }
        }
    }
});