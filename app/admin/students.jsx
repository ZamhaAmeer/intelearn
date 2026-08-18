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
import { studentService, facultyService } from './services/api';
import DataTable from './components/DataTable';

export default function StudentManagementScreen() {
  // Lists & Loaders
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals visibility
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentEmotions, setStudentEmotions] = useState([]);
  const [loadingEmotions, setLoadingEmotions] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState(null); // Null for Add, ID for Edit
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('');
  const [gpa, setGpa] = useState('');
  const [semester, setSemester] = useState('1');
  const [status, setStatus] = useState('Active');
  
  // Custom dropdown selector states
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const loadStudents = async (query = '') => {
    try {
      setLoading(true);
      const data = await studentService.getAll(query);
      setStudents(data);
    } catch (err) {
      console.error('Error loading students', err);
      Alert.alert('Load Error', 'Failed to retrieve students from database.');
    } finally {
      setLoading(false);
    }
  };

  const loadFaculties = async () => {
    try {
      const data = await facultyService.getAll();
      setFaculties(data);
    } catch (err) {
      console.error('Error loading faculties', err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadFaculties();
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    loadStudents(val);
  };

  // Open Form Modal for Create
  const handleOpenAddForm = () => {
    setFormId(null);
    setStudentId('');
    setFullName('');
    setEmail('');
    setPhone('');
    setFacultyId('');
    setDepartment('');
    setGpa('');
    setSemester('1');
    setStatus('Active');
    setFormModalVisible(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditForm = (student) => {
    setFormId(student.id);
    setStudentId(student.student_id);
    setFullName(student.full_name);
    setEmail(student.email);
    setPhone(student.phone || '');
    setFacultyId(student.faculty_id?.toString() || '');
    setDepartment(student.department || '');
    setGpa(student.gpa?.toString() || '');
    setSemester(student.current_semester?.toString() || '1');
    setStatus(student.status || 'Active');
    setFormModalVisible(true);
  };

  // Save student (Submit Create or Edit)
  const handleSaveStudent = async () => {
    if (!studentId.trim() || !fullName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Student ID, Full Name, and Email are required.');
      return;
    }

    const payload = {
      student_id: studentId.trim(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      faculty_id: facultyId ? parseInt(facultyId) : null,
      department: department.trim() || null,
      gpa: gpa ? parseFloat(gpa) : 0.00,
      current_semester: parseInt(semester),
      status: status
    };

    try {
      if (formId) {
        // Edit Mode
        await studentService.update(formId, payload);
        Alert.alert('Success', 'Student details updated successfully.');
      } else {
        // Create Mode
        await studentService.create(payload);
        Alert.alert('Success', 'New student registered successfully.');
      }
      setFormModalVisible(false);
      loadStudents(searchQuery);
    } catch (err) {
      console.error('Save student error', err);
      Alert.alert('Operation Failed', err.response?.data?.error || 'Database write error occurred.');
    }
  };

  // Delete Student
  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to permanently delete the profile of ${student.full_name} (${student.student_id})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await studentService.delete(student.id);
              Alert.alert('Deleted', 'Student has been removed from database.');
              loadStudents(searchQuery);
            } catch (err) {
              console.error('Delete error', err);
              Alert.alert('Failed', 'Failed to delete student.');
            }
          }
        }
      ]
    );
  };

  // View Student Full Details & Emotional logs
  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setDetailModalVisible(true);
    setLoadingEmotions(true);
    setStudentEmotions([]);

    try {
      const logs = await studentService.getEmotions(student.id);
      setStudentEmotions(logs);
    } catch (err) {
      console.error('Error fetching student emotions', err);
    } finally {
      setLoadingEmotions(false);
    }
  };

  // Define table headers
  const TABLE_HEADERS = [
    { title: 'Student ID', width: 120 },
    { title: 'Full Name', width: 180 },
    { title: 'Email', width: 200 },
    { title: 'Faculty', width: 160 },
    { title: 'Department', width: 160 },
    { title: 'GPA', width: 80 },
    { title: 'Semester', width: 90 },
    { title: 'Status', width: 100 },
    { title: 'Actions', width: 140 }
  ];

  // Render Table Row
  const renderStudentRow = (student) => {
    let statusBg = '#E8F5E9';
    let statusText = '#2E7D32';

    if (student.status === 'Suspended') {
      statusBg = '#FFEBEE';
      statusText = '#C62828';
    } else if (student.status === 'Graduated') {
      statusBg = '#E3F2FD';
      statusText = '#1565C0';
    }

    return (
      <>
        <View style={[styles.cell, { width: 120 }]}><Text style={styles.boldText}>{student.student_id}</Text></View>
        <View style={[styles.cell, { width: 180 }]}><Text numberOfLines={1}>{student.full_name}</Text></View>
        <View style={[styles.cell, { width: 200 }]}><Text numberOfLines={1}>{student.email}</Text></View>
        <View style={[styles.cell, { width: 160 }]}><Text numberOfLines={1}>{student.faculty_name || 'Unassigned'}</Text></View>
        <View style={[styles.cell, { width: 160 }]}><Text numberOfLines={1}>{student.department || 'N/A'}</Text></View>
        <View style={[styles.cell, { width: 80 }]}><Text style={styles.boldText}>{parseFloat(student.gpa).toFixed(2)}</Text></View>
        <View style={[styles.cell, { width: 90 }]}><Text style={styles.centerText}>Sem {student.current_semester}</Text></View>
        <View style={[styles.cell, { width: 100 }]}>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusText }]}>{student.status}</Text>
          </View>
        </View>
        <View style={[styles.cell, { width: 140, flexDirection: 'row', gap: 8 }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#E3F2FD' }]} 
            onPress={() => handleViewDetails(student)}
            title="View details"
          >
            <Ionicons name="eye" size={16} color="#1565C0" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#F3E5F5' }]} 
            onPress={() => handleOpenEditForm(student)}
            title="Edit student"
          >
            <Ionicons name="create" size={16} color="#7B1FA2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]} 
            onPress={() => handleDeleteStudent(student)}
            title="Delete student"
          >
            <Ionicons name="trash" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Directory, registrations and profiles check of university students.</Text>

      {/* Reusable Data Table Component */}
      <DataTable
        headers={TABLE_HEADERS}
        data={students}
        renderRow={renderStudentRow}
        searchVal={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search students by name, ID or email..."
        onAddPress={handleOpenAddForm}
        addButtonText="Register Student"
        isLoading={loading}
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{formId ? 'Update Student Record' : 'Register New Student'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 1.2 }]}>
                  <Text style={styles.label}>Student ID*</Text>
                  <TextInput
                    style={styles.input}
                    value={studentId}
                    onChangeText={setStudentId}
                    placeholder="e.g. 22FIS0574"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.label}>Full Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Mathusa K."
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.label}>Email Address*</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="e.g. mathusa@ms.sab.ac.lk"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.formCol, { flex: 1.5 }]}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="e.g. +94761122334"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              {/* Faculty Dropdown Selector */}
              <View style={styles.formCol}>
                <Text style={styles.label}>Assigned Faculty</Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger}
                  onPress={() => setShowFacultyDropdown(!showFacultyDropdown)}
                >
                  <Text style={{ color: facultyId ? '#1A1D20' : '#A0A0A0' }}>
                    {facultyId 
                      ? faculties.find(f => f.id === parseInt(facultyId))?.name || 'Faculty Selected'
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

              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.label}>Department</Text>
                  <TextInput
                    style={styles.input}
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="e.g. Computing Systems"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
                <View style={[styles.formCol, { flex: 1 }]}>
                  <Text style={styles.label}>GPA</Text>
                  <TextInput
                    style={styles.input}
                    value={gpa}
                    onChangeText={setGpa}
                    placeholder="0.00"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                {/* Semester Dropdown */}
                <View style={[styles.formCol, { flex: 1 }]}>
                  <Text style={styles.label}>Semester</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setShowSemesterDropdown(!showSemesterDropdown)}
                  >
                    <Text style={{ color: '#1A1D20' }}>Semester {semester}</Text>
                    <Ionicons name="chevron-down" size={16} color="#6F767E" />
                  </TouchableOpacity>
                  {showSemesterDropdown && (
                    <View style={styles.dropdownList}>
                      {['1', '2', '3', '4', '5', '6', '7', '8'].map((sem) => (
                        <TouchableOpacity 
                          key={sem} 
                          style={styles.dropdownOption}
                          onPress={() => {
                            setSemester(sem);
                            setShowSemesterDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>Semester {sem}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Status Dropdown */}
                <View style={[styles.formCol, { flex: 1 }]}>
                  <Text style={styles.label}>Academic Status</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <Text style={{ color: '#1A1D20' }}>{status}</Text>
                    <Ionicons name="chevron-down" size={16} color="#6F767E" />
                  </TouchableOpacity>
                  {showStatusDropdown && (
                    <View style={styles.dropdownList}>
                      {['Active', 'Suspended', 'Graduated'].map((stat) => (
                        <TouchableOpacity 
                          key={stat} 
                          style={styles.dropdownOption}
                          onPress={() => {
                            setStatus(stat);
                            setShowStatusDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{stat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveStudent}>
                <Text style={styles.saveBtnText}>{formId ? 'Update Record' : 'Register'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PROFILE DETAIL & EMOTIONS MODAL */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Student Profile & Emotional Check</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                {/* 1. Header Card */}
                <View style={styles.profileHeaderBox}>
                  <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>{selectedStudent.full_name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.profileMeta}>
                    <Text style={styles.detailStudentName}>{selectedStudent.full_name}</Text>
                    <Text style={styles.detailStudentID}>{selectedStudent.student_id}</Text>
                    <View style={[styles.statusBadge, { alignSelf: 'flex-start', marginTop: 4 }]}>
                      <Text style={styles.statusText}>{selectedStudent.status}</Text>
                    </View>
                  </View>
                </View>

                {/* 2. Grid Information */}
                <Text style={styles.detailSectionTitle}>Contact & Academic Info</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Email Address</Text>
                    <Text style={styles.detailValue}>{selectedStudent.email}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Phone Number</Text>
                    <Text style={styles.detailValue}>{selectedStudent.phone || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Faculty Name</Text>
                    <Text style={styles.detailValue}>{selectedStudent.faculty_name || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Department / Major</Text>
                    <Text style={styles.detailValue}>{selectedStudent.department || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Semester</Text>
                    <Text style={styles.detailValue}>Semester {selectedStudent.current_semester}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Academic GPA</Text>
                    <Text style={[styles.detailValue, { fontWeight: 'bold', color: '#5B3CC2' }]}>
                      {parseFloat(selectedStudent.gpa).toFixed(2)} / 4.00
                    </Text>
                  </View>
                </View>

                {/* 3. Emotional Log History */}
                <Text style={styles.detailSectionTitle}>Emotional Log History</Text>
                {loadingEmotions ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#5B3CC2" />
                  </View>
                ) : studentEmotions.length === 0 ? (
                  <View style={styles.emptyLogsBox}>
                    <Ionicons name="heart-dislike-outline" size={36} color="#BEC2C6" />
                    <Text style={styles.emptyLogsText}>No mood reports submitted by this student yet.</Text>
                  </View>
                ) : (
                  <View style={styles.logsTimeline}>
                    {studentEmotions.map((log) => {
                      let emotionColor = '#4CAF50'; // Happy/Calm Green
                      let emotionIcon = 'happy';

                      if (['Stressed', 'Anxious', 'Sad', 'Angry'].includes(log.detected_emotion)) {
                        emotionColor = '#FF5252'; // Negative Red
                        emotionIcon = 'sad';
                      }

                      return (
                        <View key={log.id} style={styles.logCard}>
                          <View style={styles.logCardHeader}>
                            <View style={styles.emotionLabelRow}>
                              <Ionicons name={emotionIcon} size={18} color={emotionColor} />
                              <Text style={[styles.emotionTitleText, { color: emotionColor }]}>
                                {log.detected_emotion} ({log.confidence_score}%)
                              </Text>
                            </View>
                            <Text style={styles.logDateText}>
                              {new Date(log.reported_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Text>
                          </View>
                          {log.trigger_factors && (
                            <Text style={styles.logBodyText}>
                              <Text style={{ fontWeight: 'bold' }}>Triggers: </Text>{log.trigger_factors}
                            </Text>
                          )}
                          {log.notes && (
                            <Text style={styles.logBodyText}>
                              <Text style={{ fontWeight: 'bold' }}>Notes: </Text>{log.notes}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: '#5B3CC2' }]} 
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.saveBtnText}>Close Profile</Text>
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
  centerText: {
    textAlign: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
    maxWidth: 600,
    maxHeight: '80%',
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
    marginBottom: 16,
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
    overflow: 'scroll',
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

  // Detail Modal specifics
  detailScroll: {
    marginVertical: 16,
  },
  profileHeaderBox: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 20,
  },
  largeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8E3FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: {
    fontSize: 24,
    color: '#5B3CC2',
    fontWeight: 'bold',
  },
  profileMeta: {
    flex: 1,
  },
  detailStudentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  detailStudentID: {
    fontSize: 13,
    color: '#6F767E',
    marginTop: 2,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1D20',
    marginBottom: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailGridItem: {
    width: '48%',
    backgroundColor: '#FAFBFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  detailLabel: {
    fontSize: 11,
    color: '#6F767E',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1D20',
    marginTop: 4,
  },
  emptyLogsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  emptyLogsText: {
    color: '#9A9FA5',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  logsTimeline: {
    gap: 12,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  logCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emotionTitleText: {
    fontWeight: '600',
    fontSize: 13,
  },
  logDateText: {
    fontSize: 11,
    color: '#9A9FA5',
  },
  logBodyText: {
    fontSize: 12,
    color: '#1A1D20',
    marginTop: 4,
    lineHeight: 16,
  },
});
