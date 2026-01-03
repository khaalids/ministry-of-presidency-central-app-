import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Budget Approval Completed',
      message: 'Q1 2026 budget has been approved by all departments',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pending Document Review',
      message: '5 policy documents require your immediate attention',
      timestamp: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance on Jan 5, 2026 from 2:00 AM - 4:00 AM',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Security Alert',
      message: 'Unusual login activity detected from Finance Department',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 5,
      type: 'success',
      title: 'Report Generated',
      message: 'Monthly performance report is ready for download',
      timestamp: '3 hours ago',
      read: true
    }
  ]);

  const panelRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef?.current && !panelRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle2', color: 'var(--color-success)' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'error':
        return { name: 'XCircle', color: 'var(--color-error)' };
      default:
        return { name: 'Info', color: 'var(--color-accent)' };
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications?.map(n => 
      n?.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications?.map(n => ({ ...n, read: true })));
  };

  const handleDismiss = (id) => {
    setNotifications(notifications?.filter(n => n?.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-lg text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
        title="Notifications"
      >
        <Icon name="Bell" size={20} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-caption font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-popover rounded-lg shadow-warm-xl border border-border z-1200 max-h-[calc(100vh-6rem)] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm font-caption text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Bell" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-foreground font-body font-medium mb-1">
                  No notifications
                </p>
                <p className="text-sm text-muted-foreground font-caption text-center">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications?.map((notification) => {
                  const iconConfig = getNotificationIcon(notification?.type);
                  return (
                    <div
                      key={notification?.id}
                      className={`p-4 hover:bg-muted/50 transition-smooth ${
                        !notification?.read ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon
                            name={iconConfig?.name}
                            size={20}
                            color={iconConfig?.color}
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-body font-medium text-foreground text-sm">
                              {notification?.title}
                            </h4>
                            {!notification?.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-body mb-2">
                            {notification?.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-caption">
                              {notification?.timestamp}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification?.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification?.id)}
                                  className="text-xs text-primary hover:text-primary/80 font-caption transition-smooth"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(notification?.id)}
                                className="text-xs text-muted-foreground hover:text-foreground font-caption transition-smooth"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;