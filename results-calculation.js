
function calculatePerformance() {
    const data = JSON.parse(localStorage.getItem('studentData')) || {};
    
    // Get all input data with fallback values
    const attendance = parseFloat(data.attendance) || parseFloat(localStorage.getItem('attendance')) || 0;
    const testScores = data.testScores || JSON.parse(localStorage.getItem('testScores') || '[]');
    const assignments = data.assignments || JSON.parse(localStorage.getItem('assignments') || '[]');
    const events = data.events || localStorage.getItem('events') || '';
    const questionScore = parseInt(data.questionScore) || parseInt(localStorage.getItem('problemSolvingScore')) || 0;
    
    // Calculate averages
    const avgTestScore = calculateAverage(testScores);
    const avgAssignmentScore = calculateAverage(assignments);
    
    // Weight distribution
    const weights = {
        attendance: 0.20,      // 20%
        tests: 0.30,           // 30%
        assignments: 0.25,     // 25%
        events: 0.10,          // 10%
        problemSolving: 0.15   // 15%
    };
    
    // Calculate weighted scores
    const attendanceScore = attendance * weights.attendance;
    const testScore = avgTestScore * weights.tests;
    const assignmentScore = avgAssignmentScore * weights.assignments;
    const eventScore = (events.length > 0 ? 85 : 70) * weights.events;
    const psScore = (questionScore / 10) * 100 * weights.problemSolving;
    
    // Total performance score
    const totalScore = attendanceScore + testScore + assignmentScore + eventScore + psScore;
    
    return {
        totalScore: totalScore.toFixed(2),
        breakdown: {
            attendance: attendanceScore.toFixed(2),
            tests: testScore.toFixed(2),
            assignments: assignmentScore.toFixed(2),
            events: eventScore.toFixed(2),
            problemSolving: psScore.toFixed(2)
        },
        rawData: {
            attendance,
            avgTestScore: avgTestScore.toFixed(2),
            avgAssignmentScore: avgAssignmentScore.toFixed(2),
            eventsCount: events.length,
            questionScore
        }
    };
}

// Calculate average from scores array
function calculateAverage(scores) {
    if (!scores || scores.length === 0) return 0;
    
    let totalObtained = 0;
    let totalMaximum = 0;
    
    scores.forEach(score => {
        totalObtained += parseFloat(score.obtained) || 0;
        totalMaximum += parseFloat(score.maximum) || 0;
    });
    
    return totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
}

