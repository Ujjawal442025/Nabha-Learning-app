// Enhanced Student Dashboard JavaScript for Punjab Learning Platform

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check login state and redirect if not logged in
    if (!sessionStorage.getItem('loggedIn') || sessionStorage.getItem('userType') !== 'student') {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize all components
    initializeStudentDashboard();
    setupNavigationListeners();
    setupConnectivityMonitoring();
    loadStudentData();
    initializeTranslator();
    initializeDigitalLiteracy();
    initializeOfflineSystem();
    initializeQuizSystem();
    
    // Apply saved language
    const savedLanguage = sessionStorage.getItem('selectedLanguage') || 'english';
    if (window.languageManager) {
        window.languageManager.setLanguage(savedLanguage);
    }
});

// Initialize student dashboard
function initializeStudentDashboard() {
    // Set welcome message
    const name = sessionStorage.getItem('nava_user_name');
    const welcomeElement = document.getElementById('welcomeName');
    if (welcomeElement && name) {
        const welcomeText = window.languageManager ? 
            window.languageManager.translate('welcome') : 'Welcome';
        welcomeElement.textContent = `${welcomeText}, ${name}`;
    }
    
    // Load and display student statistics
    loadStudentStats();
    
    // Setup main interface navigation
    setupMainInterfaceNavigation();
    
    console.log('[Student] Dashboard initialized');
}

// Setup navigation listeners
function setupNavigationListeners() {
    const sidebarButtons = document.querySelectorAll(".sidebar button");
    
    sidebarButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons and sections
            sidebarButtons.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
            
            // Add active class to clicked button and corresponding section
            btn.classList.add("active");
            const sectionId = btn.getAttribute("data-section");
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                targetSection.classList.add("active");
                
                // Load section-specific content
                loadSectionContent(sectionId);
            }
        });
    });
}

// Load section-specific content
function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadStudentStats();
            break;
        case 'subjects':
            loadSubjectsData();
            break;
        case 'videos':
            loadVideosData();
            break;
        case 'assignments':
            loadAssignmentsData();
            break;
        case 'progress':
            loadProgressData();
            break;
        case 'translator':
            initializeTranslatorSection();
            break;
        case 'digital-literacy':
            loadDigitalLiteracyModules();
            break;
        case 'offline':
            loadOfflineContent();
            break;
    }
}

// Load student statistics
function loadStudentStats() {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const offlineData = getOfflineStats();
    
    // Update dashboard cards
    updateDashboardCard('totalLessonsCount', getTotalLessons());
    updateDashboardCard('completedCount', getCompletedLessons());
    updateDashboardCard('downloadedCount', offlineData.downloadedVideos + offlineData.downloadedPDFs);
    updateDashboardCard('assignmentsDoneCount', getCompletedAssignments());
    
    console.log('[Student] Statistics loaded');
}

// Update dashboard cards
function updateDashboardCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Get statistics functions
function getTotalLessons() {
    return parseInt(localStorage.getItem('totalLessons') || '6');
}

function getCompletedLessons() {
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    return completed.length;
}

function getCompletedAssignments() {
    const completed = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
    return completed.length;
}

// TRANSLATOR FUNCTIONALITY
let translatorInitialized = false;

function initializeTranslator() {
    if (translatorInitialized) return;
    
    console.log('[Student] Initializing translator');
    translatorInitialized = true;
}

function initializeTranslatorSection() {
    const textArea = document.getElementById('textToTranslate');
    if (textArea) {
        textArea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                translateText();
            }
        });
    }
}

// Translate text function
function translateText() {
    const textToTranslate = document.getElementById('textToTranslate').value.trim();
    const resultElement = document.getElementById('translationResult');
    const speakBtn = document.getElementById('speakBtn');
    
    if (!textToTranslate) {
        showAlert('Please enter some text to translate');
        return;
    }
    
    // Show loading
    resultElement.textContent = 'Translating...';
    resultElement.className = 'translation-output loading';
    
    // Simulate translation delay
    setTimeout(() => {
        const translatedText = window.languageManager ? 
            window.languageManager.translateText(textToTranslate, 'punjabi') :
            `[ਅਨੁਵਾਦ: ${textToTranslate}]`;
        
        resultElement.textContent = translatedText;
        resultElement.className = 'translation-output translated';
        
        // Show speak button
        if (speakBtn) {
            speakBtn.style.display = 'inline-block';
        }
        
        // Save to translation history
        saveTranslationHistory(textToTranslate, translatedText);
        
    }, 1000);
}

