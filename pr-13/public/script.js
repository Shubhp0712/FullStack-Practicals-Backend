// Modern Income Calculator - Enhanced JavaScript Functionality

class IncomeCalculator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupFormValidation();
        this.initializeAnimations();
    }

    initializeElements() {
        this.form = document.getElementById('incomeForm');
        this.income1Input = document.getElementById('income1');
        this.income2Input = document.getElementById('income2');
        this.taxRateInput = document.getElementById('taxRate');
        this.submitBtn = document.querySelector('.submit-btn');
        this.errorContainer = document.querySelector('.error-message');
    }

    setupEventListeners() {
        // Real-time input validation
        [this.income1Input, this.income2Input].forEach(input => {
            input.addEventListener('input', (e) => this.handleInput(e));
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
            input.addEventListener('paste', (e) => this.handlePaste(e));
        });

        // Tax rate input validation (percentage)
        this.taxRateInput.addEventListener('input', (e) => this.handleTaxInput(e));
        this.taxRateInput.addEventListener('focus', (e) => this.handleFocus(e));
        this.taxRateInput.addEventListener('blur', (e) => this.handleBlur(e));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupFormValidation() {
        this.validationRules = {
            minValue: 0,
            maxValue: 9999999999,
            maxDecimalPlaces: 2,
            allowNegative: false
        };
    }

    initializeAnimations() {
        // Add entrance animations
        this.animateFormElements();

        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();
    }

    handleInput(e) {
        const input = e.target;
        let value = input.value;

        // Format currency input
        value = this.formatCurrencyInput(value);
        input.value = value;

        // Validate input
        this.validateInput(input);

        // Update form state
        this.updateFormState();
    }

    handleTaxInput(e) {
        const input = e.target;
        let value = input.value;

        // Format percentage input
        value = this.formatPercentageInput(value);
        input.value = value;

        // Validate tax rate
        this.validateTaxRate(input);

        // Update form state
        this.updateFormState();
    }

    formatPercentageInput(value) {
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Handle decimal points
        const decimalCount = (value.match(/\\./g) || []).length;
        if (decimalCount > 1) {
            value = value.substring(0, value.lastIndexOf('.'));
        }

        // Limit decimal places to 2
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                value = parts.join('.');
            }
        }

        // Check maximum percentage (100%)
        const numValue = parseFloat(value);
        if (numValue > 100) {
            value = '100';
        }

        return value;
    }

    validateTaxRate(input) {
        const value = parseFloat(input.value);
        const isEmpty = input.value === '';
        let isValid = true;
        let errorMessage = '';

        if (!isEmpty) {
            if (isNaN(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid percentage';
            } else if (value < 0) {
                isValid = false;
                errorMessage = 'Tax rate cannot be negative';
            } else if (value > 100) {
                isValid = false;
                errorMessage = 'Tax rate cannot exceed 100%';
            }
        }

        // Update input styling
        this.updateInputValidation(input, isValid, errorMessage);

        return isValid;
    }

    formatCurrencyInput(value) {
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Handle decimal points
        const decimalCount = (value.match(/\\./g) || []).length;
        if (decimalCount > 1) {
            value = value.substring(0, value.lastIndexOf('.'));
        }

        // Limit decimal places
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1] && parts[1].length > this.validationRules.maxDecimalPlaces) {
                parts[1] = parts[1].substring(0, this.validationRules.maxDecimalPlaces);
                value = parts.join('.');
            }
        }

        // Check maximum value
        const numValue = parseFloat(value);
        if (numValue > this.validationRules.maxValue) {
            value = this.validationRules.maxValue.toString();
        }

        return value;
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const isEmpty = input.value === '';
        let isValid = true;
        let errorMessage = '';

        if (!isEmpty) {
            if (isNaN(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid number';
            } else if (value < this.validationRules.minValue) {
                isValid = false;
                errorMessage = `Value must be at least ${this.validationRules.minValue}`;
            } else if (value > this.validationRules.maxValue) {
                isValid = false;
                errorMessage = `Value cannot exceed ${this.validationRules.maxValue.toLocaleString()}`;
            }
        }

        // Update input styling
        input.classList.remove('valid', 'invalid');
        if (!isEmpty) {
            input.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Store validation result
        input.dataset.valid = isValid.toString();
        input.dataset.errorMessage = errorMessage;

        return isValid;
    }

    handleFocus(e) {
        const input = e.target;
        input.parentElement.classList.add('focused');

        // Add visual feedback
        input.style.transform = 'scale(1.02)';
    }

    handleBlur(e) {
        const input = e.target;
        input.parentElement.classList.remove('focused');

        // Remove visual feedback
        input.style.transform = 'scale(1)';

        // Format the final value
        this.formatFinalValue(input);
    }

    formatFinalValue(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            // Format as currency with proper decimal places
            input.value = value.toFixed(2);
        }
    }

    handlePaste(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const input = e.target;

        // Clean pasted content
        const cleanValue = this.formatCurrencyInput(paste);
        input.value = cleanValue;

        this.validateInput(input);
        this.updateFormState();
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showValidationErrors();
            return;
        }

        // Add loading state
        this.setLoadingState(true);

        // Animate submission
        this.animateSubmission();

        // Submit form after animation
        setTimeout(() => {
            this.form.submit();
        }, 500);
    }

    validateForm() {
        const income1Valid = this.validateInput(this.income1Input) && this.income1Input.value !== '';
        const income2Valid = this.validateInput(this.income2Input) && this.income2Input.value !== '';

        return income1Valid && income2Valid;
    }

    updateFormState() {
        const allValid = this.validateForm();

        // Update submit button state
        this.submitBtn.disabled = !allValid;
        this.submitBtn.classList.toggle('disabled', !allValid);

        // Clear previous errors if all inputs are valid
        if (allValid && this.errorContainer) {
            this.hideError();
        }
    }

    showValidationErrors() {
        const errors = [];

        [this.income1Input, this.income2Input].forEach(input => {
            if (input.dataset.valid === 'false' && input.dataset.errorMessage) {
                errors.push(input.dataset.errorMessage);
            } else if (input.value === '') {
                const label = input.previousElementSibling.textContent.replace(':', '');
                errors.push(`${label} is required`);
            }
        });

        if (errors.length > 0) {
            this.showError(errors[0]);
        }
    }

    showError(message) {
        if (!this.errorContainer) {
            this.createErrorContainer();
        }

        this.errorContainer.innerHTML = `
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            ${message}
        `;
        this.errorContainer.style.display = 'flex';
        this.errorContainer.classList.add('show');
    }

    hideError() {
        if (this.errorContainer) {
            this.errorContainer.classList.remove('show');
            setTimeout(() => {
                this.errorContainer.style.display = 'none';
            }, 300);
        }
    }

    createErrorContainer() {
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-message';
        this.errorContainer.style.display = 'none';
        this.form.insertBefore(this.errorContainer, this.form.firstChild);
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span>Calculating...</span>
            `;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = `
                Calculate Total Income
            `;
        }
    }

    animateSubmission() {
        // Add submission animation
        this.form.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.form.style.transform = 'scale(1)';
        }, 200);
    }

    animateFormElements() {
        // Stagger animation for form elements
        const elements = this.form.querySelectorAll('.form-group, .submit-btn');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${0.1 + index * 0.1}s`;
            el.classList.add('animate-in');
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements for scroll animations
        document.querySelectorAll('.feature').forEach(el => {
            observer.observe(el);
        });
    }

    handleKeyboardShortcuts(e) {
        // Enter key to submit (when not in input)
        if (e.key === 'Enter' && !e.target.matches('input')) {
            e.preventDefault();
            if (this.validateForm()) {
                this.handleSubmit(e);
            }
        }

        // Tab navigation enhancement
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    handleTabNavigation(e) {
        const focusableElements = [
            this.income1Input,
            this.income2Input,
            this.submitBtn
        ];

        const currentIndex = focusableElements.indexOf(document.activeElement);

        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex > 0) {
                e.preventDefault();
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex < focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[currentIndex + 1].focus();
            }
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    debounce(func, wait) {
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
}

// Utility function to add required CSS animations
function addAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .error-message.show {
            animation: errorSlideIn 0.3s ease-out;
        }
        
        @keyframes errorSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .submit-btn.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .form-group.focused .form-input {
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
}

// Initialize the calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Add required CSS
    addAnimationCSS();

    // Initialize calculator
    const calculator = new IncomeCalculator();

    // Add subtle parallax effect
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body::before');
        if (parallax) {
            const speed = scrolled * 0.3;
            document.body.style.backgroundPosition = `center ${speed}px`;
        }
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Income Calculator loaded in:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }, 0);
        });
    }
});

// Export for testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncomeCalculator;
}