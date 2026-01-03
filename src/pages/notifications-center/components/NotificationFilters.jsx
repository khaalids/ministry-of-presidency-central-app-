import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NotificationFilters = ({ filters, onFilterChange, unreadCount }) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'task', label: 'Tasks' },
    { value: 'report', label: 'Reports' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: `Unread (${unreadCount})` },
    { value: 'read', label: 'Read' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'assignment', label: 'Task Assignments' },
    { value: 'request', label: 'Report Requests' },
    { value: 'submission', label: 'Submissions' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Filter" size={20} className="text-primary" />
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Filters
        </h2>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search
          </label>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search notifications..."
              value={filters?.search}
              onChange={(e) => onFilterChange({ search: e?.target?.value })}
              className="w-full pl-10"
            />
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Type
          </label>
          <Select
            value={filters?.type}
            onChange={(e) => onFilterChange({ type: e?.target?.value })}
            options={typeOptions}
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <Select
            value={filters?.priority}
            onChange={(e) => onFilterChange({ priority: e?.target?.value })}
            options={priorityOptions}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <Select
            value={filters?.status}
            onChange={(e) => onFilterChange({ status: e?.target?.value })}
            options={statusOptions}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <Select
            value={filters?.category}
            onChange={(e) => onFilterChange({ category: e?.target?.value })}
            options={categoryOptions}
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={() => onFilterChange({
            type: 'all',
            priority: 'all',
            status: 'all',
            category: 'all',
            search: ''
          })}
          className="w-full py-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
        >
          Reset Filters
        </button>
      </div>

      {/* Category Legend */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground font-caption">
              Task Assignments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground font-caption">
              Report Requests
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground font-caption">
              Submissions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
