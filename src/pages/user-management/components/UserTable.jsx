import React from 'react';
import Icon from '../../../components/AppIcon';

const UserTable = ({ users, onEdit, onDeactivate, onReactivate, onResetPassword }) => {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      case 'dg': case'minister':
        return 'bg-primary/10 text-primary';
      case 'department_user':
        return 'bg-accent/10 text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatRole = (role) => {
    return role?.replace('_', ' ')?.toUpperCase();
  };

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
              User
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Department
            </th>
            <th className="text-left px-6 py-4 text-sm font-body font-semibold text-foreground">
              Role
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
          {users?.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Icon name="Users" size={48} className="text-muted-foreground" />
                  <p className="text-muted-foreground font-body">No users found</p>
                </div>
              </td>
            </tr>
          ) : (
            users?.map((user) => (
              <tr key={user?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-foreground">
                        {user?.fullName}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-foreground">
                    {user?.department?.name || 'Not assigned'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body font-medium ${getRoleBadgeColor(user?.role)}`}>
                    {formatRole(user?.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                    user?.isActive
                      ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      user?.isActive ? 'bg-success' : 'bg-muted-foreground'
                    }`}></span>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-muted-foreground">
                    {formatDate(user?.createdAt)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
                      title="Edit user"
                    >
                      <Icon name="Edit" size={16} strokeWidth={2} />
                    </button>
                    {user?.isActive ? (
                      <button
                        onClick={() => onDeactivate(user?.id)}
                        className="p-2 rounded-lg text-warning hover:bg-warning/10 transition-smooth hover-lift press-scale"
                        title="Deactivate user"
                      >
                        <Icon name="UserX" size={16} strokeWidth={2} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onReactivate(user?.id)}
                        className="p-2 rounded-lg text-success hover:bg-success/10 transition-smooth hover-lift press-scale"
                        title="Reactivate user"
                      >
                        <Icon name="UserCheck" size={16} strokeWidth={2} />
                      </button>
                    )}
                    <button
                      onClick={() => onResetPassword(user?.id)}
                      className="p-2 rounded-lg text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
                      title="Reset password"
                    >
                      <Icon name="Key" size={16} strokeWidth={2} />
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

export default UserTable;