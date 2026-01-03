import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { departmentService } from '../../../services/departmentService';

const CreateTaskModal = ({ departments, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToDepartment: '',
    assignedToUser: '',
    priority: 'medium',
    dueDate: ''
  });
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData?.assignedToDepartment) {
      loadDepartmentUsers(formData?.assignedToDepartment);
    } else {
      setDepartmentUsers([]);
      setFormData(prev => ({ ...prev, assignedToUser: '' }));
    }
  }, [formData?.assignedToDepartment]);

  const loadDepartmentUsers = async (departmentId) => {
    try {
      const users = await departmentService?.getDepartmentUsers(departmentId);
      setDepartmentUsers(users);
    } catch (err) {
      console.error('Failed to load department users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!formData?.title?.trim()) {
      setError('Task title is required');
      return;
    }

    if (!formData?.assignedToDepartment) {
      setError('Please select a department');
      return;
    }

    try {
      setLoading(true);
      await onCreate(formData);
    } catch (err) {
      setError(err?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments?.map(dept => ({
    value: dept?.id,
    label: dept?.name
  })) || [];

  const userOptions = departmentUsers?.map(user => ({
    value: user?.id,
    label: user?.fullName
  })) || [];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-warm-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground">Assign New Task</h2>
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

          <Input
            label="Task Title"
            required
            value={formData?.title}
            onChange={(e) => setFormData({ ...formData, title: e?.target?.value })}
            placeholder="Enter task title"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
            />
          </div>

          <Select
            label="Assign to Department"
            required
            options={departmentOptions}
            value={formData?.assignedToDepartment}
            onChange={(value) => setFormData({ ...formData, assignedToDepartment: value })}
            placeholder="Select department"
          />

          {departmentUsers?.length > 0 && (
            <Select
              label="Assign to Specific User (Optional)"
              options={userOptions}
              value={formData?.assignedToUser}
              onChange={(value) => setFormData({ ...formData, assignedToUser: value })}
              placeholder="Select user (optional)"
              clearable
            />
          )}

          <Select
            label="Priority"
            required
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => setFormData({ ...formData, priority: value })}
          />

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
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Assign Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;