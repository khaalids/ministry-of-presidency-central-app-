import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FilterBar from '../../components/ui/FilterBar';
import KPICard from './components/KPICard';
import DepartmentPerformanceChart from './components/DepartmentPerformanceChart';
import PriorityAlerts from './components/PriorityAlerts';
import WorkflowFunnel from './components/WorkflowFunnel';
import QuickActions from './components/QuickActions';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';


const ExecutiveOverview = () => {
  const { userProfile } = useAuth();
  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';
  const userDepartmentName = userProfile?.department?.name;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const kpiData = [
    {
      id: 1,
      title: 'Total Documents Processed',
      value: '12,847',
      subtitle: 'Last 30 days',
      trend: 'up',
      trendValue: '+12.5%',
      icon: 'FileText',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 2,
      title: 'Avg Task Completion Time',
      value: '4.2 days',
      subtitle: 'Across all departments',
      trend: 'down',
      trendValue: '-8.3%',
      icon: 'Clock',
      iconColor: 'var(--color-success)'
    },
    {
      id: 3,
      title: 'Departmental Efficiency',
      value: '87.6%',
      subtitle: 'Overall performance score',
      trend: 'up',
      trendValue: '+5.2%',
      icon: 'TrendingUp',
      iconColor: 'var(--color-accent)'
    },
    {
      id: 4,
      title: 'Pending Approvals',
      value: '234',
      subtitle: 'Requiring executive review',
      trend: 'neutral',
      trendValue: '0%',
      icon: 'AlertCircle',
      iconColor: 'var(--color-warning)'
    }
  ];

  const allDepartmentPerformanceData = [
    { department: 'Finance', efficiency: 92, completion: 88 },
    { department: 'HR', efficiency: 85, completion: 90 },
    { department: 'Operations', efficiency: 88, completion: 85 },
    { department: 'Legal', efficiency: 90, completion: 87 },
    { department: 'Communications', efficiency: 83, completion: 82 },
    { department: 'Planning', efficiency: 86, completion: 89 },
    { department: 'IT', efficiency: 91, completion: 93 }
  ];

  const departmentPerformanceData = isLeadership
    ? allDepartmentPerformanceData
    : allDepartmentPerformanceData?.filter(dept => dept?.department === userDepartmentName);

  const priorityAlerts = [
    {
      id: 1,
      priority: 'critical',
      title: 'Budget Approval Overdue',
      description: 'Q1 2026 budget proposal requires immediate ministerial approval. Deadline passed 3 days ago.',
      department: 'Finance Department',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      priority: 'high',
      title: 'Policy Document Pending Review',
      description: 'New employment policy draft awaiting final review before implementation.',
      department: 'Human Resources',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      priority: 'high',
      title: 'Contract Renewal Deadline',
      description: 'IT infrastructure contract expires in 7 days. Renewal documentation pending approval.',
      department: 'Information Technology',
      timestamp: '1 day ago'
    },
    {
      id: 4,
      priority: 'medium',
      title: 'Quarterly Report Submission',
      description: 'Operations department quarterly performance report ready for executive review.',
      department: 'Operations',
      timestamp: '2 days ago'
    }
  ];

  const workflowStages = [
    {
      id: 1,
      name: 'Document Submission',
      count: 1247,
      percentage: 100,
      avgTime: '0.5 days',
      bottleneck: false
    },
    {
      id: 2,
      name: 'Initial Review',
      count: 892,
      percentage: 71.5,
      avgTime: '1.2 days',
      bottleneck: false
    },
    {
      id: 3,
      name: 'Department Approval',
      count: 645,
      percentage: 51.7,
      avgTime: '2.8 days',
      bottleneck: false
    },
    {
      id: 4,
      name: 'Review & Approval',
      count: 423,
      percentage: 33.9,
      avgTime: '4.5 days',
      bottleneck: true
    },
    {
      id: 5,
      name: 'Final Authorization',
      count: 287,
      percentage: 23.0,
      avgTime: '1.8 days',
      bottleneck: false
    },
    {
      id: 6,
      name: 'Completed',
      count: 234,
      percentage: 18.8,
      avgTime: '0.3 days',
      bottleneck: false
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                {isLeadership ? 'Executive Overview' : `${userDepartmentName || 'Department'} Overview`}
              </h1>
              <p className="text-muted-foreground">
                {isLeadership
                  ? 'Strategic dashboard with comprehensive KPI monitoring and executive insights'
                  : `Key performance indicators for ${userDepartmentName || 'your department'}`}
              </p>
            </div>

            {!isLeadership && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Icon name="Info" size={20} className="text-accent-foreground" />
                  <p className="text-sm text-accent-foreground">
                    You are viewing analytics for your department: <strong>{userDepartmentName}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          <FilterBar />

          <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
                Executive Overview Dashboard
              </h1>
              <p className="text-sm md:text-base font-body text-muted-foreground">
                Last updated: {currentTime?.toLocaleString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {kpiData?.map((kpi) => (
                <KPICard key={kpi?.id} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="lg:col-span-8">
                <DepartmentPerformanceChart data={departmentPerformanceData} />
              </div>
              <div className="lg:col-span-4">
                <PriorityAlerts alerts={priorityAlerts} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <WorkflowFunnel stages={workflowStages} />
              <div className="space-y-4 md:space-y-6">
                <QuickActions />
                
                <div className="bg-card rounded-lg border border-border p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <span className="text-sm md:text-base font-body text-foreground">
                        All Systems Operational
                      </span>
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <span className="text-sm font-caption text-muted-foreground">
                        Active Users
                      </span>
                      <span className="text-sm md:text-base font-body font-medium text-foreground">
                        342
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <span className="text-sm font-caption text-muted-foreground">
                        Server Uptime
                      </span>
                      <span className="text-sm md:text-base font-body font-medium text-foreground">
                        99.98%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                    Need Detailed Analysis?
                  </h3>
                  <p className="text-sm md:text-base font-caption text-muted-foreground">
                    Access comprehensive reports and department-specific analytics
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button className="px-4 py-2 text-sm md:text-base font-body font-medium text-primary hover:text-primary/80 transition-smooth">
                    View Department Performance
                  </button>
                  <button className="px-4 py-2 text-sm md:text-base font-body font-medium text-primary hover:text-primary/80 transition-smooth">
                    Document Analytics
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ExecutiveOverview;