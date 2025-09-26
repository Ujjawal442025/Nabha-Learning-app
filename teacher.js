// Enhanced Teacher Dashboard JavaScript for Punjab Learning Platform

// Initialize teacher dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check login state and redirect if not logged in
    if (!sessionStorage.getItem('loggedIn') || sessionStorage.getItem('userType') !== 'teacher') {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize all components
    initializeTeacherDashboard();
    setupNavigationListeners();
    setupConnectivityMonitoring();
    loadTeacherData();
    initializeClassrooms();
    initializeStudents();
    initializeContent();
    initializeAssignments();
    
    // Apply saved language
    const savedLanguage = sessionStorage.getItem('selectedLanguage') || 'english';
    if (window.languageManager) {
        window.languageManager.setLanguage(savedLanguage);
    }
});

// Initialize teacher dashboard
function initializeTeacherDashboard() {
    // Set welcome message
    const name = sessionStorage.getItem('nava_user_name');
    const welcomeElement = document.getElementById('welcomeName');
    if (welcomeElement && name) {
        const welcomeText = window.languageManager ? 
            window.languageManager.translate('welcome') : 'Welcome';
        welcomeElement.textContent = `${welcomeText}, ${name}`;
    }
    
    // Load and display teacher statistics
    loadTeacherStats();
    
    // Setup main interface navigation
    setupMainInterfaceNavigation();
    
    console.log('[Teacher] Dashboard initialized');
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
            loadTeacherStats();
            break;
        case 'classrooms':
            loadClassrooms();
            break;
        case 'students':
            loadStudents();
            break;
        case 'content':
            loadContent();
            break;
        case 'assignments':
            loadAssignments();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'upload':
            loadUploadSection();
            break;
    }
}

// Load teacher statistics
function loadTeacherStats() {
    const classrooms = getClassrooms();
    const students = getStudents();
    const content = getContent();
    const assignments = getAssignments();
    
    updateDashboardCard('totalClassroomsCount', classrooms.length);
    updateDashboardCard('totalStudentsCount', students.length);
    updateDashboardCard('totalContentCount', content.length);
    updateDashboardCard('assignmentsGivenCount', assignments.length);
    
    console.log('[Teacher] Statistics loaded');
}

// Update dashboard cards
function updateDashboardCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// CLASSROOM MANAGEMENT
let classroomsData = [];

function initializeClassrooms() {
    // Load classrooms from localStorage or initialize with demo data
    const savedClassrooms = localStorage.getItem('teacherClassrooms');
    if (savedClassrooms) {
        classroomsData = JSON.parse(savedClassrooms);
    } else {
        // Demo classrooms
        classroomsData = [
            {
                id: 'class-10a',
                name: 'Class 10-A Mathematics',
                subject: 'mathematics',
                grade: '10',
                description: 'Advanced mathematics for grade 10 students',
                studentsCount: 18,
                createdDate: '2024-08-15',
                status: 'active'
            },
            {
                id: 'class-9b',
                name: 'Class 9-B Science',
                subject: 'science',
                grade: '9',
                description: 'General science curriculum for grade 9',
                studentsCount: 12,
                createdDate: '2024-08-20',
                status: 'active'
            },
            {
                id: 'class-11c',
                name: 'Class 11-C Computer Science',
                subject: 'computer',
                grade: '11',
                description: 'Programming and computer fundamentals',
                studentsCount: 15,
                createdDate: '2024-09-01',
                status: 'active'
            }
        ];
        saveClassrooms();
    }
}

function getClassrooms() {
    return classroomsData;
}

function saveClassrooms() {
    localStorage.setItem('teacherClassrooms', JSON.stringify(classroomsData));
}

