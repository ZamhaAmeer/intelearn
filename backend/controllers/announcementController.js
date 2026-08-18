const db = require('../config/db');

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, f.name as faculty_name, f.code as faculty_code, adm.full_name as author_name 
      FROM announcements a
      LEFT JOIN faculties f ON a.faculty_id = f.id
      LEFT JOIN admin_users adm ON a.published_by = adm.id
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all announcements error:', error);
    res.status(500).json({ error: 'Server error retrieving announcements.' });
  }
};

// Get single announcement
exports.getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT a.*, f.name as faculty_name, adm.full_name as author_name 
       FROM announcements a
       LEFT JOIN faculties f ON a.faculty_id = f.id
       LEFT JOIN admin_users adm ON a.published_by = adm.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get announcement by ID error:', error);
    res.status(500).json({ error: 'Server error retrieving announcement details.' });
  }
};

// Create an announcement
exports.createAnnouncement = async (req, res) => {
  const { title, content, target_audience, faculty_id } = req.body;
  const adminId = req.user ? req.user.id : null; // Populated from authentication middleware

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO announcements (title, content, target_audience, faculty_id, published_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, content, target_audience || 'All', faculty_id || null, adminId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Server error publishing announcement.' });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content, target_audience, faculty_id } = req.body;

  try {
    const checkExist = await db.query('SELECT id FROM announcements WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    const result = await db.query(
      `UPDATE announcements 
       SET title = $1, content = $2, target_audience = $3, faculty_id = $4
       WHERE id = $5
       RETURNING *`,
      [title, content, target_audience, faculty_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Server error updating announcement.' });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExist = await db.query('SELECT id FROM announcements WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    await db.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Server error deleting announcement.' });
  }
};
