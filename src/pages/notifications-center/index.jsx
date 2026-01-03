import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NotificationFilters from './components/NotificationFilters';
import NotificationFeed from './components/NotificationFeed';

const NotificationsCenter = () => {
  const { user, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    if (user && userProfile) {
      loadNotifications();
    }
  }, [user, userProfile]);

  useEffect(() => {
    applyFilters();
  }, [notifications, filters]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService?.getNotifications(
        user?.id,
        userProfile?.role,
        userProfile?.department_id
      );
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by type
    if (filters?.type !== 'all') {
      filtered = filtered?.filter(n => n?.type === filters?.type);
    }

    // Filter by priority
    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(n => n?.priority === filters?.priority);
    }

    // Filter by status
    if (filters?.status === 'unread') {
      filtered = filtered?.filter(n => !n?.read);
    } else if (filters?.status === 'read') {
      filtered = filtered?.filter(n => n?.read);
    }

    // Filter by category
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(n => n?.category === filters?.category);
    }

    // Filter by search
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(n =>
        n?.title?.toLowerCase()?.includes(searchLower) ||
        n?.message?.toLowerCase()?.includes(searchLower) ||
        n?.description?.toLowerCase()?.includes(searchLower)
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService?.markAllAsRead(user?.id);
      setNotifications(notifications?.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService?.markAsRead(notificationId);
      setNotifications(notifications?.map(n =>
        n?.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;
  const highPriorityCount = filteredNotifications?.filter(
    n => (n?.priority === 'high' || n?.priority === 'urgent') && !n?.read
  )?.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Notifications Center
              </h1>
              <p className="text-muted-foreground font-body">
                Manage task assignments, report requests, and submission updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  iconName="CheckCheck"
                >
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={loadNotifications}
                iconName="RefreshCw"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name="Bell" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    {notifications?.length}
                  </p>
                  <p className="text-sm text-muted-foreground font-caption">
                    Total Notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    {unreadCount}
                  </p>
                  <p className="text-sm text-muted-foreground font-caption">
                    Unread
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-error/10 rounded-lg p-4 border border-error/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    {highPriorityCount}
                  </p>
                  <p className="text-sm text-muted-foreground font-caption">
                    High Priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <NotificationFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              unreadCount={unreadCount}
            />
          </div>

          {/* Notification Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <Icon name="Loader2" size={48} className="text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground font-body">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="bg-error/10 rounded-lg border border-error/20 p-6 text-center">
                <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
                <p className="text-error font-body mb-4">{error}</p>
                <Button variant="outline" onClick={loadNotifications}>
                  Try Again
                </Button>
              </div>
            ) : (
              <NotificationFeed
                notifications={filteredNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
