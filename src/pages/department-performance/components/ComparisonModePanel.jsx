import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComparisonModePanel = ({ departments, onCompare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [primaryDept, setPrimaryDept] = useState('');
  const [comparisonDepts, setComparisonDepts] = useState([]);
  const [comparisonType, setComparisonType] = useState('performance');

  const departmentOptions = departments?.map(dept => ({
    value: dept?.name,
    label: dept?.name
  }));

  const comparisonTypeOptions = [
    { value: 'performance', label: 'Overall Performance' },
    { value: 'efficiency', label: 'Operational Efficiency' },
    { value: 'productivity', label: 'Productivity Metrics' },
    { value: 'resources', label: 'Resource Utilization' },
    { value: 'compliance', label: 'Compliance Scores' }
  ];

  const handleCompare = () => {
    if (primaryDept && comparisonDepts?.length > 0) {
      onCompare({
        primary: primaryDept,
        comparison: comparisonDepts,
        type: comparisonType
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="GitCompare" size={20} className="text-accent" strokeWidth={2} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Comparison Mode
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Compare departments side-by-side
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground"
          strokeWidth={2}
        />
      </button>
      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-border space-y-4">
          <Select
            label="Primary Department"
            description="Select the main department for comparison"
            options={departmentOptions}
            value={primaryDept}
            onChange={setPrimaryDept}
            placeholder="Choose primary department"
          />

          <Select
            label="Compare With"
            description="Select one or more departments to compare"
            options={departmentOptions?.filter(d => d?.value !== primaryDept)}
            value={comparisonDepts}
            onChange={setComparisonDepts}
            placeholder="Choose departments"
            multiple
            searchable
          />

          <Select
            label="Comparison Type"
            options={comparisonTypeOptions}
            value={comparisonType}
            onChange={setComparisonType}
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="default"
              fullWidth
              iconName="GitCompare"
              iconPosition="left"
              onClick={handleCompare}
              disabled={!primaryDept || comparisonDepts?.length === 0}
            >
              Generate Comparison
            </Button>
            <Button
              variant="outline"
              iconName="X"
              onClick={() => {
                setPrimaryDept('');
                setComparisonDepts([]);
                setIsExpanded(false);
              }}
            >
              Clear
            </Button>
          </div>

          {primaryDept && comparisonDepts?.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-caption text-foreground mb-2">
                <span className="font-medium">Comparing:</span> {primaryDept}
              </p>
              <p className="text-sm font-caption text-muted-foreground">
                <span className="font-medium">Against:</span> {comparisonDepts?.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonModePanel;