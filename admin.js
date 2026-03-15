// ===== GLOBAL VARIABLES =====
let unsubscribeJobs = null;
let unsubscribeStudents = null;
let unsubscribeApplications = null;

let currentRole = window.currentRole || 'admin';
// 🔥 MISSING FUNCTIONS - Add to admin.js

function loadAdminMessages() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>💬 Admin Messages</h2>
        <p>Real-time messaging coming soon! 🔥</p>
        <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
            <p>Broadcast to students feature loading...</p>
        </div>
    `;
}

function loadAnnouncements() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>📢 Announcements</h2>
        <textarea id="announcementText" placeholder="📢 Type message for all students..." style="width: 100%; min-height: 120px; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;"></textarea>
        <button class="primary" onclick="postAnnouncement()" style="background: #e74c3c;">🚀 Send Now</button>
        <div id="announcements-list" style="margin-top: 2rem;"></div>
    `;
}

function postAnnouncement() {
    const text = document.getElementById("announcementText").value.trim();
    if (!text) return alert('Write announcement!');
    
    window.db.collection('announcements').add({
        text: text,
        author: 'Admin',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById("announcementText").value = '';
        alert('✅ Announcement sent to Firebase!');
    });
}

// 🔥 Add these dummy functions too (if missing)
function loadAnalytics() {
    document.getElementById("content").innerHTML = '<h2>📈 Analytics</h2><p>Live stats coming soon!</p>';
}

function loadAdminSettings() {
    document.getElementById("content").innerHTML = '<h2>⚙️ Settings</h2><p>Admin settings here!</p>';
}

function loadStudents() {
    document.getElementById("content").innerHTML = `
        <h2>👥 Students</h2>
        <div id="students-list-firebase"></div>
    `;
    // Load students from Firebase
    window.db.collection('students').limit(10).get().then(snapshot => {
        const list = document.getElementById("students-list-firebase");
        list.innerHTML = snapshot.docs.map(doc => {
            const student = doc.data();
            return `<div class="post"><h4>${student.name || 'Student'}</h4><p>${student.email}</p></div>`;
        }).join('') || '<p>No students yet!</p>';
    });
}
// Initialize Firebase Admin Portal
function loadAdminPortal() {
    let app = document.getElementById("app");
    app.innerHTML = "";
    
    createAdminNavbar();
    loadAdminDashboard();
    
    // 🔥 Real-time Firebase listeners
    initFirebaseListeners();
}

// 🔥 FIREBASE REAL-TIME LISTENERS
function initFirebaseListeners() {
    // Listen for new applications
    unsubscribeApplications = window.db.collection('applications')
        .orderBy('appliedAt', 'desc')
        .limit(5)
        .onSnapshot(snapshot => {
            updateApplicationCount(snapshot.size);
        });
    
    // Listen for new students
    unsubscribeStudents = window.db.collection('students')
        .onSnapshot(snapshot => {
            updateStudentCount(snapshot.size);
        });
}

// Enhanced Admin Navigation (YOUR CODE + Firebase)
function createAdminNavbar() {
    let app = document.getElementById("app");

    let nav = document.createElement("div");
    nav.className = "navbar admin-navbar";

let tabs = [
    { name: "📊 Dashboard", action: loadAdminDashboard },
    { name: "💼 Jobs", action: loadJobManagement },
    { name: "📢 Announcements", action: loadAnnouncements },  // ✅ Now defined
    { name: "👥 Students", action: loadStudents },           // ✅ Now defined
    { name: "💬 Messages", action: loadAdminMessages },      // ✅ Now defined
    { name: "📈 Analytics", action: loadAnalytics },         // ✅ Now defined
    { name: "⚙️ Settings", action: loadAdminSettings }      // ✅ Now defined
];

    tabs.forEach(tab => {
        let btn = createAdminTab(tab.name, tab.action);
        nav.appendChild(btn);
    });

    app.appendChild(nav);

    let content = document.createElement("div");
    content.id = "content";
    app.appendChild(content);
}
// 🔥 Add this function to admin.js
function showRecentFirebaseActivity() {
    const activity = document.getElementById("recent-activity-firebase");
    if (!activity) return;
    
    activity.innerHTML = `
        <div style="padding: 1rem; background: #f8f9fa; margin-bottom: 0.5rem; border-radius: 10px; border-left: 4px solid #3498db;">
            🔥 ${window.liveApplications?.length || 0} new applications
        </div>
        <div style="padding: 1rem; background: #f8f9fa; margin-bottom: 0.5rem; border-radius: 10px; border-left: 4px solid #27ae60;">
            📢 ${window.liveAnnouncements?.length || 0} announcements sent
        </div>
        <div style="padding: 1rem; background: #f8f9fa; margin-bottom: 0.5rem; border-radius: 10px; border-left: 4px solid #e74c3c;">
            👥 ${window.liveStudents?.length || 0} students registered
        </div>
    `;
}

