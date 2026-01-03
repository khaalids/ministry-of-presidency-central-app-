import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { reportService } from '../../services/reportService';
import { departmentService } from '../../services/departmentService';
import RequestCreationForm from './components/RequestCreationForm';
import ActiveRequestsTable from './components/ActiveRequestsTable';
import TemplateLibrary from './components/TemplateLibrary';
import Icon from '../../components/AppIcon';

const ReportRequestManagement = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [requestTypeFilter, setRequestTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, departmentsData] = await Promise.all([
        reportService?.getAllReports(),
        departmentService?.getAllDepartments()
      ]);
      setReports(reportsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (requestData) => {
    try {
      await reportService?.createReport(requestData);
      setSelectedTemplate(null);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to create report request');
    }
  };

  const handleUpdateRequest = async (reportId, updates) => {
    try {
      await reportService?.reviewReport(reportId, updates?.status, updates?.reviewerNotes);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to update request');
    }
  };

  const handleDeleteRequest = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      // Add delete functionality to reportService if needed
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to delete request');
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateLibrary(false);
  };

  const filteredReports = reports?.filter(report => {
    if (selectedDepartment !== 'all' && report?.departmentId !== selectedDepartment) return false;
    if (statusFilter !== 'all' && report?.status !== statusFilter) return false;
    if (searchQuery && !report?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading report management...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isLeadership) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="ShieldAlert" size={64} className="text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
              <p className="text-muted-foreground">This page is only accessible to DG, Minister, and Admin roles.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Report Request Management - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Report Request Management
            </h1>
            <p className="text-muted-foreground">
              Submit structured report requests to departments with templates, deadlines, and comprehensive tracking
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Departments</option>
                  {departments?.map(dept => (
                    <option key={dept?.id} value={dept?.id}>{dept?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Request Type</label>
                <select
                  value={requestTypeFilter}
                  onChange={(e) => setRequestTypeFilter(e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="financial">Financial Summary</option>
                  <option value="operational">Operational Review</option>
                  <option value="compliance">Compliance Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="requested">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="approved">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Search</label>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    placeholder="Search requests..."
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid - 16 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-16 gap-6">
            {/* Left Panel - Request Creation Form (5 columns) */}
            <div className="lg:col-span-5">
              <RequestCreationForm
                departments={departments}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={() => setShowTemplateLibrary(true)}
                onSubmit={handleCreateRequest}
              />
            </div>

            {/* Main Content Area - Active Requests Table (11 columns) */}
            <div className="lg:col-span-11">
              <ActiveRequestsTable
                reports={filteredReports}
                departments={departments}
                onUpdate={handleUpdateRequest}
                onDelete={handleDeleteRequest}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
    </>
  );
};

export default ReportRequestManagement;