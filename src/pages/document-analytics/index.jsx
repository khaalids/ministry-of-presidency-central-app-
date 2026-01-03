import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';

import MetricCard from './components/MetricCard';
import TimelineChart from './components/TimelineChart';
import ActivityFeed from './components/ActivityFeed';
import CategoryChart from './components/CategoryChart';
import SearchAnalytics from './components/SearchAnalytics';
import FileUploadStatus from './components/FileUploadStatus';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';


const DocumentAnalytics = () => {
  const { userProfile } = useAuth();
  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';
  const userDepartmentName = userProfile?.department?.name;
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const metricsData = [
  {
    title: 'Total Documents',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: 'FileText',
    sparklineData: [45, 52, 48, 61, 58, 67, 72]
  },
  {
    title: 'Avg Approval Time',
    value: '4.2 days',
    change: '-8.3%',
    changeType: 'positive',
    icon: 'Clock',
    sparklineData: [8, 7.5, 6.8, 5.9, 5.2, 4.8, 4.2]
  },
  {
    title: 'Rejection Rate',
    value: '7.8%',
    change: '+2.1%',
    changeType: 'negative',
    icon: 'XCircle',
    sparklineData: [5.2, 5.8, 6.1, 6.8, 7.2, 7.5, 7.8]
  },
  {
    title: 'Version Control',
    value: '1,234',
    change: '+18.7%',
    changeType: 'positive',
    icon: 'GitBranch',
    sparklineData: [32, 38, 42, 48, 55, 61, 68]
  }];


  const timelineData = [
  {
    id: 1,
    title: 'Q1 2026 Budget Allocation Policy',
    department: 'Finance Department',
    status: 'approved',
    submittedDate: '28 Dec 2025',
    currentStage: 4,
    totalStages: 4,
    daysInProgress: 5,
    isDelayed: false,
    stages: [
    {
      name: 'Initial Submission',
      assignee: 'John Smith',
      date: '28 Dec 2025',
      completed: true,
      comment: 'Document submitted for review'
    },
    {
      name: 'Department Review',
      assignee: 'Sarah Johnson',
      date: '29 Dec 2025',
      completed: true,
      comment: 'Approved with minor suggestions'
    },
    {
      name: 'Legal Compliance Check',
      assignee: 'Michael Brown',
      date: '30 Dec 2025',
      completed: true,
      comment: 'All compliance requirements met'
    },
    {
      name: 'Final Approval',
      assignee: 'Dr. Sarah Mitchell',
      date: '02 Jan 2026',
      completed: true,
      comment: 'Approved for implementation'
    }]

  },
  {
    id: 2,
    title: 'Staff Performance Evaluation Framework',
    department: 'Human Resources',
    status: 'in-review',
    submittedDate: '30 Dec 2025',
    currentStage: 2,
    totalStages: 4,
    daysInProgress: 3,
    isDelayed: false,
    stages: [
    {
      name: 'Initial Submission',
      assignee: 'Emily Davis',
      date: '30 Dec 2025',
      completed: true
    },
    {
      name: 'Department Review',
      assignee: 'Robert Wilson',
      date: '31 Dec 2025',
      completed: true,
      comment: 'Under review, awaiting feedback'
    },
    {
      name: 'Legal Compliance Check',
      assignee: 'Pending',
      date: 'Pending',
      completed: false
    },
    {
      name: 'Final Approval',
      assignee: 'Pending',
      date: 'Pending',
      completed: false
    }]

  },
  {
    id: 3,
    title: 'IT Infrastructure Upgrade Proposal',
    department: 'Information Technology',
    status: 'pending',
    submittedDate: '25 Dec 2025',
    currentStage: 1,
    totalStages: 4,
    daysInProgress: 8,
    isDelayed: true,
    delayDays: 3,
    stages: [
    {
      name: 'Initial Submission',
      assignee: 'David Martinez',
      date: '25 Dec 2025',
      completed: true
    },
    {
      name: 'Department Review',
      assignee: 'Lisa Anderson',
      date: 'Pending',
      completed: false
    },
    {
      name: 'Legal Compliance Check',
      assignee: 'Pending',
      date: 'Pending',
      completed: false
    },
    {
      name: 'Final Approval',
      assignee: 'Pending',
      date: 'Pending',
      completed: false
    }]

  },
  {
    id: 4,
    title: 'Public Communication Strategy 2026',
    department: 'Communications',
    status: 'rejected',
    submittedDate: '27 Dec 2025',
    currentStage: 2,
    totalStages: 4,
    daysInProgress: 6,
    isDelayed: false,
    stages: [
    {
      name: 'Initial Submission',
      assignee: 'Jennifer Taylor',
      date: '27 Dec 2025',
      completed: true
    },
    {
      name: 'Department Review',
      assignee: 'Mark Thompson',
      date: '29 Dec 2025',
      completed: true,
      comment: 'Rejected - requires significant revisions to align with ministry guidelines'
    },
    {
      name: 'Legal Compliance Check',
      assignee: 'Not reached',
      date: 'Not reached',
      completed: false
    },
    {
      name: 'Final Approval',
      assignee: 'Not reached',
      date: 'Not reached',
      completed: false
    }]

  }];


  const activityData = [
  {
    id: 1,
    type: 'approval',
    userName: 'Dr. Sarah Mitchell',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1626fc972-1763299131583.png",
    userAvatarAlt: 'Professional headshot of woman with short brown hair in navy blazer',
    action: 'approved',
    documentTitle: 'Q1 2026 Budget Allocation Policy',
    department: 'Finance',
    timestamp: '2026-01-02T11:30:00',
    comment: 'Approved for immediate implementation'
  },
  {
    id: 2,
    type: 'submission',
    userName: 'John Smith',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11b10548b-1763293419758.png",
    userAvatarAlt: 'Professional headshot of man with black hair in gray suit',
    action: 'submitted',
    documentTitle: 'Annual Procurement Guidelines Update',
    department: 'Operations',
    timestamp: '2026-01-02T11:15:00'
  },
  {
    id: 3,
    type: 'comment',
    userName: 'Sarah Johnson',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e9a2995d-1763296922897.png",
    userAvatarAlt: 'Professional headshot of woman with blonde hair in white blouse',
    action: 'commented on',
    documentTitle: 'Staff Performance Evaluation Framework',
    department: 'HR',
    timestamp: '2026-01-02T10:45:00',
    comment: 'Please review section 3.2 for clarity on evaluation criteria'
  },
  {
    id: 4,
    type: 'revision',
    userName: 'Michael Brown',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e55f2268-1763293963450.png",
    userAvatarAlt: 'Professional headshot of man with brown hair in dark blue suit',
    action: 'requested revisions for',
    documentTitle: 'Legal Compliance Checklist 2026',
    department: 'Legal',
    timestamp: '2026-01-02T10:20:00'
  },
  {
    id: 5,
    type: 'rejection',
    userName: 'Mark Thompson',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc3c7b-1763293178950.png",
    userAvatarAlt: 'Professional headshot of man with gray hair in charcoal suit',
    action: 'rejected',
    documentTitle: 'Public Communication Strategy 2026',
    department: 'Communications',
    timestamp: '2026-01-02T09:50:00',
    comment: 'Requires alignment with ministry communication guidelines'
  },
  {
    id: 6,
    type: 'approval',
    userName: 'Emily Davis',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_159a69e51-1763293590610.png",
    userAvatarAlt: 'Professional headshot of woman with red hair in burgundy blazer',
    action: 'approved',
    documentTitle: 'Training Program Schedule Q1 2026',
    department: 'HR',
    timestamp: '2026-01-02T09:30:00'
  }];


  const categoryData = [
  { category: 'Policy Documents', count: 842 },
  { category: 'Reports', count: 654 },
  { category: 'Memorandums', count: 521 },
  { category: 'Directives', count: 387 },
  { category: 'Correspondence', count: 289 },
  { category: 'Contracts', count: 154 }];


  const searchData = [
  { term: 'budget allocation', count: 1247 },
  { term: 'staff evaluation', count: 982 },
  { term: 'procurement guidelines', count: 856 },
  { term: 'compliance checklist', count: 743 },
  { term: 'training schedule', count: 621 },
  { term: 'communication strategy', count: 534 }];


  const retrievalPatterns = [
  {
    pattern: 'Peak Access Hours',
    description: 'Most documents accessed 9 AM - 11 AM',
    frequency: '2,847 accesses/day',
    avgTime: '3.2 min avg',
    trend: 'up',
    change: '+15%'
  },
  {
    pattern: 'Mobile Access',
    description: 'Documents viewed on mobile devices',
    frequency: '1,234 accesses/day',
    avgTime: '4.5 min avg',
    trend: 'up',
    change: '+28%'
  },
  {
    pattern: 'Cross-Department Sharing',
    description: 'Documents shared between departments',
    frequency: '456 shares/day',
    avgTime: '2.1 min avg',
    trend: 'down',
    change: '-5%'
  }];


  const uploadData = [
  {
    id: 1,
    fileName: 'Q1_Budget_Report_2026.pdf',
    fileSize: 2457600,
    status: 'completed',
    uploadedBy: 'John Smith',
    timestamp: '2 min ago'
  },
  {
    id: 2,
    fileName: 'Staff_Evaluation_Framework.docx',
    fileSize: 1048576,
    status: 'processing',
    progress: 67,
    uploadedBy: 'Emily Davis',
    timestamp: '5 min ago'
  },
  {
    id: 3,
    fileName: 'IT_Infrastructure_Proposal.xlsx',
    fileSize: 3145728,
    status: 'processing',
    progress: 34,
    uploadedBy: 'David Martinez',
    timestamp: '8 min ago'
  },
  {
    id: 4,
    fileName: 'Communication_Strategy_Draft.pdf',
    fileSize: 1572864,
    status: 'failed',
    error: 'File format not supported. Please upload PDF version 1.4 or higher.',
    uploadedBy: 'Jennifer Taylor',
    timestamp: '12 min ago'
  }];


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log('Filter by category:', category);
  };

  return (
    <>
      <Helmet>
        <title>Document Analytics - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                {isLeadership ? 'Document Analytics' : `${userDepartmentName || 'Department'} Document Analytics`}
              </h1>
              <p className="text-muted-foreground">
                {isLeadership
                  ? 'Comprehensive document lifecycle and approval process monitoring'
                  : `Document analytics for ${userDepartmentName || 'your department'}`}
              </p>
            </div>
          </div>

          {!isLeadership && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={20} className="text-accent-foreground" />
                <p className="text-sm text-accent-foreground">
                  You are viewing document analytics for your department: <strong>{userDepartmentName}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {metricsData?.map((metric, index) =>
            <MetricCard key={index} {...metric} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <TimelineChart data={timelineData} />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed activities={activityData} />
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <CategoryChart data={categoryData} onCategoryClick={handleCategoryClick} />
          </div>

          <div className="mb-6 md:mb-8">
            <SearchAnalytics searchData={searchData} retrievalPatterns={retrievalPatterns} />
          </div>

          <div>
            <FileUploadStatus uploads={uploadData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentAnalytics;