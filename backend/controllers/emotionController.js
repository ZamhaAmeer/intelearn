const db = require('../config/db');

// Get all emotional reports with student profiles
exports.getAllReports = async (req, res) => {
  const { emotion, studentId } = req.query;
  try {
    let query = `
      SELECT r.*, s.full_name as student_name, s.student_id, f.code as faculty_code
      FROM emotional_reports r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN faculties f ON s.faculty_id = f.id
    `;
    const params = [];
    let paramIndex = 1;

    if (emotion) {
      query += ` WHERE r.detected_emotion = $${paramIndex}`;
      params.push(emotion);
      paramIndex++;
    }

    if (studentId) {
      if (params.length > 0) {
        query += ` AND r.student_id = $${paramIndex}`;
      } else {
        query += ` WHERE r.student_id = $${paramIndex}`;
      }
      params.push(studentId);
      paramIndex++;
    }

    query += ` ORDER BY r.reported_at DESC`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get emotional reports error:', error);
    res.status(500).json({ error: 'Server error retrieving emotional reports.' });
  }
};

// Get emotion trends and stats (restricted to Happy, Sad, Neutral, Frustrated)
exports.getTrends = async (req, res) => {
  try {
    // 1. Group by emotion to get distribution counts
    const distributionResult = await db.query(`
      SELECT detected_emotion as emotion, COUNT(*) as count, AVG(confidence_score)::numeric(5,2) as avg_confidence
      FROM emotional_reports
      GROUP BY detected_emotion
      ORDER BY count DESC
    `);

    // 2. Daily submission count for trends (past 30 days)
    const timelineResult = await db.query(`
      SELECT DATE(reported_at) as date, COUNT(*) as count
      FROM emotional_reports
      WHERE reported_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(reported_at)
      ORDER BY DATE(reported_at) ASC
    `);

    // 3. Negative vs Positive summary
    // Negative: Sad, Frustrated
    // Positive/Neutral: Happy, Neutral
    const summaryResult = await db.query(`
      SELECT 
        COUNT(CASE WHEN detected_emotion IN ('Sad', 'Frustrated') THEN 1 END) as negative_count,
        COUNT(CASE WHEN detected_emotion IN ('Happy', 'Neutral') THEN 1 END) as positive_count,
        COUNT(*) as total_count
      FROM emotional_reports
    `);

    res.json({
      distribution: distributionResult.rows,
      timeline: timelineResult.rows,
      summary: summaryResult.rows[0]
    });
  } catch (error) {
    console.error('Get emotional trends error:', error);
    res.status(500).json({ error: 'Server error retrieving emotional trends.' });
  }
};

// Get students at risk (students with 2 or more negative emotional reports: Sad, Frustrated)
exports.getRiskAlerts = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id as student_id,
        s.student_id as student_code,
        s.full_name,
        s.email,
        s.phone,
        f.code as faculty_code,
        COUNT(r.id) as negative_reports_count,
        MAX(r.reported_at) as last_reported_at
      FROM students s
      JOIN emotional_reports r ON s.id = r.student_id
      LEFT JOIN faculties f ON s.faculty_id = f.id
      WHERE r.detected_emotion IN ('Sad', 'Frustrated')
      GROUP BY s.id, s.student_id, s.full_name, s.email, s.phone, f.code
      HAVING COUNT(r.id) >= 2 -- Flag at 2 or more reports for proactive response
      ORDER BY negative_reports_count DESC
    `;
    const result = await db.query(query);

    // Fetch the recent negative reports details for these students
    const riskAlerts = [];
    for (const student of result.rows) {
      const detailRes = await db.query(
        `SELECT detected_emotion, confidence_score, trigger_factors, notes, reported_at 
         FROM emotional_reports 
         WHERE student_id = $1 AND detected_emotion IN ('Sad', 'Frustrated')
         ORDER BY reported_at DESC LIMIT 3`,
        [student.student_id]
      );
      riskAlerts.push({
        ...student,
        recent_negative_logs: detailRes.rows
      });
    }

    res.json(riskAlerts);
  } catch (error) {
    console.error('Get risk alerts error:', error);
    res.status(500).json({ error: 'Server error retrieving student risk alerts.' });
  }
};