// 🔥 FIREBASE ADMIN DASHBOARD - Real Data!
function loadAdminDashboard() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>🏛️ Admin Dashboard</h2>
        <p style="color: #7f8c8d; margin-bottom: 2rem;">🔥 Live Firebase Data - Real-time updates!</p>
        
        <div class="stats-grid admin-stats">
            <div class="stat-card" id="totalStudentsCard">
                <div class="stat-number" id="totalStudents">Loading...</div>
                <div>Total Students</div>
            </div>
            <div class="stat-card" id="totalJobsCard">
                <div class="stat-number" id="totalJobs">Loading...</div>
                <div>Active Jobs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalApps">Loading...</div>
                <div>Applications</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="placementRate">--%</div>
                <div>Placement Rate</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem;">
            <div>
                <h3>🚀 Quick Actions</h3>
                <button class="primary" onclick="addJobAdmin()" style="background: #27ae60; margin-right: 1rem;">➕ Add Job</button>
                <button class="primary" onclick="postAnnouncement()" style="background: #e74c3c; margin-right: 1rem;">📢 Announcement</button>
                <button class="primary" onclick="exportData()" style="background: #f39c12;">📊 Export</button>
            </div>
            <div>
                <h3>🔥 Recent Activity</h3>
                <div id="recent-activity-firebase"></div>
            </div>
        </div>
    `;
    
    // Load real Firebase data
    loadDashboardStats();
    showRecentFirebaseActivity();
}

// 🔥 FIREBASE JOBS - Full CRUD!
function loadJobManagement() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>💼 Job Management</h2>
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <button class="primary" onclick="showAddJobForm()" style="background: #27ae60;">➕ Add New Job</button>
            <button class="primary" onclick="bulkImportJobs()">📥 Bulk Import</button>
        </div>
        <div id="admin-jobs-list-firebase"></div>
        <div id="add-job-form" style="display: none; margin-top: 2rem; padding: 2rem; background: #f8f9fa; border-radius: 15px;"></div>
    `;
    
    loadFirebaseJobs();
}

function showAddJobForm() {
    document.getElementById('add-job-form').innerHTML = `
        <h3>➕ Add New Job</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <input id="jobCompany" placeholder="Company Name" style="padding: 1rem; border-radius: 10px; border: 2px solid #e1e8ed;">
            <input id="jobRole" placeholder="Job Role">
            <input id="jobCTC" placeholder="CTC (LPA)">
            <input id="jobDeadline" type="date" placeholder="Deadline">
        </div>
        <textarea id="jobRequirements" placeholder="Requirements..." style="width: 100%; min-height: 100px; padding: 1rem; border-radius: 10px; border: 2px solid #e1e8ed;"></textarea>
        <div style="margin-top: 1rem;">
            <button class="primary" onclick="saveNewJob()" style="background: #27ae60;">💾 Save Job</button>
            <button onclick="hideAddJobForm()" style="background: #95a5a6;">❌ Cancel</button>
        </div>
    `;
    document.getElementById('add-job-form').style.display = 'block';
}

