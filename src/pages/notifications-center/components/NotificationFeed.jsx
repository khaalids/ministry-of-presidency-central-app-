import React from 'react';
import Icon from '../../../components/AppIcon';
import NotificationItem from './NotificationItem';

const NotificationFeed = ({ notifications, onMarkAsRead }) => {
  if (notifications?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Bell" size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No notifications found
        </h3>
        <p className="text-muted-foreground font-body">
          You're all caught up! Check back later for updates.
        </p>
      </div>
    );
  }

  // Group notifications by date
  const groupedNotifications = notifications?.reduce((groups, notification) => {
    const date = new Date(notification?.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    let dateKey;
    if (date?.toDateString() === today?.toDateString()) {
      dateKey = 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date?.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (!groups?.[dateKey]) {
      groups[dateKey] = [];
    }
    groups?.[dateKey]?.push(notification);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object?.entries(groupedNotifications)?.map(([dateKey, dateNotifications]) => (
        <div key={dateKey}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-heading font-semibold text-foreground">
              {dateKey}
            </h2>
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground font-caption">
              {dateNotifications?.length} notification{dateNotifications?.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {dateNotifications?.map((notification) => (
              <NotificationItem
                key={notification?.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationFeed;
