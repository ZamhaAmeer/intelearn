import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Edit3, Trash2, X, AlertCircle, Megaphone, Calendar } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modals controllers
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, announcement: null });

  // Form Field states
  const [editId, setEditId] = useState(null); // null for create
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All'); // 'All', 'Students', 'Lecturers', 'Faculty-specific'
  const [facultyId, setFacultyId] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const [annRes, facRes] = await Promise.all([
        axios.get('/api/admin/announcements'),
        axios.get('/api/admin/faculties')
      ]);
      
      // Filter list locally for search value
      const list = query.trim() 
        ? annRes.data.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase()))
        : annRes.data;

      setAnnouncements(list);
      setFaculties(facRes.data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
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
    setTitle('');
    setContent('');
    setAudience('All');
    setFacultyId('');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setAudience(ann.target_audience || 'All');
    setFacultyId(ann.faculty_id?.toString() || '');
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError('Title and Notice content are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      target_audience: audience,
      faculty_id: audience === 'Faculty-specific' && facultyId ? parseInt(facultyId) : null
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/announcements/${editId}`, payload);
      } else {
        await axios.post('/api/admin/announcements', payload);
      }
      setFormOpen(false);
      loadData(searchVal);
    } catch (err) {
      console.error('Save announcement error:', err);
      setFormError(err.response?.data?.error || 'Database submission failed.');
    }
  };

  const handleDelete = async () => {
    const announcement = deleteDialog.announcement;
    if (!announcement) return;

    try {
      await axios.delete(`/api/admin/announcements/${announcement.id}`);
      setDeleteDialog({ isOpen: false, announcement: null });
      loadData(searchVal);
    } catch (err) {
      console.error('Delete announcement error:', err);
      alert('Failed to remove announcement.');
    }
  };

  // DataTable headers
  const headers = [
    { title: 'Title & Summary', width: '320px' },
    { title: 'Audience Group', width: '150px' },
    { title: 'Faculty', width: '180px' },
    { title: 'Published By', width: '185px' },
    { title: 'Date Posted', width: '180px' },
    { title: 'Actions', width: '100px' }
  ];

  const renderAnnouncementRow = (ann) => {
    return (
      <>
        <td style={{ fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '14px' }}>{ann.title}</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400', marginTop: '2px', lineHeight: '1.4' }}>
                {ann.content.length > 70 ? `${ann.content.slice(0, 70)}...` : ann.content}
              </p>
            </div>
          </div>
        </td>
        <td>
          <span className="badge badge-neutral">{ann.target_audience}</span>
        </td>
        <td>{ann.faculty_name || 'General / All'}</td>
        <td>{ann.published_by_name || 'System Admin'}</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Calendar size={12} />
            <span>{new Date(ann.created_at).toLocaleDateString()}</span>
          </div>
        </td>
        <td>
          <div className="table-actions">
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              onClick={() => handleOpenEdit(ann)}
              title="Edit Announcement"
            >
              <Edit3 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
              onClick={() => setDeleteDialog({ isOpen: true, announcement: ann })}
              title="Delete Announcement"
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
        data={announcements}
        renderRow={renderAnnouncementRow}
        searchVal={searchVal}
        onSearchChange={handleSearch}
        searchPlaceholder="Search notices by title or content..."
        onAddPress={handleOpenCreate}
        addButtonText="Publish Notice"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Announcement Details' : 'Publish New Notice'}</h3>
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

                <div className="form-group">
                  <label className="form-label">Notice Title*</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. End-Semester Examination FAS"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Audience Group*</label>
                    <select 
                      className="input-field"
                      value={audience}
                      onChange={(e) => {
                        setAudience(e.target.value);
                        if (e.target.value !== 'Faculty-specific') setFacultyId('');
                      }}
                    >
                      <option value="All">All Portal Users</option>
                      <option value="Students">Students Only</option>
                      <option value="Lecturers">Lecturers Only</option>
                      <option value="Faculty-specific">Faculty-Specific</option>
                    </select>
                  </div>

                  {audience === 'Faculty-specific' && (
                    <div className="form-group">
                      <label className="form-label">Select Faculty Target*</label>
                      <select 
                        className="input-field"
                        value={facultyId}
                        onChange={(e) => setFacultyId(e.target.value)}
                        required
                      >
                        <option value="">Choose Faculty</option>
                        {faculties.map(fac => (
                          <option key={fac.id} value={fac.id}>{fac.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Notice Contents*</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Type notice message details..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Announcement"
        message={`Are you sure you want to permanently delete the notice "${deleteDialog.announcement?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, announcement: null })}
      />
    </div>
  );
}
