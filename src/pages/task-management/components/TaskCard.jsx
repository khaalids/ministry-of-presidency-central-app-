import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns';

const TaskCard = ({ task, onUpdate, isLeadership }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    urgent: 'bg-error text-error-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-accent text-accent-foreground',
    low: 'bg-muted text-muted-foreground'
  };

  const statusColors = {
    pending: 'bg-warning/20 text-warning-foreground',
    in_progress: 'bg-accent/20 text-accent-foreground',
    completed: 'bg-success/20 text-success-foreground',
    cancelled: 'bg-muted text-muted-foreground'
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task?.id, { status: newStatus });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            {task?.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors?.[task?.priority]}`}>
              {task?.priority?.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors?.[task?.status]}`}>
              {task?.status?.replace('_', ' ')?.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-smooth"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </button>
      </div>
      {task?.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {task?.description}
        </p>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon name="Building2" size={16} />
          <span>{task?.assignedToDepartmentInfo?.name || 'No department'}</span>
        </div>
        {task?.assignedToUserProfile && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="User" size={16} />
            <span>{task?.assignedToUserProfile?.full_name}</span>
          </div>
        )}
        {task?.dueDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Due: {format(new Date(task?.dueDate), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Assigned by</p>
              <p className="text-sm font-medium">{task?.assignedByProfile?.full_name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm">{format(new Date(task?.createdAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            {task?.completedAt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Completed</p>
                <p className="text-sm">{format(new Date(task?.completedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            )}
          </div>

          {!isLeadership && task?.status !== 'completed' && task?.status !== 'cancelled' && (
            <div className="flex gap-2 mt-4">
              {task?.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('in_progress')}
                  iconName="Play"
                  iconPosition="left"
                >
                  Start Task
                </Button>
              )}
              {task?.status === 'in_progress' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleStatusChange('completed')}
                  iconName="CheckCircle2"
                  iconPosition="left"
                >
                  Complete
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;