import React from 'react';
import Icon from '../../../components/AppIcon';

const MinistryTable = ({ ministries, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Ministry Name
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Code
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Description
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Created
            </th>
            <th className="text-right px-6 py-4 text-sm font-body font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {ministries?.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Icon name="Building2" size={48} className="text-muted-foreground" />
                  <p className="text-muted-foreground font-body">No ministries found</p>
                </div>
              </td>
            </tr>
          ) : (
            ministries?.map((ministry) => (
              <tr key={ministry?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-foreground">
                        {ministry?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-foreground">
                    {ministry?.code || 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-muted-foreground max-w-md truncate">
                    {ministry?.description || 'No description'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                    ministry?.isActive
                      ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ministry?.isActive ? 'bg-success' : 'bg-muted-foreground'
                    }`}></span>
                    {ministry?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-muted-foreground">
                    {formatDate(ministry?.createdAt)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(ministry)}
                      className="p-2 rounded-lg text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
                      title="Edit ministry"
                    >
                      <Icon name="Edit" size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${ministry?.name}"? This action cannot be undone.`)) {
                          onDelete(ministry?.id);
                        }
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-smooth hover-lift press-scale"
                      title="Delete ministry"
                    >
                      <Icon name="Trash2" size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MinistryTable;

