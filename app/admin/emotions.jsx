import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emotionService } from './services/api';
import DataTable from './components/DataTable';

export default function EmotionalAnalyticsScreen() {
  const [reports, setReports] = useState([]);
  const [trends, setTrends] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'alerts', 'logs'
  const [filterEmotion, setFilterEmotion] = useState('');

  const loadEmotionData = async () => {
    try {
      setLoading(true);
      const [reportsData, trendsData, alertsData] = await Promise.all([
        emotionService.getReports(filterEmotion),
        emotionService.getTrends(),
        emotionService.getRiskAlerts()
      ]);
      
      setReports(reportsData);
      setTrends(trendsData);
      setRiskAlerts(alertsData);
    } catch (err) {
      console.error('Error loading emotional data', err);
      Alert.alert('Load Error', 'Failed to retrieve emotional analytics logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmotionData();
  }, [filterEmotion]);

  const handleEmotionFilter = (emotion) => {
    setFilterEmotion(emotion === filterEmotion ? '' : emotion);
  };

  if (loading && !trends) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B3CC2" />
        <Text style={styles.loadingText}>Analyzing emotional logs...</Text>
      </View>
    );
  }

  // Helper colors for emotions
  const EMOTION_COLORS = {
    Happy: '#4CAF50',
    Calm: '#00BCD4',
    Sad: '#2196F3',
    Stressed: '#FF9800',
    Anxious: '#E91E63',
    Angry: '#F44336'
  };

  const TABLE_HEADERS = [
    { title: 'Student', width: 150 },
    { title: 'Faculty', width: 90 },
    { title: 'Detected Emotion', width: 140 },
    { title: 'Confidence', width: 100 },
    { title: 'Triggers', width: 220 },
    { title: 'Notes', width: 220 },
    { title: 'Log Date', width: 140 }
  ];

  const renderReportRow = (log) => {
    const color = EMOTION_COLORS[log.detected_emotion] || '#6F767E';
    return (
      <>
        <View style={[styles.cell, { width: 150 }]}>
          <Text style={styles.boldText}>{log.student_name}</Text>
          <Text style={styles.subCellText}>{log.student_id}</Text>
        </View>
        <View style={[styles.cell, { width: 90 }]}>
          <View style={styles.facultyBadge}>
            <Text style={styles.facultyBadgeText}>{log.faculty_code || 'N/A'}</Text>
          </View>
        </View>
        <View style={[styles.cell, { width: 140, flexDirection: 'row', gap: 6 }]}>
          <Ionicons name="pulse" size={16} color={color} />
          <Text style={{ color, fontWeight: 'bold' }}>{log.detected_emotion}</Text>
        </View>
        <View style={[styles.cell, { width: 100 }]}><Text style={styles.centerText}>{log.confidence_score}%</Text></View>
        <View style={[styles.cell, { width: 220 }]}><Text numberOfLines={2}>{log.trigger_factors || 'None specified'}</Text></View>
        <View style={[styles.cell, { width: 220 }]}><Text numberOfLines={2}>{log.notes || 'No remarks.'}</Text></View>
        <View style={[styles.cell, { width: 140 }]}>
          <Text>
            {new Date(log.reported_at).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.subtitle}>Track emotional trends, view logs and manage critical student well-being alerts.</Text>

      {/* Tabs Menu */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'dashboard' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons name="pie-chart" size={18} color={activeTab === 'dashboard' ? 'white' : '#6F767E'} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>Stats Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'alerts' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('alerts')}
        >
          <Ionicons name="alert-circle" size={18} color={activeTab === 'alerts' ? 'white' : '#6F767E'} />
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.tabTextActive]}>Risk Alerts ({riskAlerts.length})</Text>
          {riskAlerts.length > 0 && <View style={styles.badgeAlertCount} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'logs' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('logs')}
        >
          <Ionicons name="list" size={18} color={activeTab === 'logs' ? 'white' : '#6F767E'} />
          <Text style={[styles.tabText, activeTab === 'logs' && styles.tabTextActive]}>All Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Loading overlay for active operations */}
      {loading && (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="small" color="#5B3CC2" />
          <Text style={{ marginLeft: 8, color: '#6F767E' }}>Updating data...</Text>
        </View>
      )}

      {/* ================= TAB 1: DASHBOARD ================= */}
      {activeTab === 'dashboard' && trends && (
        <View style={styles.tabContent}>
          {/* Well-being summary cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { borderLeftColor: '#4CAF50' }]}>
              <Text style={styles.summaryLabel}>Positive / Neutral logs</Text>
              <Text style={[styles.summaryVal, { color: '#4CAF50' }]}>
                {trends.summary.total_count > 0 
                  ? `${Math.round((parseInt(trends.summary.positive_count) / parseInt(trends.summary.total_count)) * 100)}%`
                  : '0%'
                }
              </Text>
              <Text style={styles.summarySub}>{trends.summary.positive_count} total logs (Happy, Calm)</Text>
            </View>
            <View style={[styles.summaryBox, { borderLeftColor: '#F44336' }]}>
              <Text style={styles.summaryLabel}>Negative / At-Risk logs</Text>
              <Text style={[styles.summaryVal, { color: '#F44336' }]}>
                {trends.summary.total_count > 0 
                  ? `${Math.round((parseInt(trends.summary.negative_count) / parseInt(trends.summary.total_count)) * 100)}%`
                  : '0%'
                }
              </Text>
              <Text style={styles.summarySub}>{trends.summary.negative_count} total logs (Stressed, Anxious, Sad)</Text>
            </View>
          </View>

          {/* Bar Chart section */}
          <View style={styles.chartPanel}>
            <Text style={styles.chartPanelTitle}>Emotion Distribution & Confidence Metrics</Text>
            <View style={styles.barChartContainer}>
              {trends.distribution.map((dist) => {
                const maxCount = Math.max(...trends.distribution.map(d => parseInt(d.count)), 1);
                const barWidth = `${Math.max((parseInt(dist.count) / maxCount) * 100, 5)}%`;
                const color = EMOTION_COLORS[dist.emotion] || '#6F767E';

                return (
                  <View key={dist.emotion} style={styles.chartRow}>
                    <Text style={styles.chartRowLabel}>{dist.emotion}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
                    </View>
                    <Text style={styles.chartRowVal}>{dist.count} logs ({dist.avg_confidence}%)</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* ================= TAB 2: RISK ALERTS ================= */}
      {activeTab === 'alerts' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionHeading}>Active Student Support Flags</Text>
          <Text style={styles.sectionSubHeading}>Students displaying repeated negative emotional patterns who may require academic counseling or direct lecturer intervention.</Text>
          
          {riskAlerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
              <Text style={styles.emptyTitle}>All Clear</Text>
              <Text style={styles.emptyText}>No students are currently flagged for high-risk emotional profiles.</Text>
            </View>
          ) : (
            <View style={styles.alertsList}>
              {riskAlerts.map((student) => (
                <View key={student.student_id} style={styles.alertCard}>
                  {/* Card Header */}
                  <View style={styles.alertCardHeader}>
                    <View style={styles.alertMeta}>
                      <View style={styles.alertNameRow}>
                        <Text style={styles.alertStudentName}>{student.full_name}</Text>
                        <View style={styles.alertFlagBadge}>
                          <Text style={styles.alertFlagBadgeText}>{student.negative_reports_count} Logs</Text>
                        </View>
                      </View>
                      <Text style={styles.alertStudentCode}>{student.student_code} | {student.faculty_code || 'General'}</Text>
                    </View>
                    <View style={styles.alertActionRow}>
                      <TouchableOpacity 
                        style={styles.actionIconButton} 
                        onPress={() => Alert.alert('Contact Student', `Email: ${student.email}\nPhone: ${student.phone || 'N/A'}`)}
                        title="Contact Info"
                      >
                        <Ionicons name="call-outline" size={18} color="#C62828" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Card Body (Recent Logs) */}
                  <View style={styles.alertCardBody}>
                    <Text style={styles.recentLogsHeading}>Recent Logs triggering flag:</Text>
                    {student.recent_negative_logs.map((log, index) => {
                      const color = EMOTION_COLORS[log.detected_emotion] || '#F44336';
                      return (
                        <View key={index} style={styles.alertLogItem}>
                          <View style={styles.alertLogMeta}>
                            <Text style={[styles.alertLogEmotionText, { color }]}>{log.detected_emotion}</Text>
                            <Text style={styles.alertLogConf}>({log.confidence_score}% Conf)</Text>
                            <Text style={styles.alertLogDate}>
                              {new Date(log.reported_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Text>
                          </View>
                          {log.trigger_factors && <Text style={styles.alertLogText}><Text style={{ fontWeight: '600' }}>Trigger: </Text>{log.trigger_factors}</Text>}
                          {log.notes && <Text style={styles.alertLogText}><Text style={{ fontWeight: '600' }}>Note: </Text>{log.notes}</Text>}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ================= TAB 3: ALL REPORTS ================= */}
      {activeTab === 'logs' && (
        <View style={styles.tabContent}>
          {/* Quick Filters */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Quick Filters:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {['Happy', 'Calm', 'Sad', 'Stressed', 'Anxious', 'Angry'].map((emo) => {
                const color = EMOTION_COLORS[emo];
                const isActive = filterEmotion === emo;

                return (
                  <TouchableOpacity
                    key={emo}
                    style={[
                      styles.filterTag,
                      { borderColor: color },
                      isActive && { backgroundColor: color }
                    ]}
                    onPress={() => handleEmotionFilter(emo)}
                  >
                    <Text style={[styles.filterTagText, { color: isActive ? '#FFFFFF' : color }]}>
                      {emo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <DataTable
            headers={TABLE_HEADERS}
            data={reports}
            renderRow={renderReportRow}
            isLoading={loading && reports.length === 0}
            searchPlaceholder="All submissions view..."
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  contentContainer: {
    padding: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6F767E',
    marginTop: -8,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#6F767E',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#EFEFEF',
    padding: 6,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#5B3CC2',
  },
  tabText: {
    color: '#6F767E',
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  badgeAlertCount: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
    top: 6,
    right: 6,
  },
  inlineLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContent: {
    animationDuration: '0.2s',
  },
  
  // Dashboard Styles
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6F767E',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  summarySub: {
    fontSize: 11,
    color: '#9A9FA5',
  },
  chartPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  chartPanelTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1D20',
    marginBottom: 20,
  },
  barChartContainer: {
    gap: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chartRowLabel: {
    width: 80,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D20',
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#F4F5F6',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  chartRowVal: {
    width: 120,
    fontSize: 12,
    color: '#6F767E',
    textAlign: 'right',
  },

  // Alerts tab styles
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  sectionSubHeading: {
    fontSize: 13,
    color: '#6F767E',
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
  },
  alertsList: {
    gap: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFEBEE', // Alert theme
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F8',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEBEE',
  },
  alertMeta: {
    flex: 1,
  },
  alertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertStudentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B71C1C',
  },
  alertFlagBadge: {
    backgroundColor: '#D32F2F',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  alertFlagBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  alertStudentCode: {
    fontSize: 12,
    color: '#6F767E',
    marginTop: 2,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCardBody: {
    padding: 16,
    gap: 12,
  },
  recentLogsHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D20',
    textTransform: 'uppercase',
  },
  alertLogItem: {
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    padding: 12,
  },
  alertLogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertLogEmotionText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertLogConf: {
    fontSize: 11,
    color: '#6F767E',
  },
  alertLogDate: {
    marginLeft: 'auto',
    fontSize: 11,
    color: '#9A9FA5',
  },
  alertLogText: {
    fontSize: 12,
    color: '#333A42',
    lineHeight: 16,
    marginTop: 2,
  },

  // Logs filters styles
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D20',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterTag: {
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  subCellText: {
    fontSize: 11,
    color: '#6F767E',
    marginTop: 2,
  },
  facultyBadge: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  facultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6F767E',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  centerText: {
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1D20',
    marginTop: 12,
  },
  emptyText: {
    color: '#9A9FA5',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
