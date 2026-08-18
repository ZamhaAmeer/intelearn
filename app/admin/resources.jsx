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
import * as DocumentPicker from 'expo-document-picker';
import { resourceService, facultyService, lecturerService } from './services/api';
import DataTable from './components/DataTable';

const CATEGORIES = ['Lecture Notes', 'Textbooks', 'Video Tutorials', 'Past Papers'];

export default function LearningResourcesScreen() {
  const [resources, setResources] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

  // Modal control
  const [formModalVisible, setFormModalVisible] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [fileUrl, setFileUrl] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [uploadedByLecturerId, setUploadedByLecturerId] = useState('');

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showLecturerDropdown, setShowLecturerDropdown] = useState(false);

  // Pick document simulation
  const [pickingDocument, setPickingDocument] = useState(false);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAll(searchQuery, filterCategory, filterFaculty);
      setResources(data);
    } catch (err) {
      console.error('Error loading resources', err);
      Alert.alert('Error', 'Failed to retrieve study materials.');
    } finally {
      setLoading(false);
    }
  };

  const loadFilterData = async () => {
    try {
      const [facData, lecData] = await Promise.all([
        facultyService.getAll(),
        lecturerService.getAll()
      ]);
      setFaculties(facData);
      setLecturers(lecData);
    } catch (err) {
      console.error('Error loading helpers info', err);
    }
  };

  useEffect(() => {
    loadResources();
  }, [searchQuery, filterCategory, filterFaculty]);

  useEffect(() => {
    loadFilterData();
  }, []);

  const handleOpenAddForm = () => {
    setFormId(null);
    setTitle('');
    setDescription('');
    setCategory('Lecture Notes');
    setFileUrl('');
    setFacultyId('');
    setUploadedByLecturerId('');
    setFormModalVisible(true);
  };

  const handleOpenEditForm = (res) => {
    setFormId(res.id);
    setTitle(res.title);
    setDescription(res.description || '');
    setCategory(res.category);
    setFileUrl(res.file_url || '');
    setFacultyId(res.faculty_id?.toString() || '');
    setUploadedByLecturerId(res.uploaded_by_lecturer_id?.toString() || '');
    setFormModalVisible(true);
  };

  const handlePickDocument = async () => {
    try {
      setPickingDocument(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        // Simulate upload by generating a mock university server storage link
        const generatedUrl = `http://intelearn.edu.lk/materials/uploads/${Date.now()}_${encodeURIComponent(file.name)}`;
        setFileUrl(generatedUrl);
        Alert.alert('File Selected', `Document: ${file.name}\nSimulated Upload Path Saved.`);
      }
    } catch (err) {
      console.error('Document picker error', err);
      Alert.alert('Error', 'Failed to pick local document.');
    } finally {
      setPickingDocument(false);
    }
  };

  const handleSaveResource = async () => {
    if (!title.trim() || !category) {
      Alert.alert('Validation Error', 'Title and Category are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      file_url: fileUrl.trim() || null,
      faculty_id: facultyId ? parseInt(facultyId) : null,
      uploaded_by_lecturer_id: uploadedByLecturerId ? parseInt(uploadedByLecturerId) : null
    };

    try {
      if (formId) {
        await resourceService.update(formId, payload);
        Alert.alert('Success', 'Resource updated.');
      } else {
        await resourceService.create(payload);
        Alert.alert('Success', 'New study resource published.');
      }
      setFormModalVisible(false);
      loadResources();
    } catch (err) {
      console.error('Save resource error', err);
      Alert.alert('Operation Failed', err.response?.data?.error || 'Database error occurred.');
    }
  };

  const handleDeleteResource = (res) => {
    Alert.alert(
      'Delete Resource',
      `Delete "${res.title}" from the database?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await resourceService.delete(res.id);
              Alert.alert('Deleted', 'Study material removed.');
              loadResources();
            } catch (err) {
              console.error('Delete resource error', err);
              Alert.alert('Error', 'Failed to delete resource.');
            }
          }
        }
      ]
    );
  };

  const TABLE_HEADERS = [
    { title: 'Resource Title', width: 200 },
    { title: 'Category', width: 140 },
    { title: 'Faculty', width: 140 },
    { title: 'Uploader', width: 160 },
    { title: 'Description', width: 220 },
    { title: 'File URL', width: 200 },
    { title: 'Actions', width: 100 }
  ];

  const renderResourceRow = (res) => {
    return (
      <>
        <View style={[styles.cell, { width: 200 }]}><Text style={styles.boldText} numberOfLines={1}>{res.title}</Text></View>
        <View style={[styles.cell, { width: 140 }]}>
          <View style={styles.catBadge}>
            <Text style={styles.catBadgeText}>{res.category}</Text>
          </View>
        </View>
        <View style={[styles.cell, { width: 140 }]}><Text numberOfLines={1}>{res.faculty_name || 'All Faculties'}</Text></View>
        <View style={[styles.cell, { width: 160 }]}><Text numberOfLines={1}>{res.lecturer_name || 'Administrator'}</Text></View>
        <View style={[styles.cell, { width: 220 }]}><Text numberOfLines={1}>{res.description || 'N/A'}</Text></View>
        <View style={[styles.cell, { width: 200 }]}><Text style={styles.linkText} numberOfLines={1}>{res.file_url || 'No attachment'}</Text></View>
        <View style={[styles.cell, { width: 100, flexDirection: 'row', gap: 8 }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#F3E5F5' }]} 
            onPress={() => handleOpenEditForm(res)}
            title="Edit"
          >
            <Ionicons name="create" size={16} color="#7B1FA2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]} 
            onPress={() => handleDeleteResource(res)}
            title="Delete"
          >
            <Ionicons name="trash" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Upload documents, lecture slides, books, past papers and organize study files.</Text>

      {/* Advanced Filters Panel */}
      <View style={styles.filterBar}>
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.filterTag, !filterCategory && styles.filterTagActive]} 
              onPress={() => setFilterCategory('')}
            >
              <Text style={[styles.filterTagText, !filterCategory && styles.filterTagTextActive]}>All Categories</Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.filterTag, filterCategory === cat && styles.filterTagActive]} 
                onPress={() => setFilterCategory(cat)}
              >
                <Text style={[styles.filterTagText, filterCategory === cat && styles.filterTagTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <DataTable
        headers={TABLE_HEADERS}
        data={resources}
        renderRow={renderResourceRow}
        searchVal={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search files by title or description..."
        onAddPress={handleOpenAddForm}
        addButtonText="Publish Material"
        isLoading={loading}
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
              <Text style={styles.modalTitle}>{formId ? 'Edit Material Details' : 'Publish New Resource'}</Text>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1D20" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Material Title*</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Week 3 - Array List implementations"
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <View style={styles.formRow}>
                {/* Category Dropdown */}
                <View style={[styles.formCol, { flex: 1 }]}>
                  <Text style={styles.label}>Category*</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Text style={{ color: '#1A1D20' }}>{category}</Text>
                    <Ionicons name="chevron-down" size={16} color="#6F767E" />
                  </TouchableOpacity>
                  {showCategoryDropdown && (
                    <View style={styles.dropdownList}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity 
                          key={cat} 
                          style={styles.dropdownOption}
                          onPress={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Faculty Dropdown */}
                <View style={[styles.formCol, { flex: 1.2 }]}>
                  <Text style={styles.label}>Target Faculty</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setShowFacultyDropdown(!showFacultyDropdown)}
                  >
                    <Text style={{ color: facultyId ? '#1A1D20' : '#A0A0A0' }} numberOfLines={1}>
                      {facultyId 
                        ? faculties.find(f => f.id === parseInt(facultyId))?.name || 'Selected'
                        : 'All Faculties'
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#6F767E" />
                  </TouchableOpacity>
                  {showFacultyDropdown && (
                    <View style={styles.dropdownList}>
                      <TouchableOpacity 
                        style={styles.dropdownOption}
                        onPress={() => {
                          setFacultyId('');
                          setShowFacultyDropdown(false);
                        }}
                      >
                        <Text style={[styles.dropdownOptionText, { color: '#00695C' }]}>All Faculties</Text>
                      </TouchableOpacity>
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
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>Uploaded By (Lecturer)</Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger}
                  onPress={() => setShowLecturerDropdown(!showLecturerDropdown)}
                >
                  <Text style={{ color: uploadedByLecturerId ? '#1A1D20' : '#A0A0A0' }}>
                    {uploadedByLecturerId 
                      ? lecturers.find(l => l.id === parseInt(uploadedByLecturerId))?.full_name || 'Selected'
                      : 'University Admin'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6F767E" />
                </TouchableOpacity>
                {showLecturerDropdown && (
                  <View style={styles.dropdownList}>
                    <TouchableOpacity 
                      style={styles.dropdownOption}
                      onPress={() => {
                        setUploadedByLecturerId('');
                        setShowLecturerDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, { color: '#00695C' }]}>University Admin</Text>
                    </TouchableOpacity>
                    {lecturers.map((lec) => (
                      <TouchableOpacity 
                        key={lec.id} 
                        style={styles.dropdownOption}
                        onPress={() => {
                          setUploadedByLecturerId(lec.id.toString());
                          setShowLecturerDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{lec.full_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Document Picker Simulation */}
              <View style={styles.formCol}>
                <Text style={styles.label}>Study Material File (URL/Attachment)</Text>
                <View style={styles.uploadRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={fileUrl}
                    onChangeText={setFileUrl}
                    placeholder="Enter manual link or attach local file"
                    placeholderTextColor="#A0A0A0"
                  />
                  <TouchableOpacity 
                    style={styles.uploadBtn} 
                    onPress={handlePickDocument}
                    disabled={pickingDocument}
                    activeOpacity={0.8}
                  >
                    {pickingDocument ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons name="cloud-upload" size={18} color="white" />
                        <Text style={styles.uploadBtnText}>Browse</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.formCol, { marginTop: 12 }]}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Summarize course material, topics, or instructions..."
                  placeholderTextColor="#A0A0A0"
                  multiline={true}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveResource}>
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
  filterBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  filterField: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  filterTag: {
    backgroundColor: '#F4F5F6',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTagActive: {
    backgroundColor: '#5B3CC2',
    borderColor: '#5B3CC2',
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6F767E',
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A1D20',
  },
  catBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  linkText: {
    color: '#1565C0',
    textDecorationLine: 'underline',
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
  uploadRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#5B3CC2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  uploadBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
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
