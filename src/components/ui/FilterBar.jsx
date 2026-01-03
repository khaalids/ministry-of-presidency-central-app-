import React, { useState } from 'react';
import Select from './Select';
import Input from './Input';
import Button from './Button';
import Icon from '../AppIcon';

const FilterBar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [selectedDocumentType, setSelectedDocumentType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'finance', label: 'Finance Department' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'operations', label: 'Operations' },
    { value: 'legal', label: 'Legal Affairs' },
    { value: 'communications', label: 'Communications' },
    { value: 'planning', label: 'Strategic Planning' },
    { value: 'it', label: 'Information Technology' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const documentTypeOptions = [
    { value: 'all', label: 'All Document Types' },
    { value: 'policy', label: 'Policy Documents' },
    { value: 'report', label: 'Reports' },
    { value: 'memo', label: 'Memorandums' },
    { value: 'directive', label: 'Directives' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'contract', label: 'Contracts' }
  ];

  const handleReset = () => {
    setSelectedDepartment('all');
    setSelectedDateRange('last-30-days');
    setSelectedDocumentType('all');
    setSearchQuery('');
  };

  const handleApply = () => {
    console.log('Applying filters:', {
      department: selectedDepartment,
      dateRange: selectedDateRange,
      documentType: selectedDocumentType,
      search: searchQuery
    });
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
              <Icon
                name="Search"
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>

            <Select
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select department"
            />

            <Select
              options={dateRangeOptions}
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              placeholder="Select date range"
            />

            <div className="lg:hidden">
              <Button
                variant="outline"
                fullWidth
                iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Less Filters' : 'More Filters'}
              </Button>
            </div>

            <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
              <Select
                options={documentTypeOptions}
                value={selectedDocumentType}
                onChange={setSelectedDocumentType}
                placeholder="Document type"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="default"
              iconName="Filter"
              iconPosition="left"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {selectedDepartment !== 'all' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-caption">
              <span>
                Department: {departmentOptions?.find(d => d?.value === selectedDepartment)?.label}
              </span>
              <button
                onClick={() => setSelectedDepartment('all')}
                className="hover:bg-primary/20 rounded p-0.5 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {selectedDateRange !== 'last-30-days' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent-foreground rounded-md text-sm font-caption">
              <span>
                Period: {dateRangeOptions?.find(d => d?.value === selectedDateRange)?.label}
              </span>
              <button
                onClick={() => setSelectedDateRange('last-30-days')}
                className="hover:bg-accent/20 rounded p-0.5 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {selectedDocumentType !== 'all' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary-foreground rounded-md text-sm font-caption">
              <span>
                Type: {documentTypeOptions?.find(d => d?.value === selectedDocumentType)?.label}
              </span>
              <button
                onClick={() => setSelectedDocumentType('all')}
                className="hover:bg-secondary/20 rounded p-0.5 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-md text-sm font-caption">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-muted-foreground/20 rounded p-0.5 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {(selectedDepartment !== 'all' || selectedDateRange !== 'last-30-days' || 
            selectedDocumentType !== 'all' || searchQuery) && (
            <button
              onClick={handleReset}
              className="text-sm font-caption text-muted-foreground hover:text-foreground transition-smooth"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;