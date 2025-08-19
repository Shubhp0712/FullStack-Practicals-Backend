document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const emailField = document.getElementById('email');
    const alertContainer = document.getElementById('alert-container');

    const inputFields = {
        email: emailField,
        password: passwordField
    };

    checkExistingAuth();

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        const icon = togglePasswordBtn.querySelector('i');
        icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });

    // Add event listeners for validation
    Object.keys(inputFields).forEach(fieldName => {
        const field = inputFields[fieldName];
        if (field) {
            field.addEventListener('blur', function () {
                if (!field.value.trim()) {
                    showTooltipError(fieldName, 'Please fill in this field.');
                }
            });

            field.addEventListener('focus', function () {
                hideTooltipError(fieldName);
            });

            field.addEventListener('input', function () {
                hideTooltipError(fieldName);
            });
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        clearAlerts();
        hideAllTooltips();

        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Validate required fields
        let hasErrors = false;

        if (!loginData.email.trim()) {
            showTooltipError('email', 'Please fill in this field.');
            hasErrors = true;
        }

        if (!loginData.password.trim()) {
            showTooltipError('password', 'Please fill in this field.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        setLoadingState(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                showAlert('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Invalid email or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Network error. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function showTooltipError(fieldName, message) {
        const field = inputFields[fieldName];
        if (!field) return;

        const inputGroup = field.closest('.input-group');

        const existingTooltip = inputGroup.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.innerHTML = `<i class="material-icons">warning</i>${message}`;

        inputGroup.appendChild(tooltip);

        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });

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
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
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