// Analyze strengths and weaknesses
function analyzePerformance(performanceData) {
    const { breakdown, rawData } = performanceData;
    const strengths = [];
    const weaknesses = [];
    const tips = [];
    
    // Analyze attendance
    if (rawData.attendance >= 90) {
        strengths.push({
            title: "Excellent Attendance",
            description: `Outstanding ${rawData.attendance}% attendance shows strong commitment and discipline.`,
            icon: "📅"
        });
    } else if (rawData.attendance >= 75) {
        strengths.push({
            title: "Good Attendance",
            description: `Your ${rawData.attendance}% attendance is above average.`,
            icon: "📅"
        });
        tips.push({
            title: "Improve Attendance",
            description: "Try to maintain 90%+ attendance for better academic outcomes. Set reminders and plan your schedule in advance.",
            priority: "medium"
        });
    } else {
        weaknesses.push({
            title: "Low Attendance",
            description: `${rawData.attendance}% attendance may impact your learning and grades.`,
            icon: "⚠️"
        });
        tips.push({
            title: "Prioritize Class Attendance",
            description: "Make attending classes a top priority. Missing classes creates learning gaps. Set up a study buddy system for accountability.",
            priority: "high"
        });
    }
    
    // Analyze test performance
    if (rawData.avgTestScore >= 85) {
        strengths.push({
            title: "Strong Test Performance",
            description: `Excellent ${rawData.avgTestScore}% average shows great understanding of concepts.`,
            icon: "📝"
        });
    } else if (rawData.avgTestScore >= 70) {
        strengths.push({
            title: "Moderate Test Performance",
            description: `${rawData.avgTestScore}% average indicates decent understanding.`,
            icon: "📝"
        });
        tips.push({
            title: "Enhance Test Preparation",
            description: "Create a study schedule, practice past papers, and form study groups. Focus on understanding concepts rather than memorization.",
            priority: "medium"
        });
    } else {
        weaknesses.push({
            title: "Needs Improvement in Tests",
            description: `${rawData.avgTestScore}% average suggests need for better preparation.`,
            icon: "📉"
        });
        tips.push({
            title: "Intensive Test Preparation",
            description: "Dedicate 2-3 hours daily for revision. Break topics into smaller chunks. Take practice tests regularly. Seek help from teachers for difficult topics.",
            priority: "high"
        });
    }
    
    // Analyze assignment performance
    if (rawData.avgAssignmentScore >= 85) {
        strengths.push({
            title: "Excellent Assignment Work",
            description: `${rawData.avgAssignmentScore}% average demonstrates thoroughness and dedication.`,
            icon: "✍️"
        });
    } else if (rawData.avgAssignmentScore >= 70) {
        tips.push({
            title: "Improve Assignment Quality",
            description: "Start assignments early, review guidelines carefully, and proofread before submission. Aim for depth over speed.",
            priority: "medium"
        });
    } else {
        weaknesses.push({
            title: "Assignment Performance",
            description: `${rawData.avgAssignmentScore}% suggests need for better time management.`,
            icon: "⏰"
        });
        tips.push({
            title: "Better Assignment Management",
            description: "Create an assignments calendar. Break large assignments into smaller tasks. Set deadlines for each part. Don't procrastinate.",
            priority: "high"
        });
    }
    
    // Analyze event participation
    if (rawData.eventsCount >= 3) {
        strengths.push({
            title: "Active Participation",
            description: `Attended ${rawData.eventsCount} events, showing great engagement beyond academics.`,
            icon: "🎯"
        });
    } else if (rawData.eventsCount === 0) {
        weaknesses.push({
            title: "Limited Event Participation",
            description: "No recorded event participation may limit networking and soft skills development.",
            icon: "👥"
        });
        tips.push({
            title: "Increase Event Participation",
            description: "Participate in at least 2-3 events per semester. This builds soft skills, networking, and makes learning more holistic.",
            priority: "medium"
        });
    }
    
    // Analyze problem-solving skills
    if (rawData.questionScore >= 8) {
        strengths.push({
            title: "Strong Analytical Skills",
            description: `Scored ${rawData.questionScore}/10 on problem-solving, showing excellent logical thinking.`,
            icon: "🧠"
        });
    } else if (rawData.questionScore >= 6) {
        tips.push({
            title: "Sharpen Problem-Solving Skills",
            description: "Practice logical puzzles daily. Try platforms like LeetCode, HackerRank. Focus on understanding problem patterns.",
            priority: "medium"
        });
    } else {
        weaknesses.push({
            title: "Needs Analytical Improvement",
            description: `${rawData.questionScore}/10 suggests need for better logical thinking.`,
            icon: "🤔"
        });
        tips.push({
            title: "Develop Analytical Thinking",
            description: "Dedicate 30 minutes daily to logical puzzles. Learn problem-solving frameworks. Practice breaking complex problems into smaller parts.",
            priority: "high"
        });
    }
    
    // Add general tips based on overall performance
    const totalScore = parseFloat(performanceData.totalScore);
    if (totalScore >= 85) {
        tips.push({
            title: "Maintain Excellence",
            description: "You're performing exceptionally well! Keep up the good work and help peers who may be struggling.",
            priority: "low"
        });
    } else if (totalScore >= 70) {
        tips.push({
            title: "Push for Excellence",
            description: "You're doing well. With focused effort in weak areas, you can achieve excellent results. Set specific improvement goals.",
            priority: "medium"
        });
    } else {
        tips.push({
            title: "Comprehensive Improvement Plan",
            description: "Create a detailed study plan. Meet with academic advisor. Utilize tutoring resources. Stay consistent and track progress weekly.",
            priority: "high"
        });
    }
async function generatePDFReport() {
    const overallScore = document.getElementById('overallScore')?.textContent || '--';
    const attendanceScore = document.getElementById('attendanceScore')?.textContent || '--';
    const testScore = document.getElementById('testScore')?.textContent || '--';
    const quizScoreDisplay = document.getElementById('quizScoreDisplay')?.textContent || '--';
    
    // Try to get student data from localStorage
    const studentName = (JSON.parse(localStorage.getItem('studentData')) || {}).studentName || 'Student';
    const studentId = (JSON.parse(localStorage.getItem('studentData')) || {}).studentId || 'N/A';
    const department = (JSON.parse(localStorage.getItem('studentData')) || {}).department || 'Not specified';
    const semester = (JSON.parse(localStorage.getItem('studentData')) || {}).semester || 'Current';
    
    // Try to get detailed scores from localStorage
    const performanceData = JSON.parse(localStorage.getItem('studentPerformanceData')) || {};
    const testScores = performanceData.testScores || [];
    const assignments = performanceData.assignments || [];
    
    const reportText = `Student Performance Report
========================
Report Date: ${new Date().toLocaleDateString()}

Student Information
------------------
Name: ${studentName}
ID: ${studentId}
Department: ${department}
Semester: ${semester}

Overall Performance
------------------
Score: ${overallScore}

Attendance
----------
${attendanceScore}

Test Scores
-----------
${testScore}

Problem Solving Quiz
--------------------
${quizScoreDisplay}

Detailed Test Scores
--------------------
${testScores.length > 0 ? testScores.map((test, i) => 
    `${i + 1}. ${test.subject || 'General'}: ${test.obtainedMarks || test.score || '--'}/${test.maxMarks || test.maxScore || '--'} (${test.date || new Date().toLocaleDateString()})`
).join('\n') : 'No test scores recorded'}

Assignments
-----------
${assignments.length > 0 ? assignments.map((a, i) => 
    `${i + 1}. ${a.title || a.name || 'Untitled'} (${a.subject || 'General'}): ${a.obtained || a.obtainedMarks || '--'}/${a.maximum || a.maxMarks || '--'} (${a.date || new Date().toLocaleDateString()})`
).join('\n') : 'No assignments recorded'}

Summary
-------
This report summarizes your attendance, test scores, assignments, problem-solving quiz, and overall performance.
For detailed breakdown and visualizations, please refer to the dashboard.

Generated by EduVista`;

    // Create and download text file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Performance_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Generate performance grade
function getPerformanceGrade(score) {
    if (score >= 90) return { grade: 'A+', description: 'Outstanding', color: '#4CAF50' };
    if (score >= 85) return { grade: 'A', description: 'Excellent', color: '#8BC34A' };
    if (score >= 80) return { grade: 'B+', description: 'Very Good', color: '#CDDC39' };
    if (score >= 75) return { grade: 'B', description: 'Good', color: '#FFC107' };
    if (score >= 70) return { grade: 'C+', description: 'Above Average', color: '#FF9800' };
    if (score >= 65) return { grade: 'C', description: 'Average', color: '#FF9800' };
    if (score >= 60) return { grade: 'D', description: 'Below Average', color: '#FF5722' };
    return { grade: 'F', description: 'Needs Improvement', color: '#F44336' };
}

// Display results on page
function displayResults() {
    const performanceData = calculatePerformance();
    const analysis = analyzePerformance(performanceData);
    const grade = getPerformanceGrade(parseFloat(performanceData.totalScore));
    
    // Update overall score
    const scoreElement = document.getElementById('overallScore');
    if (scoreElement) {
        scoreElement.textContent = performanceData.totalScore + '%';
        scoreElement.style.color = grade.color;
    }
    
    const gradeElement = document.getElementById('performanceLevel');
    if (gradeElement) {
        gradeElement.textContent = `${grade.grade} - ${grade.description}`;
    }
    
    // Display strengths
    const prosListElement = document.getElementById('prosList');
    if (prosListElement && analysis.strengths.length > 0) {
        prosListElement.innerHTML = analysis.strengths.map(strength => `
            <div class="list-item">
                <h4><i class="fas fa-check-circle"></i> ${strength.title}</h4>
                <p>${strength.description}</p>
            </div>
        `).join('');
    }
    
    // Display weaknesses
    const consListElement = document.getElementById('consList');
    if (consListElement && analysis.weaknesses.length > 0) {
        consListElement.innerHTML = analysis.weaknesses.map(weakness => `
            <div class="list-item">
                <h4><i class="fas fa-times-circle"></i> ${weakness.title}</h4>
                <p>${weakness.description}</p>
            </div>
        `).join('');
    } else if (consListElement && analysis.weaknesses.length === 0) {
        consListElement.innerHTML = `
            <div class="list-item">
                <h4><i class="fas fa-check-circle"></i> Excellent Performance Across All Areas</h4>
                <p>You're doing great! Keep maintaining this level of performance.</p>
            </div>
        `;
    }
}

// Submit feedback
function submitFeedback(feedbackText, rating) {
    const feedback = {
        text: feedbackText,
        rating: rating,
        timestamp: new Date().toISOString(),
        studentId: JSON.parse(localStorage.getItem('studentData'))?.studentId
    };
    
    // Store feedback in localStorage
    const existingFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
    existingFeedback.push(feedback);
    localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
    
    return true;
}

// Load student data from Firestore
async function loadStudentData() {
    try {
        console.log('loadStudentData called');
        
        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) {
            console.error('Firebase not initialized');
            return null;
        }

        // Wait for auth to be ready and get the current user
        const user = await new Promise((resolve) => {
            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                unsubscribe(); // Unsubscribe immediately after getting the user
                resolve(user);
            });
        });

        if (!user) {
            console.log('No user logged in, redirecting to auth');
            window.location.href = 'auth.html';
            return null;
        }

        console.log('Loading data for user:', user.uid);
        
        // Get user's performance data
        const db = firebase.firestore();
        const docRef = db.collection('performance').doc(user.uid);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
            console.log('No performance data found for user:', user.uid);
            const loadingMessage = document.getElementById('loadingMessage');
            if (loadingMessage) {
                loadingMessage.textContent = 'No performance data found. Please complete some assessments first.';
            }
            return {
                attendance: 0,
                testScores: [],
                assignments: [],
                events: [],
                logicScores: [],
                studentName: user.displayName || (user.email ? user.email.split('@')[0] : 'Student'),
                studentId: user.uid.substring(0, 8),
                department: 'Not specified',
                semester: 'Current',
                lastUpdated: new Date().toLocaleDateString()
            };
        }
        
        const data = docSnap.data();
        console.log('Retrieved data:', data);
        
        // Process assignments
        const assignments = Array.isArray(data.assignments) ? data.assignments.map(assignment => ({
            ...assignment,
            obtained: parseFloat(assignment.obtained) || 0,
            maximum: parseFloat(assignment.maximum) || 100,
            subject: assignment.subject || 'General',
            date: assignment.date || new Date().toISOString().split('T')[0]
        })) : [];
        
        // Process test scores
        const testScores = Array.isArray(data.testScores) ? data.testScores.map(test => ({
            ...test,
            score: parseFloat(test.score) || 0,
            maxScore: parseFloat(test.maxScore) || 100,
            subject: test.subject || 'General',
            date: test.date || new Date().toISOString().split('T')[0]
        })) : [];
        
        // Process attendance
        let attendance = 0;
        if (typeof data.attendance === 'object' && data.attendance !== null) {
            if (data.attendance.present !== undefined && data.attendance.total) {
                attendance = (data.attendance.present / data.attendance.total) * 100;
            }
        } else if (!isNaN(parseFloat(data.attendance))) {
            attendance = parseFloat(data.attendance);
        }
        
        return {
            attendance: attendance,
            testScores: testScores,
            assignments: assignments,
            events: Array.isArray(data.events) ? data.events : [],
            logicScores: Array.isArray(data.logicScores) ? data.logicScores : [],
            studentName: data.studentName || (user.displayName || (user.email ? user.email.split('@')[0] : 'Student')),
            studentId: data.studentId || user.uid.substring(0, 8),
            department: data.department || 'Not specified',
            semester: data.semester || 'Current',
            lastUpdated: data.lastUpdated || new Date().toLocaleDateString()
        };
        
    } catch (error) {
        console.error('Error in loadStudentData:', error);
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.textContent = 'Error loading data. Please try again later.';
        }
        return {
            attendance: 0,
            testScores: [],
            assignments: [],
            events: [],
            logicScores: [],
            studentName: 'Student',
            studentId: 'N/A',
            department: 'Error',
            semester: 'N/A',
            lastUpdated: new Date().toLocaleDateString()
        };
    }
}

// Make sure the function is available globally
window.loadStudentData = loadStudentData;

// Make functions globally available
window.calculatePerformance = calculatePerformance;
window.analyzePerformance = analyzePerformance;
window.getPerformanceGrade = getPerformanceGrade;
window.generatePDFReport = generatePDFReport;
window.displayResults = displayResults;
window.submitFeedback = submitFeedback;