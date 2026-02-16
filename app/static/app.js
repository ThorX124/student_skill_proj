// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// State
let students = [];
let skills = [];
let currentStudent = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDashboard();
    loadStudents();
    loadSkills();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            showView(view);
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Refresh data when switching views
        if (viewName === 'dashboard') loadDashboard();
        if (viewName === 'students') loadStudents();
        if (viewName === 'skills') loadSkills();
        if (viewName === 'analytics') loadAnalytics();
    }
}

// Dashboard
async function loadDashboard() {
    try {
        await Promise.all([loadStudents(), loadSkills()]);
        updateDashboardStats();
        displayRecentStudents();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateDashboardStats() {
    document.getElementById('total-students').textContent = students.length;
    document.getElementById('total-skills').textContent = skills.length;
    
    // Calculate average score
    let totalScore = 0;
    let scoreCount = 0;
    students.forEach(student => {
        if (student.skills && student.skills.length > 0) {
            student.skills.forEach(skill => {
                totalScore += skill.assessment_score;
                scoreCount++;
            });
        }
    });
    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    document.getElementById('avg-score').textContent = `${avgScore}%`;
    
    // Calculate top performers (students with avg score > 80)
    const topPerformers = students.filter(student => {
        if (!student.skills || student.skills.length === 0) return false;
        const studentAvg = student.skills.reduce((sum, skill) => sum + skill.assessment_score, 0) / student.skills.length;
        return studentAvg > 80;
    });
    document.getElementById('top-performers').textContent = topPerformers.length;
}

function displayRecentStudents() {
    const container = document.getElementById('recent-students-list');
    const recentStudents = students.slice(0, 5);
    
    if (recentStudents.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students yet</p></div>';
        return;
    }
    
    container.innerHTML = recentStudents.map(student => `
        <div class="student-item-compact">
            <div class="student-avatar">${getInitials(student.name)}</div>
            <div class="student-info">
                <h4>${student.name}</h4>
                <p>${student.email}</p>
            </div>
        </div>
    `).join('');
}

// Students
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        students = await response.json();
        displayStudents();
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Failed to load students', 'error');
    }
}

