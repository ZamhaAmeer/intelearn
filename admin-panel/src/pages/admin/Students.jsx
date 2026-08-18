import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Eye, Edit3, Trash2, X, AlertCircle } from 'lucide-react';

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  
  // Modal controllers
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, student: null });

  // Student Form states
  const [editId, setEditId] = useState(null); // null for create
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('');
  const [gpa, setGpa] = useState('');
  const [semester, setSemester] = useState('1');
  const [status, setStatus] = useState('Active');
  const [formError, setFormError] = useState('');

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const [stdRes, facRes] = await Promise.all([
        axios.get(`/api/admin/students?search=${query}`),
        axios.get('/api/admin/faculties')
      ]);
      setStudents(stdRes.data);
      setFaculties(facRes.data);
    } catch (err) {
      console.error('Failed to load students directory:', err);
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
    setStudentId('');
    setFullName('');
    setEmail('');
    setPhone('');
    setFacultyId('');
    setDepartment('');
    setGpa('');
    setSemester('1');
    setStatus('Active');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditId(student.id);
    setStudentId(student.student_id);
    setFullName(student.full_name);
    setEmail(student.email);
    setPhone(student.phone || '');
    setFacultyId(student.faculty_id?.toString() || '');
    setDepartment(student.department || '');
    setGpa(student.gpa?.toString() || '0.00');
    setSemester(student.current_semester?.toString() || '1');
    setStatus(student.status || 'Active');
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!studentId.trim() || !fullName.trim() || !email.trim()) {
      setFormError('Student ID, Full Name, and Email are required.');
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
      status
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/students/${editId}`, payload);
      } else {
        await axios.post('/api/admin/students', payload);
      }
      setFormOpen(false);
      loadData(searchVal);
    } catch (err) {
      console.error('Save error:', err);
      setFormError(err.response?.data?.error || 'Database submission failed.');
    }
  };

  const handleDelete = async () => {
    const student = deleteDialog.student;
    if (!student) return;

    try {
      await axios.delete(`/api/admin/students/${student.id}`);
      setDeleteDialog({ isOpen: false, student: null });
      loadData(searchVal);
    } catch (err) {
      console.error('Delete student error:', err);
      alert('Failed to delete student.');
    }
  };

  // DataTable Configs
  const headers = [
    { title: 'Student ID', width: '120px' },
    { title: 'Full Name', width: '180px' },
    { title: 'Email Address', width: '200px' },
    { title: 'Faculty', width: '165px' },
    { title: 'Department', width: '165px' },
    { title: 'GPA', width: '80px' },
    { title: 'Semester', width: '90px' },
    { title: 'Status', width: '100px' },
    { title: 'Actions', width: '120px' }
  ];

  const renderStudentRow = (student) => {
    let statusClass = 'badge badge-success';
    if (student.status === 'Suspended') statusClass = 'badge badge-error';
    if (student.status === 'Graduated') statusClass = 'badge badge-neutral';

    return (
      <>
        <td style={{ fontWeight: 'bold' }}>{student.student_id}</td>
        <td>{student.full_name}</td>
        <td>{student.email}</td>
        <td>{student.faculty_name || 'Unassigned'}</td>
        <td>{student.department || 'N/A'}</td>
        <td style={{ fontWeight: '600' }}>{parseFloat(student.gpa).toFixed(2)}</td>
        <td style={{ textAlign: 'center' }}>Sem {student.current_semester}</td>
        <td>
          <span className={statusClass}>{student.status}</span>
        </td>
        <td>
          <div className="table-actions">
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}
              onClick={() => navigate(`/admin/students/${student.id}`)}
              title="View Profile Details"
            >
              <Eye size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              onClick={() => handleOpenEdit(student)}
              title="Edit Profile"
            >
              <Edit3 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
              onClick={() => setDeleteDialog({ isOpen: true, student })}
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
        data={students}
        renderRow={renderStudentRow}
        searchVal={searchVal}
        onSearchChange={handleSearch}
        searchPlaceholder="Search student by name, ID, or email..."
        onAddPress={handleOpenCreate}
        addButtonText="Register Student"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal-overlay">
          <form onSubmit={handleSave} className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Student Profile' : 'Register New Student'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setFormOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {formError && (
                <div className="alert-banner alert-banner-error" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student ID*</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. 22FIS0574"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name*</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Mathusa K."
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
                    placeholder="e.g. mathusa@ms.sab.ac.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. +94761122334"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Faculty Setup</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department / Major</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Computing System"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GPA Score</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                    placeholder="0.00"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Semester</label>
                  <select 
                    className="input-field"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {['1','2','3','4','5','6','7','8'].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="input-field"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editId ? 'Save Changes' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Student Profile"
        message={`Are you sure you want to permanently remove student ${deleteDialog.student?.full_name} (${deleteDialog.student?.student_id})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, student: null })}
      />
    </div>
  );
}
