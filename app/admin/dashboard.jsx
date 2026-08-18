import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dashboardService } from './services/api';
import DashboardCard from './components/DashboardCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  
  // Dashboard states
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setError('');
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading dashboard stats', err);
      setError('Could not fetch dashboard data. Please check if backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B3CC2" />
        <Text style={styles.loadingText}>Fetching system status...</Text>
      </View>
    );
  }

  // Quick Action Config
  const QUICK_ACTIONS = [
    { title: 'Add Student', icon: 'person-add', color: '#5B3CC2', route: '/admin/students' },
    { title: 'Add Lecturer', icon: 'people-circle', color: '#1E88E5', route: '/admin/lecturers' },
    { title: 'New Alert', icon: 'alert-circle', color: '#FF6B6B', route: '/admin/emotions' },
    { title: 'Publish Post', icon: 'megaphone', color: '#4CAF50', route: '/admin/announcements' },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B3CC2']} />
      }
    >
      {/* Error Banner */}
      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={20} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadDashboardData} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Welcome & Subtitle */}
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.pageTitle}>System Overview</Text>
          <Text style={styles.pageSubtitle}>Real-time metrics for the Intelearn student platform.</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadDashboardData}>
          <Ionicons name="refresh" size={20} color="#5B3CC2" />
        </TouchableOpacity>
      </View>

      {/* 1. Statistics Grid */}
      {stats && (
        <View style={styles.gridContainer}>
          <DashboardCard 
            title="Total Students" 
            value={stats.counts.totalStudents} 
            icon="school-outline" 
            color="#5B3CC2"
            trend="+12% from last month"
            onPress={() => router.push('/admin/students')}
          />
          <DashboardCard 
            title="Total Lecturers" 
            value={stats.counts.totalLecturers} 
            icon="people-outline" 
            color="#1E88E5"
            onPress={() => router.push('/admin/lecturers')}
          />
          <DashboardCard 
            title="Total Faculties" 
            value={stats.counts.totalFaculties} 
            icon="business-outline" 
            color="#FF9800"
            onPress={() => router.push('/admin/faculties')}
          />
          <DashboardCard 
            title="Learning Resources" 
            value={stats.counts.totalLearningResources} 
            icon="folder-open-outline" 
            color="#009688"
            onPress={() => router.push('/admin/resources')}
          />
          <DashboardCard 
            title="Emotional Reports" 
            value={stats.counts.totalEmotionalReports} 
            icon="heart-half-outline" 
            color="#FF5252"
            trend="Needs Attention"
            onPress={() => router.push('/admin/emotions')}
          />
          <DashboardCard 
            title="Announcements" 
            value={stats.counts.totalAnnouncements} 
            icon="megaphone-outline" 
            color="#9C27B0"
            onPress={() => router.push('/admin/announcements')}
          />
        </View>
      )}

      {/* 2. Quick Actions & Recent Activities Section */}
      <View style={styles.row}>
        {/* Quick Actions Panel */}
        <View style={[styles.section, styles.actionsPanel]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(action.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}12` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activities Feed */}
        <View style={[styles.section, styles.activitiesPanel]}>
          <Text style={styles.sectionTitle}>Recent Activity Log</Text>
          {stats && stats.recentActivities && stats.recentActivities.length > 0 ? (
            <View style={styles.activityList}>
              {stats.recentActivities.map((act) => {
                let actColor = '#5B3CC2';
                let actIcon = 'information-circle-outline';

                if (act.type === 'emotion_detection') {
                  actColor = '#FF5252';
                  actIcon = 'pulse-outline';
                } else if (act.type === 'new_student') {
                  actColor = '#4CAF50';
                  actIcon = 'person-add-outline';
                }

                return (
                  <View key={act.id} style={styles.activityItem}>
                    <View style={[styles.activityDot, { backgroundColor: `${actColor}15` }]}>
                      <Ionicons name={actIcon} size={16} color={actColor} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityMessage}>{act.message}</Text>
                      <Text style={styles.activityTime}>
                        {new Date(act.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="calendar-outline" size={32} color="#BEC2C6" />
              <Text style={styles.emptyActivityText}>No recent activities recorded.</Text>
            </View>
          )}
        </View>
      </View>
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontWeight: '500',
    flex: 1,
  },
  retryBtn: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6F767E',
    marginTop: 4,
  },
  refreshBtn: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: width > 992 ? 'row' : 'column',
    gap: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1D20',
    marginBottom: 16,
  },
  actionsPanel: {
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D20',
  },
  activitiesPanel: {
    flex: 1.2,
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F6',
    paddingBottom: 12,
  },
  activityDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 13,
    color: '#1A1D20',
    fontWeight: '500',
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: '#9A9FA5',
    marginTop: 4,
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyActivityText: {
    color: '#9A9FA5',
    fontSize: 13,
  },
});
