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
import { lecturerService, facultyService } from './services/api';
import DataTable from './components/DataTable';

export default function LecturerManagementScreen() {
  const [lecturers, setLecturers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals visibility
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('');

  // Dropdown States
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showAssignFacultyDropdown, setShowAssignFacultyDropdown] = useState(false);

  const loadLecturers = async (query = '') => {
    try {
      setLoading(true);
      const data = await lecturerService.getAll(query);
      setLecturers(data);
    } catch (err) {
      console.error('Error loading lecturers', err);
      Alert.alert('Error', 'Failed to retrieve lecturers from server.');
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
    loadLecturers();
    loadFaculties();
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    loadLecturers(val);
  };

  const handleOpenAddForm = () => {
    setFormId(null);
    setEmployeeId('');
    setFullName('');
    setEmail('');
    setPhone('');
    setFacultyId('');
    setDepartment('');
    setFormModalVisible(true);
  };

  const handleOpenEditForm = (lecturer) => {
    setFormId(lecturer.id);
    setEmployeeId(lecturer.employee_id);
    setFullName(lecturer.full_name);
    setEmail(lecturer.email);
    setPhone(lecturer.phone || '');
    setFacultyId(lecturer.faculty_id?.toString() || '');
    setDepartment(lecturer.department || '');
    setFormModalVisible(true);
  };

  const handleOpenAssignModal = (lecturer) => {
    setFormId(lecturer.id);
    setFacultyId(lecturer.faculty_id?.toString() || '');
    setDepartment(lecturer.department || '');
    setAssignModalVisible(true);
  };

  const handleSaveLecturer = async () => {
    if (!employeeId.trim() || !fullName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Employee ID, Full Name, and Email are required.');
      return;
    }

    const payload = {
      employee_id: employeeId.trim(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      faculty_id: facultyId ? parseInt(facultyId) : null,
      department: department.trim() || null
    };

    try {
      if (formId) {
        await lecturerService.update(formId, payload);
        Alert.alert('Success', 'Lecturer profile updated.');
      } else {
        await lecturerService.create(payload);
        Alert.alert('Success', 'New lecturer registered.');
      }
      setFormModalVisible(false);
      loadLecturers(searchQuery);
    } catch (err) {
      console.error('Error saving lecturer', err);
      Alert.alert('Failed', err.response?.data?.error || 'Database error occurred.');
    }
  };

  const handleSaveAssignment = async () => {
    try {
      await lecturerService.assignFaculty(
        formId,
        facultyId ? parseInt(facultyId) : null,
        department.trim() || null
      );
      Alert.alert('Success', 'Faculty assignment updated successfully.');
      setAssignModalVisible(false);
      loadLecturers(searchQuery);
    } catch (err) {
      console.error('Assignment error', err);
      Alert.alert('Error', 'Failed to update faculty assignment.');
    }
  };

  const handleDeleteLecturer = (lecturer) => {
    Alert.alert(
      'Delete Lecturer',
      `Are you sure you want to remove ${lecturer.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await lecturerService.delete(lecturer.id);
              Alert.alert('Success', 'Lecturer removed.');
              loadLecturers(searchQuery);
            } catch (err) {
              console.error('Delete lecturer error', err);
              Alert.alert('Error', 'Failed to delete lecturer.');
            }
          }
        }
      ]
    );
  };

  const TABLE_HEADERS = [
    { title: 'Employee ID', width: 120 },
    { title: 'Full Name', width: 180 },
    { title: 'Email Address', width: 200 },
    { title: 'Assigned Faculty', width: 180 },
    { title: 'Department', width: 180 },
    { title: 'Actions', width: 140 }
  ];

  const renderLecturerRow = (lecturer) => {
    return (
      <>
        <View style={[styles.cell, { width: 120 }]}><Text style={styles.boldText}>{lecturer.employee_id}</Text></View>
        <View style={[styles.cell, { width: 180 }]}><Text numberOfLines={1}>{lecturer.full_name}</Text></View>
        <View style={[styles.cell, { width: 200 }]}><Text numberOfLines={1}>{lecturer.email}</Text></View>
        <View style={[styles.cell, { width: 180 }]}><Text numberOfLines={1}>{lecturer.faculty_name || 'Unassigned'}</Text></View>
        <View style={[styles.cell, { width: 180 }]}><Text numberOfLines={1}>{lecturer.department || 'N/A'}</Text></View>
        <View style={[styles.cell, { width: 140, flexDirection: 'row', gap: 8 }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#E0F2F1' }]} 
            onPress={() => handleOpenAssignModal(lecturer)}
            title="Assign Faculty"
          >
            <Ionicons name="git-branch" size={16} color="#00695C" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#F3E5F5' }]} 
            onPress={() => handleOpenEditForm(lecturer)}
            title="Edit profile"
          >
            <Ionicons name="create" size={16} color="#7B1FA2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]} 
            onPress={() => handleDeleteLecturer(lecturer)}
            title="Delete profile"
          >
            <Ionicons name="trash" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Directory, registrations and faculty assignments of academic lecturers.</Text>

      <DataTable
        headers={TABLE_HEADERS}
        data={lecturers}
        renderRow={renderLecturerRow}
        searchVal={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search lecturers by name, email or ID..."
        onAddPress={handleOpenAddForm}
        addButtonText="Register Lecturer"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{formId ? 'Update Lecturer Record' : 'Register New Lecturer'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 1.2 }]}>
                  <Text style={styles.label}>Employee ID*</Text>
                  <TextInput
                    style={styles.input}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="e.g. L005"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.label}>Full Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Dr. Jane Smith"
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
                    placeholder="e.g. janesmith@ms.sab.ac.lk"
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
                    placeholder="e.g. +94771234567"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

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

              <View style={styles.formCol}>
                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Dept of Computing"
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLecturer}>
                <Text style={styles.saveBtnText}>{formId ? 'Update' : 'Register'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QUICK ASSIGNMENT MODAL */}
      <Modal
        visible={assignModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Faculty Assignment</Text>
              <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Select Faculty</Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger}
                  onPress={() => setShowAssignFacultyDropdown(!showAssignFacultyDropdown)}
                >
                  <Text style={{ color: facultyId ? '#1A1D20' : '#A0A0A0' }}>
                    {facultyId 
                      ? faculties.find(f => f.id === parseInt(facultyId))?.name || 'Faculty Selected'
                      : 'Unassigned / Clear'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6F767E" />
                </TouchableOpacity>
                {showAssignFacultyDropdown && (
                  <View style={styles.dropdownList}>
                    <TouchableOpacity 
                      style={styles.dropdownOption}
                      onPress={() => {
                        setFacultyId('');
                        setShowAssignFacultyDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, { color: '#FF6B6B' }]}>-- Clear Assignment --</Text>
                    </TouchableOpacity>
                    {faculties.map((fac) => (
                      <TouchableOpacity 
                        key={fac.id} 
                        style={styles.dropdownOption}
                        onPress={() => {
                          setFacultyId(fac.id.toString());
                          setShowAssignFacultyDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{fac.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={[styles.formCol, { marginTop: 12 }]}>
                <Text style={styles.label}>Department Name</Text>
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Department of Business"
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAssignModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAssignment}>
                <Text style={styles.saveBtnText}>Save Assignment</Text>
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
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
