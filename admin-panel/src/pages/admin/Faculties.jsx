import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Edit3, Trash2, X, AlertCircle, Building2 } from 'lucide-react';

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modals controllers
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, faculty: null });
  const [infoModal, setInfoModal] = useState({ isOpen: false, faculty: null });

  // Form Field states
  const [editId, setEditId] = useState(null); // null for create
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [dean, setDean] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const loadFaculties = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/faculties');
      setFaculties(res.data);
    } catch (err) {
      console.error('Failed to load faculties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculties();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setName('');
    setCode('');
    setDean('');
    setDescription('');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (faculty) => {
    setEditId(faculty.id);
    setName(faculty.name);
    setCode(faculty.code);
    setDean(faculty.dean || '');
    setDescription(faculty.description || '');
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setFormError('Faculty Name and Code are required.');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      dean: dean.trim() || null,
      description: description.trim() || null
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/faculties/${editId}`, payload);
      } else {
        await axios.post('/api/admin/faculties', payload);
      }
      setFormOpen(false);
      loadFaculties();
    } catch (err) {
      console.error('Save faculty error:', err);
      setFormError(err.response?.data?.error || 'Database submission failed.');
    }
  };

  const handleDelete = async () => {
    const faculty = deleteDialog.faculty;
    if (!faculty) return;

    try {
      await axios.delete(`/api/admin/faculties/${faculty.id}`);
      setDeleteDialog({ isOpen: false, faculty: null });
      loadFaculties();
    } catch (err) {
      console.error('Delete faculty error:', err);
      alert('Failed to remove faculty. Note: Cannot delete faculty with active students/lecturers unless restricted.');
    }
  };

  // DataTable headers
  const headers = [
    { title: 'Faculty Code', width: '120px' },
    { title: 'Faculty Name', width: '280px' },
    { title: 'Dean / Chair', width: '220px' },
    { title: 'Description Summary', width: '400px' },
    { title: 'Actions', width: '120px' }
  ];

  const renderFacultyRow = (faculty) => {
    return (
      <>
        <td style={{ fontWeight: 'bold' }}>
          <span className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '12px' }}>
            {faculty.code}
          </span>
        </td>
        <td style={{ fontWeight: '600' }}>{faculty.name}</td>
        <td>{faculty.dean || 'Unassigned'}</td>
        <td style={{ color: 'var(--text-muted)' }}>
          {faculty.description ? (
            faculty.description.length > 80 ? `${faculty.description.slice(0, 80)}...` : faculty.description
          ) : 'No description provided.'}
        </td>
        <td>
          <div className="table-actions">
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#e8e3fa', color: 'var(--primary)' }}
              onClick={() => setInfoModal({ isOpen: true, faculty })}
              title="Faculty Information Sheet"
            >
              <Building2 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              onClick={() => handleOpenEdit(faculty)}
              title="Edit Details"
            >
              <Edit3 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
              onClick={() => setDeleteDialog({ isOpen: true, faculty })}
              title="Delete Faculty"
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
        data={faculties}
        renderRow={renderFacultyRow}
        onAddPress={handleOpenCreate}
        addButtonText="Add Faculty"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Faculty details' : 'Register New Faculty'}</h3>
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
                  <div className="form-group" style={{ flex: '2' }}>
                    <label className="form-label">Faculty Name*</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Faculty of Applied Sciences"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: '1' }}>
                    <label className="form-label">Faculty Code*</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. FAS"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dean / Head of Faculty</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Prof. J.K. Wijerathne"
                    value={dean}
                    onChange={(e) => setDean(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description Summary</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Describe the department structures and focus fields..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Create Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACULTY SHEET DETAILED MODAL */}
      {infoModal.isOpen && infoModal.faculty && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{infoModal.faculty.name} Details</h3>
              <button className="modal-close-btn" onClick={() => setInfoModal({ isOpen: false, faculty: null })}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Code</strong>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '2px' }}>
                  {infoModal.faculty.code}
                </div>
              </div>
              
              <div>
                <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dean</strong>
                <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '2px' }}>
                  {infoModal.faculty.dean || 'No dean assigned.'}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description Summary</strong>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                  {infoModal.faculty.description || 'No description summary available.'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setInfoModal({ isOpen: false, faculty: null })}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Faculty Setup"
        message={`Are you sure you want to permanently delete ${deleteDialog.faculty?.name} (${deleteDialog.faculty?.code})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, faculty: null })}
      />
    </div>
  );
}
