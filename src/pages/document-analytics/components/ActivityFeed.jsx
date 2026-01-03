import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'submission':
        return { name: 'Upload', color: 'var(--color-accent)' };
      case 'approval':
        return { name: 'CheckCircle2', color: 'var(--color-success)' };
      case 'rejection':
        return { name: 'XCircle', color: 'var(--color-error)' };
      case 'comment':
        return { name: 'MessageSquare', color: 'var(--color-primary)' };
      case 'revision':
        return { name: 'Edit', color: 'var(--color-warning)' };
      default:
        return { name: 'Activity', color: 'var(--color-muted-foreground)' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date('2026-01-02T11:42:33');
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Recent Activity
        </h3>
        <p className="text-sm font-caption text-muted-foreground mt-1">
          Real-time document workflow updates
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-4">
          {activities?.map((activity) => {
            const iconConfig = getActivityIcon(activity?.type);
            return (
              <div key={activity?.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={activity?.userAvatar}
                      alt={activity?.userAvatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-body text-foreground">
                      <span className="font-medium">{activity?.userName}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity?.action}</span>
                    </p>
                    <Icon
                      name={iconConfig?.name}
                      size={16}
                      color={iconConfig?.color}
                      strokeWidth={2}
                      className="flex-shrink-0"
                    />
                  </div>
                  <p className="text-sm font-body text-foreground line-clamp-2 mb-1">
                    {activity?.documentTitle}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-caption text-muted-foreground">
                    <span>{activity?.department}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(activity?.timestamp)}</span>
                  </div>
                  {activity?.comment && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-caption text-foreground italic">
                      "{activity?.comment}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm font-caption text-primary hover:text-primary/80 transition-smooth">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;