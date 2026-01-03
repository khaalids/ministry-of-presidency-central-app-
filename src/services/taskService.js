import { supabase } from '../lib/supabase';

export const taskService = {
  async getAllTasks() {
    const { data, error } = await supabase?.from('tasks')?.select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(id, full_name, email),
        assigned_to_department_info:departments!tasks_assigned_to_department_fkey(id, name),
        assigned_to_user_profile:user_profiles!tasks_assigned_to_user_fkey(id, full_name, email)
      `)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      title: row?.title,
      description: row?.description,
      assignedBy: row?.assigned_by,
      assignedByProfile: row?.assigned_by_profile,
      assignedToDepartment: row?.assigned_to_department,
      assignedToDepartmentInfo: row?.assigned_to_department_info,
      assignedToUser: row?.assigned_to_user,
      assignedToUserProfile: row?.assigned_to_user_profile,
      status: row?.status,
      priority: row?.priority,
      dueDate: row?.due_date,
      completedAt: row?.completed_at,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    })) || [];
  },

  async createTask(task) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('tasks')?.insert({
        title: task?.title,
        description: task?.description,
        assigned_by: user?.id,
        assigned_to_department: task?.assignedToDepartment,
        assigned_to_user: task?.assignedToUser || null,
        status: task?.status || 'pending',
        priority: task?.priority || 'medium',
        due_date: task?.dueDate || null
      })?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      assignedBy: data?.assigned_by,
      assignedToDepartment: data?.assigned_to_department,
      assignedToUser: data?.assigned_to_user,
      status: data?.status,
      priority: data?.priority,
      dueDate: data?.due_date,
      completedAt: data?.completed_at,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  async updateTask(taskId, updates) {
    const updateData = {};
    if (updates?.title !== undefined) updateData.title = updates?.title;
    if (updates?.description !== undefined) updateData.description = updates?.description;
    if (updates?.status !== undefined) updateData.status = updates?.status;
    if (updates?.priority !== undefined) updateData.priority = updates?.priority;
    if (updates?.dueDate !== undefined) updateData.due_date = updates?.dueDate;
    if (updates?.assignedToUser !== undefined) updateData.assigned_to_user = updates?.assignedToUser;
    if (updates?.status === 'completed') updateData.completed_at = new Date()?.toISOString();

    const { data, error } = await supabase?.from('tasks')?.update(updateData)?.eq('id', taskId)?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      status: data?.status,
      priority: data?.priority,
      dueDate: data?.due_date,
      completedAt: data?.completed_at,
      updatedAt: data?.updated_at
    };
  },

  async deleteTask(taskId) {
    const { error } = await supabase?.from('tasks')?.delete()?.eq('id', taskId);

    if (error) throw error;
  }
};