function displayStudents() {
    const container = document.getElementById('students-grid');
    
    if (students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="24" r="12" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 56C12 44.954 20.954 36 32 36C43.046 36 52 44.954 52 56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>No students yet</h3>
                <p>Get started by adding your first student</p>
                <button class="btn-primary" onclick="openStudentModal()">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Student
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-card-header">
                <div class="student-card-avatar">${getInitials(student.name)}</div>
                <div class="student-card-info">
                    <h3>${student.name}</h3>
                    <p>${student.email}</p>
                </div>
            </div>
            
            <div class="student-card-details">
                <div class="detail-item">
                    <span class="detail-label">Age</span>
                    <span class="detail-value">${student.age} years</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Skills</span>
                    <span class="detail-value">${student.skills ? student.skills.length : 0}</span>
                </div>
                ${student.skills && student.skills.length > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">Avg. Score</span>
                    <span class="detail-value">${calculateAvgScore(student)}%</span>
                </div>
                ` : ''}
            </div>
            
            ${student.skills && student.skills.length > 0 ? `
            <div class="student-skills">
                <h4>Skills</h4>
                <div class="skill-tags">
                    ${student.skills.map(skill => `
                        <div class="skill-tag">
                            <span>${skill.skill_name}</span>
                            <div class="proficiency-badge">${skill.proficiency}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="student-card-actions">
                <button class="btn-icon" onclick="openAssignSkillModal(${student.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Skill
                </button>
                <button class="btn-icon" onclick="editStudent(${student.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Edit
                </button>
                <button class="btn-icon delete" onclick="deleteStudent(${student.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function calculateAvgScore(student) {
    if (!student.skills || student.skills.length === 0) return 0;
    const total = student.skills.reduce((sum, skill) => sum + skill.assessment_score, 0);
    return Math.round(total / student.skills.length);
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Student Modal
function openStudentModal(studentId = null) {
    const modal = document.getElementById('student-modal');
    const form = document.getElementById('student-form');
    const title = document.getElementById('student-modal-title');
    
    form.reset();
    
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            title.textContent = 'Edit Student';
            document.getElementById('student-id').value = student.id;
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-email').value = student.email;
            document.getElementById('student-age').value = student.age;
        }
    } else {
        title.textContent = 'Add New Student';
        document.getElementById('student-id').value = '';
    }
    
    modal.classList.add('active');
}

function closeStudentModal() {
    document.getElementById('student-modal').classList.remove('active');
}

function editStudent(studentId) {
    openStudentModal(studentId);
}

async function handleStudentSubmit(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    const age = parseInt(document.getElementById('student-age').value);
    
    try {
        let response;
        if (studentId) {
            // Update existing student
            response = await fetch(`${API_BASE_URL}/students/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, age })
            });
        } else {
            // Create new student
            response = await fetch(`${API_BASE_URL}/students/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, age })
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to save student');
        }
        
        closeStudentModal();
        await loadStudents();
        showNotification(studentId ? 'Student updated successfully' : 'Student added successfully', 'success');
    } catch (error) {
        console.error('Error saving student:', error);
        showNotification(error.message, 'error');
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/students/students/${studentId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete student');
        
        await loadStudents();
        showNotification('Student deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting student:', error);
        showNotification('Failed to delete student', 'error');
    }
}

// Skills
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        skills = await response.json();
        displaySkills();
        updateSkillSelect();
    } catch (error) {
        console.error('Error loading skills:', error);
        showNotification('Failed to load skills', 'error');
    }
}

function displaySkills() {
    const container = document.getElementById('skills-grid');
    
    if (skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M32 8L40 24L56 28L44 40L48 56L32 48L16 56L20 40L8 28L24 24L32 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                <h3>No skills yet</h3>
                <p>Add skills to track student proficiency</p>
                <button class="btn-primary" onclick="openSkillModal()">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Skill
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = skills.map(skill => {
        const studentCount = students.filter(s => 
            s.skills && s.skills.some(sk => sk.skill_id === skill.id)
        ).length;
        
        return `
            <div class="skill-card">
                <div class="skill-card-header">
                    <div class="skill-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18.5L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="skill-card-info">
                        <h3>${skill.name}</h3>
                    </div>
                </div>
                
                <div class="skill-card-stats">
                    <div class="skill-stat">
                        <div class="skill-stat-value">${studentCount}</div>
                        <div class="skill-stat-label">Students</div>
                    </div>
                </div>
                
                <div class="skill-card-actions">
                    <button class="btn-icon" onclick="editSkill(${skill.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Edit
                    </button>
                    <button class="btn-icon delete" onclick="deleteSkill(${skill.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Skill Modal
function openSkillModal(skillId = null) {
    const modal = document.getElementById('skill-modal');
    const form = document.getElementById('skill-form');
    const title = document.getElementById('skill-modal-title');
    
    form.reset();
    
    if (skillId) {
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
            title.textContent = 'Edit Skill';
            document.getElementById('skill-id').value = skill.id;
            document.getElementById('skill-name').value = skill.name;
        }
    } else {
        title.textContent = 'Add New Skill';
        document.getElementById('skill-id').value = '';
    }
    
    modal.classList.add('active');
}

function closeSkillModal() {
    document.getElementById('skill-modal').classList.remove('active');
}

function editSkill(skillId) {
    openSkillModal(skillId);
}

async function handleSkillSubmit(event) {
    event.preventDefault();
    
    const skillId = document.getElementById('skill-id').value;
    const name = document.getElementById('skill-name').value;
    
    try {
        let response;
        if (skillId) {
            // Update existing skill
            response = await fetch(`${API_BASE_URL}/skills/skills/${skillId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
        } else {
            // Create new skill
            response = await fetch(`${API_BASE_URL}/skills/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to save skill');
        }
        
        closeSkillModal();
        await loadSkills();
        showNotification(skillId ? 'Skill updated successfully' : 'Skill added successfully', 'success');
    } catch (error) {
        console.error('Error saving skill:', error);
        showNotification(error.message, 'error');
    }
}

async function deleteSkill(skillId) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/skills/skills/${skillId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete skill');
        
        await loadSkills();
        showNotification('Skill deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting skill:', error);
        showNotification('Failed to delete skill', 'error');
    }
}

// Assign Skill Modal
function openAssignSkillModal(studentId) {
    const modal = document.getElementById('assign-skill-modal');
    document.getElementById('assign-student-id').value = studentId;
    document.getElementById('assign-skill-form').reset();
    modal.classList.add('active');
}

function closeAssignSkillModal() {
    document.getElementById('assign-skill-modal').classList.remove('active');
}

function updateSkillSelect() {
    const select = document.getElementById('assign-skill-select');
    select.innerHTML = '<option value="">Select a skill</option>' + 
        skills.map(skill => `<option value="${skill.id}">${skill.name}</option>`).join('');
}

async function handleAssignSkillSubmit(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('assign-student-id').value;
    const skillId = document.getElementById('assign-skill-select').value;
    const proficiency = parseInt(document.getElementById('skill-proficiency').value);
    const assessmentScore = parseInt(document.getElementById('assessment-score').value);
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/students/students/${studentId}/skills?skill_id=${skillId}&proficiency=${proficiency}&assessment_score=${assessmentScore}`,
            { method: 'POST' }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to assign skill');
        }
        
        closeAssignSkillModal();
        await loadStudents();
        showNotification('Skill assigned successfully', 'success');
    } catch (error) {
        console.error('Error assigning skill:', error);
        showNotification(error.message, 'error');
    }
}

// Analytics
async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/analytics/top-students`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const topStudents = await response.json();
        displayTopStudents(topStudents);
        displaySkillDistribution();
        displayPerformanceOverview();
    } catch (error) {
        console.error('Error loading analytics:', error);
        showNotification('Failed to load analytics', 'error');
    }
}

