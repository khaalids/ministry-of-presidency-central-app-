import { supabase } from '../lib/supabase';

export const notificationService = {
  async getNotifications(userId, userRole, departmentId) {
    // Fetch task assignments
    let tasksQuery = supabase?.from('tasks')?.select(`
        id,
        title,
        description,
        priority,
        status,
        due_date,
        created_at,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(full_name),
        assigned_to_user
      `)?.order('created_at', { ascending: false });

    // Filter based on role
    if (userRole === 'department_user') {
      tasksQuery = tasksQuery?.eq('assigned_to_user', userId);
    }

    const { data: tasks, error: tasksError } = await tasksQuery;
    if (tasksError) throw tasksError;

    // Fetch report requests
    let reportsQuery = supabase?.from('task_reports')?.select(`
        id,
        title,
        description,
        status,
        due_date,
        created_at,
        submitted_at,
        requested_by_profile:user_profiles!task_reports_requested_by_fkey(full_name),
        submitted_by,
        department_id
      `)?.order('created_at', { ascending: false });

    // Filter based on role
    if (userRole === 'department_user') {
      reportsQuery = reportsQuery?.eq('department_id', departmentId);
    }

    const { data: reports, error: reportsError } = await reportsQuery;
    if (reportsError) throw reportsError;

    // Transform tasks to notifications
    const taskNotifications = tasks?.map(task => ({
      id: `task-${task?.id}`,
      type: 'task',
      category: 'assignment',
      title: 'New Task Assignment',
      message: task?.title,
      description: task?.description,
      priority: task?.priority,
      status: task?.status,
      sender: task?.assigned_by_profile?.full_name || 'System',
      timestamp: task?.created_at,
      dueDate: task?.due_date,
      read: task?.status !== 'pending',
      metadata: {
        taskId: task?.id,
        assignedToUser: task?.assigned_to_user
      }
    })) || [];

    // Transform reports to notifications
    const reportNotifications = reports?.map(report => {
      const isSubmission = report?.submitted_at && report?.status === 'submitted';
      return {
        id: `report-${report?.id}`,
        type: 'report',
        category: isSubmission ? 'submission' : 'request',
        title: isSubmission ? 'Report Submitted' : 'Report Request',
        message: report?.title,
        description: report?.description,
        priority: report?.due_date ? this.calculatePriorityFromDueDate(report?.due_date) : 'medium',
        status: report?.status,
        sender: report?.requested_by_profile?.full_name || 'System',
        timestamp: isSubmission ? report?.submitted_at : report?.created_at,
        dueDate: report?.due_date,
        read: report?.status !== 'requested',
        metadata: {
          reportId: report?.id,
          submittedBy: report?.submitted_by,
          departmentId: report?.department_id
        }
      };
    }) || [];

    // Combine and sort by timestamp
    const allNotifications = [...taskNotifications, ...reportNotifications]?.sort(
      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
    );

    return allNotifications;
  },

  calculatePriorityFromDueDate(dueDate) {
    if (!dueDate) return 'medium';
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'urgent';
    if (daysUntilDue <= 2) return 'high';
    if (daysUntilDue <= 7) return 'medium';
    return 'low';
  },

  async markAsRead(notificationId) {
    // This would update a notifications table if we had one
    // For now, we'll rely on task/report status changes
    return { success: true };
  },

  async markAllAsRead(userId) {
    // This would update all notifications for a user
    return { success: true };
  }
};
