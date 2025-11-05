// login.js - Modern Login Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page functionality
    initLoginPage();
});

function initLoginPage() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');
    const rememberCheckbox = document.getElementById('remember');
    const submitButton = loginForm?.querySelector('.btn');
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const signupLink = document.querySelector('.signup-link a');

    // Check if user credentials are remembered
    checkRememberedUser();

    // Password visibility toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmission);
    }

    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('input', debounce(validateEmail, 300));
        emailInput.addEventListener('blur', validateEmail);
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', debounce(validatePassword, 300));
        passwordInput.addEventListener('blur', validatePassword);
    }

    // Social login handlers
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });

    // Forgot password handler
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // Signup link handler
    if (signupLink) {
        signupLink.addEventListener('click', handleSignupRedirect);
    }

    // Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isFormValid()) {
            // Trigger validation for all fields
            validateEmail();
            validatePassword();
        }
    });

    // Functions
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
        
        // Add accessibility attribute
        const isVisible = type === 'text';
        this.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailInput, emailError, 'Email address is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        hideError(emailInput, emailError);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            showError(passwordInput, passwordError, 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            return false;
        }
        
        // Check password strength (optional)
        const strength = checkPasswordStrength(password);
        if (strength === 'weak') {
            showWarning(passwordInput, passwordError, 'Consider using a stronger password');
        } else {
            hideError(passwordInput, passwordError);
        }
        
        return true;
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength++;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength++;
        
        // Contains numbers
        if (/[0-9]/.test(password)) strength++;
        
        // Contains special characters
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }

    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.style.borderColor = 'var(--error)';
        input.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
        
        // Add shake animation
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }

    function showWarning(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'var(--accent)';
        input.style.borderColor = 'var(--accent)';
        input.style.boxShadow = '0 0 0 3px rgba(76, 201, 240, 0.1)';
    }

    function hideError(input, errorElement) {
        errorElement.style.display = 'none';
        input.style.borderColor = 'var(--border)';
        input.style.boxShadow = 'none';
    }

    function isFormValid() {
        return validateEmail() && validatePassword();
    }

    async function handleFormSubmission(e) {
        e.preventDefault();
        
        // Validate form
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            showNotification('Please fix the errors before submitting', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Simulate API call
            const loginData = {
                email: emailInput.value.trim(),
                password: passwordInput.value,
                remember: rememberCheckbox?.checked || false
            };
            
            // Save to localStorage if "Remember me" is checked
            if (loginData.remember) {
                localStorage.setItem('rememberedEmail', loginData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Simulate network request
            await simulateLoginRequest(loginData);
            
            // Show success message
            showSuccessMessage();
            
            // Redirect after delay (simulated)
            setTimeout(() => {
                window.location.href = '/dashboard'; // Change to your actual dashboard URL
            }, 2000);
            
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    }

    function simulateLoginRequest(loginData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate different responses based on test data
                const testAccounts = {
                    'admin@example.com': { password: 'password123', valid: true },
                    'user@example.com': { password: 'password123', valid: true },
                    'demo@example.com': { password: 'demo123', valid: true }
                };
                
                const account = testAccounts[loginData.email];
                
                if (!account) {
                    reject(new Error('No account found with this email address'));
                    return;
                }
                
                if (account.password !== loginData.password) {
                    reject(new Error('Invalid password. Please try again.'));
                    return;
                }
                
                if (!account.valid) {
                    reject(new Error('This account has been deactivated'));
                    return;
                }
                
                // Simulate successful login
                console.log('Login successful:', loginData.email);
                resolve({
                    success: true,
                    user: {
                        email: loginData.email,
                        name: loginData.email.split('@')[0],
                        token: 'simulated-jwt-token-' + Date.now()
                    }
                });
            }, 1500); // Simulate network delay
        });
    }

    function handleSocialLogin(e) {
        const platform = this.classList.contains('google') ? 'Google' : 
                        this.classList.contains('facebook') ? 'Facebook' : 'Twitter';
        
        setLoadingState(true);
        
        // Simulate social login process
        setTimeout(() => {
            showNotification(`Redirecting to ${platform} authentication...`, 'info');
            setLoadingState(false);
            
            // In a real app, this would redirect to OAuth endpoint
            // window.location.href = `/auth/${platform.toLowerCase()}`;
        }, 1000);
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email || !validateEmail()) {
            showNotification('Please enter a valid email address to reset your password', 'warning');
            emailInput.focus();
            return;
        }
        
        // Simulate password reset request
        setLoadingState(true);
        
        setTimeout(() => {
            showNotification(`Password reset instructions sent to ${email}`, 'success');
            setLoadingState(false);
            
            // Simulate email sent
            console.log('Password reset requested for:', email);
        }, 1500);
    }

    function handleSignupRedirect(e) {
        e.preventDefault();
        
        showNotification('Redirecting to signup page...', 'info');
        
        // Simulate redirect
        setTimeout(() => {
            window.location.href = '/signup'; // Change to your actual signup URL
        }, 1000);
    }

    function checkRememberedUser() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail && emailInput) {
            emailInput.value = rememberedEmail;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
            // Auto-focus on password field for better UX
            setTimeout(() => {
                passwordInput.focus();
            }, 100);
        }
    }

    function setLoadingState(isLoading) {
        if (submitButton) {
            if (isLoading) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Signing In...</span>';
            } else {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.innerHTML = '<span>Sign In</span>';
            }
        }
        
        // Disable all form inputs during loading
        const formInputs = loginForm?.querySelectorAll('input, button');
        if (formInputs) {
            formInputs.forEach(input => {
                if (input !== submitButton) {
                    input.disabled = isLoading;
                }
            });
        }
    }

    function showSuccessMessage() {
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Login successful! Redirecting to dashboard...';
            
            // Add celebration effect
            successMessage.style.animation = 'celebrate 0.6s ease-out';
            
            // Add confetti effect for successful login
            createConfetti();
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    function getNotificationColor(type) {
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: '#ff9800',
            info: 'var(--primary)'
        };
        return colors[type] || 'var(--primary)';
    }

    function createConfetti() {
        const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#7209b7', '#f72585'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
        
        // Add confetti animation
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @keyframes celebrate {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }










    //ujhjhjkjj
    // Utility function for debouncing
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
}







// Export functions for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLoginPage };
}