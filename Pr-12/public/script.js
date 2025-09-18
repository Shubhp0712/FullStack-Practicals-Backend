// Modern Calculator Pro - Enhanced JavaScript Functionality

class CalculatorPro {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupFormValidation();
        this.initializeAnimations();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('calculatorForm');
        this.num1Input = document.getElementById('num1');
        this.num2Input = document.getElementById('num2');
        this.operationButtons = document.querySelectorAll('.operation-button');
        this.operationInputs = document.querySelectorAll('input[name="operation"]');
        this.calculateBtn = document.querySelector('.calculate-button');
        this.clearBtn = document.querySelector('.clear-button');
        
        // Display elements
        this.displaySection = document.querySelector('.display-section');
        this.calculationDisplay = document.querySelector('.calculation-display');
    }

    setupEventListeners() {
        // Input field events
        [this.num1Input, this.num2Input].forEach(input => {
            input.addEventListener('input', (e) => this.handleNumberInput(e));
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
            input.addEventListener('paste', (e) => this.handlePaste(e));
        });

        // Operation button events
        this.operationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOperationSelect(e));
            btn.addEventListener('mouseenter', (e) => this.handleOperationHover(e));
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear button
        this.clearBtn.addEventListener('click', (e) => this.handleClear(e));

        // Real-time calculation preview
        [this.num1Input, this.num2Input, ...this.operationInputs].forEach(element => {
            element.addEventListener('input', () => this.updatePreview());
            element.addEventListener('change', () => this.updatePreview());
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for calculator shortcuts
            if (['Enter', 'Escape', '+', '-', '*', '/'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'Enter':
                    this.handleSubmit(e);
                    break;
                case 'Escape':
                    this.handleClear(e);
                    break;
                case '+':
                    this.selectOperation('add');
                    break;
                case '-':
                    this.selectOperation('subtract');
                    break;
                case '*':
                    this.selectOperation('multiply');
                    break;
                case '/':
                    this.selectOperation('divide');
                    break;
                case 'Tab':
                    // Enhanced tab navigation
                    this.handleTabNavigation(e);
                    break;
            }
        });
    }

    setupFormValidation() {
        // Real-time validation setup
        this.validationRules = {
            maxLength: 15,
            allowNegative: true,
            allowDecimal: true,
            preventInvalidChars: true
        };
    }

    initializeAnimations() {
        // Add entrance animations to elements
        this.animateElements();
        
        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();
    }

    handleNumberInput(e) {
        const input = e.target;
        let value = input.value;

        // Enhanced input filtering
        if (this.validationRules.preventInvalidChars) {
            // Allow only numbers, decimal point, and optionally negative sign
            value = value.replace(/[^0-9.-]/g, '');
            
            // Handle decimal points
            if (this.validationRules.allowDecimal) {
                const decimalCount = (value.match(/\\./g) || []).length;
                if (decimalCount > 1) {
                    value = value.substring(0, value.lastIndexOf('.'));
                }
            } else {
                value = value.replace(/\\./g, '');
            }
            
            // Handle negative sign
            if (this.validationRules.allowNegative) {
                if (value.includes('-') && value.indexOf('-') !== 0) {
                    value = value.replace(/-/g, '');
                    if (value.length > 0) value = '-' + value;
                }
            } else {
                value = value.replace(/-/g, '');
            }
            
            // Length limit
            if (value.length > this.validationRules.maxLength) {
                value = value.substring(0, this.validationRules.maxLength);
            }
        }

        input.value = value;
        this.validateInput(input);
        this.updatePreview();
    }

    handleInputFocus(e) {
        const input = e.target;
        input.parentElement.classList.add('focused');
        
        // Add visual feedback
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    }

    handleInputBlur(e) {
        const input = e.target;
        input.parentElement.classList.remove('focused');
        
        // Remove visual feedback
        input.style.transform = 'scale(1)';
        input.style.boxShadow = '';
        
        this.formatInput(input);
    }

    handlePaste(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const input = e.target;
        
        // Clean pasted content
        let cleanValue = paste.replace(/[^0-9.-]/g, '');
        
        // Apply validation rules
        if (!this.validationRules.allowDecimal) {
            cleanValue = cleanValue.replace(/\\./g, '');
        }
        
        if (!this.validationRules.allowNegative) {
            cleanValue = cleanValue.replace(/-/g, '');
        }
        
        if (cleanValue.length > this.validationRules.maxLength) {
            cleanValue = cleanValue.substring(0, this.validationRules.maxLength);
        }
        
        input.value = cleanValue;
        this.validateInput(input);
        this.updatePreview();
    }

    handleOperationSelect(e) {
        const button = e.currentTarget;
        const operation = button.dataset.operation;
        
        // Update UI
        this.operationButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update radio input
        const radioInput = button.querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
        
        this.updatePreview();
        this.addButtonClickEffect(button);
    }

    handleOperationHover(e) {
        const button = e.currentTarget;
        if (!button.classList.contains('active')) {
            button.style.transform = 'translateY(-2px)';
        }
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.transform = '';
            }
        }, { once: true });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showValidationError();
            return;
        }
        
        // Add loading state
        this.setLoadingState(true);
        
        // Animate button
        this.addButtonClickEffect(this.calculateBtn);
        
        // Submit form after animation
        setTimeout(() => {
            this.form.submit();
        }, 200);
    }

    handleClear(e) {
        e.preventDefault();
        
        // Animate clear action
        this.animateClear();
        
        // Clear form
        setTimeout(() => {
            this.form.reset();
            this.operationButtons.forEach(btn => btn.classList.remove('active'));
            this.updatePreview();
            window.location.href = '/';
        }, 300);
    }

    selectOperation(operation) {
        const operationMap = {
            'add': 'add',
            'subtract': 'subtract',
            'multiply': 'multiply',
            'divide': 'divide'
        };
        
        const targetOperation = operationMap[operation];
        if (targetOperation) {
            const button = document.querySelector(`[data-operation="${targetOperation}"]`);
            if (button) {
                button.click();
            }
        }
    }

    updatePreview() {
        const num1 = this.num1Input.value;
        const num2 = this.num2Input.value;
        const operation = document.querySelector('input[name="operation"]:checked')?.value;
        
        if (num1 && num2 && operation && this.isValidNumber(num1) && this.isValidNumber(num2)) {
            const result = this.calculatePreview(parseFloat(num1), parseFloat(num2), operation);
            this.showPreview(num1, num2, operation, result);
        }
    }

    calculatePreview(num1, num2, operation) {
        switch (operation) {
            case 'add':
                return num1 + num2;
            case 'subtract':
                return num1 - num2;
            case 'multiply':
                return num1 * num2;
            case 'divide':
                return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
            default:
                return null;
        }
    }

    showPreview(num1, num2, operation, result) {
        const operationSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        
        const expression = `${num1} ${operationSymbols[operation]} ${num2}`;
        const resultText = typeof result === 'number' ? this.formatNumber(result) : result;
        
        this.calculationDisplay.innerHTML = `
            <div class="expression">${expression}</div>
            <div class="result-value preview">≈ ${resultText}</div>
        `;
        
        // Add preview styling
        const resultElement = this.calculationDisplay.querySelector('.result-value');
        resultElement.style.opacity = '0.7';
        resultElement.style.fontSize = '1.8rem';
    }

    validateInput(input) {
        const value = input.value;
        const isValid = this.isValidNumber(value) || value === '';
        
        // Visual feedback
        if (isValid) {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        } else {
            input.style.borderColor = '#ef4444';
            input.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }
        
        return isValid;
    }

    validateForm() {
        const num1Valid = this.validateInput(this.num1Input) && this.num1Input.value !== '';
        const num2Valid = this.validateInput(this.num2Input) && this.num2Input.value !== '';
        const operationValid = document.querySelector('input[name="operation"]:checked') !== null;
        
        return num1Valid && num2Valid && operationValid;
    }

    isValidNumber(value) {
        return !isNaN(value) && value !== '' && value !== null && value !== undefined && isFinite(value);
    }

    formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return parseFloat(num.toFixed(8)).toString();
        }
    }

    formatInput(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            input.value = this.formatNumber(value);
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.calculateBtn.disabled = true;
            this.calculateBtn.innerHTML = `
                <div class="loading-spinner"></div>
                Calculating...
            `;
        } else {
            this.calculateBtn.disabled = false;
            this.calculateBtn.innerHTML = `
                <i data-feather="equals"></i>
                Calculate
            `;
            feather.replace();
        }
    }

    addButtonClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    animateClear() {
        [this.num1Input, this.num2Input].forEach((input, index) => {
            setTimeout(() => {
                input.style.transform = 'scale(0.9)';
                input.style.opacity = '0.5';
                setTimeout(() => {
                    input.style.transform = '';
                    input.style.opacity = '';
                }, 200);
            }, index * 100);
        });
    }

    animateElements() {
        // Add stagger animation to operation buttons
        this.operationButtons.forEach((btn, index) => {
            btn.style.animationDelay = `${0.1 + index * 0.1}s`;
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
        document.querySelectorAll('.calculator-panel, .features-panel').forEach(el => {
            observer.observe(el);
        });
    }

    showValidationError() {
        // Create temporary error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error';
        errorMsg.innerHTML = `
            <i data-feather="alert-triangle"></i>
            Please fill in all fields with valid numbers
        `;
        
        this.form.appendChild(errorMsg);
        feather.replace();
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 3000);
    }

    handleTabNavigation(e) {
        // Enhanced tab navigation for better UX
        const focusableElements = [
            this.num1Input,
            ...this.operationButtons,
            this.num2Input,
            this.calculateBtn,
            this.clearBtn
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
}

// Utility functions
function addLoadingSpinnerCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .validation-error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 8px;
            color: #ef4444;
            margin-top: 1rem;
            animation: slideInUp 0.3s ease-out;
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
        
        .animate-in {
            animation: fadeInScale 0.6s ease-out;
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .preview {
            color: #06b6d4 !important;
            text-shadow: 0 0 15px rgba(6, 182, 212, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add required CSS
    addLoadingSpinnerCSS();
    
    // Initialize calculator
    const calculator = new CalculatorPro();
    
    // Global functions for template
    window.clearForm = () => calculator.handleClear({ preventDefault: () => {} });
    
    // Add subtle parallax effect to background
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.background-pattern');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translate3d(0, ${speed}px, 0)`;
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
    
    // Add focus management
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('.number-input, .operation-button')) {
            e.target.closest('.input-field, .operation-selector')?.classList.add('focused');
        }
    });
    
    document.addEventListener('focusout', function(e) {
        if (e.target.matches('.number-input, .operation-button')) {
            setTimeout(() => {
                if (!e.target.closest('.input-field, .operation-selector')?.contains(document.activeElement)) {
                    e.target.closest('.input-field, .operation-selector')?.classList.remove('focused');
                }
            }, 0);
        }
    });
});

// Enhanced performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Calculator loaded in:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
        }, 0);
    });
}