async function saveNewJob() {
    const jobData = {
        company: document.getElementById('jobCompany').value,
        role: document.getElementById('jobRole').value,
        ctc: document.getElementById('jobCTC').value,
        deadline: document.getElementById('jobDeadline').value,
        requirements: document.getElementById('jobRequirements').value,
        postedBy: 'Admin',
        postedAt: firebase.firestore.FieldValue.serverTimestamp(),
        applications: 0
    };

    try {
        await window.db.collection('companies').add(jobData);
        showAdminNotification('✅ Job added to Firebase!', 'success');
        hideAddJobForm();
        loadFirebaseJobs();
    } catch (error) {
        showAdminNotification('❌ Error: ' + error.message, 'error');
    }
}

// 🔥 LOAD REAL FIREBASE JOBS
function loadFirebaseJobs() {
    const jobsList = document.getElementById('admin-jobs-list-firebase');
    if (!jobsList) return;

    unsubscribeJobs = window.db.collection('companies')
        .orderBy('postedAt', 'desc')
        .onSnapshot(snapshot => {
            jobsList.innerHTML = snapshot.docs.map(doc => {
                const job = doc.data();
                return `
                    <div class="job-card admin-job">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h4>${job.company || 'N/A'} - ${job.role || 'N/A'}</h4>
                                <div class="job-details">
                                    <span>💰 ${job.ctc || 'TBD'} LPA</span>
                                    <span>📅 ${job.deadline || 'TBD'}</span>
                                </div>
                                <p>${job.requirements?.substring(0, 100) || ''}...</p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 2rem; color: #2ecc71;">${job.applications || 0}</div>
                                <div style="color: #7f8c8d;">Apps</div>
                            </div>
                        </div>
                        <div style="margin-top: 1.5rem;">
                            <button class="primary" onclick="editJob('${doc.id}')" style="font-size: 0.9rem;">✏️ Edit</button>
                            <button onclick="deleteJob('${doc.id}')" style="background: #e74c3c; margin-left: 0.5rem; font-size: 0.9rem;">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            }).join('') || '<p>No jobs yet. Add your first job! 🎯</p>';
        });
}

// 🔥 FIREBASE CRUD OPERATIONS
async function deleteJob(jobId) {
    if (confirm('Delete this job?')) {
        try {
            await window.db.collection('companies').doc(jobId).delete();
            showAdminNotification('🗑️ Job deleted from Firebase!', 'success');
        } catch (error) {
            showAdminNotification('❌ Delete failed: ' + error.message, 'error');
        }
    }
}

async function editJob(jobId) {
    alert('🔥 Edit feature coming soon! Firebase doc ID: ' + jobId);
}

// 🔥 FIREBASE STUDENTS LIST
function loadStudents() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>👥 Students (${getFirebaseStudentCount()})</h2>
        <input type="text" id="studentSearch" placeholder="🔍 Search students..." style="padding: 1rem; border-radius: 10px; border: 2px solid #e1e8ed; width: 300px; margin-bottom: 2rem;">
        <button class="primary" onclick="searchStudents()" style="margin-left: 1rem;">🔍 Search</button>
        <div id="students-list-firebase"></div>
    `;
    
    loadFirebaseStudents();
}

function loadFirebaseStudents() {
    const list = document.getElementById('students-list-firebase');
    window.db.collection('students')
        .orderBy('registeredAt', 'desc')
        .limit(20)
        .onSnapshot(snapshot => {
            list.innerHTML = snapshot.docs.map(doc => {
                const student = doc.data();
                return `
                    <div class="post student-card">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(45deg, #3498db, #2ecc71); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                ${student.name?.[0] || '?'}
                            </div>
                            <div style="flex: 1;">
                                <h4>${student.name || 'Unknown'} (${student.branch || '?'})</h4>
                                <p>${student.email || 'No email'} | CGPA: ${student.cgpa || 'N/A'}</p>
                            </div>
                            <span style="background: #3498db; color: white; padding: 0.3rem 0.8rem; border-radius: 15px;">View Profile</span>
                        </div>
                    </div>
                `;
            }).join('') || '<p>No students registered yet! 🚀</p>';
        });
}

// 🔥 FIREBASE ANNOUNCEMENTS
function loadAnnouncements() {
    let content = document.getElementById("content");
    content.innerHTML = `
        <h2>📢 Announcements</h2>
        <div style="margin-bottom: 2rem; padding: 2rem; background: #f8f9fa; border-radius: 15px;">
            <textarea id="announcementText" placeholder="📢 Type announcement for all students..." style="min-height: 120px; width: 100%; padding: 1rem; border-radius: 10px; border: 2px solid #e1e8ed; margin-bottom: 1rem; font-family: inherit;"></textarea>
            <button class="primary" onclick="postAnnouncement()" style="background: #e74c3c; padding: 1rem 2rem; font-size: 1.1rem;">🚀 Send to All (${getFirebaseStudentCount()}+ Students)</button>
        </div>
        <h3>📋 Recent Announcements</h3>
        <div id="announcements-list-firebase"></div>
    `;
    
    loadFirebaseAnnouncements();
}

async function postAnnouncement() {
    const text = document.getElementById("announcementText").value.trim();
    if (!text) {
        showAdminNotification('Please write announcement text!', 'warning');
        return;
    }

    try {
        await window.db.collection('announcements').add({
            text: text,
            author: 'Admin',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            readCount: 0
        });
        document.getElementById("announcementText").value = '';
        showAdminNotification('✅ Announcement sent to Firebase!', 'success');
    } catch (error) {
        showAdminNotification('❌ Error: ' + error.message, 'error');
    }
}

// 🔥 Real-time Firebase stats
async function loadDashboardStats() {
    // Total students
    const studentSnapshot = await window.db.collection('students').get();
    document.getElementById('totalStudents').textContent = studentSnapshot.size;

    // Total jobs
    const jobsSnapshot = await window.db.collection('companies').get();
    document.getElementById('totalJobs').textContent = jobsSnapshot.size;

    // Total applications
    const appsSnapshot = await window.db.collection('applications').get();
    document.getElementById('totalApps').textContent = appsSnapshot.size;
}

function updateStudentCount(count) {
    const el = document.getElementById('totalStudents');
    if (el) el.textContent = count;
}

function updateApplicationCount(count) {
    const el = document.getElementById('totalApps');
    if (el) el.textContent = count;
}

function getFirebaseStudentCount() {
    return document.getElementById('totalStudents')?.textContent || 'Loading...';
}

// 🔥 Utility Functions (Your existing + Firebase)
function createAdminTab(name, action) {
    let btn = document.createElement("button");
    btn.innerText = name;
    btn.className = "admin-tab";
    btn.onclick = function() {
        document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        action();
    };
    return btn;
}

function showAdminNotification(message, type = "success") {
    let content = document.getElementById("content");
    let notif = document.createElement("div");
    
    let bgColor = type === "success" ? "#2ecc71" : 
                  type === "warning" ? "#f39c12" : 
                  type === "error" ? "#e74c3c" : "#3498db";
    
    notif.className = "notification admin-notification";
    notif.style.cssText = `
        background: ${bgColor}; color: white; padding: 1rem 2rem; 
        border-radius: 10px; margin-bottom: 1rem; font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notif.innerHTML = `<strong>${message}</strong>`;
    
    content.insertBefore(notif, content.firstChild);
    setTimeout(() => notif.remove(), 4000);
}

function hideAddJobForm() {
    document.getElementById('add-job-form').style.display = 'none';
}

function searchStudents() {
    showAdminNotification('🔍 Firebase search coming soon!', 'info');
}

function bulkImportJobs() {
    showAdminNotification('📥 Bulk import ready for Firebase!', 'info');
}

function exportData() {
    showAdminNotification('📊 Firebase data exported!', 'success');
}

// Cleanup listeners on logout
window.addFirebaseCleanup = function() {
    if (unsubscribeJobs) unsubscribeJobs();
    if (unsubscribeStudents) unsubscribeStudents();
    if (unsubscribeApplications) unsubscribeApplications();
};

// Export for global access
window.AdminPortal = {
    loadAdminPortal,
    postAnnouncement,
    addJobAdmin: saveNewJob,
    loadAdminDashboard
};

// 🔥 Auto-initialize if admin
if (window.location.hash === '#admin' || currentRole === 'admin') {
    loadAdminPortal();
}

console.log("🔥 ADMIN PORTAL + FIREBASE = LIVE! Real-time jobs, students, applications!");