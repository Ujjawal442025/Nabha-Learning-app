// Enhanced Login Script for Punjab Learning Platform
const teacher = document.querySelector(".teacher");
const user = document.querySelector(".User");
const pass = document.querySelector(".pwd")
const student = document.querySelector(".student")
const submit = document.querySelector(".submit");
const login = document.querySelector(".login-page");
const loginform = document.querySelector(".login-form");

// Enhanced Placeholder Changes with multilingual support
teacher.addEventListener('click', () => {
    user.placeholder = "teacher1345";
    pass.placeholder = "teach@123";
});

student.addEventListener('click', () => {
    user.placeholder = "student123"
    pass.placeholder = "demo@123"
});

// Enhanced Demo Data with more users
const demoCredentials = {
    students: [
        { username: 'student123', password: 'demo@123', name: 'Ravi Kumar', class: '10th', progress: { math: 75, science: 60, english: 85 } },
        { username: 'student2367', password: 'de@mo123', name: 'Priya Singh', class: '10th', progress: { math: 80, science: 70, english: 90 } },
        { username: 'student456', password: 'test@123', name: 'Arjun Patel', class: '9th', progress: { math: 65, science: 55, english: 75 } },
        { username: 'student789', password: 'demo@456', name: 'Simran Kaur', class: '11th', progress: { math: 90, science: 85, english: 80 } }
    ],
    teachers: [
        { username: 'teacher1345', password: 'teach@123', name: 'Mrs. Sharma', subjects: ['Mathematics', 'Science'] },
        { username: 'teacher2468', password: 'teach@456', name: 'Mr. Singh', subjects: ['English', 'History'] },
        { username: 'teacher789', password: 'guru@123', name: 'Dr. Kaur', subjects: ['Computer Science', 'Physics'] }
    ]
};

// Enhanced Login Form Handler
document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing login state when on login page
    sessionStorage.removeItem('loggedIn');
    
    // Set up back button behavior for login page - exit site
    setupLoginPageNavigation();

    // Set up connectivity monitoring
    setupConnectivityMonitoring();
    
    // Set up user type listeners for placeholder updates
    setupUserTypeListeners();

    // Handle form submission
    loginform.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullname').value.trim();
        const selectedUserType = document.querySelector('input[name="userType"]:checked').value;
        const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

        // Enhanced validation
        if (!username || !password || !fullName) {
            showAlert(languageManager.translate('fill_all_fields') || 'Please fill in all fields');
            return;
        }

        // Validate credentials
        const isValid = validateCredentials(username, password, selectedUserType);
        
        if (isValid) {
            // Set enhanced session data
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('nava_user_name', fullName);
            sessionStorage.setItem('userType', selectedUserType);
            sessionStorage.setItem('selectedLanguage', selectedLanguage);
            sessionStorage.setItem('username', username);
            
            // Store user data for enhanced features
            const userData = getUserData(username, selectedUserType);
            if (userData) {
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }

            // Show loading and navigate
            showLoading();
            
            setTimeout(() => {
                if (selectedUserType == 'student') {
                    window.location.href = "student.html";
                } else if (selectedUserType == 'teacher') {
                    window.location.href = 'teacher.html';
                }
            }, 1000);
            
        } else {
            showAlert(languageManager.translate('invalid_credentials') || 'Invalid username or password. Please use demo credentials.');
        }
    });

    // Enhanced Password toggle functionality
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
});

// Enhanced credential validation
function validateCredentials(username, password, userType) {
    const credentials = demoCredentials[userType + 's'] || [];
    return credentials.some(user => user.username === username && user.password === password);
}

// Get user data for enhanced features
function getUserData(username, userType) {
    const credentials = demoCredentials[userType + 's'] || [];
    return credentials.find(user => user.username === username);
}

// Enhanced navigation setup
function setupLoginPageNavigation() {
    history.replaceState(null, null, window.location.href);
    
    window.addEventListener('popstate', function(event) {
        if (confirm(languageManager.translate('exit_confirmation') || 'Are you sure you want to exit the application?')) {
            window.close();
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 100);
        } else {
            history.pushState(null, null, window.location.href);
        }
    });
}

// Connectivity monitoring for offline features
function setupConnectivityMonitoring() {
    const offlineStatus = document.getElementById('offlineStatus');
    
    function updateConnectivityStatus() {
        if (!navigator.onLine && offlineStatus) {
            offlineStatus.style.display = 'block';
            // Enable offline mode features
            enableOfflineMode();
        } else if (offlineStatus) {
            offlineStatus.style.display = 'none';
            disableOfflineMode();
        }
    }

    // Check initial status
    updateConnectivityStatus();

    // Listen for connectivity changes
    window.addEventListener('online', updateConnectivityStatus);
    window.addEventListener('offline', updateConnectivityStatus);
}

// Offline mode functionality
function enableOfflineMode() {
    // Store offline capabilities in localStorage
    localStorage.setItem('offlineMode', 'true');
    
    // Show offline indicator
    document.body.classList.add('offline-mode');
    
    console.log('Offline mode enabled - Limited functionality available');
}

function disableOfflineMode() {
    localStorage.removeItem('offlineMode');
    document.body.classList.remove('offline-mode');
    console.log('Online mode restored - Full functionality available');
}

// User type listeners for dynamic placeholder updates
function setupUserTypeListeners() {
    const userTypeInputs = document.querySelectorAll('input[name="userType"]');
    userTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            languageManager.updateFormPlaceholders();
        });
    });
}

// Enhanced alert system
function showAlert(message) {
    // Create custom alert that works in offline mode too
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${languageManager.translate('loading') || 'Loading...'}</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

// Enhanced login state check with offline support
window.addEventListener("load", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    const userType = sessionStorage.getItem("userType");
    
    if (isLoggedIn && userType) {
        // Restore language preference
        const savedLanguage = sessionStorage.getItem("selectedLanguage");
        if (savedLanguage && languageManager) {
            languageManager.setLanguage(savedLanguage);
        }
        
        // Redirect to appropriate dashboard
        if (userType === 'student') {
            window.location.href = 'student.html';
        } else if (userType === 'teacher') {
            window.location.href = 'teacher.html';
        }
    }
});

// Service Worker Registration for Offline Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showAlert(languageManager.translate('app_updated') || 'App updated! Refresh to use the latest version.');
                        }
                    });
                });
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Enhanced keyboard shortcuts for accessibility
document.addEventListener('keydown', function(e) {
    // Alt + L to focus on language selection
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        const firstLangInput = document.querySelector('input[name="language"]');
        if (firstLangInput) firstLangInput.focus();
    }
    
    // Alt + U to focus on user type selection
    if (e.altKey && e.key === 'u') {
        e.preventDefault();
        const firstUserInput = document.querySelector('input[name="userType"]');
        if (firstUserInput) firstUserInput.focus();
    }
    
    // Ctrl + Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const submitBtn = document.querySelector('.submit');
        if (submitBtn) submitBtn.click();
    }
});

// Performance monitoring for low-end devices
function monitorPerformance() {
    if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.duration > 100) {
                    console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({entryTypes: ['measure', 'navigation']});
    }
}

// Initialize performance monitoring
monitorPerformance();

// Export functions for use in other modules
window.PunjabLearning = {
    showAlert,
    showLoading,
    validateCredentials,
    getUserData,
    enableOfflineMode,
    disableOfflineMode
};