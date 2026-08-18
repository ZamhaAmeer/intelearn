import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Edit3, Trash2, X, AlertCircle } from 'lucide-react';

export default function Lecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modals controllers
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, lecturer: null });

  // Form Field states
  const [editId, setEditId] = useState(null); // null for create
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const [lecRes, facRes] = await Promise.all([
        axios.get(`/api/admin/lecturers?search=${query}`),
        axios.get('/api/admin/faculties')
      ]);
      setLecturers(lecRes.data);
      setFaculties(facRes.data);
    } catch (err) {
      console.error('Failed to load lecturers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (val) => {
    setSearchVal(val);
    loadData(val);
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setEmployeeId('');
    setFullName('');
    setEmail('');
    setPhone('');
    setFacultyId('');
    setDepartment('');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (lecturer) => {
    setEditId(lecturer.id);
    setEmployeeId(lecturer.employee_id);
    setFullName(lecturer.full_name);
    setEmail(lecturer.email);
    setPhone(lecturer.phone || '');
    setFacultyId(lecturer.faculty_id?.toString() || '');
    setDepartment(lecturer.department || '');
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!employeeId.trim() || !fullName.trim() || !email.trim()) {
      setFormError('Employee ID, Full Name, and Email are required.');
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
      if (editId) {
        await axios.put(`/api/admin/lecturers/${editId}`, payload);
      } else {
        await axios.post('/api/admin/lecturers', payload);
      }
      setFormOpen(false);
      loadData(searchVal);
    } catch (err) {
      console.error('Save lecturer error:', err);
      setFormError(err.response?.data?.error || 'Database submission failed.');
    }
  };

  const handleDelete = async () => {
    const lecturer = deleteDialog.lecturer;
    if (!lecturer) return;

    try {
      await axios.delete(`/api/admin/lecturers/${lecturer.id}`);
      setDeleteDialog({ isOpen: false, lecturer: null });
      loadData(searchVal);
    } catch (err) {
      console.error('Delete lecturer error:', err);
      alert('Failed to remove lecturer profile.');
    }
  };

  // DataTable Configs
  const headers = [
    { title: 'Employee ID', width: '120px' },
    { title: 'Full Name', width: '180px' },
    { title: 'Email Address', width: '220px' },
    { title: 'Phone Number', width: '140px' },
    { title: 'Assigned Faculty', width: '180px' },
    { title: 'Department', width: '180px' },
    { title: 'Actions', width: '100px' }
  ];

  const renderLecturerRow = (lecturer) => {
    return (
      <>
        <td style={{ fontWeight: 'bold' }}>{lecturer.employee_id}</td>
        <td>{lecturer.full_name}</td>
        <td>{lecturer.email}</td>
        <td>{lecturer.phone || 'N/A'}</td>
        <td>{lecturer.faculty_name || 'Unassigned'}</td>
        <td>{lecturer.department || 'N/A'}</td>
        <td>
          <div className="table-actions">
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              onClick={() => handleOpenEdit(lecturer)}
              title="Edit Profile"
            >
              <Edit3 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
              onClick={() => setDeleteDialog({ isOpen: true, lecturer })}
              title="Delete Profile"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <div>
      <DataTable
        headers={headers}
        data={lecturers}
        renderRow={renderLecturerRow}
        searchVal={searchVal}
        onSearchChange={handleSearch}
        searchPlaceholder="Search lecturers by name, ID or email..."
        onAddPress={handleOpenCreate}
        addButtonText="Register Lecturer"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Lecturer Profile' : 'Register New Lecturer'}</h3>
              <button className="modal-close-btn" onClick={() => setFormOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <div className="alert-banner alert-banner-error" style={{ marginBottom: '16px' }}>
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Employee ID*</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. L005"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name*</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Mrs. Jane Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address*</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      placeholder="e.g. janesmith@ms.sab.ac.lk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. +94771234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Faculty Assignment</label>
                    <select 
                      className="input-field"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                    >
                      <option value="">Choose Faculty</option>
                      {faculties.map(fac => (
                        <option key={fac.id} value={fac.id}>{fac.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Computing Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Register Lecturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Remove Lecturer Record"
        message={`Are you sure you want to permanently delete the profile of lecturer ${deleteDialog.lecturer?.full_name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, lecturer: null })}
      />
    </div>
  );
}
