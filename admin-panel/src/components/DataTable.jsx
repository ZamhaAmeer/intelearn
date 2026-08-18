import React from 'react';
import { Search, Plus, XCircle, FileSpreadsheet } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function DataTable({ 
  headers = [], 
  data = [], 
  renderRow, 
  searchVal, 
  onSearchChange, 
  searchPlaceholder = 'Search records...', 
  onAddPress, 
  addButtonText = 'Add New',
  isLoading = false 
}) {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Action Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        {onSearchChange && (
          <div className="input-wrapper" style={{ flex: '1', minWidth: '240px', maxWidth: '400px' }}>
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="input-field"
              placeholder={searchPlaceholder}
              value={searchVal}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchVal && (
              <button 
                type="button" 
                className="eye-toggle" 
                onClick={() => onSearchChange('')}
                style={{ padding: '4px' }}
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        )}

        {onAddPress && (
          <button className="btn btn-primary" onClick={onAddPress}>
            <Plus size={18} />
            <span>{addButtonText}</span>
          </button>
        )}
      </div>

      {/* Grid viewport wrapper */}
      <div className="table-responsive" style={{ border: 'none', borderRadius: '0' }}>
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, idx) => {
                const title = typeof header === 'object' ? header.title : header;
                const width = typeof header === 'object' ? header.width : undefined;
                return (
                  <th key={idx} style={{ width }}>
                    {title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length}>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <LoadingSpinner size="30px" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '50px 0', color: 'var(--text-muted)' }}>
                    <FileSpreadsheet size={40} strokeWidth={1.5} />
                    <span>No matching records found.</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr 
                  key={item.id || index}
                  style={index % 2 === 1 ? { backgroundColor: '#fafbfc' } : undefined}
                >
                  {renderRow(item, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
