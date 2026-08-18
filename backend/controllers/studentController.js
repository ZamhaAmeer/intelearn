const db = require('../config/db');

// Get all students (with optional search)
exports.getAllStudents = async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT s.*, f.name as faculty_name 
      FROM students s
      LEFT JOIN faculties f ON s.faculty_id = f.id
    `;
    const params = [];

    if (search) {
      query += ` WHERE s.full_name ILIKE $1 OR s.student_id ILIKE $1 OR s.email ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.student_id ASC`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ error: 'Server error retrieving students.' });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT s.*, f.name as faculty_name 
       FROM students s 
       LEFT JOIN faculties f ON s.faculty_id = f.id 
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({ error: 'Server error retrieving student details.' });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  const { student_id, full_name, email, phone, faculty_id, department, gpa, current_semester, status } = req.body;

  if (!student_id || !full_name || !email) {
    return res.status(400).json({ error: 'Student ID, Full Name, and Email are required.' });
  }

  try {
    // Check if student_id or email already exists
    const checkDuplicate = await db.query(
      'SELECT id FROM students WHERE student_id = $1 OR email = $2',
      [student_id, email]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'A student with this Student ID or Email already exists.' });
    }

    const result = await db.query(
      `INSERT INTO students (student_id, full_name, email, phone, faculty_id, department, gpa, current_semester, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        student_id,
        full_name,
        email,
        phone || null,
        faculty_id || null,
        department || null,
        gpa || 0.00,
        current_semester || 1,
        status || 'Active'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Server error creating student.' });
  }
};

// Update an existing student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { student_id, full_name, email, phone, faculty_id, department, gpa, current_semester, status } = req.body;

  try {
    // Check if student exists
    const checkExist = await db.query('SELECT id FROM students WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Check duplicate student_id or email elsewhere
    const checkDuplicate = await db.query(
      'SELECT id FROM students WHERE (student_id = $1 OR email = $2) AND id != $3',
      [student_id, email, id]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Another student already uses this Student ID or Email.' });
    }

    const result = await db.query(
      `UPDATE students 
       SET student_id = $1, full_name = $2, email = $3, phone = $4, faculty_id = $5, department = $6, gpa = $7, current_semester = $8, status = $9
       WHERE id = $10
       RETURNING *`,
      [student_id, full_name, email, phone, faculty_id, department, gpa, current_semester, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Server error updating student details.' });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExist = await db.query('SELECT id FROM students WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await db.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ message: 'Student profile deleted successfully.' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Server error deleting student.' });
  }
};

// Get emotional reports history for a student
exports.getStudentEmotions = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM emotional_reports WHERE student_id = $1 ORDER BY reported_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get student emotions error:', error);
    res.status(500).json({ error: 'Server error retrieving student emotional logs.' });
  }
};

// Get academic progress details for a student
exports.getStudentAcademic = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT s.id, s.full_name, s.student_id, s.gpa, s.current_semester, s.status, f.name as faculty_name, s.department
       FROM students s
       LEFT JOIN faculties f ON s.faculty_id = f.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student academic records not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get student academic info error:', error);
    res.status(500).json({ error: 'Server error retrieving academic details.' });
  }
};
