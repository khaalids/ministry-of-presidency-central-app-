import { supabase } from '../lib/supabase';

export const reportService = {
  async getAllReports() {
    const { data, error } = await supabase?.from('task_reports')?.select(`
        *,
        task:tasks(id, title),
        requested_by_profile:user_profiles!task_reports_requested_by_fkey(id, full_name, email),
        submitted_by_profile:user_profiles!task_reports_submitted_by_fkey(id, full_name, email),
        department:departments(id, name)
      `)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      taskId: row?.task_id,
      task: row?.task,
      requestedBy: row?.requested_by,
      requestedByProfile: row?.requested_by_profile,
      submittedBy: row?.submitted_by,
      submittedByProfile: row?.submitted_by_profile,
      departmentId: row?.department_id,
      department: row?.department,
      title: row?.title,
      description: row?.description,
      content: row?.content,
      status: row?.status,
      dueDate: row?.due_date,
      submittedAt: row?.submitted_at,
      reviewedAt: row?.reviewed_at,
      reviewerNotes: row?.reviewer_notes,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    })) || [];
  },

  async createReport(report) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('task_reports')?.insert({
        task_id: report?.taskId || null,
        requested_by: user?.id,
        department_id: report?.departmentId,
        title: report?.title,
        description: report?.description,
        status: 'requested',
        due_date: report?.dueDate || null
      })?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      taskId: data?.task_id,
      requestedBy: data?.requested_by,
      departmentId: data?.department_id,
      title: data?.title,
      description: data?.description,
      status: data?.status,
      dueDate: data?.due_date,
      createdAt: data?.created_at
    };
  },

  async submitReport(reportId, content) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('task_reports')?.update({
        content: content,
        submitted_by: user?.id,
        submitted_at: new Date()?.toISOString(),
        status: 'submitted'
      })?.eq('id', reportId)?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      content: data?.content,
      submittedBy: data?.submitted_by,
      submittedAt: data?.submitted_at,
      status: data?.status
    };
  },

  async reviewReport(reportId, status, reviewerNotes) {
    const { data, error } = await supabase?.from('task_reports')?.update({
        status: status,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date()?.toISOString()
      })?.eq('id', reportId)?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      status: data?.status,
      reviewerNotes: data?.reviewer_notes,
      reviewedAt: data?.reviewed_at
    };
  }
};