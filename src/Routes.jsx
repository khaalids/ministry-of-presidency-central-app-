import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DepartmentPerformance from './pages/department-performance';
import DocumentAnalytics from './pages/document-analytics';
import SystemAdministration from './pages/system-administration';
import ExecutiveOverview from './pages/executive-overview';
import TaskManagement from './pages/task-management';
import ReportRequests from './pages/report-requests';
import ReportRequestManagement from './pages/report-request-management';
import NotificationsCenter from './pages/notifications-center';
import UserManagement from './pages/user-management';
import LoginAuthentication from './pages/login-authentication';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/" element={<ExecutiveOverview />} />
        <Route path="/department-performance" element={<DepartmentPerformance />} />
        <Route path="/document-analytics" element={<DocumentAnalytics />} />
        <Route path="/system-administration" element={<SystemAdministration />} />
        <Route path="/executive-overview" element={<ExecutiveOverview />} />
        <Route path="/task-management" element={<TaskManagement />} />
        <Route path="/report-requests" element={<ReportRequests />} />
        <Route path="/report-request-management" element={<ReportRequestManagement />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;