// Quick translate function
function quickTranslate(phrase) {
    document.getElementById('textToTranslate').value = phrase;
    translateText();
}

// Speak Punjabi text
function speakPunjabi() {
    const translatedText = document.getElementById('translationResult').textContent;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = 'pa-IN'; // Punjabi language code
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        speechSynthesis.speak(utterance);
    } else {
        showAlert('Text-to-speech not supported in your browser');
    }
}

// Save translation history
function saveTranslationHistory(original, translated) {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.unshift({
        original,
        translated,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 translations
    if (history.length > 50) {
        history.splice(50);
    }
    
    localStorage.setItem('translationHistory', JSON.stringify(history));
}

// DIGITAL LITERACY FUNCTIONALITY
function initializeDigitalLiteracy() {
    console.log('[Student] Digital literacy initialized');
}

function loadDigitalLiteracyModules() {
    // Update GIF sources if they exist
    const gifs = document.querySelectorAll('.learning-gif');
    gifs.forEach((gif, index) => {
        if (!gif.src || gif.src.includes('placeholder')) {
            // Set fallback images for GIFs
            const fallbackGifs = [
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="80" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14">Mouse Click Demo</text></svg>',
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="80" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14">Browser Navigation</text></svg>',
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="80" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14">Password Security</text></svg>',
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="80" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14">Online Study Tips</text></svg>'
            ];
            gif.src = fallbackGifs[index] || fallbackGifs[0];
        }
    });
}

// Start digital literacy module
function startLiteracyModule(moduleId) {
    const modules = {
        'basic-computer': {
            title: 'Basic Computer Skills',
            content: `
                <div class="module-content">
                    <h3>Mouse and Keyboard Basics</h3>
                    <div class="lesson-step">
                        <h4>Step 1: Using the Mouse</h4>
                        <p>The mouse is your primary tool for interacting with the computer.</p>
                        <ul>
                            <li><strong>Left Click:</strong> Select items, open files</li>
                            <li><strong>Right Click:</strong> Open context menus</li>
                            <li><strong>Double Click:</strong> Open applications</li>
                            <li><strong>Scroll:</strong> Move up and down on pages</li>
                        </ul>
                        <div class="practice-area">
                            <button onclick="practiceMouseClick()" class="practice-btn">Practice Clicking</button>
                        </div>
                    </div>
                    <div class="lesson-step">
                        <h4>Step 2: Keyboard Basics</h4>
                        <p>Learn essential keyboard shortcuts:</p>
                        <ul>
                            <li><strong>Ctrl + C:</strong> Copy</li>
                            <li><strong>Ctrl + V:</strong> Paste</li>
                            <li><strong>Ctrl + Z:</strong> Undo</li>
                            <li><strong>Alt + Tab:</strong> Switch between programs</li>
                        </ul>
                    </div>
                    <div class="module-quiz">
                        <button onclick="startModuleQuiz('basic-computer')" class="btn btn-primary">Take Quiz</button>
                    </div>
                </div>
            `
        },
        'internet-usage': {
            title: 'Internet Usage',
            content: `
                <div class="module-content">
                    <h3>Browsing the Internet Safely</h3>
                    <div class="lesson-step">
                        <h4>Step 1: Understanding Web Browsers</h4>
                        <p>Web browsers like Chrome, Firefox, Safari help you access websites.</p>
                        <ul>
                            <li><strong>Address Bar:</strong> Type website addresses here</li>
                            <li><strong>Bookmarks:</strong> Save your favorite websites</li>
                            <li><strong>Back/Forward:</strong> Navigate between pages</li>
                            <li><strong>Refresh:</strong> Reload the current page</li>
                        </ul>
                    </div>
                    <div class="lesson-step">
                        <h4>Step 2: Search Effectively</h4>
                        <p>Tips for better internet searches:</p>
                        <ul>
                            <li>Use specific keywords</li>
                            <li>Put phrases in quotes: "exact phrase"</li>
                            <li>Use reliable sources</li>
                            <li>Check multiple sources</li>
                        </ul>
                    </div>
                    <div class="module-quiz">
                        <button onclick="startModuleQuiz('internet-usage')" class="btn btn-primary">Take Quiz</button>
                    </div>
                </div>
            `
        },
        'digital-safety': {
            title: 'Digital Safety',
            content: `
                <div class="module-content">
                    <h3>Staying Safe Online</h3>
                    <div class="lesson-step">
                        <h4>Step 1: Strong Passwords</h4>
                        <p>Create secure passwords:</p>
                        <ul>
                            <li>Use at least 8 characters</li>
                            <li>Mix uppercase, lowercase, numbers, symbols</li>
                            <li>Don't use personal information</li>
                            <li>Use different passwords for different accounts</li>
                        </ul>
                        <div class="practice-area">
                            <input type="password" id="passwordTest" placeholder="Create a strong password">
                            <button onclick="checkPasswordStrength()" class="practice-btn">Check Strength</button>
                            <div id="passwordStrength"></div>
                        </div>
                    </div>
                    <div class="lesson-step">
                        <h4>Step 2: Avoiding Scams</h4>
                        <p>Red flags to watch for:</p>
                        <ul>
                            <li>Emails asking for personal information</li>
                            <li>"Too good to be true" offers</li>
                            <li>Urgent requests for money</li>
                            <li>Suspicious links and attachments</li>
                        </ul>
                    </div>
                    <div class="module-quiz">
                        <button onclick="startModuleQuiz('digital-safety')" class="btn btn-primary">Take Quiz</button>
                    </div>
                </div>
            `
        },
        'online-learning': {
            title: 'Online Learning Tips',
            content: `
                <div class="module-content">
                    <h3>Effective Online Learning</h3>
                    <div class="lesson-step">
                        <h4>Step 1: Setting Up Your Learning Space</h4>
                        <p>Create an ideal environment:</p>
                        <ul>
                            <li>Find a quiet, well-lit area</li>
                            <li>Ensure stable internet connection</li>
                            <li>Keep all materials within reach</li>
                            <li>Minimize distractions</li>
                        </ul>
                    </div>
                    <div class="lesson-step">
                        <h4>Step 2: Time Management</h4>
                        <p>Study effectively online:</p>
                        <ul>
                            <li>Set specific study times</li>
                            <li>Take regular breaks</li>
                            <li>Use the 25-minute focus technique</li>
                            <li>Track your progress</li>
                        </ul>
                    </div>
                    <div class="lesson-step">
                        <h4>Step 3: Using This Learning Platform</h4>
                        <p>Maximize your learning here:</p>
                        <ul>
                            <li>Download content for offline study</li>
                            <li>Use the translator for better understanding</li>
                            <li>Take quizzes to test knowledge</li>
                            <li>Track your progress regularly</li>
                        </ul>
                    </div>
                    <div class="module-quiz">
                        <button onclick="startModuleQuiz('online-learning')" class="btn btn-primary">Take Quiz</button>
                    </div>
                </div>
            `
        }
    };
    
    const module = modules[moduleId];
    if (module) {
        showLiteracyModule(module.title, module.content);
        trackModuleStart(moduleId);
    }
}

// Show literacy module modal
function showLiteracyModule(title, content) {
    const modal = document.getElementById('literacyModal');
    const titleElement = document.getElementById('literacyTitle');
    const contentElement = document.getElementById('literacyContent');
    
    if (modal && titleElement && contentElement) {
        titleElement.textContent = title;
        contentElement.innerHTML = content;
        modal.style.display = 'block';
    }
}

// Close literacy module
function closeLiteracyModule() {
    const modal = document.getElementById('literacyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Practice functions for digital literacy
function practiceMouseClick() {
    let clickCount = 0;
    const button = event.target;
    const originalText = button.textContent;
    
    const practiceInterval = setInterval(() => {
        clickCount++;
        button.textContent = `Great! Click ${clickCount}`;
        
        if (clickCount >= 5) {
            button.textContent = '✅ Mouse Practice Complete!';
            button.disabled = true;
            clearInterval(practiceInterval);
            
            // Re-enable after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        }
    }, 0);
    
    // Stop after first click to prevent multiple intervals
    setTimeout(() => clearInterval(practiceInterval), 100);
}

function checkPasswordStrength() {
    const password = document.getElementById('passwordTest').value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letters');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letters');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Special characters');
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['#ff4444', '#ff8800', '#ffbb00', '#88bb00', '#00bb00'][strength];
    
    strengthDiv.innerHTML = `
        <div style="color: ${strengthColor}; font-weight: bold;">
            Password Strength: ${strengthText}
        </div>
        ${feedback.length > 0 ? `<div>Add: ${feedback.join(', ')}</div>` : '<div>✅ Excellent password!</div>'}
    `;
}

// QUIZ SYSTEM FUNCTIONALITY
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = [];
let quizStartTime = null;

function initializeQuizSystem() {
    console.log('[Student] Quiz system initialized');
}

// Open test/quiz
function openTest(subject) {
    const quizzes = getQuizzesForSubject(subject);
    
    if (quizzes.length > 0) {
        startQuiz(quizzes[0]);
    } else {
        showAlert(`No quizzes available for ${subject} yet.`);
    }
}

// Get quizzes for subject
function getQuizzesForSubject(subject) {
    const allQuizzes = {
        'mathematics': [
            {
                id: 'math-algebra',
                title: 'Algebra Basics',
                questions: [
                    {
                        question: 'What is 2x + 3 = 11? Solve for x.',
                        options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
                        correct: 0,
                        explanation: '2x + 3 = 11, so 2x = 8, therefore x = 4'
                    },
                    {
                        question: 'Simplify: 3(x + 2) - 2x',
                        options: ['x + 6', '5x + 6', 'x + 2', '3x + 4'],
                        correct: 0,
                        explanation: '3(x + 2) - 2x = 3x + 6 - 2x = x + 6'
                    },
                    {
                        question: 'If y = 2x + 5 and x = 3, what is y?',
                        options: ['10', '11', '12', '13'],
                        correct: 1,
                        explanation: 'y = 2(3) + 5 = 6 + 5 = 11'
                    }
                ]
            }
        ],
        'science': [
            {
                id: 'science-physics',
                title: 'Physics Basics',
                questions: [
                    {
                        question: 'What is the SI unit of force?',
                        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
                        correct: 1,
                        explanation: 'Newton (N) is the SI unit of force'
                    },
                    {
                        question: 'Speed of light in vacuum is approximately:',
                        options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
                        correct: 0,
                        explanation: 'Speed of light is approximately 3 × 10⁸ meters per second'
                    }
                ]
            }
        ],
        'english': [
            {
                id: 'english-grammar',
                title: 'Grammar Basics',
                questions: [
                    {
                        question: 'Which is the correct sentence?',
                        options: [
                            'She don\'t like apples',
                            'She doesn\'t like apples',
                            'She not like apples',
                            'She no like apples'
                        ],
                        correct: 1,
                        explanation: 'With third person singular (she), we use "doesn\'t" not "don\'t"'
                    }
                ]
            }
        ],
        'basic-computer': [
            {
                id: 'computer-basics-quiz',
                title: 'Computer Basics Quiz',
                questions: [
                    {
                        question: 'What does "Ctrl + C" do?',
                        options: ['Cut', 'Copy', 'Close', 'Create'],
                        correct: 1,
                        explanation: 'Ctrl + C copies the selected item to clipboard'
                    },
                    {
                        question: 'Which mouse button is used to open context menus?',
                        options: ['Left', 'Right', 'Middle', 'Scroll'],
                        correct: 1,
                        explanation: 'Right-clicking opens context menus with additional options'
                    }
                ]
            }
        ]
    };
    
    return allQuizzes[subject] || [];
}

// Start quiz
function startQuiz(quiz) {
    currentQuiz = quiz;
    currentQuestionIndex = 0;
    quizAnswers = [];
    quizStartTime = Date.now();
    
    showQuizModal();
    displayQuestion();
}

// Show quiz modal
function showQuizModal() {
    const modal = document.getElementById('quizModal');
    const title = document.getElementById('quizTitle');
    
    if (modal && title) {
        title.textContent = currentQuiz.title;
        modal.style.display = 'block';
    }
}

// Display current question
function displayQuestion() {
    const content = document.getElementById('quizContent');
    const question = currentQuiz.questions[currentQuestionIndex];
    
    if (!question) {
        showQuizResults();
        return;
    }
    
    const html = `
        <div class="quiz-question">
            <div class="question-header">
                <span class="question-number">Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</span>
                <div class="quiz-progress">
                    <div class="quiz-progress-fill" style="width: ${(currentQuestionIndex / currentQuiz.questions.length) * 100}%"></div>
                </div>
            </div>
            <h3 class="question-text">${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <label class="quiz-option">
                        <input type="radio" name="quizAnswer" value="${index}">
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
            <div class="quiz-actions">
                <button onclick="submitAnswer()" class="btn btn-primary" id="submitAnswerBtn">Submit Answer</button>
                ${currentQuestionIndex > 0 ? '<button onclick="previousQuestion()" class="btn btn-secondary">Previous</button>' : ''}
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

// Submit answer
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="quizAnswer"]:checked');
    
    if (!selectedOption) {
        showAlert('Please select an answer');
        return;
    }
    
    const answerIndex = parseInt(selectedOption.value);
    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correct;
    
    // Store answer
    quizAnswers[currentQuestionIndex] = {
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        isCorrect: isCorrect,
        question: question.question,
        selectedText: question.options[answerIndex],
        correctText: question.options[question.correct],
        explanation: question.explanation
    };
    
    // Show immediate feedback
    showAnswerFeedback(isCorrect, question.explanation);
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

// Show answer feedback
function showAnswerFeedback(isCorrect, explanation) {
    const content = document.getElementById('quizContent');
    const feedbackHtml = `
        <div class="answer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="feedback-text">
                <h3>${isCorrect ? 'Correct!' : 'Incorrect'}</h3>
                <p>${explanation}</p>
            </div>
        </div>
    `;
    content.innerHTML = feedbackHtml;
}

// Show quiz results
function showQuizResults() {
    const correctAnswers = quizAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = currentQuiz.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
    
    const content = document.getElementById('quizContent');
    const resultsHtml = `
        <div class="quiz-results">
            <div class="results-header">
                <h2>Quiz Complete!</h2>
                <div class="score-circle">
                    <div class="score-percentage">${percentage}%</div>
                    <div class="score-fraction">${correctAnswers}/${totalQuestions}</div>
                </div>
            </div>
            <div class="results-stats">
                <div class="stat-item">
                    <span class="stat-label">Time Taken:</span>
                    <span class="stat-value">${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Grade:</span>
                    <span class="stat-value">${getGrade(percentage)}</span>
                </div>
            </div>
            <div class="results-actions">
                <button onclick="reviewAnswers()" class="btn btn-secondary">Review Answers</button>
                <button onclick="retakeQuiz()" class="btn btn-outline">Retake Quiz</button>
                <button onclick="closeQuiz()" class="btn btn-primary">Continue Learning</button>
            </div>
        </div>
    `;
    
    content.innerHTML = resultsHtml;
    
    // Save quiz result
    saveQuizResult(currentQuiz.id, percentage, timeTaken, correctAnswers, totalQuestions);
}

// Get grade based on percentage
function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

// Save quiz result
function saveQuizResult(quizId, percentage, timeTaken, correct, total) {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    
    const result = {
        quizId,
        percentage,
        timeTaken,
        correct,
        total,
        date: new Date().toISOString(),
        answers: quizAnswers
    };
    
    results.push(result);
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Update completed assignments count
    updateDashboardCard('assignmentsDoneCount', results.length);
    
    // Update progress if this was a subject quiz
    updateSubjectProgress(quizId, percentage);
}

// Update subject progress
function updateSubjectProgress(quizId, percentage) {
    const subjectMap = {
        'math-': 'mathematics',
        'science-': 'science',
        'english-': 'english',
        'computer-': 'computer_science'
    };
    
    for (const [prefix, subject] of Object.entries(subjectMap)) {
        if (quizId.startsWith(prefix)) {
            const progress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
            progress[subject] = Math.max(progress[subject] || 0, percentage);
            localStorage.setItem('subjectProgress', JSON.stringify(progress));
            
            // Update progress bars if on progress section
            updateProgressDisplay();
            break;
        }
    }
}

// Update progress display
function updateProgressDisplay() {
    const progress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    
    // Update progress bars
    Object.entries(progress).forEach(([subject, percentage]) => {
        const progressBar = document.querySelector(`[data-subject="${subject}"] .progress-fill`);
        const progressText = document.querySelector(`[data-subject="${subject}"] .progress-percentage`);
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
    });
}

// Review answers
function reviewAnswers() {
    const content = document.getElementById('quizContent');
    const reviewHtml = `
        <div class="answer-review">
            <h3>Answer Review</h3>
            ${quizAnswers.map((answer, index) => `
                <div class="review-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-header">
                        <span class="question-num">Question ${index + 1}</span>
                        <span class="review-status">${answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}</span>
                    </div>
                    <div class="review-question">${answer.question}</div>
                    <div class="review-answers">
                        <div class="selected-answer">Your answer: ${answer.selectedText}</div>
                        ${!answer.isCorrect ? `<div class="correct-answer">Correct answer: ${answer.correctText}</div>` : ''}
                    </div>
                    <div class="review-explanation">${answer.explanation}</div>
                </div>
            `).join('')}
            <div class="review-actions">
                <button onclick="showQuizResults()" class="btn btn-primary">Back to Results</button>
            </div>
        </div>
    `;
    content.innerHTML = reviewHtml;
}

// Retake quiz
function retakeQuiz() {
    currentQuestionIndex = 0;
    quizAnswers = [];
    quizStartTime = Date.now();
    displayQuestion();
}

// Close quiz
function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentQuiz = null;
}

// Start module quiz (for digital literacy)
function startModuleQuiz(moduleId) {
    closeLiteracyModule();
    setTimeout(() => {
        openTest(moduleId);
    }, 300);
}

// OFFLINE FUNCTIONALITY
function initializeOfflineSystem() {
    loadOfflineStats();
    setupDownloadListeners();
    console.log('[Student] Offline system initialized');
}

// Load offline statistics
function loadOfflineStats() {
    const stats = getOfflineStats();
    
    updateOfflineStat('offlineVideosCount', stats.downloadedVideos);
    updateOfflineStat('offlinePDFsCount', stats.downloadedPDFs);
    updateOfflineStat('storageUsed', formatBytes(stats.storageUsed));
}

// Get offline statistics
function getOfflineStats() {
    const downloadedVideos = JSON.parse(localStorage.getItem('downloadedVideos') || '[]');
    const downloadedPDFs = JSON.parse(localStorage.getItem('downloadedPDFs') || '[]');
    const storageUsed = calculateStorageUsed();
    
    return {
        downloadedVideos: downloadedVideos.length,
        downloadedPDFs: downloadedPDFs.length,
        storageUsed: storageUsed
    };
}

// Update offline statistic
function updateOfflineStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Format bytes for display
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Calculate storage used
function calculateStorageUsed() {
    // Mock calculation - in real app would check actual file sizes
    const videos = JSON.parse(localStorage.getItem('downloadedVideos') || '[]');
    const pdfs = JSON.parse(localStorage.getItem('downloadedPDFs') || '[]');
    
    // Assume average sizes
    const avgVideoSize = 50 * 1024 * 1024; // 50MB per video
    const avgPDFSize = 2 * 1024 * 1024; // 2MB per PDF
    
    return (videos.length * avgVideoSize) + (pdfs.length * avgPDFSize);
}

// Setup download listeners
function setupDownloadListeners() {
    // This would integrate with service worker for actual downloads
    console.log('[Student] Download listeners set up');
}

// Download video
function downloadVideo(videoId) {
    const downloadedVideos = JSON.parse(localStorage.getItem('downloadedVideos') || '[]');
    
    if (downloadedVideos.includes(videoId)) {
        showAlert('Video already downloaded');
        return;
    }
    
    // Show download progress
    showDownloadProgress(videoId, 'video');
    
    // Simulate download
    let progress = 0;
    const downloadInterval = setInterval(() => {
        progress += Math.random() * 20;
        updateDownloadProgress(progress);
        
        if (progress >= 100) {
            clearInterval(downloadInterval);
            completeDownload(videoId, 'video');
        }
    }, 500);
}

// Download PDF
function downloadPDF(subject) {
    const downloadedPDFs = JSON.parse(localStorage.getItem('downloadedPDFs') || '[]');
    const pdfId = `${subject}-pdf`;
    
    if (downloadedPDFs.includes(pdfId)) {
        showAlert('PDF already downloaded');
        return;
    }
    
    showDownloadProgress(pdfId, 'pdf');
    
    // Simulate download
    let progress = 0;
    const downloadInterval = setInterval(() => {
        progress += Math.random() * 30;
        updateDownloadProgress(progress);
        
        if (progress >= 100) {
            clearInterval(downloadInterval);
            completeDownload(pdfId, 'pdf');
        }
    }, 300);
}

// Show download progress
function showDownloadProgress(itemId, type) {
    const progressHtml = `
        <div id="downloadProgress" class="download-progress">
            <div class="progress-header">
                <span>Downloading ${type === 'video' ? 'Video' : 'PDF'}...</span>
                <button onclick="cancelDownload()" class="cancel-btn">✕</button>
            </div>
            <div class="progress-bar">
                <div id="downloadProgressFill" class="progress-fill" style="width: 0%"></div>
            </div>
            <div id="downloadProgressText" class="progress-text">0%</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', progressHtml);
}

// Update download progress
function updateDownloadProgress(progress) {
    const progressFill = document.getElementById('downloadProgressFill');
    const progressText = document.getElementById('downloadProgressText');
    
    const clampedProgress = Math.min(progress, 100);
    
    if (progressFill) progressFill.style.width = `${clampedProgress}%`;
    if (progressText) progressText.textContent = `${Math.round(clampedProgress)}%`;
}

// Complete download
function completeDownload(itemId, type) {
    const storageKey = type === 'video' ? 'downloadedVideos' : 'downloadedPDFs';
    const downloads = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    downloads.push(itemId);
    localStorage.setItem(storageKey, JSON.stringify(downloads));
    
    // Remove progress indicator
    const progressElement = document.getElementById('downloadProgress');
    if (progressElement) {
        progressElement.remove();
    }
    
    // Update UI
    loadOfflineStats();
    loadOfflineContent();
    
    showAlert(`${type === 'video' ? 'Video' : 'PDF'} downloaded successfully!`);
}

// Cancel download
function cancelDownload() {
    const progressElement = document.getElementById('downloadProgress');
    if (progressElement) {
        progressElement.remove();
    }
}

// Load offline content display
function loadOfflineContent() {
    const videos = JSON.parse(localStorage.getItem('downloadedVideos') || '[]');
    const pdfs = JSON.parse(localStorage.getItem('downloadedPDFs') || '[]');
    
    // Update downloaded videos display
    const videosContainer = document.getElementById('downloadedVideos');
    if (videosContainer) {
        videosContainer.innerHTML = videos.map(videoId => `
            <div class="offline-item">
                <div class="item-info">
                    <span class="item-name">${formatVideoName(videoId)}</span>
                    <span class="item-size">~50MB</span>
                </div>
                <div class="item-actions">
                    <button onclick="playOfflineVideo('${videoId}')" class="btn btn-sm">▶️ Play</button>
                    <button onclick="deleteOfflineItem('${videoId}', 'video')" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            </div>
        `).join('') || '<p class="no-content">No videos downloaded yet</p>';
    }
    
    // Update downloaded PDFs display
    const pdfsContainer = document.getElementById('downloadedPDFs');
    if (pdfsContainer) {
        pdfsContainer.innerHTML = pdfs.map(pdfId => `
            <div class="offline-item">
                <div class="item-info">
                    <span class="item-name">${formatPDFName(pdfId)}</span>
                    <span class="item-size">~2MB</span>
                </div>
                <div class="item-actions">
                    <button onclick="openOfflinePDF('${pdfId}')" class="btn btn-sm">📖 Open</button>
                    <button onclick="deleteOfflineItem('${pdfId}', 'pdf')" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            </div>
        `).join('') || '<p class="no-content">No PDFs downloaded yet</p>';
    }
}

// Format video name for display
function formatVideoName(videoId) {
    const names = {
        'algebra_fundamentals': 'Algebra Fundamentals',
        'physics_laws': 'Physics Laws Explained',
        'english_grammar': 'English Grammar Basics',
        'world_history': 'World History Overview',
        'programming_basics': 'Programming Basics',
        'physical_geography': 'Physical Geography'
    };
    return names[videoId] || videoId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Format PDF name for display
function formatPDFName(pdfId) {
    return pdfId.replace('-pdf', '').replace(/\b\w/g, l => l.toUpperCase()) + ' Study Material';
}

// Play offline video
function playOfflineVideo(videoId) {
    showAlert('Opening offline video player...');
    // In real implementation, would open cached video file
}

// Open offline PDF
function openOfflinePDF(pdfId) {
    showAlert('Opening PDF viewer...');
    // In real implementation, would open cached PDF file
}

// Delete offline item
function deleteOfflineItem(itemId, type) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        const storageKey = type === 'video' ? 'downloadedVideos' : 'downloadedPDFs';
        const downloads = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filtered = downloads.filter(id => id !== itemId);
        
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        
        loadOfflineStats();
        loadOfflineContent();
        
        showAlert(`${type === 'video' ? 'Video' : 'PDF'} deleted`);
    }
}

// Clear all offline content
function clearOfflineContent() {
    if (confirm('Are you sure you want to delete all downloaded content?')) {
        localStorage.removeItem('downloadedVideos');
        localStorage.removeItem('downloadedPDFs');
        
        loadOfflineStats();
        loadOfflineContent();
        
        showAlert('All offline content cleared');
    }
}

// UTILITY FUNCTIONS

// Track module start
function trackModuleStart(moduleId) {
    const started = JSON.parse(localStorage.getItem('startedModules') || '[]');
    if (!started.includes(moduleId)) {
        started.push(moduleId);
        localStorage.setItem('startedModules', JSON.stringify(started));
    }
}

// Load additional data functions
function loadSubjectsData() {
    console.log('[Student] Loading subjects data');
}

function loadVideosData() {
    console.log('[Student] Loading videos data');
}

function loadAssignmentsData() {
    console.log('[Student] Loading assignments data');
}

function loadProgressData() {
    updateProgressDisplay();
    console.log('[Student] Loading progress data');
}

// Watch video function
function watchVideo(url) {
    if (navigator.onLine) {
        window.open(url, '_blank');
    } else {
        showAlert('You are offline. Please download the video first or connect to the internet.');
    }
}

// Navigation and connectivity functions (similar to login page)
function setupMainInterfaceNavigation() {
    history.replaceState(null, null, window.location.href);
    
    window.addEventListener('popstate', function(event) {
        if (confirm('Are you sure you want to exit the learning platform?')) {
            window.close();
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 100);
        } else {
            history.pushState(null, null, window.location.href);
        }
    });
}

function setupConnectivityMonitoring() {
    const status = document.getElementById('connectivityStatus');
    
    function updateConnectivityStatus() {
        if (status) {
            if (navigator.onLine) {
                status.innerHTML = '🟢 Online';
                status.style.background = '#d4edda';
                status.style.color = '#155724';
                document.body.classList.remove('offline-mode');
            } else {
                status.innerHTML = '🔴 Offline';
                status.style.background = '#f8d7da';
                status.style.color = '#721c24';
                document.body.classList.add('offline-mode');
            }
        }
    }
    
    updateConnectivityStatus();
    window.addEventListener('online', updateConnectivityStatus);
    window.addEventListener('offline', updateConnectivityStatus);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Enhanced alert system
function showAlert(message) {
    if (window.PunjabLearning && window.PunjabLearning.showAlert) {
        window.PunjabLearning.showAlert(message);
    } else {
        alert(message);
    }
}

// Export functions for global access
window.StudentDashboard = {
    translateText,
    quickTranslate,
    speakPunjabi,
    startLiteracyModule,
    openTest,
    downloadVideo,
    downloadPDF,
    watchVideo,
    loadOfflineContent,
    clearOfflineContent
};
// Mobile sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.className = 'sidebar-overlay';
        document.body.appendChild(newOverlay);
    }
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-active');
            const currentOverlay = document.querySelector('.sidebar-overlay');
            if (currentOverlay) {
                currentOverlay.classList.toggle('active');
            }
        });
        
        // Close sidebar when clicking overlay
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('sidebar-overlay')) {
                sidebar.classList.remove('mobile-active');
                e.target.classList.remove('active');
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-active');
                    const currentOverlay = document.querySelector('.sidebar-overlay');
                    if (currentOverlay) {
                        currentOverlay.classList.remove('active');
                    }
                }
            }
        });
    }
});

console.log('[Student] Student dashboard fully loaded');