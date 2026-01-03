import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';

import SystemMetricCard from './components/SystemMetricCard';
import UserActivityChart from './components/UserActivityChart';
import SecurityLogPanel from './components/SecurityLogPanel';
import UserEngagementHeatmap from './components/UserEngagementHeatmap';
import DatabasePerformancePanel from './components/DatabasePerformancePanel';
import StorageAnalyticsPanel from './components/StorageAnalyticsPanel';
import BackupStatusPanel from './components/BackupStatusPanel';
import { useAuth } from '../../contexts/AuthContext';



const SystemAdministration = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['logins', 'documentUploads', 'taskCompletions', 'apiCalls']);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (userProfile && !isAdmin) {
      navigate('/executive-overview');
    }
  }, [userProfile, isAdmin, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return null;
  }

  const systemMetrics = [
    {
      title: 'System Uptime',
      value: '99.97',
      unit: '%',
      icon: 'Activity',
      trend: 'up',
      trendValue: '+0.02%',
      status: 'success',
      description: 'Last 30 days availability with zero critical incidents'
    },
    {
      title: 'Active Users',
      value: '247',
      icon: 'Users',
      trend: 'up',
      trendValue: '+12',
      status: 'normal',
      description: 'Currently logged in across all departments'
    },
    {
      title: 'Storage Used',
      value: '742.8',
      unit: 'GB',
      icon: 'HardDrive',
      trend: 'up',
      trendValue: '+18.2 GB',
      status: 'warning',
      description: '74.3% of total 1TB capacity utilized'
    },
    {
      title: 'Security Alerts',
      value: '3',
      icon: 'Shield',
      trend: 'down',
      trendValue: '-2',
      status: 'critical',
      description: 'Requires immediate attention from security team'
    }
  ];

  const activityData = [
    { time: '00:00', logins: 45, documentUploads: 12, taskCompletions: 8, apiCalls: 234 },
    { time: '04:00', logins: 23, documentUploads: 5, taskCompletions: 3, apiCalls: 156 },
    { time: '08:00', logins: 189, documentUploads: 67, taskCompletions: 45, apiCalls: 892 },
    { time: '12:00', logins: 267, documentUploads: 98, taskCompletions: 78, apiCalls: 1245 },
    { time: '16:00', logins: 234, documentUploads: 87, taskCompletions: 65, apiCalls: 1089 },
    { time: '20:00', logins: 156, documentUploads: 43, taskCompletions: 34, apiCalls: 678 }
  ];

  const securityLogs = [
    {
      id: 1,
      severity: 'critical',
      event: 'Unusual Login Activity Detected',
      description: 'Multiple failed login attempts from IP 192.168.1.45 targeting Finance Department accounts. Automated lockout triggered after 5 attempts.',
      timestamp: '2 minutes ago',
      source: 'Authentication System',
      user: 'finance_admin',
      action: 'Investigate Now'
    },
    {
      id: 2,
      severity: 'high',
      event: 'Unauthorized Access Attempt',
      description: 'User attempted to access restricted ministerial documents without proper clearance level. Access denied and incident logged.',
      timestamp: '15 minutes ago',
      source: 'Document Management',
      user: 'john.doe@ministry.gov',
      action: 'Review Permissions'
    },
    {
      id: 3,
      severity: 'critical',
      event: 'Data Export Anomaly',
      description: 'Large volume data export (2.4GB) initiated outside business hours from Operations Department. Flagged for security review.',
      timestamp: '1 hour ago',
      source: 'Data Export Module',
      user: 'ops_manager',
      action: 'Verify Activity'
    },
    {
      id: 4,
      severity: 'medium',
      event: 'Password Policy Violation',
      description: 'User attempted to set weak password not meeting complexity requirements. Password change rejected.',
      timestamp: '2 hours ago',
      source: 'User Management',
      user: 'sarah.mitchell@ministry.gov'
    },
    {
      id: 5,
      severity: 'high',
      event: 'Suspicious File Upload',
      description: 'Executable file detected in document upload. File quarantined and upload blocked per security policy.',
      timestamp: '3 hours ago',
      source: 'File Upload Scanner',
      user: 'legal_staff',
      action: 'Review File'
    },
    {
      id: 6,
      severity: 'low',
      event: 'Session Timeout',
      description: 'User session automatically terminated after 30 minutes of inactivity as per security policy.',
      timestamp: '4 hours ago',
      source: 'Session Manager',
      user: 'hr_coordinator'
    },
    {
      id: 7,
      severity: 'medium',
      event: 'API Rate Limit Exceeded',
      description: 'Third-party integration exceeded API call limits. Temporary throttling applied to prevent system overload.',
      timestamp: '5 hours ago',
      source: 'API Gateway',
      action: 'Check Integration'
    },
    {
      id: 8,
      severity: 'low',
      event: 'Successful Security Scan',
      description: 'Automated vulnerability scan completed with no critical issues found. Minor recommendations available.',
      timestamp: '6 hours ago',
      source: 'Security Scanner'
    }
  ];

  const heatmapData = [
    { id: 1, name: 'Finance', activity: [45, 23, 89, 95, 87, 56] },
    { id: 2, name: 'HR', activity: [34, 12, 67, 78, 72, 45] },
    { id: 3, name: 'Operations', activity: [67, 34, 92, 88, 85, 62] },
    { id: 4, name: 'Legal', activity: [23, 8, 56, 67, 62, 34] },
    { id: 5, name: 'Communications', activity: [45, 21, 78, 82, 76, 48] },
    { id: 6, name: 'Planning', activity: [38, 15, 72, 85, 79, 52] },
    { id: 7, name: 'IT', activity: [89, 67, 95, 92, 90, 78] }
  ];

  const databaseData = [
    { query: 'User Auth', responseTime: 45 },
    { query: 'Doc Fetch', responseTime: 78 },
    { query: 'Task Update', responseTime: 34 },
    { query: 'File Upload', responseTime: 156 },
    { query: 'Report Gen', responseTime: 234 },
    { query: 'Search', responseTime: 67 }
  ];

  const connectionStats = {
    active: 42,
    poolSize: 100,
    avgResponse: 67,
    queriesPerSec: 1247
  };

  const storageData = [
    { name: 'Documents', value: 342.5, percentage: 46 },
    { name: 'Images', value: 156.8, percentage: 21 },
    { name: 'Videos', value: 98.4, percentage: 13 },
    { name: 'Backups', value: 89.6, percentage: 12 },
    { name: 'Other', value: 55.5, percentage: 8 }
  ];

  const uploadQueue = [
    {
      id: 1,
      filename: 'Q1_Budget_Report_2026.pdf',
      size: '12.4 MB',
      department: 'Finance',
      status: 'processing',
      progress: 67
    },
    {
      id: 2,
      filename: 'Employee_Handbook_Updated.docx',
      size: '3.8 MB',
      department: 'HR',
      status: 'queued',
      progress: 0
    },
    {
      id: 3,
      filename: 'Legal_Compliance_Review.pdf',
      size: '8.2 MB',
      department: 'Legal',
      status: 'processing',
      progress: 34
    },
    {
      id: 4,
      filename: 'Strategic_Plan_2026-2030.pptx',
      size: '24.6 MB',
      department: 'Planning',
      status: 'queued',
      progress: 0
    }
  ];

  const backupHistory = [
    {
      id: 1,
      type: 'Full System',
      status: 'completed',
      timestamp: 'Jan 2, 2026 02:00 AM',
      size: '156.8 GB',
      duration: '2h 34m',
      location: 'Primary Datacenter',
      retention: '90 days'
    },
    {
      id: 2,
      type: 'Incremental',
      status: 'completed',
      timestamp: 'Jan 1, 2026 02:00 AM',
      size: '23.4 GB',
      duration: '45m',
      location: 'Primary Datacenter',
      retention: '30 days'
    },
    {
      id: 3,
      type: 'Database',
      status: 'failed',
      timestamp: 'Dec 31, 2025 02:00 AM',
      size: '0 GB',
      duration: '0m',
      location: 'Primary Datacenter',
      retention: 'N/A',
      error: 'Connection timeout to database server'
    },
    {
      id: 4,
      type: 'Full System',
      status: 'completed',
      timestamp: 'Dec 26, 2025 02:00 AM',
      size: '152.3 GB',
      duration: '2h 28m',
      location: 'Secondary Datacenter',
      retention: '90 days'
    }
  ];

  const nextScheduled = {
    date: 'Jan 3, 2026',
    time: '02:00 AM',
    type: 'Incremental Backup',
    estimatedSize: '25 GB',
    duration: '45 minutes'
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric) 
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <>
      <Helmet>
        <title>System Administration - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
                  System Administration Dashboard
                </h1>
                <p className="text-sm md:text-base font-body text-muted-foreground">
                  Real-time platform monitoring and security compliance tracking
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-caption text-muted-foreground">
                <span>Last updated:</span>
                <span className="font-medium text-foreground">
                  {currentTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {systemMetrics?.map((metric, index) => (
              <SystemMetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <UserActivityChart 
                data={activityData}
                selectedMetrics={selectedMetrics}
                onMetricToggle={handleMetricToggle}
              />
            </div>
            <div className="lg:col-span-1">
              <SecurityLogPanel logs={securityLogs} />
            </div>
          </div>

          <UserEngagementHeatmap data={heatmapData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <DatabasePerformancePanel 
              data={databaseData}
              connectionStats={connectionStats}
            />
            <StorageAnalyticsPanel 
              storageData={storageData}
              uploadQueue={uploadQueue}
            />
          </div>

          <BackupStatusPanel 
            backupHistory={backupHistory}
            nextScheduled={nextScheduled}
          />
        </div>
      </div>
    </>
  );
};

export default SystemAdministration;