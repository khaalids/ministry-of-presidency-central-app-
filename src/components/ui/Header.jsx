import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';
  const isAdmin = userProfile?.role === 'admin';

  const navigationItems = [
    {
      label: 'Executive Overview',
      path: '/executive-overview',
      icon: 'LayoutDashboard',
      tooltip: 'Strategic dashboard with comprehensive KPI monitoring'
    },
    {
      label: 'Department Performance',
      path: '/department-performance',
      icon: 'Building2',
      tooltip: 'Operational efficiency and resource utilization tracking'
    },
    {
      label: 'Document Analytics',
      path: '/document-analytics',
      icon: 'FileText',
      tooltip: 'Document lifecycle and approval process monitoring'
    },
    ...(isAdmin ? [
      {
        label: 'System Administration',
        path: '/system-administration',
        icon: 'Settings',
        tooltip: 'User analytics and security compliance oversight'
      },
      {
        label: 'User Management',
        path: '/user-management',
        icon: 'Users',
        tooltip: 'Manage users, roles, and permissions'
      }
    ] : []),
    ...(isLeadership ? [
      {
        label: 'Task Management',
        path: '/task-management',
        icon: 'CheckSquare',
        tooltip: 'Assign and monitor department tasks'
      },
      {
        label: 'Report Requests',
        path: '/report-requests',
        icon: 'FileText',
        tooltip: 'Request and review department reports'
      },
      {
        label: 'Report Management',
        path: '/report-request-management',
        icon: 'FileStack',
        tooltip: 'Comprehensive report request management with templates'
      },
      {
        label: 'Notifications',
        path: '/notifications-center',
        icon: 'Bell',
        tooltip: 'View all notifications and alerts'
      }
    ] : [
      {
        label: 'My Tasks',
        path: '/task-management',
        icon: 'CheckSquare',
        tooltip: 'View and manage your assigned tasks'
      },
      {
        label: 'My Reports',
        path: '/report-requests',
        icon: 'FileText',
        tooltip: 'View and submit requested reports'
      },
      {
        label: 'Notifications',
        path: '/notifications-center',
        icon: 'Bell',
        tooltip: 'View all notifications and alerts'
      }
    ])
  ];

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    navigate('/login-authentication');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-fluid px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-brown-100 flex items-center justify-center">
              <Image 
                src="assets/images/New_Project__1_-1767357804834.jpg" 
                alt="Ministry Dashboard Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-heading font-bold text-foreground leading-tight">
                Ministry Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Government Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="p-2.5 rounded-lg text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
              title="Notifications"
            >
              <Icon name="Bell" size={20} strokeWidth={2} />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2 pr-3 rounded-lg hover:bg-muted transition-smooth press-scale"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {userProfile?.avatar_url ? (
                    <Image
                      src={userProfile?.avatar_url}
                      alt={userProfile?.full_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon name="User" size={24} color="var(--color-primary)" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-body font-medium text-foreground leading-tight">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs font-caption text-muted-foreground">
                    {userProfile?.role?.replace('_', ' ')?.toUpperCase() || 'User'}
                  </p>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  strokeWidth={2}
                  className={`hidden md:block transition-smooth ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-lg shadow-warm-lg border border-border overflow-hidden z-1100">
                  <div className="p-4 border-b border-border">
                    <p className="font-body font-medium text-foreground">{userProfile?.full_name || 'User'}</p>
                    <p className="text-sm font-caption text-muted-foreground">{userProfile?.role?.replace('_', ' ')?.toUpperCase() || 'User'}</p>
                    {userProfile?.department && (
                      <p className="text-xs font-caption text-muted-foreground mt-1">
                        {userProfile?.department?.name}
                      </p>
                    )}
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name="User" size={18} strokeWidth={2} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/preferences');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name="Settings" size={18} strokeWidth={2} />
                      <span>Preferences</span>
                    </button>
                  </div>
                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-destructive hover:bg-destructive/10 transition-smooth"
                    >
                      <Icon name="LogOut" size={18} strokeWidth={2} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-foreground hover:bg-muted transition-smooth press-scale"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 mt-4 pt-4 border-t border-border">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              title={item?.tooltip}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-body font-medium text-sm
                transition-smooth press-scale
                ${isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-warm-sm'
                  : 'text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={item?.icon} size={18} strokeWidth={2} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1300 lg:hidden">
          <div className="absolute inset-0 bg-background" />
          <div
            ref={mobileMenuRef}
            className="absolute top-20 left-0 right-0 bottom-0 bg-card overflow-y-auto"
          >
            <nav className="p-6 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-body font-medium text-base
                    transition-smooth press-scale
                    ${isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-warm-sm'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={22} strokeWidth={2} />
                  <div className="flex-1 text-left">
                    <p>{item?.label}</p>
                    <p className="text-xs font-caption opacity-75 mt-0.5">
                      {item?.tooltip}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;