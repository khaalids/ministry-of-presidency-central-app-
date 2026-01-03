import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterBar from '../../components/ui/FilterBar';
import PerformanceMetricCard from './components/PerformanceMetricCard';
import DepartmentRankingTable from './components/DepartmentRankingTable';
import PerformanceTrendChart from './components/PerformanceTrendChart';
import WorkloadHeatMap from './components/WorkloadHeatMap';
import DepartmentFilterPanel from './components/DepartmentFilterPanel';
import ComparisonModePanel from './components/ComparisonModePanel';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentPerformance = () => {
  const { userProfile } = useAuth();
  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';
  const userDepartmentName = userProfile?.department?.name;

  const [selectedDepartments, setSelectedDepartments] = useState(
    isLeadership
      ? ['Finance', 'Human Resources', 'Operations', 'Legal Affairs']
      : userDepartmentName
      ? [userDepartmentName]
      : []
  );
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLeadership && userDepartmentName) {
      setSelectedDepartments([userDepartmentName]);
    }
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [isLeadership, userDepartmentName]);

  const handleDepartmentChange = (departments) => {
    if (isLeadership) {
      setSelectedDepartments(departments);
    }
  };

  const performanceMetrics = [
    {
      title: 'Task Completion Rate',
      value: 87,
      change: 5.2,
      trend: 'up',
      icon: 'CheckCircle2',
      threshold: { excellent: 85, good: 70, warning: 50 },
      description: 'Average completion rate across all departments'
    },
    {
      title: 'Document Processing Volume',
      value: 92,
      change: 8.1,
      trend: 'up',
      icon: 'FileText',
      threshold: { excellent: 90, good: 75, warning: 60 },
      description: 'Documents processed vs. submitted'
    },
    {
      title: 'User Activity Level',
      value: 78,
      change: -2.3,
      trend: 'down',
      icon: 'Users',
      threshold: { excellent: 85, good: 70, warning: 50 },
      description: 'Active users engagement rate'
    },
    {
      title: 'Compliance Score',
      value: 94,
      change: 3.7,
      trend: 'up',
      icon: 'Shield',
      threshold: { excellent: 90, good: 80, warning: 70 },
      description: 'Adherence to policies and deadlines'
    }
  ];

  const departmentRankings = [
    {
      id: 1,
      rank: 1,
      name: 'Finance Department',
      head: 'Ahmed Hassan',
      score: 94,
      trend: 2,
      tasksCompleted: 342,
      documentsProcessed: 1247,
      activeUsers: 45
    },
    {
      id: 2,
      rank: 2,
      name: 'Operations',
      head: 'Fatima Ali',
      score: 91,
      trend: 1,
      tasksCompleted: 298,
      documentsProcessed: 1089,
      activeUsers: 38
    },
    {
      id: 3,
      rank: 3,
      name: 'Legal Affairs',
      head: 'Mohamed Ibrahim',
      score: 88,
      trend: -1,
      tasksCompleted: 267,
      documentsProcessed: 892,
      activeUsers: 32
    },
    {
      id: 4,
      rank: 4,
      name: 'Human Resources',
      head: 'Amina Yusuf',
      score: 85,
      trend: 3,
      tasksCompleted: 234,
      documentsProcessed: 756,
      activeUsers: 28
    },
    {
      id: 5,
      rank: 5,
      name: 'Communications',
      head: 'Omar Abdi',
      score: 82,
      trend: 0,
      tasksCompleted: 198,
      documentsProcessed: 623,
      activeUsers: 24
    },
    {
      id: 6,
      rank: 6,
      name: 'Strategic Planning',
      head: 'Khadija Ahmed',
      score: 79,
      trend: -2,
      tasksCompleted: 176,
      documentsProcessed: 534,
      activeUsers: 21
    },
    {
      id: 7,
      rank: 7,
      name: 'Information Technology',
      head: 'Hassan Mohamed',
      score: 76,
      trend: 1,
      tasksCompleted: 154,
      documentsProcessed: 467,
      activeUsers: 19
    }
  ];

  const trendChartData = [
    {
      month: 'Jul 2025',
      'Finance': 89,
      'Human Resources': 82,
      'Operations': 87,
      'Legal Affairs': 85,
      'Communications': 78,
      'Strategic Planning': 75,
      'Information Technology': 72,
      resourceAllocation: 65
    },
    {
      month: 'Aug 2025',
      'Finance': 91,
      'Human Resources': 84,
      'Operations': 88,
      'Legal Affairs': 86,
      'Communications': 80,
      'Strategic Planning': 76,
      'Information Technology': 73,
      resourceAllocation: 68
    },
    {
      month: 'Sep 2025',
      'Finance': 90,
      'Human Resources': 83,
      'Operations': 89,
      'Legal Affairs': 87,
      'Communications': 79,
      'Strategic Planning': 77,
      'Information Technology': 74,
      resourceAllocation: 70
    },
    {
      month: 'Oct 2025',
      'Finance': 92,
      'Human Resources': 85,
      'Operations': 90,
      'Legal Affairs': 86,
      'Communications': 81,
      'Strategic Planning': 78,
      'Information Technology': 75,
      resourceAllocation: 72
    },
    {
      month: 'Nov 2025',
      'Finance': 93,
      'Human Resources': 84,
      'Operations': 91,
      'Legal Affairs': 88,
      'Communications': 82,
      'Strategic Planning': 79,
      'Information Technology': 76,
      resourceAllocation: 74
    },
    {
      month: 'Dec 2025',
      'Finance': 94,
      'Human Resources': 85,
      'Operations': 91,
      'Legal Affairs': 88,
      'Communications': 82,
      'Strategic Planning': 79,
      'Information Technology': 76,
      resourceAllocation: 75
    }
  ];

  const heatMapData = {
    taskWorkload: {
      timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      departments: [
        {
          name: 'Finance',
          values: [92, 88, 94, 90, 87, 93]
        },
        {
          name: 'Human Resources',
          values: [78, 82, 85, 80, 84, 86]
        },
        {
          name: 'Operations',
          values: [85, 89, 91, 88, 90, 92]
        },
        {
          name: 'Legal Affairs',
          values: [82, 86, 88, 85, 87, 89]
        },
        {
          name: 'Communications',
          values: [75, 78, 82, 79, 81, 83]
        },
        {
          name: 'Strategic Planning',
          values: [72, 76, 79, 75, 78, 80]
        },
        {
          name: 'Information Technology',
          values: [70, 74, 76, 73, 75, 77]
        }
      ]
    },
    documentWorkload: {
      timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      departments: [
        {
          name: 'Finance',
          values: [95, 92, 96, 93, 91, 94]
        },
        {
          name: 'Human Resources',
          values: [80, 84, 87, 82, 86, 88]
        },
        {
          name: 'Operations',
          values: [88, 91, 93, 90, 92, 94]
        },
        {
          name: 'Legal Affairs',
          values: [85, 88, 90, 87, 89, 91]
        },
        {
          name: 'Communications',
          values: [78, 81, 84, 80, 83, 85]
        },
        {
          name: 'Strategic Planning',
          values: [75, 78, 81, 77, 80, 82]
        },
        {
          name: 'Information Technology',
          values: [72, 76, 78, 75, 77, 79]
        }
      ]
    },
    userActivity: {
      timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      departments: [
        {
          name: 'Finance',
          values: [88, 85, 90, 87, 84, 89]
        },
        {
          name: 'Human Resources',
          values: [75, 79, 82, 77, 81, 83]
        },
        {
          name: 'Operations',
          values: [82, 86, 88, 85, 87, 89]
        },
        {
          name: 'Legal Affairs',
          values: [79, 83, 85, 82, 84, 86]
        },
        {
          name: 'Communications',
          values: [72, 75, 79, 74, 77, 80]
        },
        {
          name: 'Strategic Planning',
          values: [69, 73, 76, 72, 75, 77]
        },
        {
          name: 'Information Technology',
          values: [67, 71, 73, 70, 72, 74]
        }
      ]
    }
  };

  const handleFilterReset = () => {
    setSelectedDepartments([
      'Finance',
      'Human Resources',
      'Operations',
      'Legal Affairs'
    ]);
    setSelectedMetric('overall');
    setSelectedPeriod('6months');
  };

  const handleComparison = (comparisonData) => {
    console.log('Comparison requested:', comparisonData);
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Department Performance - Ministry Dashboard</title>
          <meta name="description" content="Monitor operational efficiency and resource utilization across all government departments" />
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="pt-20">
            <FilterBar />
            <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-64" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[1, 2, 3, 4]?.map((i) => (
                    <div key={i} className="h-40 bg-muted rounded-lg" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 h-96 bg-muted rounded-lg" />
                  <div className="lg:col-span-4 h-96 bg-muted rounded-lg" />
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Department Performance - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                {isLeadership ? 'Department Performance Analytics' : `${userDepartmentName || 'Department'} Performance`}
              </h1>
              <p className="text-muted-foreground">
                {isLeadership
                  ? 'Comprehensive operational efficiency and resource utilization tracking across all departments'
                  : `Performance metrics and analytics for ${userDepartmentName || 'your department'}`}
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

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm font-caption text-foreground">
                  Last updated: 15 min ago
                </span>
              </div>
            </div>
          </div>

          <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
                    Department Performance
                  </h1>
                  <p className="text-sm md:text-base font-body text-muted-foreground">
                    Operational efficiency and resource utilization tracking across all departments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      Last updated: 15 min ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {performanceMetrics?.map((metric, index) => (
                <PerformanceMetricCard key={index} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-3">
                {!isLeadership && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="Info" size={20} className="text-accent-foreground" />
                      <p className="text-sm text-accent-foreground">
                        You are viewing performance data for your department: <strong>{userDepartmentName}</strong>
                      </p>
                    </div>
                  </div>
                )}
                <DepartmentFilterPanel
                  selectedDepartments={selectedDepartments}
                  onDepartmentChange={handleDepartmentChange}
                  selectedMetric={selectedMetric}
                  onMetricChange={setSelectedMetric}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  onReset={handleFilterReset}
                  disabled={!isLeadership}
                />
              </div>

              <div className="lg:col-span-9 space-y-6">
                <PerformanceTrendChart
                  data={trendChartData}
                  selectedDepartments={selectedDepartments}
                />

                <ComparisonModePanel
                  departments={departmentRankings}
                  onCompare={handleComparison}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-8">
                <WorkloadHeatMap data={heatMapData} />
              </div>

              <div className="lg:col-span-4">
                <DepartmentRankingTable departments={departmentRankings} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Info" size={20} className="text-accent" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-body font-medium text-foreground mb-2">
                    Performance Insights
                  </h3>
                  <ul className="space-y-2 text-sm font-body text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Finance Department maintains top performance with 94% overall score and consistent upward trend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="TrendingUp" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <span>Operations shows strong improvement with 8.1% increase in document processing efficiency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                      <span>User activity levels decreased by 2.3% - recommend engagement initiatives across departments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Target" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Compliance scores exceed 90% threshold across all departments - excellent adherence to policies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DepartmentPerformance;