import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityConfig = {
    urgent: {
      color: 'bg-error text-error-foreground',
      borderColor: 'border-error',
      bgColor: 'bg-error/10',
      icon: 'AlertTriangle'
    },
    high: {
      color: 'bg-warning text-warning-foreground',
      borderColor: 'border-warning',
      bgColor: 'bg-warning/10',
      icon: 'AlertCircle'
    },
    medium: {
      color: 'bg-accent text-accent-foreground',
      borderColor: 'border-accent',
      bgColor: 'bg-accent/10',
      icon: 'Info'
    },
    low: {
      color: 'bg-muted text-muted-foreground',
      borderColor: 'border-muted',
      bgColor: 'bg-muted/10',
      icon: 'Minus'
    }
  };

  const categoryConfig = {
    assignment: {
      icon: 'CheckSquare',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    request: {
      icon: 'FileText',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    submission: {
      icon: 'Upload',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  };

  const priority = priorityConfig?.[notification?.priority] || priorityConfig?.medium;
  const category = categoryConfig?.[notification?.category] || categoryConfig?.assignment;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!notification?.read && !isExpanded) {
      onMarkAsRead(notification?.id);
    }
  };

  const isOverdue = notification?.dueDate && new Date(notification?.dueDate) < new Date();

  return (
    <div
      className={`bg-card rounded-lg border transition-smooth hover:shadow-warm-md ${
        !notification?.read ? `${priority?.borderColor} border-l-4` : 'border-border'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${category?.bgColor}`}>
            <Icon name={category?.icon} size={20} className={category?.color} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-foreground">
                    {notification?.title}
                  </h3>
                  {!notification?.read && (
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-foreground font-body mb-1">
                  {notification?.message}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-muted-foreground font-caption">
                    From: {notification?.sender}
                  </span>
                  <span className="text-xs text-muted-foreground font-caption">
                    {formatDistanceToNow(new Date(notification?.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 rounded text-xs font-medium ${priority?.color}`}>
                  {notification?.priority?.toUpperCase()}
                </span>
                <button
                  onClick={handleToggleExpand}
                  className="p-1.5 hover:bg-muted rounded-lg transition-smooth"
                >
                  <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                {notification?.description && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-muted-foreground font-body">
                      {notification?.description}
                    </p>
                  </div>
                )}

                {notification?.dueDate && (
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Calendar"
                      size={16}
                      className={isOverdue ? 'text-error' : 'text-muted-foreground'}
                    />
                    <span className={`text-sm font-caption ${
                      isOverdue ? 'text-error font-medium' : 'text-muted-foreground'
                    }`}>
                      Due: {new Date(notification?.dueDate)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {isOverdue && ' (Overdue)'}
                    </span>
                  </div>
                )}

                {notification?.status && (
                  <div className="flex items-center gap-2">
                    <Icon name="Activity" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-caption">
                      Status: <span className="font-medium text-foreground">
                        {notification?.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {!notification?.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(notification?.id)}
                      iconName="Check"
                    >
                      Mark as read
                    </Button>
                  )}
                  {notification?.type === 'task' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.location.href = '/task-management'}
                      iconName="ExternalLink"
                    >
                      View Task
                    </Button>
                  )}
                  {notification?.type === 'report' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.location.href = '/report-requests'}
                      iconName="ExternalLink"
                    >
                      View Report
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
