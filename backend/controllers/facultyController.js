const db = require('../config/db');

// Get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faculties ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get all faculties error:', error);
    res.status(500).json({ error: 'Server error retrieving faculties.' });
  }
};

// Get single faculty details
exports.getFacultyById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM faculties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get faculty by ID error:', error);
    res.status(500).json({ error: 'Server error retrieving faculty details.' });
  }
};

// Create a new faculty
exports.createFaculty = async (req, res) => {
  const { name, code, description, dean } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Faculty Name and Code are required.' });
  }

  try {
    const checkDuplicate = await db.query(
      'SELECT id FROM faculties WHERE name = $1 OR code = $2',
      [name, code]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'A faculty with this Name or Code already exists.' });
    }

    const result = await db.query(
      `INSERT INTO faculties (name, code, description, dean)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, code, description || null, dean || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Server error creating faculty.' });
  }
};

// Update faculty details
exports.updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, dean } = req.body;

  try {
    const checkExist = await db.query('SELECT id FROM faculties WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found.' });
    }

    const checkDuplicate = await db.query(
      'SELECT id FROM faculties WHERE (name = $1 OR code = $2) AND id != $3',
      [name, code, id]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Another faculty already uses this Name or Code.' });
    }

    const result = await db.query(
      `UPDATE faculties 
       SET name = $1, code = $2, description = $3, dean = $4
       WHERE id = $5
       RETURNING *`,
      [name, code, description, dean, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Server error updating faculty.' });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExist = await db.query('SELECT id FROM faculties WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found.' });
    }

    await db.query('DELETE FROM faculties WHERE id = $1', [id]);
    res.json({ message: 'Faculty deleted successfully.' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ error: 'Server error deleting faculty.' });
  }
};

// Get all lecturers in a faculty
exports.getFacultyLecturers = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id, employee_id, full_name, email, department FROM lecturers WHERE faculty_id = $1 ORDER BY full_name ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get faculty lecturers error:', error);
    res.status(500).json({ error: 'Server error retrieving faculty lecturers.' });
  }
};
