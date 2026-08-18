const db = require('../config/db');

// Get all resources (with search and category filter)
exports.getAllResources = async (req, res) => {
  const { search, category, facultyId } = req.query;
  try {
    let query = `
      SELECT r.*, f.name as faculty_name, f.code as faculty_code, l.full_name as lecturer_name 
      FROM learning_resources r
      LEFT JOIN faculties f ON r.faculty_id = f.id
      LEFT JOIN lecturers l ON r.uploaded_by_lecturer_id = l.id
    `;
    const params = [];
    let paramIndex = 1;
    const conditions = [];

    if (search) {
      conditions.push(`(r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      conditions.push(`r.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (facultyId) {
      conditions.push(`r.faculty_id = $${paramIndex}`);
      params.push(facultyId);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY r.created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ error: 'Server error retrieving learning resources.' });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT r.*, f.name as faculty_name, l.full_name as lecturer_name 
       FROM learning_resources r
       LEFT JOIN faculties f ON r.faculty_id = f.id
       LEFT JOIN lecturers l ON r.uploaded_by_lecturer_id = l.id
       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({ error: 'Server error retrieving resource details.' });
  }
};

// Create a learning resource
exports.createResource = async (req, res) => {
  const { title, description, category, file_url, faculty_id, uploaded_by_lecturer_id } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and Category are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO learning_resources (title, description, category, file_url, faculty_id, uploaded_by_lecturer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || null, category, file_url || null, faculty_id || null, uploaded_by_lecturer_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Server error creating resource.' });
  }
};

// Update learning resource
exports.updateResource = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, file_url, faculty_id, uploaded_by_lecturer_id } = req.body;

  try {
    const checkExist = await db.query('SELECT id FROM learning_resources WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    const result = await db.query(
      `UPDATE learning_resources 
       SET title = $1, description = $2, category = $3, file_url = $4, faculty_id = $5, uploaded_by_lecturer_id = $6
       WHERE id = $7
       RETURNING *`,
      [title, description, category, file_url, faculty_id, uploaded_by_lecturer_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Server error updating resource details.' });
  }
};

// Delete learning resource
exports.deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExist = await db.query('SELECT id FROM learning_resources WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    await db.query('DELETE FROM learning_resources WHERE id = $1', [id]);
    res.json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Server error deleting resource.' });
  }
};
