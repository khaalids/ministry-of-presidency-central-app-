import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EditMinistryModal = ({ ministry, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: ministry?.name || '',
    code: ministry?.code || '',
    description: ministry?.description || '',
    isActive: ministry?.isActive ?? true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onUpdate(ministry?.id, formData);
    } catch (err) {
      setError(err?.message || 'Failed to update ministry');
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
            Edit Ministry
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
                Ministry Name *
              </label>
              <input
                type="text"
                value={formData?.name}
                onChange={(e) => handleChange('name', e?.target?.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter ministry name"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Ministry Code
              </label>
              <input
                type="text"
                value={formData?.code}
                onChange={(e) => handleChange('code', e?.target?.value.toUpperCase())}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter ministry code (optional)"
              />
              <p className="text-xs text-muted-foreground mt-1">A unique code to identify the ministry</p>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleChange('description', e?.target?.value)}
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Enter ministry description (optional)"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={(e) => handleChange('isActive', e?.target?.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-sm font-body text-foreground">Active Ministry</span>
              </label>
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
              {isSubmitting ? 'Updating...' : 'Update Ministry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMinistryModal;