function loadClassrooms() {
    const grid = document.getElementById('classroomsGrid');
    if (!grid) return;
    
    grid.innerHTML = classroomsData.map(classroom => `
        <div class="classroom-card">
            <div class="classroom-header">
                <h3 class="classroom-name">${classroom.name}</h3>
                <span class="classroom-status ${classroom.status}">${classroom.status}</span>
            </div>
            <div class="classroom-info">
                <p><strong>Subject:</strong> ${formatSubjectName(classroom.subject)}</p>
                <p><strong>Grade:</strong> ${classroom.grade}</p>
                <p><strong>Students:</strong> ${classroom.studentsCount}</p>
                <p><strong>Created:</strong> ${formatDate(classroom.createdDate)}</p>
            </div>
            <div class="classroom-description">
                <p>${classroom.description}</p>
            </div>
            <div class="classroom-actions">
                <button class="btn btn-primary btn-sm" onclick="viewClassroom('${classroom.id}')">👥 View Students</button>
                <button class="btn btn-secondary btn-sm" onclick="manageClassroom('${classroom.id}')">⚙️ Manage</button>
                <button class="btn btn-outline btn-sm" onclick="viewClassroomAnalytics('${classroom.id}')">📊 Analytics</button>
            </div>
        </div>
    `).join('');
}

function showCreateClassroomModal() {
    document.getElementById('createClassroomModal').style.display = 'block';
}

