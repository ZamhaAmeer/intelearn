const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // 1. Read and run schema.sql to reset and recreate the tables
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('Database tables cleared and recreated.');

    // 2. Hash admin password (disabled default admin seed)
    // const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // 3. Seed Admin Users (Disabled default admin seed so users must sign up first)
    const adminId = null;
    console.log('Default admin seeding skipped to enforce registration first.');

    // 4. Seed Faculties (Only one Faculty of Computing as requested)
    const faculties = [
      { name: 'Faculty of Computing', code: 'FOC', dean: 'Prof. Lalith Seneviratne', description: 'Focuses on Computer Science, Software Engineering, and Information Technology.' }
    ];

    const seededFaculties = [];
    for (const f of faculties) {
      const res = await pool.query(
        `INSERT INTO faculties (name, code, description, dean) VALUES ($1, $2, $3, $4) RETURNING id, name, code;`,
        [f.name, f.code, f.description, f.dean]
      );
      seededFaculties.push(res.rows[0]);
    }
    console.log(`Seeded ${seededFaculties.length} faculties.`);

    // 5. Seed Lecturers (All belonging to Faculty of Computing)
    const lecturers = [
      { employee_id: 'L001', full_name: 'Dr. Aruna Shantha', email: 'aruna@ms.sab.ac.lk', phone: '+94711234567', code: 'FOC', department: 'Department of Computing & Information Systems' },
      { employee_id: 'L002', full_name: 'Mrs. Priyanthi Wijesekera', email: 'priyanthi@ms.sab.ac.lk', phone: '+94772345678', code: 'FOC', department: 'Department of Software Engineering' },
      { employee_id: 'L003', full_name: 'Prof. Kumara Fernando', email: 'kumara@ms.sab.ac.lk', phone: '+94723456789', code: 'FOC', department: 'Department of Computer Science' },
      { employee_id: 'L004', full_name: 'Dr. Sanduni Perera', email: 'sanduni@ms.sab.ac.lk', phone: '+94754567890', code: 'FOC', department: 'Department of Information Technology' }
    ];

    const seededLecturers = [];
    for (const l of lecturers) {
      const faculty = seededFaculties.find(f => f.code === l.code);
      const res = await pool.query(
        `INSERT INTO lecturers (employee_id, full_name, email, phone, faculty_id, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name;`,
        [l.employee_id, l.full_name, l.email, l.phone, faculty ? faculty.id : null, l.department]
      );
      seededLecturers.push({ ...res.rows[0], code: l.code });
    }
    console.log(`Seeded ${seededLecturers.length} lecturers.`);

    // 6. Seed Students (All belonging to Faculty of Computing)
    const students = [
      { student_id: '22FIS0574', full_name: 'Mathusa K.', email: '22fis0574@ms.sab.ac.lk', phone: '+94761122334', code: 'FOC', department: 'Department of Computing & Information Systems', gpa: 3.85, semester: 4, status: 'Active' },
      { student_id: '22FIS0102', full_name: 'Ruwan Kumara', email: '22fis0102@ms.sab.ac.lk', phone: '+94762233445', code: 'FOC', department: 'Department of Software Engineering', gpa: 3.12, semester: 4, status: 'Active' },
      { student_id: '22FMS0411', full_name: 'Dinithi Perera', email: '22fms0411@ms.sab.ac.lk', phone: '+94773344556', code: 'FOC', department: 'Department of Computer Science', gpa: 3.56, semester: 3, status: 'Active' },
      { student_id: '22FMS0255', full_name: 'Amara Weerasinghe', email: '22fms0255@ms.sab.ac.lk', phone: '+94714455667', code: 'FOC', department: 'Department of Information Technology', gpa: 2.10, semester: 3, status: 'Active' }, 
      { student_id: '22FSL0050', full_name: 'Nimmi Jayasekera', email: '22fsl0050@ms.sab.ac.lk', phone: '+94725566778', code: 'FOC', department: 'Department of Software Engineering', gpa: 3.42, semester: 5, status: 'Active' },
      { student_id: '21FIS0089', full_name: 'Sandun Silva', email: '21fis0089@ms.sab.ac.lk', phone: '+94756677889', code: 'FOC', department: 'Department of Computing & Information Systems', gpa: 2.80, semester: 6, status: 'Suspended' }
    ];

    const seededStudents = [];
    for (const s of students) {
      const faculty = seededFaculties.find(f => f.code === s.code);
      const res = await pool.query(
        `INSERT INTO students (student_id, full_name, email, phone, faculty_id, department, gpa, current_semester, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, full_name, student_id;`,
        [s.student_id, s.full_name, s.email, s.phone, faculty ? faculty.id : null, s.department, s.gpa, s.semester, s.status]
      );
      seededStudents.push(res.rows[0]);
    }
    console.log(`Seeded ${seededStudents.length} students.`);

    // 7. Seed Emotional Reports (Only 4 emotions: Happy, Sad, Neutral, Frustrated)
    const amara = seededStudents.find(s => s.student_id === '22FMS0255');
    const mathusa = seededStudents.find(s => s.student_id === '22FIS0574');
    const ruwan = seededStudents.find(s => s.student_id === '22FIS0102');
    const dinithi = seededStudents.find(s => s.student_id === '22FMS0411');

    const reports = [
      { student_id: amara.id, emotion: 'Frustrated', confidence: 91.50, triggers: 'Financial pressure, exam preparation', notes: 'Expresses overwhelming anxiety about failing exams.', reported_at: '2026-06-10 09:00:00' },
      { student_id: amara.id, emotion: 'Sad', confidence: 88.00, triggers: 'Lecture workload', notes: 'Struggles to keep up with assignments.', reported_at: '2026-06-12 14:00:00' },
      { student_id: amara.id, emotion: 'Sad', confidence: 85.20, triggers: 'Loneliness', notes: 'Feeling isolated in the hostel.', reported_at: '2026-06-15 17:30:00' },
      { student_id: mathusa.id, emotion: 'Happy', confidence: 95.00, triggers: 'Research paper approval', notes: 'Very motivated.', reported_at: '2026-06-12 10:00:00' },
      { student_id: mathusa.id, emotion: 'Neutral', confidence: 90.00, triggers: 'Yoga class', notes: 'Relaxed and focused.', reported_at: '2026-06-14 08:30:00' },
      { student_id: mathusa.id, emotion: 'Happy', confidence: 98.40, triggers: 'Received high GPA', notes: 'Excelling in all courses.', reported_at: '2026-06-16 12:00:00' },
      { student_id: ruwan.id, emotion: 'Frustrated', confidence: 80.50, triggers: 'Group project delays', notes: 'Frustrated with team members.', reported_at: '2026-06-14 11:00:00' },
      { student_id: ruwan.id, emotion: 'Neutral', confidence: 87.00, triggers: 'Resolved issue', notes: 'Spoke with lecturer.', reported_at: '2026-06-15 15:00:00' },
      { student_id: dinithi.id, emotion: 'Sad', confidence: 89.00, triggers: 'Upcoming presentation', notes: 'Stage fright.', reported_at: '2026-06-13 10:00:00' },
      { student_id: dinithi.id, emotion: 'Frustrated', confidence: 79.50, triggers: 'Low quiz mark', notes: 'Disappointed in business studies quiz.', reported_at: '2026-06-16 09:00:00' }
    ];

    for (const r of reports) {
      await pool.query(
        `INSERT INTO emotional_reports (student_id, detected_emotion, confidence_score, trigger_factors, notes, reported_at) 
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [r.student_id, r.emotion, r.confidence, r.triggers, r.notes, r.reported_at]
      );
    }
    console.log('Seeded emotional detection reports (Restricted 4-emotion set).');

    // 8. Seed Learning Resources (All linked to Faculty of Computing)
    const resources = [
      { title: 'Introduction to Data Structures & Algorithms', description: 'Comprehensive notes covering stacks, queues, trees, and graphs.', category: 'Lecture Notes', file_url: 'http://intelearn.edu.lk/materials/fas/data_structures.pdf', code: 'FOC', lecturer: 'Dr. Aruna Shantha' },
      { title: 'Interactive React Native Basics', description: 'Video guide showing React Native setup and Navigation Drawer construction.', category: 'Video Tutorials', file_url: 'http://intelearn.edu.lk/materials/fas/react_native.mp4', code: 'FOC', lecturer: 'Dr. Aruna Shantha' },
      { title: 'Principles of Modern Computing Economics', description: 'Textbook chapters covering IT project economics and planning.', category: 'Textbooks', file_url: 'http://intelearn.edu.lk/materials/fms/economics_principles.pdf', code: 'FOC', lecturer: 'Prof. Kumara Fernando' },
      { title: 'Applied Physics Past Paper 2025', description: 'Solved question paper with detailed explanations.', category: 'Past Papers', file_url: 'http://intelearn.edu.lk/materials/fas/physics_2025.pdf', code: 'FOC', lecturer: 'Mrs. Priyanthi Wijesekera' }
    ];

    for (const r of resources) {
      const faculty = seededFaculties.find(f => f.code === r.code);
      const lecturer = seededLecturers.find(l => l.full_name === r.lecturer);
      await pool.query(
        `INSERT INTO learning_resources (title, description, category, file_url, faculty_id, uploaded_by_lecturer_id) 
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [r.title, r.description, r.category, r.file_url, faculty ? faculty.id : null, lecturer ? lecturer.id : null]
      );
    }
    console.log('Seeded learning resources.');

    // 9. Seed Announcements
    const announcements = [
      { title: 'End-Semester Examination Schedule - FOC', content: 'The end-semester examinations for the Faculty of Computing will commence on July 10, 2026. Please check the website for the detailed timetable.', audience: 'Faculty-specific', code: 'FOC' },
      { title: 'System Maintenance: Intelearn Offline', content: 'Intelearn database services will undergo routine maintenance on Sunday, June 21, 2026, from 02:00 AM to 05:00 AM. Expect temporary outages.', audience: 'All', code: null },
      { title: 'Lecturer Feedback Evaluation 2026', content: 'All academic staff members are requested to upload their syllabus coverage reports by next Friday.', audience: 'Lecturers', code: null }
    ];

    for (const a of announcements) {
      const faculty = a.code ? seededFaculties.find(f => f.code === a.code) : null;
      await pool.query(
        `INSERT INTO announcements (title, content, target_audience, faculty_id, published_by) 
         VALUES ($1, $2, $3, $4, $5);`,
        [a.title, a.content, a.audience, faculty ? faculty.id : null, adminId]
      );
    }
    console.log('Seeded announcements.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

seedDatabase();
