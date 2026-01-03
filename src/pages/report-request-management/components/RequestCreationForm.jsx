import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestCreationForm = ({ departments, selectedTemplate, onTemplateSelect, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    priority: 'medium',
    dueDate: '',
    description: '',
    attachments: []
  });
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Apply template data when selected
  React.useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        title: selectedTemplate?.title || '',
        description: selectedTemplate?.description || ''
      }));
    }
  }, [selectedTemplate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = Array.from(e?.dataTransfer?.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev?.attachments, ...files?.map(f => f?.name)]
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev?.attachments, ...files?.map(f => f?.name)]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev?.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData?.title || !formData?.departmentId || !formData?.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        departmentId: '',
        priority: 'medium',
        dueDate: '',
        description: '',
        attachments: []
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Create Request</h2>
        <Button
          onClick={onTemplateSelect}
          variant="outline"
          size="sm"
          iconName="FileText"
          iconPosition="left"
        >
          Templates
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Indicator */}
        {selectedTemplate && (
          <div className="bg-primary/10 border border-primary rounded-lg p-3 flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Icon name="FileCheck" size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{selectedTemplate?.name}</p>
                <p className="text-xs text-muted-foreground">Template applied</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('title', '')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Report Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData?.title}
            onChange={(e) => handleChange('title', e?.target?.value)}
            placeholder="Enter report title"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Assign to Department <span className="text-destructive">*</span>
          </label>
          <select
            value={formData?.departmentId}
            onChange={(e) => handleChange('departmentId', e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select department</option>
            {departments?.map(dept => (
              <option key={dept?.id} value={dept?.id}>{dept?.name}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Priority Level</label>
          <div className="grid grid-cols-3 gap-2">
            {['low', 'medium', 'high']?.map(priority => (
              <button
                key={priority}
                type="button"
                onClick={() => handleChange('priority', priority)}
                className={`px-3 py-2 rounded-lg border transition-smooth capitalize ${
                  formData?.priority === priority
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Deadline <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            value={formData?.dueDate}
            onChange={(e) => handleChange('dueDate', e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Description with Rich Text */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Detailed Requirements</label>
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Simple formatting toolbar */}
            <div className="bg-muted/30 border-b border-border px-3 py-2 flex items-center gap-2">
              <button type="button" className="p-1 hover:bg-background rounded" title="Bold">
                <Icon name="Bold" size={16} />
              </button>
              <button type="button" className="p-1 hover:bg-background rounded" title="Italic">
                <Icon name="Italic" size={16} />
              </button>
              <button type="button" className="p-1 hover:bg-background rounded" title="List">
                <Icon name="List" size={16} />
              </button>
              <button type="button" className="p-1 hover:bg-background rounded" title="Link">
                <Icon name="Link" size={16} />
              </button>
            </div>
            <textarea
              value={formData?.description}
              onChange={(e) => handleChange('description', e?.target?.value)}
              placeholder="Describe the report requirements in detail..."
              rows={6}
              className="w-full px-3 py-2 bg-background text-foreground focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* File Attachments - Drag & Drop */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
              isDragging
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop files here</p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-sm text-primary hover:underline cursor-pointer">or browse files</span>
            </label>
          </div>
          {formData?.attachments?.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData?.attachments?.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon name="File" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{file}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          iconName="Send"
          iconPosition="left"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
};

export default RequestCreationForm;