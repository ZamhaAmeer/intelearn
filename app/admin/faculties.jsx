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
import { facultyService } from './services/api';
import DataTable from './components/DataTable';

export default function FacultyDirectoryScreen() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [dean, setDean] = useState('');
  const [description, setDescription] = useState('');

  // Info modal states
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyStaff, setFacultyStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const loadFaculties = async () => {
    try {
      setLoading(true);
      const data = await facultyService.getAll();
      setFaculties(data);
    } catch (err) {
      console.error('Error loading faculties', err);
      Alert.alert('Load Error', 'Failed to retrieve faculties directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculties();
  }, []);

  const handleOpenAddForm = () => {
    setFormId(null);
    setName('');
    setCode('');
    setDean('');
    setDescription('');
    setFormModalVisible(true);
  };

  const handleOpenEditForm = (fac) => {
    setFormId(fac.id);
    setName(fac.name);
    setCode(fac.code);
    setDean(fac.dean || '');
    setDescription(fac.description || '');
    setFormModalVisible(true);
  };

  const handleSaveFaculty = async () => {
    if (!name.trim() || !code.trim()) {
      Alert.alert('Validation Error', 'Faculty Name and Code are required.');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      dean: dean.trim() || null,
      description: description.trim() || null
    };

    try {
      if (formId) {
        await facultyService.update(formId, payload);
        Alert.alert('Success', 'Faculty details updated.');
      } else {
        await facultyService.create(payload);
        Alert.alert('Success', 'New faculty added successfully.');
      }
      setFormModalVisible(false);
      loadFaculties();
    } catch (err) {
      console.error('Error saving faculty', err);
      Alert.alert('Operation Failed', err.response?.data?.error || 'Database error occurred.');
    }
  };

  const handleDeleteFaculty = (fac) => {
    Alert.alert(
      'Delete Faculty',
      `Are you sure you want to remove ${fac.name}? This will affect student and lecturer records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await facultyService.delete(fac.id);
              Alert.alert('Deleted', 'Faculty removed from database.');
              loadFaculties();
            } catch (err) {
              console.error('Delete error', err);
              Alert.alert('Failed', 'Could not delete faculty. Check database dependencies.');
            }
          }
        }
      ]
    );
  };

  const handleViewInfo = async (fac) => {
    setSelectedFaculty(fac);
    setInfoModalVisible(true);
    setLoadingStaff(true);
    setFacultyStaff([]);

    try {
      const staffList = await facultyService.getLecturers(fac.id);
      setFacultyStaff(staffList);
    } catch (err) {
      console.error('Error fetching faculty staff', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const TABLE_HEADERS = [
    { title: 'Faculty Code', width: 120 },
    { title: 'Faculty Name', width: 220 },
    { title: 'Dean / Head', width: 180 },
    { title: 'Description', width: 280 },
    { title: 'Actions', width: 140 }
  ];

  const renderFacultyRow = (fac) => {
    return (
      <>
        <View style={[styles.cell, { width: 120 }]}><Text style={styles.boldText}>{fac.code}</Text></View>
        <View style={[styles.cell, { width: 220 }]}><Text numberOfLines={1}>{fac.name}</Text></View>
        <View style={[styles.cell, { width: 180 }]}><Text numberOfLines={1}>{fac.dean || 'Unassigned'}</Text></View>
        <View style={[styles.cell, { width: 280 }]}><Text numberOfLines={1}>{fac.description || 'No description provided.'}</Text></View>
        <View style={[styles.cell, { width: 140, flexDirection: 'row', gap: 8 }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#E3F2FD' }]} 
            onPress={() => handleViewInfo(fac)}
            title="View info page"
          >
            <Ionicons name="information-circle" size={16} color="#1565C0" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#F3E5F5' }]} 
            onPress={() => handleOpenEditForm(fac)}
            title="Edit faculty"
          >
            <Ionicons name="create" size={16} color="#7B1FA2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]} 
            onPress={() => handleDeleteFaculty(fac)}
            title="Delete faculty"
          >
            <Ionicons name="trash" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Directory of academic faculties, active departments, and assigned Deans.</Text>

      <DataTable
        headers={TABLE_HEADERS}
        data={faculties}
        renderRow={renderFacultyRow}
        onAddPress={handleOpenAddForm}
        addButtonText="Add Faculty"
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
              <Text style={styles.modalTitle}>{formId ? 'Update Faculty Details' : 'Register New Faculty'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 1.2 }]}>
                  <Text style={styles.label}>Faculty Code*</Text>
                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    placeholder="e.g. FAS"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="characters"
                  />
                </View>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.label}>Faculty Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Faculty of Applied Sciences"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>Dean / Appointed Head</Text>
                <TextInput
                  style={styles.input}
                  value={dean}
                  onChangeText={setDean}
                  placeholder="e.g. Prof. J.K. Wijerathne"
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <View style={[styles.formCol, { marginTop: 12 }]}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Provide a summary of departments, degrees, and academic focus..."
                  placeholderTextColor="#A0A0A0"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFaculty}>
                <Text style={styles.saveBtnText}>{formId ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* INFO PAGE / DETAIL VIEW MODAL */}
      <Modal
        visible={infoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Faculty Information Page</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            {selectedFaculty && (
              <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.facultyHeaderBox}>
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeBadgeText}>{selectedFaculty.code}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailFacName}>{selectedFaculty.name}</Text>
                    <Text style={styles.detailFacDean}><Text style={{ fontWeight: 'bold' }}>Dean: </Text>{selectedFaculty.dean || 'Unassigned'}</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitleText}>About Faculty</Text>
                  <Text style={styles.infoDescText}>
                    {selectedFaculty.description || 'No detailed academic description has been set for this faculty yet.'}
                  </Text>
                </View>

                {/* Assigned staff directory */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitleText}>Assigned Educators ({facultyStaff.length})</Text>
                  {loadingStaff ? (
                    <ActivityIndicator size="small" color="#5B3CC2" style={{ padding: 15 }} />
                  ) : facultyStaff.length === 0 ? (
                    <Text style={styles.emptyText}>No lecturers currently assigned to this faculty.</Text>
                  ) : (
                    <View style={styles.staffList}>
                      {facultyStaff.map((staff) => (
                        <View key={staff.id} style={styles.staffItem}>
                          <View style={styles.staffInfo}>
                            <Text style={styles.staffName}>{staff.full_name}</Text>
                            <Text style={styles.staffDept}>{staff.department || 'General Faculty'}</Text>
                          </View>
                          <View style={styles.staffContact}>
                            <Text style={styles.staffEmail}>{staff.email}</Text>
                            <Text style={styles.staffCode}>{staff.employee_id}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: '#5B3CC2' }]} 
                onPress={() => setInfoModalVisible(false)}
              >
                <Text style={styles.saveBtnText}>Close Page</Text>
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

  // Info details styles
  detailScroll: {
    marginVertical: 16,
  },
  facultyHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 20,
  },
  codeBadge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#5B3CC2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailFacName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  detailFacDean: {
    fontSize: 13,
    color: '#6F767E',
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1D20',
    borderLeftWidth: 3,
    borderLeftColor: '#5B3CC2',
    paddingLeft: 8,
    marginBottom: 10,
  },
  infoDescText: {
    fontSize: 13,
    color: '#333A42',
    lineHeight: 20,
  },
  staffList: {
    gap: 10,
  },
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FAFBFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  staffInfo: {
    flex: 1.2,
  },
  staffName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  staffDept: {
    fontSize: 11,
    color: '#6F767E',
    marginTop: 2,
  },
  staffContact: {
    flex: 1,
    alignItems: 'flex-end',
  },
  staffEmail: {
    fontSize: 12,
    color: '#6F767E',
  },
  staffCode: {
    fontSize: 11,
    color: '#9A9FA5',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: '#9A9FA5',
    fontStyle: 'italic',
  },
});