function displayTopStudents(topStudents) {
    const container = document.getElementById('top-students-list');
    
    if (topStudents.length === 0) {
        container.innerHTML = '<p class="empty-state">No student data available</p>';
        return;
    }
    
    container.innerHTML = topStudents.slice(0, 10).map((student, index) => `
        <div class="top-student-item">
            <div class="rank-badge">${index + 1}</div>
            <div class="top-student-info">
                <h4>${student.name}</h4>
                <p>${student.email}</p>
            </div>
            <div class="score-badge">${Math.round(student.average_score)}%</div>
        </div>
    `).join('');
}

function displaySkillDistribution() {
    const container = document.getElementById('skill-distribution');
    
    const skillCounts = {};
    students.forEach(student => {
        if (student.skills) {
            student.skills.forEach(skill => {
                skillCounts[skill.skill_name] = (skillCounts[skill.skill_name] || 0) + 1;
            });
        }
    });
    
    const maxCount = Math.max(...Object.values(skillCounts), 1);
    
    container.innerHTML = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([skillName, count]) => `
            <div class="skill-distribution-item">
                <div class="skill-name">${skillName}</div>
                <div class="skill-bar">
                    <div class="skill-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
                </div>
                <div class="skill-count">${count}</div>
            </div>
        `).join('');
}

function displayPerformanceOverview() {
    const container = document.getElementById('performance-overview');
    
    const ranges = {
        'Excellent (90-100)': 0,
        'Good (80-89)': 0,
        'Average (70-79)': 0,
        'Below Average (60-69)': 0,
        'Poor (<60)': 0
    };
    
    students.forEach(student => {
        if (student.skills && student.skills.length > 0) {
            const avg = calculateAvgScore(student);
            if (avg >= 90) ranges['Excellent (90-100)']++;
            else if (avg >= 80) ranges['Good (80-89)']++;
            else if (avg >= 70) ranges['Average (70-79)']++;
            else if (avg >= 60) ranges['Below Average (60-69)']++;
            else ranges['Poor (<60)']++;
        }
    });
    
    const maxCount = Math.max(...Object.values(ranges), 1);
    
    container.innerHTML = Object.entries(ranges).map(([range, count]) => `
        <div class="skill-distribution-item">
            <div class="skill-name">${range}</div>
            <div class="skill-bar">
                <div class="skill-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
            </div>
            <div class="skill-count">${count}</div>
        </div>
    `).join('');
}

// Notifications
function showNotification(message, type = 'info') {
    // Simple console notification for now
    // You can enhance this with a toast notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Optional: Show browser alert for errors
    if (type === 'error') {
        alert(message);
    }
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});