function createClassroom(event) {
    event.preventDefault();
    
    const name = document.getElementById('classroomName').value;
    const subject = document.getElementById('classroomSubject').value;
    const grade = document.getElementById('classroomGrade').value;
    const description = document.getElementById('classroomDescription').value;
    
    const newClassroom = {
        id: `class-${grade}${subject.substring(0,3)}-${Date.now()}`,
        name,
        subject,
        grade,
        description,
        studentsCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    classroomsData.push(newClassroom);
    saveClassrooms();
    loadClassrooms();
    updateClassroomSelects();
    
    closeModal('createClassroomModal');
    showAlert('Classroom created successfully!');
    
    // Update dashboard stats
    loadTeacherStats();
}

function viewClassroom(classroomId) {
    const classroom = classroomsData.find(c => c.id === classroomId);
    if (classroom) {
        // Switch to students section and filter by classroom
        showSection('students');
        const filter = document.getElementById('classroomFilter');
        if (filter) {
            filter.value = classroomId;
            filterStudents();
        }
    }
}

function manageClassroom(classroomId) {
    const classroom = classroomsData.find(c => c.id === classroomId);
    if (classroom) {
        showAlert(`Managing classroom: ${classroom.name}\n\nFeatures:\n• Edit classroom details\n• Add/remove students\n• Manage content\n• View performance`);
    }
}

function viewClassroomAnalytics(classroomId) {
    const classroom = classroomsData.find(c => c.id === classroomId);
    if (classroom) {
        showSection('analytics');
        showAlert(`Viewing analytics for: ${classroom.name}`);
    }
}

// STUDENT MANAGEMENT
let studentsData = [];

function initializeStudents() {
    const savedStudents = localStorage.getItem('teacherStudents');
    if (savedStudents) {
        studentsData = JSON.parse(savedStudents);
    } else {
        // Demo students
        studentsData = [
            {
                id: 'stu001',
                name: 'Ravi Kumar',
                email: 'ravi.kumar@student.edu',
                classroomId: 'class-10a',
                studentId: 'STU001',
                enrollmentDate: '2024-08-15',
                status: 'active',
                progress: { math: 85, science: 78, english: 92 },
                lastActivity: '2024-09-15',
                assignmentsCompleted: 12,
                attendance: 95
            },
            {
                id: 'stu002',
                name: 'Priya Singh',
                email: 'priya.singh@student.edu',
                classroomId: 'class-10a',
                studentId: 'STU002',
                enrollmentDate: '2024-08-15',
                status: 'active',
                progress: { math: 78, science: 85, english: 88 },
                lastActivity: '2024-09-14',
                assignmentsCompleted: 11,
                attendance: 92
            },
            {
                id: 'stu003',
                name: 'Arjun Patel',
                email: 'arjun.patel@student.edu',
                classroomId: 'class-9b',
                studentId: 'STU003',
                enrollmentDate: '2024-08-20',
                status: 'active',
                progress: { science: 82, english: 79, math: 75 },
                lastActivity: '2024-09-15',
                assignmentsCompleted: 8,
                attendance: 88
            },
            {
                id: 'stu004',
                name: 'Simran Kaur',
                email: 'simran.kaur@student.edu',
                classroomId: 'class-11c',
                studentId: 'STU004',
                enrollmentDate: '2024-09-01',
                status: 'active',
                progress: { computer: 95, math: 87, english: 90 },
                lastActivity: '2024-09-16',
                assignmentsCompleted: 5,
                attendance: 98
            },
            {
                id: 'stu005',
                name: 'Manpreet Sidhu',
                email: 'manpreet.sidhu@student.edu',
                classroomId: 'class-9b',
                studentId: 'STU005',
                enrollmentDate: '2024-08-22',
                status: 'active',
                progress: { science: 73, english: 81, math: 69 },
                lastActivity: '2024-09-13',
                assignmentsCompleted: 7,
                attendance: 85
            }
        ];
        saveStudents();
    }
    updateClassroomSelects();
}

function getStudents() {
    return studentsData;
}

function saveStudents() {
    localStorage.setItem('teacherStudents', JSON.stringify(studentsData));
}

function loadStudents() {
    displayStudents(studentsData);
}

function displayStudents(students) {
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;
    
    grid.innerHTML = students.map(student => {
        const classroom = classroomsData.find(c => c.id === student.classroomId);
        const classroomName = classroom ? classroom.name : 'Unknown';
        
        return `
            <div class="student-card">
                <div class="student-header">
                    <div class="student-avatar">👤</div>
                    <div class="student-info">
                        <h3 class="student-name">${student.name}</h3>
                        <p class="student-id">ID: ${student.studentId}</p>
                        <p class="student-classroom">${classroomName}</p>
                    </div>
                    <div class="student-status ${student.status}">${student.status}</div>
                </div>
                <div class="student-stats">
                    <div class="stat">
                        <span class="stat-label">Assignments</span>
                        <span class="stat-value">${student.assignmentsCompleted}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Attendance</span>
                        <span class="stat-value">${student.attendance}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Last Active</span>
                        <span class="stat-value">${formatDateShort(student.lastActivity)}</span>
                    </div>
                </div>
                <div class="student-progress">
                    ${Object.entries(student.progress).map(([subject, score]) => `
                        <div class="progress-item">
                            <span class="progress-subject">${formatSubjectName(subject)}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${score}%"></div>
                            </div>
                            <span class="progress-percentage">${score}%</span>
                        </div>
                    `).join('')}
                </div>
                <div class="student-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewStudentDetails('${student.id}')">👁️ View</button>
                    <button class="btn btn-secondary btn-sm" onclick="messageStudent('${student.id}')">💬 Message</button>
                    <button class="btn btn-outline btn-sm" onclick="viewStudentProgress('${student.id}')">📊 Progress</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterStudents() {
    const classroomFilter = document.getElementById('classroomFilter').value;
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    
    let filteredStudents = studentsData;
    
    if (classroomFilter) {
        filteredStudents = filteredStudents.filter(student => student.classroomId === classroomFilter);
    }
    
    if (searchTerm) {
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm)
        );
    }
    
    displayStudents(filteredStudents);
}

function searchStudents() {
    filterStudents();
}

function showAddStudentModal() {
    updateClassroomSelects();
    document.getElementById('addStudentModal').style.display = 'block';
}

function addStudent(event) {
    event.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const classroomId = document.getElementById('studentClassroom').value;
    const studentId = document.getElementById('studentId').value;
    
    // Check if student ID already exists
    if (studentsData.find(s => s.studentId === studentId)) {
        showAlert('Student ID already exists. Please use a different ID.');
        return;
    }
    
    const newStudent = {
        id: `stu-${Date.now()}`,
        name,
        email,
        classroomId,
        studentId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: { math: 0, science: 0, english: 0 },
        lastActivity: new Date().toISOString().split('T')[0],
        assignmentsCompleted: 0,
        attendance: 100
    };
    
    studentsData.push(newStudent);
    saveStudents();
    
    // Update classroom student count
    const classroom = classroomsData.find(c => c.id === classroomId);
    if (classroom) {
        classroom.studentsCount++;
        saveClassrooms();
    }
    
    loadStudents();
    loadTeacherStats();
    
    closeModal('addStudentModal');
    showAlert('Student added successfully!');
}

function viewStudentDetails(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    
    const classroom = classroomsData.find(c => c.id === student.classroomId);
    const classroomName = classroom ? classroom.name : 'Unknown';
    
    const modal = document.getElementById('studentDetailModal');
    const nameElement = document.getElementById('studentDetailName');
    const contentElement = document.getElementById('studentDetailContent');
    
    nameElement.textContent = student.name;
    contentElement.innerHTML = `
        <div class="student-detail-content">
            <div class="detail-section">
                <h3>📋 Basic Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Student ID:</label>
                        <span>${student.studentId}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${student.email || 'Not provided'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Classroom:</label>
                        <span>${classroomName}</span>
                    </div>
                    <div class="detail-item">
                        <label>Enrollment Date:</label>
                        <span>${formatDate(student.enrollmentDate)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-badge ${student.status}">${student.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Last Activity:</label>
                        <span>${formatDate(student.lastActivity)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>📊 Performance Overview</h3>
                <div class="performance-grid">
                    <div class="performance-card">
                        <h4>Assignments Completed</h4>
                        <span class="performance-number">${student.assignmentsCompleted}</span>
                    </div>
                    <div class="performance-card">
                        <h4>Attendance Rate</h4>
                        <span class="performance-number">${student.attendance}%</span>
                    </div>
                    <div class="performance-card">
                        <h4>Average Score</h4>
                        <span class="performance-number">${calculateAverageScore(student.progress)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>📈 Subject Progress</h3>
                <div class="subject-progress">
                    ${Object.entries(student.progress).map(([subject, score]) => `
                        <div class="subject-progress-item">
                            <div class="subject-info">
                                <span class="subject-name">${formatSubjectName(subject)}</span>
                                <span class="subject-score">${score}%</span>
                            </div>
                            <div class="subject-progress-bar">
                                <div class="subject-progress-fill" style="width: ${score}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="editStudent('${student.id}')">✏️ Edit Student</button>
                <button class="btn btn-secondary" onclick="viewStudentActivity('${student.id}')">📈 View Activity</button>
                <button class="btn btn-outline" onclick="exportStudentData('${student.id}')">📤 Export Data</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function viewStudent(studentId) {
    viewStudentDetails(studentId);
}

function messageStudent(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        showAlert(`Messaging feature for ${student.name}\n\nThis would open a messaging interface to communicate with the student.`);
    }
}

function viewStudentProgress(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        showAlert(`Progress Report for ${student.name}\n\nAverage Score: ${calculateAverageScore(student.progress)}%\nAssignments: ${student.assignmentsCompleted}\nAttendance: ${student.attendance}%`);
    }
}

function calculateAverageScore(progress) {
    const scores = Object.values(progress);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

// CONTENT MANAGEMENT
let contentData = [];
let currentContentTab = 'videos';

function initializeContent() {
    const savedContent = localStorage.getItem('teacherContent');
    if (savedContent) {
        contentData = JSON.parse(savedContent);
    } else {
        // Demo content
        contentData = [
            {
                id: 'video001',
                type: 'video',
                title: 'Algebra Fundamentals',
                subject: 'mathematics',
                grade: '10',
                description: 'Introduction to algebraic equations',
                uploadDate: '2024-09-01',
                size: '45MB',
                duration: '25:30',
                views: 156,
                status: 'published'
            },
            {
                id: 'pdf001',
                type: 'pdf',
                title: 'Physics Laws Reference',
                subject: 'science',
                grade: '9',
                description: 'Complete reference for physics laws',
                uploadDate: '2024-08-28',
                size: '2.3MB',
                pages: 24,
                downloads: 89,
                status: 'published'
            },
            {
                id: 'quiz001',
                type: 'quiz',
                title: 'English Grammar Test',
                subject: 'english',
                grade: '10',
                description: 'Assessment on basic grammar rules',
                createdDate: '2024-09-05',
                questions: 15,
                attempts: 67,
                avgScore: 78,
                status: 'active'
            }
        ];
        saveContent();
    }
}

function getContent() {
    return contentData;
}

function saveContent() {
    localStorage.setItem('teacherContent', JSON.stringify(contentData));
}

function loadContent() {
    showContentTab(currentContentTab);
}

function showContentTab(tabType) {
    currentContentTab = tabType;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target?.classList.add('active') || 
    document.querySelector(`[onclick="showContentTab('${tabType}')"]`)?.classList.add('active');
    
    const filteredContent = contentData.filter(content => content.type === tabType);
    displayContent(filteredContent);
}

function displayContent(content) {
    const grid = document.getElementById('contentGrid');
    if (!grid) return;
    
    grid.innerHTML = content.map(item => {
        switch(item.type) {
            case 'video':
                return createVideoContentCard(item);
            case 'pdf':
                return createPDFContentCard(item);
            case 'quiz':
                return createQuizContentCard(item);
            default:
                return '';
        }
    }).join('');
}

function createVideoContentCard(video) {
    return `
        <div class="content-card video-content">
            <div class="content-thumbnail">🎬</div>
            <div class="content-info">
                <h3 class="content-title">${video.title}</h3>
                <p class="content-subject">${formatSubjectName(video.subject)} • Grade ${video.grade}</p>
                <p class="content-description">${video.description}</p>
                <div class="content-meta">
                    <span>📺 ${video.views} views</span>
                    <span>⏱️ ${video.duration}</span>
                    <span>💾 ${video.size}</span>
                </div>
                <div class="content-status ${video.status}">${video.status}</div>
            </div>
            <div class="content-actions">
                <button class="btn btn-primary btn-sm" onclick="viewContent('${video.id}')">👁️ View</button>
                <button class="btn btn-secondary btn-sm" onclick="editContent('${video.id}')">✏️ Edit</button>
                <button class="btn btn-outline btn-sm" onclick="shareContent('${video.id}')">🔗 Share</button>
            </div>
        </div>
    `;
}

function createPDFContentCard(pdf) {
    return `
        <div class="content-card pdf-content">
            <div class="content-thumbnail">📄</div>
            <div class="content-info">
                <h3 class="content-title">${pdf.title}</h3>
                <p class="content-subject">${formatSubjectName(pdf.subject)} • Grade ${pdf.grade}</p>
                <p class="content-description">${pdf.description}</p>
                <div class="content-meta">
                    <span>📥 ${pdf.downloads} downloads</span>
                    <span>📑 ${pdf.pages} pages</span>
                    <span>💾 ${pdf.size}</span>
                </div>
                <div class="content-status ${pdf.status}">${pdf.status}</div>
            </div>
            <div class="content-actions">
                <button class="btn btn-primary btn-sm" onclick="viewContent('${pdf.id}')">👁️ View</button>
                <button class="btn btn-secondary btn-sm" onclick="editContent('${pdf.id}')">✏️ Edit</button>
                <button class="btn btn-outline btn-sm" onclick="shareContent('${pdf.id}')">🔗 Share</button>
            </div>
        </div>
    `;
}

function createQuizContentCard(quiz) {
    return `
        <div class="content-card quiz-content">
            <div class="content-thumbnail">❓</div>
            <div class="content-info">
                <h3 class="content-title">${quiz.title}</h3>
                <p class="content-subject">${formatSubjectName(quiz.subject)} • Grade ${quiz.grade}</p>
                <p class="content-description">${quiz.description}</p>
                <div class="content-meta">
                    <span>✏️ ${quiz.attempts} attempts</span>
                    <span>❓ ${quiz.questions} questions</span>
                    <span>📊 ${quiz.avgScore}% avg</span>
                </div>
                <div class="content-status ${quiz.status}">${quiz.status}</div>
            </div>
            <div class="content-actions">
                <button class="btn btn-primary btn-sm" onclick="viewContent('${quiz.id}')">👁️ View</button>
                <button class="btn btn-secondary btn-sm" onclick="editContent('${quiz.id}')">✏️ Edit</button>
                <button class="btn btn-outline btn-sm" onclick="duplicateQuiz('${quiz.id}')">📄 Duplicate</button>
            </div>
        </div>
    `;
}

function viewContent(contentId) {
    const content = contentData.find(c => c.id === contentId);
    if (content) {
        showAlert(`Viewing: ${content.title}\n\nType: ${content.type}\nSubject: ${formatSubjectName(content.subject)}\n\nThis would open the content viewer.`);
    }
}

function editContent(contentId) {
    const content = contentData.find(c => c.id === contentId);
    if (content) {
        showAlert(`Editing: ${content.title}\n\nThis would open the content editor.`);
    }
}

function shareContent(contentId) {
    const content = contentData.find(c => c.id === contentId);
    if (content) {
        showAlert(`Share: ${content.title}\n\nShare link: app.punjab.edu/content/${contentId}\n\nThis would provide sharing options.`);
    }
}

// ASSIGNMENT MANAGEMENT
let assignmentsData = [];

function initializeAssignments() {
    const savedAssignments = localStorage.getItem('teacherAssignments');
    if (savedAssignments) {
        assignmentsData = JSON.parse(savedAssignments);
    } else {
        // Demo assignments
        assignmentsData = [
            {
                id: 'assign001',
                title: 'Algebra Practice Problems',
                classroomId: 'class-10a',
                description: 'Complete exercises 1-15 from Chapter 3',
                dueDate: '2024-09-25T23:59',
                points: 100,
                createdDate: '2024-09-10',
                submissions: 15,
                totalStudents: 18,
                avgScore: 85,
                status: 'active'
            },
            {
                id: 'assign002',
                title: 'Physics Lab Report',
                classroomId: 'class-9b',
                description: 'Write a detailed report on the pendulum experiment',
                dueDate: '2024-09-28T23:59',
                points: 150,
                createdDate: '2024-09-12',
                submissions: 8,
                totalStudents: 12,
                avgScore: 78,
                status: 'active'
            },
            {
                id: 'assign003',
                title: 'Programming Project',
                classroomId: 'class-11c',
                description: 'Create a simple calculator using Python',
                dueDate: '2024-10-05T23:59',
                points: 200,
                createdDate: '2024-09-15',
                submissions: 3,
                totalStudents: 15,
                avgScore: 92,
                status: 'active'
            }
        ];
        saveAssignments();
    }
}

function getAssignments() {
    return assignmentsData;
}

function saveAssignments() {
    localStorage.setItem('teacherAssignments', JSON.stringify(assignmentsData));
}

function loadAssignments() {
    const grid = document.getElementById('assignmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = assignmentsData.map(assignment => {
        const classroom = classroomsData.find(c => c.id === assignment.classroomId);
        const classroomName = classroom ? classroom.name : 'Unknown';
        const submissionRate = Math.round((assignment.submissions / assignment.totalStudents) * 100);
        const daysUntilDue = getDaysUntilDue(assignment.dueDate);
        
        return `
            <div class="assignment-card">
                <div class="assignment-header">
                    <h3 class="assignment-title">${assignment.title}</h3>
                    <div class="assignment-status ${assignment.status}">${assignment.status}</div>
                </div>
                <div class="assignment-info">
                    <p><strong>Classroom:</strong> ${classroomName}</p>
                    <p><strong>Due Date:</strong> ${formatDateTime(assignment.dueDate)}</p>
                    <p><strong>Points:</strong> ${assignment.points}</p>
                    <p class="assignment-description">${assignment.description}</p>
                </div>
                <div class="assignment-stats">
                    <div class="stat-item">
                        <span class="stat-number">${assignment.submissions}/${assignment.totalStudents}</span>
                        <span class="stat-label">Submissions (${submissionRate}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${assignment.avgScore}%</span>
                        <span class="stat-label">Average Score</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number ${daysUntilDue < 0 ? 'overdue' : daysUntilDue < 3 ? 'urgent' : ''}">${Math.abs(daysUntilDue)} days</span>
                        <span class="stat-label">${daysUntilDue < 0 ? 'Overdue' : 'Until Due'}</span>
                    </div>
                </div>
                <div class="assignment-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewAssignmentSubmissions('${assignment.id}')">📄 Submissions</button>
                    <button class="btn btn-secondary btn-sm" onclick="editAssignment('${assignment.id}')">✏️ Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="duplicateAssignment('${assignment.id}')">📄 Duplicate</button>
                </div>
            </div>
        `;
    }).join('');
}

function showCreateAssignmentModal() {
    updateClassroomSelects();
    // Set default due date to 1 week from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    document.getElementById('assignmentDueDate').value = dueDate.toISOString().slice(0, 16);
    
    document.getElementById('createAssignmentModal').style.display = 'block';
}

function createAssignment(event) {
    event.preventDefault();
    
    const title = document.getElementById('assignmentTitle').value;
    const classroomId = document.getElementById('assignmentClassroom').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    const description = document.getElementById('assignmentDescription').value;
    const points = parseInt(document.getElementById('assignmentPoints').value);
    
    const classroom = classroomsData.find(c => c.id === classroomId);
    const totalStudents = classroom ? classroom.studentsCount : 0;
    
    const newAssignment = {
        id: `assign-${Date.now()}`,
        title,
        classroomId,
        description,
        dueDate,
        points,
        createdDate: new Date().toISOString().split('T')[0],
        submissions: 0,
        totalStudents,
        avgScore: 0,
        status: 'active'
    };
    
    assignmentsData.push(newAssignment);
    saveAssignments();
    loadAssignments();
    loadTeacherStats();
    
    closeModal('createAssignmentModal');
    showAlert('Assignment created successfully!');
}

function viewAssignmentSubmissions(assignmentId) {
    const assignment = assignmentsData.find(a => a.id === assignmentId);
    if (assignment) {
        showAlert(`Assignment Submissions: ${assignment.title}\n\nSubmissions: ${assignment.submissions}/${assignment.totalStudents}\nAverage Score: ${assignment.avgScore}%\n\nThis would show detailed submission list.`);
    }
}

function editAssignment(assignmentId) {
    const assignment = assignmentsData.find(a => a.id === assignmentId);
    if (assignment) {
        showAlert(`Edit Assignment: ${assignment.title}\n\nThis would open the assignment editor.`);
    }
}

function duplicateAssignment(assignmentId) {
    const assignment = assignmentsData.find(a => a.id === assignmentId);
    if (assignment) {
        const duplicated = {
            ...assignment,
            id: `assign-${Date.now()}`,
            title: `${assignment.title} (Copy)`,
            createdDate: new Date().toISOString().split('T')[0],
            submissions: 0,
            avgScore: 0
        };
        
        assignmentsData.push(duplicated);
        saveAssignments();
        loadAssignments();
        
        showAlert(`Assignment duplicated: ${duplicated.title}`);
    }
}

// UPLOAD FUNCTIONALITY
function loadUploadSection() {
    // Setup drag and drop for upload areas
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
        area.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const uploadType = e.currentTarget.closest('.upload-card').querySelector('h3').textContent.includes('Video') ? 'video' : 'pdf';
        simulateFileUpload(file, uploadType);
    }
}

function triggerFileInput(inputId) {
    document.getElementById(inputId).click();
}

function handleFileUpload(input, type) {
    const file = input.files[0];
    if (file) {
        simulateFileUpload(file, type);
    }
}

function simulateFileUpload(file, type) {
    // Validate file
    const maxSizes = { video: 500 * 1024 * 1024, pdf: 50 * 1024 * 1024 }; // 500MB for video, 50MB for PDF
    const allowedTypes = { 
        video: ['video/mp4', 'video/avi', 'video/mov'], 
        pdf: ['application/pdf'] 
    };
    
    if (file.size > maxSizes[type]) {
        showAlert(`File too large! Maximum size for ${type} is ${type === 'video' ? '500MB' : '50MB'}.`);
        return;
    }
    
    if (!allowedTypes[type].includes(file.type)) {
        showAlert(`Invalid file type! Please select a valid ${type} file.`);
        return;
    }
    
    // Show upload progress
    showUploadProgress(file.name, type);
    
    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
        progress += Math.random() * 15;
        updateUploadProgress(progress);
        
        if (progress >= 100) {
            clearInterval(uploadInterval);
            completeUpload(file, type);
        }
    }, 500);
}

function showUploadProgress(filename, type) {
    const modal = document.getElementById('uploadProgressModal');
    const status = document.getElementById('uploadStatus');
    
    status.textContent = `Uploading ${filename}...`;
    modal.style.display = 'block';
}

function updateUploadProgress(progress) {
    const fill = document.getElementById('uploadProgressFill');
    const text = document.getElementById('uploadProgressText');
    
    const clampedProgress = Math.min(progress, 100);
    fill.style.width = `${clampedProgress}%`;
    text.textContent = `${Math.round(clampedProgress)}%`;
}

function completeUpload(file, type) {
    // Add to content data
    const newContent = {
        id: `${type}-${Date.now()}`,
        type: type,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        subject: 'general',
        grade: '10',
        description: `Uploaded ${type} content`,
        uploadDate: new Date().toISOString().split('T')[0],
        size: formatFileSize(file.size),
        status: 'published'
    };
    
    if (type === 'video') {
        newContent.duration = '00:00';
        newContent.views = 0;
    } else if (type === 'pdf') {
        newContent.pages = 1;
        newContent.downloads = 0;
    }
    
    contentData.push(newContent);
    saveContent();
    loadTeacherStats();
    
    closeModal('uploadProgressModal');
    showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
}

function cancelUpload() {
    closeModal('uploadProgressModal');
}

function showUploadContentModal() {
    showSection('upload');
}

// ANALYTICS
function loadAnalytics() {
    // Analytics are already displayed in the HTML
    // This function could be used to update charts with real data
    console.log('[Teacher] Analytics loaded');
}

// UTILITY FUNCTIONS
function updateClassroomSelects() {
    const selects = ['studentClassroom', 'assignmentClassroom'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Clear existing options except the first one
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Add classroom options
            classroomsData.forEach(classroom => {
                const option = document.createElement('option');
                option.value = classroom.id;
                option.textContent = classroom.name;
                select.appendChild(option);
            });
        }
    });
}

function formatSubjectName(subject) {
    const subjects = {
        mathematics: 'Mathematics',
        science: 'Science',
        english: 'English',
        history: 'History',
        computer: 'Computer Science',
        geography: 'Geography',
        general: 'General'
    };
    return subjects[subject] || subject;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateShort(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDaysUntilDue(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function showSection(sectionId) {
    // Remove active from all sections and buttons
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
    
    // Show target section and activate button
    const targetSection = document.getElementById(sectionId);
    const targetButton = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetButton) targetButton.classList.add('active');
    
    // Load section content
    loadSectionContent(sectionId);
}

// MODAL FUNCTIONS
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showCreateQuizModal() {
    showAlert('Quiz Creator\n\nThis would open an interactive quiz creator where you can:\n• Add multiple choice questions\n• Set correct answers\n• Add explanations\n• Configure time limits\n• Assign to classrooms');
}

// COMMON FUNCTIONS
function loadTeacherData() {
    // Load all teacher-related data
    loadClassrooms();
    loadStudents();
    loadContent();
    loadAssignments();
}

// Navigation and connectivity (similar to student dashboard)
function setupMainInterfaceNavigation() {
    history.replaceState(null, null, window.location.href);
    
    window.addEventListener('popstate', function(event) {
        if (confirm('Are you sure you want to exit the teaching platform?')) {
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
window.TeacherDashboard = {
    createClassroom,
    addStudent,
    createAssignment,
    viewStudentDetails,
    loadContent,
    showCreateQuizModal
};


// Mobile sidebar toggle functionality for teacher dashboard
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
console.log('[Teacher] Teacher dashboard fully loaded');