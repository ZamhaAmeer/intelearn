import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Linking,
  Share,
  Alert,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalTheme } from './themeStore';

const { width } = Dimensions.get('window');

export default function StudentNotesScreen() {
  const router = useRouter();
  const [isDark] = useGlobalTheme();
  const { courseCode } = useLocalSearchParams();
  const targetCourseCode = courseCode || 'IS4109';

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://172.22.236.72:3000/api/student/notes/${targetCourseCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve shared notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching student notes:', error);
      Alert.alert('Error', 'Failed to retrieve notes from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [targetCourseCode]);

  const handleViewFile = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Document', 'Invalid or unsupported document URL.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while launching the document viewer.');
    }
  };

  const handleShareOrDownload = async (url, title) => {
    try {
      await Share.share({
        message: `Check out these study notes for ${targetCourseCode}: ${title}\n${url}`,
        title: title,
        url: url,
      });
    } catch (error) {
      console.error('Sharing failed:', error.message);
    }
  };

  const renderNoteItem = ({ item }) => {
    const isPPTX = item.file_type === 'PPTX';
    return (
      <View style={[styles.card, isDark && { backgroundColor: '#1E1E1E', borderColor: '#2A2A2A' }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: isPPTX ? (isDark ? '#3E1C2B' : '#FEE2E2') : (isDark ? '#1C2B3E' : '#E0E7FF') }]}>
            <Icon
              name={isPPTX ? 'file-powerpoint' : 'file-document'}
              size={32}
              color={isPPTX ? '#EF4444' : '#3B82F6'}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.noteTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.file_type || 'PDF'}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.noteDescription, isDark && { color: '#AAAAAA' }]}>
          {item.description || 'No description provided by the instructor.'}
        </Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewFile(item.file_url)}
          >
            <Icon name="eye-outline" size={18} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.viewButtonText}>View Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton, isDark && { backgroundColor: '#2A2A2A', borderColor: '#4C35A5' }]}
            onPress={() => handleShareOrDownload(item.file_url, item.title)}
          >
            <Icon name="share-variant" size={18} color={isDark ? "#B39DDB" : "#4E33B3"} style={{ marginRight: 6 }} />
            <Text style={[styles.downloadButtonText, isDark && { color: '#B39DDB' }]}>Share/Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && { backgroundColor: '#121212' }]}>
      <StatusBar barStyle="light-content" />

      {/* Curved Header Background */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shared Notes</Text>
        <Text style={styles.headerSubtitle}>{targetCourseCode}</Text>
      </View>

      <View style={[styles.contentBody, isDark && { backgroundColor: '#121212' }]}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4E33B3" />
            <Text style={[styles.loadingText, isDark && { color: '#AAAAAA' }]}>Fetching uploaded course documents...</Text>
          </View>
        ) : notes.length > 0 ? (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Icon name="folder-open-outline" size={60} color={isDark ? "#666" : "#A0AEC0"} />
            <Text style={[styles.emptyTitle, isDark && { color: '#FFFFFF' }]}>No Notes Shared Yet</Text>
            <Text style={[styles.emptySubtitle, isDark && { color: '#AAAAAA' }]}>Your lecturer hasn't uploaded any documents or slides for {targetCourseCode}.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchNotes}>
              <Text style={styles.refreshButtonText}>Refresh Catalog</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeader: {
    backgroundColor: '#4E33B3',
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 42,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DDD6FE',
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1
  },
  contentBody: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#4E33B3',
    fontWeight: '500'
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#4E33B3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 4
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569'
  },
  noteDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewButton: {
    backgroundColor: '#4E33B3',
    marginRight: 10
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  downloadButton: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#4E33B3',
    marginLeft: 10
  },
  downloadButtonText: {
    color: '#4E33B3',
    fontSize: 14,
    fontWeight: '600'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 15,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  refreshButton: {
    backgroundColor: '#4E33B3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
