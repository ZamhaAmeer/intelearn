import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Edit3, Trash2, X, AlertCircle, Link, FileText } from 'lucide-react';

export default function LearningResources() {
  const [resources, setResources] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modals controllers
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, resource: null });

  // Form Field states
  const [editId, setEditId] = useState(null); // null for create
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [fileUrl, setFileUrl] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const [resRes, facRes] = await Promise.all([
        axios.get(`/api/admin/resources?search=${query}`),
        axios.get('/api/admin/faculties')
      ]);
      setResources(resRes.data);
      setFaculties(facRes.data);
    } catch (err) {
      console.error('Failed to load learning resources:', err);
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
    setDescription('');
    setCategory('Lecture Notes');
    setFileUrl('');
    setFacultyId('');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (resource) => {
    setEditId(resource.id);
    setTitle(resource.title);
    setDescription(resource.description || '');
    setCategory(resource.category || 'Lecture Notes');
    setFileUrl(resource.file_url || '');
    setFacultyId(resource.faculty_id?.toString() || '');
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      setFormError('Title and Category are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      file_url: fileUrl.trim() || null,
      faculty_id: facultyId ? parseInt(facultyId) : null
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/resources/${editId}`, payload);
      } else {
        await axios.post('/api/admin/resources', payload);
      }
      setFormOpen(false);
      loadData(searchVal);
    } catch (err) {
      console.error('Save resource error:', err);
      setFormError(err.response?.data?.error || 'Database submission failed.');
    }
  };

  const handleDelete = async () => {
    const resource = deleteDialog.resource;
    if (!resource) return;

    try {
      await axios.delete(`/api/admin/resources/${resource.id}`);
      setDeleteDialog({ isOpen: false, resource: null });
      loadData(searchVal);
    } catch (err) {
      console.error('Delete resource error:', err);
      alert('Failed to remove resource.');
    }
  };

  // DataTable headers
  const headers = [
    { title: 'Resource Title', width: '280px' },
    { title: 'Category', width: '150px' },
    { title: 'Assigned Faculty', width: '180px' },
    { title: 'File Link', width: '200px' },
    { title: 'Description', width: '300px' },
    { title: 'Actions', width: '100px' }
  ];

  const renderResourceRow = (res) => {
    return (
      <>
        <td style={{ fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--primary)" />
            <span>{res.title}</span>
          </div>
        </td>
        <td>
          <span className="badge badge-neutral">{res.category}</span>
        </td>
        <td>{res.faculty_name || 'General / All'}</td>
        <td>
          {res.file_url ? (
            <a 
              href={res.file_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}
            >
              <Link size={12} />
              <span style={{ fontSize: '12px' }}>Download Material</span>
            </a>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No link provided</span>
          )}
        </td>
        <td style={{ color: 'var(--text-muted)' }}>{res.description || 'None.'}</td>
        <td>
          <div className="table-actions">
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              onClick={() => handleOpenEdit(res)}
              title="Edit Resource"
            >
              <Edit3 size={14} />
            </button>
            <button 
              className="action-btn" 
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
              onClick={() => setDeleteDialog({ isOpen: true, resource: res })}
              title="Delete Resource"
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
        data={resources}
        renderRow={renderResourceRow}
        searchVal={searchVal}
        onSearchChange={handleSearch}
        searchPlaceholder="Search materials by title or category..."
        onAddPress={handleOpenCreate}
        addButtonText="Upload Material"
        isLoading={loading}
      />

      {/* CREATE & EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Material Details' : 'Upload Study Material'}</h3>
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
                  <label className="form-label">Material Title*</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Intro to Data Structures"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category Type*</label>
                    <select 
                      className="input-field"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Lecture Notes">Lecture Notes</option>
                      <option value="Video Tutorials">Video Tutorials</option>
                      <option value="Textbooks">Textbooks</option>
                      <option value="Past Papers">Past Papers</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Linked Faculty</label>
                    <select 
                      className="input-field"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                    >
                      <option value="">General / All</option>
                      {faculties.map(fac => (
                        <option key={fac.id} value={fac.id}>{fac.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Study Document File URL</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="e.g. http://intelearn.edu.lk/materials/basics.pdf"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description Summary</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Briefly summarize syllabus coverage of the uploaded document..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Study Material"
        message={`Are you sure you want to permanently delete the learning resource "${deleteDialog.resource?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, resource: null })}
      />
    </div>
  );
}
