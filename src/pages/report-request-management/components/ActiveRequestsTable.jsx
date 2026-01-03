import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveRequestsTable = ({ reports, departments, onUpdate, onDelete }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedReports = [...(reports || [])]?.sort((a, b) => {
    const aVal = a?.[sortField];
    const bVal = b?.[sortField];
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedReports?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = sortedReports?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    const colors = {
      requested: 'bg-warning/10 text-warning border-warning',
      in_progress: 'bg-accent/10 text-accent border-accent',
      submitted: 'bg-secondary/10 text-secondary border-secondary',
      approved: 'bg-success/10 text-success border-success'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getStatusLabel = (status) => {
    const labels = {
      requested: 'Draft',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      approved: 'Completed'
    };
    return labels?.[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-muted-foreground',
      medium: 'text-warning',
      high: 'text-destructive'
    };
    return colors?.[priority] || 'text-muted-foreground';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRowSelect = (reportId) => {
    setSelectedRows(prev => 
      prev?.includes(reportId) 
        ? prev?.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows?.length === paginatedReports?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedReports?.map(r => r?.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedRows?.length === 0) return;
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedRows?.length} selected requests?`)) {
        selectedRows?.forEach(id => onDelete(id));
        setSelectedRows([]);
      }
    }
  };

  const handleInlineEdit = (reportId, field, value) => {
    onUpdate(reportId, { [field]: value });
    setEditingId(null);
  };

  const SortableHeader = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/30 transition-smooth"
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          <Icon
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
            size={14}
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted/30 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Active Requests</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {reports?.length || 0} total requests
            </p>
          </div>
          {selectedRows?.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedRows?.length} selected
              </span>
              <Button
                onClick={() => handleBulkAction('delete')}
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows?.length === paginatedReports?.length && paginatedReports?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <SortableHeader field="id">Request ID</SortableHeader>
              <SortableHeader field="departmentId">Department</SortableHeader>
              <SortableHeader field="title">Template Type</SortableHeader>
              <SortableHeader field="createdAt">Submission Date</SortableHeader>
              <SortableHeader field="dueDate">Deadline</SortableHeader>
              <SortableHeader field="status">Progress Status</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedReports?.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No requests found</p>
                </td>
              </tr>
            ) : (
              paginatedReports?.map((report) => {
                const daysUntil = getDaysUntilDeadline(report?.dueDate);
                const isOverdue = daysUntil !== null && daysUntil < 0;
                const isUrgent = daysUntil !== null && daysUntil <= 3 && daysUntil >= 0;

                return (
                  <tr key={report?.id} className="hover:bg-muted/20 transition-smooth">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows?.includes(report?.id)}
                        onChange={() => handleRowSelect(report?.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono text-foreground">
                        #{report?.id?.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-foreground">
                        {report?.department?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {editingId === report?.id ? (
                        <input
                          type="text"
                          defaultValue={report?.title}
                          onBlur={(e) => handleInlineEdit(report?.id, 'title', e?.target?.value)}
                          onKeyDown={(e) => {
                            if (e?.key === 'Enter') {
                              handleInlineEdit(report?.id, 'title', e?.target?.value);
                            }
                          }}
                          className="px-2 py-1 bg-background border border-border rounded text-sm"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{report?.title}</span>
                          <button
                            onClick={() => setEditingId(report?.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Icon name="Edit2" size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(report?.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          isOverdue ? 'text-destructive font-medium' : isUrgent ?'text-warning font-medium': 'text-muted-foreground'
                        }`}>
                          {formatDate(report?.dueDate)}
                        </span>
                        {isOverdue && (
                          <Icon name="AlertCircle" size={14} className="text-destructive" />
                        )}
                        {isUrgent && (
                          <Icon name="Clock" size={14} className="text-warning" />
                        )}
                      </div>
                      {daysUntil !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                           `${daysUntil} days left`}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        getStatusColor(report?.status)
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {getStatusLabel(report?.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdate(report?.id, { status: 'in_progress' })}
                          className="p-1.5 hover:bg-muted rounded transition-smooth"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setEditingId(report?.id)}
                          className="p-1.5 hover:bg-muted rounded transition-smooth"
                          title="Edit"
                        >
                          <Icon name="Edit" size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => onDelete(report?.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded transition-smooth"
                          title="Delete"
                        >
                          <Icon name="Trash2" size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-muted/20 px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedReports?.length)} of {sortedReports?.length} requests
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm transition-smooth ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRequestsTable;