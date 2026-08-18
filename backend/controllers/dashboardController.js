const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    // Run all count queries concurrently for efficiency
    const [
      studentsCount,
      lecturersCount,
      facultiesCount,
      resourcesCount,
      emotionsCount,
      announcementsCount,
      recentReports,
      recentStudents
    ] = await Promise.all([
      db.query('SELECT COUNT(*) FROM students'),
      db.query('SELECT COUNT(*) FROM lecturers'),
      db.query('SELECT COUNT(*) FROM faculties'),
      db.query('SELECT COUNT(*) FROM learning_resources'),
      db.query('SELECT COUNT(*) FROM emotional_reports'),
      db.query('SELECT COUNT(*) FROM announcements'),
      db.query(`
        SELECT r.id, r.detected_emotion, r.confidence_score, r.reported_at, s.full_name as student_name 
        FROM emotional_reports r
        JOIN students s ON r.student_id = s.id
        ORDER BY r.reported_at DESC LIMIT 5
      `),
      db.query('SELECT id, full_name, student_id, created_at FROM students ORDER BY created_at DESC LIMIT 5')
    ]);

    // Aggregate recent activities
    const recentActivities = [];

    recentReports.rows.forEach(r => {
      recentActivities.push({
        id: `report_${r.id}`,
        type: 'emotion_detection',
        message: `${r.student_name} submitted a mood report (${r.detected_emotion} - ${r.confidence_score}%)`,
        timestamp: r.reported_at
      });
    });

    recentStudents.rows.forEach(s => {
      recentActivities.push({
        id: `student_${s.id}`,
        type: 'new_student',
        message: `New student registered: ${s.full_name} (${s.student_id})`,
        timestamp: s.created_at
      });
    });

    // Sort recent activities by timestamp descending
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      counts: {
        totalStudents: parseInt(studentsCount.rows[0].count),
        totalLecturers: parseInt(lecturersCount.rows[0].count),
        totalFaculties: parseInt(facultiesCount.rows[0].count),
        totalLearningResources: parseInt(resourcesCount.rows[0].count),
        totalEmotionalReports: parseInt(emotionsCount.rows[0].count),
        totalAnnouncements: parseInt(announcementsCount.rows[0].count)
      },
      recentActivities: recentActivities.slice(0, 5) // Return top 5
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error retrieving dashboard statistics.' });
  }
};
