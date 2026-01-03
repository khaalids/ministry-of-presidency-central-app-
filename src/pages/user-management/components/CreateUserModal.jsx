import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CreateUserModal = ({ departments, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'department_user',
    departmentId: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onCreate(formData);
    } catch (err) {
      setError(err?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData?.fullName}
                onChange={(e) => handleChange('fullName', e?.target?.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData?.email}
                onChange={(e) => handleChange('email', e?.target?.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData?.password}
                onChange={(e) => handleChange('password', e?.target?.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Role *
              </label>
              <select
                value={formData?.role}
                onChange={(e) => handleChange('role', e?.target?.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="department_user">Department User</option>
                <option value="dg">DG</option>
                <option value="minister">Minister</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Department
              </label>
              <select
                value={formData?.departmentId}
                onChange={(e) => handleChange('departmentId', e?.target?.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No department</option>
                {departments?.map(dept => (
                  <option key={dept?.id} value={dept?.id}>{dept?.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-body font-medium text-foreground hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-body font-medium hover:bg-primary/90 transition-smooth hover-lift press-scale disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;