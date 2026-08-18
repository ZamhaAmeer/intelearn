import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { announcementService, facultyService } from './services/api';
import DataTable from './components/DataTable';

const AUDIENCES = ['All', 'Students', 'Lecturers', 'Faculty-specific'];

export default function AnnouncementScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [formModalVisible, setFormModalVisible] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [facultyId, setFacultyId] = useState('');

  // Dropdown states
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error loading announcements', err);
      Alert.alert('Load Error', 'Failed to retrieve announcements directory.');
    } finally {
      setLoading(false);
    }
  };

  const loadFaculties = async () => {
    try {
      const data = await facultyService.getAll();
      setFaculties(data);
    } catch (err) {
      console.error('Error loading faculties helper', err);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadFaculties();
  }, []);

  const handleOpenAddForm = () => {
    setFormId(null);
    setTitle('');
    setContent('');
    setTargetAudience('All');
    setFacultyId('');
    setFormModalVisible(true);
  };

  const handleOpenEditForm = (ann) => {
    setFormId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setTargetAudience(ann.target_audience);
    setFacultyId(ann.faculty_id?.toString() || '');
    setFormModalVisible(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Title and Content body are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      target_audience: targetAudience,
      faculty_id: targetAudience === 'Faculty-specific' && facultyId ? parseInt(facultyId) : null
    };

    try {
      if (formId) {
        await announcementService.update(formId, payload);
        Alert.alert('Success', 'Announcement updated successfully.');
      } else {
        await announcementService.create(payload);
        Alert.alert('Success', 'Announcement published. Target cohorts notified.');
      }
      setFormModalVisible(false);
      loadAnnouncements();
    } catch (err) {
      console.error('Save announcement error', err);
      Alert.alert('Operation Failed', err.response?.data?.error || 'Database error occurred.');
    }
  };

  const handleDeleteAnnouncement = (ann) => {
    Alert.alert(
      'Delete Announcement',
      `Are you sure you want to permanently delete "${ann.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await announcementService.delete(ann.id);
              Alert.alert('Success', 'Announcement deleted successfully.');
              loadAnnouncements();
            } catch (err) {
              console.error('Delete error', err);
              Alert.alert('Error', 'Failed to delete announcement.');
            }
          }
        }
      ]
    );
  };

  const TABLE_HEADERS = [
    { title: 'Announcement Title', width: 220 },
    { title: 'Target Audience', width: 150 },
    { title: 'Faculty Scope', width: 160 },
    { title: 'Author', width: 140 },
    { title: 'Post Details', width: 280 },
    { title: 'Publish Date', width: 140 },
    { title: 'Actions', width: 100 }
  ];

  const renderAnnouncementRow = (ann) => {
    let audColor = '#00BCD4';
    if (ann.target_audience === 'Students') audColor = '#4CAF50';
    else if (ann.target_audience === 'Lecturers') audColor = '#FF9800';
    else if (ann.target_audience === 'Faculty-specific') audColor = '#9C27B0';

    return (
      <>
        <View style={[styles.cell, { width: 220 }]}><Text style={styles.boldText} numberOfLines={1}>{ann.title}</Text></View>
        <View style={[styles.cell, { width: 150 }]}>
          <View style={[styles.audienceBadge, { backgroundColor: `${audColor}12` }]}>
            <Text style={[styles.audienceBadgeText, { color: audColor }]}>{ann.target_audience}</Text>
          </View>
        </View>
        <View style={[styles.cell, { width: 160 }]}><Text numberOfLines={1}>{ann.faculty_name || 'Global'}</Text></View>
        <View style={[styles.cell, { width: 140 }]}><Text numberOfLines={1}>{ann.author_name || 'System'}</Text></View>
        <View style={[styles.cell, { width: 280 }]}><Text numberOfLines={1}>{ann.content}</Text></View>
        <View style={[styles.cell, { width: 140 }]}>
          <Text>
            {new Date(ann.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={[styles.cell, { width: 100, flexDirection: 'row', gap: 8 }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#F3E5F5' }]} 
            onPress={() => handleOpenEditForm(ann)}
            title="Edit post"
          >
            <Ionicons name="create" size={16} color="#7B1FA2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]} 
            onPress={() => handleDeleteAnnouncement(ann)}
            title="Delete post"
          >
            <Ionicons name="trash" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Broadcast alerts, examination details, or maintenance logs to student and educator channels.</Text>

      <DataTable
        headers={TABLE_HEADERS}
        data={announcements}
        renderRow={renderAnnouncementRow}
        onAddPress={handleOpenAddForm}
        addButtonText="Create Announcement"
        isLoading={loading}
        searchPlaceholder="Publish updates..."
      />

      {/* FORM MODAL */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{formId ? 'Edit Announcement Post' : 'Publish Announcement'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Broadcast Title*</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. End-Semester Examination Schedule"
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <View style={styles.formRow}>
                {/* Target Audience Dropdown */}
                <View style={[styles.formCol, { flex: 1.2 }]}>
                  <Text style={styles.label}>Target Audience*</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setShowAudienceDropdown(!showAudienceDropdown)}
                  >
                    <Text style={{ color: '#1A1D20' }}>{targetAudience}</Text>
                    <Ionicons name="chevron-down" size={16} color="#6F767E" />
                  </TouchableOpacity>
                  {showAudienceDropdown && (
                    <View style={styles.dropdownList}>
                      {AUDIENCES.map((aud) => (
                        <TouchableOpacity 
                          key={aud} 
                          style={styles.dropdownOption}
                          onPress={() => {
                            setTargetAudience(aud);
                            setShowAudienceDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{aud}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Faculty Scope Dropdown (Only show if Faculty-specific target chosen) */}
                {targetAudience === 'Faculty-specific' && (
                  <View style={[styles.formCol, { flex: 1.5 }]}>
                    <Text style={styles.label}>Select Target Faculty</Text>
                    <TouchableOpacity 
                      style={styles.dropdownTrigger}
                      onPress={() => setShowFacultyDropdown(!showFacultyDropdown)}
                    >
                      <Text style={{ color: facultyId ? '#1A1D20' : '#A0A0A0' }} numberOfLines={1}>
                        {facultyId 
                          ? faculties.find(f => f.id === parseInt(facultyId))?.name || 'Selected'
                          : 'Choose Faculty'
                        }
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#6F767E" />
                    </TouchableOpacity>
                    {showFacultyDropdown && (
                      <View style={styles.dropdownList}>
                        {faculties.map((fac) => (
                          <TouchableOpacity 
                            key={fac.id} 
                            style={styles.dropdownOption}
                            onPress={() => {
                              setFacultyId(fac.id.toString());
                              setShowFacultyDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>{fac.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={[styles.formCol, { marginTop: 12 }]}>
                <Text style={styles.label}>Announcement Content Body*</Text>
                <TextInput
                  style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Draft announcement details, timetables or system alert descriptions..."
                  placeholderTextColor="#A0A0A0"
                  multiline={true}
                  numberOfLines={5}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAnnouncement}>
                <Text style={styles.saveBtnText}>{formId ? 'Update' : 'Publish'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F6FA',
  },
  subtitle: {
    fontSize: 14,
    color: '#6F767E',
    marginTop: -8,
    marginBottom: 16,
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  audienceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  audienceBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F6',
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  modalForm: {
    marginVertical: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  formCol: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D20',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FAFBFC',
  },
  dropdownTrigger: {
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    maxHeight: 150,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F6',
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#1A1D20',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F6',
    paddingTop: 16,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  cancelBtnText: {
    color: '#6F767E',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#5B3CC2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
