const db = require('../config/db');

// Get all lecturers (with optional search)
exports.getAllLecturers = async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT l.*, f.name as faculty_name 
      FROM lecturers l
      LEFT JOIN faculties f ON l.faculty_id = f.id
    `;
    const params = [];

    if (search) {
      query += ` WHERE l.full_name ILIKE $1 OR l.employee_id ILIKE $1 OR l.email ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY l.employee_id ASC`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all lecturers error:', error);
    res.status(500).json({ error: 'Server error retrieving lecturers.' });
  }
};

// Get single lecturer by ID
exports.getLecturerById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT l.*, f.name as faculty_name 
       FROM lecturers l 
       LEFT JOIN faculties f ON l.faculty_id = f.id 
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get lecturer by ID error:', error);
    res.status(500).json({ error: 'Server error retrieving lecturer details.' });
  }
};

// Create a new lecturer
exports.createLecturer = async (req, res) => {
  const { employee_id, full_name, email, phone, faculty_id, department } = req.body;

  if (!employee_id || !full_name || !email) {
    return res.status(400).json({ error: 'Employee ID, Full Name, and Email are required.' });
  }

  try {
    // Check duplicates
    const checkDuplicate = await db.query(
      'SELECT id FROM lecturers WHERE employee_id = $1 OR email = $2',
      [employee_id, email]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'A lecturer with this Employee ID or Email already exists.' });
    }

    const result = await db.query(
      `INSERT INTO lecturers (employee_id, full_name, email, phone, faculty_id, department)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [employee_id, full_name, email, phone || null, faculty_id || null, department || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create lecturer error:', error);
    res.status(500).json({ error: 'Server error creating lecturer profile.' });
  }
};

// Update lecturer details
exports.updateLecturer = async (req, res) => {
  const { id } = req.params;
  const { employee_id, full_name, email, phone, faculty_id, department } = req.body;

  try {
    const checkExist = await db.query('SELECT id FROM lecturers WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    const checkDuplicate = await db.query(
      'SELECT id FROM lecturers WHERE (employee_id = $1 OR email = $2) AND id != $3',
      [employee_id, email, id]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Another lecturer already uses this Employee ID or Email.' });
    }

    const result = await db.query(
      `UPDATE lecturers 
       SET employee_id = $1, full_name = $2, email = $3, phone = $4, faculty_id = $5, department = $6
       WHERE id = $7
       RETURNING *`,
      [employee_id, full_name, email, phone, faculty_id, department, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update lecturer error:', error);
    res.status(500).json({ error: 'Server error updating lecturer.' });
  }
};

// Delete lecturer
exports.deleteLecturer = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExist = await db.query('SELECT id FROM lecturers WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    await db.query('DELETE FROM lecturers WHERE id = $1', [id]);
    res.json({ message: 'Lecturer profile deleted successfully.' });
  } catch (error) {
    console.error('Delete lecturer error:', error);
    res.status(500).json({ error: 'Server error deleting lecturer.' });
  }
};

// Assign lecturer to a faculty
exports.assignFaculty = async (req, res) => {
  const { id } = req.params;
  const { faculty_id, department } = req.body;

  try {
    const checkExist = await db.query('SELECT id FROM lecturers WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    const result = await db.query(
      `UPDATE lecturers SET faculty_id = $1, department = $2 WHERE id = $3 RETURNING *`,
      [faculty_id, department, id]
    );

    res.json({ message: 'Lecturer assigned to faculty successfully.', lecturer: result.rows[0] });
  } catch (error) {
    console.error('Assign lecturer to faculty error:', error);
    res.status(500).json({ error: 'Server error assigning lecturer to faculty.' });
  }
};
