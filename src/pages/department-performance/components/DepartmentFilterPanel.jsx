import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DepartmentFilterPanel = ({ 
  selectedDepartments, 
  onDepartmentChange,
  selectedMetric,
  onMetricChange,
  selectedPeriod,
  onPeriodChange,
  onReset
}) => {
  const departmentOptions = [
    { value: 'Finance', label: 'Finance Department' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Legal Affairs', label: 'Legal Affairs' },
    { value: 'Communications', label: 'Communications' },
    { value: 'Strategic Planning', label: 'Strategic Planning' },
    { value: 'Information Technology', label: 'Information Technology' }
  ];

  const metricOptions = [
    { value: 'efficiency', label: 'Operational Efficiency' },
    { value: 'productivity', label: 'Productivity Index' },
    { value: 'compliance', label: 'Compliance Score' },
    { value: 'overall', label: 'Overall Performance' }
  ];

  const periodOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' }
  ];

  const handleDepartmentToggle = (dept) => {
    if (selectedDepartments?.includes(dept)) {
      onDepartmentChange(selectedDepartments?.filter(d => d !== dept));
    } else {
      onDepartmentChange([...selectedDepartments, dept]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDepartments?.length === departmentOptions?.length) {
      onDepartmentChange([]);
    } else {
      onDepartmentChange(departmentOptions?.map(d => d?.value));
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Filter Controls
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-caption font-medium text-foreground">
              Departments
            </label>
            <button
              onClick={handleSelectAll}
              className="text-xs font-caption text-primary hover:text-primary/80 transition-smooth"
            >
              {selectedDepartments?.length === departmentOptions?.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {departmentOptions?.map((dept) => (
              <Checkbox
                key={dept?.value}
                label={dept?.label}
                checked={selectedDepartments?.includes(dept?.value)}
                onChange={() => handleDepartmentToggle(dept?.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <Select
            label="Performance Metric"
            options={metricOptions}
            value={selectedMetric}
            onChange={onMetricChange}
          />
        </div>

        <div>
          <Select
            label="Time Period"
            options={periodOptions}
            value={selectedPeriod}
            onChange={onPeriodChange}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
            <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs font-caption text-foreground">
              Select multiple departments to compare performance metrics. Data updates every 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentFilterPanel;