import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { reportService } from '../../services/reportService';
import { departmentService } from '../../services/departmentService';
import ReportCard from './components/ReportCard';
import CreateReportModal from './components/CreateReportModal';
import SubmitReportModal from './components/SubmitReportModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ReportRequests = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitModalReport, setSubmitModalReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleCreateReport = async (reportData) => {
    try {
      await reportService?.createReport(reportData);
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to create report request');
    }
  };

  const handleSubmitReport = async (reportId, content) => {
    try {
      await reportService?.submitReport(reportId, content);
      setSubmitModalReport(null);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to submit report');
    }
  };

  const handleReviewReport = async (reportId, status, notes) => {
    try {
      await reportService?.reviewReport(reportId, status, notes);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to review report');
    }
  };

  const filteredReports = reports?.filter(report => {
    if (filterStatus !== 'all' && report?.status !== filterStatus) return false;
    return true;
  });

  const statusCounts = {
    all: reports?.length || 0,
    requested: reports?.filter(r => r?.status === 'requested')?.length || 0,
    in_progress: reports?.filter(r => r?.status === 'in_progress')?.length || 0,
    submitted: reports?.filter(r => r?.status === 'submitted')?.length || 0,
    approved: reports?.filter(r => r?.status === 'approved')?.length || 0
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Report Requests - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Report Requests
              </h1>
              <p className="text-muted-foreground">
                {isLeadership ? 'Request and review department reports' : 'View and submit requested reports'}
              </p>
            </div>
            {isLeadership && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="FileText"
                iconPosition="left"
                size="lg"
              >
                Request Report
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <button
              onClick={() => setFilterStatus('all')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'all' ?'bg-primary text-primary-foreground border-primary' :'bg-card border-border hover:border-primary'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.all}</div>
              <div className="text-sm mt-1">All Reports</div>
            </button>
            <button
              onClick={() => setFilterStatus('requested')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'requested' ?'bg-warning text-warning-foreground border-warning' :'bg-card border-border hover:border-warning'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.requested}</div>
              <div className="text-sm mt-1">Requested</div>
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'in_progress' ?'bg-accent text-accent-foreground border-accent' :'bg-card border-border hover:border-accent'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.in_progress}</div>
              <div className="text-sm mt-1">In Progress</div>
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'submitted' ?'bg-secondary text-secondary-foreground border-secondary' :'bg-card border-border hover:border-secondary'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.submitted}</div>
              <div className="text-sm mt-1">Submitted</div>
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'approved' ?'bg-success text-success-foreground border-success' :'bg-card border-border hover:border-success'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.approved}</div>
              <div className="text-sm mt-1">Approved</div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No reports found</p>
              </div>
            ) : (
              filteredReports?.map(report => (
                <ReportCard
                  key={report?.id}
                  report={report}
                  onSubmit={() => setSubmitModalReport(report)}
                  onReview={handleReviewReport}
                  isLeadership={isLeadership}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {isCreateModalOpen && (
        <CreateReportModal
          departments={departments}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateReport}
        />
      )}
      {submitModalReport && (
        <SubmitReportModal
          report={submitModalReport}
          onClose={() => setSubmitModalReport(null)}
          onSubmit={handleSubmitReport}
        />
      )}
    </>
  );
};

export default ReportRequests;