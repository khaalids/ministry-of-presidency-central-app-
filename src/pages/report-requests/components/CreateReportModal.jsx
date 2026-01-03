import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CreateReportModal = ({ departments, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    departmentId: '',
    title: '',
    description: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!formData?.title?.trim()) {
      setError('Report title is required');
      return;
    }

    if (!formData?.departmentId) {
      setError('Please select a department');
      return;
    }

    try {
      setLoading(true);
      await onCreate(formData);
    } catch (err) {
      setError(err?.message || 'Failed to create report request');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments?.map(dept => ({
    value: dept?.id,
    label: dept?.name
  })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-warm-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground">Request New Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <Select
            label="Department"
            required
            options={departmentOptions}
            value={formData?.departmentId}
            onChange={(value) => setFormData({ ...formData, departmentId: value })}
            placeholder="Select department"
          />

          <Input
            label="Report Title"
            required
            value={formData?.title}
            onChange={(e) => setFormData({ ...formData, title: e?.target?.value })}
            placeholder="Enter report title"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
              placeholder="Enter report description and requirements"
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
            />
          </div>

          <Input
            label="Due Date (Optional)"
            type="datetime-local"
            value={formData?.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e?.target?.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              iconName="FileText"
              iconPosition="left"
              fullWidth
            >
              Request Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;